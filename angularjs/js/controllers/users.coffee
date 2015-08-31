app = MetronicApp

# app.factory('User', ($resource) ->
#   return $resource('http://localhost:1337/user/:id', { id: '@id'}, {
# 	  update: {
# 		  method: 'PUT'
# 	  }
#   });
# ).
app.controller('UsersController', ($scope, $state, Restangular) ->
	$scope.users = []
	Restangular.all('user').getList().then((users) ->
		$scope.users = users;
	)
	$scope.editUser = (user) ->
		$state.go('admin.users.edit', { user: user})

	$scope.deleteUser = (user, index) ->
		user.delete.then( () ->
			$scope.users.splice(index, 1)
		)
	# $scope.users = User.query(() ->
	#
	# );
	# 	$scope.users[i].name.username = $scope.users[i].name.first.toLowerCase().substr(0,1) + $scope.users[i].name.last.toLowerCase()
).controller('UsersNewController', ($scope, $state, Restangular)->
	$scope.form_user = {}
	$scope.saveUser = () ->
		Restangular.all('user').post($scope.form_user).then( () ->
			$state.go('admin.users.list');
		)
)

app.controller('UsersEditController', ($scope, $state, $stateParams, Restangular) ->
	Restangular.one('user', $stateParams.id).get().then( (user) ->
		$scope.form_user = user;
	);
	# $scope.form_user = User.get({ id: $stateParams.id })

	$scope.saveUser = () ->
		$scope.form_user.save().then( () ->
			$state.go('admin.users.list');
		)
	# $state.go('usersEdit', {id: 1})
)

app.run((Restangular) ->
	Restangular.setBaseUrl('http://localhost:1337/');
)
