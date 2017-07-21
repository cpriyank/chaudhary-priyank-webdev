(function(){
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, $location, UserService, $rootScope) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.update = update;
        vm.logout = logout;

        function init() {
            var promise = UserService.findUserById(vm.userId);
            promise
                .success(function(user){
                    vm.user = user;
                })
                .error(function(){

                });
        }

        function update(user) {
            var promise = UserService.updateUser(vm.userId, user);
            promise
                .success(function(){
                    $location.url("/user/" + vm.userId);
                })
                .error(function(){

                });
        }

        function logout() {
            console.log("ahi avya");
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    }
                );
        }

        init();
    }
})();