/**
 *
 * oe/oe_modules/control-namegen/client-index.js
 */
"use strict";

var views = {};
var templates = {};

views.eddicontrol = require('./BasicNameGenerator');
templates.eddicontrol = require('./templateBasicNamegen.ejs');

module.exports.views = views;
module.exports.templates = templates;