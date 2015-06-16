/**
 * Created by jfagan on 6/12/15.
 * oe/oe_client/views/view-admin-responses.js
 */

var template = require('../templates/template-admin-responses.ejs');
var ResponseTablesCollection = require('../collections/collection-admin-response-table-summary');
var ViewResponseTableSummaries = require('../views/view-admin-response-table-summaries');

module.exports = Mn.LayoutView.extend({
    template: template,
    regions: {
      "summaryList" : "#oe-admin-list-response-table-summaries"
    },
    initialize: function (opts) {
        this.opts = opts || {};
        this.poolid = this.opts.model.get('poolid');

    },

    onBeforeRender: function () {
        console.log('%cAbout to render Response view', 'font-weight: bold');
    },

    getResponseTables: function (cb) {
        this.responseTables = new ResponseTablesCollection({poolid: this.poolid});
        this.responseTables.fetch({
            success: function () {
                console.log('Got the response tables');
                cb();
            },
            error: function () {
                console.log('Unable to fetch the tables');
            }
        });
    },

    onShow: function() {
        var self = this;
        this.getResponseTables(function() {
            var v = new ViewResponseTableSummaries({collection: self.responseTables});
            self.summaryList.show(v);
        });
    }
});
