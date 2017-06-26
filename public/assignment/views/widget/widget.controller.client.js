(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, WidgetService, $sce) {
        var vm = this;
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.pageId = parseInt($routeParams["pid"]);
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
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.pageId = parseInt($routeParams["pid"]);

        function init() {
            WidgetService
                .getWidgetTypes()
                .success(function (widgetTypes) {
                    vm.widgetTypes = widgetTypes;
                })
                .error(function () {

                });
        }

        init();
    }

    function EditWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.pageId = parseInt($routeParams["pid"]);
        vm.widgetId = parseInt($routeParams["wgid"]);
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
            WidgetService
                .updateWidget(vm.widgetId, widget)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function () {

                });
        }

        function createWidget(widget) {
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
})();