//Needed Inports:
import React, { useEffect, useState } from "react";

//Varibale to hold name of displaying playlist
var name = "Rap";
//Main component of page
const PlaylistView = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getPlaylists();
  }, []);

  //Calls back end node.js and sql
  const getPlaylists = async () => {
    let result = await fetch(
      `http://localhost:4000/api/playlists/tracks/${name.toLowerCase()}`
    );
    result = await result.json();
    setProducts(result);
  };

  //Method to delete tracks in playlist
  const deleteTrack = async (id)=>{
    console.warn(id);
    let result = await fetch(`http://localhost:4000/api/authenticated/playlists/deletetrack/${name.toLowerCase()}/${parseInt(id)}`,{
      method:"Delete"
    });
    result = await result.json();
    if(result){
      getPlaylists();
    }

    

  }

  //Html for page
  return (
    <React.Fragment>
      <div className="playlist-info">
        <h1>{name}</h1>
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

          {products.map((item) => (
            <tr>
              <td>{item.TrackID}</td>
              <td>{item.Track}</td>
              <td>{item.Artist}</td>
              <td>{item.Album}</td>
              <td>{item.PlayTime}</td>
              <td>
                <button onClick={()=> deleteTrack(item.TrackID)} className="btn btn-delete">Remove</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};
export default PlaylistView;
