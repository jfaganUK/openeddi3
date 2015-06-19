/**
 * Created by jfagan on 3/19/15.
 */

/*
    The OpenEddi Router
    The routes should have (nearly) all the information necessary to tell the application what part it should load.

 It's kind of silly that this has it's own directory right? I don't think I will have another router file.
 */
module.exports = Backbone.Router.extend({
    routes: {
        '': 'loadLanding',
        'landing': 'loadLanding',
        'landing/listings': 'loadLanding',
        'admin': 'loadAdmin',
        'admin/:page': 'loadAdmin',
        'admin/:page/:poolid': 'loadAdmin',
        'admin/:page/:poolid/:subpage': 'loadAdmin',
        'landing/login': 'loadLogin',
        'pool': 'loadLanding',
        'pool/:poolid': 'loadPool',
        'pool/:poolid/:puid': 'loadPoolPuid',
        'pool/:poolid/:puid/sheet/:sheetid' : 'loadPoolPuidSheet'
    },

    initialize: function() {
    },

    loadAdmin: function (page, poolid, subpage) {
        var opts = {
            page: page || 'listing',
            poolid: poolid,
            subpage: subpage
        };
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
