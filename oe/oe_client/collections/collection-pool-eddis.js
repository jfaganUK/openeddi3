/**
 * Created by jfagan on 3/24/15.
 * collection-pool-eddis.js
 */
"use strict";

var EddiModel = require('../models/model-eddi');

module.exports = Backbone.Collection.extend({
    model: EddiModel,

    url: function() {
        var currentPool = app.channels.pool.request('current-pool');
        var puid = currentPool.get('_puid');
        var poolid = currentPool.get('_poolid');
        return 'api/responses/' + poolid + '/' + puid + '/';
    },

    initialize: function() {
        this.createStore();
    }

});
