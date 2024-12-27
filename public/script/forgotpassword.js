import { API_BASE_URL } from "./config.js";
import {isValidUserid, changefieldcolor} from "./util.js"


const submitButton = document.querySelector('.js-submit-button');

submitButton.addEventListener('click', (e) => {
  submitButton.disabled = true;
  e.preventDefault();                    
  const userid = document.querySelector('.js-user-id-box').value.toUpperCase();

  if(!isValidUserid(userid)) {
    changefieldcolor(document.querySelector('.js-user-id-box'));
    alert('Userid is not valid enter your college roll no of format 21CSE__');
    submitButton.disabled = false;
    return;
  }
  const data = ({userid});
  fetch(`${API_BASE_URL}/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok')
    }
    return response.json();
  })
  .then(data => {
    if(data.message === 'OTP sent') {
    alert('Please check your regsitered email for OTP');
    window.location.href = `/verify-otp?userid=${userid}`;
    }
    else if(data.message === 'User not found') {
      alert('User does not exist');
      location.reload();
    }

  })
  .catch(err => {
    console.log(err);
  })
})