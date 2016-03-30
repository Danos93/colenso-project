var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var search = require('./routes/search');
var add = require('./routes/add')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/search', search);
app.use('/add',add)

var router = express.Router();
app.use(router);

//Colenso database setup
var basex = require('basex')
var client = new basex.Session("127.0.0.1",1984,"admin","admin")

client.execute("OPEN Colenso")


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



function searchText(text)
{
  var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in (//text())[contains(., \""+text+"\")] return db:path($t)"
  client.execute(query,function(error,result){
    var pathList = result.result.split("\n")
    newArray = pathList.filter(function(elem, pos) {
      return pathList.indexOf(elem) == pos;
    })
  })
  console.log(newArray)
  return newArray
}

function searchTag(text)
{
  var first = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in(//"
  var query = first.concat(text)
  client.execute(query,function(error,result){
    if(error) {console.log(error)}
    else {console.log(result.result)}
  })
}  

function searchName(text)
{
  //LOGIC
  client.execute(query,function(error,result){
    if(error) {console.log(error)}
    else {console.log(result.result)}
  })
}  

function searchDate(text)
{
  //LOGIC
  client.execute(query,function(error,result){
    if(error) {console.log(error)}
    else {console.log(result.result)}
  })
}

function searchTitle(text)
{
  //LOGIC
  client.execute(query,function(error,result){
    if(error) {console.log(error)}
    else {console.log(result.result)}
  })
}

router.post('/search', function(req, res){
  var text = req.body.searchBox
  var radioVal = req.body.option
  if(radioVal == 0){
    var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in (//text())[contains(., \""+text+"\")] return db:path($t)"
    client.execute(query,function(error,result){
      var pathList = result.result.split("\n")
      var newArray = pathList.filter(function(elem, pos) {
        return pathList.indexOf(elem) == pos;
      })
      res.render('search',{results: newArray})
    })
  }
  else if (radioVal == 1){
    result = searchTag(text)
  }
  else if (radioVal == 2){
    result = searchName(text)
  }
  else if (radioVal == 3){
    result = searchDate(text)
  }
  else if (radioVal == 4){
    result = searchTitle(text)
  }
  //res.render('search',{paths: result})
});

router.post('/file', function(req, res){
  console.log("here")
  var fileName = Object.getOwnPropertyNames(req.body)[0];
  var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $doc in collection('Colenso') where matches(document-uri($doc), '"+fileName+"') return $doc";
  client.execute(query,function(error,result){
    console.log(result.result)
    res.render("search",{file: result.result})
    })
 } );

module.exports = app;
