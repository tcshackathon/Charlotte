
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
//helps connect with MongoDB
var mongoose = require('mongoose');
var schema= require('./schema');
var webLogic = require('./webLogic');

var users = {};
var app = express();
//server on http
var server = require('http').createServer(app);
var io = require('socket.io').listen(server,{log: false });

//somenath
var sendgrid  = require('sendgrid')( 
  'app23366879@heroku.com',
  '3zkgvrqk'
); 
//listening on port 5000
server.listen(process.env.PORT || 5000);


var Client = require('node-rest-client').Client;
//creates client object
var client = new Client();


app.set('views', __dirname, '/views');
app.set('view engine', 'ejs');

app.use(express.cookieParser());
app.use(express.session({secret: '8hdfv89823rnbvd09032eu233nvdfv'}));

app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

//connection to database
mongoose.connect('mongodb://heroku:97aa100aa71b190805c41b70bed0e20b@troup.mongohq.com:10097/app22192444');


app.get('/',webLogic.index);

app.post('/feedback', webLogic.feedback);

app.post('/doReservation', webLogic.doReservation);

app.post('/DelReservation', webLogic.delReservation);

app.post('/LoginReservation', webLogic.loginReservation);

app.post('/SignUpReservation', webLogic.signUp);

app.post('/availReservation', webLogic.availableReseravtions);

app.post('/LogoutReservation', webLogic.logoutReservation);

app.post('/getSoftwareList', webLogic.getSoftwareList);

app.post('/getMachineNumbers', webLogic.getMachineNum);

app.post('/addSoftware', webLogic.addSoftware);

