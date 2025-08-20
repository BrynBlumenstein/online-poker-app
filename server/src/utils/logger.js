const RED = 31;
const GREEN = 32;
const BLUE = 34;

const levels = {
	error: RED,
	info: GREEN,
	debug: BLUE
};

const log = (level, ...params) => {
	if (process.env.NODE_ENV !== 'test') {
		const color = levels[level];
		const prefix = color
			? `\x1b[${color}m[${level.toUpperCase()}]\x1b[0m`
			: `[${level.toUpperCase()}]`;

		switch (level) {
			case 'error':
				console.error(prefix, ...params);
				break;
			default:
				console.log(prefix, ...params);
		}
	}
};

module.exports = {
	info: (...params) => log('info', ...params),
	error: (...params) => log('error', ...params),
	debug: (...params) => {
		if (process.env.NODE_ENV === 'development') {
			log('debug', ...params);
		}
	}
};
