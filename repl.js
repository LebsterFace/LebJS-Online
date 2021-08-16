const {Server} = require("ws");
const {spawn} = require("child_process");
const wss = new Server({port: 1234});

const config = require("./config.json");

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
