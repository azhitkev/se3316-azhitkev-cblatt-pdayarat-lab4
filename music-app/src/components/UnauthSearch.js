import React from "react";
import axios from "axios";

export const UnauthSearch = () => {

    function search(){
        axios.get('http://localhost:4000/api/tracks/awol')
        .then(function(res){
            alert('hello');
        })
    }
    



    return(
        <div className="unauthSearch">
            <div className="searchBar">
                <br />
                <center>
                    <input 
                        type="text" 
                        className="textBox" 
                        size="80" 
                        placeholder="Enter track, artist, album, or genre">
                    </input>
                </center>
                <br />
                <center>
                    <input 
                        type="button" 
                        className="searchButton" 
                        value="search"
                        onClick={search}>
                    </input>
                </center>
            </div>

            <div className="searchResults">
                <center>
                    <ol className="searchList">
                        
                    </ol>
                </center>
            </div>
        </div>
            
    );
};