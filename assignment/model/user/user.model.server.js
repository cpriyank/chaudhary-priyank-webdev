module.exports = function(mongoose){
	var userSchema = require("./user.schema.server")(mongoose);
	var userModel = mongoose.model("userModel", userSchema);

	var api = {
		'createUser' : createUser,
		'findUserById' : findUserById,
		'findUserByUsername' : findUserByUsername,
		'findUserByCredentials' : findUserByCredentials,
		'updateUser' : updateUser,
		'removeWebsiteFromUser' : removeWebsiteFromUser,
		'addWebsiteForUser' : addWebsiteForUser,
		'deleteUser' : deleteUser,
		'findAllUser' : findAllUser,
		'findUserByGoogleId' : findUserByGoogleId,
		'findUserByTwitterId' : findUserByTwitterId,
		'findUserByFacebookId' : findUserByFacebookId
	};

	return api;

	function createUser(user){
		user.roles = ['USER'];
		user.websites = [];
		return userModel.create(user);
	}

	function findUserById(userId){
		return userModel.findOne({_id: userId});
	}

	function findUserByUsername(uname){
		return userModel.findOne({username : uname})
	}

	function findUserByCredentials(uname, pswrd){
		return userModel.findOne({
			username : uname,
			password : pswrd
		});
	}

	function updateUser(userId, user){
		return userModel.update({
			_id : userId
		}, {
			firstName : user.firstName,
			lastName : user.lastName,
			email : user.email,
			phone : user.phone
		});
	}

	function removeWebsiteFromUser(userId, websiteId){
		userModel
			.findOne({_id: userId})
			.then(
				function(user){
					var index = user.websites.indexOf(websiteId);
					user.websites.splice(index, 1);
					return user.save();
				},
				function(error){
					console.log(error);
				}
			);
	}

	function addWebsiteForUser(userId, websiteId) {
		return userModel
			.findOne({_id: userId})
			.then(function (user) {
				user.websites.push(websiteId);
				return user.save();
			});
	}

	function deleteUser(userId){
		return userModel.remove({
			_id : userId
		});
	}

	function findAllUser() {
		return userModel.find();
	}

	function findUserByTwitterId(twitterId) {
		return userModel.findOne({'twitter.id': twitterId});
	}

	function findUserByFacebookId(facebookId) {
		return userModel.findOne({'facebook.id': facebookId});
	}

	function findUserByGoogleId(googleId) {
		return userModel.findOne({'google.id' : googleId});
	}
};