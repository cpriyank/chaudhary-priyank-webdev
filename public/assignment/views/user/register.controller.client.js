(function() {
	angular
		.module("WebAppMaker")
		.controller("RegisterController", RegisterController)

	function RegisterController($location, UserService) {
		var vm = this;
		vm.register = register;

		function register(username, password, vpassword) {
			if (!username || !password) {
				vm.error = "Username and passwords cannot be empty.";
				return;
			}
			if (password !== vpassword) {
				vm.error = "Passwords don't match.";
				return;
			}

			UserService
				.findUserByUsername(username)
				.then(function (user) {
					vm.error = "Username already exists";
				}, function (error) {
					var newUser = {
						username: username,
						password: password
					};

					return UserService
						.register(newUser)
						.then(function () {
							$location.url("/profile");
						});
				});
		}
	}
})();
