module.exports = function(mongoose) {

var connectionString = 'mongodb://127.0.0.1:27017/webdev';


    if(process.env.NODE_ENV == "production") {
        connectionString = "mongodb://heroku_4l46z2vg:s27f4o6t21svjqf1j6bf38ast9@ds149221.mlab.com:49221/heroku_4l46z2vg";
    }

    mongoose.connect(connectionString, {useMongoClient: true});
    mongoose.Promise = require('q').Promise;

    var userModel = require("./user/user.model.server")(mongoose);
    var websiteModel = require("./website/website.model.server")(mongoose, userModel);
    var pageModel =  require("./page/page.model.server")(mongoose, websiteModel);
    var widgetModel = require("./widget/widget.model.server")(mongoose, pageModel);

    var models = {
        userModel : userModel,
        websiteModel : websiteModel,
        pageModel : pageModel,
        widgetModel : widgetModel
    };

    return models;
};
