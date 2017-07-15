(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController)
				.controller("FlickrImageSearchController", FlickrImageSearchController);

    function WidgetListController($routeParams, WidgetService, $sce) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.checkSafeHtml = checkSafeHtml;
        vm.checkSafeYouTubeUrl = checkSafeYouTubeUrl;
        vm.sortItem = sortItem;

        function init() {
            WidgetService
                .findWidgetsByPageId(vm.pageId)
                .success(function (widgets) {
                    vm.widgets = widgets;
                })
                .error(function () {

                });
        }

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function checkSafeYouTubeUrl(url) {
            var parts = url.split("/");
            var id = parts[parts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }

        function sortItem(start, end) {
            WidgetService.sortItem(vm.pageId, start, end);
        }

        init();
    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];

        function init() {
            WidgetService
                .getWidgetTypes()
                .success(function (widgetTypes) {
                    // a widgetType has 'wid' and 'type'
                    vm.widgetTypes = widgetTypes;
                })
                .error(function () {

                });
        }

        init();
    }

    function EditWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.widgetId = $routeParams["wgid"];
        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;
        vm.createWidget = createWidget;

        function init() {
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function (widget) {
                    vm.widget = widget;
                })
                .error(function () {

                });
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function () {

                });
        }

        function updateWidget(widget) {
            if(typeof(widget) === "undefined" || !widget.name){
                vm.error = "Widget name is required";
                return;
            }
            WidgetService
                .updateWidget(vm.widgetId, widget)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function () {

                });
        }

        function createWidget(widget) {
            if(typeof(widget) === "undefined" || !widget.name){
                vm.error = "Widget name is required";
                return;
            }
            WidgetService
                .createWidget(vm.pageId, widget)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function () {

                });
        }
        init();
    }

    function FlickrImageSearchController($routeParams, $location, FlickrService, WidgetService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
			vm.widgetId = $routeParams["wgid"];
			vm.searchPhotos = searchPhotos;
			vm.selectPhoto = selectPhoto;

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

        function selectPhoto(photo) {

            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";

            var widget = {
                url: url,
                type: "IMAGE"
            };

            if (vm.widgetId === null || vm.widgetId === undefined) {
                WidgetService
                    .createWidget(vm.pageId, widget)
                    .then(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    })
            } else {
                WidgetService
                    .updateWidget(vm.widgetId, widget)
                    .then(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    })
            }
        }

		}

})();
