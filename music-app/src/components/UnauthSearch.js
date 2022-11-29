import React from "react";
import { Link } from 'react-router-dom';

export const UnauthSearch = () => {

    function clearList(){
        while(document.getElementById('searchList').firstChild){
            document.getElementById('searchList').removeChild(document.getElementById('searchList').firstChild);
        }
    }

    function clearInfoList(){
        while(document.getElementById('infoList').firstChild){
            document.getElementById('infoList').removeChild(document.getElementById('infoList').firstChild);
        }
    }

    function search(){

        var input = document.getElementById('textBox').value;

        fetch('/api/tracks/' + input)
        .then(res => res.json()
        .then(data => {

            var searchList = document.getElementById('searchList');
            
            for(let i=0; i<data.length; i++){
                searchList.appendChild(document.createTextNode(data[i].item.track_title + ' by ' + data[i].item.artist_name + '\xa0\xa0\xa0\xa0'));

                var trackBtn = document.createElement('button');
                trackBtn.style.height = '20px';
                trackBtn.style.width = '80px';
                trackBtn.innerHTML = 'Get Info';
                trackBtn.addEventListener('click', () => {trackInfo(data[i].item.track_id)});
                trackBtn.addEventListener('click', clearInfoList);
                    
                searchList.appendChild(trackBtn);
                
                searchList.appendChild(document.createElement('br'));
            }
            
            
            
        }))
    }

    
    function trackInfo(trackId){

        fetch('/api/tracks/getInfo/' + trackId)
        .then(res => res.json()
        .then(data => {

            var infoList = document.getElementById('infoList');

            //infoList.appendChild(document.createTextNode(data.track_title));
            infoList.appendChild(document.createTextNode(data.track_title + ' by ' + data.artist_name));
            infoList.appendChild(document.createElement('br'));

            var youtubeBtn = document.createElement('button');
            youtubeBtn.style.height = '20px';
            youtubeBtn.style.width = '55px';
            youtubeBtn.innerHTML = 'Play';
            youtubeBtn.addEventListener('click', () => {window.open(data.track_url, '_blank')});
            
            infoList.appendChild(youtubeBtn);
            infoList.appendChild(document.createElement('br'));

            infoList.appendChild(document.createTextNode('Album: ' + data.album_title));
            infoList.appendChild(document.createElement('br'));
            
            /*
            NEED TO FIGURE OUT HOW TO SHOW TRACK GENRES
            infoList.appendChild(document.createTextNode('Genre(s): ' + data.track_genres));
            infoList.appendChild(document.createElement('br'));
            */

            infoList.appendChild(document.createTextNode('Play-Length: ' + data.track_duration));
            infoList.appendChild(document.createElement('br'));

            infoList.appendChild(document.createTextNode('Date Created: ' + data.track_date_created));
            infoList.appendChild(document.createElement('br'));

            var closeBtn = document.createElement('button');
            closeBtn.style.height = '20px';
            closeBtn.style.width = '55px';
            closeBtn.innerHTML = 'Close';
            closeBtn.addEventListener('click', clearInfoList);
            
            infoList.appendChild(closeBtn);

            
            
        }))

    }

    
    

    

    return(
        <div id="unauthSearch">
            <div>
                <div>
                    <br />
                    <Link to="/login" style={{marginLeft: '20px'}}>Login</Link>
                    <Link to="/register" style={{marginLeft: '20px'}}>Register</Link>
                    <Link to="/unauth-playlists" style={{marginLeft: '20px'}}>Playlists</Link>
                    
                </div>
                <center>
                    <span style={{fontSize: '60px', fontFamily: 'Impact'}} >MUSIC TOWN</span>
                    <br />
                    <span style={{fontSize: '25px', fontFamily: 'Copperplate'}}>A Web Application for Accessing Music Data</span>
                </center>
            </div>

            <div id="searchBar">
                <br />
                <center>
                    <input 
                        type="text" 
                        id="textBox" 
                        size="80" 
                        placeholder="Enter track, artist, album, or genre">
                    </input>
                </center>
                <br />
                <center>
                    <input 
                        type="button" 
                        id="searchButton" 
                        value="search"
                        onClick={() => {
                            clearList();
                            search();
                        }}>
                    </input>
                </center>
            </div>

            
            <div id="additionalInfo" style={{textAlign: 'center'}}>
                <center>
                <ol id="infoList" style={{paddingLeft: '0', textAlign: 'left', display: 'inline-block'}}>
                    
                </ol>
                </center>
            </div>
            
            
            
            <div id="searchResults" style={{textAlign: 'center'}}>
                
                    <ol id="searchList" style={{paddingLeft: '0', textAlign: 'left', display: 'inline-block'}}>
                        
                    </ol>
                
            </div>

            
            
        </div>
        
            
    );
};
