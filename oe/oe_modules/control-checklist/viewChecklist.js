/**
 * Created by jfagan on 3/24/15.
 * oe/oe_modules/control-checklist/viewChecklist.js
 */

var PolymerView = require('../../oe_client/views/marionette.polymerview');
var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateChecklist.ejs');

module.exports = PolymerView.extend({
    tagName: 'oe-checklist',
    model: EddiModel,
    template: template,
    initialize: function () {
        this._initializeCheckboxArray();
    },
    _initializeCheckboxArray: function () {
        // If the value is null, then I want to default the different array values
        if (this.model.attributes.response.value === null) {
            var responseValue = {};
            _(this.model.attributes.arrayPrompts).forEach(function (x) {
                responseValue[x.arrayid] = false;
            }).value();
            this.model.attributes.response.value = responseValue;
        }
    }
});


