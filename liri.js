require("dotenv").config();
var request = require("request");
var fs = require('fs');

//Allows for linking to files in same directory
var path = require('path');

//Creates objects for both Twitter and Spotify
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");

//Links key files
var keys = require(path.resolve(__dirname, "./keys.js"));
var queryUrl = "";

//Creates spotify and twitter objects linked to keys file
var spotify = new Spotify({ id: "c3228f7fe0eb43588d5c511a02d8116c", secret: "f34995a151b24beb8d5cda121da3414d" });
var client = new Twitter(keys.twitter);

//Overall string for request
var call = process.argv;

var number = 0;

//Twitter Variables:
var twitParams = {
    screen_name: 'JShelbyThompson',
    count: 20
}

//Method/function chosen by the user
var userChoice = process.argv[2];

//Song info, tweets, movie info or random as specified by user.
var specificInput = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < call.length; i++) {
    if (i > 3 && i < call.length) {
        specificInput = specificInput + "+" + call[i];
    } else {
        specificInput += call[i];
    }
}

if (userChoice === 'movie-this') {
    omdb(specificInput);
} else if (userChoice === 'my-tweets') {
    myTweets();
} else if (userChoice === 'spotify-this-song') {
    spotifySong(specificInput);
} else if (userChoice === 'file-read') {
    readFile();
}

// omdb request function
function omdb(value) {
    if (value == "") {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    } else {
        queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&tomatoes=true&r=json&apikey=trilogy";
        request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
                //Parse the body of the site and recover needed info:
                //Title of the movie.
                //Year the movie came out.
                //IMDB Rating of the movie.
                //Rotten Tomatoes Rating of the movie.
                //Country where the movie was produced.
                //Language of the movie.
                //Plot of the movie.
                //Actors in the movie.
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log('Title: ' + JSON.parse(body).Title);
                console.log('Year of Release: ' + JSON.parse(body).Year);
                console.log('IMDb Rating: ' + JSON.parse(body).imdbRating);
                console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
                console.log('Country of Production: ' + JSON.parse(body).Country);
                console.log('Language: ' + JSON.parse(body).Language);
                console.log('Plot: ' + JSON.parse(body).Plot);
                console.log('Actors: ' + JSON.parse(body).Actors);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            }
        });
    }
}

function myTweets() {
    client.get('statuses/user_timeline', twitParams, function (error, tweets, response) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

        console.log('My Last 20 Tweets:')
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        for (i = 0; i < tweets.length; i++) {
            number = i + 1;
            if (!(tweets[i].text === null)) {
                console.log(number + '. ' + tweets[i].text);
                console.log('Created on: ' + tweets[i].created_at);
            }
        }
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });
}

function spotifySong(value) {
    if (value == "") {
        value = "The Sign"
    }
    //Here's the new stuff
    spotify.search({ type: 'track', query: value }).then(response => {
        //Parse the body of the site and recover needed info:
        //Artist(s) of the song
        //Song name
        //Song link
        //Song album
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log('Artist(s): ' + response.tracks.items[0].artists[0].name);
        console.log('Song Name: ' + response.tracks.items[0].name);
        console.log('Song Link: ' + response.tracks.items[0].preview_url);
        console.log('Song Album: ' + response.tracks.items[0].album.name);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });
}

function readFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        for (var i = 0; i < dataArr.length - 1; i++) {
            if (i % 2 === 0) {
                //console.log ("Song: " + dataArr[i+1]);
                if (dataArr[i] === 'movie-this' || dataArr[i] === '\nmovie-this') {
                    omdb(dataArr[i + 1]);
                } else if (dataArr[i] === 'my-tweets' || dataArr[i] === '\nmy-tweets') {
                    myTweets();
                } else if (dataArr[i] === 'spotify-this-song' || dataArr[i] === '\nspotify-this-song') {
                    spotifySong(dataArr[i + 1]);
                } else if (dataArr[i] === 'file-read' || dataArr[i] === '\nfile-read') {
                    readFile();
                }
            }
        }
    });
}
