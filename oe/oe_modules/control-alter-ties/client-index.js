/**
 * Created by jfagan on 5/17/15.
 * oe/oe_modules/control-alter-ties/client-index.js:3
 */
'use strict';

var views = {};
var templates = {};

views.eddicontrol = require('./AlterTies');
templates.eddicontrol = require('./templateAlterTiesLayout.ejs');
module.exports.views = views;
module.exports.templates = templates;
