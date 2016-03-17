/**
 * Created by jfagan on 3/12/15.
 * oe/oe_client/models/model-appstate.js:3
 * Note, this should always be synced to local storage.
 */

var guid = require('../helpers/guid');


// Model-appstate.js
module.exports = Backbone.Model.extend({
    urlRoot: '/api/appstate/',

    defaults: function() {
        return {
            id: this.createID(),
            puid: this.defaultPUID(),
            poolid: this.defaultPoolid(),
            sheetid: this.defaultSheetid(),
            sheetindex: null,
            page: null,
            user: null
        }
    },

    initialize: function() {
        console.log('[appState] Initialize.');
        var self = this;
        // Do this if we pulled an existing survey.
        this.on('change:sheetid', _.bind(this.updateSheetIndex, this));
        app.channels.pool.on('pool-synced', _.bind(this.setPoolLength, this));
        this.on('change', function () {
            // for debugging
            console.log(self.toJSON());
        });
    },

    setPoolLength: function () {
        this.set('poolLength', app.currentPool.get('sheetlogic').length);
    },

    updateSheetIndex: function () {
        if (app.currentPool) {
            //var sheets = app.currentPool.get('sheetlogic');
            //var sids = _(sheets).pluck('sheetid').value();
            var sids = app.currentPool.get('poollogic').sheetOrder;
            var sid = this.get('sheetid');
            var ix = _.indexOf(sids, sid);
            // if we can't find the sheetid in the array, set it to the first page
            this.set('sheetindex', ix < 0 ? 0 : ix);
        }
    },

    getLocalAppstate: function () {
        var appstate;
        var id = this.getLocalID();
        if (id) {
            appstate = localStorage.getItem(this.urlRoot + id);
            appstate = JSON.parse(appstate);
        }
        return appstate;
    },

    defaultSheetid: function () {
        var appstate = this.getLocalAppstate();
        return appstate ? appstate.sheetid : null;
    },

    defaultPUID: function () {
        var appstate = this.getLocalAppstate();
        return appstate ? appstate.puid : null;
    },

    defaultPoolid: function () {
        var appstate = this.getLocalAppstate();
        return appstate ? appstate.poolid : null;
    },

    getLocalID: function () {
        var appstate = localStorage.getItem(this.urlRoot);
        if (!_.isNull(appstate)) {
            return (appstate.split(',')[0]);
        }
        return null;
    },

    // Check the localstorage to see if there is an appstate model to use
    // I want to restore the appstate if possible
    createID: function() {
        console.log('[appState] Create id');
        var _id = this.getLocalID();
        return this.getLocalID() ? _id : guid();
    }
});

