import { API_BASE_URL } from "./config.js";
import { inputCheck, changefieldcolor,isValidEmail } from "./util.js"; 

document.querySelector('.js-submit-message-button').addEventListener('click', (event) => {
  event.preventDefault();
  const fname = document.querySelector('.js-fname').value;
  const lname = document.querySelector('.js-lname').value;
  const name = fname + lname;
  const email = document.querySelector('.js-email').value;
  const message_input = document.querySelector('.js-message').value;
  
  const fields= [
    {value: fname, selector: '.js-fname'},
    {value: fname, selector: '.js-lname'},
    {value: fname, selector: '.js-email'},
    {value: fname, selector: '.js-message'}
  ]
  
  const isInvalid = inputCheck(fields);
  if(isInvalid) {
    alert('Please fill in all fields marked with red');
    return;
  }

  if(!isValidEmail(email)) {
    changefieldcolor(document.querySelector('.js-email'));
    alert('Enter a valid email');
    return;
  }

  const message = ({
    name: name,
    email: email,
    message: message_input
  })
  fetch(`${API_BASE_URL}/protected/send-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
  .then((response) => {
    if(!response.ok) {
      throw new Error(error.message||'error submitting data');
    }
    return response.json()
  })
 .catch((err) => {
  console.error(err.message);
  alert(err.message);
 })

})





