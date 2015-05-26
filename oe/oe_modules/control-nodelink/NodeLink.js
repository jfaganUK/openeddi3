/**
 * Created by jfagan on 5/18/15.
 * oe/oe_modules/control-nodelink/NodeLink.js:3
 */
'use strict';

var template = require('./templateNodeLink.ejs');
var Graph = require('../model-namelist/GraphModel');

module.exports = Mn.PolymerView.extend({
    tagName: 'oe-nodelink',
    template: template,
    initialize: function () {
        // Set the operations attribute
        if (!this.model.get('response').operations) {
            var response = _.clone(this.model.get('response'));
            response.operations = [];
            this.model.set('response', response);
        }

        // Create the graph object
        this._createGraph();
    },

    // The Graph is an object that is bound to the component
    // The real data we want is stored in each of the nodes in the namelist collection / model
    // This just provides an interface to the component
    _createGraph: function () {
        var graph = new Graph();
        var namelist = this.model.get('namelist');
        var nodes;

        // Set the nodes
        // If there is actually a namelist, filter it down
        if (namelist) {
            nodes = app.currentPool.namelist.namesInList(namelist);
        } else {
            nodes = app.currentPool.namelist.models;
        }
        graph.set('nodes', nodes);

        // Set the edge details
        graph.set('tieDetails', this.model.get('tieDetails'));

        // Build the ties
        var ties = [];
        graph.set('ties', ties);

        this.model.set('graph', graph);
    }
});
