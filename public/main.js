const ANSI = {
	"\x1b[30m": "#000000",
	"\x1b[31m": "#CD0000",
	"\x1b[32m": "#00CD00",
	"\x1b[33m": "#CDCD00",
	"\x1b[34m": "#0000EE",
	"\x1b[35m": "#CD00CD",
	"\x1b[36m": "#00CDCD",
	"\x1b[37m": "#FFFFFF",
	"\x1b[0m": "inherit",
	"\x1b[30;1m": "#7F7F7F",
	"\x1b[31;1m": "#FF0000",
	"\x1b[32;1m": "#00FF00",
	"\x1b[33;1m": "#FFFF00",
	"\x1b[34;1m": "#5C5CFF",
	"\x1b[35;1m": "#FF00FF",
	"\x1b[36;1m": "#00FFFF",
	"\x1b[37;1m": "#FFFFFF"
};

/** @type {HTMLTextAreaElement} */
// @ts-ignore
const inputElement = document.getElementById("input"),
	terminalElement = document.getElementById("terminal");

let currentColor = "inherit";
const stdoutToHTML = stdout => {
	const regex = new RegExp("\x1b\\[.+?m$", "");
	let temp = "";

	const span = txt => {
		const result = document.createElement("span");
		result.style.color = currentColor;
		result.textContent = txt;
		return result;
	};

	for (let i = 0; i < stdout.length; i++) {
		const char = stdout[i];
		if (char === "\r") continue;
		else if (char === "\n") {
			terminalElement.appendChild(span(temp));
			terminalElement.appendChild(document.createElement("br"));
			temp = "";
		} else {
			temp += char;
			if (regex.test(temp)) {
				const match = temp.match(regex)[0],
					pure = temp.replace(regex, "");
				terminalElement.appendChild(span(pure));
				currentColor = ANSI[match];
				temp = "";
			}
		}
	}

	terminalElement.appendChild(span(temp));
};

const REPL = new WebSocket("ws://localhost:1234");
const scrollToBottom = () => window.scrollTo(0, document.body.scrollHeight);

REPL.onmessage = ({data}) => {
	inputElement.disabled = false;
	inputElement.focus();

	stdoutToHTML(data);
	scrollToBottom();
};

REPL.onerror = err => {
	console.error(err);
	terminalElement.textContent = "WebSocket Error:\n" + err;
	scrollToBottom();
};

const exec = code => {
	const prefix = document.createElement("span");
	prefix.className = "prefix sent";
	prefix.textContent = "> ";
	terminalElement.appendChild(prefix);
	terminalElement.appendChild(document.createTextNode(code + "\n"));
	scrollToBottom();

	REPL.send(code);
};

inputElement.addEventListener("keydown", async e => {
	if (e.key === "Enter") {
		e.preventDefault();
		const input = inputElement.value;
		inputElement.value = "";
		exec(input);
	}
});

window.addEventListener("keydown", e => {
	inputElement.focus();
});