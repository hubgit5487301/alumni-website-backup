import {getdataonevent as getusertype} from "./util.js";

document.querySelector('.js-post-job').addEventListener('click',async () => {
  let usertype = '';
  try{
    const data = await  getusertype('my-usertype');
    usertype = data.usertype;
  }
  catch(err) {
    console.log(err)
  }

  if(usertype === 'alumni' || usertype ===  'admin' || usertype === 'temp_admin') {
    window.location.href = '/protected/job-form';
  }
  else {
    alert("Sorry only alumni are allowed to post requests for jobs");
  }
})


document.querySelector('.js-register-event').addEventListener('click', async () =>{
  let usertype = '';
  try{
    const data = await getusertype('my-usertype');
    usertype = data.usertype; 
  }
  catch(err) {
    console.log(err);
  }


  if(usertype === 'admin' || usertype === 'temp_admin') {
    window.location.href = '/protected/event-form';
  }
  else {
    alert("Sorry only admins are allowed to post requests for events");
  }
})

document.querySelector('.js-resources').addEventListener('click', () => {
  window.location.href = "/protected/resources"
})