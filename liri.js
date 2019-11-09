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
        getMovie(details)
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


        })

}