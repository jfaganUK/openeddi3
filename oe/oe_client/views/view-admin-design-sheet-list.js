/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/view-admin-design-sheet-list.js:3
 */

var ViewAdminDesignSingleSheet = require('./view-admin-design-single-sheet');
var ViewAdminDesignSheetList = Mn.CollectionView.extend({
    attributes: {
        "layout": "",
        "vertical": "",
        "flex": ""
    },
    childView: ViewAdminDesignSingleSheet
});
module.exports = ViewAdminDesignSheetList;