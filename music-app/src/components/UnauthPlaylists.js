import React from "react";
import { Link } from 'react-router-dom';
import PublicPlaylistView from "./publicPlaylistView";


export const UnauthPlaylists = () => {

    var plName = '';

    function changePlName(newName){
        plName = newName;
        
    }

    
    

    

    function clearInfoList(){
        while(document.getElementById('infoList').firstChild){
            document.getElementById('infoList').removeChild(document.getElementById('infoList').firstChild);
        }
    }

    function publicPlaylists(){
        fetch('/api/playlists/list-names')
        .then(res => res.json()
        .then(data => {

            var playlists = document.getElementById('publicPlaylistsList');

            while(playlists.firstChild){
                playlists.removeChild(playlists.firstChild);
            }

            for(let i=0; i<data.length; i++){
                playlists.appendChild(document.createTextNode(data[i].playlist_name + ' by ' + data[i].owner + '\xa0\xa0\xa0\xa0'));

                var infoBtn = document.createElement('button');
                infoBtn.style.height = '20px';
                infoBtn.style.width = '70px';
                infoBtn.innerHTML = 'Get Info';
                infoBtn.addEventListener('click', () => {playlistInfo(data[i].playlist_name, data[i].owner)});
                playlists.appendChild(infoBtn);

                

                infoBtn.addEventListener('click', () => {changePlName(data[i].playlist_name)});
                

                //infoBtn.addEventListener('click', () => )
                
                

                playlists.appendChild(document.createElement('br'));
                playlists.appendChild(document.createElement('br'));

                let numPlaylists = playlists.childNodes.length;
                if(numPlaylists == 10){
                    break;
                }

                

            }

            

        }))
    };
    
    function playlistInfo(playlistName, playlistOwner){
        fetch('/api/playlists/info/' + playlistName)
        .then(res => res.json()
        .then(data => {
            
            var infoList = document.getElementById('infoList');

            while(infoList.firstChild){
                infoList.removeChild(infoList.firstChild);
            }

            for(let i=0; i<data.length; i++){
                infoList.appendChild(document.createTextNode(playlistName + ' by ' + playlistOwner));
                infoList.appendChild(document.createElement('br'));

                infoList.appendChild(document.createTextNode('Number of Tracks: ' + data[i].tracks));
                infoList.appendChild(document.createElement('br'));

                infoList.appendChild(document.createTextNode('Total Duration: ' + data[i].duration + ' Minutes'));
                infoList.appendChild(document.createElement('br'));

                var link = document.createElement('a');
                link.href = 'http://localhost:3000/api/playlistview'
                
                var linkBtn = document.createElement('button');
                linkBtn.style.height = '20px';
                linkBtn.style.width = '100px';
                linkBtn.innerHTML = 'Show Playlist';
                linkBtn.addEventListener('click', () => {link.click()});
                infoList.appendChild(linkBtn);
                infoList.appendChild(document.createElement('br'));


                var closeBtn = document.createElement('button');
                closeBtn.style.height = '20px';
                closeBtn.style.width = '55px';
                closeBtn.innerHTML = 'Close';
                closeBtn.addEventListener('click', clearInfoList);
                infoList.appendChild(closeBtn);   

            }







            

            
        }))
    }

    

    

    
    

    

    return(
        <body onLoad={publicPlaylists()}>
            <div id="unauthPlaylists">
            <div>
                <div>
                    <br />
                    <Link to="/unauth-search" style={{marginLeft: '20px'}}>Home</Link>
                    
                </div>
                <center>
                    <span style={{fontSize: '60px', fontFamily: 'Impact'}} >PLAYLISTS</span>
                    <br />
                    <span style={{fontSize: '25px', fontFamily: 'Copperplate'}}>Publicly accessible playlists created by other users</span>
                </center>
            </div>
            <div id="additionalInfo" style={{textAlign: 'center'}}>
                <center>
                    <ol id="infoList" style={{paddingLeft: '0', textAlign: 'center', display: 'inline-block'}}>

                    </ol>
                </center>
            </div>
            <div id="publicPlaylists" style={{textAlign: 'center'}}>
                <ol id="publicPlaylistsList" style={{paddingLeft: '0', textAlign: 'left', display: 'inline-block'}}>
                    
                </ol>
                
            </div>
            <PublicPlaylistView someText = {plName}/>
        </div>

        
        </body>
        
        
            
    );
};
