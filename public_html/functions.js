
// add style to display
function addStyleSheet(sheetName) {
      if (document.getElementById("darkMode").checked) {
        document.getElementById("cssFile").href = "css/darkStyle.css";
    } else {
        document.getElementById("cssFile").href = "css/style.css";
        }
    }

    User
    function showContent(type)
    {
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
    
    function getPrivacyContent()
    {
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
                    <input type="checkbox" id="darkMode"> Dark Mode
                </label><br>
    
                <label for="color">Color Scheme: </label>
                <input type="color" id="color" name="color"><br>
    
                
                <!-- Add more display settings as needed -->
                
            </div>
        </div>
        `;
    }

function getNotificationContent()
{
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

function getLogOutContent()
{
    return `
    <div class="settings>
        <div id="logOutContent">
            <h2> Are you sure?</h2>
            <li>
                <a href="./login.html">
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


var modal = document.getElementById("channelModal");
var button = document.getElementById("addButton");
var span = document.getElementsByClassName("close")[0];
var confirm = document.getElementById("confirm"); // Allows confirm button to work
var channelList = document.getElementById("channelList");
 

button.onclick = function()
{
    modal.style.display = "block";
}

span.onclick = function()
{
    var text = document.getElementById("channelName");
    if(text && text.value)
    {
        text.value = "";
    }
    modal.style.display = "none";
}

confirm.onclick = function()
{
    var text = document.getElementById("channelName");
    if(text && text.value)
    {
        var newText = text.value;
        text.value = ""
        modal.style.display = "none";
        createChannelButton(newText);
        
    }
    else
    {   
        alert("Please enter a channel name")
        modal.style.display = "block";
    }

}

window.onclick = function(event)
{
    if(event.target == modal)
    {
        modal.style.display = "none";
    }
}

function createChannelButton(channelName)
{
    var newChannelButton = document.createElement("button");
    newChannelButton.textContent = channelName;
    newChannelButton.className = "leftListItem";
    newChannelButton.id = "channelList";

    var listItem = document.createElement("li");
    listItem.appendChild(newChannelButton);


    newChannelButton.onclick = function()
    {
        alert("Button: " + channelName + " got clicked!");
    }

    
    channelList.appendChild(listItem);

}

document.getElementById("channelList").onmousedown = function(event)
{
    if(event.target == 3)
    {
        window.alert("right clicked!");
    }
}

//To potentially delete Channels
channelList.addEventListener('contextmenu', function(event)
{
    event.preventDefault();
    window.alert("Right clicked on channel" + channelList.id);
});





//Dark Mode
if (window.localStorage.getItem('mode') == null) {
    window.localStorage.setItem('mode', 'L');
  }
  
  function setTheme() {
    let currentMode = window.localStorage.getItem('mode');
    if (currentMode == 'L') {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    } else {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'grey';
    }
  }
  
  setTheme();
  
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
  
  let t = document.getElementById('darkMode');
  t.onclick = toggle;
