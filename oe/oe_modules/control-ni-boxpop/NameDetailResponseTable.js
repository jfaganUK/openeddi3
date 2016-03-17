/**
 * Created by jfagan on 11/3/15.
 * oe/oe_modules/control-ni-boxpop/NameDetailResponseTable.js:3
 */

var _ = require('lodash');

// This does not read the database, it takes response data as given and then returns
// a parsed object for the response table
function getResponseTable(eddi, response) {
    var o = {};

    switch (eddi.controltype) {
        case 'radiolist':
            o = parseRadiolist(eddi, response);
            break;
        case 'checklist':
            o = parseChecklist(eddi, response);
            break;
        case 'shorttext':
            o = parseShorttext(eddi, response);
            break;
        default:
            break;
    }
    return (o);
}


function parseRadiolist(eddi, response) {
    var o = {};
    if (response) {
        o[eddi.title] = response.value;
        if (eddi.other) {
            o[eddi.title + '__other'] = response.other;
        }
    } else {
        o[eddi.title] = "NA";
        if (eddi.other) {
            o[eddi.title + '__other'] = "";
        }
    }
    return (o);
}

function parseChecklist(eddi, response) {
    var o = {};
    var ap = eddi.arrayPrompts;

    // make sure there's a column for each array option, default it to false (since they're checkboxes)
    _.each(ap, function (a) {
        var k = eddi.title + '__' + a.value;
        // if no responses is provided it will default all to false
        o[k] = false;
        if (response && response.value.hasOwnProperty(a.arrayid)) {
            o[k] = response.value[a.arrayid];
        }
    });

    if (eddi.other) {
        o[eddi.title + '__other'] = '';
    }

    return (o);
}

function parseShorttext(eddi, response) {
    var o = {};

    if (response) {
        o[eddi.title] = response.value;
    } else {
        o[eddi.title] = '';
    }

    return (o);
}


module.exports = getResponseTable;
