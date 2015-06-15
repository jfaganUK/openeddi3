/**
 * Created by jfagan on 6/12/15.
 * oe/oe_client/views/view-admin-responses.js
 */

var template = require('../templates/template-admin-responses.ejs');

var ResponseTablesCollection = Backbone.Collection.extend({
    url: function () {
        return '/api/admin/responsetables/' + this.poolid;
    },
    initialize: function (opts) {
        this.opts = opts;
        this.poolid = opts.poolid;
    }
});

module.exports = Mn.LayoutView.extend({
    template: template,
    initialize: function (opts) {
        this.opts = opts || {};
        this.poolid = this.opts.model.get('poolid');
        this.getResponseTables();
    },

    onBeforeRender: function () {
        console.log('%cAbout to render Response view', 'font-weight: bold');
    },

    getResponseTables: function () {
        var responseTables = new ResponseTablesCollection({poolid: this.poolid});
        responseTables.fetch({
            success: function () {
                console.log('Got the response tables');
            },
            error: function () {
                console.log('Unable to fetch the tables');
            }
        });
    },

    /** Add regions for the response controls. The number of regions aren't necessarily known ahead of time
     * since they can be modified by modules. */
    addResponseBoxRegions: function () {

    }
});
