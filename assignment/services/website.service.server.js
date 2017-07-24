module.exports = function(app) {

	var websiteModel = require("../model/website/website.model.server");

	app.post("/api/user/:userId/website", createWebsiteForUser);
	app.get("/api/user/:userId/website", findAllWebsitesForUser);
	app.get("/api/website/:websiteId", findWebsiteById);
	app.put("/api/website/:websiteId", updateWebsite);
	app.delete("/api/user/:userId/website", deleteWebsitesByUser);
	app.delete("/api/user/:userId/website/:websiteId", deleteWebsiteFromUser);



	function createWebsiteForUser(req, res) {
		var userId = req.params.userId;
		var website = req.body;
		websiteModel
			.createWebsiteForUser(userId, website)
			.then(function (website) {
				res.send(website);
			});
	}

	function findAllWebsitesForUser(req, res) {
		var userId = req.params.userId;
		websiteModel
			.findAllWebsitesForUser(userId)
			.then(function (websites) {
				res.send(websites);
			});
	}

	function findWebsiteById(req, res) {
		var websiteId = req.params.websiteId;
		websiteModel
			.findWebsiteById(websiteId)
			.then(function (website) {
				res.send(website);
			});
	}

	function updateWebsite(req, res) {
		var websiteId = req.params.websiteId;
		var website = req.body;

		websiteModel
			.updateWebsite(websiteId, website)
			.then(function (status) {
				res.send(status);
			});
	}

	function deleteWebsiteFromUser(req, res) {
		var websiteId = req.params.websiteId;
		var userId = req.params.userId;
		websiteModel
			.deleteWebsiteFromUser(userId, websiteId)
			.then(function (status) {
				res.send(status);
			});
	}

	function deleteWebsitesByUser(req, res) {
		var userId = req.params.userId;
		websiteModel
			.deleteWebsitesByUser(userId)
			.then(function (status) {
				res.send(status);
			});
	}
}


