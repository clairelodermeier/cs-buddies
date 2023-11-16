
// add style to display
function addStyleSheet(sheetName) {
        document.getElementById('cssFile').href = sheetName;
}


//To display different settings depending on the button
function showContent(type)
{
    fetch("./settings.html")
    .then(response => response.text())
    .then(data => {
        switch(type)
        {
            case 'editProfile':
                document.getElementById('profileContent').innerHTML = data;
                break;
            case 'privacyContent':
                document.getElementById('privacyContent').innerHTML = data;
                break;

            case 'display':
                document.getElementById('displayContent').innerHTML = data;
                break;
            case 'logOut':
                document.getElementById('logOutContent').innerHTML = data;
                break;
            case 'notification':
                document.getElementById('notificationSettings').innerHTML = data;
                break;
        }

    })
    .catch(error => console.error('Error loading content:', error));


        // Add more cases for other buttons

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
