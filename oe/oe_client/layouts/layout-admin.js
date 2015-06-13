/**
 * Created by jfagan on 6/3/15.
 * oe/oe_client/layouts/layout-admin.js:3
 */

var template = require('../templates/template-admin-layout.ejs');
var AdminHeader = require('../views/view-admin-header');
var PoolListingView = require('../views/view-admin-list-pools');
var PoolListingCollection = require('../collections/collection-admin-pool-listings');
var ViewResponses = require('../views/view-admin-responses');

module.exports = Mn.LayoutView.extend({
    template: template,
    tagName: 'core-drawer-panel',
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

    initialize: function (opts) {
        this.opts = opts;
        this.radioListen();
        this.el.addEventListener('core-responsive-change', _.bind(this.panelResponsiveChange, this));
    },

    radioListen: function () {
        app.channels.navigation.comply('load-admin-view-responses', this.loadViewResponses, this);
        app.channels.navigation.comply('admin-toggle-menu', this.toggleMenu, this);
        app.channels.navigation.comply('load-admin-responses', this.loadViewResponses, this);
    },

    onShow: function () {
        var self = this;
        this.loadHeader();

        // So many of the views in this part of the application
        // are going to need access to the pool meta data (or listings)
        // so bind it to the view here.
        this.poolListingCollection = new PoolListingCollection();
        this.poolListingCollection.fetch({
            success: function () {
                self.showMainContent(self.opts);
            }
        });

    },

    showMainContent: function (opts) {
        // The admin listings route is the default
        switch (opts.page) {
            case 'listings':
                this.loadAdminListings();
                break;
            case 'responses' :
                this.loadViewResponses(opts.poolid);
                break;
            default:
                this.loadAdminListings();
                break;
        }
    },

    loadHeader: function () {
        var adminHeader = new AdminHeader({model: app.appState});
        this.header.show(adminHeader);
    },

    loadAdminListings: function () {
        var self = this;
        app.router.navigate('admin/listing');
        var poolList = new PoolListingView({collection: this.poolListingCollection});
        this.main.show(poolList);
    },

    loadViewResponses: function (poolid) {
        var self = this;
        // you need to specify a poolid, otherwise, escape
        if (!poolid) {
            this.loadAdminListings();
            return;
        }

        app.router.navigate('admin/responses/' + poolid);
        var poolModel = this.poolListingCollection.get(poolid);
        var responseView = new ViewResponses({model: poolModel});
        self.main.show(responseView);
    },

    // Show or hide the admin menu panel
    // respondes to 'admin-toggle-menu'
    toggleMenu: function () {
        this.el.togglePanel();
    },

    panelResponsiveChange: function (e) {
        app.channels.media.trigger('admin-panel-responsive-change', e);
    }

});
