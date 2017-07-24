(function() {
	angular
		.module("WebAppMaker")
		.controller("LoginController", LoginController)
		.controller("RegisterController", RegisterController)
		.controller("ProfileController", ProfileController);


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

	function ProfileController(currentUser, $routeParams, $location, $timeout, UserService, WebsiteService, PageService, WidgetService) {
		var vm = this;
		vm.user = currentUser;
		var userId = currentUser._id;
		vm.updateUser = updateUser;
		vm.deleteUser = deleteUser;
		vm.logout = logout;
		vm.unregister = unregister;
		vm.pages = [];

		init();

		function init() {
			WebsiteService
				.findAllWebsitesForUser(userId)
				.then(function (websites) {
					vm.websites = websites;
					findAllPagesForUser();
				});
		}

		function logout() {
			UserService
				.logout()
				.then(function () {
					$location.url('/login')
				});
		}

		function unregister() {
			UserService
				.unregister()
				.then(function () {
					$location.url('/');
					WebsiteService
						.deleteWebsitesByUser(vm.user._id)
						.then(function () {
							deleteAllPagesForUser();
							deleteAllWidgetsForUser();
						});
				}, function () {
					vm.error = "Unable to delete user!"
				});
		}

		function findAllPagesForUser() {
			var i = 0;
			for(var w in vm.websites) {
				PageService
					.findAllPagesForWebsite(vm.websites[w]._id)
					.then(function (pages) {
						for(var p in pages) {
							vm.pages[i] = pages[p];
							i++;
						}
					});
			}
		}

		function deleteAllPagesForUser() {
			for(var w in vm.websites) {
				PageService
					.deletePagesByWebsite(vm.websites[w]._id);
			}
		}

		function deleteAllWidgetsForUser() {
			for (var p in vm.pages) {
				WidgetService
					.deleteWidgetsByPage(vm.pages[p]._id);
			}
		}

		function updateUser(user) {
			UserService
				.updateUser(user._id, user)
				.then(function () {
					vm.message = "Profile changes saved! "
				});

			$timeout(function () {
				vm.message = null;
			}, 3000);
		}

		function deleteUser(user) {
			UserService
				.deleteUser(user._id)
				.then(function () {
					$location.url('/login');
					WebsiteService
						.deleteWebsitesByUser(user._id)
						.then(function () {
							deleteAllPagesForUser();
							deleteAllWidgetsForUser();
						});
				}, function () {
					vm.error = "Unable to delete user!"
				});
		}
	}
})();
