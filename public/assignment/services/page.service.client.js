(function () {
	angular
		.module("WebAppMaker")
		.factory('PageService', PageService);

	function PageService($http) {

		var api = {
			"createPage": createPage,
			"findAllPagesForWebsite": findAllPagesForWebsite,
			"findPageById": findPageById,
			"updatePage": updatePage,
			"deletePage": deletePage,
			"deletePageFromWebsite": deletePageFromWebsite,
			"deletePagesByWebsite" : deletePagesByWebsite
		};
		return api;

		function createPage(websiteId, page) {
			var url = "/api/website/" + websiteId + "/page";
			return $http.post(url, page)
				.then(function (response) {
					return response.data;
				});
		}

		function findAllPagesForWebsite(websiteId) {
			var url = "/api/website/" + websiteId + "/page";
			return $http.get(url)
				.then(function (response) {
					return response.data;
				});
		}

		function findPageById(pageId) {
			var url = "/api/page/" + pageId ;
			return $http.get(url)
				.then(function (response) {
					return response.data;
				});
		}

		function updatePage(pageId, page) {
			var url = "/api/page/"+ pageId;
			return $http.put(url, page)
				.then(function (response) {
					return response.data;
				});
		}

		function deletePage(pageId) {
			var url = "/api/page/"+ pageId;
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}

		function deletePageFromWebsite(websiteId, pageId) {
			var url = "/api/website/" + websiteId + "/page/" + pageId;
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}

		function deletePagesByWebsite(websiteId){
			var url = "/api/website/" + websiteId + "/page";
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}
	}
})();