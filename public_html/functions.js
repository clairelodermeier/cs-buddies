/*
Claire Lodermeier
The purpose of this file is to implement client side functions for the main page of an online 
social media application. It creates server requests for fetching user information, 
channels, and display settings. Also uses local storage to load display settings faster.
*/

window.onloadstart = mode();
window.onloadstart = updateColor();
window.onloadstart = displayIcon();
window.onloadstart = setLocalDisplay();

// This function updates display settings including mode and color from locally stored items. 
function setLocalDisplay(){
    setLocalMode();
    setLocalColor();
}
// This function sets the mode (dark/light) using the mode item stored locally. 
// Switches to the correct css file by updating the href of the link tag in the DOM
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

// This function updates the color scheme using the color item stored locally.
// Updates the style.color attributes for DOM elements  
function setLocalColor() {
    let headerElement = document.getElementById("mainHeader");
    let helpButton = document.getElementById("helpButton");
    if (window.localStorage.getItem("color")!=null){
        headerElement.style.backgroundColor = window.localStorage.getItem("color");
        helpButton.style.color = window.localStorage.getItem("color");
        helpButton.style.borderColor = window.localStorage.getItem("color");    
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

// This function updates the local storage and css in the dom to display dark or light mode. 
// Creates a server request to get the user's stored mode.
function mode() {
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
            window.localStorage.setItem("mode", "light");
            document.getElementById("cssLink").href = "css/style.css";
        }
        else {
            window.localStorage.setItem("mode", "dark");
            document.getElementById("cssLink").href = "css/darkStyle.css";
        }
    });
}

// This function updates the color of the html elements based on the saved color for the user. 
// It also sets the locally stored color. 
function updateColor() {
    let colorStr = getColor();
    let headerElement = document.getElementById("mainHeader");
    headerElement.style.backgroundColor = window.localStorage.getItem("color");
    let helpButton = document.getElementById("helpButton");
    helpButton.style.color = window.localStorage.getItem("color");
    helpButton.style.borderColor = window.localStorage.getItem("color");
    window.localStorage.setItem("color", colorStr);

}

// This function creates a server request to get the saved color for the user. 
// Returns: a string in the format of a hex color "#XXXXXX" 
async function getColor() {
    let response = await fetch('/get/color/');
    let colorStr = await response.text();
    if(colorStr.startsWith("INVALID")){
        window.location.href = '/account/login.html';
        return;
    }
    window.localStorage.setItem("color", '#'+colorStr);
    return "#" + colorStr;

}

// DOM elements for channels
var modal = document.getElementById("channelModal");
var addButton = document.getElementById("addButton");
var span = document.getElementsByClassName("close")[0];
var confirmButton = document.getElementById("confirm"); // Allows confirm button to work
var channelList = document.getElementById("channelList");

// When the '+' button is clicked, the create channel popup appears 
addButton.onclick = function () {
    modal.style.display = "block";
}
// close popup, clear field
span.onclick = function () {
    var text = document.getElementById("channelName");
    if (text && text.value) {
        text.value = "";
    }
    modal.style.display = "none";
}

// when button to confirm channel creation is clicked
confirmButton.onclick = function () {
    var text = document.getElementById("channelName");
    if (text && text.value) {
        var newText = text.value;
        // clear fields and close popup
        text.value = ""
        modal.style.display = "none";
        // call create channel functions
        createChannelButton(newText);
        createChannel(newText);
    }
    // handle invalid input
    else {
        alert("Please enter a channel name")
        modal.style.display = "block";
    }

}
// when the window is clicked, close the popup
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// This function adds a channel button to the DOM on the left sidebar.
//Param: channelName, string for name of channel
function createChannelButton(channelName) {

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
    // create button DOM element
    var newChannelButton = document.createElement("button");
    newChannelButton.textContent = channelName;
    newChannelButton.className = "leftListItem";
    newChannelButton.id = channelName;
    var listItem = document.createElement("li");
    listItem.appendChild(newChannelButton);

    // when the button is clicked, load posts in channel 
    newChannelButton.onclick = function () {        
        displayChannel(channelName);

    }
    channelList.appendChild(listItem);
    saveChannel(channelName);
}

// This function is called when a user selects a channel from the left bar. 
// It calls functions to load the chats in the channel and allow users to
// add posts. 
function displayChannel(channelName){

    showChannelContent(channelName);
    let postButton = document.getElementById("sendPostButton");
    postButton.onclick = function() {createPost(channelName);};

}

