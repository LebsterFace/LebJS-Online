const RESET = "\x1b[0m";

const BLACK = "\x1b[30m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";
const WHITE = "\x1b[37m";

const BRIGHT_BLACK = "\x1b[90m";
const BRIGHT_RED = "\x1b[91m";
const BRIGHT_GREEN = "\x1b[92m";
const BRIGHT_YELLOW = "\x1b[93m";
const BRIGHT_BLUE = "\x1b[94m";
const BRIGHT_MAGENTA = "\x1b[95m";
const BRIGHT_CYAN = "\x1b[96m";
const BRIGHT_WHITE = "\x1b[97m";

//#region Unused
// const BACKGROUND_BLACK = "\x1b[40m";
// const BACKGROUND_RED = "\x1b[41m";
// const BACKGROUND_GREEN = "\x1b[42m";
// const BACKGROUND_YELLOW = "\x1b[43m";
// const BACKGROUND_BLUE = "\x1b[44m";
// const BACKGROUND_MAGENTA = "\x1b[45m";
// const BACKGROUND_CYAN = "\x1b[46m";
// const BACKGROUND_WHITE = "\x1b[47m";

// const BACKGROUND_BRIGHT_BLACK = "\x1b[100m";
// const BACKGROUND_BRIGHT_RED = "\x1b[101m";
// const BACKGROUND_BRIGHT_GREEN = "\x1b[102m";
// const BACKGROUND_BRIGHT_YELLOW = "\x1b[103m";
// const BACKGROUND_BRIGHT_BLUE = "\x1b[104m";
// const BACKGROUND_BRIGHT_MAGENTA = "\x1b[105m";
// const BACKGROUND_BRIGHT_CYAN = "\x1b[106m";
// const BACKGROUND_BRIGHT_WHITE = "\x1b[107m";

// const BOLD = "\x1b[1m";
// const UNDERLINE = "\x1b[4m";
// const REVERSED = "\x1b[7m";

// 	"\x1b[40m"
// 	"\x1b[41m"
// 	"\x1b[42m"
// 	"\x1b[43m"
// 	"\x1b[44m"
// 	"\x1b[45m"
// 	"\x1b[46m"
// 	"\x1b[47m"
// 	"\x1b[100m"
// 	"\x1b[101m"
// 	"\x1b[102m"
// 	"\x1b[103m"
// 	"\x1b[104m"
// 	"\x1b[105m"
// 	"\x1b[106m"
// 	"\x1b[107m"
// 	"\x1b[1m"
// 	"\x1b[4m"
// 	"\x1b[7m"
//#endregion

const CSS_VARIABLE_NAMES = {
	[RESET]: "RESET",
	[BLACK]: "BLACK",
	[RED]: "RED",
	[GREEN]: "GREEN",
	[YELLOW]: "YELLOW",
	[BLUE]: "BLUE",
	[MAGENTA]: "MAGENTA",
	[CYAN]: "CYAN",
	[WHITE]: "WHITE",
	[BRIGHT_BLACK]: "BRIGHT_BLACK",
	[BRIGHT_RED]: "BRIGHT_RED",
	[BRIGHT_GREEN]: "BRIGHT_GREEN",
	[BRIGHT_YELLOW]: "BRIGHT_YELLOW",
	[BRIGHT_BLUE]: "BRIGHT_BLUE",
	[BRIGHT_MAGENTA]: "BRIGHT_MAGENTA",
	[BRIGHT_CYAN]: "BRIGHT_CYAN",
	[BRIGHT_WHITE]: "BRIGHT_WHITE",
};

