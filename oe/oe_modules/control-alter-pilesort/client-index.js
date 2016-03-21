/**
 * Created by jfagan on 3/20/16.
 * oe/oe_modules/control-alter-pilesort/client-index.js
 */
var views = {};
var templates = {};

views.eddicontrol = require('./ViewAlterPilesort.js');

templates.eddicontrol = require('./templateAlterPilesort.ejs');

module.exports.views = views;
module.exports.templates = templates;
