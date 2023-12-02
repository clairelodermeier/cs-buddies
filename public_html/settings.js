
let t = document.getElementById('darkMode');
t.onclick = toggle;
console.log(window.localStorage.getItem('mode'));

function toggle() {
    let currentMode = window.localStorage.getItem('mode');
    if (currentMode == 'L') {
        currentMode = 'D';

    } else {
        currentMode = 'L';

    }
    window.localStorage.setItem('mode', currentMode);
    setTheme();
}

// add style to display
function addStyleSheet() {
    if (document.getElementById("darkMode").checked) {
        document.getElementById("cssFile").href = "css/darkStyle.css";
        window.localStorage.setItem('darkMode', 'enabled');
    } else {
        document.getElementById("cssFile").href = "css/style.css";
        window.localStorage.setItem('darkMode', 'disabled');
    }
}

function showContent(type) {
    var content = "";

    switch (type) {
        case 'editProfile':
            content = getEditProfileContent();
            break;
        case 'display':
            content = getDisplayContent();
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

//Moved the CreateUser to the login.JS

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
    var darkModeState = window.localStorage.getItem('darkMode');
    var isChecked = darkModeState === 'enabled';
    return `
      <div class="settings>
          <div id="displayContent">
              <h2>Display Settings</h2>  
              <label>
                  <input type="checkbox" id="darkMode" ${isChecked ? 'checked' : ''} onclick="addStyleSheet()"> Dark Mode
              </label><br>
  
              <label for="color">Color Scheme: </label>
              <input type="color" id="color" name="color"><br>

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