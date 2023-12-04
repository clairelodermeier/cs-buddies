displayStyles();
window.onloadstart = displayStyles();

function displayStyles(){
    setLocalDisplay();
    displayMode();
    updateColor();
    displayIcon();
}

function setLocalDisplay(){
    setLocalMode();
    setLocalColor();
}

function setLocalMode() {
    let currentMode = window.localStorage.getItem('mode');
    if (currentMode == 'light') {
        window.localStorage.setItem("mode", "light");
        document.getElementById("cssLink").href = "css/style.css";
    } else if (currentMode == 'dark'){
        window.localStorage.setItem("mode", "dark");
        document.getElementById("cssLink").href = "css/darkStyle.css";

    }
}

function setLocalColor() {
    let headerElement = document.getElementById("mainHeader");
    if(window.localStorage.getItem("color")!=null){
        headerElement.style.backgroundColor = window.localStorage.getItem("color");
    }
}

function displayIcon() {
    let iconHolder = document.getElementById("icon");
    let p = fetch("/get/imageID/");
    p.then((response) => {
        return response.text();
    }).then((text) => {
        iconHolder.src = "/get/profilePic/" + text;
    });

}

function changeMode() {
    if (document.getElementById("darkMode").checked==true) {
        document.getElementById("cssLink").href = "css/darkStyle.css";
        window.localStorage.setItem("mode", "dark");
        setMode("dark");
    } else {
        document.getElementById("cssLink").href = "css/style.css";
        setMode("light");
        window.localStorage.setItem("mode", "light");
    }
}

function displayMode() {
    let url = '/get/mode/';
    let p = fetch(url);
    p.then((r) => {
        return r.text();
    }).then((text) => {
        if (text.startsWith("light")) {
            document.getElementById("cssLink").href = "css/style.css";
            window.localStorage.setItem("mode", "light");
            return false;
        }
        else{
            document.getElementById("cssLink").href = "css/darkStyle.css";
            window.localStorage.setItem("mode", "dark");
            return true;
        }
    }).then((dark)=>{
        if(document.getElementById("darkMode")!=null){
            document.getElementById("darkMode").checked = dark;
        }
    });
}

function setMode(mode) {
    let url = '/set/mode/' + mode;
    let p = fetch(url);
    p.then((r) => {
        return r.text();
    }).then((t) => {
        if ((!t.startsWith("SUCCESS"))) {
            alert("Failed to set mode");
        }

    }).then(()=>{
        displayMode();
    });
}

async function updateColorValue(){
    let colorStr = await getColor();
    document.getElementById("color").value = colorStr;
    window.localStorage.setItem("color", colorStr);

}

async function updateColor(){
    let colorStr = await getColor();
    document.getElementById("mainHeader").style.backgroundColor = colorStr;
    window.localStorage.setItem("color", colorStr);


}
async function getColor() {
    let response = await fetch('/get/color/');
    let colorStr = await response.text();
    window.localStorage.setItem("color", '#'+colorStr);
    return "#" + colorStr;
}

function setColor(){
    let color = document.getElementById("color").value;
    let url = '/set/color/' + color.substring(1);
    let p = fetch(url);
    p.then((r)=>{
        return r.text();
    }).then((text)=>{
        if(!(text.startsWith("SUCCESS"))){
            alert("Couldn't change color");
        }
    }).then(()=>{
        updateColor();
    });
}

function deleteAccount(){
    window.confirm("Are you sure you want to delete your account?");
    let p = fetch('/delete/account/');
    p.then((r)=>{
        return r.text();
    }).then((text)=>{
        if(text.startsWith('SUCCESS')){
            alert("Account deleted.");   
            window.location.href = '/account/login.html';
        }
        else{
            alert("Unable to delete account.");
        }
    });
}

function showContent(type) {
    var content = "";

    switch (type) {
        case 'editProfile':
            content = getEditProfileContent();
            break;
        case 'display':
            content = getDisplayContent();
            document.getElementById('content').innerHTML = content;
            displayMode();
            updateColorValue();

            break;

        case 'logOut':
            content = getLogOutContent();
            break;
        case 'privacy':
            content = getPrivacyContent();
            break;
        case 'notification':
            content = getNotificationContent();
            break;
        // Add more cases for other buttons

        default:
            content = "Default content";
    }

    document.getElementById('content').innerHTML = content;

}


function getPrivacyContent() {

    return `
      <div class="settings>
          <div id="privacyContent">
              <h2>Privacy and Accessibility</h2>
              <span class="dot"></span>
  
                  <label for="changePassword">Change Password:</label>
                  <input type="text" id="changePassword" name="changePassword"><br>
  
                  <label for="confirmPassword">Confirm Password:</label>
                  <input type="password" id="confirmPassword" name="confirmPassword"><br>
              
              
                  <button onclick = "deleteAccount()" >Delete Account?</button>
          </div>
      </div>
      `;
}



function getEditProfileContent() {

    return `
      <div class="settings>
          <div id="profileContent">
              <h2>Edit Profile</h2>
              <span class="dot"></span>
  
              <form>
                  <label for="username">Username:</label>
                  <input type="text" id="username" name="username"><br>
  
                  <label for="displayName">Display Name:</label>
                  <input type="text" id="displayName" name="displayName"><br>
              
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email"><br>
  
                  <label for="birthday">Birthday:</label>
                  <input type="date" id="birthday" name="birthday"><br>
              
                  <!-- Add more form fields as needed -->
              
                  <button type="submit">Save Changes</button>
              </form>
          </div>
      </div>
      `;
}

function getDisplayContent() {

    return `
        <div class="settings>
            <div id="displayContent">
                <h2>Display Settings</h2>  
                <label>
                    <input type="checkbox" id="darkMode" onclick="changeMode()"> Dark Mode
                </label><br>
    
                <label for="color">Color Scheme: </label>
                <input type="color" id="color" onchange = "setColor()" name="color"><br>
  
                <script>
  
                </script>
                
                <!-- Add more display settings as needed -->
                
            </div>
        </div>
        `;

}


function getNotificationContent() {

    return `
  <div class="settings>
  <div id="notificationContent">
      <h2>Notification Settings</h2>  
      <label>
          <input type="checkbox" id="notifications"> Notifications Enabled
      </label><br>

      <label for="timeout"> Notification Time Out: </label>
      <input type="time" id="timeout" name="timeout"><br>
      
      <!-- Add more display settings as needed -->
      
  </div>
</div>
  
  `;
}

function getLogOutContent() {

    return `
  <div class="settings>
      <div id="logOutContent">
          <h2> Are you sure?</h2>
          <li>
              <a href="../account/login.html">
              <button class="decisions" id="yes">Yes</button>
              </a>
              <a href="./main.html">
                  <button class="decisions" id="yes">No</button>
              </a>
          </li>
      </div>
  </div>
  `;
}

