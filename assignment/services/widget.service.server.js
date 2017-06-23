module.exports = function (app) {
    var next_widget_id = 900;
    var widgets = [
        {"_id": 0, "widgetType": "HEADER", "widgetName": "Header", "type": true},
        {"_id": 1, "widgetType": "IMAGE", "widgetName": "Image", "type": true},
        {"_id": 2, "widgetType": "YOUTUBE", "widgetName": "YouTube", "type": true},
        {"_id": 3, "widgetType": "HTML", "widgetName": "HTML", "type": true},
        {"_id": 123, "widgetType": "HEADER", "pageId": 123, "size": 2, "text": "GIZMODO"},
        {"_id": 234, "widgetType": "HEADER", "pageId": 123, "size": 4, "text": "Lorem ipsum"},
        {
            "_id": 345, "widgetType": "IMAGE", "pageId": 123, "width": "100%",
            "url": "http://lorempixel.com/400/200/"
        },
        {"_id": 456, "widgetType": "HTML", "pageId": 123, "text": "<p>Lorem ipsum</p>"},
        {"_id": 567, "widgetType": "HEADER", "pageId": 123, "size": 4, "text": "Lorem ipsum"},
        {
            "_id": 678, "widgetType": "YOUTUBE", "pageId": 123, "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E"
        },
        {"_id": 789, "widgetType": "HTML", "pageId": 123, "text": "<p>Lorem ipsum</p>"}
    ];

    var multer = require('multer'); // npm install multer --save
    var mime = require('mime');
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../../public/assignment/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });
    var upload = multer({storage: storage});

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/type', getWidgetTypes);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.put('/page/:pageId/widget', sortWidget);


    function uploadImage(req, res) {
        var userId = parseInt(req.body.userId);
        var websiteId = parseInt(req.body.websiteId);
        var pageId = parseInt(req.body.pageId);
        var widgetId = parseInt(req.body.widgetId);
        var width = req.body.width;
        var myFile = req.file;

        var originalname = myFile.originalname; // file name on user's computer
        var filename = myFile.filename;     // new file name in upload folder
        var path = myFile.path;         // full path of uploaded file
        var destination = myFile.destination;  // folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;
        if (widgetId === 1) {
            // create new
            var newwidget = {}
            newwidget._id = next_widget_id;
            newwidget.pageId = pageId;
            newwidget.widgetType = "IMAGE";
            newwidget.width = width;
            newwidget.url = '/assignment/uploads/' + filename;
            widgets.push(newwidget);
            next_widget_id += 111;
            console.log("New image added");
        } else {
            for (var w in widgets) {
                if (widgets[w]._id === widgetId) {
                    widgets[w].width = width;
                    widgets[w].url = '/assignment/uploads/' + filename;
                    break;
                }
            }
        }
        res.redirect("/assignment/index.html#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/");
    }

    function createWidget(req, res) {
        var pageId = parseInt(req.params.pageId);
        var widget = req.body;
        newwidget = {}
        newwidget._id = next_widget_id;
        newwidget.pageId = pageId;
        newwidget.widgetType = widget.widgetType;
        switch (widget.widgetType) {
            case "HEADER":
                newwidget.text = widget.text;
                newwidget.size = widget.size;
                break;
            case "IMAGE":
                newwidget.width = widget.width;
                newwidget.url = widget.url;
                break;
            case "YOUTUBE":
                newwidget.width = widget.width;
                newwidget.url = widget.url;
                break;
            case "HTML":
                newwidget.text = widget.text;
                break;
        }
        widgets.push(newwidget);
        next_widget_id += 111;
        res.sendStatus(200);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = parseInt(req.params.pageId);
        var results = [];
        for (var w in widgets) {
            if (widgets[w].pageId === pageId) {
                results.push(widgets[w]);
            }
        }
        res.json(results);
    }

    function findWidgetById(req, res) {
        var widgetId = parseInt(req.params.widgetId);
        for (var w in widgets) {
            if (widgets[w]._id === widgetId) {
                res.json(widgets[w]);
                return;
            }
        }
        res.send(null);
    }

    function updateWidget(req, res) {
        var widgetId = parseInt(req.params.widgetId);
        var widget = req.body;
        for (var w in widgets) {
            if (widgets[w]._id == widgetId) {
                if (widgets[w].widgetType === "HEADER") {
                    widgets[w].size = widget.size;
                    widgets[w].text = widget.text;
                } else if (widgets[w].widgetType === "IMAGE" || widgets[w].widgetType === "YOUTUBE") {
                    widgets[w].url = widget.url;
                    widgets[w].width = widget.width;
                } else {
                    widgets[w].text = widget.text;
                }
                break;
            }
        }
        res.sendStatus(200);
    }

    function deleteWidget(req, res) {
        var widgetId = parseInt(req.params.widgetId);
        for (var w in widgets) {
            if (widgets[w]._id === widgetId) {
                widgets.splice(w, 1);
                break;
            }
        }
        res.sendStatus(200);
    }

    function getWidgetTypes(req, res) {
        var result = [];
        for (var w in widgets) {
            if (widgets[w].type)
                result.push(widgets[w]);
        }
        res.json(result);
    }

    function sortWidget(req, res) {
        var pageId = parseInt(req.params.pageId);
        var start = parseInt(req.query.initial);
        var end = parseInt(req.query.final);
        var pageToActualIndex = [];
        for (var w in widgets) {
            if (widgets[w].pageId === pageId) {
                pageToActualIndex.push(w);
            }
        }
        widgets.splice
        (pageToActualIndex[end]
            , 0
            , widgets.splice(pageToActualIndex[start], 1)[0]);
    }
};