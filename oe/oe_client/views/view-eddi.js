/**
 * Created by jfagan on 3/24/15.
 * view-eddi.js
 */
"use strict";

// JF: Is this even used? I don't think it is.

var PolymerView = require('./marionette.polymerview');
var template = require('../../oe_modules/shorttext/template-shorttext.ejs')();

module.exports = PolymerView.extend({
    tagName: 'oe-shorttext',
    template: _.template(template),
    initialize: function() {
    },
    onBeforeRender: function() {
        console.log('-- view-eddi before render');
    }
});