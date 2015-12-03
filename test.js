/**
 * Created by jfagan on 6/13/15.
 *
 */

/**
 * Created by jfagan on 3/6/15.
 * server.js
 */

var path = require('path');
global.appRoot = path.resolve(__dirname);

var appPort = 4444;                       // The port the server runs on.
var _ = require('lodash');                // For some functional programming
var fs = require('fs');                   // For using the file system.
var log = require('util').log;            // For better logging (with timestamps)
var inspect = require('util').inspect;
var async = require('async');
var bcrypt = require('bcryptjs');

// Load the configuration file
global.OEConfig = null;
var loadConfig = function (callback) {
    log('[startup] Loading config file.');
    fs.readFile(appRoot + '/oe/config.json', function (err, data) {
        if (err) {
            console.log(err);
        }
        OEConfig = JSON.parse(data);
        callback(err);
    });
};

// Load the Eddi modules
global.oeModules = null;
var loadEddiModules = function (callback) {
    log('[startup] Loading eddi modules');

    require('./oe/oe_server/load-oe-module-information')(function (d) {
        oeModules = d;
        callback(null);
    });
};

// Set up the database
var sequelize, models;
var setupDatabase = function (callback, results) {
    log('[startup] Preparing the database');
    function dbThen(db) {
        sequelize = db.sequelize;
        models = db.models;
        callback(null);
    }

    require('./oe/oe_server/db')(dbThen);
};

// The Express app and all the routes and such
var app;
var getExpressApp = function (callback) {
    log('[startup] Creating express application');
    app = require('./oe/oe_server/create_app');
    callback(null);
};

// Create admin user
var createAdminUser = function (callback) {
    var User = models.User;
    var admin = OEConfig.adminAccount;
    admin.pwd = bcrypt.hashSync(admin.password);

    User.findOrCreate({
        where: {username: admin.username},
        defaults: {
            pwd: admin.pwd,
            email: admin.email,
            fname: admin.firstName,
            lname: admin.lastName
        }
    })
        .then(function (user) {
            log('[createAdminUser] Admin user created');
            callback(null);
        });
};

// Start the oe_server
var startServerQueue = [loadConfig, loadEddiModules, setupDatabase, getExpressApp, createAdminUser];
async.series(startServerQueue, function (err, results) {
    log('[startup] Ready for test!');
    testing();
});

/**********************************************************************/

