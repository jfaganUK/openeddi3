/*
 * OpenEddi
 * (c) 2015, Jesse Fagan
 *
 */


//var WebComponents = require('webcomponents');
global.jQuery = global.$ = require('jquery');
var dataTable = require('datatables');
$.DataTable = dataTable;
$.fn.DataTable = dataTable;
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.Radio = require('backbone.radio');
require('./oe_client/backbone.dualstorage.browserify');
require('./oe_client/backbone.dualstorage.oe.helpers');
var Marionette = require('backbone.marionette');
var PolymerView = require('./oe_client/views/marionette.polymerview');
Mn.PolymerView = Marionette.PolymerView = PolymerView;

// Make sure any issues with the radio are broadcast to the log.
Backbone.Radio.DEBUG = true;

// The 'request controller' for the templates
_.templateSettings.variable = 'rc';

// Determine local storage is active or not
// This is for the dual-storage mechanism. Should the application store things locally, remotely, or both?
Backbone.Collection.prototype.local = true;
Backbone.Collection.prototype.remote = true;
Backbone.Model.prototype.local = true;
Backbone.Model.prototype.remote = true;

window.RESIZE_WIDTH = 600;

// Create the application as a global object
// There probably is a better modular way to do this, but
// this will be the *only* intentionally global object.
// I've noticed that some of the shimmed libraries are
// assigning stuff to the global scope. I'd like to somehow fix that later.
window.App = require('./oe_client/application');

// Load the OEModules here before initializing or creating any objects
// The modules need a chance to modify the prototypes before anything
// initializes.
var OEModules = require('./oe-modules');

window.app = new App();
app.OEModules = OEModules;

app.addRegions({
    appSpace: '#app-space'
});


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
