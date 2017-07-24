module.exports = function(app, models){


    var model = models.websiteModel;

    app.post('/api/user/:uid/website',createWebsite);

    app.get('/api/user/:uid/website',findAllWebsitesForUser);
    app.get('/api/website/:wid',findWebsiteById);

    app.put('/api/website/:wid',updateWebsite);

    app.delete('/api/user/:uid/website/:wid',deleteWebsite);

    function createWebsite(req, res) {
        var uid = req.params.uid;
        var website = req.body;


        model
            .createWebsiteForUser(uid, website)
            .then(
                function (website) {
                    if(website){
                        res.json(website);
                    } else {
                        website = null;
                        res.send(website);
                    }
                }
                ,
                function (error) {
                    res.sendStatus(400).send("website service server, createWebsiteForUser error");
                }
            )

    }

    function findAllWebsitesForUser(req, res) {
        var uid = req.params.uid;

        model
            .findAllWebsitesForUser(uid)
            .then(
                function (websites) {
                    if(websites) {
                        res.json(websites);
                    } else {
                        websites = null;
                        res.send(websites);
                    }
                },
                function (error) {
                    res.sendStatus(400).send("website service server, findAllWebsitesForUser error");
                }
            )

    }

    function findWebsiteById(req, res) {
        var wid = req.params.wid;

        model
            .findWebsiteById(wid)
            .then(
                function (website) {
                    if(website) {
                        res.json(website);
                    } else {
                        website = null;
                        res.send(website);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )


    }

    function updateWebsite(req, res) {

        var wid = req.params.wid;
        var website = req.body;

        model
            .updateWebsite(wid, website)
            .then(
                function (website){
                    res.json(website)
                },
                function (error){
                    res.sendStatus(400).send("website service server, updateWebsite error");
                }
            );

    }

    function deleteWebsite(req, res) {
        var uid = req.params.uid;
        var wid = req.params.wid;

        if(wid){
            model
                .deleteWebsite(uid, wid)
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
};