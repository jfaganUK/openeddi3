/**
 * Created by jfagan on 6/15/15.
 * oe/oe_client/collections/collection-admin-response-table-summary.js
 */

module.exports = Backbone.Collection.extend({
    url: function () {
        return '/api/admin/responsetables/' + this.poolid;
    },
    initialize: function (opts) {
        this.opts = opts;
        this.poolid = opts.poolid;
    }
});
