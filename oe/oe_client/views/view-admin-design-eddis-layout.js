/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/view-admin-design-eddis-layout.js
 */

var template = require('../templates/template-admin-design-eddis-layout.ejs');
var ViewNewEddi = require('./view-admin-design-new-eddi');
var ViewEddiList = require('./view-admin-design-eddi-list');
var CollectionDesignEddiList = require('../collections/collection-admin-design-eddi-list');


var ViewAdminDesignEddisLayout = Mn.LayoutView.extend({
    template: template,
    regions: {
        "neweddi": "#oe-admin-design-eddis-new-eddi",
        "eddilist": "#oe-admin-design-eddis-list"
    },
    initialize: function (opts) {
        this.opts = opts || {};
        this.sheetid = opts.sheetid;
        this.model = app.channels.pool.request('get-pool-design-model');
        app.channels.pool.comply('set-eddi-sheetid', this.setSheetID, this);
        app.channels.pool.reply('get-eddi-sheetid', this.getSheetID, this);
    },
    onShow: function () {
        this.showNewEddi();
        this.showEddiList();
        this.model.on('change', this.showEddiList(), this);
    },
    showNewEddi: function () {
        var viewNewEddi = new ViewNewEddi({model: this.model});
        this.neweddi.show(viewNewEddi);
    },
    showEddiList: function () {
        var self = this;
        var poollogic, eddis, eddiList;
        var viewEddiList;

        poollogic = this.model.get('poollogic');
        eddis = _.filter(poollogic.eddilogic, function (e) {
            return (e.sheetid === self.eddiSheetid);
        });
        eddiList = new CollectionDesignEddiList(eddis);
        viewEddiList = new ViewEddiList({collection: eddiList});
        this.eddilist.show(viewEddiList);
    },
    setSheetID: function (sheetid) {
        this.eddiSheetid = sheetid;
        this.showEddiList();
    },
    getSheetID: function () {
        return (this.eddiSheetid);
    }
});
module.exports = ViewAdminDesignEddisLayout;
