//Needed Inports:
import { stripBasename } from "@remix-run/router";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UnauthPlaylists } from "./UnauthPlaylists";

//Main component of page
const PublicPlaylistView = () => {
  //Varibale to hold name of displaying playlist
  const params = useParams();
  var name = params.id;

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

  //shows coments on playlist
  const getComments = async () => {
    let result = await fetch(
      `http://localhost:4000/api/playlist/comments/${name.toLowerCase()}`
    );
    result = await result.json();
    setcmnts(result);
  };

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
      <div className="playlist-info">
        <h1>{name}</h1>
        {info.map((item) => (
          <p>
            Description: {item.description}
            <br></br> Owner: {item.owner}
            <br></br>
            Status: {item.status}
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
              </tr>
            ))}
          </tbody>
        </table>
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
export default PublicPlaylistView;
