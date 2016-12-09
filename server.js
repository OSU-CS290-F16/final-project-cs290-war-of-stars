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

// Parse all request bodies as JSON
app.use(bodyParser.json());
// http://stackoverflow.com/a/12008719
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// serve final directory out of root (/s)
app.use(express.static(path.join(__dirname, 'final')));

app.get('/', function(req, res) {
   res.render('login-page',{
      pageTitle: 'Bounty Hunter Game'
   });
});

app.get('/index', function(req, res) {
    // will need to check here if user is logged in
   res.render('index-page',{
      pageTitle: 'Bounty Hunter Game: [no user logged in]'
   });
});

app.post('/index', function(req, res) {
   var credits = 0; // set default value

   // grab username from POST req
   username = req.body.username.toLowerCase();
   if (!username) { // no valid username got POSTed
       console.log("Error, username was not supplied.");
       res.status(500).send("Error, POST submission, but no username field");
   }

   // check database to see if user exists
   var collection = mongoDB.collection('swbhg');
   collection.find({ _id: username }, { _id: 0, credits: 1}).toArray(function (err, users) {
      // handle DB errors
      if (err) {
         console.log("== Error fetching user (", username, ") from database:", err);
         res.status(500).send("Error fetching from database: " + err);

      // check if user exists
      } else if (users.length > 0) {
         credits = users[0]["credits"];

      // make a new user with 0 credits if necessary
      } else {
         console.log("User", username, "not found, created new record with 0 credits");
         collection.insertOne(
            { _id: username, credits: 0 },
            function (err, result) {
               if (err) console.log("== Error creating user (", username, ")", err);
            });
      }
      // deliver page back with fields
      res.render('index-page', {
         user: username,
         credits: credits,
         pageTitle: 'Bounty Hunter Game: ' + username
      });
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
