app = MetronicApp

MetronicApp.controller 'AuthController', ['$http', '$scope', '$rootScope', '$state', 'store'
	($http, $scope, $rootScope, $state, store) ->

		# $state.go('admin.users.list') if store.get('jwt')

		$scope.$on('$viewContentLoaded', () ->
			Metronic.initComponents();
			return
		);

		$scope.user = {
			username: 'gbenussi',
			password: 'starcraft'
		}

		$scope.login = () ->
			$http({
				url: server_url + '/sessions/create',
				method: 'POST',
				data: $scope.user
				}).then((response) ->
					store.set('jwt', response.data.id_token);
					$state.go('admin.users.list');
				, (error) ->
					alert(error.data);
				);
			$state.go 'admin.users.list'
			return
		return

]
