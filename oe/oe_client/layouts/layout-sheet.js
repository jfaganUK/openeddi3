/**
 * Created by jfagan on 3/23/15.
 * layout-sheet.js
 */

var template = require('../templates/template-layout-sheet.ejs')();
var EddisView = require('../views/view-eddis');

module.exports = Marionette.LayoutView.extend({
    template: _.template(template),
    regions: {
        eddispace: '#oe-sheet-eddi-space'
    },

    initialize: function (opts) {
        this.sheetid = app.appState.get('sheetid');

        app.channels.media.on('window-resize', function () {
            // For some reason this is not consistent
            //this.eddispace.$el.toggleClass('wide');
            this.$el.find('#oe-sheet-eddi-space').toggleClass('wide')
        }, this);
    },

    onShow: function() {
        this.showEddis();
    },

    onRender: function () {
        // Media query
        if (app.wideLayout) {
            this.$el.find('#oe-sheet-eddi-space').addClass('wide');
        }
    },

    showEddis: function() {
        var eddisView = new EddisView({collection: app.currentPool.eddis});
        this.eddispace.show(eddisView);
    }


});