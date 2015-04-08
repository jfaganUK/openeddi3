/**
 * Created by jfagan on 3/24/15.
 * oe/oe_modules/control-shorttext/view-shorttext.js
 */

var PolymerView = require('../../oe_client/views/marionette.polymerview');
var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateShorttext.ejs');

module.exports = PolymerView.extend({
    tagName: 'oe-shorttext',
    model: EddiModel,
    template: template
});


