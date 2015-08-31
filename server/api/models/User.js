/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {},

	// Lifecycle Callbacks
	beforeCreate: function(values, cb) {
        if(!values.password) {
            cb("No password supplied");
        }
		var bcrypt = require('bcrypt');
		var salt_cost = 10;
		var salt = bcrypt.genSaltSync(salt_cost);
		if(values.password) {
			var hash = bcrypt.hashSync(values.password, salt);
			values.password = hash;
			values.salt = salt;
			values.salt_cost = salt_cost;
			cb();
		}
	}
};
