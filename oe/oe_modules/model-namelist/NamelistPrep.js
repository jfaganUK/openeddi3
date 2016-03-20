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
var async = require('async');

// Now add it to the loadPoolQueue
var oldApplicationInitialize = App.prototype.initialize;
App.prototype.initialize = function () {
    oldApplicationInitialize.apply(this, arguments);
    this.loadPoolQueue.push(this.prepNamelistForLaunch.bind(this));
};


// Need to add the callback, since it is part of an async series queue
App.prototype.prepNamelistForLaunch = function (callback) {
    var self = this;
    this.currentPool.namelist = new NamelistCollection();

    // These next two steps seem redundant, but it's just in case
    // there are other steps in between sync and ready in the future.
    app.channels.namelist.once('namelist-ready', function () {
        callback(null);
    });


    // Fetch any existing data for this namelist
    var fetchNamelist = function (callback) {
        self.currentPool.namelist.fetch({
            success: function () {
                callback();
            }
        });
    };

    // Then add the roster, if it exists
    var addRoster = function (callback) {
        self.addRosterToNamelist(function () {
            callback();
        });
    };

    // Then save stuff
    var saveNameList = function (callback) {
        self.currentPool.namelist.sync({
            success: function () {
                app.channels.namelist.trigger('namelist-ready');
                callback();
            }
        });
    };

    //After all that, do the callback
    async.series([fetchNamelist, addRoster], function () {
        callback();
    });
};

App.prototype.addRosterToNamelist = function (callback) {
    var roster = app.currentPool.get('poollogic').roster;
    var self = this;
    if (roster) {
        _.each(roster, function (nm) {
            app.currentPool.namelist.addName(nm, {preventDuplicates: true, doNotSave: true});
        });
    }
    callback();
};
