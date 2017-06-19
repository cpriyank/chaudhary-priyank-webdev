// In this assignment views will be refactored to instead render dynamic content
// provided by controllers that provide the view with data through a model.
// Controllers will also implement event handlers to map user gestures to logic
// that manipulates a data model. Data retrieval and manipulation will be done
// through the services created earlier. Service will be shared across
// controllers responsible for a particular type of entity.
(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

// Note that these three functions can also be put in a separate file in itself.
// 	Since they are small enough and connected, they are kept in a single
// file. For future assignments, if need be, they will be put in different files
// in controller directory.
    function WebsiteListController($routeParams, WebsiteService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
    }
    function NewWebsiteController($routeParams, $timeout, WebsiteService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
        vm.createNew = createNew;

        function createNew(){
            if(vm.websiteName === null || vm.websiteName === undefined || vm.websiteName === ""){
                vm.errorText = "Website Name Cannot be Blank";
                $timeout(function(){
                    vm.errorText = null;
                }, 3500);
                return;
            }
            newWebsite = {
                name: vm.websiteName,
                desc: vm.websiteDesc
            };
            WebsiteService.createWebsite(vm.uid, newWebsite);
            vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
            vm.websiteName = null;
            vm.websiteDesc = null;
        }
    }
    function EditWebsiteController($routeParams, $location, $window, WebsiteService, PageService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
        vm.currentWebsite = WebsiteService.findWebsiteById(vm.wid);
        vm.currentWebsiteName = vm.currentWebsite.name;
        vm.currentWebsiteDesc = vm.currentWebsite.desc;
        vm.editWebsite = editWebsite;
        vm.deleteWebsite = deleteWebsite;

        function editWebsite(){
            if(vm.currentWebsiteName === null || vm.currentWebsiteName === undefined || vm.currentWebsiteName === ""){
                vm.errorText = "Website Name Cannot be Blank";
                $timeout(function(){
                    vm.errorText = null;
                }, 3500);
                return;
            }
            var latestData = {
                name: vm.currentWebsiteName,
                desc: vm.currentWebsiteDesc
            };
            WebsiteService.updateWebsite(vm.wid, latestData);
            vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
            $location.url("/user/"+vm.uid+"/website");
        }

        function deleteWebsite(){
            WebsiteService.deleteWebsite(vm.wid);
            PageService.deletePagesByWebsite(vm.wid);
            $location.url("/user/"+vm.uid+"/website");
        }
    }
})();