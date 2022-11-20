const express = require("express");
const app = express();
const port = 4000;
const router = express.Router();
const csv = require("csv-parser");
const Fuse = require('fuse.js');

const fs = require("fs");
var genres = [];
var albums = [];
var artists = [];
var tracks = [];

//Parseing CSV files funtions

//Flitering Genres
fs.createReadStream("lab3-data/genres.csv")
  .pipe(csv({}))
  .on("data", (data) => genres.push(data))
  .on("end", () => {
    //Filtering array
    var slicedGenres = genres;
    slicedGenres = slicedGenres.map(genreProperties);
    //console.log(slicedGenres);
    genres = slicedGenres;
  });
//Picking wanted genre properties
function genreProperties(show) {
  const { genre_id, parent, title } = show;
  return { genre_id, parent, title };
}
//Filtering Artists
fs.createReadStream("lab3-data/raw_artists.csv")
  .pipe(csv({}))
  .on("data", (data) => artists.push(data))
  .on("end", () => {
    //Filtering array
    var slicedArtists = artists.slice(0, 500);
    slicedArtists = slicedArtists.map(artistsProperties);
    //console.log(slicedArtists);
    artists = slicedArtists;
  });
//Picking wanted artists properties
function artistsProperties(show) {
  const {
    artist_id,
    artist_name,
    artist_comments,
    artist_active_year_begin,
    artist_favorites,
    artist_handle,
    tags,
  } = show;
  return {
    artist_id,
    artist_name,
    artist_comments,
    artist_active_year_begin,
    artist_favorites,
    artist_handle,
    tags,
  };
}
//Filtering Tracks
fs.createReadStream("lab3-data/raw_tracks.csv")
  .pipe(csv({}))
  .on("data", (data) => tracks.push(data))
  .on("end", () => {
    //Filtering array
    var slicedTracks = tracks.slice(0, 500);
    slicedTracks = slicedTracks.map(tracksProperties);
    //console.log(slicedTracks);
    tracks = slicedTracks;
  });
//Picking wanted track properties
function tracksProperties(show) {
  const {
    track_id,
    album_id,
    album_title,
    artist_id,
    artist_name,
    tags,
    track_date_created,
    track_date_recorded,
    track_duration,
    track_genres,
    track_number,
    track_title,
  } = show;
  return {
    track_id,
    album_id,
    album_title,
    artist_id,
    artist_name,
    tags,
    track_date_created,
    track_date_recorded,
    track_duration,
    track_genres,
    track_number,
    track_title,
  };
}
//Filtering Albums
fs.createReadStream("lab3-data/raw_albums.csv")
  .pipe(csv({}))
  .on("data", (data) => albums.push(data))
  .on("end", () => {
    //Filtering array
    var slicedAlbums = albums.slice(0, 500);
    slicedAlbums = slicedAlbums.map(albumProperties);
    albums = slicedAlbums;
  });
//Picking wanted artists properties
function albumProperties(show) {
  const { album_id, album_title, artist_name, album_date_released } = show;
  return { album_id, album_title, artist_name, album_date_released };
}

//Get list of genres
app.get("/api/genres", (req, res) => {
  res.send(genres);
});
//Get List of artists
app.get("/api/artists", (req, res) => {
  res.send(artists);
});
//Get list of tracks
app.get("/api/tracks", (req, res) => {
  res.send(tracks);
});
//Get list of albums
app.get("/api/albums", (req, res) => {
  res.send(albums);
});

// unauthenticated user search --------------------------
// search for tracks based on any combination of track title, artist, band, or genre
app.get('/api/tracks/:unauthSearch', (req, res) => {
  const input = req.params.unauthSearch; // storing the search input
  var trackResults = []; // storing the resulting tracks for the input

  const options = {
    keys: [
      'track_title',
      'artist_name',
      'album_title',
      'track_genres'
    ],
    includeScore: true, // include fuzziness score - 0 = perfect match, 1 = no match
    shouldSort: true, // sorts by fuzziness (least to most)
    isCaseSensitive: false,
    findAllMatches: false, // stops search if a perfect match is found
  };

  const fuse = new Fuse(tracks, options);

  var results = fuse.search(input);

  // looping through the fuzzy search results array
  for(var i=0; i<results.length; i++){
    // only storing the search results with a score <= 0.4
    if(results[i].score <= 0.4){
      trackResults.push(results[i]);
    }
    // if there are many search results, only show the 30 best matches
    if(trackResults.length >= 30){
      break;
    }
  }

  // if if one or more matching tracks are found, send the trackResults array
  if(trackResults.length > 0){
    res.send(trackResults);
  }
  // if no matches are found, send the status and an error message
  else{
    res.status(404).send(`Track ${input} was not found!`);
  }
})



// ------------------------------------------------------





//Get Atrist info from ID
app.get("/api/artists/info/:artistID", (req, res) => {
  const id = req.params.artistID;
  const track = tracks.find((p) => p.track_id == parseInt(id));
  if (track) {
    res.send(track);
  } else {
    res.status(404).send(`Track ${req.params.artistID} was not found!`);
  }
});

