function login() {
  let us = document.getElementById('username').value;
  let pw = document.getElementById('password').value;
  let data = { username: us, password: pw };
  let p = fetch('/account/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });
  p.then((response) => {
    return response.text();
  }).then((text) => {
    console.log(text);
    if (text.startsWith('SUCCESS')) {
      alert(text);
      window.location.href = '../main.html';
    } else {
      alert('failed');
    }
  });
}

//create user function
function CreateUser() {
  var name = document.getElementById('username').value;
  var pass = document.getElementById('password').value;
  var DoB = document.getElementById('birthdate').value;
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
  }).then(async (idObj) => {
    var userObj = { n: name, p: pass, d: DoB, e: email, i: idObj };
    let url = '/account/create/';
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(userObj),
      headers: { 'Content-Type': 'application/json' }
    });
    alert(response.text());
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
  function handleFormSubmit(event) {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      event.preventDefault(); // Prevent form submission if passwords don't match
      alert('Passwords do not match. Please check again.');
    }
  }

  // Add event listeners
  confirmPasswordInput.addEventListener('input', checkPasswordMatch);
  registrationForm.addEventListener('submit', handleFormSubmit);

});
