/*
Claire Lodermeier, Audrey Hall, Joyce Dam
The purpose of this file is to implement client side functions for the settings page of an online 
social media application. It creates server requests for fetching user information, 
channels, and display settings. Also uses local storage to load display settings faster.
*/

window.onloadstart = displayStyles();

// This function updates the display settings when the page loads. 
// Updates mode, color, and profile picture.
function displayStyles() {
    setLocalDisplay();
    getMode();
    updateColor();
    displayIcon();
}

// This function updates display settings including mode and color from locally stored items. 
function setLocalDisplay() {
    setLocalMode();
    setLocalColor();
}

// This function sets the mode (dark/light) using the mode item stored locally. 
// Switches to the correct css file by updating the href of the link tag in the DOM
function setLocalMode() {
    let currentMode = window.localStorage.getItem('mode');
    if (currentMode == 'light') {
        document.getElementById("cssLink").href = "css/style.css";
    } else if (currentMode == 'dark') {
        document.getElementById("cssLink").href = "css/darkStyle.css";
    }
}

// This function updates the color scheme using the color item stored locally.
// Updates the style.color attributes for DOM elements  
function setLocalColor() {
    let headerElement = document.getElementById("mainHeader");
    let helpButton = document.getElementById("helpButton");
    let bottomButton = document.getElementsByClassName("bottomButton");
    if (window.localStorage.getItem("color") != null) {
        headerElement.style.backgroundColor = window.localStorage.getItem("color");
        helpButton.style.color = window.localStorage.getItem("color");
        helpButton.style.borderColor = window.localStorage.getItem("color");
        for (var i = 0; i < bottomButton.length; i++){
		    bottomButton[i].style.color = window.localStorage.getItem("color");
	    }
    }
}

