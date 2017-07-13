module.exports = function () {
    var mongoose = require('mongoose');

    var connectionString = 'mongodb://127.0.0.1:27017/webdev';

    if(process.env.NODE_ENV == "production") {
        connectionString = "mongodb://heroku_4l46z2vg:s27f4o6t21svjqf1j6bf38ast9@ds149221.mlab.com:49221/heroku_4l46z2vg";
    }

    mongoose.connect(connectionString);

    var userModel = require("./user/user.model.server")();
    var websiteModel = require("./website/website.model.server")();
    var pageModel = require("./page/page.model.server")();
    var widgetModel = require("./widget/widget.model.server")();

    var model = {
        userModel: userModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel
    };

    websiteModel.setModel(model);
    pageModel.setModel(model);
    widgetModel.setModel(model);

    return model;
};