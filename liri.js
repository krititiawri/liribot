
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var keys = require("./keys.js");


var action = process.argv[2]; // input like "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"
var query = []; // like song name or movie name


//spotify api call
 var spotify = new Spotify(keys.spotifyKeys);

// Run the LIRI-Bot
liri_func(action, query);

// grab the input arguments
function liri_func(action,query)
{

  switch(action)
  {
      case 'my-tweets':
            twitter();
            break;

      case 'spotify-this-song':
            songs(query);
            break;

      case 'movie-this':
            movies();
            break;

      case 'do-what-it-says':
            doWhatItSays();
            break;
  }
}



// to get the tweets

function twitter()
{
  var client = new Twitter(keys.twitterKeys);
  client.get('statuses/user_timeline', function(error, tweetData, response) {
      if (!error) {
        tweetData.forEach(function(eachTweet) {
          // Write a response data to terminal
          console.log(' ');
          console.log('my last 20 tweets');
          console.log('---------------------------------------------------------------------------------------');
          console.log('Time: ' + eachTweet.created_at);
          console.log('Tweet: ' + eachTweet.text);
          console.log('---------------------------------------------------------------------------------------');
          console.log(' ');

          // log response data into log.txt
          fs.appendFile("log.txt", ", " + "\r\n"+ "\r\n"+"My Tweets" + "\r\n"+ "\r\n"+ eachTweet.created_at +"\r\n"+ eachTweet.text , function(err) {
            if (err) {
              return console.log(error);
            }
          }); // End fs.appendFile()
        }); //End of tweetData.forEach()
      } else {
        console.log(error);
      } // End if-else
  }); //End client.get()
}


//Spotify function to gt songs from spotify

function songs(query)
{
  var value = (process.argv.length) - 3;

  //if song search is empty, default to song
  if(value === 0)
  {
      spotify.search({ type: 'track', query: query[0] || 'Mahi' , limit: 1  }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        
        if(data.tracks.items.length > 0) {
          writeToTerminalAndLog(data)
        } else {
          console.log('No song data found.');
        }
      });
  }
  else
  {
  // If multiple songs to be searched from the terminal using LIRI-Bot
    for (var i = 3; i < process.argv.length; i++)
    {
        query = process.argv[i];
        
        // pass the songs thru query
        spotify.search({ type: 'track', query: query, limit: 1  }, function(err, data) {
          if ( err ) {
              console.log('Error occurred: ' + err);
              return;
          }
          // console.log(data.tracks.items.length);

          if(data.tracks.items.length > 0) {
            writeToTerminalAndLog(data)
          } else {
            console.log('No song data found.');
          }
        });
    } // End For-loop
  } // End If-else
}

// Write a response data to terminal and to log.txt
function writeToTerminalAndLog(data)
{
  var track_rec = data.tracks.items[0];
  // log response data into log.txt
  fs.appendFile("log.txt", ", " + "\r\n"+"\r\n"+ "Songs" + "\r\n"+"\r\n"+  track_rec.artists[0].name +"\r\n"+ track_rec.name+"\r\n"+ track_rec.preview_url +"\r\n"+ track_rec.album.name , function(err) {
    if (err) {
      return console.log(err);
    }
  });

  // Write a response data to terminal 
  
  console.log(' ');
  console.log(' LIRI-Bot ');
  console.log('----------------------- Song Information -------------------');
  console.log(' ');
  console.log('Artist: ' + track_rec.artists[0].name);
  console.log('Name: ' + track_rec.name);
  console.log('Link: ' + track_rec.preview_url);
  console.log('Album: ' + track_rec.album.name);
  console.log(' ');
  console.log("");
  console.log(' ');
}

//to get the movie details

function movies()
{
  var API_KEY = "40e9cece";
  var query = process.argv[3];
  var value = (process.argv.length) - 3;

  //if song search is empty, default to song
  if (value === 0)
  {
    
// : http://www.omdbapi.com/?i=tt3896198&apikey=e628bfcd
    request("http://www.omdbapi.com/?t=" + 'frozen' + "&y=&plot=short&apikey=" + API_KEY, function (error, response, body) {
      // If the request is successful
      if (!error && response.statusCode === 200) {
          var movieInfo = JSON.parse(body);
          console.log(" ");
          console.log("No specific movie information requested! Showing default information.");
          writeMovieData(movieInfo);
      }
    });
  }
  else
  {
  // If multiple movies to be searched from the terminal using LIRI-Bot
    for (var i = 3; i < process.argv.length; i++)
    {
        console.log(process.argv[i]);
        query = process.argv[i];
        console.log(query);
        // pass the songs throgh query
       request("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=" + API_KEY, function (error, response, body) {
          // If the request is successful
          if (!error && response.statusCode === 200) {
            var movieInfo = JSON.parse(body);
            // var searchRotten = query[i];
            writeMovieData(movieInfo,query);
          }
        }); // End request()
    } // End For-loop
  } // End If-else
} // End getThisMovies()        

// Write reponse movie data to terminal
function writeMovieData(movieInfo,query){

  // log response data into log.txt
  fs.appendFile("log.txt", ", " + "\r\n"+"\r\n"+  "Movies" + "\r\n"+ "\r\n"+ movieInfo.Title +"\r\n"+ movieInfo.Year+"\r\n"+ movieInfo.imdbRating +"\r\n"+ movieInfo.Country +"\r\n"+ movieInfo.Language +"\r\n"+ movieInfo.Plot +"\r\n"+ movieInfo.Actors +"\r\n"+ "https://www.rottentomatoes.com/m/" + query , function(err) {
    if (err) {
      return console.log(err);
    }
  });

  console.log(' ');
  console.log('+++++++++++++++++++++++ LIRI-Bot ++++++++++++++++++++');
  console.log('----------------------- Movie Info ------------------');
  console.log(' ');
  console.log("Movie title: " + movieInfo.Title);
  console.log("Year movie came out: " + movieInfo.Year);
  console.log("IMDB Rating: " + movieInfo.imdbRating);
  console.log("Country: " + movieInfo.Country);
  console.log("Language: " + movieInfo.Language);
  console.log("Plot: " + movieInfo.Plot);
  console.log("Actors in the movie: " + movieInfo.Actors);
  console.log("Rotten Tomatoes Link: " + "https://www.rottentomatoes.com/m/" + query);
  console.log(' ');
  console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  console.log(' ');
}
 

//to do what it says

function doWhatItSays()
{
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    } else {
      // Split all the itmes in the data array
      var dataArr = data.split(",");
      action = dataArr[0];
      query[0] = dataArr[1];
      liri_func(action, query);
    }
  });
}
