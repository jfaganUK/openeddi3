/**
 * Created by jfagan on 10/28/15.
 * oe/oe_modules/control-ni-boxpop/client-index.js:3
 */

var views = {};
var templates = {};
var design = {};

// The eddi control view
// view shorttext
views.eddicontrol = require('./viewNIBoxpop');

// The view template
templates.eddicontrol = require('./templateNIBoxpop.ejs');

// The design view
//design.eddicontrol = require('./DesignView');


module.exports.views = views;
module.exports.templates = templates;
module.exports.design = design;
