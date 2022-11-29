import React from "react";
import { Link } from 'react-router-dom';


export const UnauthPlaylists = () => {

    function publicPlaylists(){
        fetch('/api/playlists/list-names')
        .then(res => res.json()
        .then(data => {

            var playlists = document.getElementById('publicPlaylistsList');

            while(playlists.firstChild){
                playlists.removeChild(playlists.firstChild);
            }

            for(let i=0; i<data.length; i++){
                playlists.appendChild(document.createTextNode(data[i].playlist_name + ' by ' + data[i].owner));
            }

            // number of playlists
            /*
            let numPlaylists = playlists.childNodes.length;
            playlists.appendChild(document.createTextNode(numPlaylists));
            */

        }))
    };

    

    

    
    

    

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
        </div>
        </body>
        
        
            
    );
};