// This function creates a channel. 
// It sends a request to the server to create a new channel object with one member and no posts. 
function createChannel(channelName){
    let p = fetch('/add/channel/'+channelName);
    p.then((r)=>{
        return r.text();
    }).then((text)=>{
        if(text.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        else if(!(text.startsWith("SUCCESS"))){
            alert("Failed to create channel");
        }
    });
}

function saveChannel(channelName) {
    var channels = JSON.parse(localStorage.getItem('channels')) || [];
    if (!channels.includes(channelName)) {
        channels.push(channelName);

        localStorage.setItem('channels', JSON.stringify(channels));
    }
}

// This function updates the local storage for channel names by requesting the list of channels 
// from the server. 
function updateLocalChannels() {
    let url = '/get/channels/';
    let p = fetch(url);
    p.then((r)=>{
        return r.json();
    }).then((j)=>{
        console.log(j);
        localStorage.setItem('channels',JSON.stringify(j));
    }).then(()=>{
        channelList.innerHTML = "";
        var channels = JSON.parse(localStorage.getItem('channels')) || [];
    
        channels.forEach(function (channel) {
            createChannelButton(channel);
        });
    }).then(()=>{
        loadChannels();
    })
}

// This function loads the channels from local storage into the html. 
function loadChannels() {
  
        channelList.innerHTML = "";
        var channels = JSON.parse(localStorage.getItem('channels')) || [];
    
        channels.forEach(function (channel) {
            createChannelButton(channel);
        });

}

// every minute, update the locally stored channels to ensure none have been added/deleted
setInterval(updateLocalChannels,1000*60);
// load channels from local storage when the page loads
window.onload = loadChannels();

// This function displays all the events in the events channel. 
// Creates a request to the server to get a list of all the event documents. 
function showEvents(){
    // TODO: implement this. 
    alert("events button clicked!");
}

//To show different chats depending on the channel --WORK IN PROGRESS--
//Param: channelName, a string with the name of the channel
function showChannelContent(channelName) {
    var channels = JSON.parse(localStorage.getItem('channels')) || [];

    var channelIndex = channels.indexOf(channelName);

    if(channelIndex != -1){
        displayChannelContent();
    }else{
        displayDefaultContent();
    }

}

// This function creates a server requests to get the posts in a channel. 
//Param: channelName, a string with the name of the channel
function displayChannelContent(channelName){
    let p = fetch('/get/posts/'+channelName);
    p.then((r)=>{
        return r.json();
    }).then((posts)=>{
        displayPosts(posts);
    });
}

// This function displays the posts in a channel. 
// Param: posts, a list of Post objects. 
function displayPosts(posts){
    let content = '';
    // TODO: implement this
    // Sort the posts by time stamp
    // Display them so that you can see the content and author and time stamp
    // List format in the dom?
}

function displayDefaultContent(){
    let content = getDefaultContent();
    document.getElementById('content').innerHTML = content;
}
function getDefaultChannelContent()
{
    return `
        <div class="defaultChannelContent">
            <h2>Default Content</h2>
            <!-- Your default content for other channels goes here -->
        </div>
    `;
}

//To potentially delete Channels ----Still In Progress ------
channelList.addEventListener('contextmenu', function (event) {
    event.preventDefault();


    var clickedChannelButton = event.target;

    if (clickedChannelButton.tagName === 'BUTTON') {
        var confirmDelete = window.confirm("Are you sure you want to leave this channel?");

        if (confirmDelete) {
            deleteChannel(clickedChannelButton.textContent);
        }
    }

});

function deleteChannel(channelName) {
    var channels = JSON.parse(localStorage.getItem('channels')) || [];

    // Remove the channel from the array
    var updatedChannels = channels.filter(function (channel) {
        return channel !== channelName;
    });

    // Update localStorage with the modified array
    localStorage.setItem('channels', JSON.stringify(updatedChannels));

    // Reload channels to reflect the changes
    updateLocalChannels();
}


// This function posts a text content message to a channel. 
// Creates a server request to create the post and add to channel.
// Param: channelId, string for the current channel's id to add the post to. 
function createPost(channelName) {
    const message = document.getElementById('message').value;
    let url = '/add/post/'+message+'/' + channelName;
    let p = fetch(url);
    p.then((r)=>{
        return r.text();
    }).then((text)=>{
        if(text.startsWith("INVALID")){
            window.location.href = "/account/login.html";
            return;
        }
        else if(!(text.startsWith("SUCCESS"))){
            alert("Failed to create post.");
        }
    });
}


/*----------------------------------- */


