//created by Shahin Nikvand
//edited by Matthew Chan

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var route_admin = require('./routes/admin');
var route_client = require('./routes/client');
var route_login = require('./routes/login');
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var permissions = require('./lib/permissions.js');

var options = {
    key: fs.readFileSync('./certs/privatekey.pem'),
    cert: fs.readFileSync('./certs/certificate.pem')
};

var config = require( './lib/config' );
var md5 = require( 'MD5' );
var Hashids = require( 'hashids' );
var hashids = new Hashids( config.secret );

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('M3ZZ0-S0PR4N0'));
app.use(express.session());

// grants client access to session variables
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/admin', route_admin.index);
app.get('/client', route_client.index);
app.get('/login', route_login.index);

app.post('/login', function(req, res) {
    // authenticates username and password
    authenticate(req.body.username.replace(/'/g, "''"), req.body.password.replace(/'/g, "''"));

    function authenticate(user, pass) {
        ticket_server.authenticateLogin(user, md5(pass), authCallback);
    }

    function authCallback(sendback) {
        console.log(JSON.stringify(sendback));

        if (sendback.isValid == false) {
            console.log("false");
            res.render('login', {issue: sendback.issue})
        } else {
            req.session.user = req.body.username;
            req.session.role = sendback.userRole;
            req.session.dept = sendback.userDepts;

            if (req.session.dept == "none") {
                req.session.dept = [];
            }

            req.session.lastLogout = sendback.lastLogout;

            req.session.filters = {};
            req.session.filters.viewfilters = {dept: null, priority: null, assignedTo: null, alteredBy: null, submittedBy: null, clientEmail: null,
                dateCreated: null, dateAltered: null};
            req.session.filters.searchParams = {keywords: null, inTitle: false, inBody: false};
            req.session.filters.includeCompleted = "includeCompleted";
            req.session.filters.includeExpired = "includeExpired";
            req.session.filters.includeArchived = "includeArchived";
            req.session.filters.amount = null;
            res.redirect('/admin');
        }
    }
});

app.get('/logout', function(req, res) {
    ticket_server.setLogoutTime(req.session.user);
    req.session.destroy(function() {
        res.redirect('/');
    });
});

// mark that the user has already seen their "tickets since last logout"
// so that they don't appear again
app.post('/setLoggedIn', function(req, res) {
    req.session.lastLogout = "loggedIn";

    res.json(req.session.lastLogout);
});

app.get('/getSession', function(req, res) {
    res.json(req.session);
});

app.get('/getDepts', function(req, res) {

    function sendbackDepts(deptList) {
        var simpleArray = [];
        for (var x in deptList) {
            simpleArray.push(deptList[x].name);
        }
        console.log(JSON.stringify(simpleArray));
        res.json(simpleArray);
    }

    ticket_server.getAllDepts(sendbackDepts);
});

app.post('/delDept', function(req, res) {
    req.session.dept.splice(req.session.dept.indexOf(req.body.deptName), 1);

    res.json(req.session.dept);
});

app.post('/addDept', function(req, res) {
    req.session.dept.push(req.body.newDept);

    res.json(req.session.dept);
});

app.post('/verifyAccess', function(req, res) {
    if (req.body.pageid.toString() == "dept") {
        console.log("dept access: " + (req.session.dept.indexOf(req.body.extraParam1) != -1));
        res.send(req.session.dept.indexOf(req.body.extraParam1) != -1);
    } else if (req.body.pageid.toString() == "ticket") {
        var id = req.body.extraParam1;
        var isArchive = req.body.extraParam2;

        var table = (isArchive == true ? "tickets_archive" : "tickets");

        var query = "SELECT u.name AS assigned_to, d.name FROM " + table + " t LEFT JOIN departments d ON (t.department = d.id)" +
            " LEFT JOIN users u ON (t.assigned_to = u.id)" +
            " WHERE t.id = " + hashids.decrypt( id.substr( id.length - 2, 2 ) ); + ";";
        dbhelper.queryDatabase(query, returnAccess);

        function returnAccess(err, result) {
            var hasAccess;

            if (req.session.dept.indexOf(result.rows[0].name) != -1) {
                hasAccess = true;
            } else if (req.session.user == result.rows[0].assigned_to) {
                hasAccess = true;
            } else {
                hasAccess = false;
            }
            res.send(hasAccess);
        }
    } else {
        var role = req.session.role;
        var pageid = req.body.pageid.toString();
        res.send(permissions.checkRestriction(pageid, role, res));
    }
});

app.post('/setFilters', function(req, res) {
    req.session.filters.viewfilters = req.body.viewfilters;
    req.session.filters.searchParams = req.body.searchParams;
    req.session.filters.includeCompleted = req.body.includeCompleted;
    req.session.filters.includeExpired = req.body.includeExpired;
    req.session.filters.includeArchived = req.body.includeArchived;
    req.session.filters.amount = req.body.amount;

    res.json(req.session.filters);
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var sslserver = https.createServer(options, app).listen(443, function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var ticket_server = require('./lib/ticket_server.js');
ticket_server.listen(server);
ticket_server.listen(sslserver);

var dbhelper = require('./lib/database.js');
