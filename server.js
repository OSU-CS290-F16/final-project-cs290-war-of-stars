/*server.js*/
var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var planets = require('./planets');
var app = express();

var port = process.env.PORT || 3000;
                         
app.engine('handlebars', exphbs({default layout : 'main'}))

                         
