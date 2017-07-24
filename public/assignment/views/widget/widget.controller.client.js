(function () {
	angular
		.module("WebAppMaker")
		.controller("WidgetListController", WidgetListController)
		.controller("NewWidgetController", NewWidgetController)
		.controller("CreateWidgetController", CreateWidgetController)
		.controller("EditWidgetController", EditWidgetController)
		.controller("FlickrImageSearchController", FlickrImageSearchController);


	function WidgetListController(currentUser, $routeParams, WidgetService, PageService, $sce) {
		var vm = this;
		vm.user = currentUser;
		vm.userId = currentUser.userId;
		vm.websiteId = $routeParams.websiteId;
		vm.pageId = $routeParams.pageId;
		vm.getWidgetUrlForType = getWidgetUrlForType;
		vm.trustThisContent = trustThisContent;
		vm.getYoutubeEmbedUrl = getYoutubeEmbedUrl;
		vm.widgets = [];

		init();

		function init() {
			PageService
				.findPageById(vm.pageId)
				.then(function (page) {
					var i = 0;
					for (var w in page.widgets) {
						WidgetService
							.findWidgetById(page.widgets[w])
							.then(function (widget) {
								vm.widgets[i] = widget;
								i++;
							});
					}
				});
		}

		function getWidgetUrlForType(widgetType) {
			return 'views/widget/widget-' + widgetType.toLowerCase() +'.view.client.html';
		}

		function trustThisContent(html) {
			return $sce.trustAsHtml(html);
		}

		function getYoutubeEmbedUrl(link) {
			var embedUrl = "https://www.youtube.com/embed/";
			var linkParts = link.split('/');
			var id = linkParts[linkParts.length-1];
			embedUrl += id;
			return $sce.trustAsResourceUrl(embedUrl);
		}

	}

	function NewWidgetController(currentUser, $routeParams, WidgetService) {
		var vm = this;
		vm.user = currentUser;
		vm.userId = currentUser.userId;
		vm.websiteId = $routeParams.websiteId;
		vm.pageId = $routeParams.pageId;
	}

	function CreateWidgetController(currentUser, $routeParams, $timeout, $location, WidgetService) {
		var vm = this;
		vm.user = currentUser;
		vm.userId = currentUser.userId;
		vm.websiteId = $routeParams.websiteId;
		vm.pageId = $routeParams.pageId;
		vm.widgetType = $routeParams.widgetType;
		vm.createWidget = createWidget;
		vm.error = null;

		function createWidget() {
			if(vm.widgetName === null || vm.widgetName === undefined || vm.widgetName === ""){
				vm.error = "Widget name cannot be empty";
				$timeout(function(){
					vm.error = null;
				}, 3500);
				return;
			}

			if (vm.widgetType === 'IMAGE' || vm.widgetType === 'YOUTUBE') {
				if (vm.widgetUrl === null || vm.widgetUrl === undefined) {
					vm.error = "Url is required for Image/Youtube";
					return;
				}
			}
			if (vm.widgetType === 'HEADING') {
				if (vm.widgetText === null || vm.widgetText === undefined) {
					vm.error = "Text is required for Header";
					return;
				}
			}


			var newWidget = {
				name: vm.widgetName,
				text: vm.widgetText,
				widgetType: vm.widgetType,
				size: vm.widgetSize,
				width: vm.widgetWidth,
				url: vm.widgetUrl,
				rows: vm.rows,
				placeholder: vm.placeholder,
				formatted: vm.formatted
			};

			WidgetService
				.createWidget(vm.pageId, newWidget)
				.then(function (widget) {
					vm.message = "Successfully created new widget!";
					$location.url("/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
				}, function (error) {
					console.log(error);
				});
		}
	}

	function EditWidgetController(currentUser, $routeParams, $timeout, $location, WidgetService) {
		var vm = this;
		vm.user = currentUser;
		vm.userId = currentUser.userId;
		vm.websiteId = $routeParams.websiteId;
		vm.pageId = $routeParams.pageId;
		vm.widgetId = $routeParams.widgetId;
		vm.updateWidget = updateWidget;
		vm.deleteWidget = deleteWidget;

		init();

		function init() {
			WidgetService
				.findWidgetById(vm.widgetId)
				.then(function (widget) {
					vm.currentWidget = widget;
					if (vm.currentWidget.widgetType === "HEADING") {
						vm.widgetName = vm.currentWidget.name;
						vm.widgetText = vm.currentWidget.text;
						vm.widgetSize = vm.currentWidget.size;
					} else if (vm.currentWidget.widgetType === "IMAGE") {
						vm.widgetName = vm.currentWidget.name;
						vm.widgetText = vm.currentWidget.text;
						vm.widgetUrl = vm.currentWidget.url;
						vm.widgetWidth = vm.currentWidget.width;
					} else if (vm.currentWidget.widgetType === "YOUTUBE") {
						vm.widgetName = vm.currentWidget.name;
						vm.widgetText = vm.currentWidget.text;
						vm.widgetUrl = vm.currentWidget.url;
						vm.widgetWidth = vm.currentWidget.width;
					} else if (vm.currentWidget.widgetType === "HTML") {
						vm.widgetName = vm.currentWidget.name;
						vm.widgetText = vm.currentWidget.text;
					} else if (vm.currentWidget.widgetType === "TEXT") {
						vm.widgetName = vm.currentWidget.name;
						vm.widgetText = vm.currentWidget.text;
						vm.rows = vm.currentWidget.rows;
						vm.placeholder = vm.currentWidget.placeholder;
						vm.formatted = vm.currentWidget.formatted;
					}
				});
		}

		function updateWidget() {
			if(vm.widgetName === null || vm.widgetName === undefined || vm.widgetName === ""){
				vm.error = "Widget name cannot be empty";
				$timeout(function(){
					vm.error = null;
				}, 3500);
				return;
			}

			var updatedWidget = {
				name: vm.widgetName,
				text: vm.widgetText,
				widgetType: vm.widgetType,
				size: vm.widgetSize,
				width: vm.widgetWidth,
				url: vm.widgetUrl,
				rows: vm.rows,
				placeholder: vm.placeholder,
				formatted: vm.formatted
			};

			WidgetService
				.updateWidget(vm.widgetId, updatedWidget)
				.then(function () {
					$location.url("/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
				}, function () {
					vm.error = "Unable to update widget!"
				});
		}

		function deleteWidget() {
			WidgetService
				.deleteWidgetFromPage(vm.pageId, vm.widgetId)
				.then(function () {
					$location.url("/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
				}, function () {
					vm.error = "Unable to delete widget!"
				});
		}

	}

	function FlickrImageSearchController(currentUser, $routeParams, $location, FlickrService, WidgetService) {
		var vm = this;
		vm.user = currentUser;
		vm.userId = currentUser.userId;
		vm.websiteId = $routeParams.websiteId;
		vm.pageId = $routeParams.pageId;
		vm.widgetId = $routeParams.widgetId;
		vm.searchPhotos = searchPhotos;
		vm.selectPhoto = selectPhoto;

		init();

		function init() {
			WidgetService
				.findWidgetById(vm.widgetId)
				.then(function (widget) {
					vm.currentWidget = widget;
				});
		}

		function selectPhoto(photo) {
			var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
			url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
			vm.currentWidget.url = url;

			WidgetService
				.updateWidget(vm.widgetId, vm.currentWidget)
				.then(function () {
					$location.url("/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
				});
		}

		function searchPhotos(searchTerm) {
			FlickrService
				.searchPhotos(searchTerm)
				.then(function(response) {
					data = response.data.replace("jsonFlickrApi(","");
					data = data.substring(0,data.length - 1);
					data = JSON.parse(data);
					vm.photos = data.photos;
				});

		}
	}
})();