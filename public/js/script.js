var app = app || {};

//this array stores all the twitter friend objects retrieved
app.allFriends = [];
//this array stores the twitter friend objects shown
app.displayedFriends = [];
//by default search for the first 200 twitter friends
app.cursor = -1;

app.main = function() {
	//add user info to UI
	app.getMyInfo();
	//get first 200 friends
	app.getFriends();
	//event listeners
	$('#getFriends').on('click', app.getFriends);
	$('.filter').on('click', function() {
		//get desired filter state
		var filter = !$('#filter').data('is-filtering');
		//apply filter
		app.filterFriends(filter, app.updateList);
		//update filter toggle and UI
		$('#filter').data('is-filtering', filter);
		var message = (filter ? "Show all " : "Show muted only ");
		$('.filter .text, button.filter').html(message);
	});
};

app.getMyInfo = function() {
	//make ajax call
	$.ajax({
		url: 'api/me'
	}).success(function(data) {
		//fill some UI
		$('.profile-name span').html(data.screen_name);
		$('#top-navbar-collapse').removeClass('hidden');
		//get more user data
		var url = 'api/me?screen_name='+data.screen_name;
		$.ajax({
			url: url
		}).success(function(data) {
			var user = data[0];
			$('.following').html(user.friends_count);
			$('.profile-pic').attr('src', user.profile_image_url);
		});
	});
}

app.getFriends = function() {
	//show loading UI
	$('#getFriends').addClass('disabled');
	$('#getFriends').html('Loading...');
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
			$('#getFriends').html('All ' + app.allFriends.length + ' of the people you follow have been loaded.')
		} else {
			$('#getFriends').removeClass('disabled');
			$('#getFriends').html('Load more people you follow');
		}
		console.log(app.allFriends);
		var filter = $('#filter').data('is-filtering');
		app.filterFriends(filter, app.updateList);
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
		var labelClasses = "label " + (friend.muting ? "label-warning" : "label-success");
		var labelText = friend.muting ? "Muted" : "Not Muted";
		//button isn't currently used (see below comment)
		var btnClasses = "btn btn-sm " + (friend.muting ? "btn-warning" : "btn-success");
		var btnText = friend.muting ? "Muted" : "Not Muted";
		//append the twitter friend to the last row
		$($row).append('<div class="col-md-4 tw-profile" data-muted="'+ friend.muting +'">' +
			'<img class="tw-profile-image" src="'+ friend.profile_image_url +'"/>' +
			'<h4 class="tw-username"><a href="'+url+'">'+ friend.name +'</a></h4>' +
			'<p>&#64;'+ friend.screen_name +'</p>' +
			'<span class="'+ labelClasses +'">'+ labelText +'</span>' +
			/**
			 * while twitter's api doesn't have a mute/unmute endpoint
			 * this button will remain commented out in favour of a label
			 **/
			// '<button data-index="'+i+'" class="toggleMute btn '+ btnClasses +'">'+ btnText +'</button>' +
		'</div>');
	});
	//refresh event listeners
	$('.toggleMute').on('click', app.toggleMute);
	//update numbers
	$('.displaying').html(app.displayedFriends.length);
	$('.total').html(app.allFriends.length);
}

app.filterFriends = function(filter, callback) {
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
};

app.toggleMute = function() {
	var i = $(this).data('index');
	var friend = app.displayedFriends[i];
	console.log(friend.name)
}

//must go last
$(document).ready(app.main);