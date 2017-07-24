module.exports = function(app) {

	var connectionString =  null;

	if (process.env.MONGODB_URI) {
		var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
		var password = process.env.MLAB_PASSWORD_WEBDEV;
		connectionString = 'mongodb://' + username + ':' + password;
		connectionString += '@ds149221.mlab.com:49221/heroku_4l46z2vg';
	}
	else
	{
		connectionString = 'mongodb://localhost/web_dev'
	}

	var mongoose = require('mongoose');
	mongoose.connect(connectionString, {useMongoClient: true});

	mongoose.Promise = require('q').Promise;

	require("./services/user.service.server.js")(app);
	require("./services/website.service.server.js")(app);
	require("./services/page.service.server.js")(app);
	require("./services/widget.service.server.js")(app);
};
