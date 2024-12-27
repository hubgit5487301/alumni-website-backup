
import {getdataonevent as getjob_event, formatEventDate} from '../../protected-scripts/util.js';

const urlParams = new URLSearchParams(window.location.search); 
const userid = urlParams.get('userid');

const data = await getjob_event(`my-jobs-events-applied/${userid}`);

const job_ids = data.all_jobs;
const event_ids = data.all_events;
let jobHtml = '';

if(job_ids.length > 0) {
  job_ids.forEach(async job => {
    const data = await getjob_event(`job/${job._id}`);
    jobHtml += `
              <div class="job js-job" job-id="${job._id}">
                <img class="job-pic" src="${data.job_company_logo}" loading="lazy">
                <div class="job-text">
                  <p>Job: ${data.job_tittle}</p>
                  <p>Employer: ${data.job_company_name}</p>
                </div>
              </div>
  `;

    document.querySelector('.js-data-jobs').innerHTML = jobHtml;

    const jobButton = document.querySelectorAll('.js-job');
    jobButton.forEach(jobButton => {
        jobButton.addEventListener('click', () => {
        const job_id = jobButton.getAttribute('job-id')
        window.location.href = `/protected/job?_id=${job_id}`;
        })
      })
  })
}
else {
  jobHtml = `
  <div class="j">
      <p class="no-data">You have not applied to any Jobs</p>
  </div>
`;

document.querySelector('.js-data-jobs').innerHTML = jobHtml;
}

let eventHtml = '';
  if(event_ids.length >0) {
  event_ids.forEach( async event => {
    const data =  await getjob_event(`events/${event._id}`);
    eventHtml += `
                <div class="event js-event" event-id="${event._id}">
                  <img class="event-pic" src="${data.event_logo}"  loading="lazy">
                  <div class="event-text">
                  <p>Event Name: ${data.name}</p>
                  <p>Date & Time: ${formatEventDate(data.date)}</p>
                </div>
                </div>
  `
    document.querySelector('.js-data-events').innerHTML = eventHtml;
    const eventButton = document.querySelectorAll('.js-event');
    eventButton.forEach(eventButton => {
      eventButton.addEventListener('click', ()=> {
        const event_id = eventButton.getAttribute('event-id');
        window.location.href= `/protected/event?_id=${event_id}`;
      })
    })
  })
}
else {
  eventHtml = `
                <div class="e">
                  <p class="no-data">You have not applied to any Events</p>
                </div>
  `
    document.querySelector('.js-data-events').innerHTML = eventHtml;
}





