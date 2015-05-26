/**
 * Created by jfagan on 5/17/15.
 * oe/oe_modules/control-slider/client-index.js
 */

var views = {};
var templates = {};

views.eddicontrol = require('./SliderControl');
templates.eddicontrol = require('./templateSlider.ejs');

module.exports.views = views;
module.exports.templates = templates;


