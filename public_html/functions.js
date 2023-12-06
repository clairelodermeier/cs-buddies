/*
Claire Lodermeier, Audrey Hall, Joyce Dam
The purpose of this file is to implement client side functions for the main page of an online 
social media application. It creates server requests for fetching user information, 
channels, events, and settings. Also uses local storage to load display elements faster.
*/

window.onloadstart = updateDisplay();
setInterval(setLocalColor, 100);

// This function calls several other functions to fetch display and channel info from the server, 
// update locally stored preferences, and display them in the dom. 
function updateDisplay() {
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
function updateColor() {
    let colorStr = getColor();
    let bottomButton = document.getElementsByClassName("bottomButton");
    document.getElementById("mainHeader").style.backgroundColor = colorStr;
    let helpButton = document.getElementById("helpButton");
    helpButton.style.color = window.localStorage.getItem(colorStr);
    helpButton.style.borderColor = window.localStorage.getItem(colorStr);
    for (var i = 0; i < bottomButton.length; i++) {
        bottomButton[i].style.color = window.localStorage.getItem(colorStr);
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
        if (text.startsWith("INVALID")) {
            window.location.href = '/account/login.html';
            return;
        }
        window.localStorage.setItem("color", "#" + text);
    });
    return window.localStorage.getItem("color");
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
        createNewChannelButton(newText);
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
var eventHolder = document.getElementById("eventHolder")

// display calendar modal when calendar button is clicked
buttonCalendar.onclick = function () {
    calendarModal.style.display = "block";
}

// close calendar modal
spanCalendar.onclick = function () {
    var event = document.getElementById("eventName");
    var date = document.getElementById("calendar");
    var time = document.getElementById("time");
    var loc = document.getElementById("location");

    if ((event && event.value) && (date && date.vaue) && (time && time.value)) {
        event.value = "";
        date.value = "";
        time.value = "";
        loc.value = "";

    }
    calendarModal.style.display = "none";
}

// create calendar event when confirm button is clicked
confirmCalendarButton.onclick = function () {

    var event = document.getElementById("eventName");
    var date = document.getElementById("date");
    var time = document.getElementById("eventTime");
    var loc = document.getElementById("location");

    if ((event && event.value) && (date && date.value) && (time && time.value) && (loc && loc.value)) {
        var newEvent = event.value;
        var newDate = date.value;
        var newTime = time.value;
        var newLocation = loc.value;

        // create event in the server
        createEvent(newEvent, newDate, newLocation, newTime);

        event.value = "";
        date.value = "";
        time.value = "";
        loc.value = "";

        calendarModal.style.display = "none";
        console.log("New Event details: ", newEvent, newDate, newTime);
        showEvents();

    }
    // handle invalid input
    else {
        alert("Please fill out all entries.");
        calendarModal.style.display = "block";
    }
}

// This function creates a new event object. 
// It makes a post request to the server to create the Event document. 
function createEvent(eventName, eventDate, eventLoc, eventTime) {
    let url = '/add/event/';
    let data = { title: eventName, date: eventDate, loc: eventLoc, time: eventTime };
    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    });
    p.then((response) => {
        return response.text();
    }).then((text) => {
        if (text.startsWith("INVALID")) {
            window.location.href = '/account/login.html';
            return;
        }
        else if (!(text.startsWith("SUCCESS"))) {
            alert("Unable to add event");
            return;
        }
        else {
            // load posts at the end
            loadPosts();
        }
    });
}

// close calendar modal when user clicks out
window.onclick = function (event) {
    if (event.target == modal) {
        calendarModal.style.display = "none";
    }
}

// This function creates an element in the DOM for an event to be displayed. 
// It creates and nests divs to represent the event details
// Param: title, a string for event title; date, a string for event date;
//      location: a string for event location; time: a string for event time
function createEventElement(title, date, location, time) {
    console.log('creating event element for ' + title);

    // create divs for parts of the event display
    var eventTitleElement = document.createElement("div");
    eventTitleElement.innerText = title;
    eventTitleElement.className = "eventTitle";

    var eventTimeElement = document.createElement("div");
    eventTimeElement.innerText = time;
    eventTimeElement.className = "eventTime";

    var eventDateElement = document.createElement("div");
    eventDateElement.innerText = date;
    eventDateElement.className = "eventDate";

    var eventLocationElement = document.createElement("div");
    eventLocationElement.innerText = location;
    eventLocationElement.className = "eventLocation";

    // add all fields to a main event content div, nest it under a list item
    var newEvent = document.createElement("li");
    newEvent.className = "eventContent";
    newEvent.appendChild(eventTitleElement);
    newEvent.appendChild(eventDateElement);
    newEvent.appendChild(eventTimeElement);
    newEvent.appendChild(eventLocationElement);

    document.getElementById("eventHolder").appendChild(newEvent);
    saveEvent({ title, date, time });
}

