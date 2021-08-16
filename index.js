const express = require("express"),
	https = require("https"),
	fs = require("fs");

const app = express(),
	port = 8080;

app.use(express.static("public"));

const createHTTPS = () =>
	https.createServer({
		key: fs.readFileSync(config.certs.key, "utf8"),
		cert: fs.readFileSync(config.certs.cert, "utf8")
	}, app);

const config = require("./config.json");
const server = config.https ? createHTTPS() : app;

server
	.listen(port)
	.once("listening", () => {
		console.log("Running on port " + port);
	})
	.on("error", e => {
		console.error(e);
	});


const {Server} = require("ws");
const {spawn} = require("child_process");
const wss = new Server({port: 1234});

const spawnLebJS = () => spawn(config.java, [
	"-Dfile.encoding=UTF-8",
	"-classpath", config.classpath,
	"xyz.lebster.Main",
	"-ast", "-prompt", "-hide", "-expect"
]);

wss.on("connection", ws => {
	const child = spawnLebJS();

	child.on('close', () => ws.close());
	child.on('error', () => ws.close());

	child.stdout.on("data", function(data) {
		ws.send(data.toString().replace(/\r/g, ""));
	});

	ws.on("message", m => {
		child.stdin.write(m.toString() + "\r\n");
	});
});
