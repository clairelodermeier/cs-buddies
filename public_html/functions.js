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

window.onload = updateLocalChannels();


// This function updates display settings including mode and color from locally stored items. 
function setLocalDisplay() {
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
    let colorStr = await getColor();
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
//Add Channel
var modal = document.getElementById("channelModal");
var button = document.getElementById("addButton");
var span = document.getElementsByClassName("close")[0];
var confirmButton = document.getElementById("confirm"); // Allows confirm button to work
var channelList = document.getElementById("channelList");

button.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    var text = document.getElementById("channelName");
    if (text && text.value) {
        text.value = "";
    }
    modal.style.display = "none";
}

confirmButton.onclick = function () {
    var text = document.getElementById("channelName");
    if (text && text.value) {
        var newText = text.value;
        text.value = ""
        modal.style.display = "none";
        createChannelButton(newText);
        createChannel(newText);

    }
    else {
        alert("Please enter a channel name")
        modal.style.display = "block";
    }

}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//Calendar
var calendarModal = document.getElementById("calendarModal");
var buttonCalendar = document.getElementById("calendar");
var spanCalendar = document.getElementsByClassName("closeCalendar")[0];
var confirmCalendarButton = document.getElementById("confirmCalendar");
var eventList = document.getElementById("eventList")

buttonCalendar.onclick = function () {
    calendarModal.style.display = "block";
}

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
    else {
        alert("Please fill out all entries.");
        calendarModal.style.display = "block";
    }


}

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

    if(channelName == null){
        return;
    }

    var newChannelButton = document.createElement("button");
    newChannelButton.textContent = channelName;
    newChannelButton.className = "leftListItem";
    newChannelButton.id = channelName;

    var listItem = document.createElement("li");
    listItem.appendChild(newChannelButton);


    newChannelButton.onclick = function () {
        window.localStorage.setItem("currentChannel", channelName);

        var channels = JSON.parse(localStorage.getItem('channels')) || [];
        console.log("List of channels:", channels);
        console.log("Channel length: ", channels.length);
        displayChannelContent(channelName);

    };

    channelList.appendChild(listItem);
    saveChannel(channelName);

}

function saveChannel(channelName) {
    var channels = JSON.parse(localStorage.getItem('channels')) || [];
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


function loadChannels() {
    channelList.innerHTML = getDefaultChannelList();
    var channels = JSON.parse(window.localStorage.getItem('channels')) || [];

    for(var i=0;i<channels.length;i++){
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

//To show different chats depending on the channel --WORK IN PROGRESS--
function showChannelContent(channelName) {
    var postListContainer = document.getElementById('postListContainer');
    var channelContentContainer = document.getElementById('channelContentContainer');

    // Hide the post list and show the channel content
    postListContainer.style.display = 'none';
    channelContentContainer.innerHTML = getChannelContent(channelName);
    channelContentContainer.style.display = 'block';

}

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
function createChannel(channelName) {
    console.log("creating channel "+ channelName);
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


function displayChannelContent(channelName) {
    const channelContentContainer = document.getElementById('channelContentContainer');
    var postListContainer = document.getElementById('postListContainer');

    // Hide the post list and show the channel content
    postListContainer.style.display = 'none';
    channelContentContainer.style.display = 'block';

    let p = fetch('/get/posts/' + channelName);
    p.then((r) => {
        return r.json();
    }).then((posts) => {
        posts.sort((a, b) => a.time - b.time);

        displayPosts(posts);
        let postingDiv = document.createElement('div');
        postingDiv.innerHTML = getPostingDiv();

        channelContentContainer.appendChild(postingDiv);
    });
}

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

// This function displays the posts in a channel. 
// Param: posts, a list of Post objects. 
function displayPosts(posts) {
    channelContentContainer.innerHTML = '';
    for (var i = 0; i < posts.length; i++) {
        var newPostElement = document.createElement("div");
        newPostElement.textContent = posts[i].content;
        newPostElement.className = "displayContent";

        var listItem = document.createElement("li");
        listItem.appendChild(newPostElement);
        channelContentContainer.appendChild(listItem);
    }



}



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
        console.log(j);
        window.localStorage.setItem('channels', JSON.stringify(j));
    }).then(() => {
        channelList.innerHTML = "";
        var channels = JSON.parse(window.localStorage.getItem('channels')) || [];
        for (var i = 0; i < channels.length; i++) {
            createChannelButton(channels[i].name);
        }
        // channels.forEach(function (channel) {
        //     createChannelButton(channel);
        // });
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
