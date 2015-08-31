(function() {
  var app;

  app = MetronicApp;

  MetronicApp.controller('IndexController', [
    '$http', 'store', '$scope', '$rootScope', '$state', function($http, store, $scope, $rootScope, $state) {
      $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter();
      });
      $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents();
      });
      $scope.user = {
        username: '',
        password: ''
      };
      $scope.logout = function() {
        store.remove('jwt');
        $state.go('login');
      };
    }
  ]);

}).call(this);
