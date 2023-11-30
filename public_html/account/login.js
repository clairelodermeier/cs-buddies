function login() {
    let us = document.getElementById('username').value;
    let pw = document.getElementById('password').value;
    let data = {username: us, password: pw};
    let p = fetch( '/account/login/', {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    });
    p.then((response) => {
      return response.text();
    }).then((text) => {
      console.log(text);
      if (text.startsWith('SUCCESS')) {
        alert(text);
        window.location.href = '/public_html/create.html';
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
  imgP.then((r)=>{
      return r.json();
  }).then((idObj)=>{
      var userObj = { n: name, p: pass, d: DoB, e: email, i: idObj};
  
  });

  let url = '/account/create/';

  let p = fetch(url, {
      method: 'POST',
      body: JSON.stringify(userObj),
      headers: { 'Content-Type': 'application/json' }
    });
    
  p.then((response) => {
      return response.text();
  }).then((text) => {
      alert(text);
  })
}