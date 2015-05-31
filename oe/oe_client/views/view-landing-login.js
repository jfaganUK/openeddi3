/**
 * Created by jfagan on 5/30/15.
 * oe/oe_client/views/view-landing-login.js:3
 */

var template = require('../templates/template-landing-login.ejs');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-landing-login',
    template: template,
    _publishedKeys: []
});
