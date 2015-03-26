/**
 * Created by jfagan on 3/12/15.
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
            puid: null
        }
    },

    initialize: function() {
        this.createID();
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
    },
});

