(function() {
	angular
		.module("WebAppMaker")
		.controller("AdminController", AdminController);

	function AdminController(currentUser) {
		var vm = this;
		vm.currentUser = currentUser;
	}
})();
