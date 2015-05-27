/**
 * Created by jfagan on 3/9/15.
 */
"use strict";

var PoolListingView = require('./view-landing-pool-listing');

module.exports = Marionette.CollectionView.extend({
    attributes: function () {
        return ( {
            'flex': '',
            'layout': '',
            'vertical': ''
        });
    },
    childView: PoolListingView
});