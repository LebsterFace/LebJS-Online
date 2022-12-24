// @ts-check
"use strict";

/** @type {HTMLTextAreaElement} */
// @ts-ignore
const inputElement = document.getElementById("input");

/** @type {HTMLDivElement} */
// @ts-ignore
const terminalElement = document.getElementById("terminal");

/** @type {HTMLDivElement} */
// @ts-ignore
const promptElement = document.getElementById("prompt");

/** @type {HTMLSelectElement} */
// @ts-ignore
const themeDropdown = document.getElementById("theme");
if (localStorage.getItem("theme"))
	// @ts-ignore
	themeDropdown.value = localStorage.getItem("theme");

const root = document.documentElement;
const updateTheme = () => {
	localStorage.setItem("theme", themeDropdown.value);
	for (const [variable, color] of Object.entries(COLOR_SCHEMES[themeDropdown.value])) {
		root.style.setProperty(`--${variable}`, color);
	}
};

updateTheme();
themeDropdown.addEventListener("input", updateTheme);

/** @type {HTMLSelectElement} */
// @ts-ignore
const fontDropdown = document.getElementById("font");
if (localStorage.getItem("font"))
	// @ts-ignore
	fontDropdown.value = localStorage.getItem("font");

const updateFont = () => {
	localStorage.setItem("font", fontDropdown.value);
	root.style.setProperty(`--font-family`, fontDropdown.value);
};

updateFont();
fontDropdown.addEventListener("input", updateFont);

/** @type {HTMLInputElement} */
// @ts-ignore
const sizeInput = document.getElementById("size");
if (localStorage.getItem("size"))
	// @ts-ignore
	sizeInput.value = Number(localStorage.getItem("size"));

const updateSize = () => {
	localStorage.setItem("size", sizeInput.value);
	root.style.setProperty(`--font-size`, sizeInput.value + "px");
};

updateSize();
sizeInput.addEventListener("input", updateSize);

let currentColor = "inherit";
const stdoutToHTML = stdout => {
	const regex = new RegExp("\x1b\\[.+?m$", "");
	let temp = "";

	const span = (/** @type {string} */ txt) => {
		const result = document.createElement("span");
		result.style.color = `var(--${currentColor})`;
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

			if (temp === '\x1B[H\x1B[2J') {
				// Clear screen
				temp = "";
				terminalElement.replaceChildren();
				continue;
			}

			const match = temp.match(regex);
			if (match !== null) {
				const pure = temp.replace(regex, "");
				terminalElement.appendChild(span(pure));
				if (match[0] in CSS_VARIABLE_NAMES) {
					currentColor = CSS_VARIABLE_NAMES[match[0]];
				} else {
					console.warn(`Unsupported escape code:`, JSON.stringify(match[0]));
				}

				temp = "";
			}
		}
	}

	terminalElement.appendChild(span(temp));
};

const socket = new WebSocket("ws://localhost:8080/" + location.search.toLowerCase());
const scrollToBottom = () => window.scrollTo(0, document.body.scrollHeight);

socket.addEventListener("message", ({ data }) => {
	inputElement.disabled = false;
	inputElement.focus();

	stdoutToHTML(data);
	scrollToBottom();
});

socket.addEventListener("error", err => {
	console.error(err);
	terminalElement.append("\nWebSocket Error:\n" + err.toString() + "\n");
	promptElement.remove();
	scrollToBottom();
});

socket.addEventListener("close", (ev) => {
	terminalElement.append("\n" + ev.reason);
	promptElement.remove();
	scrollToBottom();
});

const exec = code => {
	const prefix = document.createElement("span");
	prefix.className = "prefix sent";
	prefix.textContent = "> ";
	terminalElement.appendChild(prefix);
	terminalElement.appendChild(document.createTextNode(code + "\n"));
	scrollToBottom();

	socket.send(code + "\n");
};

inputElement.addEventListener("keydown", async e => {
	if (e.key === "Enter") {
		e.preventDefault();
		const input = inputElement.value;
		inputElement.value = "";
		exec(input);
	}
});

inputElement.focus();
