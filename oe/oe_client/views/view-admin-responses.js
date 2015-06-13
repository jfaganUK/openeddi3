/**
 * Created by jfagan on 6/12/15.
 * oe/oe_client/views/view-admin-responses.js
 */

var template = require('../templates/template-admin-responses.ejs');
module.exports = Mn.LayoutView.extend({
    template: template,
    onBeforeRender: function () {
        console.log('%cAbout to render Response view', 'font-weight: bold');
    },

    getResponseTables: function () {

    },

    /** Add regions for the response controls. The number of regions aren't necessarily known ahead of time
     * since they can be modified by modules. */
    addResponseBoxRegions: function () {

    }
});
