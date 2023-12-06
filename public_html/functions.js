/*
Claire Lodermeier
The purpose of this file is to implement client side functions for the main page of an online 
social media application. It creates server requests for fetching user information, 
channels, and display settings. Also uses local storage to load display settings faster.
*/

window.onloadstart = updateDisplay();

// This function calls several other functions to fetch display and channel info from the server, 
// update locally stored preferences, and display them in the dom. 
function updateDisplay(){
    setLocalColor();
    mode();
    updateColor();
    displayIcon();
    setLocalMode();
    setLocalColor();
    updateLocalChannels();
}

// This function sets the mode (dark/light) using the mode item stored locally. 
// Switches to the correct css file by updating the href of the link tag in the DOM
function setLocalMode() {
    let currentMode = window.localStorage.getItem('mode');
    if (currentMode == 'light') {
        window.localStorage.setItem("mode", "light");
        document.getElementById("cssLink").href = "css/style.css";
    } else if (currentMode == 'dark') {
        window.localStorage.setItem("mode", "dark");
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
        for (var i = 0; i < bottomButton.length; i++) {
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
        if (text.startsWith("INVALID")) {
            window.location.href = '/account/login.html';
            return;
        }
        else {
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
        if (text.startsWith("INVALID")) {
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
async function updateColor() {
    let colorStr = getColor();
    let helpButton = document.getElementById("helpButton");
    let bottomButton = document.getElementsByClassName("bottomButton");
    document.getElementById("mainHeader").style.backgroundColor = colorStr;
    helpButton.style.color = window.localStorage.getItem("color");
    helpButton.style.borderColor = window.localStorage.getItem("color");
    for (var i = 0; i < bottomButton.length; i++) {
        bottomButton[i].style.color = window.localStorage.getItem("color");
    }
    window.localStorage.setItem("color", colorStr);
}

// This function creates a server request to get the saved color for the user. 
// Returns: a string in the format of a hex color "#XXXXXX" 
async function getColor() {
    let response = await fetch('/get/color/');
    let colorStr = await response.text();
    if (colorStr.startsWith("INVALID")) {
        window.location.href = '/account/login.html';
        return;
    }
    window.localStorage.setItem("color", '#' + colorStr);
    return "#" + colorStr;
}

// DOM elements for adding a channel
var modal = document.getElementById("channelModal");
var addButton = document.getElementById("addButton");
var span = document.getElementsByClassName("close")[0];
var confirmButton = document.getElementById("confirm"); 
var channelList = document.getElementById("channelList");

// display channel modal when add button is clicked
addButton.onclick = function () {
    modal.style.display = "block";
}

// close the channel modal when the close button is clicked
span.onclick = function () {
    var text = document.getElementById("channelName");
    if (text && text.value) {
        text.value = "";
    }
    modal.style.display = "none";
}

// create channel and button when confirm button is clicked
confirmButton.onclick = function () {
    var text = document.getElementById("channelName");
    if (text && text.value) {
        var newText = text.value;
        text.value = ""
        modal.style.display = "none";
        createChannelButton(newText);
        createChannel(newText);

    }
    // handle invalid input
    else {
        alert("Please enter a channel name")
        modal.style.display = "block";
    }

}

// close the modal when user clicks out
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// calendar DOM elements
var calendarModal = document.getElementById("calendarModal");
var buttonCalendar = document.getElementById("calendar");
var spanCalendar = document.getElementsByClassName("closeCalendar")[0];
var confirmCalendarButton = document.getElementById("confirmCalendar");
var eventList = document.getElementById("eventList")

// display calendar modal when calendar button is clicked
buttonCalendar.onclick = function () {
    calendarModal.style.display = "block";
}

// close calendar modal
spanCalendar.onclick = function () {
    var event = document.getElementById("eventName");
    var date = document.getElementById("calendar");
    var time = document.getElementById("time");
    if ((event && event.value) && (date && date.vaue) && (time && time.value)) {
        event.value = "";
        date.value = "";
        time.value = "";
    }
    calendarModal.style.display = "none";
}

// create calendar event when confirm button is clicked
confirmCalendarButton.onclick = function () {
    var event = document.getElementById("eventName");
    var date = document.getElementById("date");
    var time = document.getElementById("eventTime");

    console.log("Event Name:" + event.value + " Date: " + date.value + " Event Time: " + time.value);
    if ((event && event.value) && (date && date.value) && (time && time.value)) {
        var newEvent = event.value;
        var newDate = date.value;
        var newTime = time.value;

        event.value = "";
        date.value = "";
        time.value = "";
        calendarModal.style.display = "none";
        createDate(newEvent, newDate, newTime);
    }
    // handle invalid input
    else {
        alert("Please fill out all entries.");
        calendarModal.style.display = "block";
    }

}

// close calendar modal when user clicks out
window.onclick = function (event) {
    if (event.target == modal) {
        calendarModal.style.display = "none";
    }
}

function createDate(event, date, time) {

    while (document.getElementById(event)) {
        var userResponse = confirm("Event name is already taken. Would you like to change the name?");
        if (userResponse) {
            // If the user wants to choose a different name, prompt again
            event = prompt("Enter a different event name:");
        } else {
            // If the user doesn't want to choose a different name, exit the loop
            return;
        }
    }

    var newEvent = document.createElement("p");
    newEvent.textContent = "Event Name: " + event + " Date: " + date + " Time: " + time;
    newEvent.date = date;
    newEvent.time = time;

    newEvent.className = "rightBar";
    newEvent.id = event;


    var listItem = document.createElement("li");
    listItem.appendChild(newEvent);

    eventList.appendChild(listItem);
    saveDate(event);


}

// This function handles duplicate channel names by asking user to choose a new name.
// Param: channelName, a string for the initial name chosen.
// Returns channelName, a new string for the validated name, or null
function validateChannelName(channelName){
    if(channelName==null){
        return null;
    }
    while (document.getElementById(channelName)) {
        var userResponse = confirm("Channel name already taken. Choose a different name?");
        if (userResponse) {
            // If the user wants to choose a different name, prompt again
            channelName = prompt("Enter a different channel name:");
        } else {
            // If the user doesn't want to choose a different name, exit the loop
            return null;
        }
    }
    return channelName;
}

// This function creates a button in the DOM on the left bar when a new channel is added.
// Param: channelName, a string for the name of the channel
function createChannelButton(channelName) {
    channelName = validateChannelName(channelName);
    // Does not create a channel if no name is entered
    if (channelName == null) {
        return;
    }
    // create DOM elements for channel button to be displayed
    var newChannelButton = document.createElement("button");
    newChannelButton.textContent = channelName;
    newChannelButton.className = "leftListItem";
    newChannelButton.id = channelName;
    var listItem = document.createElement("li");
    listItem.appendChild(newChannelButton);

    // when a user clicks the new button, content is displayed
    newChannelButton.onclick = function () {
        var titleElement = document.getElementById("channelTitle");
        titleElement.innerHTML = '';
        window.localStorage.setItem("currentChannel", channelName);
        var channels = JSON.parse(localStorage.getItem('channels')) || [];
        console.log("List of channels:", channels);
        console.log("Channel length: ", channels.length);
        displayChannelContent(channelName);
    };

    // display in the dom and save channel locally
    channelList.appendChild(listItem);
    saveChannel(channelName);
}

// This function saves a channel to local storage. 
// Param: channelName, a string for the name of the channel
function saveChannel(channelName) {
    var channels = JSON.parse(window.localStorage.getItem('channels')) || [];
    if (!channels.includes(channelName)) {
        channels.push(channelName);
        window.localStorage.setItem('channels', JSON.stringify(channels));
    }
}

function saveDate(date) {
    var events = JSON.parse(localStorage.getItem('events')) || [];
    if (!events.includes(date)) {
        events.push(date);
        window.localStorage.setItem('events', JSON.stringify(events));
    }
}

// This function gets channels from local storage and creates buttons to show them on the DOM.
function loadChannels() {
    channelList.innerHTML = getDefaultChannelList();
    var channels = JSON.parse(window.localStorage.getItem('channels')) || [];

    for (var i = 0; i < channels.length; i++) {
        createChannelButton(channels[i]);
    };
}

function loadDates() {
    eventList.innerHTML = "";
    var dates = JSON.parse(localStorage.getItem('events')) || [];

    dates.forEach(function (event, date, time) {
        createDate(event, date, time);
    });

}

window.onload = loadChannels();
//window.onload = loadDates(); This also breaks right clicking


function showEvents() {
    // TODO: implement this. 
    alert("events button clicked!");

    var postListContainer = document.getElementById('postListContainer');
    var channelContentContainer = document.getElementById('channelContentContainer');

    // Show the post list and hide the channel content
    channelContentContainer.style.display = 'none';
    postListContainer.innerHTML = getEventContent();
    postListContainer.style.display = 'block';


}


// This function creates a channel. 
// It sends a request to the server to create a new channel object with one member and no posts. 
// Param: channelName, a string for the name of the channel. 
function createChannel(channelName) {
    console.log("creating channel " + channelName);
    let p = fetch('/add/channel/' + channelName);
    p.then((r) => {
        return r.text();
    }).then((text) => {
        if (text.startsWith("INVALID")) {
            window.location.href = '/account/login.html';
            return;
        }
        else if (!(text.startsWith("SUCCESS"))) {
            alert("Failed to create channel");
        }
    });
}

// This function displays the posts in a channel in the dom. 
// Param: channelName, a string for the name of the channel.
function displayChannelContent(channelName) {
    const channelContentContainer = document.getElementById('channelContentContainer');
    var postListContainer = document.getElementById('postListContainer');
    var titleElement = document.getElementById("channelTitle");
    titleElement.innerHTML = '';

    // Hide the post list and show the channel content
    postListContainer.style.display = 'none';
    channelContentContainer.style.display = 'block';

    let p = fetch('/get/posts/' + channelName);
    p.then((r) => {
        return r.json();
    }).then((posts) => {
        posts.sort((a, b) => a.time - b.time);

        displayChannelTitle();
        displayPosts(posts);
        let postingDiv = document.createElement('div');
        postingDiv.innerHTML = getPostingDiv();

        channelContentContainer.appendChild(postingDiv);
    });
}

// This function displays a banner with the title of the channel. 
function displayChannelTitle(){
    var titleElement = document.getElementById("channelTitle");
    titleElement.innerHTML = '';

    var titleBanner = document.createElement('h3');
    titleBanner.className = 'banner';
    titleBanner.innerText = window.localStorage.getItem("currentChannel");

    titleElement.appendChild(titleBanner);

}

// This function gets the html for the post message elements at the bottom of a channel.
// Returns: an html string with 2 divs
function getPostingDiv() {
    return `    
    <div class="messageBox">
        <label for="message">Post</label>
        <input type="text" id="message">
    </div>
    <div class="controlElement">
        <button id = 'sendPostButton' onclick = "createPost()">Send post</button>
    </div>`;
}

// This function displays the posts in a channel by creating dom elements.
// Param: posts, a list of Post objects. 
function displayPosts(posts) {

    channelContentContainer.innerHTML = '';
    for (var i = 0; i < posts.length; i++) {
        createPostElement(posts[i].content, posts[i].author);
    }

}

// This function creates a post in the dom which displays the content and the author. 
// Param: content, string for text in the post, author, string for name of posting user. 
function createPostElement(content, author){
    // create a post div
    var postElement = document.createElement("div");
    postElement.className = "postContent";

    // create spans for text and author with classes
    var contentElement = document.createElement("span");
    contentElement.innerText = content;
    var authorElement = document.createElement("span");
    authorElement.innerText = author;
    contentElement.className = "postContent";
    authorElement.className = "authorContent";

    // create a list item element and append the post
    postElement.appendChild(contentElement);
    postElement.appendChild(authorElement);
    var listItem = document.createElement("li");
    listItem.appendChild(postElement);
    channelContentContainer.appendChild(listItem);

}

// This function gets the html for the default content of the events channel.
// Returns: an html string
function getEventContent() {
    return `
    <div class="events">
        <h3 class = 'banner' >Upcoming Events</h3>
        <div class="eventList>

            <p>Event Holder</p>
        </div>


    </div>
    `;
}

// This function gets the html for the default channel list html.
// Returns: an html string with a button element inside a list item tag
function getDefaultChannelList() {
    return `    
    <li>
    <button class="leftListItem" id="eventList" onclick="showEvents()">Events</button>

    </li>
    `;

}

//To potentially delete Channels ----Still In Progress ------
// Attach the event listener after the DOM is fully loaded
channelList.addEventListener('contextmenu', function (event) {
    event.preventDefault();

    var clickedChannelButton = event.target;

    if (clickedChannelButton.tagName === 'BUTTON') {


        var confirmDelete = window.confirm("Are you sure you want to leave this channel?");

        if (confirmDelete) {
            console.log("Deleting channel:", clickedChannelButton.textContent);
            deleteChannel(clickedChannelButton.textContent);
        }
    }

});

// This function updates the local storage for channel names by requesting the list of channels 
// from the server. 
function updateLocalChannels() {
    window.localStorage.setItem('channels', []);

    let url = '/get/channels/';
    let p = fetch(url);
    p.then((r) => {
        return r.json();
    }).then((j) => {
       var sortedChannels = j.sort((a, b) => a.name - b.name);
        window.localStorage.setItem('channels', JSON.stringify(sortedChannels));
    }).then(() => {
        channelList.innerHTML = "";
        var channels = JSON.parse(window.localStorage.getItem('channels')) || [];
        for (var i = 0; i < channels.length; i++) {
            createChannelButton(channels[i].name);
        }
    
    }).then(() => {
        loadChannels();
    })
}

function deleteChannel(channelName) {
    var channels = JSON.parse(window.localStorage.getItem('channels')) || [];

    // Remove the channel from the array
    var updatedChannels = channels.filter(function (channel) {
        return channel !== channelName;
    });

    // Update localStorage with the modified array
    window.localStorage.setItem('channels', JSON.stringify(updatedChannels));

    // Reload channels to reflect the changes
    loadChannels();
}


// This function posts a text content message to a channel. 
// Creates a server request to create the post and add to channel.
// Param: channelId, string for the current channel's id to add the post to. 
function createPost() {
    const channelName = (window.localStorage.getItem('currentChannel'));
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    if (message.trim() !== '') {
        // Add the new post to the list
        addPostToList(message);
        console.log('adding post ' + message);
        // Additional logic to send the post to the server if needed
        // ...
        let url = '/add/post/' + message + '/' + channelName;
        let p = fetch(url);
        p.then((r) => {
            return r.text();
        }).then((text) => {
            if (text.startsWith("INVALID")) {
                window.location.href = "/account/login.html";
                return;
            }
            else if (!(text.startsWith("SUCCESS"))) {
                alert("Failed to create post.");
            }
        });

        // Clear the message input after posting
        messageInput.value = '';
    } else {
        alert('Please enter a post message.');
    }
}

// This function adds a new post to the list of posts in the dom. 
// Param: message, a string with the text content of the post
function addPostToList(message) {
    // Create a new list item for the post
    const postItem = document.createElement('li');
    postItem.textContent = message;

    // Get the post list element
    const postList = document.getElementById('channelContentContainer');

    // Add the new post item to the list
    postList.appendChild(postItem);
}

/*----------------------------------- */
