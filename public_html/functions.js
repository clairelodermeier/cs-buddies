

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
            content = "Log Out content";
            break;
        case 'privacy':
            content = "Privacy and Accessibility content";
            break;
        case 'notification':
            content = "Notifications";
            break;
        // Add more cases for other buttons

        default:
            content = "Default content";
    }

    document.getElementById('content').innerHTML = content;
}



function getEditProfileContent() {
    return `
        <div id="profileContent">
            <h2>Edit Profile</h2>
            <form>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"><br>
            
                <label for="email">Email:</label>
                <input type="email" id="email" name="email"><br>
            
                <!-- Add more form fields as needed -->
            
                <button type="submit">Save Changes</button>
            </form>
        </div>
    `;
}

function getDisplayContent() {
    return `
        <div id="displayContent">
            <h2>Display Settings</h2>  
            <label>
                <input type="checkbox" id="darkMode"> Dark Mode
            </label><br>
            
            <!-- Add more display settings as needed -->
            
        </div>
    `;
}

