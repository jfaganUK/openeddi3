/**
 * Created by jfagan on 3/7/15.
 * application.js
 */
"use strict";

var async = require('async');
var LandingView = require('./layouts/layout-landing');
var UserModel = require('./models/model-user');
var AdminView = require('./layouts/layout-admin');
var guid = require('./helpers/guid');

// TODO: Many of these methods need to be a part of their respective views.
// eg: The showLanding method should be part of the landing layout view, and the loadSheet, etc should
// be part of the poolLayout view. The application should be handling only the Application-Level methods
// for instance, loading an entirely new section (loadPool or loadAdmin)
// or mediaQuery (which impacts the whole application.)

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

        this.user = new UserModel;

    },

    listenRadioChannels: function() {
        this.channels.navigation.comply('load-landing', this.loadLanding, this);
        this.channels.navigation.comply('load-pool', this.loadPool, this);
        this.channels.navigation.comply('new-pool', this.newPool, this);
        this.channels.navigation.comply('load-landing-login', this.loadLogin, this);
        this.channels.navigation.comply('load-admin-page', this.loadAdmin, this);

        this.channels.navigation.comply('pool-prev-sheet', this.prevSheet, this);
        this.channels.navigation.comply('pool-next-sheet', this.nextSheet, this);
        this.channels.navigation.comply('pool-exit', this.exitPool, this);

        this.channels.user.comply('login', this.attemptLogin, this);
        this.channels.user.comply('check-auth', this.checkUserAuth, this);

        // Save the models when the response is updated
        this.channels.response.on('response-updated', function(e) {
            console.log('-- Response Updated: ' + e.attributes.eid);
            e.save();
        });
    },

    registerRadioChannels: function() {
        // Navigation channel. Listen how the user moves around the site.
        this.channels.navigation = Backbone.Radio.channel('navigation');
        // User channel. Logins, logouts, authentication events, etc.
        this.channels.user = Backbone.Radio.channel('user');
        // Pool channel. Events related to the oe pool.
        this.channels.pool = Backbone.Radio.channel('pool');
        // Response channel. Events, commands, and data for when the user provides responses to the eddis.
        this.channels.response = Backbone.Radio.channel('response');
        // Media channel. For media changes and queries.
        this.channels.media = Backbone.Radio.channel('media');

        // For debugging, let's listen on on the events
        Backbone.Radio.tuneIn('navigation');
        Backbone.Radio.tuneIn('user');
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

    showLanding: function () {
        this.landingView = new LandingView;
        this.appSpace.show(this.landingView);
    },

    loadLanding: function() {
        var self = this;

        this.showLanding();

        // Grab the existing pools
        this.router.navigate('landing/listings');
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
        var PoolModel = require('./models/model-pool');
        var poolid = app.appState.get('poolid');
        var puid = app.appState.get('puid');
        var fq = []; // the function queue

        // This will load the logic of the pool, but not any prior existing responses
        // Set the id of the pool model so that it fetches from localStorage if possible
        // If the data is already in localstorage it will load that.
        this.currentPool = new PoolModel();
        this.currentPool.set('poolid', poolid);
        if (puid) {
            this.currentPool.set('puid', puid);
            app.appState.set('puid', puid);
        }
        this.currentPool.fetch();

        // The pool model will also sync the eddis (response data)
        // So wait for the eddis-synced, then trigger the async callback
        // TODO: think about error handling here
        app.channels.pool.once('eddis-synced', function () {
            app.currentPool.once('sync', function () {
                callback(null);
            });
            app.currentPool.save(); // initial save
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
        app.router.navigate('landing/login');

        this.showLanding();
        var LandingLogin = require('./views/view-landing-login');
        var landingLogin = new LandingLogin({model: app.appState});
        this.landingView.content.show(landingLogin);
    },

    loadAdmin: function (opts) {
        this.user.authUser(function (auth) {
            if (auth) {
                // user is authorized / logged in, load the admin page
                var adminViewOpts = opts || {};
                var adminView = new AdminView({
                    page: adminViewOpts.page,
                    poolid: adminViewOpts.poolid,
                    subpage: adminViewOpts.subpage
                });
                app.appSpace.show(adminView);
                if (adminViewOpts.subpage) {
                    app.router.navigate('/admin/' + adminViewOpts.page + '/' + adminViewOpts.subpage);
                } else {
                    app.router.navigate('/admin/' + adminViewOpts.page);
                }
            } else {
                // user is not authorized, send them to the login page
                app.channels.navigation.command('load-landing-login', app.loadLogin, app);
            }
        })
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
            sheetid = this.currentPool.get('poollogic').sheetOrder[0];
            this.appState.set('sheetid', sheetid);
        }

        app.appState.set('page', 'pool');

        var PoolView = require('./layouts/layout-pool');
        this.poolView = new PoolView;
        // Defined in the oe.js launch
        //noinspection JSUnresolvedVariable
        this.appSpace.show(this.poolView);
        delete this.landingView;

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

            // Update the pool model
            var idx = this.getCurrentSheetIndex();
            var poolstatus = _.clone(app.currentPool.get('poolstatus'));
            poolstatus.status = "pool started";
            app.currentPool.set('poolstatus', poolstatus);
            app.currentPool.set('sheetindex', idx);
            app.currentPool.save();
        }
    },

    getCurrentSheetIndex: function () {
        // Figure out what the previous sheet should be
        //noinspection JSUnresolvedVariable
        var sheetOrder = app.currentPool.get('poollogic').sheetOrder;
        var currentSheet = app.appState.get('sheetid');

        // TODO: make sure the types match up
        return _(sheetOrder).indexOf(currentSheet);
    },

    prevSheet: function (e) {
        var idx = this.getCurrentSheetIndex();
        //noinspection JSUnresolvedVariable
        var sheetOrder = app.currentPool.get('poollogic').sheetOrder;

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
        var sheetOrder = app.currentPool.get('poollogic').sheetOrder;

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

    attemptLogin: function (creds) {
        console.log('[attemptLogin] Attempting login... ');
        console.log(creds);

        this.user.login(creds, {
            success: function (mod, res) {
                console.log("SUCCESS", mod, res);
                app.channels.user.trigger('login-success');
            },
            error: function (err) {
                console.log("ERROR", err);
                switch (err.errid) {
                    case 0:
                        app.channels.user.trigger('login-system-error');
                        break;
                    case 1:
                        app.channels.user.trigger('login-no-user');
                        break;
                    case 2:
                        app.channels.user.trigger('login-bad-password');
                        break;
                }
            }
        });

    },

    // will run the authorized user check and call the callback with a value of true or false
    // complies to user / check-auth
    checkUserAuth: function(callback) {
        this.user.authUser(callback);
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



