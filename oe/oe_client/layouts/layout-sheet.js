/**
 * Created by jfagan on 3/23/15.
 * layout-sheet.js
 */

var template = require('../templates/template-layout-sheet.ejs')();
var EddiCollection = require('../collections/collection-pool-eddis');

module.exports = Marionette.LayoutView.extend({
    template: _.template(template),
    regions: {
        eddispace: '#oe-sheet-eddi-space'
    },

    initialize: function (opts) {

    }
});