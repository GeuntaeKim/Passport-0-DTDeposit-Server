/*
 * Module dependencies.
 */

var express = require('express');
var cors = require('cors')

var routes = require('./routes');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

// all environments
var app = express();

app.set('ip_address', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '0.0.0.0'); //OPENSHIFT_NODEJS_IP = '127.0.0.1 and Heroku IP = '0.0.0.0'
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080); //var port = process.env.OPENSHIFT_NODEJS_PORT || 8080

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.disable('etag');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(bodyParser.json()); // parse json encoded bodies

app.use(bodyParser.json({ type: 'application/*+json' }));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//cors
var whitelist = ['http://localhost:4200', 'http://153.71.108.86:4200'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

//app.use(cors(corsOptions));

//load route
var users = require('./routes/users');
var cards = require('./routes/cards');
var deposits = require('./routes/deposits');
var items = require('./routes/items');

var connection = require('express-myconnection');
var mysql = require('mysql');

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

/*app.use(
    connection(mysql, {

        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306, //port mysql
        database: 'jobbridge'

    }, 'pool') //or single
);*/

app.get('/', routes.index);

app.get('/users', users.list);
app.get('/users/:id', users.list);
app.post('/users/add', users.add);
app.post('/users/update', users.update);
app.post('/users/delete', users.delete);

app.get('/cards', cards.list);
app.get('/cards/:id', cards.list);
app.post('/cards/add', cards.add);
app.post('/cards/update', cards.update);
app.post('/cards/delete', cards.delete);

app.get('/deposits', deposits.list);
app.get('/deposits/:id', deposits.list);
app.post('/deposits/add', deposits.add);
app.post('/deposits/update', deposits.update);
app.post('/deposits/delete', deposits.delete);

app.get('/items', items.list);
app.get('/items/:id', items.list);
app.post('/items/add', items.add);
app.post('/items/update', items.update);
app.post('/items/delete', items.delete);

app.use(app.router);

var server = http.createServer(app);

server.listen(app.get('port'), app.get('ip_address'), function () {
    console.log('Server ' + app.get('ip_address') + ' as Express server listening on port ' + app.get('port'));
});
