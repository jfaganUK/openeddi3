/**
 * Created by jfagan on 3/9/15.
 * oe/oe_client/views/view-landing-pool-listing.js:3
 */
"use strict";

var template = require('../templates/template-landing-pool-listing.ejs');
var PoolListingModel = require('../models/model-pool-listing');

module.exports = Mn.PolymerView.extend({
    tagName: 'pool-listing-landing',
    model: PoolListingModel,
    template: template,
    _publishedKeys: ['poolTitle', 'dateCreated', 'description', 'oe'],
    initialize: function() {
        this.$el.on('start-new-pool', _.bind(this.newPool, this));
    },

    newPool: function() {
        var poolid = this.model.attributes.poolid;
        app.channels.navigation.command('new-pool', {poolid: poolid});
    }

});