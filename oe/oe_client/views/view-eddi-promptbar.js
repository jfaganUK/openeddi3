/**
 * Created by jfagan on 4/2/15.
 * oe/oe_client/views/view-eddi-promptbar.js
 */

"use strict";
var PromptBarModel = require('../models/model-eddi-promptbar');
var PromptBarTemplate = require('../templates/template-eddi-promptbar.ejs');

module.exports = Mn.ItemView.extend({
    model: PromptBarModel,
    template: PromptBarTemplate,
    initialize: function() {
    }
});