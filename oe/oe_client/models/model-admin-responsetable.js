/**
 * Created by jfagan on 6/18/15.
 *
 */

var ResponseTable = Backbone.Model.extend({
    urlRoot: function () {
        return '/api/admin/responses/' + this.opts.poolid + '/' + this.opts.table;
    },
    initialize: function (opts) {
        this.opts = opts || {};
    }
});
module.exports = ResponseTable;