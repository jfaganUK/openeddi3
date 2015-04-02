/**
 * Created by jfagan on 3/19/15.
 * model-sheet.js
 */
"use strict";

module.exports = Backbone.Model.extend({
    urlRoot: '/api/sheet/',
    idAttribute: 'sheetid',
    initialize: function(opts) {
        var self = this;
        this.on('sync', function() {
            app.channels.pool.trigger('sheet-synced', self);
        })
    }
});
