/**
 * Created by jfagan on 3/9/15.
 */
"use strict";

var PolymerView = require('./marionette.polymerview');
var PoolListingModel = require('../models/model-pool-listing');

module.exports = PolymerView.extend({
    tagName: 'pool-listing-landing',
    model: PoolListingModel,
    template: require('../templates/template-landing-pool-listing.ejs'),
    initialize: function() {
        this.$el.on('start-new-pool', _.bind(this.newPool, this));
        this.el.poolTitle = "Exciting!";
    },

    newPool: function() {
        var poolid = this.model.attributes.poolid;
        app.channels.navigation.command('new-pool', {poolid: poolid});
    }

});