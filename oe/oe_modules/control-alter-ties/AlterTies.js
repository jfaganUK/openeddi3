/**
 * Created by jfagan on 5/17/15.
 * oe/oe_modules/control-alter-ties/AlterTies.js
 */
'use strict';

var template = require('./templateAlterTiesLayout.ejs');

module.exports = Mn.PolymerView.extend({
    template: template,
    tagName: 'oe-alter-ties'
});
