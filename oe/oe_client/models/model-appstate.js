/**
 * Created by jfagan on 3/12/15.
 * oe/oe_client/models/model-appstate.js:3
 */

var guid = require('../helpers/guid');


// Model-appstate.js
module.exports = Backbone.Model.extend({
    urlRoot: '/api/appstate/',

    defaults: function() {
        return {
            user: 'new user',
            id: this.createID(),
            page: 'landing',
            sheetid: null,
            poolid: null,
            puid: null,
            sheetindex: null
        }
    },

    initialize: function() {
        this.createID();
        // Do this if we pulled an existing survey.
        this.on('change:sheetid', _.bind(this.updateSheetIndex, this));
        app.channels.pool.on('pool-synced', _.bind(this.setPoolLength, this));
    },

    setPoolLength: function () {
        this.set('poolLength', app.currentPool.get('sheets').length);
    },

    updateSheetIndex: function () {
        if (app.currentPool) {
            var sheets = app.currentPool.get('sheets');
            var sids = _(sheets).pluck('sheetid').value();
            var sid = this.get('sheetid');
            var ix = _.indexOf(sids, sid);
            // if we can't find the sheetid in the array, set it to the first page
            this.set('sheetindex', ix < 0 ? 0 : ix);

        }
    },

    // Check the localstorage to see if there is an appstate model to use
    // I want to restore the appstate if possible
    createID: function() {
        var appstate = localStorage.getItem(this.urlRoot);
        var _id;
        if(appstate) {
            var appStateID = appstate.split(',')[0];
            var lsJSON = localStorage.getItem(this.urlRoot + appStateID);
            _id = JSON.parse(lsJSON).id;
        } else {
            _id = guid();
        }
        return _id;
    }
});

