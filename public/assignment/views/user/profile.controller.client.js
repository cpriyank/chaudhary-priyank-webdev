(function(){
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.update = update;

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

        init();
    }
})();