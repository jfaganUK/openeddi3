/**
 *
 * oe/oe_modules/control-namegen/client-index.js
 */
"use strict";

var views = {};
var templates = {};
var design = {};

views.eddicontrol = require('./BasicNameGenerator');
templates.eddicontrol = require('./templateBasicNamegen.ejs');
design.eddicontrol = require('./DesignView');

module.exports.views = views;
module.exports.templates = templates;
module.exports.design = design;