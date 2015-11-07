/**
 * Created by jfagan on 4/15/15.
 * oe/oe_modules/control-radiolist/client-index.js
 */

var views = {};
var templates = {};

views.eddicontrol = require('./viewConsent');

templates.eddicontrol = require('./templateConsent.ejs');

module.exports.views = views;
module.exports.templates = templates;
