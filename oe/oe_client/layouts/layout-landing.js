/**
 * Created by jfagan on 3/7/15.
 * layout-landing.js
 */

// Layout - Landing.js
var template = require('../templates/template-layout-landing.ejs')();

module.exports = Marionette.LayoutView.extend({
    template: _.template(template),
    tagName: 'paper-scroll-header-panel',
    className: "flex layout vertical",
    id: 'oeLandingContainer',
    regions: {
        header: '#oe-landing-header',
        content: '#oe-landing-content',
        footer: 'oe-landing-footer'
    },

    initialize: function(opts) {
    }
});
