/**
 * Created by jfagan on 3/24/15.
 * oe/oe_modules/control-shorttext/view-shorttext.js
 */

var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateShorttext.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-shorttext',
    model: EddiModel,
    template: template,
    _publishedKeys: ['oe', 'response']
});


