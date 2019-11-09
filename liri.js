require('dotenv').config();
const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const axios = require('axios').default;
const moment = require('moment');

const input = process.argv[2]
const details = process.argv[3]
switch (input) {
    case ("concert-this"):
        console.log("concert this");
        getConcert(details);
        break;
    case ("spotify-this-song"):
        console.log("spotify")
        getSong(details)
        break;
    case ("movie-this"):
        console.log("movie-this");
        break;
    case ("do-what-it-says"):
        console.log("do-what-it-says")
        break;
    default:
        console.log("not an excepted input");
}

function getConcert(input) {

    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function(response) {
            for (let i = 0; i < response.data.length; i++) {
                console.log("______________")
                console.log("Venue: " + response.data[i].venue.name);
                console.log("City: " + response.data[i].venue.city + ", " +
                    response.data[i].venue.region);
                const date = response.data[i].datetime;
                moment(date).format('MM/DD/YYYY')
                console.log("Date: " + moment(date).format('MM/DD/YYYY [at] hh:mma'));
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
        console.log(data.tracks.items[0].album.name);

    })
}