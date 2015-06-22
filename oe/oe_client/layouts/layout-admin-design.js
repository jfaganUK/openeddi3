/**
 * Created by jfagan on 6/21/15.
 * oe/oe_client/layouts/layout-admin-design.js
 */

var template = require('../templates/template-layout-admin-design.ejs');

var LayoutAdminDesign = Mn.LayoutView.extend({
    template: template,
    regions: {
        "main": "#admin-layout-design-main"
    },
    initialize: function (opts) {
        this.opts = opts || {};
    }
});
module.exports = LayoutAdminDesign;