/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/collections/collection-admin-design-sheet-list.js
 */
var ModelAdminDesignSheet = Backbone.Model.extend({});
var CollectionAdminDesignSheetList = Backbone.Collection.extend({
    model: ModelAdminDesignSheet,
    attributes: {
        "layout": "",
        "vertical": "",
        "flex": ""
    },
    initialize: function (opts) {
    }
});
module.exports = CollectionAdminDesignSheetList;
