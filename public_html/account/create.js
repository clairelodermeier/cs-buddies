
const cb = document.getElementById('createAccountButton');
cb.onclick = () => {
 createUser();
}

//create user function
function createUser() {
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
      if((await response.text()).startsWith("SUCCESS")){
        window.location.href = '/login.html';
      }
      else{
        alert("failed to create account");
      }
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
    //registrationForm.addEventListener('click', handleFormSubmit);
  
  });