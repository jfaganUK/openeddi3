/**
 * Created by jfagan on 6/4/15.
 * oe/oe_client/collections/collection-admin-pool-listings.js:3
 */

var AdminPoolListing = require('../models/model-admin-pool-listing');
module.exports = Backbone.Collection.extend({
    url: '/api/admin/pool/',
    model: AdminPoolListing
});
