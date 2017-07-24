var mongoose = require("mongoose");
var widgetSchema = require("./widget.schema.server");
var widgetModel = mongoose.model("WidgetModel", widgetSchema);
var pageModel = require("../page/page.model.server");


module.exports = widgetModel;

widgetModel.createWidget = createWidget;
widgetModel.findAllWidgetsForPage = findAllWidgetsForPage;
widgetModel.findWidgetById = findWidgetById;
widgetModel.updateWidget = updateWidget;
widgetModel.deleteWidgetFromPage = deleteWidgetFromPage;
widgetModel.deleteWidgetsByPage = deleteWidgetsByPage;
widgetModel.reorderWidget = reorderWidget;


function reorderWidget(start, end, pageId) {
	return pageModel
		.findById(pageId)
		.then(function (page) {
			page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
			return page.save();
		});
}

function createWidget(pageId, widget) {
	widget._page = pageId;
	return widgetModel
		.create(widget)
		.then(function (widget) {
			pageModel
				.addWidget(pageId, widget._id);
			return widget;
		}, function (error) {
			console.log(error);
		});
}


function findAllWidgetsForPage(pageId) {
	return widgetModel
		.find({_page: pageId})
		.populate('_page')
		.exec();
}

function findWidgetById(widgetId) {
	return widgetModel
		.findById(widgetId);
}

function updateWidget(widgetId, widget) {
	delete  widget._page;
	return widgetModel
		.update({_id: widgetId}, {$set: widget});
}

function deleteWidgetFromPage(pageId, widgetId) {
	return widgetModel
		.remove({_id: widgetId})
		.then(function (status) {
			return pageModel
				.deleteWidget(pageId, widgetId);
		});
}

function deleteWidgetsByPage(pageId) {
	return widgetModel
		.remove({_page: pageId});
}