/**
 * Created by jfagan on 6/24/15.
 * oe/oe_modules/control-shorttext/DesignView.js:3
 */

var ShorttextDesignView = Mn.PolymerView.extend({
    template: require('../../oe_client/templates/template-blank-template.ejs'),
    tagName: 'oe-shorttext-design',
    _publishedKeys: ['oe', 'poollogic'],
    initialize: function () {
        var oe = _.clone(this.model.attributes);
        this.model.set('oe', _.omit(oe, 'oe'));
    }
});
module.exports = ShorttextDesignView;
