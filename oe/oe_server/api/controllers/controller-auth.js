/**
 * Created by jfagan on 5/31/15.
 * oe/oe_server/api/controllers/controller-auth.js:3
 *
 * User authentication.
 */

var User = require('../../db/models/_list').User;
var log = require('util').log;
var csrf = require('csurf');
var bcrypt = require('bcryptjs');
var _ = require('lodash');

var csrfProtection = csrf();

function getAuth(req, res, next) {
    log('[getAuth] Confirming authentication');
    log("Authenticating " + req.body.username);
    var d = {auth: false};
    if (req.session.admin && req.session.admin === true) {
        d.auth = true;
    }

    res.status(200).json(d);
}
module.exports.get = getAuth;

function userLogin(req, res, next) {
    var username = req.body.username,
        password = req.body.password,
        returnMessage;
    log('[userLogin] User logging in: ' + username);

    var sess = req.session;
    if (sess.logins) {
        sess.logins++;
        log('[userLogin] Logins: ' + sess.logins);
    } else {
        sess.logins = 1;
    }
    req.session.admin = false;

    User.find({where: {username: username}})
        .complete(function (err, user) {
            if (!!err) {
                returnMessage = 'A system error occurred: ' + err.message;
                log(returnMessage);
                res.status(500).json({error: returnMessage, errid: 0});
            } else if (!user) {
                returnMessage = 'Could not find user.';
                log(returnMessage);
                res.status(200).json({error: returnMessage, errid: 1});
            } else {
                // Found the user. Test the password.
                if (bcrypt.compareSync(password, user.dataValues.pwd)) {
                    // Success. Log them in.
                    req.session.admin = true;
                    res.status(200).json(_.omit(user.dataValues, ['pwd']));
                } else {
                    returnMessage = 'Invalid username or password';
                    log(returnMessage);
                    res.status(200).json({error: returnMessage, errid: 2});
                }
            }
        });

}
module.exports.login = userLogin;