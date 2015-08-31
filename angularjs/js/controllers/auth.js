(function() {
  var app;

  app = MetronicApp;

  MetronicApp.controller('AuthController', [
    '$http', '$scope', '$rootScope', '$state', 'store', function($http, $scope, $rootScope, $state, store) {
      $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents();
      });
      $scope.user = {
        username: 'gbenussi',
        password: 'starcraft'
      };
      $scope.login = function() {
        $http({
          url: server_url + '/sessions/create',
          method: 'POST',
          data: $scope.user
        }).then(function(response) {
          store.set('jwt', response.data.id_token);
          return $state.go('admin.users.list');
        }, function(error) {
          return alert(error.data);
        });
        $state.go('admin.users.list');
      };
    }
  ]);

}).call(this);
