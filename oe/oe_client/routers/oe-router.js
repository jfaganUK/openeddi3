/**
 * Created by jfagan on 3/19/15.
 */

/*
    The OpenEddi Router
    The routes should have (nearly) all the information necessary to tell the application what part it should load.
 */
module.exports = Backbone.Router.extend({
    routes: {
        '': 'loadLanding',
        'landing': 'loadLanding',
        'landing/listings': 'loadLanding',
        'admin': 'loadAdmin',
        'admin/:page': 'loadAdmin',
        'admin/:page/:poolid': 'loadAdmin',
        'landing/login': 'loadLogin',
        'pool': 'loadLanding',
        'pool/:poolid': 'loadPool',
        'pool/:poolid/:puid': 'loadPoolPuid',
        'pool/:poolid/:puid/sheet/:sheetid' : 'loadPoolPuidSheet'
    },

    initialize: function() {
    },

    loadAdmin: function (page, poolid) {
        var opts = {page: page || 'listing', poolid: poolid};
        app.channels.navigation.command('load-admin-page', opts);
    },

    loadAdminResponses: function (poolid) {
        app.channels.navigation.command('load-admin-responses', {poolid: poolid});
    },

    loadLogin: function () {
        app.channels.navigation.command('load-landing-login');
    },

    loadLanding: function() {
        this.navigate('landing');
        app.channels.navigation.command('load-landing');
    },

    // What happens if they go to 'pool/' with no poolid? I think it should load the landing page...
    loadPool: function(poolid) {
        app.appState.set('poolid', poolid);
        app.channels.navigation.command('load-pool', {poolid: poolid});
    },

    loadPoolPuid: function(poolid, puid) {
        app.appState.set({poolid: poolid, puid: puid});
        app.channels.navigation.command('load-pool', {poolid: poolid, puid: puid});
    },

    loadPoolPuidSheet: function(poolid, puid, sheetid) {
        app.appState.set({poolid: poolid, puid: puid, sheetid: sheetid});
        app.channels.navigation.command('load-pool', {poolid: poolid, puid: puid, sheetid: sheetid});
    }

});
