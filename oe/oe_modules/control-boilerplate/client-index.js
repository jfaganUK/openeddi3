/**
 * Created by jfagan on 10/28/15.
 * oe/oe_modules/control-boilerplate/client-index.js:3
 */

var views = {};
var templates = {};
var design = {};

// The eddi control view
// view shorttext
views.eddicontrol = require('./viewBoilerplate');

// The view template
templates.eddicontrol = require('./templateBoilerplate.ejs');

// The design view
//design.eddicontrol = require('./DesignView');


module.exports.views = views;
module.exports.templates = templates;
module.exports.design = design;
