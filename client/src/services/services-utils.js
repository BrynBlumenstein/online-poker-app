export const throwError = (err, fallback) => {
	const message = err.response?.data?.error || fallback;
	throw new Error(message);
};
