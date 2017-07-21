(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);


    function LoginController($location, UserService, $rootScope) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            if(!username) {
                vm.error = "Username cannot be empty";
                return;
            } else if(!password) {
                vm.error = "Password cannot be empty";
                return;
                    }
            var user = {username: username, password: password};
            UserService
                .login(user)
                .then(
                    function (response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url("/user/" + user._id);
                    },
                function (err) {
                        vm.error = "Username or Password is incorrect!";
                });
        }
    }
})();