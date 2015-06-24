/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/collections/collection-admin-design-eddi-list.js
 */

var ModelAdminDesignEddi = Backbone.Model.extend({
    initialize: function () {
        var oe = _.clone(this.attributes);
        this.set('oe', _.omit(oe, 'oe'));
    }
});

var CollectionAdminDesignEddiList = Backbone.Collection.extend({
    model: ModelAdminDesignEddi,
    initialize: function (opts) {

    }
});
module.exports = CollectionAdminDesignEddiList;