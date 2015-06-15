/**
 * Created by jfagan on 6/13/15.
 *
 */

var Namelist = require('../../oe_server/db/models/_list').Namelist;
var _ = require('lodash');
var log = require('util').log;

module.exports = function getNameTies(poolid, callback) {
    /*  Tie Output Table
     *  [{
     *    poolid: the id of the pool,
     *    puid: the unique id of the respondent,
     *    lastupdated: the last time the source name was updated,
     *    name: the ego name,
     *    nameid: the guid of the ego,
     *    targetname: the target's name,
     *    targetid: the guid of the target,
     *    relation: the relationship type,
     *    mode: ['directed','undirected'],
     *    weight: some numeric value for weight,
     *    OtherDetails: other tie ties... they would be listed by column and name
     *    }]
     *
     *
     *
     */

    var tieTable = [];

    Namelist.findAll({where: {poolid: poolid}})
        .then(function (row) {
            var nameTable = {},
                relations;
            var details = _.pluck(row, 'details');
            var ties = _.pluck(details, 'ties');
            for (var i = 0; i < row.length; i++) {
                nameTable[row[i].id] = {
                    name: row[i].name,
                    ties: ties[i],
                    puid: row[i].puid,
                    lastupdated: row[i].lastupdated
                };
            }
            // Every person has a detail called 'ties'
            // ties is an object where each property is keyed on the target of the tie
            // and then the properties of each tie are an array of relation objects
            // This way each person can have an 'array' of different relationships
            // with any other person.
            for (var source in nameTable) {
                for (var target in nameTable[source].ties) {
                    relations = nameTable[source].ties[target];
                    _.forEach(relations, function (rel) {
                        tieTable.push({
                            poolid: poolid,
                            puid: nameTable[source].puid,
                            lastupdated: nameTable[source].lastupdated,
                            name: nameTable[source].name,
                            nameid: source,
                            target: nameTable[target].name,
                            targetid: target,
                            relation: rel.relation,
                            mode: rel['type'],
                            weight: rel.weight || 'NA'
                        });
                    });

                }
            }

            callback(tieTable);
        })
        .catch(function (err) {
            console.error('[getNameTies]', err);
            callback(err);
        });
};