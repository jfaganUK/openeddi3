/**
 * Created by rhunter(APAX) on 8/5/16.
 * oe/oe_client/views/view-admin-design-json.js
 *
 * Design for the pool level raw json data
 */

var template = require('../templates/template-blank-template.ejs');

var ViewAdminDesignJSON = Mn.PolymerView.extend({
    template: template,
    tagName: 'oe-admin-json',
    _publishedKeys: ['oe', 'poollogic']
});
module.exports = ViewAdminDesignJSON;