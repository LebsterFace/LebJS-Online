// Express HTTPS Server
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const kill = require("tree-kill");
const config = require("./config.json");
const { spawn } = require("child_process");

const app = express();

const createHTTPS = () =>
	https.createServer({
		key: fs.readFileSync(config.certs.key, "utf8"),
		cert: fs.readFileSync(config.certs.cert, "utf8")
	}, app);


app.use(express.static(path.join(__dirname, "public")));

const server = config.https ? createHTTPS() : app;
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {
	try {
		const child = spawn("java", [
			"-Xmx50m", "-jar", config.lebjs,
			"--AST", "--hide", "--prompt"
		]);

		ws.on("close", () => kill(child.pid));

		child.stdout.on("data", data => ws.send(data.toString()));
		child.stderr.on("data", data => ws.send(data.toString()));

		child.on("close", () => { ws.close(1000, "Proccess terminated."); });

		child.on("error", err => {
			ws.close(1000, "Proccess closed due to error.");
			console.error(err);
		});

		ws.on("message", message => {
			const input = message.toString();
			if (input === ".exit\n") return kill(child.pid);
			child.stdin.write(input);
		});
	} catch (err) {
		try {
			ws.close();
		} catch (err) {
			console.error("Failed to close websocket", err);
		}
		console.error(err);
	}
});

server.listen(config.port, () => {
	console.log("Listening on port " + config.port);
});