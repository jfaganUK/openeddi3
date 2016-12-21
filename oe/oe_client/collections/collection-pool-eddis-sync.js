/**
 * Created by jfagan on 3/24/15.
 * collection-pool-eddis.js
 */
"use strict";

var EddiModel = require('../models/model-eddi');

module.exports = Backbone.Collection.extend({
    model: EddiModel,

    url: function() {
        return 'api/responses/' + this.poolid + '/' + this.puid;
    },

    initialize: function(poolid, puid) {
        this.poolid = poolid;
        this.puid = puid;
        this.createStore();
    },

    comparator: function (e) {
        return e.get('sortIndex');
    }

});
