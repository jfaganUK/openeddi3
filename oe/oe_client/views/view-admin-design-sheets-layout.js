/**
 * Created by jfagan on 6/23/15.
 * oe/oe_client/views/view-admin-design-sheets-layout.js:3
 */


var template = require('../templates/template-admin-design-sheets-layout.ejs');
var ViewNewSheet = require('./view-admin-design-new-sheet');
var ViewSheetList = require('./view-admin-design-sheet-list');
var CollectionSheetDesign = require('../collections/collection-admin-design-sheet-list');

var ViewAdminDesignSheetsLayout = Mn.LayoutView.extend({
    template: template,
    regions: {
        "newsheet": "#oe-admin-design-sheets-new-sheet",
        "sheetlist": "#oe-admin-design-sheets-list"
    },
    initialize: function (opts) {
        this.opts = opts || {};
        this.model = app.channels.pool.request('get-pool-design-model');
        this.model.on('change', this.showList, this);

        app.channels.pool.comply('update-sheet', this.updateSheet, this);
    },
    onShow: function () {
        var viewNewSheet = new ViewNewSheet({model: this.model});
        this.newsheet.show(viewNewSheet);
        this.showList();
    },
    showList: function () {
        var sheets = this.model.get('poollogic').sheetlogic;
        var sheetList = new CollectionSheetDesign(sheets);
        var viewSheetList = new ViewSheetList({collection: sheetList});
        this.sheetlist.show(viewSheetList);
    },

    updateSheet: function (sheet) {
        // clone the poollogic object
        var poollogic = _.clone(this.model.get('poollogic'));

        // only keep the sheets that don't equal this sheet
        var sheets = _.filter(poollogic.sheetlogic, function (x) {
            return (x.sheetid !== sheet.sheetid);
        });

        // add the updated sheet
        sheets.push(sheet);
        poollogic.sheetlogic = sheets;
        this.model.set('poollogic', poollogic);
        this.model.save();
    }
});
module.exports = ViewAdminDesignSheetsLayout;