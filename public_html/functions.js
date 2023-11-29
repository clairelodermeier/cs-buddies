

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

//create user function
function CreateUser() {
    var name = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    var DoB = document.getElementById('birthdate').value;
    var email = document.getElementById('email').value;

    var imgFile = document.getElementById('profilePic').files[0];
    var formData = new FormData();
    formData.append('photo', imgFile, imgFile.name);

    // Create the fetch request for the image
    let imgUrl = '/upload';
    let imgP = fetch(imgUrl, {
        method: 'POST',
        body: formData,
    });
    imgP.then((r)=>{
        return r.json();
    }).then((idObj)=>{
        var userObj = { n: name, p: pass, d: DoB, e: email, i: idObj};
    
    });

    let url = '/create/user/';

    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: { 'Content-Type': 'application/json' }
      });
      
    p.then((response) => {
        return response.text();
    }).then((text) => {
        alert(text);
    })
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
var confirmButton = document.getElementById("confirm"); // Allows confirm button to work
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

confirmButton.onclick = function()
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
    while (document.getElementById(channelName)) {
        var userResponse = confirm("Channel name already taken. Do you want to choose a different name?");
        
        if (userResponse) {
            // If the user wants to choose a different name, prompt again
            channelName = prompt("Enter a different channel name:");
        } else {
            // If the user doesn't want to choose a different name, exit the loop
            return;
        }
    }



    var newChannelButton = document.createElement("button");
    newChannelButton.textContent = channelName;
    newChannelButton.className = "leftListItem";
    newChannelButton.id = channelName;

    var listItem = document.createElement("li");
    listItem.appendChild(newChannelButton);


    newChannelButton.onclick = function()
    {
        alert("Button: " + channelName + " got clicked!");

        var channels = JSON.parse(localStorage.getItem('channels')) || [];
        console.log("List of channels:", channels);

    }

    
    channelList.appendChild(listItem);
    saveChannel(channelName);

}

function saveChannel(channelName)
{
    var channels = JSON.parse(localStorage.getItem('channels')) || [];
    if (!channels.includes(channelName)) 
    {
        channels.push(channelName);

    localStorage.setItem('channels', JSON.stringify(channels));
    }
}

function loadChannels()
{
    channelList.innerHTML = "";
    var channels = JSON.parse(localStorage.getItem('channels')) || [];

    channels.forEach(function(channel)
    {
        createChannelButton(channel);
    });
}


window.onload = loadChannels();

//To show different chats depending on the channel --WORK IN PROGRESS--
function showChannelContent(channelName)
{
    var content = "";
    
    switch(channelName)
    {
        case 'channel1':
            content = test();
            break;
        default:
            content = "Default content";
        }
    
        document.getElementById('content').innerHTML = content;
    
}

function test()
{
    return  `   
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


//To potentially delete Channels ----Still In Progress ------
channelList.addEventListener('contextmenu', function(event)
{
    event.preventDefault();


    var clickedChannelButton = event.target;

    if (clickedChannelButton.tagName === 'BUTTON') {
        var confirmDelete = window.confirm("Are you sure you want to delete this channel?");
        
        if (confirmDelete) {
            deleteChannel(clickedChannelButton.textContent);
        }
    }
    
});


function deleteChannel(channelName) {
    var channels = JSON.parse(localStorage.getItem('channels')) || [];

    // Remove the channel from the array
    var updatedChannels = channels.filter(function(channel) {
        return channel !== channelName;
    });

    // Update localStorage with the modified array
    localStorage.setItem('channels', JSON.stringify(updatedChannels));

    // Reload channels to reflect the changes
    loadChannels();
}


/*----------------------------------- */



//Dark Mode --Still not applying to other pages
if (window.localStorage.getItem('mode') == null) {
    window.localStorage.setItem('mode', 'L');
  }

  
  function setTheme() {
    let currentMode = window.localStorage.getItem('mode');
    if (currentMode == 'L') {
        document.body.style.cssText("css/style.css");
    } else {
        document.body.style.cssText("css/darkStyle.css");
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

  console.log(window.localStorage.getItem('mode'));
