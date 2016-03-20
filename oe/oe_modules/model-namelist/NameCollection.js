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

    /***
     * Does a name exist in the collection already.
     * @param name String with a name
     * @param namelist (optional)
     * @return true if the name already exists in the collection
     */
    nameExists: function (name, namelist) {
        var namelist = namelist || undefined;

        var nms = this.filter({name: name});

        if (nms.length === 0) {
            return false;
        } else {
            if (namelist) {
                return _.chain(nms)
                    .map(function (nm) {
                        return nm.toJSON().lists.indexOf(namelist) > -1;
                    })
                    .every().value();
            } else {
                return true;
            }
        }
    },

    /***
     * Add a new name to the
     * @param name a name object with
     * @param options Options can be empty. doNotSave, if true then it will not persist. preventDuplicates will disallow a name to duplicate
     */
    addName: function (name, options) {
        var options = options || {};
        var nm = {
            name: name.name,
            lists: name.lists,
            details: name.details,
            puid: app.appState.get('puid'),
            poolid: app.appState.get('poolid')
        };

        if (options.preventDuplicates) {
            //TODO: add the namelist option here
            if (!this.nameExists(name.name)) {
                if (options.doNotSave) {
                    this.add(nm);
                } else {
                    this.create(nm);
                }
            }
        } else {
            if (options.doNotSave) {
                this.add(nm);
            } else {
                this.create(nm);
            }
        }
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