//Copyright (c) 2014, Jeremy Fairbank <elpapapollo@gmail.com>
//
//Permission to use, copy, modify, and/or distribute this software for any
//    purpose with or without fee is hereby granted, provided that the above
//copyright notice and this permission notice appear in all copies.
//
//THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
//WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
//MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
//ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
//WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
//ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
//OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

module.exports = Marionette.ItemView.extend({
    constructor: function (options) {
        console.log('[marionette.polymer] Constructing view: ' + this.tagName);
        Marionette.View.prototype.constructor.apply(this, arguments);
        // these methods presume a model exists
        if (this.model) {
            this._setPublishedKeys();
            this._initAttrsFromModel();
            this._initModelEvents();
            this._initPolymerEvents();
        }
    },

    _setPublishedKeys: function () {
        // This won't work in a polyfill, so we have to manually set the published keys
        //this._publishedKeys = _.keys(this.el.publish);
    },

    _initAttrsFromModel: function () {
        this._setElAttrs(this.model.attributes);
    },

    _initModelEvents: function () {
        this.listenTo(this.model, 'change', this._updateElAttrsFromModel);
    },

    _initPolymerEvents: function () {
        if (!this.events) {
            this.events = {};
        }

        _.each(this._publishedKeys, function (key) {
            this.events['change:' + key] = _.bind(this._updateAttrFromEl, this, key);
        }, this);

        this.delegateEvents();
    },

    _updateAttrFromEl: function (attributeName) {
        var value = this.el[attributeName];
        this.model.set(attributeName, value);

        // jfagan: want to communicate with the message bus here.
        if (attributeName === 'response') {
            app.channels.response.trigger('response-updated', this.model);
        }
    },

    _updateElAttrsFromModel: function () {
        this._setElAttrs(this.model.changed);
    },

    _setElAttrs: function (attributes) {
        var attributeNames = _.intersection(_.keys(attributes), this._publishedKeys);
        _.each(attributeNames, this._setElAttr, this);
        // This won't work under a polyfill. We will have to take another approach
        this.el.fire('attributes-updated', this.model);
        app.channels.pool.trigger('attributes-updated', this.model);
        this.el['attrUpdate'] = new Date();
    },

    _setElAttr: function (attributeName) {
        this.el[attributeName] = this.model.get(attributeName);
    }
});
