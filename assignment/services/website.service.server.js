module.exports = function (app) {
    // console.log("Hello from Website service");
    var next_website_id = 900;
		// data to initialize the websites array
    var websites = [
        {"_id": 123, "name": "Facebook", "developerId": 456, "description": "Lorem"},
        {"_id": 234, "name": "Tweeter", "developerId": 456, "description": "Lorem"},
        {"_id": 456, "name": "Gizmodo", "developerId": 456, "description": "Lorem"},
        {"_id": 567, "name": "Tic Tac Toe", "developerId": 123, "description": "Lorem"},
        {"_id": 678, "name": "Checkers", "developerId": 123, "description": "Lorem"},
        {"_id": 789, "name": "Chess", "developerId": 234, "description": "Lorem"}
    ];

    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);

// API calls
    function createWebsite(req, res) {
        var website = req.body;
        var userId = parseInt(req.params.userId);
        website._id = next_website_id;
        website.developerId = userId;
        next_website_id += 111;
        websites.push(website);
        res.sendStatus(200);
    }

    function findAllWebsitesForUser(req, res) {
        var userId = parseInt(req.params.userId);
        var result = [];
        for (var w in websites) {
            if (websites[w].developerId === userId)
                result.push(websites[w])
        }
        res.json(result);
    }

    function findWebsiteById(req, res) {
        var websiteId = parseInt(req.params.websiteId);
        for (var w in websites) {
            if (websites[w]._id === websiteId) {
                res.json(websites[w]);
                return;
            }
        }
        res.send(null);
    }

    function updateWebsite(req, res) {
        var websiteId = parseInt(req.params.websiteId);
        var website = req.body;
        for(var w in websites) {
            if(websites[w]._id === websiteId) {
                websites[w].name = website.name;
                websites[w].description = website.description;
                break;
            }
        }
        res.sendStatus(200);
    }

    function deleteWebsite(req, res) {
        var websiteId = parseInt(req.params.websiteId);
        for(var w in websites) {
            if (websites[w]._id == websiteId) {
                websites.splice(w, 1);
                break;
            }
        }
        res.sendStatus(200);
    }
};