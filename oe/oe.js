var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.Radio = require('backbone.radio');
require('./oe_client/backbone.dualstorage.browserify');
require('./oe_client/backbone.dualstorage.oe.helpers');
var Marionette = require('marionette');

// Make sure any issues with the radio are broadcast to the log.
Backbone.Radio.DEBUG = true;

// The 'request controller' for the templates
_.templateSettings.varialbe = 'rc';

// Create the application as a global object
// There probably is a better modular way to do this, but
// this will be the *only* intentionally global object.
// I've noticed that some of the shimmed libraries are
// assigning stuff to the global scope. I'd like to somehow fix that later.
window.app = require('./oe_client/application');

app.OEModules = require('./oe-modules');

app.on('start', function() {

    // Create the router
    var Router = require('./oe_client/routers/oe-router');
    app.router = new Router();

    // We want to retrieve the appstate from localstorage, if it exists there.
    // That way, on a refresh, the previous state can be restored
    AppState = require('./oe_client/models/model-appstate');
    app.appState = new AppState();
    app.appState.fetch();

    console.log('--- OpenEddi Application Started --');

});

$(document).ready(function () {
    app.start();

    Backbone.history.start({pushState: false});
});
