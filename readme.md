# Mute

Mute does x, y and z.

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
to fire it up. It is accessible at 'http://localhost:3000'