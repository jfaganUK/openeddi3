/**
 * Created by jfagan on 3/9/15.
 */

var guid = require('../helpers/guid');

module.exports = Backbone.Model.extend({
    defaults: {
        poolTitle: 'default title',
        dateCreated: '1982-10-10 18:43:00-05:00'
    },
    idAttribute: 'poolid',
    initialize: function() {
        // we need to avoid using 'title' since it doesn't interact well with Polymer elements
        // it's the name of an HTML element (you know, the <title> element).
        if(this.attributes.title) {
            this.attributes.poolTitle = this.attributes.title;
        }
    }
});

