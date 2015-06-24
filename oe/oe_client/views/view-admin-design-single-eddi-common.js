/**
 * Created by jfagan on 6/24/15.
 * oe/oe_client/views/view-admin-design-single-eddi-common.js:3
 */


var ViewAdminDesignSingleEddiCommon = Mn.PolymerView.extend({
    template: require('../templates/template-blank-template.ejs'),
    tagName: 'oe-admin-design-single-eddi-common',
    _publishedKeys: ['oe', 'poollogic'],
    initialize: function () {
        var oe = _.clone(this.model.attributes);
        this.model.set('oe', _.omit(oe, 'oe'));
    }
});
module.exports = ViewAdminDesignSingleEddiCommon;