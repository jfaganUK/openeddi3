/**
 * Created by jfagan on 4/7/15.
 * The index file for the shorttext file
 * oe/oe_modules/control-shorttext/index.js
 */


var views = {};
var templates = {};

// The eddi control view
// view shorttext
views.eddicontrol = require('./viewShorttext');

// The view template
templates.eddicontrol = require('./templateShorttext.ejs');


module.exports.views = views;
module.exports.templates = templates;
