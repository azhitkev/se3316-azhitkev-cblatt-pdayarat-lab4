import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicPlaylistView from "./publicPlaylistView";
import { auth } from "../firebase-config";
import Axios from "axios";

export const UnauthPlaylists = () => {
  const [role, setRole] = useState("");
  // const [userName, setUser] = useState("");

  useEffect(() => {
    // console.log("ayoooooo", auth.currentUser.email);
    if (auth.currentUser !== null) {
      Axios.get(
        `http://localhost:4000/roleAndUsername/${auth.currentUser.email}`
      ).then((response) => {
        setRole(response.data[0].role);
        // setUser(response.data[0].userName);
      });
    }
  }, []);

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
        }
      })
    );
  }

  function openPlaylist(playlistNm, owner, userName, role) {
    if (role == "admin") {
      var link = document.createElement("a");
      link.href = "http://localhost:3000/api/playlistview/" + playlistNm;
      link.click();
    } else if (owner != userName && role == "active-user") {
      var link = document.createElement("a");
      link.href =
        "http://localhost:3000/api/authenticated/playlistview/" + playlistNm;
      link.click();
    } else if (owner == userName) {
      var link = document.createElement("a");
      link.href =
        "http://localhost:3000/api/authenticated/personal/playlistview/" +
        playlistNm;
      link.click();
    } else {
      var link = document.createElement("a");
      link.href = "http://localhost:3000/api/playlistview/" + playlistNm;
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

          if(data[i].duration === null){
            infoList.appendChild(document.createTextNode('Total Duration: 0 Minutes'));
            infoList.appendChild(document.createElement("br"));
          }
          else{
            infoList.appendChild(document.createTextNode('Total Duration: ' + data[i].duration + ' Minutes'));
            infoList.appendChild(document.createElement("br"));
          }

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
  function getInfoPlaylist() {
    fetch(`/roleAndUsername/${auth.currentUser.email}`).then((res) =>
      res.json().then((data) => {
        createPlaylist(data[0].username);
      })
    );
  }
  function createPlaylist(name) {
    let new_pName = document.getElementById("playlistInput").value;
    fetch(`/api/authenticated/createplaylist/${new_pName}/${name}`, {
      method: "POST",
    });
    publicPlaylists();
    getCurrentUser();
  }
  //Get username of current logged in user
  function getUsername(pName, owner) {
    if (auth.currentUser !== null) {
      fetch(`/roleAndUsername/${auth.currentUser.email}`).then((res) =>
        res.json().then((data) => {
          // setRole(data[0].role);
          console.log(setRole(data[0].role));
          openPlaylist(pName, owner, data[0].username, data[0].role);
        })
      );
    }
    else{
        openPlaylist(pName, owner, null, null);
    }
  }

  // get current user's username
  function getCurrentUser() {
    fetch("/roleAndUsername/" + auth.currentUser.email).then((res) =>
      res.json().then((data) => {
        getMyPlaylists(data[0].username);
      })
    );
  }

  // get current user's playlists
  function getMyPlaylists(currentUser) {
    fetch("/api/playlists/list-names/" + currentUser).then((res) =>
      res.json().then((data) => {
        var myPlaylists = document.getElementById("myPlaylists");

        while (myPlaylists.firstChild) {
          myPlaylists.removeChild(myPlaylists.firstChild);
        }

        for (let i = 0; i < data.length; i++) {
          myPlaylists.appendChild(
            document.createTextNode(
              data[i].playlist_name + " by " + data[i].owner + "\xa0\xa0\xa0"
            )
          );

          var linkBtn = document.createElement("button");
          linkBtn.innerHTML = "Edit Playlist";

          var link = document.createElement("a");
          link.href =
            "api/authenticated/personal/playlistview/" + data[i].playlist_name;

          var getInfoBtn = document.createElement('button');
          getInfoBtn.innerHTML = 'Get Info';
          getInfoBtn.addEventListener('click', () => {playlistInfo(data[i].playlist_name, data[i].owner)});
          myPlaylists.appendChild(getInfoBtn);
          myPlaylists.appendChild(document.createTextNode('\xa0\xa0\xa0'));

          linkBtn.addEventListener("click", () => {
            openPlaylist(data[i].playlist_name, currentUser, currentUser);
          });
          myPlaylists.appendChild(linkBtn);
          myPlaylists.appendChild(document.createElement("br"));
          
          
        }
      })
    );
  }

  // get user email
  // from user email, get role of the user
  // take Tisal's method to get username
  // my playlists: ...

  return (
    <body onLoad={publicPlaylists()}>
      <div id="unauthPlaylists">
        <div>
          <div>
            <br />
            {auth.currentUser !== "active-user" &&
              auth.currentUser !== "admin" && (
                <Link to="/dashboard" style={{ marginLeft: "20px" }}>
                  Home
                </Link>
              )}
          </div>
          <center>
            <span style={{ fontSize: "60px", fontFamily: "Impact" }}>
              PLAYLISTS
            </span>
            <br />
            <span style={{ fontSize: "25px", fontFamily: "Copperplate" }}>
              Publicly accessible playlists
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

      {auth.currentUser !== null && role === "active-user" && (
        <center>
          <div onLoad={getCurrentUser()}>
            <span style={{ fontSize: "25px", fontFamily: "Copperplate" }}>
              My Playlists:<br></br>
            </span>
            <ol
              id="myPlaylists"
              style={{
                paddingLeft: "0",
                textAlign: "center",
                display: "inline-block",
              }}
            ></ol>
          </div>
        </center>
      )}

      {auth.currentUser !== null && role === "active-user" && (
        <div id="searchBar">
          

          <center>
            <span style={{ fontSize: "25px", fontFamily: "Copperplate" }}>
              
              Create Playlists:<br></br>
            </span>
            <input
              type="text"
              id="playlistInput"
              size="25"
              placeholder="Create Playlist"
              style={{ marginBottom: "30px" }}
            ></input>

            <button
              onClick={() => {
                getInfoPlaylist();
              }}
              className="btn3 btn-edit"
              style={{ marginBottom: "30px" }}
            >
              Create
            </button>
          </center>
        </div>
      )}
    </body>
  );
};
