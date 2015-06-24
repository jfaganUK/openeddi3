/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/collections/collection-admin-design-sheet-list.js
 */
var ModelAdminDesignSheet = Backbone.Model.extend({
    initialize: function () {
        // doing stuff like this since I only want to work from one real model:
        // the pooldesign model attached to the pool design layout.
        // this is just a temporary model for rendering purposes
        var oe = {
            title: this.get('title'),
            sheetid: this.get('sheetid'),
            description: this.get('description')
        };
        this.set('oe', oe);
    }
});


var CollectionAdminDesignSheetList = Backbone.Collection.extend({
    model: ModelAdminDesignSheet,
    initialize: function (opts) {
    }
});
module.exports = CollectionAdminDesignSheetList;
