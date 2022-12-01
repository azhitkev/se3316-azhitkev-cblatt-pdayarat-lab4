//Needed Inports:
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Varibale to hold name of displaying playlist


//Main component of page
const PlaylistView = () => {

  let user = "Tisal";
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

//Seting description to new updated description

  const [desciption, setdesciption] = useState("");
  const [newDesc, setnewDesc] = useState(desciption);
  const handleChange3 = (event) => {
    setdesciption(event.target.value);
  };
  const handleClick3 = () => {
    // "message" stores input field value
    setnewDesc(desciption);
  };

  //Changes Descripton to what user wants
  const updateDescription = async () => {
    let result = await fetch(
      `http://localhost:4000/api/authenticated/playlist/description/${name.toLowerCase()}/${newDesc}`,
      {
        method: "Post",
      }
    );
    result = await result.json();
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


  //Deletes playlist and routes you to home
  const deletePlaylist = async () => {
    let result = await fetch(`/api/authenticated/playlists/delete/${name.toLowerCase()}`, {
      method: "Delete",
    });
    result = await result.json();
  };

  // search for tracks
  function searchTracks(){
    var input = document.getElementById('textBox').value;

    fetch('/api/tracks/' + input)
    .then(res => res.json()
    .then(data => {

      var searchList = document.getElementById('searchList');

      while(searchList.firstChild){
        searchList.removeChild(searchList.firstChild);
      }

      searchList.appendChild(document.createElement('br'));

      for(let i=0; i<data.length; i++){
        searchList.appendChild(document.createTextNode(data[i].item.track_title + ' by ' + data[i].item.artist_name + '\xa0\xa0\xa0\xa0'));

        var addBtn = document.createElement('button');
        addBtn.style.height = '20px';
        addBtn.style.width = '120px';
        addBtn.innerHTML = 'Add to Playlist';
        searchList.appendChild(addBtn);

        addBtn.addEventListener('click', () => {addTracks(data[i].item.track_id)});

        searchList.appendChild(document.createElement('br'));
        searchList.appendChild(document.createElement('br'));
      }
    }))
  }

  // add tracks to a playlist
  function addTracks(trackID){
    fetch('/api/authenticated/playlist/addtrack/' + name + '/' + trackID, {
      method: 'POST',
      headers: {'Content-type': 'application/json'}
    })
    .then(res => {
      if(res.ok){
        res.json()
        .then(data => {

          getPlaylists();

        })
        .catch(err => alert('Failed to get JSON object'))
      }
      else{
        alert('Error: ' + res.status)
      }
    })
    .catch()
  }

  //Html for page
  return (
    <React.Fragment>
      <div className="playlist-info">
        <h1>{name}</h1>
        {info.map((item) => (
          <p>
            Description: {item.description}
            <div id="desciption-info">
              <form onSubmit={updateDescription} id="info">
                <input
                  type="text"
                  id="message"
                  name="message"
                  onChange={handleChange3}
                  value={desciption}
                ></input>

                <button
                  onClick={function (event) {
                    handleClick3();
                  }}
                  className="btn1 btn-edit"
                >
                  Update
                </button>
              </form>
            </div>
             Owner: {item.owner}
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
                <button onClick={() => deletePlaylist()}>Delete playlist</button>
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
            Enter
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
      <div id="trackSearch">
        <br />
        <h5 style={{marginLeft: '80px'}}>Add Tracks</h5>
        <input
        type="text"
        id="textBox"
        size="50"
        placeholder="Enter track, artist, album, or genre"
        style={{marginLeft: '80px'}}
        ></input>
        <input type="button" id="searchButton" value="Search" onClick={() => {searchTracks();}}></input>
      </div>
      <div id="searchResults" style={{marginLeft: '80px', marginBottom: '505px'}}>
        <ol id="searchList">

        </ol>
      </div>
    </React.Fragment>
  );
};
export default PlaylistView;
