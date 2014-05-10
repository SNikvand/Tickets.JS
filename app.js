
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
    };

    function authCallback(sendback) {
        console.log(JSON.stringify(sendback));

        if (sendback.isValid == false) {
            console.log("false");
            res.render('index', {issue: sendback.issue})
        } else {
            req.session.user = req.body.username;
            req.session.role = sendback.userRole;
            req.session.dept = sendback.userDepts;
            res.redirect('/admin');
        }
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

app.get('/getSession', function(req, res) {
    res.json(req.session);
});

app.post('/verifyAccess', function(req, res) {
    var role = req.session.role;
    var pageid = req.body.pageid.toString();
    res.send(permissions.checkRestriction(pageid, role, res));
});

app.post('/login', function(req, res) {
    // AUTHENTICATION: check req.body.username and req.body.password against the database
    // DATABASE FUNCTION: retrieve role from database for this user

    req.session.user = req.body.username;
    req.session.pass = req.body.password;

    app.locals.user = req.session.user;

    res.redirect('/admin');
});
app.post('/logout', function(req, res) {
    delete app.locals.sessionUser;
    delete app.locals.sessionRole;

    req.session.destroy(function() {
        res.redirect('/');
    });
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var ticket_server = require('./lib/ticket_server.js');
ticket_server.listen(server);
