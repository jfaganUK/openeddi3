/**
 * Created by jfagan on 6/22/15.
 * oe/oe_client/models/model-admin-pooldesign.js
 */

var ModelPoolDesign = Backbone.Model.extend({
    urlRoot: '/api/admin/pooldesign/',
    idAttribute: 'poolid',
    initialize: function (opts) {
        this.opts = opts || {};
    }
});
module.exports = ModelPoolDesign;