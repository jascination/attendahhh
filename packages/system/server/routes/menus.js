'use strict';

var mean = require('meanio');

var databaseUrl = "mongodb://admin:balognom123@ds049878.mongolab.com:49878/attendahh"; // "username:password@example.com/mydb"

var collections = ["sessions"]

var db = require("mongojs").connect(databaseUrl, collections, {
    auto_reconnect: true,
    'poolSize': 50
});

var mongojs = require('mongojs');


module.exports = function(System, app, auth, database) {

    app.route('/admin/menu/:name')
        .get(function(req, res) {
            var roles = (req.user ? req.user.roles : ['anonymous']);
            var menu = req.params.name ? req.params.name : 'main';
            var defaultMenu = (req.query.defaultMenu ? req.query.defaultMenu : []);

            defaultMenu.forEach(function(item, index) {
                defaultMenu[index] = JSON.parse(item);
            });

            var items = mean.menus.get({
                roles: roles,
                menu: menu,
                defaultMenu: defaultMenu
            });

            res.json(items);
        });


    app.route('/saveTableData/:type')
        .post(function(req, res) {
            var data = req.body;
            var type = req.params.type;

            if (type === 'new') {

                db.sessions.find({
                        name: data.name
                    },

                    function(err, results) {
                        if (results.length) {
                            console.log("Found a duplicate");
                            res.send(500);
                        } else {
                            console.log(results);
                            console.log("It's a new one");
                            db.sessions.save(data,
                                function(err) {
                                    if (err) {
                                        console.log("There was an error updating session to Mongo");
                                        console.log(err);
                                        res.send(500);
                                    } else {
                                        console.log("Successfully updated session to Mongo");
                                        res.send(200);
                                    }
                                }
                            );
                        }
                    }
                );
            }

            if (type === 'upsert') {
                console.log(db);
                db.sessions.update({
                        name: data.name
                    }, data, {
                        upsert: true
                    },

                    function(err) {
                        if (err) {
                            console.log("There was an error updating session to Mongo");
                            console.log(err);
                            res.send(500);
                        } else {
                            console.log("Successfully updated session to Mongo");
                            res.send(200);
                        }
                    }
                );
            }


        });

};