

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

