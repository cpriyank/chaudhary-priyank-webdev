module.exports = function (app, model) {

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);

	// API Calls
    function createUser(req, res) {
        var user = req.body;
        model.userModel
            .findUserByUsername(user.username)
            .then(
                function (existingUser) {
                    if (existingUser) {
                        res.json(null);
                    } else {
                        model.userModel
                            .createUser(user)
                            .then(
                                function (newuser) {
                                    res.json(newuser);
                                }, function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
                }
            );
    }

    function findUser(req, res) {
        var query = req.query;
        if (query.username && query.password) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        model.userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                res.json(user);
                }, function (error) {
                    res.sendStatus(400).send(error);
            }
            );
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model.userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                res.json(user);
                }, function (error) {
                    res.sendStatus(400).send(error);
        }
            );
    }

    function findUserById(req, res) {
        userId = req.params.userId;
        model.userModel
            .findUserById(userId)
            .then(
                function (user) {
                res.json(user);
                }, function (error) {
                    res.sendStatus(400).send(error);
        }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newuser = req.body;
        model.userModel
            .updateUser(userId, newuser)
            .then(
                function () {
        res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        model.userModel
            .deleteUser(userId)
            .then(
                function () {
        res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
};
