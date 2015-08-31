/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
function getToken(req) {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1];
	} else if (req.query && req.query.token) {
		return req.query.token;
	}
	return null;
}

module.exports = function jwt(req, res, next) {
	var jwt = require('jsonwebtoken');
    var params_jwt =  getToken(req);
	if (params_jwt) {
		var auth_config = sails.config.auth_config;
		console.log("Config: " + auth_config)
		console.log("JWT: " + params_jwt)
		jwt.verify(params_jwt, auth_config.secret, function(err, decoded_token) {
			if (err) {
				console.log("Error")
					// return res.json({
					// 	success: false,
					// 	message: 'Failed to authenticate token',
					// });
				// return res.json({
				// 	success: false,
				// 	error_code: 'JWT_INVALID',
				// 	message: 'Invalid Token',
				// })
				return res.json(401, { error: 'Invalid Token'} )
				// return res.forbidden('You are not permitted to perform this action.')
			} else {
				console.log("good")
				req.decoded = decoded_token;
				return next();
			}
		});
	} else {
		// return res.json({
		// 	success: false,
		// 	error_code: 'JWT_NOT_SUPPLIED',
		// 	message: 'JWT Not Supplied',
		// });
		return res.json(401, { error: 'Unauthenticated Request'})
		// return res.forbidden('You are not permitted to perform this action.')
	}

	// User is nt allowed
	// (default res.forbidden() behavior can be overridden in `config/403.js`)
	// return res.forbidden('You are not permitted to perform this action.');
};
