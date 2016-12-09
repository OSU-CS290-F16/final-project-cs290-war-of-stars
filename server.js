var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var planets = require('./final/planets.json');
var app = express();

var port = process.env.PORT || 3000;

// use modified class Mongo code to set up connection
var mongoHost = process.env.MONGO_HOST || "classmongo.engr.oregonstate.edu";
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER || "cs290_gillenp";
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB || "cs290_gillenp";
var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoDB;

// set up session tracking
app.use(session({secret: 'NOTREALLYASECRET', resave: false, saveUninitialized: true}));

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
   if (req.session.username) {
      res.render('index-page', {
         user: req.session.username,
         credits: req.session.credits,
         bounties: req.session.bounties,
         pageTitle: 'Bounty Hunter Game: ' + req.session.username
      });
   } else {
      res.redirect('/');
   }
});

app.post('/login', function(req, res) {
   // set default values
   var credits = 0;
   var bounties = {};
   // grab username from POST req
   username = req.body.username.toLowerCase();
   if (!username) { // no valid username got POSTed
       console.log("Error, username was not supplied.");
       res.status(500).send("Error, POST submission, but no username field");
   }

   // check database to see if user exists
   var collection = mongoDB.collection('swbhg_users');
   collection.find({ _id: username }, { _id: 0}).toArray(function (err, users) {
      // handle DB errors
      if (err) {
         console.log("== Error fetching user (", username, ") from database:", err);
         res.status(500).send("Error fetching from database: " + err);

      // check if user exists
      } else if (users.length > 0) {
         credits = users[0]["credits"];
         bounties = users[0]["bounties"];

      // make a new user with 0 credits if necessary
      } else {
         console.log("User", username, "not found, created new record with 0 credits");
         collection.insertOne(
            { _id: username, credits: 0, bounties: {} },
            function (err, result) {
               if (err) console.log("== Error creating user (", username, ")", err);
            });
      }
      // set the session properties, and redirect them to main page
      console.log("Successful login for user:", username);
      req.session.username = username;
      req.session.credits = credits;
      req.session.bounties = bounties;
      res.redirect("/index");
    });
});

app.get('/:planet', function(req, res, next) {
   if (req.session.username) {
      var planet = req.params.planet.toString().toLowerCase();
      var reqPlanet = planets[planet];
      var planetBounties = {};
      if (reqPlanet) {
         res.status(200).render('planet',{
            pageTitle: "Welcome to " + reqPlanet.Name,
            name: reqPlanet.Name,
            planetBounties: reqPlanet.bounties,
            planetData: reqPlanet
         });
      }
      else {
         next();
      }
   } else {
      res.redirect('/');
   }
});

// ref: https://github.com/OSU-CS290-F16/simple-server-with-api/blob/master/server.js
app.post('/:planet/collect', function (req, res, next) {
   var planet = planets[req.params.planet];
   if (planet) {
      if (req.body && req.body.person && req.body.credits) {
         // update person variables
         var newCredits = req.session.credits + req.body.credits;
         var personCaptured = req.body.person;
         req.session.bounties.push({
            person: personCaptured
         });
         // remove available bounty
         console.log(planets[planet]);

         // update database
         var collection = mongoDB.collection('swbhg_users');
         collection.updateOne({ _id: req.session.user },
            {
               $set: { "credits": newCredits},
               $push: { "bounties": personCaptured}
            }
         );
         res.status(200).send();
      } else {
         res.status(400).send("Planet person attribute missing.");
      }
   } else {
     next(); // if planet doesn't exist, 404
  }
});

// destroy user session and send them home
app.get('/logout', function(req, res) {
   console.log("Logging out user (", req.session.username, ")");
   req.session.destroy();
   res.redirect('/');
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

   // remove old users
   mongoDB.collection('swbhg_users').remove({});

   // express now listens on the specified port
   app.listen(port, function () {
      console.log("== Listening on port", port);
   });
});
