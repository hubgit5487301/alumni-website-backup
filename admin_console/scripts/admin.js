import {getdataonevent as getdata, updatedataonevent as revokedata, deletedataonevent as deletedata, formatEventDate, formatjobdate} from './util.js';

const user = await getdata('user_name');
document.querySelector('.js-welcome-admin-text').innerHTML = `Welcome ${user.personname}`;


const total_users = document.querySelector('.js-users-stats');
const active_users = document.querySelector('.js-active-users-stats');
const total_events = document.querySelector('.js-events-stats');
const today_events = document.querySelector('.js-today-events-stats')
const total_jobs = document.querySelector('.js-jobs-stats');
const today_jobs= document.querySelector('.js-today-job-stats');

const stats_data = await getdata('get_stats');

total_users.innerHTML = `Total Users: ${stats_data.total_users}`;
total_events.innerHTML = `Total Events: ${stats_data.total_events}`;
total_jobs.innerHTML = `Total Jobs: ${stats_data.total_jobs}`;

active_users.innerHTML = `Active Users: ${stats_data.active_users}`;
today_events.innerHTML = `Events posted today: ${stats_data.today_events}`;
today_jobs.innerHTML = `Jobs posted today: ${stats_data.today_jobs}`;








const admin_data = await getdata('admin_data');
const admin_div = document.querySelector('.js-admin-info');

if(admin_data.length === 0) {
  admin_div.innerHTML = '<div class="text-info">No data found</div>';
}

else if(admin_data.length > 0) {
  let adminhtml = '';
  admin_data.forEach((admin) => {
    adminhtml += `
    <div class="data js-admin-data" admin-id="${admin.userid}">
      <img class="image" src="${admin.personimage}">
      <div class="admin-name">${admin.userid}
      </div>
      <div class="admin-name">${admin.personname}
      </div>
    </div>
      <div class="revoke-button js-revoke-button" revoke-button="${admin.userid}">Revoke</div>
`; 
  });
  admin_div.innerHTML = adminhtml;
  const user_button = document.querySelectorAll('.js-admin-data');
  user_button.forEach(button => {
    button.addEventListener('click', () => {
      const userid = button.getAttribute('admin-id');
      window.location.href = `/protected/profile?userid=${userid}`;
    })
  })

  const revoke_button = document.querySelectorAll('.js-revoke-button');
  revoke_button.forEach(button => {
    button.addEventListener('click', async () => {
      const userResponse = confirm('Revoke Admin Rights');
      if (userResponse) {
        const userid = button.getAttribute('revoke-button');
        const data = await revokedata(`revoke?userid=${userid}`, '');
        if(data.message === 'admin rights revoked') {
          const adminelement = document.querySelector(`.data.js-admin-data[admin-id="${userid}"]`)
          const revokeelement = document.querySelector(`.revoke-button.js-revoke-button[revoke-button="${userid}"]`);
          if(adminelement)  adminelement.remove();
          if(revokeelement) revokeelement.remove();
        } 
      }
    })
  })
}







const today_new_users = await getdata('today_new_users_data');
const regis_users = document.querySelector('.js-regis-users')
if(today_new_users.length === 0) {
  regis_users.innerHTML = `<div class="text-info">No new users today</div>`;
}
else if(today_new_users.length > 0) {
  let regisHtml = '';
  today_new_users.forEach(user => {
    regisHtml += `
    <div class="data js-user-data" user-id="${user.userid}">
      <img class="image" src="${user.personimage}">
      <div class="name">${user.userid}
      </div>
      <div class="name">${user.personname}
      </div>
    </div>
      <div class="revoke-button js-remove-button" remove-button="${user.userid}">Remove</div>`
  })
  regis_users.innerHTML = regisHtml;
  
  const user_button = document.querySelectorAll('.js-user-data');
  user_button.forEach(button => {
    button.addEventListener('click', () => {
      const userid = button.getAttribute('user-id');
      window.location.href = `/protected/profile?userid=${userid}`
    })
  })

  const remove_button = document.querySelectorAll('.js-remove-button');
  remove_button.forEach(button => {
    button.addEventListener('click', async () => {
      const userResponse = confirm('Delete User')
      if(userResponse) {
        const userid = button.getAttribute('remove-button');
        const data = await deletedata(`remove_user?userid=${userid}`, '');
        if(data.message === 'user deleted') {
          const userelement = document.querySelector(`.data.js-user-data[user-id="${userid}"]`);
          const removeelement = document.querySelector(`.revoke-button.js-remove-button[remove-button="${userid}"]`);
          if(userelement) userelement.remove();
          if(removeelement) removeelement.remove();
          if(regis_users.innerHTML.trim() === '')
          regis_users.innerHTML = `<div class="text-info">No new users today</div>`
        }
      }
    })
  })
}







