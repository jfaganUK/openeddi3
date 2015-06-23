/**
 * Created by jfagan on 6/22/15.
 * oe/oe_client/models/model-admin-pooldesign.js
 */

var ModelPoolDesign = Backbone.Model.extend({
    urlRoot: '/api/admin/pooldesign/',
    url: function () {
        var url = this.urlRoot + this.get('poolid') + '?push=' + this.pushJSON;
        return (url)
    },
    idAttribute: 'poolid',
    initialize: function (opts) {
        this.opts = opts || {};
        this.pushJSON = false;
        this.on('change', this.pdChanged, this);
    },
    /**
     * Push a JSON object to a file on the server that will be used for the respondents.
     */
    push: function () {
        var self = this;
        this.pushJSON = true;
        this.save({
            success: function () {
                self.pushJSON = false;
            }
        });
    },
    pdChanged: function () {
        // some of the views aren't tied directly to this model, but they depend on it
        // so they aren't sensitive to change events
        app.channels.pool.trigger('pool-design-change', this);
    }
});
module.exports = ModelPoolDesign;