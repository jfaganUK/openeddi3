/**
 * Created by jfagan on 3/24/15.
 * view-eddis.js
 */

var EddiView = require('./view-eddi');

module.exports = Marionette.CollectionView.extend({
    childView: EddiView,
    filter: function(child, index, collection) {
        if(!this.sheetid) {
            this.sheetid = app.appState.get('sheetid');
        }
        return child.get('sheetid') == this.sheetid;
    }
});