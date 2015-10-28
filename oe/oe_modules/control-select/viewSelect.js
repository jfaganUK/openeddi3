/**
 * Created by jfagan on 4/15/15.
 * oe/oe_modules/control-radiolist/viewRadiolist.js
 */

var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateSelect.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-select',
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
        }
    }
});

