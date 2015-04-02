/**
 * Created by jfagan on 3/24/15.
 * collection-pool-eddis.js
 */
"use strict";

var EddiModel = require('../models/model-eddi');

module.exports = Backbone.Collection.extend({
    model: EddiModel,

    url: function() {
        return 'api/responses/' + this.poolid + '/' + this.puid + '/';
    },

    initialize: function() {
        var currentPool = app.channels.pool.request('current-pool');
        this.puid = currentPool.get('puid');
        this.poolid = currentPool.get('poolid');
        this.createStore();
    }

});
