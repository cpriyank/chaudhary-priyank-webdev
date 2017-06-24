// a service called Website Service implemented in a function of the same name
(function(){
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {
        var api = {
            createWidget: createWidget,
            findWidgetsByPageId: findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget: updateWidget,
            deleteWidget: deleteWidget,
            getWidgetTypes: getWidgetTypes,
            sortItem: sortItem
        };

        return api;

        function createWidget(pageId, widget) {
            return $http.post('/api/page/' + pageId + '/widget', widget);
        }

        function findWidgetsByPageId(pageId) {
            return $http.get('/api/page/' + pageId + '/widget');
        }

        function findWidgetById(widgetId) {
            return $http.get('/api/widget/' + widgetId);
        }

        function updateWidget(widgetId, widget) {
            return $http.put('/api/widget/' + widgetId, widget);
        }

        function deleteWidget(widgetId) {
            return $http.delete('/api/widget/' + widgetId);
        }

        function getWidgetTypes() {
            return $http.get('/api/widget/type');
        }

        function sortItem(pageId, start, end) {
            return $http.put('/page/' + pageId + '/widget?initial=' + start + '&final=' + end);
        }
    }
})();