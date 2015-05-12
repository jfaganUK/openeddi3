/**
 * Created by jfagan on 5/4/15.
 * oe/oe_modules/model-namelist/NamelistPrep.js:3
 *
 * These functions should run when a new pool is created
 * or an existing pool is being loaded. It prepares the namelist
 * models and collections.
 */

var App = require('../../oe_client/application');
var NamelistCollection = require('./NameCollection');

// Need to add the callback, since it is part of an async series queue
App.prototype.prepNamelistForLaunch = function (callback) {
    this.currentPool.namelist = new NamelistCollection();

    // These next two steps seem redundant, but it's just in case
    // there are other steps in between sync and ready in the future.
    app.channels.namelist.once('namelist-ready', function () {
        callback(null);
    });

    this.currentPool.namelist.once('sync', function () {
        app.channels.namelist.trigger('namelist-ready');
    });

    this.currentPool.namelist.fetch();
};

// Now add it to the loadPoolQueue
var oldApplicationInitialize = App.prototype.initialize;
App.prototype.initialize = function () {
    oldApplicationInitialize.apply(this, arguments);
    this.loadPoolQueue.push(this.prepNamelistForLaunch.bind(this));
};
