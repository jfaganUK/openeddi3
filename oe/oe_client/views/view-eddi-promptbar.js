/**
 * Created by jfagan on 4/2/15.
 * oe/oe_client/views/view-eddi-promptbar.js
 */

var PromptBarModel = require('../models/model-eddi-promptbar');
var template = require('../templates/template-blank-template.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-eddi-promptbar',
    model: PromptBarModel,
    template: template,
    _publishedKeys: ['oe', 'response']
});
