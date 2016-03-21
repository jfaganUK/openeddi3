/**
 * Created by jfagan on 3/20/16.
 */

var PolymerView = require('../../oe_client/views/marionette.polymerview');
var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateAlterPilesort.ejs');

module.exports = PolymerView.extend({
    tagName: 'oe-alter-pilesort',
    model: EddiModel,
    template: template,
    _publishedKeys: ['oe', 'response'],
    initialize: function () {
    }
});