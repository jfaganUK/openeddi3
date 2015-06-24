/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/ViewAdminDesignNewSheet.js
 */

var ViewAdminDesignNewEddi = Mn.PolymerView.extend({
    template: require('../templates/template-blank-template.ejs'),
    tagName: "oe-admin-design-new-eddi",
    _publishedKeys: ['oe', 'poollogic', 'controlmodules'],
    initialize: function (opts) {
        this.prepControlModules();
    },
    prepControlModules: function () {
        var controlmodules = [];
        _.forIn(app.OEModules, function (value, oeModule) {
            if (value.views && value.views.eddicontrol) {
                controlmodules.push({modulename: oeModule});
            }
        });
        this.model.set('controlmodules', controlmodules);
    }
});
module.exports = ViewAdminDesignNewEddi;