function testing() {
    var f = require('./oe/oe_modules/control-consent/ResponseTable.js');

    f('elph', {
        "eid": "consent1",
        "sheetid": "consent",
        "poolid": "elph",
        "sortIndex": 0,
        "title": "elphConsent",
        "controlmodule": "consent",
        "prompt": "Please take a minute to read our Consent Form",
        "consent": "<p>Please take a minute to read our Consent Form: You are being invited to participate in a study entitled    Reducing Health Inequities: The Contribution of Core Public Health Services in BC that is being conducted    by Bernie Pauly and other research team members. Bernie is a Scientist at the Centre for Addictions Research    in BC (CARBC) and Associate Professor in the School of Nursing at the University of Victoria and you    may contact her if you have further questions by emailing bpauly@uvic.ca or by phoning 250 472-5915.    This research is being funded by the Canadian Institutes of Health Research.</p><p><strong>Purpose:</strong> The purpose of the ELPH project is to engage in a collaborative, participatory process between    researchers and decision makers in all BC health authorities to study and foster learning about the use    of an equity lens during a period of complex system change in public health to inform systemic responses    for reducing health inequities. Research of this type is important because it contributes to staff learning    and knowledge development in equity-oriented practices and strategies; strengthens collaboration within and    across sectors to work together on reducing health inequities; identifies appropriate tools and frameworks    to guide the development, implementation and evaluation of equity strategies; and provides a framework to    support ethical public health practice in addressing ethical challenges inherent in developing and providing    mental health and substance use services to reduce health inequities. You are being asked to participate in    this study because of your involvement in public health programs and the expertise that you have in this area.    About the survey: The focus of this component of the project is to examine the collaborations between public    health and others outside health authorities and Ministry of Health with respect to reducing health inequities    through preventing the harms of substance use. By \"preventing the harms of substance use\" we mean public health    programs and policies that address alcohol, tobacco and/or illicit substance use. If you agree to voluntarily    participate in this research, you will be asked to participate in a social network analysis. You would complete    a survey identifying any professional relationships that you may have with organizations/ professional positions.    It is estimated that the survey will take approximately 45 minutes of your time to complete. Risks: Participation    in this study may cause some inconvenience to you as it will require some time commitment. However, the time you    spend will be directly related to health equity. In other words, it will take place during work time (unless it    is more convenient for you to participate outside work time). There are no known or anticipated risks to you by    participating in this research.</p><p><strong>Benefits:</strong> By participating in this research you will be making an important    contribution to knowledge of how intersectoral collaboration happens and what makes it effective. We hope this    information will be useful to people like you who work in public health and to policy makers wishing to make the    most of opportunities for collaboration between health and other sectors. Donation for each survey: You will also    benefit in knowing that for every survey completed, the ELPH project team will contribute $20 (up to a $2,000    maximum, total) to a not-for-profit organization in BC that supports work in health promotion and prevention of    harms. You will be asked to select one of three organizations at the end of the survey. We ask that you tell your    colleagues about this study to help boost participation and our donation. Confidentiality: Please be advised that    information about you that is gathered for social network analysis uses a secure web program Fluid Surveys, which    stores the data on servers in Canada.  We ask that you complete the survey using your real initials. We need real    initials to know whether people occur in more than one network. That is, if someone is identified in two surveys,    we’d like to know that this is the same person so that we can combine the networks for a more powerful analysis of    intersectoral collaboration. If two people in our data seem like they are probably the same person, but it is not    completely clear, we ask for your permission to contact you to ask a few follow up questions. We will ask for your    work email address at the end of the survey, but you can still submit a survey even if you don't provide an email    address. Your survey responses will be encrypted. As soon as all the surveys are finished, we will download the    survey responses and delete them from Fluid Surveys. We will then replace all initials of people and names of    organizations with codes. The code list will be password protected and kept separately from the survey responses.    We will only publish the results of this study in aggregated form. That is, your responses will be combined with    responses from others in your organization so that no one person’s responses will appear on their own. Please be    assured that information about anyone you identify as a colleague will be kept strictly confidential and will    never be reported to anyone outside this study for any reason except in aggregate form. It is important to note    that due to the nature of social network analysis, researchers cannot completely guarantee confidentiality.     However, there are a number of safeguards that will be put into place to protect your confidentiality.  First,    your initials will be removed and replaced by a code. Second, no individuals will be identified in any reports or    papers emerging from the project.  Finally, members of the research team who are health authority employees will    not have direct access to the data.  All data analysis will be conducted by academic members of the research team    and research staff. Voluntary participation: Your participation in this research must be completely voluntary. If    you do decide to participate, you may withdraw at any time without any consequences or any explanation. You may    skip questions in the survey by not entering a response. If you do withdraw from the study, the information you    provided up to the time of withdrawal will be kept in the dataset unless you indicate otherwise by contacting Dr.    Pauly: bpauly@uvic.ca. Sharing the results: It is anticipated that the results of this study will be shared with    others in the following ways: directly to participants and their organizations, to other health authorities and the    BC Ministry of Health through a Knowledge Exchange workshop, through scholarly journal or book chapter publications    and presentations at conferences, and on a website. Data storage: Data from this study will be secured for 5 years    post publication in Bernie Pauly’s office at the University of Victoria in a locked filing cabinet and/or on a    password protected computer after which time any paper copies will be destroyed. Electronic data will be saved    indefinitely, with all identifying information removed. Data collected during this study may be used for secondary    analysis by a graduate student writing a thesis if written permission is obtained from the principal investigator    and ethical approval has been granted.<p>Contact information: Dr. Pauly: bpauly@uvic.ca, 250-472-5915    Project coordinator: elph@uvic.ca, 250-721-6269, www.uvic.ca/elph In addition to being able to contact the    researcher at the above contact information, you may verify the ethical approval of this study, or raise any    concerns you might have, by contacting the following Human Research Ethics offices: University of Victoria at    250-472-4545 or ethics@uvic.ca  Island Health Research Ethics office at 250-370-8620  Rese  arch Participant    Complaint Line in the University of British Columbia Office of Research Ethics by e-mail at RSIL@ors.ubc.ca or    by phone at 604-822-8598 (Toll Free: 1-877-822-8598)  Vancouver Coastal Health operational research approval:    research@vch.ca, 604-875-4372  Interior Health Research Ethics Board: 250-870-4602 or    researchethics@interiorhealth.ca  Fraser Health Research Ethics Board (REB) co-Chair: 604-587-4681</p>    (Fraser Health approved consent form)  Northern Health Research Ethics office: researchcommittee@northernhealth.ca</p><h3>Selecting <strong>Agree</strong> below indicates that you understand the above conditions of participation in    this study and that you have had the opportunity to have your questions answered by the researchers.</h3><p>Email or call us if you have questions: elph@uvic.ca, bpauly@uvic.ca 250-472-5915</p>"
    }, function (x) {
        console.log(JSON.stringify(x, null, 2));
    });
}
