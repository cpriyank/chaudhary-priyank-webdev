(function() {
	angular
		.module("WebAppMaker")
		.controller("PageListController", PageListController)
		.controller("NewPageController", NewPageController)
		.controller("EditPageController", EditPageController);


	function PageListController(currentUser, $routeParams, PageService){
		var vm = this;
		vm.user = currentUser;
		vm.userId = currentUser._id;
		vm.websiteId = $routeParams.websiteId;

		init();

		function init() {
			PageService
				.findAllPagesForWebsite(vm.websiteId)
				.then(function (pages) {
					vm.pages = pages;
				})
		}
	}

	function NewPageController(currentUser, $routeParams, $timeout, PageService){
		var vm = this;
		vm.user = currentUser;
		vm.userId = currentUser._id;
		vm.websiteId = $routeParams.websiteId;
		vm.createPage = createPage;

		init();

		function init() {
			PageService
				.findAllPagesForWebsite(vm.websiteId)
				.then(function (pages) {
					vm.pages = pages;
				});

		}

		function createPage() {
			if(vm.pageName === null || vm.pageName === undefined || vm.pageName === ""){
				vm.error = "Page name cannot be empty";
				$timeout(function(){
					vm.error = null;
				}, 3500);
				return;
			}
			var newPage = {
				name: vm.pageName,
				description: vm.pageDescription
			};
			PageService
				.createPage(vm.websiteId, newPage)
				.then(function () {
					vm.message = "Successfully created new page!";
					$timeout(function(){
						vm.message = null;
					}, 3500);
				}, function () {
					vm.error = "Unable to create page!";
					$timeout(function(){
						vm.error = null;
					}, 3500);
				});

			PageService
				.findAllPagesForWebsite(vm.websiteId)
				.then(function (pages) {
					vm.pages = pages;
				});
			vm.pageName = null;
			vm.pageDescription = null;
		}
	}
	function EditPageController(currentUser, $routeParams, $location, $timeout, PageService, WidgetService){
		var vm = this;
		vm.user = currentUser;
		vm.userId = currentUser._id;
		vm.websiteId = $routeParams.websiteId;
		vm.pageId = $routeParams.pageId;
		vm.editPage = editPage;
		vm.deletePage = deletePage;


		init();

		function init() {
			PageService
				.findAllPagesForWebsite(vm.websiteId)
				.then(function (pages) {
					vm.pages = pages;
				});

			PageService.findPageById(vm.pageId)
				.then(function (cur) {
					vm.currentPage = cur;
				});
		}

		function editPage() {
			if(vm.currentPage.name === null
				|| vm.currentPage.name === undefined
				|| vm.currentPage.name === ""){
				vm.error = "Page name cannot be empty";
				$timeout(function(){
					vm.error = null;
				}, 3500);
				return;
			}
			var editedPage = {
				name: vm.currentPage.name,
				description: vm.currentPage.description
			};
			PageService.updatePage(vm.pageId, editedPage)
				.then(function () {
					$location.url("/website/"+vm.websiteId+"/page");
				});

		}

		function deletePage() {
			PageService
				.deletePageFromWebsite(vm.websiteId, vm.pageId)
				.then(function () {
					WidgetService
						.deleteWidgetsByPage(vm.pageId);
					$location.url("/website/"+vm.websiteId+"/page");
				}, function () {
					vm.error = "Unable to delete page!";
					$timeout(function(){
						vm.error = null;
					}, 3500);
				})

		}
	}
})();