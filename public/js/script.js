var app = app || {};

//this array stores all the twitter friend objects retrieved
app.allFriends = [];
//this array stores the twitter friend objects shown
app.displayedFriends = [];
//by default search for the first 200 twitter friends
app.cursor = -1;

app.main = function() {
	//get first 200 friends
	app.getFriends();
	//event listeners
	$('#getFriends').on('click', app.getFriends);
	$('#filter').on('click', function() {
		app.filterFriends(app.updateList);
	});
}

app.getFriends = function() {
	//show loading UI
	$('#loading').removeClass('hidden');
	//create url w/ cursor param
	app.url = 'api/friends?cursor='+app.cursor;
	//make ajax call
	$.ajax({
		url: app.url
	}).success(function(data) {
		//update friend array
		app.allFriends = app.allFriends.concat(data.users);
		//set cursor properly
		app.cursor = data.next_cursor;
		console.log(app.cursor)
		//check to see if all friends have been loaded
		if(app.cursor == 0) {
			$('#getFriends').attr('disabled', true);
			$('#getFriends').html('All ' + app.allFriends.length + 'of the people you follow have been loaded.')
		}
		console.log(app.allFriends);
		app.filterFriends(app.updateList);
		$('#loading').addClass('hidden');
		$('#getFriends').removeClass('hidden');
	});
};

/*
 * updates the UI showing the list of
 * twitter friends
 **/
app.updateList = function(refresh) {
	$('#friendList').html('');
	//every time I write code like this, I wish I'd
	//used a js framwork that supports data binding
	app.displayedFriends.forEach(function(friend, i) {
		//every 3 tweets add a new row
		if(i%3 == 0) {
			$('#friendList').append('<div class="row"></div>');
		}
		//set some variables
		var url = "https://twitter.com/" + friend.screen_name;
		var index = $('#friendList').children().length-1;
		var $row = $('#friendList .row')[index];
		//append the twitter friend to the last row
		$($row).append('<div class="col-md-4" data-muted="'+ friend.muting +'">' +
			'<h4 class=""><a href="'+url+'">'+ friend.name +'</a></h4>' +
			'<p>&#64;'+ friend.screen_name +'</p>' +
			'<p>'+ friend.muting +'</p>' +
		'</div>')
	});
	//update numbers
	$('#displaying').html(app.displayedFriends.length);
	$('#total').html(app.allFriends.length);
}

app.filterFriends = function(callback) {
	var filter = $('#filter').is(':checked');
	app.displayedFriends = [];
	if(filter) {
		app.allFriends.forEach(function(f) {
			if(f.muting) app.displayedFriends.push(f);
		});
	} else {
		app.displayedFriends = app.allFriends;
	}
	//fire the callback
	if(callback) callback();
}

//must go last
$(document).ready(app.main);