// Tabs logic for front-end
const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("active");
    });
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    tab.classList.add("active");
    target.classList.add("active");
  });
});

//Sanatiazing method
function encoderHTML(s) {
  return s.replace(/&/g, "&amp;").replace(/</, "&lt;").replace(/"/g, "&quot;");
}

// Genre list maker
getGenres();
// Displays list of genres on genre tab
function getGenres() {
  fetch(`/api/genres`).then((res) =>
    res.json().then((data) => {
      console.log(data);
      const l = document.getElementById("GenreList");
      data.forEach((e) => {
        const item = document.createElement("li");
        item.appendChild(
          document.createTextNode(
            `${e.title},  ID: ${e.genre_id},   #Parents: ${e.parent}`
          )
        );
        l.appendChild(item);
      });
    })
  );
}
var sorter1 = "";
//Listens to artist search
document.getElementById("get-Alist").addEventListener("click", searchArtists);
//Fetches artist search method and creates list of results
function searchArtists() {
  let name = encoderHTML(document.getElementById("artistInput").value);
  fetch(`/api/artists/search/${name}`).then((res) =>
    res.json().then((data) => {
      console.log(data);
      const l = document.getElementById("TrackList");
      //Sorting
      const sotrBy = document.getElementById("sortArt");
      sotrBy.addEventListener("click", function () {
        sorter1 = "artist_name";
      });
      sotrBy.addEventListener("click", searchArtists);
      data.sort(GetSortOrder(sorter1));
      sorter1 = "";
      while (l.firstChild) {
        l.removeChild(l.firstChild);
      }
      //Creating List
      data.forEach((e) => {
        const item = document.createElement("li");
        item.appendChild(
          document.createTextNode(
            `Name: ${e.artist_name}, Id:${e.artist_id}, Comments:${e.artist_comments}, Start:${e.artist_active_year_begin}, Favs:${e.artist_favorites}
                    , Handle:${e.artist_handle}, Tags:${e.tags}`
          )
        );
        l.appendChild(item);
      });
    })
  );
}
var sorter2 = "";
//Listens for track search button
document.getElementById("get-Tlist").addEventListener("click", searchTracks1);
//Fetches list of tracks depending on track search
function searchTracks1() {
  let name = encoderHTML(document.getElementById("trackInput").value);
  fetch(`/api/tracks/search1/${name}`).then((res) =>
    res.json().then((data) => {
      console.log(data);
      const l = document.getElementById("TrackList");
      //Sorting the trakcs by button selected method
      const sotrBy = document.getElementById("sortArt");
      const sotrBy2 = document.getElementById("sortTrack");
      const sotrBy3 = document.getElementById("sortAlbum");
      const sotrBy4 = document.getElementById("sortTime");
      sotrBy.addEventListener("click", function () {
        sorter2 = "artist_name";
      });
      sotrBy2.addEventListener("click", function () {
        sorter2 = "track_title";
      });
      sotrBy3.addEventListener("click", function () {
        sorter2 = "album_title";
      });
      sotrBy4.addEventListener("click", function () {
        sorter2 = "track_duration";
      });
      sotrBy.addEventListener("click", searchTracks1);
      sotrBy2.addEventListener("click", searchTracks1);
      sotrBy3.addEventListener("click", searchTracks1);
      sotrBy4.addEventListener("click", searchTracks1);
      data.sort(GetSortOrder(sorter2));
      sorter2 = "";
      while (l.firstChild) {
        l.removeChild(l.firstChild);
      }
      //Dispalying lists
      data.forEach((e) => {
        const item = document.createElement("li");
        item.appendChild(
          document.createTextNode(
            `Track: ${e.track_title}, Id:${e.track_id}, Album:${e.album_title}, ID:${e.album_id}, Track#:${e.track_number}, Artist:${e.artist_name}
                    , Id:${e.artist_id}, Genres:${e.track_genres}, Created:${e.track_date_created} , Recorded:${e.track_date_recorded} , Tags:${e.tags}, Duration:${e.track_duration} `
          )
        );
        l.appendChild(item);
      });
    })
  );
}
var sorter3 = " ";
//Listens for album search button
document.getElementById("get-Alblist").addEventListener("click", searchAlbums);
//Fetches list of tracks depending on album search
function searchAlbums() {
  let name = encoderHTML(document.getElementById("albumInput").value);
  fetch(`/api/album/search/${name}`).then((res) =>
    res.json().then((data) => {
      console.log(data);
      const l = document.getElementById("TrackList");
      //Sort alphabeticlly the album names
      const sotrBy3 = document.getElementById("sortAlbum");
      sotrBy3.addEventListener("click", function () {
        sorter3 = "album_title";
      });
      sotrBy3.addEventListener("click", searchAlbums);
      data.sort(GetSortOrder(sorter3));
      sorter3 = "";
      while (l.firstChild) {
        l.removeChild(l.firstChild);
      }
      //Displaying lists
      data.forEach((e) => {
        const item = document.createElement("li");
        item.appendChild(
          document.createTextNode(
            `Id: ${e.album_id}, Album: ${e.album_title}, Artist: ${e.artist_name}
                  , Released: ${e.album_date_released}`
          )
        );
        l.appendChild(item);
      });
    })
  );
}
//Listens for clear List button
document.getElementById("clearList").addEventListener("click", clearList);
//Clears list of resutls
function clearList() {
  const l = document.getElementById("TrackList");
  while (l.firstChild) {
    l.removeChild(l.firstChild);
  }
}
//Comparer Function for sorting
function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

//________DATABASE/PLAYLISTS______________________________________________________________________________________________________________________________
//Creates Playlists
//Listens to playlist name
document.getElementById("get-playlist").addEventListener("click", setplaylist);
//Creates new playlist with given name
function setplaylist() {
  let pName = encoderHTML(document.getElementById("playlistInput").value);
  console.log(pName);
  fetch(`/createplaylist/${pName}`, { method: "POST" }).then((res) =>
    res.json()
  );
  getPlaylists();
}

//Displays list of playlist:
// Playlist maker
getPlaylists();
// Displays list of playlists created
function getPlaylists() {
  fetch(`/playlists/list-names`).then((res) =>
    res.json().then((data) => {
      const l = document.getElementById("list-Playlists");
      //Making sure list is not repeated
      while (l.firstChild) {
        l.removeChild(l.firstChild);
      }
      const item1 = document.createElement("option");
      item1.appendChild(document.createTextNode("Select.."));
      l.appendChild(item1);

      data.forEach((e) => {
        l.addEventListener("click", showList);

        const item = document.createElement("option");
        item.appendChild(document.createTextNode(`${e.TABLE_NAME}`));
        l.appendChild(item);
      });
    })
  );
}
var sorter4 = " ";
//Shows tracks in selected playlist
function showList() {
  const pName = document.getElementById("list-Playlists").value;
  if ("Select.." != pName) {
    fetch(`/playlists/tracks/${pName}`).then((res) =>
      res.json().then((data) => {
        console.log(data);
        const l = document.getElementById("P_TrackList");
        //Making sure list is not repeated
        while (l.firstChild) {
          l.removeChild(l.firstChild);
        }
        let trackCounter = 0;
        let totalTime = 0;
        const tags = document.createElement("p");

        //Sorting the trakcs by button selected method
        const sotrBy = document.getElementById("sortArt2");
        const sotrBy2 = document.getElementById("sortTrack2");
        const sotrBy3 = document.getElementById("sortAlbum2");
        const sotrBy4 = document.getElementById("sortTime2");
        sotrBy.addEventListener("click", function () {
          sorter4 = "Artist";
        });
        sotrBy2.addEventListener("click", function () {
          sorter4 = "Track";
        });
        sotrBy3.addEventListener("click", function () {
          sorter4 = "Album";
        });
        sotrBy4.addEventListener("click", function () {
          sorter4 = "PlayTime";
        });
        sotrBy.addEventListener("click", showList);
        sotrBy2.addEventListener("click", showList);
        sotrBy3.addEventListener("click", showList);
        sotrBy4.addEventListener("click", showList);
        data.sort(GetSortOrder(sorter4));
        sorter4 = "";
        while (l.firstChild) {
          l.removeChild(l.firstChild);
        }
        //Creating list of tracks in playlist
        data.forEach((e) => {
          //Time and track number created
          trackCounter++;
          var time = `${e.PlayTime}`;
          var array = time.split(":");
          var seconds = parseInt(array[0]) * 60 + parseInt(array[1]);
          totalTime += seconds;
          //List created
          const item = document.createElement("li");
          item.appendChild(
            document.createTextNode(
              `ID: ${e.TrackID}, ${e.Track}, Album: ${e.TrackID}, Artist: ${e.Album}, Duration: ${e.PlayTime} `
            )
          );
          l.appendChild(item);
        });
        //Display number of tracks and playlist length
        var date = new Date(0);
        date.setSeconds(totalTime); // specify value for SECONDS here
        var timeString = date.toISOString().substring(11, 19);
        tags.appendChild(
          document.createTextNode(
            `Total Tracks: ${trackCounter},  Playlist Duration: ${timeString}`
          )
        );
        l.appendChild(tags);
      })
    );
  }

  //Deleting list if no selection is made
  else if ("Select.." == pName) {
    const l = document.getElementById("P_TrackList");
    //Making sure list is not repeated
    while (l.firstChild) {
      l.removeChild(l.firstChild);
    }
  }
}

//Searching for tracks to add to Playlists
//Listens for track search button
document.getElementById("get-Tlist2").addEventListener("click", searchTracks2);
var trackId;
//Fetches list of tracks depending on track search
function searchTracks2() {
  const name = document.getElementById("trackInput2").value;
  fetch(`/api/tracks/search1/${name}`).then((res) =>
    res.json().then((data) => {
      console.log(data);
      const l = document.getElementById("TrackList2");
      while (l.firstChild) {
        l.removeChild(l.firstChild);
      }

      //Creating list of tracks that can be added to playlist
      data.forEach((e) => {
        const item = document.createElement("li");
        const btn = document.createElement("button");
        btn.addEventListener("click", function () {
          trackId = `${e.track_id}`;
        });
        btn.appendChild(document.createTextNode("Add"));
        btn.addEventListener("click", saveTrack);

        //Displays tracks
        item.appendChild(
          document.createTextNode(
            `Track: ${e.track_title}, Id: ${e.track_id}, Album: ${e.album_title}, Artist: ${e.artist_name}
                    , Recorded: ${e.track_date_recorded} , Duration: ${e.track_duration} `
          )
        );
        item.appendChild(btn);
        l.appendChild(item);
      });
    })
  );
}
//Save wanted trackt to selected playlist
function saveTrack() {
  const menue = document.getElementById("list-Playlists").value;
  let id = trackId;

  fetch(`/addtrack/${menue}/${id}`, { method: "POST" }).then((res) =>
    res.json()
  );
  console.log("method called");
}

//Deletes playlist
document
  .getElementById("delete-playlist")
  .addEventListener("click", deletePlaylist);

//Delete unwanted playlists
function deletePlaylist() {
  const pName = encoderHTML(document.getElementById("list-Playlists").value);
  fetch(`/playlists/delete/${pName}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
}
