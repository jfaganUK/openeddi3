/**
 * Created by jfagan on 5/8/15.
 * oe/oe_modules/control-namepick/NamePick.js:3
 *
 * The name picker allows a user to add existing names to a namelist.
 * Usually used sequentially with a name generator.
 *
 * LayoutView and CollectionView are both here.
 * Then the name-card component and
 *
 */

var NamePickCard = require('./NamePick-Name');
var EddiModel = require('../../oe_client/models/model-eddi');
var template = require('./templateNamePick.ejs');

var NamePickList = Mn.CollectionView.extend({
    childView: NamePickCard,
    initialize: function () {
        this.childViewOptions = {
            namelist: this.options.namelist
        };
    }
});

module.exports = Mn.LayoutView.extend({
    model: EddiModel,
    template: template,
    initialize: function () {
        console.log('initialize namepick');
    },
    regions: {
        namePickNames: "#oe-namepick-names"
    },
    onShow: function () {
        // Display the list of names
        var namePickList = new NamePickList({
            collection: app.currentPool.namelist,
            namelist: this.model.get('namelist')
        });
        this.namePickNames.show(namePickList);
    }
});

