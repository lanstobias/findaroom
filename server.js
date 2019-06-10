var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
const portNr = 3000;

const houses = require('./scrape');

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('home', {
      title: 'findaroom',
      test : 'test',
      houses: houses
    });
});

app.listen(portNr, function(){
    console.log('Listening at port ' + portNr);
});
