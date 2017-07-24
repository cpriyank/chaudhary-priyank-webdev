var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(app, models){

	var model = models.userModel;

	app.get('/api/user', findUserByUsername);
	app.get('/api/user/:uid', findUserById);
	app.put('/api/user/:uid', updateUser);
	app.delete('/api/user/:uid', deleteUser);
	app.get('/api/alluser', findAllUsers);

	app.post('/api/login', passport.authenticate('LocalStrategy'), login);
	app.post('/api/logout', logout);
	app.get ('/api/loggedin', loggedin);
	app.post('/api/register', register);

	app.get('/auth/google',
		passport.authenticate('google', { scope : ['profile', 'email'] }));

		app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		app.get('/auth/twitter',
			passport.authenticate('twitter'));


	app.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}));


	var googleConfig = {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL
	};

	var facebookConfig = {
		clientID : process.env.FACEBOOK_CLIENT_ID,
		clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
		callbackURL : process.env.FACEBOOK_CALLBACK_URL
	};

	var twitterConfig = {
		consumerKey: process.env.TWITTER_CONSUMER_ID,
		consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
		callbackURL: process.env.TWITTER_CALLBACK_URL
	};

	passport.use(new GoogleStrategy(googleConfig, googleStrategy));
passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
passport.use(new TwitterStrategy(twitterConfig, twitterStrategy));

	function googleStrategy(token, refreshToken, profile, done) {
		console.log(profile);

		model
			.findUserByGoogleId(profile.id)
			.then(
				function(user) {
					if(user) {
						return done(null, user);
					} else {
						var email = profile.emails[0].value;
						var emailParts = email.split("@");
						var newGoogleUser = {
							username:  emailParts[0],
							password: "0",
							firstName: profile.name.givenName,
							lastName:  profile.name.familyName,
							email:     email,
							google: {
								id:    profile.id,
								token: token
							}
						};
						return model
							.createUser(newGoogleUser);
					}
				},
				function(err) {
					if (err) { return done(err); }
				}
			)
			.then(
				function(user){
					return done(null, user);
				},
				function(err){
					if (err) { return done(err); }
				}
			);
	}

	function facebookStrategy(token, refreshToken, profile, done) {
		model
			.findUserByFacebookId(profile.id)
			.then(
				function(user) {
					if(user) {
						return done(null, user);
					} else {
					console.log(profile);
					// Facebook doesn't supply email with its profile json (at least
											// for me).
											// Uncomment the line below to check
											// console.log(profile);
						// var email = profile.emails[0].value;
						// var emailParts = email.split("@");
						var newFbUser = {
							username: "chiman",
							password: "0",
							firstName: "chimanbhai",
							lastName: "choti",
							email: "chiman@choti.com",
							// username:  profile.displayName.split(' ')[0],
							// password: "0",
							// firstName: profile.displayName.split(' ')[0],
							// lastName:  profile.displayName.split(' ')[1],
							// // email:     email,
							facebook: {
								id:    profile.id,
								token: token
							}
						};
						return model
							.createUser(newFbUser);
					}
				},
				function(err) {
					if (err) { return done(err); }
				}
			)
			.then(
				function(user){
					return done(null, user);
				},
				function(err){
					if (err) { return done(err); }
				}
			);
	}

	function twitterStrategy(token, refreshToken, profile, done) {
		model
			.findUserByTwitterId(profile.id)
			.then(
				function(user) {
					if(user) {
						return done(null, user);
					} else {
						// Twitter doesn't supply email with its profile json (at least
						// for me).
						// Uncomment the line below to check
						// console.log(profile);
						var newTwitterUser = {
							username: profile.screen_name,
							password: "0",
							firstName: profile.name,
							lastName:  profile.screen_name,
							// email:     email,
							twitter: {
								id:    profile.id,
								token: token
							}
						};
						return model
							.createUser(newTwitterUser);
					}
				},
				function(err) {
					if (err) { return done(err); }
				}
			)
			.then(
				function(user){
					return done(null, user);
				},
				function(err){
					if (err) { return done(err); }
				}
			);
	}


	passport.use('LocalStrategy', new LocalStrategy(localStrategy));
	passport.serializeUser(serializeUser);
	passport.deserializeUser(deserializeUser);

	function localStrategy(username, password, done) {
		model
			.findUserByUsername(username)
			.then(
				function(user) {
					if (user === null || user === undefined) {
						return done(null, false, {message: 'Sorry! User not found'})
					} else if(bcrypt.compareSync(password, user.password)) {
						return done(null, user);
					} else {
						console.log("Sorry! User not found");
						return done(null, false, {message: "Username and password don't match!"});
					}
				},
				function(err) {
					if (err) {
						console.log("error: " + err);
						return done(err);
					}
				}
			);
	}

	function serializeUser(user, done) {
		done(null, user);
	}

	function deserializeUser(user, done) {
		model
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

	function login(req, res) {
		var user = req.user;
		res.json(user);
	}

	function logout(req, res) {
		req.logout();
		res.sendStatus(200);
	}

	function loggedin(req, res) {
		res.send(req.isAuthenticated() ? req.user : '0');
	}

	function register(req, res) {
		var user = req.body;
		user.password = bcrypt.hashSync(user.password);
		model
			.createUser(user)
			.then(
				function (user) {
					req.login(user, function (status) {
						res.send(status);
					})
				}
			)
	}

	function createUser(req, res) {

		var user = req.body;
		user.password = bcrypt.hashSync(user.password);

		model
			.createUser(user)
			.then(
				function (newUser) {
					res.json(newUser);
				},
				function (error) {
					res.sendStatus(404).send(error);
				}
			);

	}

	function findUserByUsername (req, res) {

		var username = req.query.username;

		model
			.findUserByUsername(username)
			.then(
				function (users) {
					res.json(users);
				},
				function (error) {
					res.sendStatus(404).send(error);
				}
			)
	}

	function findAllUsers(req, res) {
		model
			.findAllUser()
			.then(
				function (users) {
					res.json(users);
				},
				function (error) {
					res.sendStatus(404).send(error);
				}
			)
	}

	function findUserById(req, res) {

		var params = req.params;

		if(params.uid){
			model
				.findUserById(params.uid)
				.then(
					function (user){
						if(user){
							res.json(user);
						} else {
							user = null;
							res.send(user);
						}
					},
					function (error){
						res.sendStatus(400).send(error);
					}
				);
		}

	}

	function updateUser(req,res) {
		var uid = req.params.uid;
		var user = req.body;
		model
			.updateUser(uid, user)
			.then(
				function (user){
					res.json(user)
				},
				function (error){
					res.sendStatus(400).send(error);
				}
			);

	}

	function deleteUser(req,res) {
		var uid = req.params.uid;
		if(uid){
			model
				.deleteUser(uid)
				.then(
					function (status){
						res.sendStatus(200);
					},
					function (error){
						res.sendStatus(400).send(error);
					}
				);
		} else{
			res.sendStatus(412);
		}

	}
};
