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
    },
    
    syncDirtyRecords: function() {
      
      var self = this; 
      var dirtyResponses = this.records.getDirtyResponses;
      var dirtyNames = this.records.getDirtyNames;              
      var splitKey, ids, responsesArray = [], namesArray = [], nameCollection = [];
      var eddiCollection, nameListCollection;
      
      // A helper object to store ids of records to sync and then verify that they've been sync'd prior to calling self.hasDirtyRecords() to update component layout.
      var verifySync = {
        _idsToSync:[],
        _syncedIds:[],
        addIds: function(key, a) {
          var self = this;
          if(_.isArray(a)) {
            a.forEach(function(v) {
                self._idsToSync.push(key + '_' + v);
            });
          }
        },
        addSyncedIds: function(id) {
          this._syncedIds.push(id);
          this.verify();
        },
        verify: function() {
          var synced = _.isEqual(this._idsToSync.sort(), this._syncedIds.sort());
          
          if (synced === true) {
            self.hasDirtyRecords();
          } 
        }
      };
      
      /** 
      Iterate localStorage to build arrays of dirty records.
      Pull ids from dirty localStorage records and store in verifySync._idsToSync.
      Split localStorage key to create collections.
      */
      _.forOwn(localStorage, function(value, key) {
          
          // Responses  
          if ( dirtyResponses.exec(key) ) {
            if (localStorage.getItem(key) !== '') {
              splitKey = key.split('/');
              ids = localStorage.getItem(key).split(','); 
              verifySync.addIds(splitKey[3], ids);
              eddiCollection = new EddiCollection(splitKey[2], splitKey[3] + '/');
              responsesArray.push(eddiCollection);
            }
          }
          
          // NameList
          if ( dirtyNames.exec(key) ) {
            if (localStorage.getItem(key) !== '') {
              splitKey = key.split('/');
              ids = localStorage.getItem(key).split(','); 
              verifySync.addIds(splitKey[3], ids);
              nameListCollection = new NameListCollection(splitKey[3]);
              namesArray.push(nameListCollection);
            }
          }
          
      });
      
      // Iterate and sync response array.
      responsesArray.forEach(function(collection) {
          collection.fetch({
              success: function(collection, response, options) {
                
                if (collection.dirtyModels().length > 0) {
                  
                  collection.syncDirty({
                      success: function(collection, response, options) {
                        if (!options.dirty) {
                          verifySync.addSyncedIds(response.puid + '_' + response.eid);
                        }
                      }
                  });
                  
                }
              }
          });
      });
      
      // Iterate and sync nameList array.
      namesArray.forEach(function(collection) {
          collection.fetch({
              success: function(collection, response, options) {
                
                if (collection.dirtyModels().length > 0) {
                  
                  collection.syncDirty({
                      success: function(collection, response, options) {
                        if (!options.dirty) {
                          verifySync.addSyncedIds(response.puid + '_' + response.id);
                        }
                      }
                  });
                  
                }
              }
          });
      });
      
    },
    
    records: {
      'getDirtyResponses': new RegExp('api\/responses\/.*_dirty'),
      'getDirtyNames': new RegExp('/api\/namelist\/.*_dirty')
    },
    
    hasDirtyRecords: function() {
      
      var dirtyResponses = this.records.getDirtyResponses;
      var dirtyNames = this.records.getDirtyNames;
      var responses = [], names = [], poolTitles = [], namesAndResponses, dirtyRecordInfo = '';
      var pools = poolListings.pluck('poolid');
      var splitKey;
      
      // Iterate localStorage
      _.forOwn(localStorage, function(value, key) { 
          
          
          console.log('key ', key);
          console.log('--> responses ',  dirtyResponses.exec(key));
          console.log('--> name ', dirtyNames.exec(key));
          
          // Responses
          if ( dirtyResponses.exec(key) ) {
            
            if (localStorage.getItem(key) !== '') {
              
              splitKey = key.split('/');
              ids = value.split(',');
              
              _.forEach(ids, function(id) {
                  
                  var path = splitKey.slice(0,4).join('/')+'/'+id;
                  
                  try {
                    var o = JSON.parse(localStorage.getItem(path));
                    responses.push(o.poolid);
                  }
                  catch(e) {
                    // error   
                  }
              });
            }
          }
          
          // NameList
          if ( dirtyNames.exec(key) ) {
            
            if (localStorage.getItem(key) !== '') {
              
              splitKey = key.split('/');
              ids = value.split(',');
              
              _.forEach(ids, function(id) {
                  
                  var path = splitKey.slice(0,4).join('/')+'/'+id;
                  
                  try {
                    var o = JSON.parse(localStorage.getItem(path));
                    names.push(o.poolid);
                  }
                  catch(e) {
                    // error
                  }                                                                                                           
              });
            }
          }
      });
      
      // Combine dirty responses and nameLists.
      namesAndResponses = _.union(_.intersection(pools, names), _.intersection(pools, responses));
      
      // Grab actual survey titles for display to user.
      _.each(poolListings.models, function(o) { 
          if ( namesAndResponses.includes(o.attributes.poolid) ) {
            poolTitles.push(o.attributes.title);
          }
      });
      
      // Update component text
      if (poolTitles.length > 0 ) {
        dirtyRecordInfo = 'The following surveys have records that have not been loaded to the server: ' + poolTitles.join(', ');
        this.viewSync._setAttributes({'message': dirtyRecordInfo });
        this.viewSync._setAttributes({'disabled': false });
      } else {
        this.viewSync._setAttributes({'message': 'All of your records have been loaded to the server.' });
        this.viewSync._setAttributes({'disabled': true });
      }
      
    }
});

module.exports = LayoutAdminPoolListings;
