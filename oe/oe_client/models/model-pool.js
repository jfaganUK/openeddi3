/**
 * Created by jfagan on 3/17/15.
 * oe/oe_client/models/model-pool.js
 */
"use strict";

var guid = require('../helpers/guid');
var EddiCollection = require('../collections/collection-pool-eddis');
var SheetColllection = require('../collections/collection-pool-sheets');

module.exports = Backbone.Model.extend({
    defaults: {
        poolstatus: {},
        sheetindex: -1,
        poolid: "",
        poologic: {},
        sheetlogic: {}
    },
    urlRoot: function() {
        return '/api/pool/' + this.attributes.poolid + '/';
    },
    idAttribute: 'puid',
    initialize: function() {
        var self = this;
        this.set('puid', guid());

        // Make sure to keep the current pool and the app state in sync
        app.appState.set('puid', this.get('puid'));

        // First the model is initialized
        // Then when it's synced, it attempts to sync the eddis
        // When the eddis are synced it triggers an eddis-synced event (that's the event we are waiting for).
        this.on('sync', function () {
            app.channels.pool.trigger('pool-synced', self);
        });
        this.once('sync', _.bind(this.buildPoolLogic, this));

        app.channels.pool.reply('current-pool', this);
    },

    buildPoolLogic: function() {
        var self = this;
        this.eddis = new EddiCollection();
        this.sheets = new SheetColllection(this.toJSON().sheetlogic);

        // The sheetid is supposed to be a string. But if it receives a "1" from the server it will
        // coerce it to a Number automatically
        var sheets = this.get('sheetlogic');
        _.each(sheets, function (sht) {
            if (_.isNumber(sht.sheetid)) {
                sht.sheetid = sht.sheetid.toString();
            }
        });

        // Mostly for the pool footer
        this.set('poolLength', this.get('poollogic').sheetOrder.length);

        // If it's a new pool, then create the question logic for everything
        // It also saves it to the server.
        // Otherwise, fetch the question data and then announce when it's done
        if(app.appState.get('newpool')) {
            app.appState.set('newpool', false);
            _.each(this.toJSON().eddilogic, function (e) {
                e.logic = JSON.stringify(e); // store the logic as a JSON string
                e.puid = self.get('puid');
                e.poolid = self.get('poolid');
                self.eddis.create(e);
            });
            // They might not really be synced with the server, but it doesn't matter yet.
            app.channels.pool.trigger('eddis-synced', self);
        } else {
            $.when(self.eddis.fetch()).done(function() {
                // TODO: This needs to be more graceful, it's hacky right now
                // I want some way to test if there's an existing pool with data before reaching this point
                if (self.eddis.length === 0) {
                    app.appState.set('newpool', true);
                    self.buildPoolLogic();
                }
                self.eddis.each(function (e) {
                    e.restoreLogic();
                });
                app.channels.pool.trigger('eddis-synced', self);
            });
        }

    }
});
