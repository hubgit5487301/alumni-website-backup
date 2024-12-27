import { API_BASE_URL } from "../../protected-scripts/config.js";
import {isValidEmail, inputCheck, upload as joblogoupload, changefieldcolor, getdataonevent as getuseridonsubmit} from "../../protected-scripts/util.js"

const allowedpic =['image/jpeg','image/png'];

let job_company_logo = null;

joblogoupload('.js-company-logo', allowedpic, true, '.js-company-logo', (file64) =>{
  job_company_logo = file64;
})

document.querySelector('.js-submit-button').addEventListener('click', async (e) => {
  e.preventDefault();
  
  //job details input
  const job_tittle =document.querySelector('.js-job-tittle').value;
  const job_location =document.querySelector('.js-job-location').value;
  const job_salary =document.querySelector('.js-job-salary').value;
  const job_type =document.querySelector('.js-job-type').value;
  const job_level =document.querySelector('.js-job-level').value;
  const job_des =document.querySelector('.js-job-des').value;

  //job qualifications
  const job_edu =document.querySelector('.js-edu-qual').value;
  const job_exp_level =document.querySelector('.js-exp-level').value;

  //applications details
  const job_deadline =document.querySelector('.js-deadline').value;
  const job_app_email =document.querySelector('.js-app-email').value; 
  const job_resume =document.querySelector('.js-resume').value;

  //company details
  const job_company_name =document.querySelector('.js-company-name').value;
  const job_company_website =document.querySelector('.js-company-website').value;
  const job_company_des =document.querySelector('.js-company-des').value;
  const job_contact_info =document.querySelector('.js-contact-info').value;

  const fields = [
    { value:job_tittle, selector: '.js-job-tittle' },
    { value:job_location, selector: '.js-job-location' },
    { value:job_des, selector: '.js-job-des' },
    { value:job_edu, selector: '.js-edu-qual' },
    { value:job_deadline, selector: '.js-deadline' },
    { value:job_app_email, selector: '.js-app-email' },
    { value:job_resume, selector: '.js-resume' },
    { value:job_company_name, selector: '.js-company-name' },
    { value:job_company_des, selector: '.js-company-des' },
    { value:job_contact_info, selector: '.js-contact-info' },
  ]

  const isInvalid = inputCheck(fields)
  if (isInvalid) {
    alert('Please fill all fields marked with red before submitting');
    return;
  }

  if(!isValidEmail(job_app_email)) {
    changefieldcolor(document.querySelector('.js-app-email'));
    alert('Enter a valid email');
    return;
  }

  const jobdata = ({
    job_tittle, job_location, job_salary, job_type, job_level, job_des,
    job_edu, job_exp_level,
    job_deadline, job_app_email, job_resume,
    job_company_name, job_company_website, job_company_des, job_contact_info, job_company_logo,
  })


  fetch(`${API_BASE_URL}/protected/submit-job`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobdata)
  })
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok')
    }
    return response.json(); 
  })
  .then((data) => {
    alert('Form submitted successfully');
    window.location.href = '/protected/job-directory';
  })
  
})