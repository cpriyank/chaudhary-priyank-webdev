module.exports = function(app) {
    next_id = 567;
    var users = [
        {_id: 123, username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder", email: "alicew@gmail.com"  },
        {_id: 234, username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley", email: "bobm@gmail.com"    },
        {_id: 345, username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia", email: "charlyg@gmail.com" },
        {_id: 456, username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "josea@gmail.com"  }
    ];

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);

	// API Calls
    function createUser(req, res) {
        var user = req.body;
        existing_user = false;
        for(var u in users) {
            if(users[u].username === user.username)
                existing_user = true;
        }
        if(existing_user) {
            res.send(null);
            return;
        }
        user._id = next_id;
        next_id += 111;
        users.push(user)
        res.json(user);
    }

    function findUser(req, res) {
        var query = req.query;
        if(query.username && query.password) {
            findUserByCredentials(req, res);
        } else if(query.username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        for(var u in users) {
            user = users[u];
            if(user.username === username && user.password === password) {
                res.json(user);
                return;
            }
        }
        res.send(null);
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        for(var u in users) {
            user = users[u];
            if(user.username === username) {
                res.json(user);
                return;
            }
        }
        res.send(null);
    }

    function findUserById(req, res) {
        userId = parseInt(req.params.userId);
        for(var u in users) {
            user = users[u];
            if(user._id === userId) {
                res.json(user);
                return;
            }
        }
        res.send(null);
    }

    function updateUser(req, res) {
        var userId = parseInt(req.params.userId);
        var newuser = req.body;
        for(var u in users) {
            user = users[u];
            if(user._id === userId) {
                user.firstName = newuser.firstName;
                user.lastName = newuser.lastName;
                user.email = newuser.email;
            }
        }
        res.sendStatus(200);
    }

    function deleteUser(req, res) {
        var userId = parseInt(req.params.userId);
        for(var u in users) {
            if (users[u]._id === userId) {
                users.splice(u, 1);
                break;
            }
        }
        res.sendStatus(200);
    }
};
