app = MetronicApp

MetronicApp.controller 'IndexController', ['$http', 'store', '$scope', '$rootScope', '$state',
	($http, store, $scope, $rootScope, $state) ->
		$scope.$on('$includeContentLoaded', () ->
			Layout.initFooter();
			return
		);
		$scope.$on('$viewContentLoaded', () ->
			Metronic.initComponents();
			return
		);

		$scope.user = {
			username: '',
			password: ''
		}
		$scope.logout = () ->
			store.remove('jwt')
			# $localStorage.reset()
			$state.go('login');
			return
		return

]