// This function displays the user's profile picture icon. Creates a server request for the imageID
// and updates the src attribute of the img tag 
function displayIcon() {
    let iconHolder = document.getElementById("icon");
    let p = fetch("/get/imageID/");
    p.then((response) => {
        return response.text();
    }).then((text) => {
        if(text.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        else{
            iconHolder.src = "/get/profilePic/" + text;
        }
    });
}

// This function chages the mode (light/dark) in local storage and by changing the css in the DOM.
function changeMode() {
    if (document.getElementById("darkMode").checked == true) {
        document.getElementById("cssLink").href = "css/darkStyle.css";
        window.localStorage.setItem("mode", "dark");
        setMode("dark");
    } else {
        document.getElementById("cssLink").href = "css/style.css";
        setMode("light");
        window.localStorage.setItem("mode", "light");
    }
}

// This function creates a server request to get the mode (light/dark) that the user has specified
function getMode() {
    let url = '/get/mode/';
    let p = fetch(url);
    p.then((r) => {
        return r.text();
    }).then((text) => {
        if(text.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        else if (text.startsWith("light")) {
            document.getElementById("cssLink").href = "css/style.css";
            window.localStorage.setItem("mode", "light");
            return false;
        }
        else {
            document.getElementById("cssLink").href = "css/darkStyle.css";
            window.localStorage.setItem("mode", "dark");
            return true;
        }
    }).then((dark) => {
        if (document.getElementById("darkMode") != null) {
            document.getElementById("darkMode").checked = dark;
        }
    });
}

// This function creates a server request to set the user's preferred display mode
// Param: mode, a string "light" or "dark"
function setMode(mode) {
    let url = '/set/mode/' + mode;
    let p = fetch(url);
    p.then((r) => {
        return r.text();
    }).then((t) => {
        if(t.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        if ((!t.startsWith("SUCCESS"))) {
            alert("Failed to set mode");
        }
    });
}

// This function updates the value of the color input field in settings based on the saved color 
// for the user. It also sets the locally stored color. 
function updateColorValue() {
    let colorStr = getColor();
    document.getElementById("color").value = colorStr;
    window.localStorage.setItem("color", colorStr);
}

// This function updates the color of the html elements based on the saved color for the user. 
// It also sets the locally stored color. 
function updateColor() {
    let colorStr = getColor();
    let bottomButton = document.getElementsByClassName("bottomButton");
    document.getElementById("mainHeader").style.backgroundColor = colorStr;
    let helpButton = document.getElementById("helpButton");
    helpButton.style.color = window.localStorage.getItem("color");
    helpButton.style.borderColor = window.localStorage.getItem("color");
    for (var i = 0; i < bottomButton.length; i++){
        bottomButton[i].style.color = window.localStorage.getItem("color");
    }
    window.localStorage.setItem("color", colorStr);
}

// This function creates a server request to get the saved color for the user. 
// Returns: a string in the format of a hex color "#XXXXXX" 
function getColor() {
    let p = fetch('/get/color/');
    p.then((r) => {
        return r.text();
    }).then((text) => {
        window.localStorage.setItem("color", "#" + text);
    });
    return window.localStorage.getItem("color");
}

// This function creates a server request to set the user's saved color based on the color input.
// After receiving a response from the server, calls the updateColor() function.
function setColor() {
    let color = document.getElementById("color").value;

    // immediately update colors on the dom
    document.getElementById("mainHeader").style.backgroundColor = color;
    let helpButton = document.getElementById("helpButton");
    let bottomButton = document.getElementsByClassName("bottomButton");
    helpButton.style.color = color;
    helpButton.style.borderColor = color;
    for (var i = 0; i < bottomButton.length; i++){
        bottomButton[i].style.color = color;
    }

    // update in local storage
    window.localStorage.setItem("color", color);

    // change saved color on the server
    let url = '/set/color/' + color.substring(1);
    let p = fetch(url);
    p.then((r) => {
        return r.text();
    }).then((text) => {
        if(text.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        if (!(text.startsWith("SUCCESS"))) {
            alert("Couldn't change color");
        }
    });
}

// This function allows a user to delete their account. Confirms choice to delete and creates a 
// server request. Alerts with result; if successful, redirects to login. 
function deleteAccount() {
    window.confirm("Are you sure you want to delete your account?");
    let p = fetch('/delete/account/');
    p.then((r) => {
        return r.text();
    }).then((text) => {
        if(text.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        if (text.startsWith('SUCCESS')) {
            alert("Account deleted.");
            window.location.href = '/account/login.html';
        }
        else {
            alert("Unable to delete account.");
        }
    });
}

// This function sets the content on the settings page depending on which category is selected. 
// Param: type, a string denoting which settings to display
function showContent(type) {
    var content = "";
    switch (type) {
        // edit profile settings
        case 'editProfile':
            content = getEditProfileContent();
            break;
        // display settings
        case 'display':
            content = getDisplayContent();
            document.getElementById('content').innerHTML = content;
            getMode();
            updateColorValue();
            break;
        // content settings
        case 'logOut':
            content = getLogOutContent();
            break;
        // privacy settings
        case 'privacy':
            content = getPrivacyContent();
            break;
        // Add more cases for other buttons
        default:
            content = "Default content";
    }
    document.getElementById('content').innerHTML = content;
}

// This function implements user's changes to their profile by calling change functions for each 
// field the user changed. 
function editProfile() {
    let e = document.getElementById('email');
    let p = document.getElementById('newPic');

    if (e.value != ('')) {
        changeEmail(e.value);
    }
    if (p.files.length != 0) {
        changePic(p.files[0]);
    }
}

// This function creates a request to the server to change a user's email address.
// Param: newEmail, a string for the user's new email address
function changeEmail(newEmail) {
    let p = fetch('/set/email/' + newEmail);
    p.then((r) => {
        return r.text();
    }).then((text) => {
        if(text.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        else if (!(text.startsWith("SUCCESS"))) {
            alert("Failed to change email.");
        }
        else{
            alert("Email updated.");
        }
    });
}

// This function creates a request to the server to change a user's profile picture. 
// Param: imgFile, the new uploaded file
function changePic(imgFile) {
    // get image data
    var formData = new FormData();
    formData.append('photo', imgFile, imgFile.name);
    // create request for image upload
    let imgUrl = '/upload';
    let imgP = fetch(imgUrl, {
        method: 'POST',
        body: formData,
    });
    imgP.then((r) => {
        return r.text();
    }).then((text) => {
        let p2 = fetch('/set/pic/'+text);
        p2.then((r) => {
            return r.text();
        }).then((text) => {
            if(text.startsWith("INVALID")){
                window.location.href = '/account/login.html';
                return;
            }if (!(text.startsWith("SUCCESS"))) {
                alert("Failed to update profile pic.")
            }else{
                alert("Picture updated.");
                displayIcon();
            }
        });
    });
}

// This function creates a request to the server to change a user's password. 
function changePassword() {
    var pass = document.getElementById("changePassword");
    var confirm = document.getElementById("confirmPassword");
    if(pass.value!=confirm.value){
        alert("Passwords do not match.");
    }
    else{
        let pObj = {'p': pass.value}
        let p = fetch('/set/password/', {
            method: 'POST',
            body: JSON.stringify(pObj),
            headers: { 'Content-Type': 'application/json' },
        });
        p.then((r)=>{
            return r.text();
        }).then((text)=>{
            if(text.startsWith("INVALID")){
                window.location.href = '/account/login.html';
                return;
            }else if(text.startsWith("SUCCESS")){
                alert("Password successfully changed.");
            }else{
                alert("Unable to change password.");
            }
        // clear input fields
        }).finally(()=>{
            pass.value = '';
            confirm.value = '';
        });
    }
}

// This function logs a user out by deleting their session and redirecting to login.
// Creates a request to the server to logout the current user
function logout(){
    let p = fetch('/logout/');
    p.then((r)=>{
        return r.text();
    }).then((text)=>{
        if(text.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        if(text.startsWith("SUCCESS")){
            window.location.href = '../account/login.html';
        }
        else{
            alert("Couldn't log you out.");
        }
    });
}

// This function gets the html for the privacy settings content 
// Returns: an html string with 2 input fields and 2 buttons
function getPrivacyContent() {
    return `
      <div class="settings>
          <div id="privacyContent">
              <h2>Privacy and Account info</h2>
              <span class="dot"></span>
  
                  <label for="changePassword">Change Password:</label>
                  <input type="text" id="changePassword" name="changePassword"><br>
  
                  <label for="confirmPassword">Confirm Password:</label>
                  <input type="password" id="confirmPassword" name="confirmPassword"><br>
              
                  <div><button id = "confirmChange" onclick = "changePassword()" >
                  Change</button></div>
                  <div><button id = "deleteButton" onclick = "deleteAccount()" >
                  Delete Account?</button></div>
          </div>
      </div>
      `;
}

// This function gets the html for the edit profile settings content 
// Returns: an html string with 2 input fields and a button
function getEditProfileContent() {

    return `
      <div class="settings>
          <div id="profileContent">
              <h2>Edit Profile</h2>
              <span class="dot"></span>
  

                <label for="email">Email:</label>
                <input type="email" id="email" name="email"><br>

                <label for="newPic">Profile picture:</label>
                <input type="file" id="newPic" name="newPic"><br>
            
                <!-- Add more form fields as needed -->
            
                <button onclick = 'editProfile()'>Save Changes</button>
          </div>
      </div>
      `;
}

// This function gets the html for the display settings content 
// Returns: an html string with 2 input fields
function getDisplayContent() {

    return `
        <div class="settings>
            <div id="displayContent">
                <h2>Display Settings</h2>  
                <label>
                    <input type="checkbox" id="darkMode" onclick="changeMode()"> Dark Mode
                </label><br>

                <label for="color">Color Scheme: </label>
                <input type="color" id="color" onchange = "setColor()" value = ${getColor()} 
                name="color"><br>
  
                <script>
  
                </script>
                
                <!-- Add more display settings as needed -->
                
            </div>
        </div>
        `;
}

// This function gets the html for when a user wants to log out. 
// Returns: an html string which displays a message and 2 buttons. 
function getLogOutContent() {

    return `
  <div class="settings>
      <div id="logOutContent">
          <h2> Are you sure you want to log out?</h2>
          <li>
              <button class="decisions" onclick = "logout()" id="yes">Yes</button>
              <a href="./settings.html">
                  <button class="decisions" id="no">No</button>
              </a>
          </li>
      </div>
  </div>
  `;
}



