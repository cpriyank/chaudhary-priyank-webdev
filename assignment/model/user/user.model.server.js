var mongoose = require("mongoose");
var userSchema = require("./user.schema.server");
var userModel = mongoose.model("UserModel", userSchema);

userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findAllUsers = findAllUsers;
userModel.findUserByUsername = findUserByUsername;
userModel.findUserByGoogleId = findUserByGoogleId;
userModel.findUserByFacebookId = findUserByFacebookId;
userModel.findUserByTwitterId = findUserByTwitterId;
userModel.findUserByCredentials = findUserByCredentials;
userModel.updateUser = updateUser;
userModel.deleteUser = deleteUser;
userModel.addWebsite = addWebsite;
userModel.deleteWebsite = deleteWebsite;

module.exports = userModel;

function addWebsite(userId, websiteId) {
	return userModel
		.findById(userId)
		.then(function (user) {
			user.websites.push(websiteId);
			return user.save();
		});
}

function createUser(user) {
	if(user.roles) {
		var roleArray = user.roles.split(",");
		user.roles = roleArray;
	} else {
		user.roles = ['USER'];
	}
	return userModel.create(user);
}

function findUserById(userId) {
	return userModel.findById(userId);
}

function findAllUsers() {
	return userModel.find();
}

function findUserByUsername(username) {
	return userModel.findOne({username: username});
}

function findUserByGoogleId(googleId) {
	return userModel
		.findOne({'google.id': googleId});
}
function findUserByTwitterId(twitterId) {
	return userModel
		.findOne({'twitter.id': twitterId});
}

function findUserByFacebookId(facebookId) {
	return userModel
		.findOne({'facebook.id': facebookId});
}
function findUserByCredentials(username, password) {
	return userModel.findOne({username: username, password: password});
}

function updateUser(userId, newUser) {
	delete  newUser.username;
	delete  newUser.password;
	if(typeof newUser.roles === 'String') {
		newUser.roles = newUser.roles.split(',');
	}
	return userModel.update({_id: userId}, {$set: newUser});
}

function deleteUser(userId) {
	return userModel
		.remove({_id: userId});
}

function deleteWebsite(userId, websiteId) {
	return userModel
		.findById(userId)
		.then(function (user) {
			var index = user.websites.indexOf(websiteId);
			user.websites.splice(index, 1);
			return user.save();
		});
}

