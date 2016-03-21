/**
 * Created by jfagan on 6/15/15.
 * /home/jfagan/Dropbox/projects/openeddi/openeddi3/oe/oe_client/views/view-admin-response-table-summary.js
 */

var template = require('../templates/template-blank-template.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-admin-response-table-summary',
    template: template,
    _publishedKeys: ['oe'],
    initialize: function() {
        console.log('hello world');
        this.model.set('oe', _.clone(this.model.attributes));
    }
});