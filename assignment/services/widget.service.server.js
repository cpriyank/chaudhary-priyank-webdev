module.exports = function(app, models){

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

    var model = models.widgetModel;

    app.post("/api/page/:pid/widget", createWidget);

    app.get("/api/page/:pid/widget", findAllWidgetsForPage);
    app.get("/api/widget/:wgid", findWidgetById);

    app.put("/api/widget/:wgid", updateWidget);

    app.delete("/api/page/:pid/widget/:wgid", deleteWidget);

    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    app.put("/api/page/:pid/widget", reorderWidgets);

    function createWidget(req, res) {
        var pid = req.params.pid;
        var widget = req.body;

        model
            .createWidget(pid, widget)
            .then(
                function (widget) {
                    if(widget){
                        res.json(widget);
                    } else {
                        widget = null;
                        res.send(widget);
                    }
                }
                ,
                function (error) {
                    res.sendStatus(400).send("error creating widget");
                }
            )
    }

    function findAllWidgetsForPage(req, res) {
        var pid = req.params.pid;

        model
            .findAllWidgetsForPage(pid)
            .then(
                function (widgets) {
                    if(widgets) {
                        res.json(widgets);
                    } else {
                        widgets = null;
                        res.send(widgets);
                    }
                }, function (error) {
                    res.sendStatus(400).send("error finding widgets");
                }
            )
    }

    function findWidgetById(req, res) {
        var wgid = req.params.wgid;

        model
            .findWidgetById(wgid)
            .then(
                function (widget) {
                    if (widget) {
                        res.json(widget);
                    } else {
                        widget = null;
                        res.send(widget);
                    }
                },
                function (error) {
                    res.sendStatus(400).send("error finding widget");
                }
            );

    }

    function updateWidget(req, res) {

        var wgid = req.params.wgid;
        var widget = req.body;

        model
            .updateWidget(wgid, widget)
            .then(
                function (widget) {
                    res.json(widget);
                },
                function (error) {
                    res.status(400).send("error updating widget");
                }
            );
    }

    function deleteWidget(req, res) {
        var pid = req.params.pid;
        var wgid = req.params.wgid;

        if(wgid){
            model
                .deleteWidget(pid, wgid)
                .then(
                    function (status){
                        res.sendStatus(200);
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        } else{
            res.sendStatus(412);
        }

    }

    function uploadImage(req, res) {

        var widgetId      = req.body.widgetId;
        var width         = req.body.width;

        var myFile        = req.file;

        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        // widget = getWidgetById(widgetId);
        var url = 'uploads/'+filename;

        // when try to create a new image
        if (widgetId === undefined || widgetId === null || widgetId === '') {
            var widget = {
                widgetType: "IMAGE",
                url: url,
                width: width
            };

            model
                .createWidget(pageId, widget)
                .then(
                    function (widget) {
                        if(widget){
                            res.json(widget);
                        } else {
                            widget = null;
                            res.send(widget);
                        }
                    }
                    ,
                    function (error) {
                        res.sendStatus(400).send("widget service server, upload error");
                    }
                )
        } else {
            model
                .findWidgetById(widgetId)
                .then(
                    function (widget) {
                        widget.url = url;
                        model.updateWidget(widgetId, widget)
                            .then(
                                function (widget) {
                                    res.json(widget);
                                },
                                function (error) {
                                    res.status(400).send("widget service server, updateWidget error");
                                }
                            )
                    },
                    function (error) {
                        res.status(400).send("Cannot find widget by id");
                    }
                )

        }

        var callbackUrl  = "/#!/website/"+websiteId+"/page/"+pageId+"/widget";
        res.redirect(callbackUrl);
    }

    function reorderWidgets(req, res) {
        var pageId = req.params.pid;


        var index1 = req.query.initial;
        var index2 = req.query.final;

        model
            .reorderWidget(pageId, index1, index2)
            .then(
                function (page) {
                    res.sendStatus(202);
                },
                function (error) {
                    res.status(400).send("Cannot reorder widgets");
                }
            )
    }

};