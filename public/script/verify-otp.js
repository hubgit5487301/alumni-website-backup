import { API_BASE_URL } from "./config.js";
import { inputCheck, changefieldcolor, changefieldcolordefault, passwordMatchcheck } from "./util.js";

const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('userid');

const submitButton = document.querySelector('.js-submit-button');

submitButton.addEventListener('click', (e) => {
  submitButton.disabled = true;
  e.preventDefault();
  const otpinput = document.querySelector('.js-otp-input-box').value;
  const fields = [{value: otpinput, selector: '.js-otp-input-box'}]
  const isInvalid = inputCheck(fields);
  if(isInvalid) {
    changefieldcolor(document.querySelector('.js-otp-input-box'))
    submitButton.disabled = false;
    alert('Enter a valid OTP');
    return;
  }
  const send_data = ({userid,otpinput});
  fetch(`${API_BASE_URL}/verify-otp-input`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(send_data)
  })
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok')
    }
    return response.json();
  })
  .then(data =>{
    if(data.message === 'Verfied'){
    alert(data.message);
    document.querySelector('.js-otp-box').style.display = 'none';
    document.querySelector('.js-reset-box').style.display = 'flex';

    const passbutton = document.querySelector('.js-pass-submit-button');
    passbutton.addEventListener('click', (e) => {
      e.preventDefault();
      passbutton.disabled = true;
      const pass = document.querySelector('.js-passinput-box').value;
      const retypepass = document.querySelector('.js-repassinput-box').value;

      const fields = [{value: pass, selector: '.js-passinput-box'},
        {value: retypepass, selector: '.js-repassinput-box'}
      ]
      const isInvalid = inputCheck(fields);
  
      if(isInvalid) {
        changefieldcolor(document.querySelector('.js-passinput-box'));
        changefieldcolor(document.querySelector('.js-repassinput-box'));
        passbutton.disabled = false;
        alert('Enter new passwords');
        return;
      }

      const check = passwordMatchcheck(pass, retypepass, '.js-passinput-box', '.js-repassinput-box');
      if(check === false) {
        passbutton.disabled = false;
        return;
      }
      else if (check === true) {
        changefieldcolordefault(document.querySelector('.js-passinput-box'));
        changefieldcolordefault(document.querySelector('.js-repassinput-box'));
      }

      const data = ({userid, pass});
      fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if(!response.ok) {
          throw new Error('response not ok');
        }
        return response.json();
      })
      .then(data => {
        if(data.message === 'Password changed') {
          alert(data.message);
          window.location.href = '/login';
        }
      })
    })}
    else {
      alert(data.error || data.message);
      window.location.reload();
    }
  })
  .catch(err=> {
    console.log(err);
  })
})