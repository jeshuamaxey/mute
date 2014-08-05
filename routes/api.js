var express = require('express');
var router = express.Router();

var Twit = require('twit');
var auth = require('./auth');

/* . */
router.get('/me', function(req, res) {
	// create key
	var key = new auth.key().withUserAccess(
		req.session.passport.user.token,
		req.session.passport.user.tokenSecret
	);

	var T = new Twit(key.data);

	if(req.query.screen_name) {
		T.get('users/lookup', {'screen_name': req.query.screen_name}, function(err, data, response) {
			// respond with an error
			if(err) {
				console.log("Error:", err);
			} else {
				res.json(data);
				res.end();
			}
		});
	} else {
		T.get('account/settings', {}, function(err, data, response) {
			// respond with an error
			if(err) {
				console.log("Error:", err);
			} else {
				res.json(data);
				res.end();
			}
		});
	}

});

/* . */
router.get('/friends', function(req, res) {
	// create key
	var key = new auth.key().withUserAccess(
		req.session.passport.user.token,
		req.session.passport.user.tokenSecret
	);

	var T = new Twit(key.data);

	//create array of muted friends
	var friends = [];
	var cursor = req.query.cursor || -1;

	T.get('friends/list', {'count': 200, 'cursor': cursor}, function(err, data, response) {
		// respond with an error
		if(err) {
			console.log("Error:", err);
		} else {
			res.json(data);
			res.end();
		}
	});

	return;
});

function getFriends(cursor) {
	
}

module.exports = router;
