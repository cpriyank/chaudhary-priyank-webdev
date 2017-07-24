(function () {
	angular
		.module("WebAppMaker")
		.factory('WidgetService', WidgetService);


	function WidgetService($http) {

		var api = {
			'createWidget': createWidget,
			'findAllWidgetsForPage': findAllWidgetsForPage,
			'findWidgetById': findWidgetById,
			'updateWidget': updateWidget,
			'deleteWidget': deleteWidget,
			'deleteWidgetFromPage': deleteWidgetFromPage,
			'deleteWidgetsByPage': deleteWidgetsByPage,
			'sortWidgets': sortWidgets
		};
		return api;

		function createWidget(pageId, widget) {
			var url = "/api/page/" + pageId + "/widget";
			return $http.post(url, widget)
				.then(function (response) {
					return response.data;
				});
		}

		function findAllWidgetsForPage(pageId) {
			var url = "/api/page/" + pageId + "/widget";
			return $http.get(url)
				.then(function (response) {
					return response.data;
				});
		}

		function findWidgetById(widgetId) {
			var url = "/api/widget/" + widgetId;
			return $http.get(url)
				.then(function (response) {
					return response.data;
				});
		}

		function updateWidget(widgetId, widget) {
			var url = "/api/widget/" + widgetId;
			return $http.put(url, widget)
				.then(function (response) {
					return response.data;
				});
		}

		function deleteWidget(widgetId) {
			var url = "/api/widget/" + widgetId;
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}

		function deleteWidgetFromPage(pageId, widgetId) {
			var url = "/api/page/" + pageId + "/widget/" + widgetId;
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}

		function deleteWidgetsByPage(pageId){
			var url = "/api/page/" + pageId + "/widget";
			return $http.delete(url)
				.then(function (response) {
					return response.data;
				});
		}

		function sortWidgets(start, end, pageId) {
			var url = "/page/" + pageId + "/widget?initial=index1&final=index2";
			url = url.replace("index1", start)
				.replace("index2", end);
			$http.put(url);
		}

	}
})();