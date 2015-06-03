/**
 * Created by jfagan on 3/9/15.
 * oe/oe_server/api/index.js
 */

var express = require('express');
var _ = require('lodash');
var bodyParser = require('body-parser');
var fs = require('fs');
var log = require('util').log;
var guid = require('../../oe_client/helpers/guid');

module.exports = function (app) {

    // Set up the API
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    var router = express.Router();
    app.use('/api', router);

    router.get('/', function (req, res) {
        res.json({message: 'the OpenEddi API is working.'});
    });

    router.route('/appstate/:id')
        .get(function(req, res) {
            res.json({});
        })
        .post(function (req, res) {
            res.json({message: 'success'});
        })
        .put(function(req, res) {
            res.json({message: 'success'});
        });

    require('./api-responses')(router);
    require('./api-pool-listings')(router);
    require('./api-pool-respondent')(router);
    require('./api-user-auth')(router);

    // OE Modules with APIs
    var m = {},
        fileLoc = "";
    for (var k in oeModules) {
        if (oeModules.hasOwnProperty(k)) {
            m = oeModules[k];
            if (m.hasOwnProperty('api')) {
                if (m.api.hasOwnProperty('crud')) {
                    fileLoc = appRoot + '/oe' + m.urlPath + '/' + m.api.crud.file;
                    require(fileLoc)(router);
                }

            }

        }
    }

    return app;
};
