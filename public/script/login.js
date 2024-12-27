import { API_BASE_URL } from "./config.js";
const urlParams = new URLSearchParams(window.location.search);


if(urlParams.has('alert')) {
  const message = urlParams.get('alert');
  if(message === 'not-logged-in') {
    alert('You need to login first!');
    window.location.href = '/login';
  }
  else if(message === 'account-verified'){
    alert('Account Verfied');
  }
  else if(message === 'User-not-found'){
    alert('Invalid Token');
  }
  else if(message === 'Link-expired'){
    alert('Link expired. New link sent to registered email');
  }
  else if(message === 'Link-not-found') {
    alert('Link not found')
  }
}

document.querySelector('.js-login-button').addEventListener('click', (event) => {
  event.preventDefault();
  const inputuserid = (document.querySelector('.js-userid-box').value).trim();
  const password = (document.querySelector('.js-password-box').value).trim();
  const userid = inputuserid.toUpperCase();
  const logindata = {
    userid: userid,
    password: password,
  }
  
fetch(`${API_BASE_URL}/login`, {
  method: 'POST',
  headers:{
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(logindata),

})
.then((response) => {
  

  if(!response.ok) {
    return response.json().then((data) => {
      throw new Error(data.message);
    });
  }
  return response.json();
  })
.then((data) => {
  console.log(data.message);
  window.location.href = '/dashboard';
  })
.catch((error) => {
  alert(error.message);
  console.log('Error',error);
})

})