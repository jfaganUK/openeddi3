/**
 * Created by jfagan on 5/12/15.
 * oe/oe_modules/control-basic-nameinterpret/NINameTag.js:3
 */

var template = require('./templateNINameTag.ejs');
var NameModel = require('../model-namelist/NameModel');

module.exports = Mn.ItemView.extend({
    model: NameModel,
    template: template
});
