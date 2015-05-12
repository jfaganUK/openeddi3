/**
 * Created by jfagan on 5/8/15.
 * oe/oe_modules/control-namepick/client-index.js:3
 */

var views = {};
var templates = {};

views.eddicontrol = require('./NamePick');
templates.eddicontrol = require('./templateNamePick.ejs');

module.exports.views = views;
module.exports.templates = templates;