(function(){
	angular
		.module("WebAppMaker")
		.config(configuration);

	function configuration($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : "views/home/home.view.client.html",
				controller: "HomeController",
				controllerAs: "model",
				resolve: {
					currentUser: checkCurrentUser
				}
			})
			.when('/login', {
				templateUrl : "views/user/login.view.client.html",
				controller: "LoginController",
				controllerAs: "model"
			})
			.when('/register', {
				templateUrl : "views/user/register.view.client.html",
				controller: "RegisterController",
				controllerAs: "model"
			})
			.when('/admin', {
				templateUrl : "views/admin/admin.view.client.html",
				resolve: {
					currentUser: checkAdmin
				}
			})
			.when('/admin/user', {
				templateUrl : "views/admin/admin-users.view.client.html",
				controller: "AdminUserController",
				controllerAs: "model",
				resolve: {
					currentUser: checkAdmin
				}
			})
			.when('/profile', {
				templateUrl : "views/user/profile.view.client.html",
				controller: "ProfileController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website', {
				templateUrl : "views/website/website-list.view.client.html",
				controller: "WebsiteListController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/new', {
				templateUrl : "views/website/website-new.view.client.html",
				controller: "NewWebsiteController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId', {
				templateUrl : "views/website/website-edit.view.client.html",
				controller: "EditWebsiteController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId/page', {
				templateUrl : "views/page/page-list.view.client.html",
				controller: "PageListController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId/page/new', {
				templateUrl : "views/page/page-new.view.client.html",
				controller: "NewPageController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId/page/:pageId', {
				templateUrl : "views/page/page-edit.view.client.html",
				controller: "EditPageController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId/page/:pageId/widget', {
				templateUrl : "views/widget/widget-list.view.client.html",
				controller: "WidgetListController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId/page/:pageId/widget/new', {
				templateUrl : "views/widget/widget-chooser.view.client.html",
				controller: "NewWidgetController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId/page/:pageId/widget/:widgetId', {
				templateUrl : "views/widget/widget-edit.view.client.html",
				controller: "EditWidgetController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId/page/:pageId/widget/create/:widgetType', {
				templateUrl : "views/widget/widget-new.view.client.html",
				controller: "CreateWidgetController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.when('/website/:websiteId/page/:pageId/widget/:widgetId/search', {
				templateUrl : "views/widget/widget-flickr-search.view.client.html",
				controller: "FlickrImageSearchController",
				controllerAs: "model",
				resolve: {
					currentUser: checkLoggedIn
				}
			})
			.otherwise({
				redirectTo : "/"
			});
	}

	function checkLoggedIn(UserService, $q, $location) {
		var deferred = $q.defer();
		UserService
			.checkLoggedIn()
			.then(function (user) {
				if(user === '0') {
					deferred.reject();
					$location.url('/login');
				} else {
					deferred.resolve(user);
				}
			});

		return deferred.promise;
	}

	function checkAdmin(UserService, $q, $location) {
		var deferred = $q.defer();
		UserService
			.checkAdmin()
			.then(function (user) {
				if(user === '0') {
					deferred.reject();
					$location.url('/');
				} else {
					deferred.resolve(user);
				}
			});

		return deferred.promise;
	}

	function checkCurrentUser(UserService, $q, $location) {
		var deferred = $q.defer();
		UserService
			.checkLoggedIn()
			.then(function (user) {
				if(user === '0') {
					deferred.resolve({});
				} else {
					deferred.resolve(user);
				}
			});

		return deferred.promise;
	}

})();
