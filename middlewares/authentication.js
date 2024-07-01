const {
	validateToken,
} = require('../utils/auth');

function checkAuthCookie(cookieName) {
	return (req, res, next) => {
		const tokenCookieValue =
			req.cookies[cookieName];

		if (!tokenCookieValue) {
			return next();
		}

		try {
			const userPayload = validateToken(
				tokenCookieValue
			);
			req.user = userPayload;
		} catch (err) {
			console.error(err);
		}
		return next();
	};
}

function ensureAuthenticated(req, res, next) {
	if (req.user) {
		return next();
	}
	return res.status(401).send('Unauthorized');
}

module.exports = {
	checkAuthCookie,
	ensureAuthenticated,
};
