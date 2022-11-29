//Needed Inports:
import React, { useEffect, useState } from "react";

//Varibale to hold name of displaying playlist
var name = "Rap";

//Main component of page
const PlaylistView = () => {
  const [playlists, setplaylists] = useState([]);

  const [info, setinfo] = useState([]);

  useEffect(() => {
    getPlaylists();
  }, []);

  useEffect(() => {
    playlistInfo();
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

  //Gets information about playlist
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

  //Creates forum to enter description
  function forumMaker(){

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
    if (result) {
      refreshPage();
    }
  };

  //Function to refresh page
  function refreshPage() {
    window.location.reload(false);
  }


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
            {item.status}
            <br></br> Rating: {item.rating}
          </p>
        ))}
      </div>

      <div className="track-list">
        <table id="t1">
          <tbody>
            <tr>
              <th>T .No</th>
              <th>Track</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Play Time</th>
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

        <form>
        <label for="fname">Enter Comments:</label><br></br>
        <input type="text" id="comment" name="fname"></input>
        </form>
      </div>
    </React.Fragment>
  );
};
export default PlaylistView;
