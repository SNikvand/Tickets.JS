
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var route_admin = require('./routes/admin');
var http = require('http');
var path = require('path');

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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/admin', route_admin.index);

app.post('/login', function(req, res) {
    // AUTHENTICATION: check req.body.username and req.body.password against the database
    // DATABASE FUNCTION: retrieve role from database for this user

    req.session.user = req.body.username;
    req.session.pass = req.body.password;

    app.locals.user = req.session.user;

    res.redirect('/admin');
});
app.post('/logout', function(req, res) {
    delete app.locals.user;

    req.session.destroy(function() {
        res.redirect('/');
    });
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var ticket_server = require('./lib/ticket_server.js');
ticket_server.listen(server);
