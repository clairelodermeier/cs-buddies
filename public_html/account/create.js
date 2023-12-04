/*
Claire Lodermeier
The purpose of this file is to handle the client side of user account creations. Gets account info
via the DOM, checks that passwords match. Creates server request to create a user. 
*/


// DOM element for create button
const cb = document.getElementById('createAccountButton');
cb.onclick = () => {
  var name = document.getElementById('username').value;
  var pass = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirmPassword').value;
  var birthday = document.getElementById('birthdate').value;
  var email = document.getElementById('email').value;
  var imgFiles = document.getElementById('profilePic').files;

  if (name==('') || pass==('') || confirmPassword==('') || birthday==('')|| email==('') || imgFiles.length == 0) {
    alert('One or more fields is incomplete.');
  }
  else if (pass !== confirmPassword) {
    alert('Passwords do not match. Please check again.');
  }
  else{
    createUser();
  }
}

// This function makes a server request to create a user.
function createUser() {
    var name = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    var birthday = document.getElementById('birthdate').value;
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
    imgP.then((r) => {
      return r.json();
    }).then((idObj) => {
      var userObj = { n: name, p: pass, d: birthday, e: email, i: idObj };
      let url = '/create/';
      let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: { 'Content-Type': 'application/json' }
      });
      p.then((r) => {
        return r.text();
      }).then((text) => {
        if (text.startsWith("SUCCESS")) {
          window.location.href = 'login.html';
        }
        else {
          alert("failed to create account");
        }
      });

    });
}

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordMatchMessage = document.getElementById('passwordMatchMessage');


  function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password === confirmPassword) {
      passwordMatchMessage.textContent = 'Passwords match!';
      passwordMatchMessage.style.color = 'green';
    } else {
      passwordMatchMessage.textContent = 'Passwords do not match';
      passwordMatchMessage.style.color = 'red';
    }
  }

  // Add event listeners
  confirmPasswordInput.addEventListener('input', checkPasswordMatch);

});