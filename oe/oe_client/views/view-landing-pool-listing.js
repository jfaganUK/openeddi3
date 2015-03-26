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
        this.$el.on('start-new-pool', _.bind(this.startPool, this));
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
    },

    startPool: function() {
        var poolid = this.model.attributes._poolid;
        app.channels.navigation.command('load-pool', {poolid: poolid});
    }

});