(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);


    function LoginController($location, UserService){
        var vm = this;
        vm.login = login;

        function login(username, password){
            var promise = UserService.findUserByCredentials(username, password);
            promise
                .success(function(user){
                    if(user) {
                        $location.url("/user/" + user._id);
                    }
                    else {
                        vm.error = "Username or password is incorrect!"
                    }
                })
                .error(function(){

                });
        }
    }
})();