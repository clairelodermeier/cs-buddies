window.onloadstart = mode();
window.onloadstart = updateColor();
window.onloadstart = displayIcon();
window.onloadstart = setLocalDisplay();

function setLocalDisplay(){
    setLocalMode();
    setLocalColor();
}

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

function setLocalColor() {
    let headerElement = document.getElementById("mainHeader");
    if (window.localStorage.getItem("color")!=null){
        headerElement.style.backgroundColor = window.localStorage.getItem("color");
    }
}

function displayIcon() {
    let iconHolder = document.getElementById("icon");
    let p = fetch("/get/imageID/");
    p.then((response) => {
        return response.text();
    }).then((text) => {
        window.localStorage.setItem("pic", "/get/profilePic/" + text);
        iconHolder.src = "/get/profilePic/" + text;
    });

}

// display dark or light mode
function mode() {
    let url = '/get/mode/';
    let p = fetch(url);
    p.then((r) => {
        return r.text();
    }).then((text) => {
        if (text.startsWith("light")) {
            window.localStorage.setItem("mode", "light");
            document.getElementById("cssLink").href = "css/style.css";
        }
        else {
            window.localStorage.setItem("mode", "dark");
            document.getElementById("cssLink").href = "css/darkStyle.css";
        }
    });
}


async function updateColor() {
    let colorStr = await getColor();
    document.getElementById("mainHeader").style.backgroundColor = colorStr;
    window.localStorage.setItem("color", colorStr);

}
async function getColor() {
    let response = await fetch('/get/color/');
    let colorStr = await response.text();
    window.localStorage.setItem("color", '#'+colorStr);
    return "#" + colorStr;

}

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



    var newChannelButton = document.createElement("button");
    newChannelButton.textContent = channelName;
    newChannelButton.className = "leftListItem";
    newChannelButton.id = channelName;

    var listItem = document.createElement("li");
    listItem.appendChild(newChannelButton);


    newChannelButton.onclick = function () {
        alert("Button: " + channelName + " got clicked!");

        var channels = JSON.parse(localStorage.getItem('channels')) || [];
        console.log("List of channels:", channels);

    }


    channelList.appendChild(listItem);
    saveChannel(channelName);

}

function saveChannel(channelName) {
    var channels = JSON.parse(localStorage.getItem('channels')) || [];
    if (!channels.includes(channelName)) {
        channels.push(channelName);

        localStorage.setItem('channels', JSON.stringify(channels));
    }
}

function loadChannels() {
    channelList.innerHTML = "";
    var channels = JSON.parse(localStorage.getItem('channels')) || [];

    channels.forEach(function (channel) {
        createChannelButton(channel);
    });
}


window.onload = loadChannels();

//To show different chats depending on the channel --WORK IN PROGRESS--
function showChannelContent(channelName) {
    var content = "";

    switch (channelName) {
        case 'channel1':
            content = test();
            break;
        default:
            content = "Default content";
    }

    document.getElementById('content').innerHTML = content;

}

function test() {
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


//To potentially delete Channels ----Still In Progress ------
channelList.addEventListener('contextmenu', function (event) {
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
    var updatedChannels = channels.filter(function (channel) {
        return channel !== channelName;
    });

    // Update localStorage with the modified array
    localStorage.setItem('channels', JSON.stringify(updatedChannels));

    // Reload channels to reflect the changes
    loadChannels();
}


/*----------------------------------- */








