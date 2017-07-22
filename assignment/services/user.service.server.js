module.exports = function (app, model) {

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var bcrypt = require("bcrypt-nodejs");

    app.post  ('/api/login', passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.get ('/api/loggedin', loggedin);


    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function localStrategy(username, password, done) {
        model.userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

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
                        user.password = bcrypt.hashSync(user.password);
                        model.userModel
                            .createUser(user)
                            .then(
                                function (newuser) {
                                    req.login(newuser, function(err) {
                                        if(err) {
                                            res.status(400).send(err);
                                        } else {
                                    res.json(newuser);
                                        }
                                    });
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
