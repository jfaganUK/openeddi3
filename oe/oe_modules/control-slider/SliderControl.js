/**
 * Created by jfagan on 5/17/15.
 * oe/oe_modules/control-slider/SliderControl.js:3
 */

var template = require('./templateSlider.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-slider',
    template: template,
    initialize: function () {

        // Have to initialize the values, and the array values
        if (this.model.get('oe').arrayPrompts) {
            this._initializeArray();
        } else {
            var response = _.clone(this.model.get('response'));
            response.value = this.model.get('oe').ranges.default.value;
            this.model.set('response', response);
        }
    },
    _initializeArray: function () {
        var response = _.clone(this.model.get('response'));
        var defaultValue = this.model.get('oe').ranges.default.value;
        var arrayPrompts = this.model.get('oe').arrayPrompts;
        if (response.value === null || _.keys(response.value).length !== arrayPrompts.length) {
            response.value = {};
            _(arrayPrompts).forEach(function (x) {
                response.value[x.id] = defaultValue;
            }).value();
            this.model.set('response', response);
        }
    }
});

