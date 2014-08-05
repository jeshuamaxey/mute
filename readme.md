# Mute

Mute is a simple app that shows you all the people on twitter you've muted in one place.

Mute was built by [@jeshuamaxey](http://twitter.com/jeshuamaxey) after [@kadhimshubber](http://twitter.com/kadhimshubber) thought it was a good idea. All the code is available under the MIT License on GitHub

You can try Mute for youself [here](http://mute-list.herokuapp.com).

## Get Mute running

After cloning the repo run:
````
npm install && bower install
````
to install all the gubbins and wotnots. You'll need to create a file call `twitterapi.json` with the following structure:
````
{
	"key": "your_key",
	"keySecret": "your_key_secret",
	"token": "your_token",
	"tokenSecret": "your_token_secret",
	"callbackURL": "/auth/twitter/callback"
}
````
then
````
npm start
````
to fire it up. It is accessible at `http://localhost:3000`