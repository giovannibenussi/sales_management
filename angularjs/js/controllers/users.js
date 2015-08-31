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
      return Restangular.all('user').post($scope.form_user).then(function() {
        return $state.go('admin.users.list');
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

  app.run(function(Restangular) {
    return Restangular.setBaseUrl('http://localhost:1337/');
  });

}).call(this);
