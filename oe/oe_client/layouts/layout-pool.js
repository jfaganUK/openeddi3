/**
 * Created by jfagan on 3/22/15.
 * layout-pool.js
 */


// The Pool Layout.
// This layout should persist during the data collection period. It contains the important elements of the pool for
// data collection.

// The header is for overall information you may have about the current pool (title, logo, for instance)
// The navigation will be a layer that helps the user navigate between (and within) the sheets
// The sheet space is where the sheet is shown.
// The footer will have additional navigation elements (such as exit pool) and information, such as % completion.

var template = require('../templates/template-layout-pool.ejs')();

module.exports = Marionette.LayoutView.extend({
    template: _.template(template),
    regions: {
        header:     '#oe-pool-header',
        navigation: '#oe-pool-navigation',
        sheet:      '#oe-sheet-space',
        footer:     '#oe-pool-footer'
    },

    initialize: function(opts) {
    }
});

