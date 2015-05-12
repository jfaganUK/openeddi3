/**
 * Created by jfagan on 4/29/15.
 * oe/oe_modules/control-namegen/BasicNameGen-NameInput.js
 */
'use strict';

var PolymerView = require('../../oe_client/views/marionette.polymerview');
var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateBasicNameGen-NameInput.ejs');

module.exports = PolymerView.extend({
    tagName: "oe-basicnamegen-nameinput",
    model: EddiModel,
    template: template
});