const COLOR_SCHEMES = {
	ORIGINAL: {
		BACKGROUND: "#202124",
		RESET: "#D9D9D9",
		BLACK: "#000000",
		RED: "#CD0000",
		GREEN: "#00CD00",
		YELLOW: "#CDCD00",
		BLUE: "#0000EE",
		MAGENTA: "#CD00CD",
		CYAN: "#00CDCD",
		WHITE: "#FFFFFF",
		BRIGHT_BLACK: "#7F7F7F",
		BRIGHT_RED: "#FF0000",
		BRIGHT_GREEN: "#00FF00",
		BRIGHT_YELLOW: "#FFFF00",
		BRIGHT_BLUE: "#5C5CFF",
		BRIGHT_MAGENTA: "#FF00FF",
		BRIGHT_CYAN: "#00FFFF",
		BRIGHT_WHITE: "#FFFFFF"
	},

	VGA: {
		BACKGROUND: "#000000",
		RESET: "#ffffff",
		BLACK: "#000000",
		RED: "#800000",
		GREEN: "#008000",
		YELLOW: "#808000",
		BLUE: "#000080",
		MAGENTA: "#800080",
		CYAN: "#008080",
		WHITE: "#c0c0c0",
		BRIGHT_BLACK: "#808080",
		BRIGHT_RED: "#ff0000",
		BRIGHT_GREEN: "#00ff00",
		BRIGHT_YELLOW: "#ffff00",
		BRIGHT_BLUE: "#0000ff",
		BRIGHT_MAGENTA: "#ff00ff",
		BRIGHT_CYAN: "#00ffff",
		BRIGHT_WHITE: "#ffffff",
	},

	UBUNTU: {
		BACKGROUND: "rgb(48, 10, 36)",
		RESET: "#eeeeec",
		BLACK: "#2e3436",
		RED: "#3465a4",
		GREEN: "#4e9a06",
		YELLOW: "#06989a",
		BLUE: "#cc0000",
		MAGENTA: "#75507b",
		CYAN: "#c4a000",
		WHITE: "#d3d7cf",
		BRIGHT_BLACK: "#555753",
		BRIGHT_RED: "#729fcf",
		BRIGHT_GREEN: "#8ae234",
		BRIGHT_YELLOW: "#34e2e2",
		BRIGHT_BLUE: "#ef2929",
		BRIGHT_MAGENTA: "#ad7fa8",
		BRIGHT_CYAN: "#fce94f",
		BRIGHT_WHITE: "#eeeeec",
	},

	DRACULA: {
		BACKGROUND: "#282a36",
		RESET: "#F8F8F2",
		BLACK: "#21222C",
		RED: "#FF5555",
		GREEN: "#50FA7B",
		YELLOW: "#F1FA8C",
		BLUE: "#BD93F9",
		MAGENTA: "#FF79C6",
		CYAN: "#8BE9FD",
		WHITE: "#F8F8F2",
		BRIGHT_BLACK: "#6272A4",
		BRIGHT_RED: "#FF6E6E",
		BRIGHT_GREEN: "#69FF94",
		BRIGHT_YELLOW: "#FFFFA5",
		BRIGHT_BLUE: "#D6ACFF",
		BRIGHT_MAGENTA: "#FF92DF",
		BRIGHT_CYAN: "#A4FFFF",
		BRIGHT_WHITE: "#FFFFFF",
	},

	ONEHALFDARK: {
		BACKGROUND: "#282C34",
		RESET: "#DCDFE4",
		BLACK: "#282C34",
		BLUE: "#61AFEF",
		BRIGHT_BLACK: "#5A6374",
		BRIGHT_BLUE: "#61AFEF",
		BRIGHT_CYAN: "#56B6C2",
		BRIGHT_GREEN: "#98C379",
		BRIGHT_MAGENTA: "#C678DD",
		BRIGHT_RED: "#E06C75",
		BRIGHT_WHITE: "#DCDFE4",
		BRIGHT_YELLOW: "#E5C07B",
		CYAN: "#56B6C2",
		GREEN: "#98C379",
		MAGENTA: "#C678DD",
		RED: "#E06C75",
		WHITE: "#DCDFE4",
		YELLOW: "#E5C07B"
	}
};
