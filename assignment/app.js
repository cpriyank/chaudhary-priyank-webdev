module.exports = function(app) {

    var connectionString =  null;

    if (process.env.NODE_ENV) {
        connectionString = 'mongodb://heroku_4l46z2vg:s27f4o6t21svjqf1j6bf38ast9@ds149221.mlab.com:49221/heroku_4l46z2vg';
    }
        else
    {
        connectionString = 'mongodb://localhost/web_dev'
    }

    var mongoose = require('mongoose');
    mongoose.connect(connectionString);

    mongoose.Promise = require('q').Promise;

    require("./services/user.service.server.js")(app);
    require("./services/website.service.server.js")(app);
    require("./services/page.service.server.js")(app);
    require("./services/widget.service.server.js")(app);
};


