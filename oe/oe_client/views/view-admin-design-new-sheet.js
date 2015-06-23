/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/ViewAdminDesignNewSheet.js:3
 */

var ViewAdminDesignNewSheet = Mn.PolymerView.extend({
    template: require('../templates/template-blank-template.ejs'),
    tagName: "oe-admin-design-new-sheet",
    _publishedKeys: ['oe', 'poollogic']
});
module.exports = ViewAdminDesignNewSheet;