/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/view-admin-design-single-sheet.js:3
 */

var ViewAdminDesignSingleSheet = Mn.PolymerView.extend({
    template: require('../templates/template-blank-template.ejs'),
    tagName: 'oe-admin-design-single-sheet',
    _publishedKeys: ['oe', 'poollogic']
});
module.exports = ViewAdminDesignSingleSheet;