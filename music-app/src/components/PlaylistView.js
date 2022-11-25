
import axios from "axios";
import React from "react";


export function PlaylistView (){

getPlaylists();

    function getPlaylists() {
        axios
        .get(`http://localhost:4000/api/authenticated/playlists/list-names`).then((res) =>
          res.json().then((data) => {
            console.log(data);
            //const l = document.getElementById("list-Playlists");
            //Making sure list is not repeated
            // while (l.firstChild) {
            //   l.removeChild(l.firstChild);
            // }
            // const item1 = document.createElement("option");
            // item1.appendChild(document.createTextNode("Select.."));
            // l.appendChild(item1);
      
            // data.forEach((e) => {
            //  // l.addEventListener("click", showList);
      
            //   const item = document.createElement("option");
            //   item.appendChild(document.createTextNode(`${e.TABLE_NAME}`));
            //   l.appendChild(item);
            // });
          })
        );
      }
    return(  
    <React.Fragment>
    <h1>Playlist Page</h1>
    <form>
                <label id="pHeading">Current Playlists: </label>
                <select id="list-Playlists">
                    <option>Select...</option>
                </select>
            </form>

            <ul id="P_TrackList"> </ul>
  </React.Fragment>
    );
  };
