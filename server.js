var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var planets = require('./final/planets.json');
var app = express();
var MongoClient = require('mongodb').MongoClient;

var port = process.env.PORT || 3000;

// use modified class Mongo code to set up connection
var mongoHost = process.env.MONGO_HOST || "classmongo.engr.oregonstate.edu";
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER || "cs290_gillenp";
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB || "cs290_gillenp";
var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoDB;

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'final')));

app.get('/', function(req, res) {
   res.render('login-page',{
      pageTitle: 'Bounty Hunter Game'
   });
});

app.get('/index', function(req, res) {
   res.render('index-page',{
      pageTitle: 'Bounty Hunter Game'
   });
});

app.get('/:planet', function(req, res, next) {
   var planet = req.params.planet.toString();
   var reqPlanet = planets[planet];
   if (reqPlanet) {
       res.status(200).render('planet',{
          pageTitle: "Welcome to " + reqPlanet.Name,
          name: reqPlanet.Name,
          planetData: reqPlanet
       });
   }
   else {
      next();
   }
});

app.get('*', function(req, res) {
   res.render('404-page', {
      pageTitle: '404'
   });
});

// set up MongoDB connection and start server
MongoClient.connect(mongoURL, function (err, db) {
   if (err) {
      console.log("== Unable to make connection to MongoDB Database.");
      throw err;
   }
   mongoDB = db; // successful connection

   // express now listens on the specified port
   app.listen(port, function () {
      console.log("== Listening on port", port);
   });
});
