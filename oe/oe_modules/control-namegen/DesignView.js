/**
 * Created by jfagan on 6/24/15.
 * oe/oe_modules/control-namegen/DesignView.js:3
 */

var NamegenDesignView = Mn.PolymerView.extend({
    tagName: 'oe-basicnamegen-design',
    template: require('../../oe_client/templates/template-blank-template.ejs'),
    _publishedKeys: ['oe', 'poollogic'],
    initialize: function () {
        var oe = _.clone(this.model.attributes);
        this.model.set('oe', _.omit(oe, 'oe'));
    }
});
module.exports = NamegenDesignView;