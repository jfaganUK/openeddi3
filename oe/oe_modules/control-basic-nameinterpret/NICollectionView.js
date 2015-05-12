/**
 * Created by jfagan on 5/12/15.
 * oe/oe_modules/control-basic-nameinterpret/NICollectionView.js:3
 */

var NINameLayoutView = require('./NINameLayoutView');

module.exports = Mn.CollectionView.extend({
    childView: NINameLayoutView,
    initialize: function (options) {
        this.childViewOptions = {
            namelist: this.options.namelist,
            oe: options.oe
        };
    }
});