var NameModel = require('../../oe_modules/model-namelist/NameModel');

module.exports = Backbone.Collection.extend({
    model: NameModel,
    url: function () {
        return '/api/namelist/' + this.puid + '/';
    },

    initialize: function (opts) {
        this.puid = opts;
        this.createStore();
    }    
});