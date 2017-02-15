/**
 * Created by bront on 12/01/16.
 */

var template = require('../templates/template-blank-template.ejs');
// var PoolListingCollection = require('../collections/collection-pool-listings');
var PoolListingsCollection = require('../collections/collection-pool-listings');

var ViewAdminSyncData = Mn.PolymerView.extend({
    template: template,
    tagName: 'oe-admin-sync',
    
    initialize: function (opts) {
      this.opts = opts;
      this.radioListen();
    },
    
    radioListen: function() {
      app.channels.response.comply('sync', this.syncDirtyRecords, this);
      app.channels.response.comply('clearLocalStorage', this.clearLocalStorage, this);
      app.channels.response.comply('hasDirtyRecords', this.hasDirtyRecords, this);
    },
    
    onShow: function() {
      var self = this;
      this.loadPoolsCheckDirty();
    },

    loadPoolsCheckDirty: function() {
      var self = this;
      var poolListingsCollection = new PoolListingsCollection();
     
      poolListingsCollection.fetch({
          success: function (results) {
            this.poolListings = results;
            self.hasDirtyRecords(results); 
            self.checkLocalStorage();
          }
      });
      
    },
    
    syncDirtyRecords: function() {
      
      var splitKey, ids, responsesArray = [], namesArray = [], nameCollection = [], eddiCollection, nameListCollection, self = this;
      var dirtyResponses = self.records.getDirtyResponses;
      var dirtyNames = self.records.getDirtyNames;              
      
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

      var responses = [], names = [], poolTitles = [], namesAndResponses, dirtyRecordInfo = '', splitKey, self = this;
      var dirtyResponses = self.records.getDirtyResponses;
      var dirtyNames = self.records.getDirtyNames;                                                                     
      var pools = poolListings.pluck('poolid');
      
      // Iterate localStorage
      _.forOwn(localStorage, function(value, key) { 
          
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
        self._setAttributes({'message': dirtyRecordInfo });
        self._setAttributes({'disabled': false });
      } else {
        self._setAttributes({'message': 'All of your records have been loaded to the server.' });
        self._setAttributes({'disabled': true });
      }
      
    },
    
    checkLocalStorage: function() {
      
      // I am assuming here, in accordance with International System of Units (SI), that kilo refers to 1,000 (not 1,024) and mega to 100,000 (not 1,048,576).
      var lsTotal = 0, msg, lsLimit = 5000000, percentage = 0, self = this;
      
      _.forOwn(localStorage, function(value, key) { 
          lsTotal += (value.length + key.length) * 2;
      });
      
      percentage = Math.round((lsTotal/lsLimit)*100);
      msg = 'Local storage currently using ' + percentage + '% of the total available space';
      if (percentage === 0) {
        self._setAttributes({'localstoragebuttondisabled': true });
      }
      self._setAttributes({'localstoragemessage': msg });
        
    },
    
    clearLocalStorage: function() {
      localStorage.clear();
      this.checkLocalStorage();
      this.loadPoolsCheckDirty();
      
      
    }
    
});
module.exports = ViewAdminSyncData;
