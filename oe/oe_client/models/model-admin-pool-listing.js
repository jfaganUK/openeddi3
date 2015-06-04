/**
 * Created by jfagan on 6/4/15.
 * oe/oe_client/models/model-admin-pool-listing.js
 */

module.exports = Backbone.Model.extend({
    defaults: {
        poolTitle: 'default title',
        dateCreated: '1982-10-10 18:43:00-05:00'
    },
    idAttribute: 'poolid',
    initialize: function () {
        var title = this.get('title');
        if (title) {
            this.set('poolTitle', title);
        }
    }
});