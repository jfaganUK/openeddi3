/**
 * Created by jfagan on 3/7/15.
 * layout-landing.js
 */

// Layout - Landing.js
var template = require('../templates/template-layout-landing.ejs')();

module.exports = Marionette.LayoutView.extend({
    template: _.template(template),
    regions: {
        header: '#oe-landing-header',
        pools: '#oe-landing-pools',
        footer: '#oe-landing-footer'
    },

    initialize: function(opts) {

    }
});
