(function(){
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

			// // APIs in the UserService service
    function UserService($http) {
        var api = {
            login: login,
            logout: logout,
            createUser: createUser,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            updateUser: updateUser,
            deleteUser: deleteUser
        };

        return api;

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function createUser(user) {
            return $http.post('/api/user', user);
        }

        function findUserById(userId) {
            return $http.get('/api/user/' + userId);
        }

        function findUserByUsername(username) {
            return $http.get('/api/user?username=' + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get('/api/user?username=' + username + '&password=' + password);
        }

        function updateUser(userId, newuser) {
            return $http.put('/api/user/' + userId, newuser);
        }

        function deleteUser(userId) {
            return $http.delete('/api/user/' + userId);
        }
    }
})();