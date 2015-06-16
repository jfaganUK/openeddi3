/**
 * Created by jfagan on 6/4/15.
 * oe/oe_client/views/view-admin-pool-listing.js:3
 */

var template = require('../templates/template-blank-template.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-admin-pool-listing',
    template: template,
    _publishedKeys: ['oe', 'poolTitle', 'dateCreated', 'numResponses', 'description', 'oe', 'poolid'],
    initialize: function(opts) {
        this.opts = opts || {};
    }

});
