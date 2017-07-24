(function() {
	angular
		.module("WebAppMaker")
		.controller("ProfileController", ProfileController)

	function ProfileController($routeParams, $timeout, $location, UserService, loggedin) {
		var vm = this;
		vm.uid = loggedin._id;
		vm.user = loggedin;

		vm.updateUser = updateUser;
		vm.deleteUser = deleteUser;
		vm.logout = logout;

		function deleteUser(user) {
			UserService
				.deleteUser(user._id)
				.then(function () {
					$location.url('/login');
				}, function () {
					vm.error = "Unable to remove this user.";
					$timeout(function () {
						vm.error = null;
					}, 3000);
				});
		}

		function updateUser(user) {
			UserService
				.updateUser(user._id, user)
				.then(function () {
					vm.updated = "Profile changes saved!";
					$timeout(function () {
						vm.updated = null;
					}, 3000);
				});
		}

		function logout() {
			UserService
				.logout()
				.then(function () {
					$location.url('/login');
				})
		}

		function userError(error) {
			vm.error = "User not found";
		}
	}
})();