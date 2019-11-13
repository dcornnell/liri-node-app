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

addToLog(`\nCommand: ${input} Details: ${details}
___________________________________________`)
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

                const info = response.data.events[i]
                const date = response.data.events[i].datetime_local;
                moment(date).format('MM/DD/YYYY')
                const dataString = `\nVenue: ${info.venue.name}
City: ${info.venue.city}, ${info.venue.state}
Date: ${moment(date).format('MM/DD/YYYY [at] hh:mma')}
`
                console.log(dataString);
                addToLog(dataString);

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
        const info = data.tracks.items[0]
        const dataString = `\n\nSong: ${info.name}
Artist: ${info.artists[0].name}
Link: ${info.external_urls.spotify}
Album: ${info.album.name }`

        console.log(dataString);
        addToLog(dataString);


    })
}

function getMovie(input) {

    if (!input) {
        input = "Mr Nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
            const info = response.data;
            const dataString = `\n\nTitle: ${info.Title}
Release Year: ${info.Year}
IMDB rating: ${info.imdbRating}
Rotten Tomatoes score: ${info.Ratings[1].Value}
Language: ${info.Language }
Country of Production: ${info.Country }
Actors: ${info.Actors }
Plot: ${info.Plot }`
            console.log(dataString)

            addToLog(dataString)

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