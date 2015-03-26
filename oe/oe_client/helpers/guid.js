/**
 * Created by jfagan on 3/13/15.
 */

function s4() {
    'use strict';
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function guid() {
    'use strict';
    return 'oe-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

module.exports = guid;