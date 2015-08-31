/**
 * SessionsController
 *
 * @description :: Server-side logic for managing Sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var createToken = function(context) {
	var jwt = require('jsonwebtoken');
	var auth_config = sails.config.auth_config;

	return jwt.sign({ context: context }, auth_config.secret, {
		expiresInMinutes: 60 * 5
	});
}

module.exports = {
	create: function(req, res) {
		var jwt = require('jsonwebtoken');
		var username = req.param("username");
		var password = req.param("password");
		if (!username || !password) {
			return res.status(400).send("You must send the username and the password");
		}


		console.log("user")
		console.log(username)
		user = User.findOne({
			"username": username
		}).exec(function(err, database_user) {

			if (err) {
				return res.status(401).send("Something went wrong :(");
			}

			if (!database_user) {
				return res.status(401).send("The username or password don't match");
			}

			var bcrypt = require('bcrypt');
			var hash = bcrypt.hashSync(password, database_user['salt']);

			if (database_user['password'] !== hash) {
				return res.status(401).send("The username or password don't match");
			}

			res.status(201).send({
				id_token: createToken({
					userId: database_user.id,
					userName: database_user.username,
					displayName: database_user.firstName + ' ' + database_user.lastName,
				})
			});
		});
	}
};
