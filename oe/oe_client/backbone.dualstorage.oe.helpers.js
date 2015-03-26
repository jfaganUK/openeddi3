/**
 * Created by jfagan on 3/24/15.
 *
 */

var Backbone = require('backbone');
var _ = require('lodash');

Backbone.Collection.prototype.createStore = function () {
    if (typeof this.url === 'function') {
        this.store = new Store(this.url());
    } else {
        this.store = new Store(this.url);
    }
};

Store.prototype.getIds = function () {
    return this.recordsOn(this.name);
};

Store.prototype.getDirty = function () {
    return this.recordsOn(this.name + '_dirty');
};

Store.prototype.getDestroyed = function () {
    return this.recordsOn(this.name + '_destroyed');
};

//Intended to remove the key, the destroyed, and dirty
Store.prototype.totalClear = function () {
    localStorage.removeItem(this.name);
    localStorage.removeItem(this.name + '_dirty');
    localStorage.removeItem(this.name + '_destroyed');
    this.clear();
};

