(function () {
	angular
		.module("WebAppMaker")
		.controller("AdminController", AdminController);

	function AdminController(UserService, $timeout, $window, admin) {
		var vm = this;
		vm.deleteUser = deleteUser;

		UserService
			.findAllUsers()
			.then(function (users) {
				vm.users = users;
			});

		function deleteUser(user) {
			if (user._id === admin._id) {
				vm.error = "One does not delete oneself";
				$timeout(function () {
					vm.updated = null;
				}, 3000);
			} else {
				UserService
					.deleteUser(user._id)
					.then(function () {
						$window.location.reload();
					}, function () {
						vm.error = "Error removing user";
						$timeout(function () {
							vm.error = null;
						}, 3000);
					});
			}
		}
	}
})();