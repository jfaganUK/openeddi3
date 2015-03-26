/**
 * Created by jfagan on 3/24/15.
 * collection-pool-sheets.js
 */

var Sheet = require('../models/model-sheet');
module.exports = Backbone.Collection.extend({
    model: Sheet,
    url: '/sheet/',
    sync: function () {
        // For now, there really isn't anything the 'sheet' actually syncs with the server.
        // It's just for managing in-memory processes
    }
});
