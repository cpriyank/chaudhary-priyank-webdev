(function() {
	angular
		.module("WebAppMaker")
		.controller("AdminUserController", AdminUserController);


	function AdminUserController(UserService) {
		var vm = this;
		vm.deleteUser = deleteUser;
		vm.createUser = createUser;
		vm.selectUser = selectUser;
		vm.updateUser = updateUser;

		init();

		function init() {
			findAllUsers();
		}

		function createUser(user) {
			UserService
				.createUser(user)
				.then(findAllUsers());
		}

		function selectUser(user) {
			vm.user = angular.copy(user);
		}

		function updateUser(user) {
			UserService
				.updateUser(user._id, user)
				.then(findAllUsers());
		}

		function deleteUser(user) {
			UserService
				.deleteUser(user._id)
				.then(findAllUsers());
		}

		function findAllUsers() {
			UserService
				.findAllUsers()
				.then(function (users) {
					vm.users = users;
				});
		}
	}

})();
