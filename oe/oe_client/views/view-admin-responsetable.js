/**
 * Created by jfagan on 6/18/15.
 * oe/oe_client/views/view-admin-responsetable.js
 */

var template = require('../templates/template-blank-template.ejs');

var ViewResponseTable = Mn.PolymerView.extend({
    tagName: 'oe-admin-responsetable',
    template: template,
    _publishedKeys: ['oe'],
    initialize: function () {
        this.model.set('oe', _.clone(this.model.attributes));
    }
});
module.exports = ViewResponseTable;

