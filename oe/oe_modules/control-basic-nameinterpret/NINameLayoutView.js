/**
 * Created by jfagan on 5/12/15.
 * oe/oe_modules/control-basic-nameinterpret/NINameLayoutView.js
 */

var templateNameLayout = require('./templateNINameLayout.ejs');
var NameModel = require('../model-namelist/NameModel');
var NameTag = require('./NINameTag');
var EddiModel = require('../../oe_client/models/model-eddi');

// In addition to the standard eddi control, I need to show the name of the alter
// So do a layout view with a region for the name and a region for the control
module.exports = Mn.LayoutView.extend({
    model: NameModel,
    template: templateNameLayout,
    regions: {
        nametag: "#niNameLayoutName",
        nameinterpreter: "#niNameLayoutControl"
    },
    initialize: function (options) {
        this.namelist = options.namelist;
        this.oe = _.merge(options.oe, options.oe.niEddiDetails);
        this.model.set('oe', this.oe);
    },

    onShow: function () {
        // Show the name tag
        var nameTag = new NameTag({model: this.model});
        this.nametag.show(nameTag);

        // Show the eddi control
        var ControlView = app.OEModules[this.oe.niEddi].views.eddicontrol;

        // Need to create a custom eddi model with all the attributes coded so that we can capture
        // the response and redirect it to the name details
        var niModel = new EddiModel({});
        niModel.set('oe', this.oe);

        // If the detail for this does not exist, then use the default
        if (this.model.attributes.details[this.oe.eid]) {
            niModel.set('response', this.model.attributes.details[this.oe.eid]);
        }

        // Hijack the sync ability to signal the eddi to save
        niModel.sync = function () {
            this.trigger('interpreter-sync', this.attributes.response);
        };
        niModel.on('interpreter-sync', this.saveResponseToDetails, this);

        // Create a new control view with this model.
        var controlView = new ControlView({model: niModel});
        this.nameinterpreter.show(controlView);
    },

    saveResponseToDetails: function (response) {
        this.model.addToDetails(this.oe.eid, response);
        this.model.save();
    }
});