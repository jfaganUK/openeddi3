/**
* Created by jfagan on 6/22/15.
* oe/oe_client/views/view-admin-pool-listing-layout.js
*/

var template = require('../templates/template-admin-pool-listing-layout.ejs');
var PoolListingCollection = require('../collections/collection-admin-pool-listings');
var PoolListingView = require('../views/view-admin-list-pools');
var NewPoolView = require('../views/view-admin-create-new-pool');
var ModelPoolDesign = require('../models/model-admin-pooldesign');
var SyncView = require('../views/view-admin-sync-data');
var EddiCollection = require('../collections/collection-pool-eddis-sync');
var NameListCollection = require('../collections/collection-admin-namelist');

var LayoutAdminPoolListings = Mn.LayoutView.extend({
    template: template,
    regions: {
      "newpool": "#adminPoolListing-newPool",
      "poollistings": "#adminPoolListing-poolListings",
      "syncTarget": "#adminPoolListing-sync-data"
    },
    
    initialize: function (opts) {
      this.opts = opts;
      this.radioListen();
    },
    
    radioListen: function() {
      app.channels.response.comply('sync', this.syncDirtyRecords, this);
      app.channels.response.comply('clearLocalStorage', this.clearLocalStorage, this);
      app.channels.response.comply('hasDirtyRecords', this.hasDirtyRecords, this);
    },
    
    onShow: function () {
      var self = this;
      this.poolListingCollection = new PoolListingCollection();
      
      this.poolListingCollection.fetch({
          success: function (results) {
            self.showPoolListings();
            this.poolListings = results;
            self.hasDirtyRecords(results); 
            self.checkLocalStorage();
          }
      });
      
      self.showSyncTarget();
    },
    
    showPoolListings: function () {
      
      // list the current pools
      var poolListingView = new PoolListingView({collection: this.poolListingCollection});
      this.poollistings.show(poolListingView);
      
      // polymer view expects a model, there's probably a better way around this
      // but I'm just going to create a blank useless model
      var newPoolView = new NewPoolView();
      this.newpool.show(newPoolView);
    },
    
    showSyncTarget: function () {
      this.viewSync = new SyncView();
      this.syncTarget.show(this.viewSync);
    }
   
});

module.exports = LayoutAdminPoolListings;