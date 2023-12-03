displayStyles();
window.onloadstart = displayStyles();

function displayStyles(){
    displayMode();
    updateColor();
}

// add style to display
function changeMode() {
    if (document.getElementById("darkMode").checked==true) {
        document.getElementById("cssLink").href = "css/darkStyle.css";
        setMode("dark");
    } else {
        document.getElementById("cssLink").href = "css/style.css";
        setMode("light");
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
            return false;
        }
        else{
            document.getElementById("cssLink").href = "css/darkStyle.css";
            return true;
        }
    }).then((dark)=>{
        if(document.getElementById("darkMode")!=null){
            document.getElementById("darkMode").checked = dark;
        }
    })
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
  
              <form>
                  <label for="changePassword">Change Password:</label>
                  <input type="text" id="changePassword" name="changePassword"><br>
  
                  <label for="confirmPassword">Confirm Password:</label>
                  <input type="password" id="confirmPassword" name="confirmPassword"><br>
              
              
                  <button type="deleteAccount">Delete Account?</button>
              </form>
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

async function updateColorValue(){
    let colorStr = await getColor();
    document.getElementById("color").value = colorStr;
}

async function updateColor(){
    let colorStr = await getColor();
    document.getElementById("mainHeader").style.backgroundColor = colorStr;

}
async function getColor() {
    let response = await fetch('/get/color/');
    let colorStr = await response.text();
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
    })
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

window.onload = displayIcon();

function displayIcon() {
    let iconHolder = document.getElementById("icon");
    let p = fetch("/imageID/");
    p.then((response) => {
        return response.text();
    }).then((text) => {
        iconHolder.src = "/profilePic/" + text;
    });

}
