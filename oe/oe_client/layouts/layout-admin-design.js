/**
 * Created by jfagan on 6/21/15.
 * oe/oe_client/layouts/layout-admin-design.js
 */

var template = require('../templates/template-layout-admin-design.ejs');
var ModelPoolDesign = require('../models/model-admin-pooldesign');
var ViewPoolDetails = require('../views/view-admin-design-pooldetails');
var ViewSheetsLayout = require('../views/view-admin-design-sheets-layout');

var LayoutAdminDesign = Mn.LayoutView.extend({
    template: template,
    regions: {
        "main": "#admin-layout-design-main",
        "sheets": "#admin-layout-design-sheets",
        "eddis": "#admin-layout-design-eddis"
    },
    initialize: function (opts) {
        this.opts = opts || {};
        this.page = opts.page || 'pooldetails';

        app.channels.pool.comply('save-pool-design', this.savePoolDesign, this);
        app.channels.pool.comply('push-pool', this.pushPool, this);
        app.channels.pool.comply('create-new-sheet', this.createNewSheet, this);
        app.channels.pool.reply('get-pool-design-model', this.giveDesignModel, this);
    },
    onShow: function () {
        var self = this;
        // if we don't have the model, then fetch it
        if (!this.model) {
            this.model = new ModelPoolDesign({poolid: this.opts.poolid});
            this.model.fetch({
                success: function () {
                    self.showMain();
                }
            })
        } else {
            this.showMain();
        }
    },
    showMain: function () {
        // For now, I'm just putting everything on one page
        // I will probably reorganize it later
        // switch(this.page) {
        //    case 'pooldetails':
        //        this.showPoolDetails();
        //        break;
        //    default:
        //        this.showPoolDetails();
        //        break;
        //}
        this.showPoolDetails();
        this.showSheets();
    },
    showPoolDetails: function () {
        var pd = new ViewPoolDetails({model: this.model});
        this.main.show(pd);
    },
    savePoolDesign: function () {
        this.model.save();
    },
    showSheets: function () {
        var v = new ViewSheetsLayout({model: this.model});
        this.sheets.show(v);
    },
    createNewSheet: function (sheet) {
        var poollogic = _.clone(this.model.get('poollogic'));
        poollogic.sheetlogic.push(sheet);
        this.model.set('poollogic', poollogic);
        this.model.save();
    },
    pushPool: function () {
        this.model.push();
    },
    giveDesignModel: function () {
        return (this.model);
    }

});
module.exports = LayoutAdminDesign;