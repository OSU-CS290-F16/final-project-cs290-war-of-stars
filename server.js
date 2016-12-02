var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var planets = require('./planets');
var app = express();

var port = process.env.PORT || 3000;

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
   res.render('index-page',{
      pageTitle: ''
   });
});

app.get('/notes/:planet', function(req, res) {
   var user = req.params.planet.toString();
   var reqUser = usersData[user];
   if(user){
      console.log(reqUser.name);
      res.status(200).render('planet',{
	 pageTitle: ''
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

