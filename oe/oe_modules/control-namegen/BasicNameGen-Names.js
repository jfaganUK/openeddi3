/**
 * Created by jfagan on 5/5/15.
 * oe/oe_modules/control-namegen/BasicNameGen-Names.js
 */
"use strict";

var BasicNameCard = require('./BasicNameCard');

module.exports = Mn.CollectionView.extend({
    childView: BasicNameCard,
    initialize: function () {
        this.childViewOptions = {
            namelist: this.options.namelist
        };
        this.collection.on('change:lists', this.collectionChanged, this);
    },
    filter: function (child, index, collection) {
        return child.inList(this.options.namelist);
    },
    collectionChanged: function () {
        this.render();
    },
    onRender: function () {
    }
});
