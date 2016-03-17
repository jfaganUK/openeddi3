/**
 * Created by jfagan on 3/24/15.
 * view-eddis.js
 */

var EddiLayoutView = require('../layouts/layout-eddi');

module.exports = Marionette.CollectionView.extend({
    childView: EddiLayoutView,
    filter: function(child, index, collection) {
        if(!this.sheetid) {
            this.sheetid = app.appState.get('sheetid');
        }
        return child.get('sheetid') == this.sheetid;
    },
    onRender: function () {
        // Scroll to the top
        poolLayout = document.getElementById('poolLayout');
        poolLayout.scroller.scrollTop = 0;
    }
});