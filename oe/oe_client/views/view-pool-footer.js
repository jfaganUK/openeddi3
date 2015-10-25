/**
 * Created by jfagan on 5/26/15.
 * oe/oe_client/views/view-pool-footer.js:3
 */

var template = require('../templates/template-layout-pool-footer.ejs');

module.exports = Mn.ItemView.extend({
    template: template,
    className: "layout horizontal",
    ui: {
        'nextButton': '#oe-footer-next-space > paper-button',
        'prevButton': '#oe-footer-prev-space > paper-button',
        'exitButton': '#oe-footer-exit-button > paper-button'
    },

    events: {
        'click @ui.nextButton': 'nextSheet',
        'click @ui.prevButton': 'prevSheet',
        'click @ui.exitButton': 'exitPool'
    },

    // I want this to re-render when the appState changes
    modelEvents: {
        'change': 'fieldsChanged'
    },

    initialize: function () {
        // Otherwise it will show 1/x instead of the actual page
        app.appState.updateSheetIndex();
    },

    onBeforeDestroy: function () {
        console.log('[view-pool-footer] About to be destroyed');
    },

    nextSheet: function () {
        app.channels.navigation.command('pool-next-sheet');
    },

    prevSheet: function () {
        app.channels.navigation.command('pool-prev-sheet');
    },

    exitPool: function () {
        app.channels.navigation.command('pool-exit');
    },

    fieldsChanged: function () {
        this.render();
    }
});
