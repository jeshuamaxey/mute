var path = require('path');
var fs = require('fs');
var express = require('express');
var auth = require('./auth');
var router = express.Router();

//load in copy from json file
var copyFile = path.join (__dirname, '../copy/copy.json');
var copy = JSON.parse(fs.readFileSync(copyFile, 'utf8'));

/*redirect for the sake of sessions*/
router.get('/*', function(req, res, next) {
  if (req.headers.host.match(/^www\./) != null) {
    res.redirect("http://" + req.headers.host.slice(4) + req.url, 301);
  } else {
    next();
  }
});

/* GET home page. */
router.get('/', function(req, res) {
  //check to see if user is logged in
	if(req.session.passport.user) {
		res.render('index', copy);
  } else {
    res.redirect('/login');
  }
});

/* GET home page. */
router.get('/login', function(req, res) {
	res.render('login', copy);
});

module.exports = router;
