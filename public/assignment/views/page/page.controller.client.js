// In this assignment views will be refactored to instead render dynamic content
// provided by controllers that provide the view with data through a model.
// Controllers will also implement event handlers to map user gestures to logic
// that manipulates a data model. Data retrieval and manipulation will be done
// through the services created earlier. Service will be shared across
// controllers responsible for a particular type of entity.
(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

// Note that these three functions can also be put in a separate file in itself.
// 	Since they are small enough and connected, they are kept in a single
// file. For future assignments, if need be, they will be put in different files
// in controller directory.
    function PageListController($routeParams, PageService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pages = PageService.findPageByWebsiteId(vm.wid);
    }
    function NewPageController($routeParams, PageService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pages = PageService.findPageByWebsiteId(vm.wid);
        vm.createPage = createPage;
        
        function createPage() {
            if(vm.pageName === null || vm.pageName === undefined || vm.pageName === ""){
                vm.errorText = "Page Name Cannot be Blank";
                $timeout(function(){
                    vm.errorText = null;
                }, 3500);
                return;
            }
            var newPage = {
                name: vm.pageName,
                title: vm.pageTitle
            };
            PageService.createPage(vm.wid, newPage);
            vm.pages = PageService.findPageByWebsiteId(vm.wid);
            vm.pageName = null;
            vm.pageTitle = null;
        }
    }
    function EditPageController($routeParams, $location, $timeout, PageService, WidgetService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        vm.pages = PageService.findPageByWebsiteId(vm.wid);
        vm.currentPage = PageService.findPageById(vm.pid);
        vm.pageName = vm.currentPage.name;
        vm.pageTitle = vm.currentPage.title;

        vm.editPage = editPage;
        vm.deletePage = deletePage;
        
        function editPage() {
            if(vm.pageName === null || vm.pageName === undefined || vm.pageName === ""){
                vm.errorText = "Page Name Cannot be Blank";
                $timeout(function(){
                    vm.errorText = null;
                }, 3500);
                return;
            }
            var latestData = {
                name: vm.pageName,
                title: vm.pageTitle
            };
            PageService.updatePage(vm.pid, latestData);
            $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page");
        }
        
        function deletePage() {
            PageService.deletePage(vm.pid);
            $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page");
        }
    }
})();