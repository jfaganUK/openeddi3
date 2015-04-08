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
    },

    onShow: function() {
        this.showEddis();
    },

    showEddis: function() {
        var eddisView = new EddisView({collection: app.currentPool.eddis});
        this.eddispace.show(eddisView);
    }


});