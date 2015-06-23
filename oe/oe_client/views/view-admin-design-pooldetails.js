/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/view-admin-design-pooldetails.js:3
 */

var template = require('../templates/template-blank-template.ejs');

var ViewAdminDesignPooldetails = Mn.PolymerView.extend({
    template: template,
    tagName: 'oe-admin-design-pooldetails',
    _publishedKeys: ['oe', 'poollogic']
});
module.exports = ViewAdminDesignPooldetails;