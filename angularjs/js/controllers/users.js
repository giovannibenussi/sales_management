(function() {
  var app;

  app = MetronicApp;

  app.controller('UsersController', function($scope, $state, Restangular) {
    $scope.users = [];
    Restangular.all('user').getList().then(function(users) {
      return $scope.users = users;
    });
    $scope.editUser = function(user) {
      return $state.go('admin.users.edit', {
        user: user
      });
    };
    return $scope.deleteUser = function(user, index) {
      return user["delete"].then(function() {
        return $scope.users.splice(index, 1);
      });
    };
  }).controller('UsersNewController', function($scope, $state, Restangular) {
    $scope.form_user = {};
    return $scope.saveUser = function() {
      console.log("Creando...");
      Restangular.all('user').post($scope.form_user).then(function() {
        console.log("Creado");
      }, function(error) {
        console.log("error");
        if (error.data && error.data.error === "E_VALIDATION" && error.data.invalidAttributes) {
          _.forEach(error.data.invalidAttributes, function(value, index) {
            return console.log(i);
          });
        }
      });
    };
  });

  app.controller('UsersEditController', function($scope, $state, $stateParams, Restangular) {
    Restangular.one('user', $stateParams.id).get().then(function(user) {
      return $scope.form_user = user;
    });
    return $scope.saveUser = function() {
      return $scope.form_user.save().then(function() {
        return $state.go('admin.users.list');
      });
    };
  });

}).call(this);
