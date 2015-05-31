/**
 * Created by jfagan on 3/7/15.
 * application.js
 */
"use strict";

var async = require('async');
var LandingView = require('./layouts/layout-landing');
var guid = require('./helpers/guid');

var App = Marionette.Application.extend({
    initialize: function () {
        this.regions = {};
        this.layouts = {};
        this.views = {};
        this.models = {};
        this.channels = {};
        this.collections = {};

        this.registerRadioChannels();
        this.listenRadioChannels();

        // These are the functions that have to run to load an existing pool
        // Note: it is run using the async library, so make sure to bind the context.
        this.loadPoolQueue = [
            this.fetchCurrentPool.bind(this)
        ];

        this.mediaQuery();

        this.landingView = new LandingView;
    },

    listenRadioChannels: function() {
        this.channels.navigation.comply('load-landing', this.loadLanding, this);
        this.channels.navigation.comply('load-pool', this.loadPool, this);
        this.channels.navigation.comply('new-pool', this.newPool, this);
        this.channels.navigation.comply('load-landing-login', this.loadLogin, this);

        this.channels.navigation.comply('pool-prev-sheet', this.prevSheet, this);
        this.channels.navigation.comply('pool-next-sheet', this.nextSheet, this);
        this.channels.navigation.comply('pool-exit', this.exitPool, this);

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
        // Media channel. For media changes and queries.
        this.channels.media = Backbone.Radio.channel('media');

        // For debugging, let's listen on on the events
        Backbone.Radio.tuneIn('navigation');
        Backbone.Radio.tuneIn('respondent');
        Backbone.Radio.tuneIn('pool');
        Backbone.Radio.tuneIn('response');
        Backbone.Radio.tuneIn('media');
    },

    mediaQuery: function () {
        // On window resize, trigger the media change event
        this.wideLayout = $(window).width() >= window.RESIZE_WIDTH;
        $(window).resize(_.bind(function () {
            if ($(window).width() < window.RESIZE_WIDTH) {
                if (this.wideLayout) {
                    this.wideLayout = false;
                    this.channels.media.trigger('window-resize', {wide: false});
                }
            } else {
                if (!this.wideLayout) {
                    this.wideLayout = true;
                    this.channels.media.trigger('window-resize', {wide: true});
                }
            }
        }, this));
    },

    loadLanding: function() {
        var self = this;
        //noinspection JSUnresolvedVariable
        this.landingView = new LandingView;
        this.appSpace.show(this.landingView);

        // Grab the existing pools
        var PoolListingsCollection = require('./collections/collection-pool-listings');
        var poolListingsCollection = new PoolListingsCollection();
        poolListingsCollection.fetch();

        var PoolListingsView = require('./views/view-landing-pool-listings'),
            poolListingsView = {};

        poolListingsCollection.on('sync', function () {
            console.log('--- PoolListingsSynced');
            poolListingsView = new PoolListingsView({collection: this});
            //noinspection JSUnresolvedVariable
            self.landingView.content.show(poolListingsView);
        });
    },

    newPool: function(e) {
        app.appState.set('newpool', true);
        app.appState.set('poolid', e.poolid);
        this.loadPool(e);
    },

    /*
     *  Part of the loadPoolQueue.
     *  Will load the fetch the current pool data.
     *
     */
    fetchCurrentPool: function (callback) {
        // Note this will load the logic of the pool, but not any prior existing responses
        // Set the id of the pool model so that it fetches from localStorage if possible
        // If the data is already in localstorage it will load that.
        var PoolModel = require('./models/model-pool');
        var poolid = app.appState.get('poolid');
        var puid = app.appState.get('puid');

        this.currentPool = new PoolModel();
        this.currentPool.set('poolid', poolid);
        if (puid) {
            this.currentPool.set('puid', puid)
        }
        this.currentPool.fetch();

        // The pool model will also sync the eddis (response data)
        // So wait for the eddis-synced, then trigger the async callback
        // TODO: think about error handling here
        app.channels.pool.once('eddis-synced', function () {
            callback(null);
        });
    },

    loadPool: function (e) {
        if (e.poolid) {
            app.appState.set('poolid', e.poolid);
        }

        // If the load-pool-sheet command was complied with, then there will be a sheetid property
        if(e.sheetid) {
            app.appState.set({sheetid: e.sheetid});
            app.appState.save();
        }

        // Once the pool is ready, launch it
        app.channels.pool.once('load-pool-ready', _.bind(this.poolLaunch, this));

        // Execute all the functions in the loadPoolQueue
        // Then tell the pool channel that everything is ready.
        async.series(this.loadPoolQueue, function () {
            app.channels.pool.trigger('load-pool-ready');
        });

    },

    loadLogin: function () {
        var LandingLogin = require('./views/view-landing-login');
        var landingLogin = new LandingLogin({model: app.appState});
        this.landingView.content.show(landingLogin);
    },

    poolLaunch: function () {

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
            //noinspection JSUnresolvedVariable
            sheetid = this.currentPool.get('pool').sheetOrder[0];
            this.appState.set('sheetid', sheetid);
        }

        app.appState.set('page', 'pool');

        var PoolView = require('./layouts/layout-pool');
        this.poolView = new PoolView;
        // Defined in the oe.js launch
        //noinspection JSUnresolvedVariable
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
            //noinspection JSUnresolvedVariable
            this.poolView.sheet.show(this.poolView.sheetView);
            this.channels.navigation.trigger('sheet-loaded');
        }
    },

    getCurrentSheetIndex: function () {
        // Figure out what the previous sheet should be
        //noinspection JSUnresolvedVariable
        var sheetOrder = app.currentPool.get('pool').sheetOrder;
        var currentSheet = app.appState.get('sheetid');

        // TODO: make sure the types match up
        return _(sheetOrder).indexOf(currentSheet);
    },

    prevSheet: function (e) {
        var idx = this.getCurrentSheetIndex();
        //noinspection JSUnresolvedVariable
        var sheetOrder = app.currentPool.get('pool').sheetOrder;

        // If we are at the first page already, then just quit
        if (idx === 0) {
            return false;
        } else {
            idx--;
            var newSheet = sheetOrder[idx];
            app.appState.set('sheetid', newSheet);
        }

        this.loadSheet(e);
    },

    nextSheet: function (e) {
        var idx = this.getCurrentSheetIndex();
        //noinspection JSUnresolvedVariable
        var sheetOrder = app.currentPool.get('pool').sheetOrder;

        // If we are at the last page, then quit
        if (idx >= app.currentPool.get('poolLength') - 1) {
            return false;
        } else {
            idx++;
            var newSheet = sheetOrder[idx];
            app.appState.set('sheetid', newSheet);
        }

        this.loadSheet(e);
    },

    exitPool: function () {

        // Save all the things
        app.currentPool.eddis.each(function (x) {
            x.save();
        });

        // Navigate back to the main page
        app.router.navigate('', {trigger: true});

    },

    // From http://stackoverflow.com/questions/2384167/check-if-internet-connection-exists-with-javascript
    // Slightly modifed. It allows for a 401 response (just means we aren't logged in)
    // If there is an error it returns false
    // Does not use jQuery so it shouldn't mix up with the login or backbone code
    hostReachable: function () {
        // Handle IE and more capable browsers
        var xhr = new ( window.ActiveXObject || XMLHttpRequest )("Microsoft.XMLHTTP");

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

module.exports = App;



