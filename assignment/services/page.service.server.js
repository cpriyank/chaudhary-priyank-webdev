module.exports = function(app) {

	var pageModel = require("../model/page/page.model.server");

	app.post("/api/website/:websiteId/page", createPage);
	app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
	app.get("/api/page/:pageId", findPageById);
	app.put("/api/page/:pageId", updatePage);
	app.delete("/api/website/:websiteId/page/:pageId", deletePageFromWebsite);
	app.delete("/api/website/:websiteId/page", deletePagesByWebsite);

	function createPage(req, res) {
		var websiteId = req.params.websiteId;
		var page = req.body;
		pageModel
			.createPage(websiteId, page)
			.then(function (page) {
				res.send(page);
			});
	}

	function findAllPagesForWebsite(req, res) {
		var websiteId = req.params.websiteId;
		pageModel
			.findAllPagesForWebsite(websiteId)
			.then(function (pages) {
				res.send(pages);
			});
	}

	function findPageById(req, res) {
		var pageId = req.params.pageId;
		pageModel
			.findPageById(pageId)
			.then(function (page) {
				res.send(page);
			});
	}

	function updatePage(req, res) {
		var pageId = req.params.pageId;
		var page = req.body;
		pageModel
			.updatePage(pageId, page)
			.then(function (status) {
				res.send(status);
			});
	}

	function deletePageFromWebsite(req, res) {
		var pageId = req.params.pageId;
		var websiteId = req.params.websiteId;
		pageModel
			.deletePageFromWebsite(websiteId, pageId)
			.then(function (status) {
				res.send(status);
			});
	}

	function deletePagesByWebsite(req, res) {
		var websiteId = req.params.websiteId;
		pageModel
			.deletePagesByWebsite(websiteId)
			.then(function (status) {
				res.send(status);
			});
	}
}
