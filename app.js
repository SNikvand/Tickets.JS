
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var route_admin = require('./routes/admin');
var http = require('http');
var path = require('path');
var permissions = require('./lib/permissions.js');
var md5 = require( 'MD5' );

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

app.post('/login', function(req, res) {
    // authenticates username and password
    authenticate(req.body.username, req.body.password);

    function authenticate(user, pass) {
        ticket_server.authenticateLogin(user, md5(pass), authCallback);
    }

    function authCallback(sendback) {
        console.log(JSON.stringify(sendback));

        if (sendback.isValid == false) {
            console.log("false");
            res.render('index', {issue: sendback.issue})
        } else {
            req.session.user = req.body.username;
            req.session.role = sendback.userRole;
            req.session.dept = sendback.userDepts;
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

app.post('/verifyAccess', function(req, res) {
    console.log("verifyAccess session: " + JSON.stringify(req.session));
    var role = req.session.role;
    var pageid = req.body.pageid.toString();
    res.send(permissions.checkRestriction(pageid, role, res));
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

var ticket_server = require('./lib/ticket_server.js');
ticket_server.listen(server);
