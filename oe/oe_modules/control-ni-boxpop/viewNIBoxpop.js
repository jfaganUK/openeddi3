/**
 * Created by jfagan on 10/28/15.
 * oe/oe_modules/control-boilerplate/viewBoilerplate.js:3
 */

var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('../../oe_client/templates/template-blank-template.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-ni-boxpop',
    model: EddiModel,
    template: template,
    _publishedKeys: ['oe', 'namelist', 'response'],
    initialize: function (options) {
        this.options = options || {};
        var oe = this.model.get('oe');
        oe.names = app.currentPool.namelist.toJSON();
        oe.names.forEach(function (n) {
            if (!n.details[oe.eid]) {
                n.nameResponse = {value: '', other: ''};
            } else {
                n.nameResponse = n.details[oe.eid];
            }
        });
        this.model.set('oe', oe);
    }
});


