/**
 * Created by jfagan on 6/4/15.
 * oe/oe_client/views/view-admin-list-pools.js:3
 */
'use strict';

var AdminPoolListing = require('./view-admin-pool-listing');

module.exports = Mn.CollectionView.extend({
    className: 'flex layout vertical',
    childView: AdminPoolListing
});
