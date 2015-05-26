/**
 * Created by jfagan on 4/2/15.
 * oe/oe_client/layouts/layout-eddi.js
 */

var template = require('../templates/template-layout-eddi.ejs');
var PromptBarView = require('../views/view-eddi-promptbar');

module.exports = Marionette.LayoutView.extend({
    template: template,
    className: 'oe-basic-eddi',
    regions: {
        promptbar: '#oe-layout-eddi-promptbar',
        controlspace: '#oe-layout-eddi-controlspace'
    },

    initialize: function (opts) {
    },

    onShow: function() {
        // Load the prompt bar
        var promptBarView = new PromptBarView({model: this.model});
        this.promptbar.show(promptBarView);

        // Load the control
        var ControlView = app.OEModules[this.model.attributes.controlmodule].views.eddicontrol;
        var controlView = new ControlView({model: this.model});
        this.controlspace.show(controlView);
    }
});
