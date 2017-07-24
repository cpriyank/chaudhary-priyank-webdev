(function() {
	angular
		.module("WebAppMaker")
		.controller("RegisterController", RegisterController)

	function RegisterController(UserService, $location, $timeout) {
		var vm = this;
		vm.register = register;

		function register(username, password, vpassword) {
			if (username === undefined || username === null || username === ""
				|| password === undefined || password === "") {
				vm.error = "Username and Passwords can't be empty.";
				return;
			}
			if (password !== vpassword) {
				vm.error = "Password doesn't match.";
				return;
			}
			UserService
				.findUserByUsername(username)
				.then(
					function (user) {
						if (user !== null) {
							vm.error = "Username already exists.";
							$timeout(function () {
								vm.error = null;
							}, 3000);
							return;
						} else {
							var user = {
								username: username,
								password: password,
								firstName: "",
								lastName: "",
								email: ""
							};
							return UserService
								.register(user);
						}
					})
				.then(
					function () {
						$location.url("/profile");
					});
		}
	}
})();