(function () {
	angular
		.module("WebAppMaker")
		.service("FlickrService", FlickrService);

	function FlickrService($http) {
		this.searchPhotos = searchPhotos;

		var key = "e29fedeedb31a56b12ec0e7d3a97399c";
		var secret = "c4f891d9c43ffdb9";
		var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

		function searchPhotos(searchTerm) {
			var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
			return $http.get(url);
		}

	}
})();