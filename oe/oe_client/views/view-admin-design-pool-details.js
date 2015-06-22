/**
 * Created by jfagan on 6/22/15.
 * oe/oe_client/views/view-admin-design-pool-details.js
 *
 * Design for the pool level details. Things like title, id, also where you might design or enter a roster
 */

var template = require('../templates/template-blank-template.ejs');
module.exports = Mn.PolymerView.extend({
    template: template,
    tagName: 'oe-admin-design-pool-details'
});