/*
// Get List of track Id's from searched track or album
app.get("/api/tracks/:track_album", (req, res) => {
  const id = req.params.track_album.toLowerCase();
  //Creates array of Id's
  let track = [];
  tracks.forEach((element) => {
    let temp1 = element.track_title.toLowerCase();
    let temp2 = element.album_title.toLowerCase();
    if (temp1.includes(id) || temp2.includes(id)) {
      let id2 = element.track_id;
      track.push(id2);
    }
  });
  //Checks to see if any results were found
  if (track.length != 0) {
    res.send(track);
  } else {
    res.status(404).send(`Track with ID ${id} was not found!`);
  }
});
*/

// Get List for searched artist id's
app.get("/api/artists/:artist_name", (req, res) => {
  const id = req.params.artist_name.toLowerCase();
  //Creates array of just Id's
  let artist = [];
  artists.forEach((element) => {
    let temp = element.artist_name.toLowerCase();
    if (temp.includes(id)) {
      let id2 = element.artist_id;
      artist.push(id2);
    }
  });
  //Checks to see if any results were found
  if (artist.length != 0) {
    res.send(artist);
  } else {
    res.status(404).send(`Artist ${id} was not found!`);
  }
});

//Get list of 5 artists when searched from the front end
app.get("/api/artists/search/:artist_name", (req, res) => {
  const aName = req.params.artist_name.toLowerCase();
  //Creates array of just Id's
  let artist = [];
  artists.forEach((element) => {
    let temp = element.artist_name.toLowerCase();
    if (temp.includes(aName)) {
      let id2 = element;
      artist.push(id2);
    }
    artist = artist.slice(0, 500);
  });
  //Checks to see if any results were found
  if (artist.length != 0) {
    res.send(artist);
  } else {
    res.status(404).send(`Artist ${aName} was not found!`);
  }
});

// Get List of 5 track from searched track
app.get("/api/tracks/search1/:track", (req, res) => {
  const id = req.params.track.toLowerCase();
  //Creates array of Id's
  let track = [];
  tracks.forEach((element) => {
    let temp1 = element.track_title.toLowerCase();
    if (temp1.includes(id)) {
      let id2 = element;
      track.push(id2);
    }
    track = track.slice(0, 500);
  });
  //Checks to see if any results were found
  if (track.length != 0) {
    res.send(track);
  } else {
    res.status(404).send(`Track with ID ${id} was not found!`);
  }
});
// Get List of 5 track from searched album
app.get("/api/album/search/:album", (req, res) => {
  const id = req.params.album.toLowerCase();
  //Creates array of Id's
  let album = [];
  albums.forEach((element) => {
    let temp2 = element.album_title.toLowerCase();
    if (temp2.includes(id)) {
      let id2 = element;
      album.push(id2);
    }
    album = album.slice(0, 500);
  });
  //Checks to see if any results were found
  if (album.length != 0) {
    res.send(album);
  } else {
    res.status(404).send(`Album with ID ${id} was not found!`);
  }
});
//Setup serving front-end code
app.use("/", express.static("static"));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//Parse data in body as JSON
router.use(express.json());

//Setup middleware to do logging
app.use((req, res, next) => {
  // for all routes
  console.log(`${req.method} request for ${req.url}`);
  next();
});

//_DATA BASE ________________________________________________________________________________________________________________________
//Connecting to database
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "lab4",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

//Create Database
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE lab3";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created...");
  });
});
//Create Table/playlist
app.post("/createplaylist/:name", (req, res) => {
  let sql = `CREATE TABLE IF NOT EXISTS ${req.params.name}(TrackID int, Track VARCHAR(255), Artist VARCHAR(255), Album VARCHAR(255), PlayTime VARCHAR(255))`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Playlist  created...");
  });
});
//Insert songs
app.post("/addtrack/:pName/:tID", (req, res) => {
  let playlistName = req.params.pName;
  let trackId = req.params.tID;
  let trackInt = parseInt(trackId);
  //Gets wanted values of track
  var trackName;
  var artist;
  var album;
  var duration;
  tracks.forEach((e) => {
    const x = e.track_id;
    if (x == trackInt) {
      trackName = e.track_title;
      artist = e.artist_name;
      album = e.album_title;
      duration = e.track_duration;
    }
  });

  let sql = `INSERT INTO ${playlistName} VALUES ("${trackInt}", "${trackName}", "${artist}", "${album}", "${duration}")`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Unable to add track");
    console.log(result);
    res.send(result);
  });
});
//Shows list of playlists
app.get("/playlists/list-names", (req, res) => {
  let sql = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='lab3'`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});
//Get songs in playlist
app.get("/playlists/tracks/:pname", (req, res) => {
  let sql = `SELECT * FROM ${req.params.pname}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

//Counters for playlists
app.get("/playlists/info/:pname", (req, res) => {
  let sql = `SELECT (SELECT COUNT(*)
     FROM ${req.params.pname}) as tracks, (SELECT sum(PlayTime) FROM ${req.params.pname}) as duration`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

//Delete playlist
app.delete("/playlists/delete/:pname", (req, res) => {
  let sql = `DROP TABLE ${req.params.pname}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
