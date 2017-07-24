(function () {
    angular
        .module("jgaDirectives", [])
        .directive("jgaSortable", jgaSortable);

    function jgaSortable($routeParams) {

        function linker(scope, element, atrributes) {
            var start = -1;
            var end = -1;
            var pageId = $routeParams.pageId;
            $(element).sortable({
                start: function (event, ui) {
                    start = ($(ui.item).index());
                },
                stop: function (event, ui) {
                    end = ($(ui.item).index());
                    scope.sortableController.sortWidgets(start, end, pageId);
                }
            });
        }

        return {
            scope: {},
            link: linker,
            controller: sortableController,
            controllerAs: 'sortableController'
        }
    }

    function sortableController(WidgetService, $routeParams) {
        var vm = this;
        var pageId = $routeParams.pageId;
        vm.sortWidgets = sortWidgets;

        function sortWidgets(start, end, pageId) {
            WidgetService.sortWidgets(start,end, pageId);
        }
    }
})();