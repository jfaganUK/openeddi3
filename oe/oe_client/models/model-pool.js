/**
 * Created by jfagan on 3/17/15.
 * model-pool.js
 */
"use strict";

var guid = require('../helpers/guid');
var EddiCollection = require('../collections/collection-pool-eddis');
var SheetColllection = require('../collections/collection-pool-sheets');

module.exports = Backbone.Model.extend({
    urlRoot: '/api/pool/',
    idAttribute: '_poolid',
    initialize: function(opts) {
        var self = this;
        this.set('_puid', guid());

        // First the model is initialized
        // Then when it's synced, it attempts to sync the eddis
        // When the eddis are synced it triggers an eddis-synced event (that's the event we are waiting for).
        this.on('sync', function() { app.channels.pool.trigger('pool-synced', self); });
        this.on('sync', _.bind(this.buildPoolLogic, this));

        app.channels.pool.reply('current-pool', this);
    },

    buildPoolLogic: function() {
        var self = this;
        this.eddis = new EddiCollection();
        this.sheets = new SheetColllection(this.toJSON().sheets);

        // The eddi data need to be created one-by-one so that they are saved to the server
        _.each(this.toJSON().eddis, function (e) {
            e.logic = JSON.stringify(e); // store the logic as a JSON string
            e.puid = self.get('_puid');
            self.eddis.create(e);
        });

        this.eddis.fetch();
        this.eddis.on('sync', function () {
            app.channels.pool.trigger('eddis-synced', self);
        });
    }
});
