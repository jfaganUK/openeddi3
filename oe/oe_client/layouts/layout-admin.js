/**
 * Created by jfagan on 6/3/15.
 * oe/oe_client/layouts/layout-admin.js:3
 */

var template = require('../templates/template-admin-layout.ejs');
var AdminHeader = require('../views/view-admin-header');
var PoolListingView = require('../views/view-admin-list-pools');
var PoolCollection = require('../collections/collection-admin-pool-listings');

module.exports = Mn.LayoutView.extend({
    template: template,
    tagName: 'core-header-panel',
    attributes: {
        'flex': '',
        'layout': '',
        'vertical': ''
    },
    regions: {
        header: "#oe-admin-header",
        main: "#oe-admin-main",
        footer: "#oe-admin-footer"
    },
    onShow: function () {
        var adminHeader = new AdminHeader({model: app.appState});
        this.header.show(adminHeader);

        var poolCollection = new PoolCollection();
        poolCollection.on('sync', function () {
            var poolList = new PoolListingView({collection: poolCollection});
            this.main.show(poolList);
        }, this);
        poolCollection.fetch();
    }
});
