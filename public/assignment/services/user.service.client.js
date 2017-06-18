(function () {
    angular
        .module("WebAppMaker")
        .factory('UserService', UserService);

    function UserService() {
			// a local array users that will be used to simulate data from a database.r
			// The local users array is only temporary and will be removed in the next
			// assignment where data will be fetched from the server.
        var users = [
            {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder", email: "alice@gmail.com"},
            {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley", email: "bob@regge.com"},
            {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia", email: "charles@bing.com"},
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi", email: "jose@neu.com"}
        ];
			// APIs in the UserService service
        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };
        return api;

        function getNextId() {
            function getMaxId(maxId, currentId) {
                var current = parseInt(currentId._id);
                if (maxId > current) {
                    return maxId;
                } else {
                    return current + 1;
                }
            }
            return users.reduce(getMaxId, 0).toString();
        }

// createUser(user) - adds the user parameter instance to the local users array
        function createUser(user) {
            var newUserId = getNextId();
            var newUser = {
                _id: newUserId,
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
            users.push(newUser);
        }

// findUserById(userId) - returns the user in local users array whose _id matches the userId parameter
        function findUserById(userId) {
            for (u in users){
                var user = users[u];
                if(parseInt(user._id) === parseInt(userId)){
                    return user;
                }
            }
            return null;
        }

// findUserByUsername(username) - returns the user in local users array whose username matches the parameter username
        function findUserByUsername(username) {
            for (u in users){
                var user = users[u];
                if(user.username === username){
                    return user;
                }
            }
            return null;
        }

// findUserByCredentials(username, password) - returns the user whose username and password match the username and password parameters
        function findUserByCredentials(username, password) {
            for (u in users){
                var user = users[u];
                if((user.username === username) && (user.password === password)){
                    return user;
                }
            }
            return null;
        }

// updateUser(userId, user) - updates the user in local users array whose _id matches the userId parameter
        function updateUser(userId, user) {
            var oldUser = findUserById(userId);
            var index = users.indexOf(oldUser);
            users[index].firstName = user.firstName;
            users[index].lastName = user.lastName;
            users[index].email = user.email;
        }

// deleteUser(userId) - removes the user whose _id matches the userId parameter
        function deleteUser(userId) {
            var oldUser = findUserById(userId);
            var index = users.indexOf(oldUser);
            users.splice(index, 1);
        }
    }
})();