// This function handles duplicate channel names by asking user to choose a new name.
// Param: channelName, a string for the initial name chosen.
// Returns channelName, a new string for the validated name, or null
function validateChannelName(channelName) {
    if (channelName == null) {
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
function createNewChannelButton(channelName) {
    channelName = validateChannelName(channelName);
    // Does not create a channel if no name is entered
    createChannelButton(channelName);
}

// This function creates a button in the DOM on the left bar.
// Param: channelName, a string for the name of the channel
function createChannelButton(channelName) {
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
        //(localStorage.getItem('channels')) || [];
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

// This function saves an event locally. 
// Param: event, an event object
function saveEvent(event) {

    var events = JSON.parse(localStorage.getItem('events')) || [];

    if (event && event.title && event.time && event.location && event.date) {
        events.push(event);
        window.localStorage.setItem('events', JSON.stringify(events));
    }
}

// This function gets channels from local storage and creates buttons to show them on the DOM.
function loadChannels() {
    window.localStorage.setItem("currentChannel", null);
    channelList.innerHTML = getDefaultChannelList();
    if (window.localStorage.getItem('channels') == []) {
        return;
    }
    var channels = JSON.parse(window.localStorage.getItem('channels')) || [];
    for (var i = 0; i < channels.length; i++) {
        createChannelButton(channels[i]);
    };
}

// when the window loads, load the channels and the events
window.onload = function () {
    loadChannels();
    updateLocalEvents();
};

// This function displays locally stored events in the dom. It first calls functions to 
// update the local storage, then calls a function to create the dom elements. 
function showEvents() {
    // update the locally stored list of events
    updateLocalEvents();
    window.localStorage.setItem("currentChannel", 'events');

    // dom elements
    var eventListContainer = document.getElementById('eventListContainer');
    eventListContainer.style.display = 'block';
    var channelContentContainer = document.getElementById('channelContentContainer');
    channelContentContainer.style.display = 'none';
    var channelContainers = document.getElementById('channelTitle');
    channelContainers.style.display = 'none';

    // Show the post list and hide the channel content
    channelContentContainer.innerHTML = '';
    eventListContainer.innerHTML = getEventContent();

    // iterate through locally stored events and create dom elements
    if (window.localStorage.getItem('events') == []) {
        console.log("no events to show");
        return;
    }
    var events = JSON.parse(localStorage.getItem('events')) || [];
    for (let i = 0; i < events.length; i++) {
        console.log("showing event " + i + '...');
        createEventElement(events[i].title, events[i].date, events[i].location, events[i].time);
    }
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

// This function loads posts in a the current channel. 
function loadPosts() {
    console.log("current channel is " + window.localStorage.getItem("currentChannel"));
    if (window.localStorage.getItem("currentChannel") == 'events') {
        showEvents();
        return;
    }
    console.log("loading posts ... ");
    if (window.localStorage.getItem("currentChannel") != null) {
        displayChannelContent(window.localStorage.getItem("currentChannel"));
    }
}

// load posts every 15 seconds
setInterval(loadPosts, 15000);

// This function displays the posts in a channel in the dom via server request. 
// Param: channelName, a string for the name of the channel.
function displayChannelContent(channelName) {
    const channelContentContainer = document.getElementById('channelContentContainer');
    if (channelName == 'null') {
        channelContentContainer.innerHTML = '';
        return;
    }
    var eventListContainer = document.getElementById('eventListContainer');
    eventListContainer.style.display = 'none';
    channelContentContainer.style.display = 'block';
    var channelContainers = document.getElementById('channelTitle');
    channelContainers.style.display = 'block';

    eventListContainer.innerHTML = '';
    var titleElement = document.getElementById("channelTitle");
    titleElement.innerHTML = '';

    let p = fetch('/posts/' + channelName);
    p.then((r) => {
        return r.json();
    }).then((posts) => {
        // sort posts chronologically and display in the dom
        posts.sort((a, b) => a.time - b.time);
        displayChannelTitle();
        displayPosts(posts);
        let postingDiv = document.createElement('div');
        postingDiv.innerHTML = getPostingDiv();
        channelContentContainer.appendChild(postingDiv);
    });
}

// This function displays a banner with the title of the channel. 
function displayChannelTitle() {
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
function createPostElement(content, author) {
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
    listItem.className = 'post';
    listItem.appendChild(postElement);
    channelContentContainer.appendChild(listItem);

}

// This function gets the html for the default content of the events channel.
// Returns: an html string
function getEventContent() {
    return `
    <div>
        <h3 class='banner'>Events</h3>
        <ul id="eventHolder">
        
        </ul>
    </div>
    `;
}

// This function gets the html for the default channel list html.
// Returns: an html string with a button element inside a list item tag
function getDefaultChannelList() {
    return `    
    <li>
    <button class="leftListItem" id="eventButton" onclick="showEvents()">Events</button>

    </li>
    `;

}

// This function updates the local storage for events by requesting the list of events 
// from the server. 
function updateLocalEvents() {
    console.log("Updating local events from the server...");

    let url = '/events/';
    let p = fetch(url);
    p.then((r) => {
        return r.json();
    }).then((j) => {
        window.localStorage.setItem('events', JSON.stringify(j));
    });
}

// This function updates the local storage for channel names by requesting the list of channels 
// from the server. 
function updateLocalChannels() {
    window.localStorage.setItem('channels', []);

    let url = '/channels/';
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
    });
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
// Param: content, a string with the text content of the post
function addPostToList(content) {
    // Create a new list item for the post

    var postElement = document.createElement("div");
    postElement.className = "postContent";

    // create spans for text and author with classes
    var contentElement = document.createElement("span");
    contentElement.innerText = content;
    //var authorElement = document.createElement("span");
    //authorElement.innerText = author;
    contentElement.className = "postContent";
    //authorElement.className = "authorContent";

    // create a list item element and append the post
    postElement.appendChild(contentElement);
    //postElement.appendChild(authorElement);
    var listItem = document.createElement("li");
    listItem.appendChild(postElement);
    channelContentContainer.appendChild(listItem);
}
