/**
 * Created by jfagan on 5/10/15.
 *
 */

var views = {};
var templates = {};

views.eddicontrol = require('./ViewBasicNameInterpret');
templates.eddicontrol = require('./templateNameInterpret.ejs');
templates.nameinterpret = require('./templateOEBasicNameInterpreter.ejs');

module.exports.views = views;
module.exports.templates = templates;