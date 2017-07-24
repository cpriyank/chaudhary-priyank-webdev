var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: {type: String, unique: true},
	password: String,
	firstName: String,
	lastName: String,
	roles: [{type: String,
		default: 'USER',
		enum: ['USER', 'FACULTY', 'STUDENT', 'ADMIN']}],
	google: {
		id: String,
		token: String
	},
	facebook: {
		id: String,
		token: String
	},
	twitter: {
		id: String,
		token: String
	},
	email: String,
	phone: String,
	websites: [{type: mongoose.Schema.Types.ObjectId, ref: "WebsiteModel"}],
	dateCreated: {type: Date, default: Date.now()}
}, {collection: "user"});


module.exports = userSchema;