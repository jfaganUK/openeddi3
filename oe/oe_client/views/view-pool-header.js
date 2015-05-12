/**
 * Created by jfagan on 4/9/15.
 * oe/oe_client/views/view-pool-header.js
 */

var PolymerView = require('./marionette.polymerview');
var template = require('../templates/template-pool-header.ejs');

module.exports = PolymerView.extend({
    tagName: 'oe-pool-header',
    template: template
});
