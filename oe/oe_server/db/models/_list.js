/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/db/models/_list.js
 */

exports.User = require('./user').User;
exports.Pool = require('./pool').Pool;
exports.Response = require('./response').Response;
exports.AppState = require('./appstate').AppState;

// Add any oeModules with a model
var m = {},
    fileLoc = "";
for (var k in oeModules) {
    if (oeModules.hasOwnProperty(k)) {
        m = oeModules[k];
        if (m.hasOwnProperty('api')) {
            if (m.api.hasOwnProperty('dbmodel')) {
                fileLoc = appRoot + '/oe' + m.urlPath + '/' + m.api.dbmodel.file;
                exports[m.api.dbmodel.name] = require(fileLoc);
            }

        }

    }
}




