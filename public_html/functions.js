/*
Claire Lodermeier, Audrey Hall, Joyce Dam
The purpose of this file is to implement client side functions for the main page of an online 
social media application. It creates server requests for fetching user information, 
channels, and display settings. Also uses local storage to load display settings faster.
*/

window.onloadstart = updateDisplay();
setInterval(setLocalColor, 100);

// This function calls several other functions to fetch display and channel info from the server, 
// update locally stored preferences, and display them in the dom. 
function updateDisplay(){
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
        for (var i = 0; i < bottomButton.length; i++){
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
    for (var i = 0; i < bottomButton.length; i++){
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
        if(text.startsWith("INVALID")){
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


    console.log("Event Name:" + event.value + " Date: " + date.value + " Event Time: " + 
    time.value);
    if ((event && event.value) && (date && date.value) && (time && time.value)&& (loc && loc.value)) {
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
        console.log("New Event details: ", newEvent, newDate, newTime)
        //createDate(newEvent, newDate, newLocation, newTime);
        //loadDates();
    }
    // handle invalid input
    else {
        alert("Please fill out all entries.");
        calendarModal.style.display = "block";
    }

}

function createEvent(eventName, eventDate, eventLoc, eventTime){

    /* if(isEventAlreadyExists(eventName))
    {
        return;
    } */
    while (document.getElementById(eventName)) {
        var userResponse = confirm("Event name already taken. Change the name?");
        if (userResponse) {
            // If the user wants to choose a different name, prompt again
            eventName = prompt("Enter a different event name:");
        } else {
            // If the user doesn't want to choose a different name, exit the loop
            return;
        }
    }
    let url = '/add/event/';
    let data = { title: eventName, date: eventDate, loc: eventLoc, time: eventTime };
    let p = fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    p.then((response)=>{
        return response.text();
    }).then((text)=>{
        if(text.startsWith("INVALID")){
            window.location.href = '/account/login.html';
            return;
        }
        else if(!(text.startsWith("SUCCESS"))){
            alert("Unable to add event");
            return;
        }
    });
}

// close calendar modal when user clicks out
window.onclick = function (event) {
    if (event.target == modal) {
        calendarModal.style.display = "none";
    }
}

/* function isEventAlreadyExists(event)
{
    var storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    return storedEvents.some(existingEvent => existingEvent.event === event);
} */

// ADD A COMMENT HERE
function createEventElement(title, date, time) {
    console.log('creating event element for ' + title);

    var newEvent = document.createElement("div");
    newEvent.textContent = "Event Title: " + title + " Date: " + date + " Time: " + time;

    newEvent.className = "eventContent";
    
    var listItem = document.createElement("li");
    listItem.appendChild(newEvent);

    document.getElementById("eventHolder").appendChild(listItem);
    saveEvent({title, date, time});

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
function createNewChannelButton(channelName){
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

// ADD A COMMENT HERE
function saveEvent(event) {

    var events = JSON.parse(localStorage.getItem('events')) || [];

    if (event && event.title && event.time && event.location && event.date) {
        events.push(event);
        window.localStorage.setItem('events', JSON.stringify(events));
    }
}

// This function gets channels from local storage and creates buttons to show them on the DOM.
function loadChannels() {
    channelList.innerHTML = getDefaultChannelList();
    if(window.localStorage.getItem('channels')==[]){
        return;
    }
    var channels = JSON.parse(window.localStorage.getItem('channels'))|| [];

    for (var i = 0; i < channels.length; i++) {
        createChannelButton(channels[i]);
    };
}
/* 
// ADD A COMMENT HERE
function loadDates() {
    eventList.innerHTML = "";
    var storedEvents = window.localStorage.getItem("events");
    console.log("Stored events:", storedEvents);

    if(storedEvents == null)
    {
        storedEvents = "[]"
    }
    var dates = JSON.parse(storedEvents)|| [];

    for(var i = 0; i < dates.length; i++)
    {
        createDate(dates[i].event, dates[i].date, dates[i].time);

    }


}
 */

window.onload = function()
{
    window.onload = loadChannels();

    //window.onload = loadDates(); 
};



// ADD A COMMENT HERE
function showEvents() {
    console.log("showing events...");
    // update the locally stored list of events
    updateLocalEvents();
    // TODO: implement this. 
    window.localStorage.setItem("currentChannel", 'events');

    var eventListContainer = document.getElementById('eventListContainer');
    eventListContainer.style.display = 'block';

    var channelContentContainer = document.getElementById('channelContentContainer');
    channelContentContainer.style.display = 'none';

    var channelContainers = document.getElementById('channelTitle');
    channelContainers.style.display = 'none';

    // Show the post list and hide the channel content
    channelContentContainer.innerHTML = '';
    eventListContainer.innerHTML = getEventContent();

    if(window.localStorage.getItem('events')==[]){
        console.log("no events to show");
        return;
    }
    var events = JSON.parse(localStorage.getItem('events')) || [];
    for (let i=0;i<events.length;i++){
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
    if(window.localStorage.getItem("currentChannel")=='events'){
        showEvents();
        return;
    }
    console.log("loading posts ... ");
    if(window.localStorage.getItem("currentChannel")!=null){
        displayChannelContent(window.localStorage.getItem("currentChannel"));
    }
}

// load posts every 15 seconds
setInterval(loadPosts, 15000);


// This function displays the posts in a channel in the dom. 
// Param: channelName, a string for the name of the channel.
function displayChannelContent(channelName) {
    const channelContentContainer = document.getElementById('channelContentContainer');

    if(channelName=='null'){
        channelContentContainer.innerHTML = '';
        return;
    }

    var eventListContainer = document.getElementById('eventListContainer');
    eventListContainer.style.display = 'none';

    channelContentContainer.style.display = 'block';

    var channelContainers = document.getElementById('channelTitle');
    channelContainers.style.display = 'block';

    // Show the post list and hide the channel content
    eventListContainer.innerHTML = '';
    channelContentContainer.innerHTML = getDefaultChannelList();


    var eventListContainer = document.getElementById('eventListContainer');
    var titleElement = document.getElementById("channelTitle");
    titleElement.innerHTML = '';

    // Hide the post list and show the channel content
    eventListContainer.style.display = 'none';
    channelContentContainer.style.display = 'block';

    let p = fetch('/posts/' + channelName);
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
        <h3 class='banner'>Upcoming Events</h3>
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
/* 
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

});  */

// This function updates the local storage for events by requesting the list of events 
// from the server. 
function updateLocalEvents() {
    console.log("Updating local events from the server...");

    let url = '/events/';
    let p = fetch(url);
    p.then((r) => {
        return r.json();
    }).then((j) => {
       //var sortedEvents = j.sort((a, b) => a.date - b.date);
        window.localStorage.setItem('events', JSON.stringify(j));
        console.log("Locally stored events : " + window.localStorage.getItem('events'));
    //}).then(() => {
        // channelList.innerHTML = "";
        // var channels = JSON.parse(window.localStorage.getItem('channels')) || [];
        // for (var i = 0; i < channels.length; i++) {
        //     createChannelButton(channels[i].name);
        // }
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

/*----------------------------------- */
