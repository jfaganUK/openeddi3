/**
 * Created by jfagan on 4/15/15.
 * oe/oe_modules/control-radiolist/client-index.js
 */

var views = {};
var templates = {};

views.eddicontrol = require('./viewRadiolist');

templates.eddicontrol = require('./templateRadiolist.ejs');

module.exports.views = views;
module.exports.templates = templates;
