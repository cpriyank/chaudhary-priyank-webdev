module.exports = function () {
    var mongoose = require('mongoose');

    var connectionString = 'mongodb://127.0.0.1:27017/webdev';

    if(process.env.NODE_ENV) {
        connectionString = "mongodb://heroku_4l46z2vg:s27f4o6t21svjqf1j6bf38ast9@ds149221.mlab.com:49221/heroku_4l46z2vg";
    }

    mongoose.connect(connectionString);
		mongoose.Promise = require('q').Promise;
};
