import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import Axios from "axios";
import { Link } from "react-router-dom";

export const PolicyDCMA = () => {

  const [role, setRole] = useState("");


    useEffect(() => {
      if (auth.currentUser !== null) {
        Axios.get(`http://localhost:4000/roleAndUsername/${auth.currentUser.email}`).then(
          (response) => {
            setRole(response.data[0].role);
          }
        );
      }
    }, []);

    

    // function to write the policy
    function writePolicy(){
        var textBox = document.getElementById('newPolicyText');
        var policy = document.getElementById('policy');
        
        localStorage.setItem('dcmaPolicy', textBox.value);

        var newPolicy = localStorage.getItem('dcmaPolicy');

        policy.innerHTML = newPolicy;
    }

    
    function showPolicy(){
        
        var policy = document.getElementById('policy');

        var storedPolicy = localStorage.getItem('dcmaPolicy');

        policy.innerHTML = storedPolicy;
        
    }

    function reloadPage(){
      var link = document.createElement('a');
      link.href = 'localhost:3000/dcma-notice';
      link.click();
    }
    
    

  

  return (
    <body>
      <div id="securityAndPrivacy">
        <div>
          <div>
            <br />
            <Link to="/dashboard" style={{ marginLeft: "20px" }}>
              Dashboard
            </Link>
          </div>
          <center>
            <span style={{ fontSize: "60px", fontFamily: "Impact" }}>
              DCMA NOTICE & TAKEDOWN POLICY
            </span>
            <br />
          </center>
        </div>
        <center>
        <br />
        <br />
        <div id="policy" style={{ fontSize: "25px", fontFamily: "Copperplate" }}>
            
        </div>
        <div>
        <br />
        <input type="button" value="Show Policy" onClick={() => showPolicy()}></input>
      </div>
        </center>
      </div>
      <center>
        {role === "admin" &&
        <div id="editDiv" style={{marginTop: '200px'}}>
            Create New Policy:
            <br />
            <br />
            <input type="text" id="newPolicyText" style={{height: '300px', width: '1000px'}}></input>
            <br />
            <br />
            <input type="button" id="saveBtn" value="Save" onClick={() => writePolicy()}></input>
        </div>}
      </center>
    </body>
      );
};
