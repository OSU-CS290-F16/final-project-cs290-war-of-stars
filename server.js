var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var planets = require('./final/planets.json');
var app = express();

var port = process.env.PORT || 3000;

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'final')));

app.get('/', function(req, res) {
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


// Listen on the specified port.
app.listen(port, function () {
   console.log("== Listening on port", port);
});
