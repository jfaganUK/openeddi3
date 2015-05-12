/**
 * Created by jfagan on 4/7/15.
 * The index file for the checklist module
 * oe/oe_modules/control-checklist/client-index.js:4
 */


var views = {};
var templates = {};

// The eddi control view
// view shorttext
views.eddicontrol = require('./viewChecklist');

// The view template
templates.eddicontrol = require('./templateChecklist.ejs');


module.exports.views = views;
module.exports.templates = templates;
