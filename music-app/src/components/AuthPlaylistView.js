//Needed Inports:
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

//Varibale to hold name of displaying playlist

//Main component of page
const AuthPlaylistView = () => {
  const params = useParams();
  var name = params.id;
  let user = "Tisal";

  const [playlists, setplaylists] = useState([]);

  const [info, setinfo] = useState([]);

  const [cmnts, setcmnts] = useState([]);
  //List of tracks
  useEffect(() => {
    getPlaylists();
  }, []);
  //Info about playlists
  useEffect(() => {
    playlistInfo();
  }, []);
  //Shows current comments
  useEffect(() => {
    getComments();
  }, []);

  //Gets all tracks in playlist
  const getPlaylists = async () => {
    let result = await fetch(
      `/api/playlists/tracks/${name.toLowerCase()}`
    );
    result = await result.json();
    setplaylists(result);
  };
      //Creates rating for playlist
      function setAvgRating() {
        fetch(`/api/playlist/rating/average/${name.toLowerCase()}`).then((res) =>
          res.json().then((data) => {
            ;
          })
        );
      }



  ///Checks playlist information and also sets status
  const playlistInfo = async () => {
    let result = await fetch(
      `/api/authenticated/playlist/get-description/${name.toLowerCase()}`
    );
    result = await result.json();
    if (result[0].status == 1) {
      result[0].status = "Private";
    } else {
      result[0].status = "Public";
    }
    setinfo(result);
    
  };

  //Change status of playlsit to either public or private
  const changeStatusInfo = async (id) => {
    if (id == "Public") {
      let result1 = await fetch(
        `/api/authenticated/playlist/status/private/${name.toLowerCase()}`
      );
      window.location.reload(false);
    } else if (id == "Private") {
      let result2 = await fetch(
        `/api/authenticated/playlist/status/public/${name.toLowerCase()}`
      );
      window.location.reload(false);
    } else {
      console.log("no changes");
    }
  };

  //shows coments on playlist
  const getComments = async () => {
    let result = await fetch(
      `/api/playlist/comments/${name.toLowerCase()}`
    );
    result = await result.json();
    setcmnts(result);
  };
  //add coments to playlist;
  const addComments = async () => {
    let result = await fetch(
      `/api/authenticated/playlist/comments/${name.toLowerCase()}/${user}/${updated}/${update}`,
      {
        method: "Post",
      }
    );
    result = await result.json();
  };
  //Holds temporary comments when entering
  const [message, setMessage] = useState("");
  const [updated, setUpdated] = useState(message);
  const handleChange = (event) => {
    setMessage(event.target.value);
  };
  const handleClick = () => {
    // "message" stores input field value
    setUpdated(message);
  };

  //Setting rating by holding user value
  const [rating, setRating] = useState("");
  const [update, setUpdate] = useState(rating);
  const handleChange2 = (event) => {
    setRating(event.target.value);
  };
  const handleClick2 = () => {
    // "message" stores input field value
    setUpdate(rating);
  };


  //Shows information for each individual track
  function trackInfo(trackId) {
    fetch("/api/tracks/getInfo/" + trackId).then((res) =>
      res.json().then((data) => {
        var infoList = document.getElementById("infoList");

        //infoList.appendChild(document.createTextNode(data.track_title));
        infoList.appendChild(
          document.createTextNode(data.track_title + " by " + data.artist_name)
        );
        infoList.appendChild(document.createElement("br"));

        var youtubeBtn = document.createElement("button");
        youtubeBtn.style.height = "20px";
        youtubeBtn.style.width = "60px";
        youtubeBtn.innerHTML = "Play";
        youtubeBtn.addEventListener("click", () => {
          window.open(data.track_url, "_blank");
        });

        infoList.appendChild(youtubeBtn);
        infoList.appendChild(document.createElement("br"));

        infoList.appendChild(
          document.createTextNode("Album: " + data.album_title)
        );
        infoList.appendChild(document.createElement("br"));

        var genresArr = data.track_genres;
        genresArr = genresArr.replace(/'/g, '"');
        genresArr = JSON.parse(genresArr);

        var genreNamesArr = [];

        for (let i = 0; i < genresArr.length; i++) {
          genreNamesArr.push(genresArr[i].genre_title);
        }

        var genreNamesStr = genreNamesArr.join(", ");

        infoList.appendChild(
          document.createTextNode("Genre(s): " + genreNamesStr)
        );
        infoList.appendChild(document.createElement("br"));

        

        infoList.appendChild(
          document.createTextNode("Play-Length: " + data.track_duration)
        );
        infoList.appendChild(document.createElement("br"));

        infoList.appendChild(
          document.createTextNode("Date Created: " + data.track_date_created)
        );
        infoList.appendChild(document.createElement("br"));

        var closeBtn = document.createElement("button");
        closeBtn.style.height = "20px";
        closeBtn.style.width = "80px";
        closeBtn.innerHTML = "Close";
        closeBtn.addEventListener("click", clearInfoList);

        infoList.appendChild(closeBtn);
      })
    );
  }
  //Clears track info div
  function clearInfoList() {
    while (document.getElementById("infoList").firstChild) {
      document
        .getElementById("infoList")
        .removeChild(document.getElementById("infoList").firstChild);
    }
  }

  //Html for page
  return (
    <React.Fragment>
      <br/>
      <Link to="/unauth-playlists" style={{ marginLeft: "20px" }}>
        Playlist
      </Link>
      <div className="playlist-info">
        <h1>{name}</h1>
        {info.map((item) => (
          <p>
            Description: {item.description}
            <br></br> Owner: {item.owner}
            <br></br>
            Status: {item.status}
            <br></br> Rating: {item.avg_rating}
            <br></br> Edited: {item.last_edited}
          </p>
        ))}
      </div>
      <center>
        <div id="additionalInfo">
          <ol id="infoList"></ol>
        </div>
      </center>

      <div className="track-list">
        <table id="t1">
          <tbody>
            <tr>
              <th>T .No</th>
              <th>Track</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Play Time</th>
              <th>Info</th>
            </tr>

            {playlists.map((item) => (
              <tr>
                <td>{item.TrackID}</td>
                <td>{item.Track}</td>
                <td>{item.Artist}</td>
                <td>{item.Album}</td>
                <td>{item.PlayTime}</td>
                <td>
                  <button
                    onClick={() => {clearInfoList(); trackInfo(item.TrackID)}}
                    className="btn btn-delete"
                  >
                    Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <form onSubmit={addComments} id="cmnts">
          <label for="fname">Enter Comments:</label>
          <br></br>
          <input
            type="text"
            id="message"
            name="message"
            onChange={handleChange}
            value={message}
          ></input>
          <br></br>

          <label for="fname">Enter Rating /10:</label>
          <br></br>
          <input
            type="number"
            id="rating"
            name="rating"
            onChange={handleChange2}
            value={rating}
            max={"10"}
            min={"0"}
          ></input>

          <button
            onClick={function (event) {
              handleClick();
              handleClick2();
              setAvgRating();
            }}
            className="btn1 btn-edit"
          >
            Update
          </button>
        </form>

        <h4>
          Comment: {message} <br></br>Rating: {rating}
        </h4>
        <h3>Comments:</h3>
        <table id="t2">
          <tbody>
            {cmnts.map((item) => (
              <tr>
                <td>
                  {item.user}
                  <br></br> {item.time_stamp}{" "}
                </td>
                <td>{item.comment}</td>
                <td>{item.rating}/10</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};
export default AuthPlaylistView;
