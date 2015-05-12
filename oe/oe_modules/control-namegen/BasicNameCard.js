/**
 * Created by jfagan on 5/5/15.
 * oe/oe_modules/control-namegen/BasicNameCard.js
 */

var PolymerView = require('../../oe_client/views/marionette.polymerview');
var template = require('./templateBasicNameCard.ejs');

module.exports = PolymerView.extend({
    template: template,
    tagName: 'oe-basic-name-card',
    initialize: function (options) {
        this.namelist = options.namelist;
        this.$el.on('remove-name', _.bind(this.removeName, this));
        this.$el.on('edit-done', _.bind(this.editDone, this));
    },
    removeName: function () {
        this.model.removeFromList(this.namelist);
    },
    editDone: function () {
        this.model.save();
    }
});


