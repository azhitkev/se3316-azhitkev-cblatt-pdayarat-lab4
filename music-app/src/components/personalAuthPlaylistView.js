//Needed Inports:
import React, { useEffect, useState } from "react";

//Varibale to hold name of displaying playlist
var name = "Rap";
var user = "Tisal";

//Main component of page
const PlaylistView = () => {
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
      `http://localhost:4000/api/playlists/tracks/${name.toLowerCase()}`
    );
    result = await result.json();
    setplaylists(result);
  };

  //Method to delete tracks in playlist
  const deleteTrack = async (id) => {
    console.warn(id);
    let result = await fetch(
      `http://localhost:4000/api/authenticated/playlists/deletetrack/${name.toLowerCase()}/${parseInt(
        id
      )}`,
      {
        method: "Delete",
      }
    );
    result = await result.json();
    if (result) {
      getPlaylists();
    }
  };

  ///Checks playlist information and also sets status
  const playlistInfo = async () => {
    let result = await fetch(
      `http://localhost:4000/api/authenticated/playlist/get-description/${name.toLowerCase()}`
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
        `http://localhost:4000/api/authenticated/playlist/status/private/${name.toLowerCase()}`
      );
      window.location.reload(false);
    } else if (id == "Private") {
      let result2 = await fetch(
        `http://localhost:4000/api/authenticated/playlist/status/public/${name.toLowerCase()}`
      );
      window.location.reload(false);
    } else {
      console.log("no changes");
    }
  };

  //shows coments on playlist
  const getComments = async () => {
    let result = await fetch(
      `http://localhost:4000/api/playlist/comments/${name.toLowerCase()}`
    );
    result = await result.json();
    setcmnts(result);
  };
  //add coments to playlist;
  const addComments = async () => {
    let result = await fetch(
      `http://localhost:4000/api/authenticated/playlist/comments/${name.toLowerCase()}/${user}/${updated}/${update}`,
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

        infoList.appendChild(
          document.createTextNode("Album: " + data.album_title)
        );
        infoList.appendChild(document.createElement("br"));

        /*
          NEED TO FIGURE OUT HOW TO SHOW TRACK GENRES
          infoList.appendChild(document.createTextNode('Genre(s): ' + data.track_genres));
          infoList.appendChild(document.createElement('br'));
          */

        infoList.appendChild(
          document.createTextNode("Play-Length: " + data.track_duration)
        );
        infoList.appendChild(document.createElement("br"));

        infoList.appendChild(
          document.createTextNode("Date Created: " + data.track_date_created)
        );
        infoList.appendChild(document.createElement("br"));

        var youtubeBtn = document.createElement("button");
        youtubeBtn.style.height = "20px";
        youtubeBtn.style.width = "120px";
        youtubeBtn.innerHTML = "Play on Youtube";
        youtubeBtn.addEventListener("click", () => {
          window.open(data.track_url, "_blank");
        });

        infoList.appendChild(youtubeBtn);
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

  //Changes Descripton to what user wants
  const updateDescription = async (id) => {
    let result = await fetch(
      `http://localhost:4000/api/authenticated/playlist/description/${name.toLowerCase()}/${id}}`,
      {
        method: "Post",
      }
    );
    result = await result.json();
  };

  //Deletes playlist and routes you to home
  const deletePlaylist = async (id) => {
    let result = await fetch(`Put stuff here`, {
      method: "Delete",
    });
    result = await result.json();
  };

  //Html for page
  return (
    <React.Fragment>
      <div className="playlist-info">
        <h1>{name}</h1>
        {info.map((item) => (
          <p>
            Description: {item.description}
            <button onClick={updateDescription} className="btn1 btn-edit">
              Edit
            </button>
            <br></br> Owner: {item.owner}
            <br></br>
            Status: {item.status}
            <button
              onClick={() => changeStatusInfo(item.status)}
              className="btn1 btn-edit"
            >
              Switch
            </button>
            <br></br> Rating: {item.rating}
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
              <th>
                <button>Delete playlist</button>
              </th>
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
                    onClick={() => trackInfo(item.TrackID)}
                    className="btn btn-delete"
                  >
                    Info
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => deleteTrack(item.TrackID)}
                    className="btn btn-delete"
                  >
                    Remove
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
export default PlaylistView;
