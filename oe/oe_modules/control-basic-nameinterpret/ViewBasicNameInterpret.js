/**
 * Created by jfagan on 5/10/15.
 * oe/oe_modules/control-basic-nameinterpret/ViewBasicNameInterpret.js:3
 *
 * The way I want this to work, is that this part should be able to use any
 * eddi that has a 'response' as its updated attribute. It would capture the
 * response and save it as part of the details of the alter.
 *
 */

"use strict";

var EddiModel = require('../../oe_client/models/model-eddi');
var NICollectionView = require('./NICollectionView');
var templateLayout = require('./templateNameInterpret.ejs');

var NILayoutView = Mn.LayoutView.extend({
    model: EddiModel,
    template: templateLayout,
    regions: {
        interpreters: "#oe-basic-nameinterpreters"
    },
    onShow: function () {
        // show the collection view
        var niList = new NICollectionView({
            collection: app.currentPool.namelist,
            namelist: this.model.get('namelist'),
            oe: this.model.get('oe')
        });
        this.interpreters.show(niList);
    }
});

module.exports = NILayoutView;

