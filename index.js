// START HEROKU SETUP
var express = require("express");
var sp = require('heroku-self-ping')(process.env.APP_URL, {
        interval: process.env.SELF_PING_MINUTES * 60 * 1000, // minutes in msec, default 20 * 60 * 1000
        login: console.log, // default console.log
        verbose: true // default false
    });
var app = express();
app.get('/', function(req, res){ res.send('The robot is happily running.'); });
app.listen(process.env.PORT || 5000);
// END HEROKU SETUP


// Listbot config
//
// Config.keys uses environment variables so sensitive info is not in the repo.
var config = {
    me: 'sleep_tweeter', // The authorized account with a list to retweet.
    regexFilter: '', // Accept only tweets matching this regex pattern.
    regexReject: '(RT|@)', // AND reject any tweets matching this regex pattern.

    keys: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    },
};

// What to do after we tweet something.
function onTweet(err) {
    console.log('Tweeting at ' + Date());
    if(err) {
        console.error("tweeting failed :(");
        console.error(err);
    }
}

// The application itself.
// Use the tuiter node module to get access to twitter.
var tu = require('tuiter')(config.keys);

//What the bot tweets
var statusMessage = "The time and date is " + Date();

// Tweet once before timer
tu.update({
        status: statusMessage
}, onTweet);

// Run the application.
setInterval(function() {
    tu.update({
            status: statusMessage
    }, onTweet);
}, 600000);