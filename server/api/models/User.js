/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
      size: 64,
    },
    password: {
      type: 'string',
      required: true,
	  size: 60,
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  // Lifecycle Callbacks
  beforeUpdate: function(values, cb) {
    if (values.password) {
      var bcrypt = require('bcrypt');
      var salt_cost = 10;
      var salt = bcrypt.genSaltSync(salt_cost);
      var hash = bcrypt.hashSync(values.password, salt);
      values.password = hash;
      values.salt = salt;
      values.salt_cost = salt_cost;
      values.updateMyPass = 'Si :-)';
      cb();
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, cb) {
    var bcrypt = require('bcrypt');
    var salt_cost = 10;
    var salt = bcrypt.genSaltSync(salt_cost);
    console.log(values)
    var hash = bcrypt.hashSync(values.password, salt);
    values.password = hash;
    values.salt = salt;
    values.salt_cost = salt_cost;
    console.log("creando")
    console.log(values)
    cb();
  }
};
