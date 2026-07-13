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

/** @type {HTMLInputElement} */
// @ts-ignore
const customFontInput = document.getElementById("custom");

/** @type {HTMLLabelElement} */
// @ts-ignore
const customFontLabel = document.getElementById("custom-label");

const savedFont = localStorage.getItem("font");
if (savedFont && Array.from(fontDropdown.options).some(option => option.value === savedFont))
	fontDropdown.value = savedFont;

customFontInput.value = localStorage.getItem("customFont") ?? "";

const updateFont = () => {
	const isCustom = fontDropdown.value === "Custom";
	const customFont = customFontInput.value.trim();

	customFontLabel.hidden = !isCustom;
	customFontInput.hidden = !isCustom;
	customFontInput.disabled = !isCustom;

	localStorage.setItem("font", fontDropdown.value);
	localStorage.setItem("customFont", customFontInput.value);

	const fontFamily = isCustom
		? customFont || "monospace"
		: `"${fontDropdown.value.replaceAll('"', '\\"')}", monospace`;

	root.style.setProperty("--font-family", fontFamily);
};

updateFont();
fontDropdown.addEventListener("change", () => {
	updateFont();
	if (fontDropdown.value === "Custom") {
		customFontInput.focus();
	}
});
customFontInput.addEventListener("input", updateFont);

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
let isBold = false;
const stdoutToHTML = stdout => {
	console.log(stdout.replaceAll("\x1b", "ESC"));
	const regex = new RegExp("\x1b\\[.+?m$", "");
	let temp = "";

	const span = (/** @type {string} */ txt) => {
		const result = document.createElement("span");
		result.style.color = `var(--${currentColor})`;
		result.style.fontWeight = isBold ? "bold" : "inherit";
		result.style.textDecoration = isBold ? "underline" : "inherit";
		result.style.fontStyle = isBold ? "italic" : "inherit";
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
			} else if (temp === '\x1B[1m') {
				// Set bold
				temp = "";
				isBold = true;
				continue;
			}

			const match = temp.match(regex);
			if (match !== null) {
				const pure = temp.replace(regex, "");
				terminalElement.appendChild(span(pure));
				if (match[0] in CSS_VARIABLE_NAMES) {
					currentColor = CSS_VARIABLE_NAMES[match[0]];
					if (currentColor === "RESET") isBold = false;
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
