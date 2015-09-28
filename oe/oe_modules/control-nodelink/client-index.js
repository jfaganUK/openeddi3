/**
 * Created by jfagan on 5/18/15.
 * oe/oe_modules/control-nodelink/client-index.js:3
 */
'use strict';

var views = {};
var templates = {};
var design = {};

views.eddicontrol = require('./NodeLink');
design.eddicontrol = require('./DesignView');

module.exports.views = views;
module.exports.templates = templates;
module.exports.design = design;