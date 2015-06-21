/**
 * Created by jfagan on 6/12/15.
 * oe/oe_client/views/view-admin-responses.js
 */

var template = require('../templates/template-admin-responses.ejs');
var ResponseTablesCollection = require('../collections/collection-admin-response-table-summary');
var ViewResponseTableSummaries = require('../views/view-admin-response-table-summaries');

var ResponseTableModel = require('../models/model-admin-responsetable');
var ViewResponseTable = require('../views/view-admin-responsetable');

module.exports = Mn.LayoutView.extend({
    template: template,
    regions: {
        "main": "#oe-admin-responses-main"
    },
    initialize: function (opts) {
        this.opts = opts || {};
        this.poolid = this.opts.model.get('poolid');
        app.channels.navigation.comply('admin-load-responses', _.bind(this.loadResponses, this));
    },

    getResponseTables: function (cb) {
        this.responseTables = new ResponseTablesCollection({poolid: this.poolid});
        this.responseTables.fetch({
            success: function () {
                cb();
            },
            error: function () {
                console.error('[getResponseTables] Unable to fetch the tables');
            }
        });
    },

    onShow: function() {
        var self = this;
        this.getResponseTables(function() {
            var v = new ViewResponseTableSummaries({collection: self.responseTables});
            self.main.show(v);
        });
    },

    loadResponses: function (o) {
        app.router.navigate('admin/responses/' + o.poolid + '/' + o.table);
        var self = this;
        var responseTableModel = new ResponseTableModel({poolid: this.poolid, table: o.table});
        responseTableModel.fetch({
            success: function () {
                var v = new ViewResponseTable({model: responseTableModel});
                self.main.show(v);
            }
        });
    }
});
