(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function(websiteList){
                    vm.websites = websiteList;
                })
                .error(function(error){

                });
        }
        init();
    }

    function NewWebsiteController($routeParams, $location, WebsiteService){
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.createWebsite = createWebsite;

        function createWebsite(website) {
            if(typeof(website) === "undefined" || !website.name){
                vm.error = "Website name is required";
                return;
            }
            WebsiteService
                .createWebsite(vm.userId, website)
                .success(function() {
                    $location.url("/user/" + vm.userId +"/website");
                })
                .error(function() {

                });
        }

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function(website){
                    vm.websites = website;
                })
                .error(function(){

                });
        }
        init();
    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .success(function(website){
                    vm.website = website;
                })
                .error(function(){

                });
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function(websites){
                    vm.websites = websites;
                })
                .error(function(){

                });
        }

        function updateWebsite(website) {
            if(typeof(website) === "undefined" || !website.name){
                vm.error = "Website name is required";
                return;
            }
            WebsiteService
                .updateWebsite(vm.websiteId, website)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website");
                })
                .error(function(){

                });
        }

        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website");
                })
                .error(function(){

                });
        }

        init();
    }
})();