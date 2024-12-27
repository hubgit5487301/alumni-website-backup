
import {getdataonevent as getjob_event, formatEventDate, deletedataonevent} from '../../protected-scripts/util.js';

const urlParams = new URLSearchParams(window.location.search); 
const userid = urlParams.get('userid');
const data = await getjob_event(`my-jobs-events-posts/${userid}`);
const job_ids = data.data.job_ids;
const event_ids = data.data.event_ids;

let jobHtml = '';
let sortedJobsData = [];

if (job_ids.length > 0) {

  const jobPromises = job_ids.map(async (job) => {
    const data = await getjob_event(`job/${job.job_id}`);
    return {
      job_id: job.job_id,
      job_tittle: data.job_tittle,
      job_company_name: data.job_company_name,
      job_company_logo: data.job_company_logo,
      job_description: data.job_description
    };
  });

  const allJobsData = await Promise.all(jobPromises);
  sortedJobsData = allJobsData.sort((a, b) => new Date(b.job_deadline) - new Date(a.job_deadline));


  renderJobs(sortedJobsData);


  const searchInput = document.querySelector('.js-job-search');
  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredJobs = sortedJobsData.filter(job =>
      job.job_tittle.toLowerCase().startsWith(searchTerm)
    );
    renderJobs(filteredJobs);
  });
} else {
  jobHtml = `
    <div class="j">
        <p class="no-data">You have not posted any Jobs</p>
    </div>
  `;
  document.querySelector('.js-data-jobs').innerHTML = jobHtml;
}

function renderJobs(jobs) {
  let jobHtml = '';
  jobs.forEach(job => {
    jobHtml += `
      <div class="job js-job" job-id="${job.job_id}">
        <img class="job-pic" src="${job.job_company_logo}" loading="lazy">
        <div class="job-text">
          <p>Job: ${job.job_tittle}</p>
          <p>Employer: ${job.job_company_name}</p>
        </div>
      </div>
      <div class="delete-button-job js-delete-button-job" button-id="${job.job_id}">
        <img class="delete-button" src="/images/delete.svg">
      </div>
    `;
  });
  document.querySelector('.js-data-jobs').innerHTML = jobHtml;


  const jobButtons = document.querySelectorAll('.js-job');
  jobButtons.forEach(jobButton => {
    jobButton.addEventListener('click', () => {
      const job_id = jobButton.getAttribute('job-id');
      window.location.href = `/protected/applicants/job?job_id=${job_id}`;
    });
  });

  const deleteButtons = document.querySelectorAll('.js-delete-button-job');
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', async () => {
      const job_id = deleteButton.getAttribute('button-id');
      const data = await deletedataonevent(`myprofile-posts/${userid}/delete-job/${job_id}`);
      if (data.message === 'Job post deleted') {
        const jobElement = document.querySelector(`.job.js-job[job-id="${job_id}"]`);
        const deleteButtonElement = document.querySelector(`.delete-button-job.js-delete-button-job[button-id="${job_id}"]`);
        if (jobElement) {
          jobElement.remove();}
        if (deleteButtonElement) deleteButtonElement.remove();
      }
    });
  });
}


let eventHtml = '';
let sortedEventsData = [];

if (data.usertype === 'admin') {
  const box = document.querySelector('.js-event-box');
  box.style.display = 'flex';
  const main_box = document.querySelector('.js-profile-appli-page');
  main_box.classList.remove('profile-appli-page-1');
  main_box.classList.add('profile-appli-page-2');

  if (event_ids.length > 0) {
    const eventPromises = event_ids.map(async (event) => {
      const data = await getjob_event(`events/${event.event_id}`);
      return {
        event_id: event.event_id,
        name: data.name,
        event_logo: data.event_logo,
        event_date: data.date,
      };
    });

    const allEventsData = await Promise.all(eventPromises);
    sortedEventsData = allEventsData.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  
    renderEvents(sortedEventsData);

  
    const searchInput = document.querySelector('.js-event-search');
    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredEvents = sortedEventsData.filter(event =>
        event.name.toLowerCase().startsWith(searchTerm)
      );
      renderEvents(filteredEvents);
    });
  } else {
    eventHtml = `
      <div class="e">
        <p class="no-data">You have not posted any Events</p>
      </div>
    `;
    document.querySelector('.js-data-events').innerHTML = eventHtml;
  }
}

function renderEvents(events) {
  let eventHtml = '';
  events.forEach(event => {
    eventHtml += `
      <div class="event js-event" event-id="${event.event_id}">
        <img class="event-pic" src="${event.event_logo}" loading="lazy">
        <div class="event-text">
          <p>Event Name: ${event.name}</p>
          <p>Date & Time: ${formatEventDate(event.event_date)}</p>
        </div>
      </div>
      <div class="delete-button-event js-delete-button-event" button-id="${event.event_id}">
        <img class="delete-button js-delete-button" src="/images/delete.svg">
      </div>
    `;
  });
  document.querySelector('.js-data-events').innerHTML = eventHtml;


  const eventButtons = document.querySelectorAll('.js-event');
  eventButtons.forEach(eventButton => {
    eventButton.addEventListener('click', () => {
      const event_id = eventButton.getAttribute('event-id');
      window.location.href = `/protected/applicants/event?event_id=${event_id}`;
    });
  });

  const deleteButtons = document.querySelectorAll('.js-delete-button-event');
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', async () => {
      const event_id = deleteButton.getAttribute('button-id');
      const data = await deletedataonevent(`myprofile-posts/${userid}/delete-event/${event_id}`);
      if (data.message === 'event post deleted') {
        const jobElement = document.querySelector(`.event.js-event[event-id="${event_id}"]`);
        const deleteButtonElement = document.querySelector(`.delete-button-event.js-delete-button-event[button-id="${event_id}"]`);
        if (jobElement) {
          jobElement.remove();}
        if (deleteButtonElement) deleteButtonElement.remove();

      
      }
    });
  });
}
