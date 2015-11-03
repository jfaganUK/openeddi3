/**
 * Created by jfagan on 6/15/15.
 * /home/jfagan/Dropbox/projects/openeddi/openeddi3/oe/oe_client/views/view-admin-response-table-summaries.js
 */

var ViewAdminResponseTableSummary = require('./view-admin-response-table-summary');

module.exports = Mn.CollectionView.extend({
    className: 'flex layout vertical',
    childView: ViewAdminResponseTableSummary,
    onShow: function() {
        console.log('[ViewResponseTableSummaries] Showing...');
    }
});