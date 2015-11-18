/**
 * Created by jfagan on 4/15/15.
 * oe/oe_modules/control-radiolist/viewRadiolist.js
 */

var PolymerView = require('../../oe_client/views/marionette.polymerview');
var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateRadiolist.ejs');

module.exports = PolymerView.extend({
    tagName: 'oe-radiolist',
    model: EddiModel,
    template: template,
    _publishedKeys: ['oe', 'response'],
    initialize: function () {
        this._initializeSelected();
    },
    _initializeSelected: function () {
        var respVal = this.model.attributes.response.value;
        if (this.model.attributes.response.value === null) {
            this.model.attributes.oe.selection = '';
        } else {
            this.model.attributes.oe.selection = '2';

            //var arrayPrompts = this.model.attributes.arrayPrompts;
            //this.model.attributes.oe.selection= _(arrayPrompts)
            //    .where({value: respVal})
            //    .value()[0]
            //    .prompt;
        }
    }
});

