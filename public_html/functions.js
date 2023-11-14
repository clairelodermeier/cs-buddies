

//To display different settings depending on the button
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
            content = "Privacy and Accessibility content";
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

function showChannel(type)
{
    var channel = "";

    switch (type) {
        case 'channel1':
            channel = "Channel 1";
            break;
        case 'channel2':
            channel = "Channel 2";
            break;

        default:
            channel = "Default Channel";
    }

    document.getElementById('channel').innerHTML = channel;
}




function getEditProfileContent() {
    return `
    <div class="settings>
        <div id="profileContent">
            <h2>Edit Profile</h2>
            <span class="dot></span>

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

