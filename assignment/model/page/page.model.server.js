module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")();
    var PageModel = mongoose.model("PageModel", PageSchema);

    var api = {
        setModel: setModel,
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage
    };
    
    return api;
    
    function setModel(_model) {
        model = _model;
    }
    
    function createPage(websiteId, page) {
        return model.websiteModel
            .findWebsiteById(websiteId)
            .then(
                function (websiteObj) {
                    PageModel.create(page)
                        .then(
                            function (pageObj) {
                                pageObj._website = websiteObj;
                                return pageObj.save();
                            }
                        );
                }
            );
    }
    
    function findAllPagesForWebsite(websiteId) {
        return model.websiteModel
            .findWebsiteById(websiteId)
            .then(
                function (websiteObj) {
                    return PageModel.find({_website: websiteObj})
                }
            );
    }
    
    function findPageById(pageId) {
        return PageModel.findById(pageId);
    }
    
    function updatePage(pageId, page) {
        return PageModel.update(
            {_id: pageId},
            page
        );
    }
    
    function deletePage(pageId) {
        return PageModel.remove({_id: pageId});
    }
};