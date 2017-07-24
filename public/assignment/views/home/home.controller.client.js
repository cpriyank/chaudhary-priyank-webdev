(function() {
	angular
		.module("WebAppMaker")
		.controller("HomeController", HomeController);


	function HomeController(currentUser) {
		var vm = this;
		vm.currentUser = currentUser;
	}

})();
