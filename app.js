
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

//var route_admin = require('./routes/admin');
var route_welcome = require('./routes/admin/welcome');
var route_viewTickets = require('./routes/admin/viewTickets');
var route_viewUsers = require('./routes/admin/viewUsers');
var route_newUser = require('./routes/admin/newUser');
var route_restrict = require('./routes/admin/restrict');

var http = require('http');
var path = require('path');
var permissions = require('./lib/permissions.js');

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

var getAccess = function(pageid) {
    return function(req, res, next) {
        var role = req.session.role;
        if (role != "Admin" && role != "Manager" && role != "IT User") {
            res.redirect('/');
        }
        if (permissions.checkRestriction(pageid, role) == false) {
            res.locals.access = false;
        } else {
            res.locals.access = true;
        }
        next();
    }
}

app.get('/', routes.index);
app.get('/admin', getAccess("admin"), route_welcome.index);
app.get('/admin/viewTickets', getAccess("viewTickets"), route_viewTickets.index);
app.get('/admin/viewUsers', getAccess("viewUsers"), route_viewUsers.index);
app.get('/admin/newUser', getAccess("newUser"), route_newUser.index);
app.get('/admin/restrict', route_restrict.index);

app.post('/login', function(req, res) {
    // AUTHENTICATION: check req.body.username and req.body.password against the database
    // DATABASE FUNCTION: retrieve role from database for this user
    // DATABASE FUNCTION: retrieve set of departments assigned to this user
    // if admin, depts return "all"
    // if IT user, depts return "none" or "null"

    // set the sessions
    req.session.user = req.body.user;
    req.session.role = req.body.role;
    req.session.depts = ["Finance", "Management"];

    // configure default filter parameters
    if (req.session.role == "Admin") {
        var adminFilter = {dept: null, priority: null, submittedBy: null, clientEmail: null,
            assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};
        req.session.filters = adminFilter;
    } else if (req.session.role == "Manager") {
        var managerFilter = {dept: req.session.depts, priority: null, submittedBy: null, clientEmail: null,
            assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};
        req.session.filters = managerFilter;
    } else if (req.session.role == "IT User") {
        var ituserFilter = {dept: null, priority: null, submittedBy: null, clientEmail: null,
            assignedTo: req.session.user, alteredBy: null, dateCreated: null, dateAltered: null};
        req.session.filters = ituserFilter;
    }

    res.redirect('/admin');
});
app.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var ticket_server = require('./lib/ticket_server.js');
ticket_server.listen(server);
