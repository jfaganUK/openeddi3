/**
 * Created by jfagan on 3/9/15.
 * collection-pool-listings.js
 */

var PoolListing = require('../models/model-pool-listing');
module.exports = Backbone.Collection.extend({
    url: '/api/poollistings/',
    model: PoolListing
});



