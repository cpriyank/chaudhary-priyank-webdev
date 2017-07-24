(function () {
	angular
		.module("WebAppMaker")
		.factory('WebsiteService', WebsiteService);

	function WebsiteService($http) {

		var api = {
			'createWebsiteForUser': createWebsiteForUser,
			'findAllWebsitesForUser': findAllWebsitesForUser,
			'findWebsiteById': findWebsiteById,
			'updateWebsite': updateWebsite,
			'deleteWebsite': deleteWebsite,
			'deleteWebsitesByUser': deleteWebsitesByUser,
			'deleteWebsiteFromUser': deleteWebsiteFromUser
		};
		return api;

		function createWebsiteForUser(userId, website) {
			return $http.post("/api/user/" + userId + "/website", website)
				.then(function (response) {
					return response.data;
				});
		}

		function findAllWebsitesForUser(userId) {
			var url = "/api/user/" + userId + "/website";
			return $http.get(url)
				.then(function (response) {
					return response.data;
				});
		}

		function findWebsiteById(websiteId) {
			var url = "/api/website/" + websiteId ;
			return $http.get(url)
				.then(function (response) {
					return response.data;
				});
		}

		function updateWebsite(websiteId, website) {
			var url = "/api/website/"+ websiteId;
			return $http.put(url, website)
				.then(function (response) {
					return response.data;
				});
		}

		function deleteWebsite(websiteId) {
			var url = "/api/website/" + websiteId;
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}

		function deleteWebsiteFromUser(userId, websiteId) {
			var url = "/api/user/" + userId + "/website/" + websiteId;
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}

		function deleteWebsitesByUser(userId) {
			var url = "/api/user/" + userId + "/website";
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}
	}
})();