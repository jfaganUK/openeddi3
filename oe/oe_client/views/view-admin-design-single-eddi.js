/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/view-admin-design-single-eddi.js:3
 */

var ViewCommonEddi = require('./view-admin-design-single-eddi-common');
var ViewAdminDesignSingleEddi = Mn.LayoutView.extend({
    template: require('../templates/template-admin-design-single-eddi.ejs'),
    regions: {
        "common": "#oe-admin-design-single-eddi-common",
        "specific": "#oe-admin-design-single-eddi-specific"
    },
    initialize: function (opts) {
        this.opts = opts || {};
        this.pooldesign = app.channels.pool.request('get-pool-design-model');

        // every controlmodule needs a setup form, right?
        var controlmodule = this.model.get('controlmodule');
        this.specificView = app.OEModules[controlmodule].design.eddicontrol;

        app.channels.pool.comply('update-eddi-model', this.updateEddi, this);
    },
    onShow: function () {
        this.showCommon();
        this.showSpecific();
    },
    showCommon: function () {
        var v = new ViewCommonEddi({model: this.model});
        this.common.show(v);
    },
    showSpecific: function () {
        var v = new this.specificView({model: this.model});
        this.specific.show(v);
    },
    updateEddi: function (eddi) {
        var poollogic = _.clone(this.model.get('poollogic'));

        // get the existing eddi model
        var existingEddi = _.find(poollogic.eddilogic, {eid: eddi.eid});

        // remove that eddi
        var eddis = _.filter(poollogic.eddilogic, function (x) {
            return (x.eid !== existingEddi.eid);
        });

        // merge the new info into the existing info
        var newEddi = _.merge(existingEddi, eddi);
        eddis.push(newEddi);

        // replace the eddi logic
        poollogic.eddilogic = eddis;

        // update the model and save
        this.model.set('poollogic', poollogic);
        this.model.save();
    }
});
module.exports = ViewAdminDesignSingleEddi;