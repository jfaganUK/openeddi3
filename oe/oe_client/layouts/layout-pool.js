/**
 * Created by jfagan on 3/22/15.
 * oe/oe_client/layouts/layout-pool.js
 */
"use strict";



// The Pool Layout.
// This layout should persist during the data collection period. It contains the important elements of the pool for
// data collection.

// The header is for overall information you may have about the current pool (title, logo, navigation)
// The sheet space is where the sheet is shown.
// The footer will have additional navigation elements (such as exit pool) and information, such as % completion.

var template = require('../templates/template-layout-pool.ejs')();

module.exports = Marionette.LayoutView.extend({
    tagName: 'core-header-panel',
    attributes: function () {
        return ( {
            'flex': ''
        });
    },
    id: 'poolLayout',
    template: _.template(template),
    regions: {
        header:     '#oe-pool-header',
        sheet:      '#oe-sheet-space',
        footer:     '#oe-pool-footer'
    },

    initialize: function(opts) {
    },

    onShow: function () {
        // Load the pool header
        var HeaderView = require('../views/view-pool-header');
        var headerView = new HeaderView({model: app.currentPool});
        this.header.show(headerView);
    },

    onRender: function () {
    }
});

