/**
 * Created by jfagan on 5/31/15.
 * oe/oe_client/models/model-user.js:3
 *
 * Note that I liberally borrowed from user alexanderscott and his
 * Backbone / Express user authentication model.
 * https://github.com/alexanderscott/backbone-login/blob/master/public/models/SessionModel.js
 * Uses MIT license.
 */

module.exports = Backbone.Model.extend({
    defaults: {
        id: 0,
        username: '',
        name: '',
        email: ''
    },

    urlRoot: '/api/auth',

    authUser: function () {
        var self = this;
        this.fetch({
            success: function (mod, res) {
                console.log('auth success!');
            },
            error: function (mod, res) {
                console.log('auth error!');
            }
        });
    },

    // Fxn to update user attributes after recieving API response
    updateSessionUser: function (userData) {
        this.set(_.pick(userData, _.keys(this.defaults)));
    },


    postAuth: function (opts, callback, args) {
        var self = this;
        var postData = _.omit(opts, 'method');
        console.log('[postAuth] Method: ' + opts.method);
        $.ajax({
            url: self.urlRoot + '/' + opts.method,
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            beforeSend: function (xhr) {
                // Set the CSRF token in the header for security
                // Cross-Site Request Forgery
                var token = $('meta[name="csrf-token"]').attr('content');
                if (token) {
                    xhr.setRequestHeader('x-csrf-token', token);
                }
            },
            data: JSON.stringify(_.omit(opts, 'method')),
            success: function (res) {
                if (!res.error) {
                    if (_.indexOf(['login', 'signup'], opts.method) !== -1) {
                        self.updateSessionUser(res.user || {});
                        self.set({userid: res.id, loggedIn: true});
                    } else {
                        self.set({loggedIn: false});
                    }

                    if (callback && 'success' in callback) {
                        callback.success(res);
                    }

                } else {
                    if (callback && 'error' in callback) callback.error(res);
                }

            },
            error: function (mod, res) {
                if (callback && 'error' in callback) {
                    callback.error(res);
                }
            }
        })
            .complete(function () {
                if (callback && 'complete' in callback) {
                    callback.complete(res);
                }
            });
    },

    login: function (opts, callback, args) {
        this.postAuth(_.extend(opts, {method: 'login'}), callback);
    },

    logout: function (opts, callback, args) {
        this.postAuth(_.extend(opts, {method: 'logout'}), callback);
    },

    signup: function (opts, callback, args) {
        this.postAuth(_.extend(opts, {method: 'signup'}), callback);
    },

    removeAccount: function (opts, callback, args) {
        this.postAuth(_.extend(opts, {method: 'removeAccount'}), callback);
    }
});
