module.exports = function () {
    var model = {};
    var maxPriority;
    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);

    var SampleSchema = mongoose.Schema({
        name: String,
        priority: Number
    });

    var SampleModel = mongoose.model("SampleModel", SampleSchema);


    var api = {
        setModel: setModel,
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget
    };
    
    return api;
    
    function setModel(_model) {
        model = _model;
        WidgetModel.find().sort({priority: -1})
            .then(
                function (widgets) {
                    if(widgets.length > 0)
                        maxPriority = widgets[0].priority + 1;
                    else
                        maxPriority = 1;
                }
            );
    }
    
    function createWidget(pageId, widget) {
        widget.priority = maxPriority;
        maxPriority++;
        return model.pageModel
            .findPageById(pageId)
            .then(
                function (pageObj) {
                    WidgetModel
                        .create(widget)
                        .then(function (widgetObj) {
                            widgetObj._page = pageObj;
                            return widgetObj.save();
                        });
                }
            );
    }
    
    function findAllWidgetsForPage(pageId) {
        return model.pageModel
            .findPageById(pageId)
            .then(
                function (pageObj) {
                    return WidgetModel.find({_page: pageObj}).sort({priority: 1});
                }
            );
    }
    
    function findWidgetById(widgetId) {
        return WidgetModel.findById(widgetId);
    }
    
    function updateWidget(widgetId, widget) {
        return WidgetModel.update(
            {_id: widgetId},
            widget
        );
    }
    
    function deleteWidget(widgetId) {
        return WidgetModel.remove({_id: widgetId});
    }
    
    function reorderWidget(pageId, start, end) {
        return model.pageModel
            .findPageById(pageId)
            .then(
                function (pageObj) {
                    WidgetModel.find({_page: pageObj}).sort({priority: 1})
                        .then(
                            function (widgets) {
                                widgets[start].priority = widgets[end].priority;
                                widgets[start].save();
                                if(start < end) {
                                    for(var w in widgets) {
                                        if(w > start && w <= end) {
                                            widgets[w].priority--;
                                            widgets[w].save();
                                        }
                                    }
                                } else {
                                    for(var w in widgets) {
                                        if(w >= end && w < start) {
                                            widgets[w].priority++;
                                            widgets[w].save();
                                        }
                                    }
                                }
                            }
                        );
                }
            );
    }
};