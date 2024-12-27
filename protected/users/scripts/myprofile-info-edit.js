import {getdataonevent as getuserdetails, updatedataonevent as updatedetails} from "../../protected-scripts/util.js"

const data = await getuserdetails(`user_info`);

const aboutme = document.querySelector('.js-about-me');
const education = document.querySelector('.js-education');
const currentrole = document.querySelector('.js-current-role');
const experience = document.querySelector('.js-experience');
const contactinfo = document.querySelector('.js-contact-info');


async function adddata () {
  aboutme.value = data.aboutme;
  education.value = data.education;
  currentrole.value = data.currentrole;
  experience.value = data.experience;
  contactinfo.value = data.contactinfo;
}
adddata();


const submitButton = document.querySelector('.js-submit-button');

submitButton.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log(data.aboutme, aboutme.value);
  if( 
    data.aboutme !== aboutme.value ||
    data.education !== education.value ||
    data.currentrole !== currentrole.value ||
    data.experience !== experience.value ||
    data.contactinfo !== contactinfo.value) {
    const newdetails = ({
      aboutme: aboutme.value,
      education: education.value,
      currentrole: currentrole.value,
      experience: experience.value,
      contactinfo: contactinfo.value
    });

    const data = await updatedetails(`update_details`, newdetails);
    if(data.message === 'New details added successfully') {
      alert('New details added successfully');
      window.location.href = '/protected/my-profile-page';
    }
    else if(data.message === 'No changes made') {
      alert(data.message);
    }
  }
  else {
    alert('Please input new details')
  }
})

