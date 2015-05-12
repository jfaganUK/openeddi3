/**
 * Created by jfagan on 5/8/15.
 * oe/oe_modules/control-namepick/NamePick-Name.js:3
 */

var template = require('./templateNamePickName.ejs');

module.exports = Mn.PolymerView.extend({
    template: template,
    tagName: 'oe-name-pick',
    initialize: function (options) {
        // Make the namelist convient to access
        this.namelist = options.namelist;
        // Add the namelist to the oe object here, so that the component can read it
        var oe = this.model.attributes.oe || {};
        oe.namelist = this.namelist;
        oe.inlist = this.model.inList(this.namelist);
        this.model.set('oe', oe);

        this.$el.on('toggle-name', _.bind(this.toggleName, this));
    },
    toggleName: function () {
        if (this.model.inList(this.namelist)) {
            this.model.removeFromList(this.namelist);
            this.model.attributes.oe.inlist = false;
        } else {
            this.model.appendToList(this.namelist);
            this.model.attributes.oe.inlist = true;
        }
    }
});
