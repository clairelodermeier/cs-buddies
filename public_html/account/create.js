/*
Claire Lodermeier
The purpose of this file is to handle the client side of user account creations. Gets account info
via the DOM, checks that passwords match. Creates server request to create a user. 
*/

// DOM elements for user info
const username = document.getElementById('username');
const pass = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const bday = document.getElementById('birthdate');
const email = document.getElementById('email');
const imgHolder = document.getElementById('profilePic');

// DOM element for create button
const cb = document.getElementById('createAccountButton');
// when the button is clicked, check fields, then create user if they are valid
cb.onclick = () => {
  // ensure all fields are filled out
  if (username.value == ('') || pass.value == ('') || confirmPassword.value == ('') || bday.value == ('') || email.value == ('') || imgHolder.files.length == 0) {
    alert('One or more fields is incomplete.');
  }
  // ensure passwords match
  else if (pass.value !== confirmPassword.value) {
    alert('Passwords do not match. Please check again.');
  }
  // if fields are valid, create user
  else {
    formData = getImgData();
    createUser(formData);
  }
}
// This function creates a formData variable using the uploaded image file. 
// Returns formData, a FormData object with image info
function getImgData(){
  // get image data
  var formData = new FormData();
  formData.append('photo', imgHolder.files[0], imgHolder.files[0].name);
  return formData;

}
// This function makes a server request to create a user. 
// Param: formData, a formData object with image info
function createUser(formData) {
  // create request for image upload
  let imgUrl = '/upload';
  let imgP = fetch(imgUrl, {
    method: 'POST',
    body: formData,
  });
  imgP.then((r) => {
    return r.json();
  }).then((idObj) => {
    var userObj = { n: username.value, p: pass.value, d: bday.value, e: email.value, i: idObj };
    // create request for creating account
    let url = '/create/';
    let p = fetch(url, {
      method: 'POST',
      body: JSON.stringify(userObj),
      headers: { 'Content-Type': 'application/json' }
    });
    p.then((r) => {
      return r.text();
    }).then((text) => {
      // if account creation was successful, redirect to login
      if (text.startsWith("SUCCESS")) {
        window.location.href = 'login.html';
      } else {
        alert(text);
      }
    });
  });
}

// This function displays message to users about whether their passwords match.
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordMatchMessage = document.getElementById('passwordMatchMessage');

  // This function checks whether the password field input matches the confirm password field input
  function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Display message 
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