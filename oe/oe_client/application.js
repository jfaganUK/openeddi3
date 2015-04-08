/**
 * Created by jfagan on 3/7/15.
 * application.js
 */
"use strict";

var LandingView = require('./layouts/layout-landing');
var guid = require('./helpers/guid');

var App = Marionette.Application.extend({
    initialize: function(opts) {
        this.regions = {};
        this.layouts = {};
        this.views = {};
        this.models = {};
        this.channels = {};
        this.collections = {};

        this.registerRadioChannels();
        this.listenRadioChannels();
    },

    listenRadioChannels: function() {
        this.channels.navigation.comply('load-landing', this.loadLanding, this);
        this.channels.navigation.comply('load-pool', this.loadPool, this);
        this.channels.navigation.comply('new-pool', this.newPool, this);

        // Save the models when the response is updated
        this.channels.response.on('response-updated', function(e) {
            console.log('-- Response Updated: ' + e.attributes.eid);
            e.save();
        });
    },

    registerRadioChannels: function() {
        // Navigation channel. Listen how the user moves around the site.
        this.channels.navigation = Backbone.Radio.channel('navigation');
        // Respondent channel. Listen to events on the respondent activity.
        this.channels.respondent = Backbone.Radio.channel('respondent');
        // Pool channel. Events related to the oe pool.
        this.channels.pool = Backbone.Radio.channel('pool');
        // Response channel. Events, commands, and data for when the user provides responses to the eddis.
        this.channels.response = Backbone.Radio.channel('response');

        // For debugging, let's listen on on the events
        Backbone.Radio.tuneIn('navigation');
        Backbone.Radio.tuneIn('respondent');
        Backbone.Radio.tuneIn('pool');
        Backbone.Radio.tuneIn('response');
    },

    loadLanding: function() {
        var landingView = new LandingView;
        this.appSpace.show(landingView);

        // Grab the existing pools
        var PoolListingsCollection = require('./collections/collection-pool-listings');
        var poolListingsCollection = new PoolListingsCollection();
        poolListingsCollection.fetch();

        var PoolListingsView = require('./views/view-landing-pool-listings'),
            poolListingsView = {};

        poolListingsCollection.on('sync', function () {
            console.log('--- PoolListingsSynced');
            poolListingsView = new PoolListingsView({collection: this});
            landingView.pools.show(poolListingsView);
        });
    },

    newPool: function(e) {
        app.appState.set('newpool', true);
        app.appState.set('poolid', e.poolid);
        this.loadPool(e);
    },

    loadPool: function(e) {
        var PoolModel = require('./models/model-pool');
        var poolid = e.poolid;

        // If the load-pool-sheet command was complied with, then there will be a sheetid property
        if(e.sheetid) {
            app.appState.set({sheetid: e.sheetid});
            app.appState.save();
        }

        // Note this will load the logic of the pool, but not any prior existing responses
        // Set the id of the pool model so that it fetches from localStorage if possible
        // If the data is already in localstorage it will load that.
        this.currentPool = new PoolModel();
        this.currentPool.set('poolid', poolid);
        if(e.puid) { this.currentPool.set('puid', e.puid) }
        this.currentPool.fetch();
        app.channels.pool.once('eddis-synced', _.bind(this.prepPoolLaunch, this));
    },

    prepPoolLaunch: function() {

        // Set the appState variables
        if (!this.appState.get('poolid')) {
            this.appState.set('poolid', this.currentPool.get('poolid'));
        }

        if (!this.appState.get('puid')) {
            this.appState.set('puid', this.currentPool.get('puid'));
        }

        // Start the pool at the previous sheet index, unless there isn't a previous, in which case start at the beginning
        var sheetid = this.appState.get('sheetid');
        if (!sheetid) {
            sheetid = this.currentPool.get('pool').sheetOrder[0];
            this.appState.set('sheetid', sheetid);
        }

        app.appState.set('page', 'pool');

        var PoolView = require('./layouts/layout-pool');
        this.poolView = new PoolView;
        this.appSpace.show(this.poolView);

        this.loadSheet();
    },

    loadSheet: function(e) {

        if(!this.currentPool) {
            this.loadPool(e);
        } else {
            // Change the url
            app.router.navigate('pool/' + app.appState.get('poolid') + '/' + app.appState.get('puid') + '/sheet/' + this.appState.get('sheetid'));

            var SheetView = require('./layouts/layout-sheet');
            var sheetid = this.appState.get('sheetid');
            this.poolView.sheetView = new SheetView;
            this.poolView.sheet.show(this.poolView.sheetView);
        }
    },

    // From http://stackoverflow.com/questions/2384167/check-if-internet-connection-exists-with-javascript
    // Slightly modifed. It allows for a 401 response (just means we aren't logged in)
    // If there is an error it returns false
    // Does not use jQuery so it shouldn't mix up with the login or backbone code
    hostReachable: function () {
        // Handle IE and more capable browsers
        var xhr = new ( window.ActiveXObject || XMLHttpRequest )("Microsoft.XMLHTTP");
        var status;

        // Open new request as a HEAD to the root hostname with a random param to bust the cache
        xhr.open("HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false);

        // Issue request and handle response
        try {
            xhr.send();
            return ( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 401);
        } catch (error) {
            return false;
        }
    }
});

var app = new App();

app.addRegions({
    appSpace: '#app-space'
});

module.exports = app;



