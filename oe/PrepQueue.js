/**
 * Created by jfagan on 5/2/15.
 * oe/PrepQueue.js
 *
 * Note: this was just used for testing async.
 * I was originally going to create my own class for an asynchronous function queue
 * but I don't think I could do it better than async has done. Besides, thsi library should
 * be very useful for other purposes too.
 */

"use strict";

var async = require('async');

var FunctionQueue = function () {
    this.queue = [];
};

FunctionQueue.prototype = {
    add: function (fn, context, params) {
        this.queue.push(this.wrapFunction(fn, context, params));
    },

    wrapFunction: function (fn, context, params) {
        return function () {
            fn.apply(context, params);
        }
    }
};

var fun1 = function (callback) {
    var insideFun = function () {
        console.log('Fun1: Inside function!');
        callback();
    };

    setTimeout(insideFun, 2000);
    console.log('Fun1')
};

var fun2 = function (callback) {
    var insideFun = function () {
        console.log('Fun2: Inside function!');
        callback();
    };

    setTimeout(insideFun, 2000);
    console.log('Fun2')
};

var q = new FunctionQueue();

async.series([fun1, fun2, fun1], function () {
    console.log('All functions complete');
});



