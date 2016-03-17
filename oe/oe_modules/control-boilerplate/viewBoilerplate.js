/**
 * Created by jfagan on 10/28/15.
 * oe/oe_modules/control-boilerplate/viewBoilerplate.js:3
 */

var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('../../oe_client/templates/template-blank-template.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-boilerplate',
    model: EddiModel,
    template: template,
    _publishedKeys: ['oe']
});


