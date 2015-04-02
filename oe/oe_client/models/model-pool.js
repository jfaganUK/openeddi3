/**
 * Created by jfagan on 3/17/15.
 * oe/oe_client/models/model-pool.js
 */
"use strict";

var guid = require('../helpers/guid');
var EddiCollection = require('../collections/collection-pool-eddis');
var SheetColllection = require('../collections/collection-pool-sheets');

module.exports = Backbone.Model.extend({
    urlRoot: function() {
        return '/api/pool/' + this.attributes.poolid + '/';
    },
    idAttribute: 'puid',
    initialize: function() {
        var self = this;
        this.set('puid', guid());

        // First the model is initialized
        // Then when it's synced, it attempts to sync the eddis
        // When the eddis are synced it triggers an eddis-synced event (that's the event we are waiting for).
        this.on('sync', function() { app.channels.pool.trigger('pool-synced', self); });
        this.once('sync', _.bind(this.buildPoolLogic, this));

        app.channels.pool.reply('current-pool', this);
    },

    buildPoolLogic: function() {
        var self = this;
        this.eddis = new EddiCollection();
        this.sheets = new SheetColllection(this.toJSON().sheets);

        // If it's a new pool, then create the question logic for everything
        // It also saves it to the server.
        // Otherwise, fetch the question data and then announce when it's done
        if(app.appState.get('newpool')) {
            app.appState.set('newpool', false);
            _.each(this.toJSON().eddis, function (e) {
                e.logic = JSON.stringify(e); // store the logic as a JSON string
                e.puid = self.get('puid');
                e.poolid = self.get('poolid');
                self.eddis.create(e);
            });
            // They might not really be synced with the server, but it doesn't matter yet.
            app.channels.pool.trigger('eddis-synced', self);
        } else {
            $.when(self.eddis.fetch()).done(function() {
                app.channels.pool.trigger('eddis-synced', self);
            });
        }

    }
});
