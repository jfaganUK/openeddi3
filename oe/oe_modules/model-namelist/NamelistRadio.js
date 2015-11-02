/**
 * Created by jfagan on 5/1/15.
 * oe/oe_modules/model-namelist/NamelistRadio.js
 */
"use strict";

var App = require('../../oe_client/application');

var oldRegisterRadioChannels = App.prototype.registerRadioChannels;
App.prototype.registerRadioChannels = function () {
    this.channels.namelist = Backbone.Radio.channel('namelist');
    Backbone.Radio.tuneIn('namelist');
    oldRegisterRadioChannels.apply(this, arguments);
};

var oldListenRadioChannels = App.prototype.listenRadioChannels;
App.prototype.listenRadioChannels = function () {
    this.channels.namelist.comply('add-new-name', this.namelistAddNewName, this);
    this.channels.namelist.comply('save-name-detail', this.namelistSaveNameDetail, this);
    oldListenRadioChannels.apply(this, arguments);
};

App.prototype.namelistAddNewName = function (e) {
    console.log('--- App: add new name.');
    console.log(e);

    var newname = this.currentPool.namelist.create({
        name: e.name,
        namelist: e.namelist,
        puid: app.appState.get('puid'),
        poolid: app.appState.get('poolid')
    });

    if (this.currentPool.namelist.remote) {
        newname.once('sync', function () {
            newname.appendToList(e.namelist);
        });
    } else {
        newname.appendToList(e.namelist);
    }
};

App.prototype.namelistSaveNameDetail = function (e) {
    console.log('--- App: add name detail.');
    console.log(e);

    var m = app.currentPool.namelist.find({id: e.id});
    m.addToDetails(e.eid, e.value);
    m.save();
};



