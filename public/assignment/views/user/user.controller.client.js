// In this assignment views will be refactored to instead render dynamic content
// provided by controllers that provide the view with data through a model.
// Controllers will also implement event handlers to map user gestures to logic
// that manipulates a data model. Data retrieval and manipulation will be done
// through the services created earlier. Service will be shared across
// controllers responsible for a particular type of entity.
(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

	// Note that these three functions can also be put in a separate file in itself.
	// 	Since they are small enough and connected, they are kept in a single
	// file. For future assignments, if need be, they will be put in different files
	// in controller directory.
    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var user = UserService.findUserByCredentials(username, password);
            if (user === null) {
                vm.error = "No Such User";
            } else {
                $location.url("/user/" + user._id);
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password, secondPassword) {
            if (username === undefined || username === null || username === "" || password === undefined || password === "") {
                vm.registerError = "Username and Passwords cannot be blank.";
                vm.username = null;
                return;
            }
            if (password !== secondPassword) {
                vm.registerError = "Passwords do not match.";
                return;
            }
            var user = UserService.findUserByUsername(username);
            if (user === null) {
                user = {
                    username: username,
                    password: password,
                    firstName: "",
                    lastName: "",
                    email: ""
                };
                UserService.createUser(user);
                user = UserService.findUserByUsername(username);
                $location.url("/user/" + user._id);
            }
            else {
                vm.registerError = "Sorry. Username already Exists.";
            }
        }
    }

    function ProfileController($routeParams, $location, $timeout, UserService) {
        var vm = this;
        vm.user = UserService.findUserById($routeParams.uid);
        vm.username = vm.user.username;
        vm.firstName = vm.user.firstName;
        vm.lastName = vm.user.lastName;
        vm.email = vm.user.email;
        vm.updateUser = updateUser;

        function updateUser() {
            var userDetails = {
                _id: $routeParams.uid,
                firstName: vm.firstName,
                lastName: vm.lastName,
                email: vm.email
            };
            UserService.updateUser($routeParams.uid, userDetails);
            vm.changeSuccess = "User Details Changed Successfully.";
            $timeout(function () {
                vm.changeSuccess = null;
            }, 5000);
        }
    }
})();