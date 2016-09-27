/**
 * Created by rhunter (APAX) on 8/10/16.
 * oe/oe_client/layouts/layout-admin-json.js
 */

var template = require('../templates/template-layout-admin-design.ejs');
var ModelPoolDesign = require('../models/model-admin-pooldesign');
var ViewPoolJSON = require('../views/view-admin-design-json');

var LayoutAdminJSON = Mn.LayoutView.extend({
    template: template,
    regions: {
        "main": "#admin-layout-design-main",
        "sheets": "#admin-layout-design-sheets",
        "eddis": "#admin-layout-design-eddis"
    },
    initialize: function (opts) {
        this.opts = opts || {};
        this.page = opts.page || 'pooljson';

        app.channels.pool.comply('save-pool-design', this.savePoolDesign, this);
        app.channels.pool.comply('save-pool-json', this.savePoolJSON, this);
        app.channels.pool.comply('push-pool', this.pushPool, this);
        app.channels.pool.comply('push-json', this.pushJSON, this);
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
        this.showPoolJSON();
    },
    showPoolJSON: function () {
        var pd = new ViewPoolJSON({model: this.model});
        this.main.show(pd);
    },
    savePoolDesign: function () {
        this.model.save();
    },
    savePoolJSON: function (poollogic) {
        this.model.attributes.poollogic = poollogic;
        this.model.save();
    },
    pushPool: function () {
        this.model.push();
    },
    pushJSON: function(poollogic) {
        this.model.attributes.poollogic = poollogic;
        this.model.push();
    },
    giveDesignModel: function () {
        return (this.model);
    }
});
module.exports = LayoutAdminJSON;