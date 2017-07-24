var mongoose = require("mongoose");
var websiteSchema = require("./website.schema.server");
var websiteModel = mongoose.model("WebsiteModel", websiteSchema);
var userModel = require("../user/user.model.server");

module.exports = websiteModel;

websiteModel.createWebsiteForUser = createWebsiteForUser;
websiteModel.findAllWebsitesForUser = findAllWebsitesForUser;
websiteModel.findWebsiteById = findWebsiteById;
websiteModel.updateWebsite = updateWebsite;
websiteModel.deleteWebsite = deleteWebsite;
websiteModel.deleteWebsiteFromUser = deleteWebsiteFromUser;
websiteModel.deleteWebsitesByUser = deleteWebsitesByUser;
websiteModel.addPage = addPage;
websiteModel.deletePage = deletePage;

function deletePage(websiteId, pageId) {
	return websiteModel
		.findById(websiteId)
		.then(function (website) {
			var index = website.pages.indexOf(pageId);
			website.pages.splice(index, 1);
			return website.save();
		});
}

function addPage(websiteId, pageId) {
	return websiteModel
		.findById(websiteId)
		.then(function (website) {
			website.pages.push(pageId);
			return website.save();
		});
}

function createWebsiteForUser(userId, website) {
	website._user = userId;
	return websiteModel
		.create(website)
		.then(function (website) {
			return userModel
				.addWebsite(userId, website._id);
		});
}

function findAllWebsitesForUser(userId) {
	return websiteModel
		.find({_user: userId})
		.populate('_user')
		.exec();
}

function findWebsiteById(websiteId) {
	return websiteModel
		.findById(websiteId);
}

function updateWebsite(websiteId, website) {
	delete  website._user;
	return websiteModel.update({_id: websiteId}, {$set: website});
}

function deleteWebsite(websiteId) {
	return websiteModel
		.remove({_id: websiteId});
}

function deleteWebsiteFromUser(userId, websiteId) {
	return websiteModel
		.remove({_id: websiteId})
		.then(function (status) {
			return userModel
				.deleteWebsite(userId, websiteId);
		});
}

function deleteWebsitesByUser(userId) {
	return websiteModel
		.remove({_user: userId});
}