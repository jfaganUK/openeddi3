/**
 * Created by jfagan on 4/15/15.
 * oe/oe_modules/control-radiolist/viewRadiolist.js
 */

var PolymerView = require('../../oe_client/views/marionette.polymerview');
var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateConsent.ejs');

module.exports = PolymerView.extend({
    tagName: 'oe-consent',
    model: EddiModel,
    template: template,
    _publishedKeys: ['oe', 'response'],
    initialize: function () {
    }
});

