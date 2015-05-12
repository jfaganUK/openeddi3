/**
 * Created by jfagan on 4/27/15.
 * oe/oe_modules/control-shorttext/NameCollection.js
 */

var NameModel = require('./NameModel');

module.exports = Backbone.Collection.extend({
    model: NameModel,
    url: function () {
        return '/api/namelist/' + app.appState.get('puid');
    },

    initialize: function () {
        // Make sure that a localstorage instance is created
        this.createStore();
    },

    // Will return an array of models that are in a particular named list
    namesInList: function (nl) {
        var oarray = [];
        for (var i = 0; i < this.length; i++) {
            if (_.indexOf(this.models[i].attributes.lists, nl) != -1) {
                oarray.push(this.models[i]);
            }
        }
        return (oarray);
    },

    // Sort by the name
    comparator: function (name) {
        return name.get('name');
    },

    //returns the number of names in a specified list
    countOfList: function (ll) {
        var ml = this.models;
        var cn = 0;
        _.each(ml, function (qq) {
            if (_.indexOf(qq.toJSON().lists, ll) != -1) {
                cn++;
            }
        });
        return cn;
    }

});