const today_new_events = await getdata('today_new_events_data');
const regis_events = document.querySelector('.js-regis-events');

if(today_new_events.length === 0) {
  regis_events.innerHTML = '<div class="text-info">No new events today</div>'
}
else if(today_new_events.length > 0){
  let eventsHtml = '';
  today_new_events.forEach(event => {
    eventsHtml += `
    <div class="data js-event-data" event-id="${event._id}">
      <img class="image" src="${event.event_logo}">
      <div class="name">${formatEventDate(event.date)}
      </div>
      <div class="name">${event.name}
      </div>
    </div>
    <div class="revoke-button js-remove-event" remove-event="${event._id}">Remove</div>`;  
  })
  regis_events.innerHTML = eventsHtml;

  
  const user_button = document.querySelectorAll('.js-event-data');
  user_button.forEach(button => {
    button.addEventListener('click', () => {
      const _id = button.getAttribute('event-id');
      window.location.href = `/protected/event?_id=${_id}`
    })
  })

  const remove_button = document.querySelectorAll('.js-remove-event');
  remove_button.forEach(button => {
    button.addEventListener('click', async () => {
      const userResponse = confirm('Delete Event');
      if(userResponse) {  
        const _id = button.getAttribute('remove-event');
        const data = await deletedata(`remove_event?_id=${_id}`, '');
        if(data.message === 'event deleted') {
          const eventelement = document.querySelector(`.data.js-event-data[event-id="${_id}"]`);
          const removeevent = document.querySelector(`.revoke-button.js-remove-event[remove-event="${_id}"]`);
          if(eventelement) eventelement.remove();
          if(removeevent) removeevent.remove();
          if(regis_events.innerHTML.trim() === '') {
            regis_events.innerHTML = '<div class="text-info">No new events today</div>' }
        }
      }
    })
  })
}






const today_new_jobs = await getdata('today_new_jobs_data')
const regis_jobs = document.querySelector('.js-regis-jobs');

if(today_new_jobs.length === 0) {
  regis_jobs.innerHTML = '<div class="text-info">No new jobs today</div>';
}
else if(today_new_jobs.length > 0) {
  let jobsHtml = '';
  today_new_jobs.forEach(job => {
    jobsHtml += `
    <div class="data js-job-data" job-id="${job._id}">
      <img class="image" src="${job.job_company_logo}">
      <div class="name">${formatjobdate(job.job_deadline)}
      </div>
      <div class="name">${job.job_tittle}
      </div>
    </div>
    <div class="revoke-button js-remove-job" remove-job="${job._id}">Remove</div>`
  })
  regis_jobs.innerHTML = jobsHtml;

  const user_button = document.querySelectorAll('.js-job-data');
  user_button.forEach(button => {
    button.addEventListener('click', () => {
      const _id = button.getAttribute('job-id');
      window.location.href = `/protected/job?_id=${_id}`
    })
  })

  const remove_button = document.querySelectorAll('.js-remove-job');
  remove_button.forEach(button => {
    button.addEventListener('click', async () => {
      const userResponse = confirm(`Delete Job`);
      if(userResponse) {
        const _id = button.getAttribute('remove-job');
        const data = await deletedata(`remove_job?_id=${_id}`, '');
        if(data.message === 'job deleted') {
          const jobelement = document.querySelector(`.data.js-job-data[job-id="${_id}"]`);
          const removejob = document.querySelector(`.revoke-button.js-remove-job[remove-job="${_id}"]`);
          if(jobelement) jobelement.remove();
          if(removejob) removejob.remove();
          if(regis_jobs.innerHTML.trim() === '') {
            regis_jobs.innerHTML = '<div class="text-info">No new jobs today</div>' }
        }
      }
    })
  })
}