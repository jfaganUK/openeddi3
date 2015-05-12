/**
 * Created by jfagan on 4/27/15.
 * oe/oe_modules/control-namegen/BasicNameGenerator.js
 *
 * BasicNameGenerator             layout view
 *    BasicNameGen-NameInput      control for inputting a new name
 *    BasicNameGen-Names          collection view
 *        BasicNameCard           view for a single name. includes controls for changing or deleting the name
 *
 */
"use strict";

var EddiModel = require('../../oe_client/models/model-eddi');
var NameInputView = require('./BasicNameGen-NameInput');
var NamesView = require('./BasicNameGen-Names');
var template = require('./templateBasicNamegen.ejs');

module.exports = Mn.LayoutView.extend({
    model: EddiModel,
    template: template,
    regions: {
        nameinput: "#oe-basicnamegen-nameinput",
        namelist: "#oe-basicnamegen-names"
    },
    onShow: function () {
        // Display the name input and the name list
        var nameInputView = new NameInputView({model: this.model});
        this.nameinput.show(nameInputView);

        // Display the list of names
        var namesView = new NamesView({
            collection: app.currentPool.namelist,
            namelist: this.model.get('namelist')
        });
        this.namelist.show(namesView);
    }
});