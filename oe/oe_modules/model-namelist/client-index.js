/**
 * Created by jfagan on 4/22/15.
 *
 */
"use strict";


var models = {};
var views = {};
var collections = {};

models.oemodel = require('./NameModel');
collections.oecollection = require('./NameCollection');

// Add the radio channels
require('./NamelistRadio');

// Add the prep functions
require('./NamelistPrep');

module.exports.models = models;
module.exports.views = views;