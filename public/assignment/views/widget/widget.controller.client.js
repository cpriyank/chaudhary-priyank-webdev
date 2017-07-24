(function() {
	angular
		.module("WebAppMaker")
		.controller("WidgetListController", WidgetListController)
		.controller("NewWidgetController", NewWidgetController)
		.controller("EditWidgetController", EditWidgetController)
		.controller("CreateWidgetController", CreateWidgetController)
		.controller("FlickrImageSearchController", FlickrImageSearchController);

	function WidgetListController($routeParams, $sce, WidgetService, loggedin) {
		var vm = this;
		vm.uid = loggedin._id;
		vm.wid = $routeParams.wid;
		vm.pid = $routeParams.pid;

		WidgetService
			.findWidgetsByPageId(vm.pid)
			.then(renderWidgets);

		function renderWidgets(widgets) {
			vm.widgets = widgets;
		}

		vm.trustThisContent = trustThisContent;
		vm.getYoutubeEmbedUrl = getYoutubeEmbedUrl;

		function trustThisContent(html) {
			return $sce.trustAsHtml(html);
		}

		function getYoutubeEmbedUrl(youtubeLink) {
			var embedUrl = "https://www.youtube.com/embed/";
			var youtubeLinkParts = youtubeLink.split('/');
			var id = youtubeLinkParts[youtubeLinkParts.length - 1];
			embedUrl += id;
			return $sce.trustAsResourceUrl(embedUrl);
		}
	}

	function NewWidgetController($routeParams, loggedin) {
		var vm = this;
		vm.uid = loggedin._id;
		vm.wid = $routeParams.wid;
		vm.pid = $routeParams.pid;
	}

	function CreateWidgetController($routeParams, $location, $timeout, WidgetService, loggedin) {
		var vm = this;
		vm.uid = loggedin._id;
		vm.wid = $routeParams.wid;
		vm.pid = $routeParams.pid;
		vm.wtype = $routeParams.wtype;

		vm.createWidget = createWidget;

		function createWidget(widget) {

			widget.widgetType = vm.wtype;

			if (vm.wtype === "HEADING") {
				if (widget.size === undefined || widget.text === undefined || widget.size === null || widget.text === null) {
					vm.error = "Heading name and size cannot be empty.";
					$timeout(function () {
						vm.error = null;
					}, 3000);
					return;
				}
			}
			if (vm.wtype === "IMAGE" || vm.wtype === "YOUTUBE") {
				if (widget.url === undefined || widget.url === null) {
					vm.error = "Width and url cannot be empty.";
					$timeout(function () {
						vm.error = null;
					}, 3000);
					return;
				}
			}
			if (vm.wtype === "HTML") {
				if (widget.text === undefined || widget.text === null) {
					vm.error = "HTML text cannot be empty.";
					$timeout(function () {
						vm.error = null;
					}, 3000);
					return;
				}
			}

			WidgetService
				.createWidget(vm.pid, widget)
				.then(function () {
					$location.url("/website/" + vm.wid + "/page/" + vm.pid + "/widget");
				});
		}
	}

	function EditWidgetController($routeParams, $location, $timeout, WidgetService, loggedin) {
		var vm = this;
		vm.uid = loggedin._id;
		vm.wid = $routeParams.wid;
		vm.pid = $routeParams.pid;
		vm.wgid = $routeParams.wgid;

		WidgetService
			.findWidgetById(vm.wgid)
			.then(function (widget) {
				vm.widget = widget;
			}, function (error) {
				vm.error = "Cannot find this widget by id";
				$timeout(function () {
					vm.error = null;
				}, 3000);
			});

		vm.updateWidget = updateWidget;
		vm.deleteWidget = deleteWidget;

		function updateWidget(newWidget) {
			WidgetService
				.updateWidget(vm.wgid, newWidget)
				.then(function () {
					$location.url("/website/" + vm.wid + "/page/" + vm.pid + "/widget");
				}, function (error) {
					vm.error = "Cannot find widget to update.";
					$timeout(function () {
						vm.error = null;
					}, 3000);
				});
		}

		function deleteWidget(widget) {
			WidgetService
				.deleteWidget(vm.pid, widget._id)
				.then(function () {
					$location.url("/website/" + vm.wid + "/page/" + vm.pid + "/widget");
				}, function (error) {
					vm.error = "Cannot find widget to delete.";
					$timeout(function () {
						vm.error = null;
					}, 3000);
				})
		}
	}

	function FlickrImageSearchController($routeParams, $location, FlickrService, WidgetService, loggedin) {
		var vm = this;
		vm.uid = loggedin._id;
		vm.wid = $routeParams.wid;
		vm.pid = $routeParams.pid;
		vm.wgid = $routeParams.wgid;

		vm.selectPhoto = selectPhoto;

		vm.searchPhotos = function(searchTerm) {
			FlickrService
				.searchPhotos(searchTerm)
				.then(function(response) {
					data = response.data.replace("jsonFlickrApi(","");
					data = data.substring(0,data.length - 1);
					data = JSON.parse(data);
					vm.photos = data.photos;
				});
		};

		function selectPhoto(photo) {
			var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
			url += "/" + photo.id + "_" + photo.secret + "_b.jpg";

			var newWidget = {
				widgetType: "IMAGE",
				url: url
			};

			if (vm.wgid === null || vm.wgid === undefined) {
				WidgetService
					.createWidget(vm.pid, newWidget)
					.then(function () {
						$location.url("/website/" + vm.wid + "/page/" + vm.pid + "/widget");
					})
			} else {
				WidgetService
					.updateWidget(vm.wgid, newWidget)
					.then(function () {
						$location.url("/website/" + vm.wid + "/page/" + vm.pid + "/widget");
					})
			}
		}

	}
})();