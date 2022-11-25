const express = require("express");
const app = express();
const port = 4000;
const router = express.Router();
const csv = require("csv-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

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
    var slicedArtists = artists.slice(0, 15);
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
    var slicedTracks = tracks.slice(0, 15);
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
    var slicedAlbums = albums.slice(0, 15);
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
    artist = artist.slice(0, 15);
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
    track = track.slice(0, 15);
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
    album = album.slice(0, 15);
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
const e = require("express");
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

//_AUTHENTICATION ________________________________________________________________________________________________________________________
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

//how you instantiate the cookie parser and body parser so that these extensions work
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "3316aztdcb",
    resave: false,
    saveUninitialized: false,
    cookie: {
      //means that the cookie expires after 24 hours, so sessions can be maintained for that long
      expires: 60 * 60 * 24,
    },
  })
);

app.post("/register", (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  //we need to encrypt the password created by the user using the hash function so that it is not saved to the db as plain text (not safe)
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) console.log(err);
    let sql = `INSERT INTO Users (first_name, last_name, email, password) VALUES ("${first_name}", "${last_name}", "${email}", "${hash}")`;

    db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
});

//verifies that there the json token that is presented corresponds to the valid user's json token
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  //if there is no token
  if (!token) {
    res.send("yo, we need a token, please give it to us next time!");
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "You failed to authenticate" });
      } else {
        //this is the decoded token (id) being set to the userid variable
        req.userId = decoded.id;
        next();
      }
    });
  }
};

//checks if the user is authenticated
app.get("/api/authenticated", verifyJWT, (req, res) => {
  res.send("Yo, u are authenticated. Congrats!");
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let sql = `SELECT * FROM Users WHERE email = "${email}"`;

  db.query(sql, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    //there is someone in the db with that username/password combination
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const id = result[0].id;
          //creating the json web token
          const token = jwt.sign({ id }, "jwtSecret", {
            expiresIn: 300, //5 minutes
          });

          //creating a session with the user we get from our database and setting it to the result we just got
          req.session.user = result;

          //since we have gotten to this point, the authorization is true and we need to send the json token and result
          res.json({ auth: true, token: token, result: result });
        } else {
          res.json({
            auth: false,
            message: "Wrong username/password combination",
          });
        }
      });
    } else {
      //happens if no user exists
      res.json({ auth: false, message: "No user exists" });
    }
  });
});
