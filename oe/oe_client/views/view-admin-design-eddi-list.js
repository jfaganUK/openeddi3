/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/view-admin-design-eddi-list.js:3
 */

var ViewAdminDesignSingleEddi = require('./view-admin-design-single-eddi');

var ViewAdminDesignEddiList = Mn.CollectionView.extend({
    attributes: {
        "layout": "",
        "vertical": "",
        "flex": ""
    },
    childView: ViewAdminDesignSingleEddi
});
module.exports = ViewAdminDesignEddiList;