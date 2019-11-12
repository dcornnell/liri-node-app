require('dotenv').config();
const fs = require('fs');
const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const axios = require('axios').default;
const moment = require('moment');

let input = process.argv[2]
let details = process.argv.slice(3).join(" ")
console.log("________________________________")
addToLog("\n ____________________________\n Command:" + input + " Details: " + details)
inputChoice(input, details)



function inputChoice(input, details) {
    switch (input) {
        case ("concert-this"):

            getConcert(details);
            break;
        case ("spotify-this-song"):

            getSong(details);
            break;
        case ("movie-this"):

            getMovie(details);
            break;
        case ("do-what-it-says"):

            doIt(details);
            break;
        default:
            console.log("not an excepted input");

    }
}

function getConcert(input) {

    axios.get("https://api.seatgeek.com/2/events?client_id=MTk0MjgyMDJ8MTU3MzU2OTAzNy40Ng&q=" + input)
        .then(function(response) {

            for (let i = 0; i < response.data.events.length; i++) {

                console.log("______________\n")
                console.log("Venue: " + response.data.events[i].venue.name);
                console.log("City: " + response.data.events[i].venue.city + ", " +
                    response.data.events[i].venue.state);
                const date = response.data.events[i].datetime_local;
                moment(date).format('MM/DD/YYYY')
                console.log("Date: " + moment(date).format('MM/DD/YYYY [at] hh:mma'));

                addToLog("\n Venue: " + response.data.events[i].venue.name);
                addToLog("City: " + response.data.events[i].venue.city + ", " +
                    response.data.events[i].venue.state);

                addToLog(" Date: " + moment(date).format('MM/DD/YYYY [at] hh:mma'));

            }
        })
}

function getSong(input) {
    if (!input) {
        input = "The Sign ace of base";
    }
    spotify.search({
        type: 'track',
        query: input,
        limit: 5

    }, function(err, data) {
        if (err) {
            return console.log("Error occurred: " + err)
        }


        console.log('ARTIST: ' + data.tracks.items[0].artists[0].name);
        console.log('LINK: ' + data.tracks.items[0].external_urls.spotify);
        console.log('Album: ' + data.tracks.items[0].album.name);

        addToLog('\n ARTIST: ' + data.tracks.items[0].artists[0].name);
        addToLog('\n LINK: ' + data.tracks.items[0].external_urls.spotify);
        addToLog('\n Album: ' + data.tracks.items[0].album.name);

    })
}

function getMovie(input) {

    if (!input) {
        input = "Mr Nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
            console.log("Title " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes score: " + response.data.Ratings[1].Value)
            console.log("Country of Production: " + response.data.Country)
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

            addToLog("\nTitle " + response.data.Title);
            addToLog("\nRelease Year: " + response.data.Year);
            addToLog("\nIMDB rating: " + response.data.imdbRating);
            addToLog("\nRotten Tomatoes score: " + response.data.Ratings[1].Value)
            addToLog("\nCountry of Production: " + response.data.Country)
            addToLog("\nLanguage: " + response.data.Language);
            addToLog("\nPlot: " + response.data.Plot);
            addToLog("\nActors: " + response.data.Actors);

        })

}

function doIt(input) {
    fs.readFile('random.txt', 'utf8', function(err, contents) {
        const contentArray = contents.split(",");

        input = contentArray[0];
        details = contentArray[1];
        inputChoice(input, details);
    });
}

function addToLog(input) {
    fs.appendFile('log.txt', input, (err) => {
        if (err) throw err;

    });
}