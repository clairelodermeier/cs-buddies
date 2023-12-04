/*
Claire Lodermeier
The purpose of this file is to handle the client side of user logins. It gets login input from the 
DOM and creates server requests for login. Redirects to main page after successful login.
*/

// DOM element for login button
const lb = document.getElementById('loginButton');
// when the button is clicked, attempt login
lb.onclick = () => {
 login();
}

// This function creates a server request to log the user into their account. 
function login() {
  // DOM elements for username and password
  let us = document.getElementById('username').value;
  let pw = document.getElementById('password').value;
  
  // Create server request with username and password sent in the body
  let data = { username: us, password: pw };
  let p = fetch('/login/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });
  p.then((response) => {
    return response.text();
  }).then((text) => {
    // on successful login, redirect to main page
    if (text.startsWith('SUCCESS')) {
      window.location.href = '../main.html';
    } else {
      alert(text);
    }
  });
}

