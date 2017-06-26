(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);

        function init() {
            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function(pages){
                    vm.pages = pages;
                })
                .error(function(){

                });
        }
        init();
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.createPage = createPage;

        function createPage(page) {
            PageService
                .createPage(vm.websiteId, page)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function(){

                });
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.pageId = parseInt($routeParams["pid"]);
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            PageService
                .findPageById(vm.pageId)
                .success(function(page){
                    vm.page = page;
                })
                .error(function(){

                });
        }

        function updatePage(page) {
            PageService
                .updatePage(vm.pageId, page)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function(){

                });
        }

        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function(){

                });
        }

        init();
    }
})();