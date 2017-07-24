(function() {
	angular
		.module("WebAppMaker")
		.controller("LoginController", LoginController)

	function LoginController($location, UserService, $timeout) {
		var vm = this;
		vm.login = login;

		function login(username, password) {
			if (!username) {
				vm.error = "Please enter your username";
				return;
			}
			if (!password) {
				vm.error = "Please enter your password";
				return;
			}

			UserService
				.login(username, password)
				.then(function (user) {
					$location.url("/profile");
				}, function (error) {
					vm.error = "Username and password don't match!";
					$timeout(function() {
						vm.error = null;
					}, 5000);
				});
		}
	}
})();
