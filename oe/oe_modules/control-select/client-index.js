/**
 * Created by jfagan on 4/15/15.
 * oe/oe_modules/control-radiolist/client-index.js
 */

var views = {};
var templates = {};

views.eddicontrol = require('./viewSelect');

templates.eddicontrol = require('./templateSelect.ejs');

module.exports.views = views;
module.exports.templates = templates;
