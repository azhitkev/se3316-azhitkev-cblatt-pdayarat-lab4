import React from "react";
import { Link } from "react-router-dom";
import PublicPlaylistView from "./publicPlaylistView";
import { auth } from "../firebase-config";

export const UnauthPlaylists = () => {
    let email = auth.currentUser.email;
    


  function clearInfoList() {
    while (document.getElementById("infoList").firstChild) {
      document
        .getElementById("infoList")
        .removeChild(document.getElementById("infoList").firstChild);
    }
  }

  function publicPlaylists() {
    fetch("/api/playlists/list-names").then((res) =>
      res.json().then((data) => {
        var playlists = document.getElementById("publicPlaylistsList");

        while (playlists.firstChild) {
          playlists.removeChild(playlists.firstChild);
        }

        for (let i = 0; i < data.length; i++) {
          playlists.appendChild(
            document.createTextNode(
              data[i].playlist_name +
                " by " +
                data[i].owner +
                "\xa0\xa0\xa0\xa0"
            )
          );

          var infoBtn = document.createElement("button");
          infoBtn.style.height = "20px";
          infoBtn.style.width = "70px";
          infoBtn.innerHTML = "Get Info";
          infoBtn.addEventListener("click", () => {
            playlistInfo(data[i].playlist_name, data[i].owner);
          });
          playlists.appendChild(infoBtn);

          

          //infoBtn.addEventListener('click', () => )

          playlists.appendChild(document.createElement("br"));
          playlists.appendChild(document.createElement("br"));

          let numPlaylists = playlists.childNodes.length;
          if (numPlaylists == 10) {
            break;
          }
        }
      })
    );
  }

  function openPlaylist(playlistNm, owner, userName) {
    
    if(owner !=userName){
        var link = document.createElement('a');
        link.href = 'http://localhost:3000/api/playlistview/' + playlistNm;
        link.click();
    }
    else if(owner ==userName){
        var link = document.createElement('a');
        link.href = 'http://localhost:3000/api/authenticated/personal/playlistview/' + playlistNm;
        link.click();
    }
    }
    


  function playlistInfo(playlistName, playlistOwner) {
    fetch("/api/playlists/info/" + playlistName).then((res) =>
      res.json().then((data) => {
        var infoList = document.getElementById("infoList");

        while (infoList.firstChild) {
          infoList.removeChild(infoList.firstChild);
        }

        for (let i = 0; i < data.length; i++) {
          infoList.appendChild(
            document.createTextNode(playlistName + " by " + playlistOwner)
          );
          infoList.appendChild(document.createElement("br"));

          infoList.appendChild(
            document.createTextNode("Number of Tracks: " + data[i].tracks)
          );
          infoList.appendChild(document.createElement("br"));

          infoList.appendChild(
            document.createTextNode(
              "Total Duration: " + data[i].duration + " Minutes"
            )
          );
          infoList.appendChild(document.createElement("br"));

          

          var linkBtn = document.createElement("button");
          linkBtn.style.height = "20px";
          linkBtn.style.width = "100px";
          linkBtn.innerHTML = "Show Playlist";
          linkBtn.addEventListener("click", () => {
            getUsername(playlistName, playlistOwner);
          });
          infoList.appendChild(linkBtn);
          infoList.appendChild(document.createElement("br"));

          var closeBtn = document.createElement("button");
          closeBtn.style.height = "20px";
          closeBtn.style.width = "55px";
          closeBtn.innerHTML = "Close";
          closeBtn.addEventListener("click", clearInfoList);
          infoList.appendChild(closeBtn);
        }
      })
    );
  }
//Creates playlist for the logged in user
  function getInfoPlaylist(){
    fetch(`/roleAndUsername/${auth.currentUser.email}`).then((res) =>
    res.json().then((data) => {
        createPlaylist(data[0].username)

    }))
  }
  function createPlaylist(name) {
    let new_pName = document.getElementById("playlistInput").value;
    fetch(`/api/authenticated/createplaylist/${new_pName}/${name}`, {
      method: "POST",
    });
    publicPlaylists();
  }
  //Get username of current logged in user
  function getUsername(pName, owner){
    fetch(`/roleAndUsername/${auth.currentUser.email}`).then((res) =>
    res.json().then((data) => {
        openPlaylist(pName,owner,data[0].username)
    }))

  }

  return (
    <body onLoad={publicPlaylists()}>
      <div id="unauthPlaylists">
        <div>
          <div>
            <br />
            <Link to="/dashboard" style={{ marginLeft: "20px" }}>
              Dashboard
            </Link>
          </div>
          <center>
            <span style={{ fontSize: "60px", fontFamily: "Impact" }}>
              PLAYLISTS
            </span>
            <br />
            <span style={{ fontSize: "25px", fontFamily: "Copperplate" }}>
              Publicly accessible playlists created by other users
            </span>
          </center>
        </div>
        <div id="additionalInfo" style={{ textAlign: "center" }}>
          <center>
            <ol
              id="infoList"
              style={{
                paddingLeft: "0",
                textAlign: "center",
                display: "inline-block",
              }}
            ></ol>
          </center>
        </div>
        <div id="publicPlaylists" style={{ textAlign: "center" }}>
          <ol
            id="publicPlaylistsList"
            style={{
              paddingLeft: "0",
              textAlign: "left",
              display: "inline-block",
            }}
          ></ol>
        </div>
      </div>
      <div id="searchBar">
        <br />
            
        <center>
        <span style={{ fontSize: "25px", fontFamily: "Copperplate" }}>
              Create Playlists:<br></br>
            </span>
          <input
            type="text"
            id="playlistInput"
            size="25"
            placeholder="Create Playlist"
            style={{marginBottom: '30px'}}
          ></input>

          <button
            onClick={() => {
              getInfoPlaylist();
            }}
            className="btn3 btn-edit"
            style={{marginBottom: '30px'}}
          >
            Create
          </button>
        </center>
      </div>
    </body>
  );
};
