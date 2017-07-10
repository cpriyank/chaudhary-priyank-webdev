module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);

    var api = {
        setModel: setModel,
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
    };

    return api;

    function setModel(_model) {
        model = _model;
    }

    function createWebsiteForUser(userId, website) {
        return WebsiteModel
            .create(website)
            .then(
                function (websiteObj) {
                    model.userModel
                        .findUserById(userId)
                        .then(
                            function (userObj) {
                                userObj.websites.push(websiteObj);
                                websiteObj._user = userObj;
                                websiteObj.save();
                                return userObj.save();
                            }
                        );
                }
            );
    }

    function findAllWebsitesForUser(userId) {
        return model.userModel
            .findUserById(userId)
            .then(
                function (userObj) {
                    return WebsiteModel.find({_user: userObj});
                }
            );
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }

    function updateWebsite(websiteId, website) {
        return WebsiteModel.update(
            {_id: websiteId},
            website
        );
    }

    function deleteWebsite(websiteId) {
        return WebsiteModel.remove({_id: websiteId});
    }
};