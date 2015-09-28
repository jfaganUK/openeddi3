/**
 * Created by jfagan on 6/24/15.
 * oe/oe_modules/control-nodelink/DesignView.js:3
 */

var NodelinkDesignView = Mn.PolymerView.extend({
    template: require('../../oe_client/templates/template-blank-template.ejs'),
    tagName: "oe-nodelink-design",
    _publishedKeys: ['oe'],
    initialize: function () {
        var oe = _.clone(this.model.attributes);
        this.model.set('oe', _.omit(oe, 'oe'));
    }
});
module.exports = NodelinkDesignView;
