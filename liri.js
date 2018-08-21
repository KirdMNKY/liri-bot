require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var moment = require("moment");



// var bandsInTown = new BandsInTown(keys.bandsInTown);

var userInput = process.argv;

var liriCommand = userInput[2];

var searchTerm = userInput.slice(3).join(" ");

controlLiri(liriCommand, searchTerm);

function controlLiri(liriCommand, searchTerm){
    switch(liriCommand){
        case "concert-this":
            //bandsInTown function
            getConcert(searchTerm);
            break;
        case "spotify-this-song":
            //spotify function
            getSpotify(searchTerm);
            break;
        case "movie-this":
            //OMDB function
            getMovie(searchTerm);
            break;
        case "do-what-it-says":
            //Read random.txt function
            doIt();
            break;

    }
}


function getSpotify(song){
    
    var spotify = new Spotify(keys.spotify);
    if(!song){
        song = "If Only";
    }
    spotify.search(
        {
            type: "track", 
            query: song
        },function(error, data){
            if(error){
                return console.log("An Error Has Occured: " + error);
            }else
                var info = data;
                var songInfo = info.tracks.items[0];
                var completeInfo = 
                    "\n-------------------------------------\n" + "\n" +
                    "\nArtist(s): " + songInfo.artists[0].name + "\n" +
                    "\nSong: " + songInfo.name + "\n" +
                    "\nPreview Link: " + songInfo.preview_url + "\n" +
                    "\nAlbum: " + songInfo.album.name + "\n" +
                    "\n-------------------------------------\n";
                fs.appendFile("log.txt", "spotify-this-song\n" + completeInfo + "\n======================================\n", function(err){
                    if(err){
                        console.log(err);
                    }
                });
                console.log(completeInfo);

    });
} //End of getSpotify()

function getMovie(movie){

    var key = keys.omdb.apikey;

    if(!movie){
        movie = "Flubber";
    }
    var URL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + key;
    // We then run the request module on a URL with a JSON
    request(URL, function(error, response, body) {
    if(error){
        return console.log(error);
    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    }else if (!error && response.statusCode === 200) {
        var movieInfo = JSON.parse(body);
        var completeInfo = 
            "\n****************************************\n" +
            "\nTitle: " + movieInfo.Title + "\n" +
            "\nYear: " + movieInfo.Released + "\n" +
            "\nRating: " + movieInfo.Rated + "\n" +
            "\nRotten Tomatoes Score: " + movieInfo.Ratings[1].Value + "\n" +
            "\nCountry: " + movieInfo.Country + "\n" +
            "\nLanguage: " + movieInfo.Language + "\n" +
            "\nPlot: " + movieInfo.Plot + "\n" +
            "\nActors: " + movieInfo.Actors + "\n" +
            "\n****************************************\n";
        fs.appendFile("log.txt","movie-this\n" + completeInfo + "\n======================================\n", function(err){
            if(err){
                console.log(err);
            }
        });
      // Then we print out info
      console.log(completeInfo);
    }
  });
} // End of getMovie()

function getConcert(artist){
    var key = keys.bit.key;
    // We then run the request module on a URL with a JSON
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=key";
    request(URL, function(error, response, body) {

    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    if (!error && response.statusCode === 200) {
  
        // Then we print out the info
        var concertInfo = JSON.parse(body)[0];
        var completeInfo = 
            "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" +
            "\nArtist: " + concertInfo.lineup + "\n" +
            "\nVenue: " + concertInfo.venue.name + "\n" +
            "\nLocation: " + concertInfo.venue.city + ", " + concertInfo.venue.region + ", " + concertInfo.venue.country + "\n" +
            "\nDate: " + moment(concertInfo.datetime).format("MM/DD/YYYY") + "\n" +
            "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n";
            fs.appendFile("log.txt","concert-this\n" + completeInfo + "\n======================================\n", function(err){
                if(err){
                    console.log(err);
                }
            });
        console.log(completeInfo);
    }
  });
} // End of getConcert()

function doIt(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            return console.log(error);
        }
        var text = data.split(",")
        text.forEach(function(element){
             element.trim();
        });
        fs.appendFile("log.txt","do-what-it-says\n", function(err){
            if(err){
                console.log(err);
            }
        });
        controlLiri(text[0], text[1]);
    });

} // End of doIt()