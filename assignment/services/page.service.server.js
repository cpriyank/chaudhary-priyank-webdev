module.exports = function(app) {
    var next_page_id = 456;
    var pages = [
        { "_id": 123, "name": "Post 1", "websiteId": 456, "description": "Lorem" },
        { "_id": 234, "name": "Post 2", "websiteId": 456, "description": "Lorem" },
        { "_id": 345, "name": "Post 3", "websiteId": 456, "description": "Lorem" }
    ];

    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage)

// API Calls
    function createPage(req, res) {
        var websiteId = parseInt(req.params.websiteId);
        var page = req.body;
        page._id = next_page_id;
        page.websiteId = websiteId;
        pages.push(page);
        next_page_id += 111;
        res.sendStatus(200);
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = parseInt(req.params.websiteId);
        var result = [];
        for(var p in pages) {
            if(pages[p].websiteId === websiteId)
                result.push(pages[p]);
        }
        res.json(result);
    }

    function findPageById(req, res) {
        var pageId = parseInt(req.params.pageId);
        for(var p in pages) {
            if(pages[p]._id === pageId) {
                res.json(pages[p]);
                return;
            }
        }
        res.send(null);
    }

    function updatePage(req, res) {
        var pageId = parseInt(req.params.pageId);
        var page = req.body;
        for(var p in pages) {
            if(pages[p]._id === pageId) {
                pages[p].name = page.name;
                pages[p].description = page.description;
                break;
            }
        }
        res.sendStatus(200);
    }

    function deletePage(req, res) {
        var pageId = parseInt(req.params.pageId);
        for (var p in pages) {
            if (pages[p]._id === pageId) {
                pages.splice(p, 1);
                break;
            }
        }
        res.sendStatus(200);
    }
};