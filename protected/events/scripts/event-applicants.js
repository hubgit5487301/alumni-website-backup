import { API_BASE_URL } from "../../protected-scripts/config.js";
import { formatEventDate , getdataonevent as getdata} from "../../protected-scripts/util.js";

const urlParam = new URLSearchParams(window.location.search);
const event_id = urlParam.get('event_id');

fetch(`${API_BASE_URL}/protected/applicants/event/${event_id}`)
.then(response => {
  if(!response.ok) {
    throw new Error('response not ok');
  }
  return response.json();
})
.then( async data => {
  const applicants = data.applicants_data[0].applicants;
  const eventHtml = `<div class="event-page js-event-page">
        <div class="first-view">
          <img class="event-pic" src="${data.event_data.event_logo}" loading="lazy">
          <div class="basic-data">
            <p class="name">${data.event_data.name}</p>
            <div class="basic-data-details">
              <p>Event name : ${data.event_data.name}</p>
              <p>Event date: ${formatEventDate(data.event_data.date)}</p>
              <p>Location: ${data.event_data.location}</p>
              <p>Event Ph no: ${data.event_data.contact_info.phone_no}</p>
              <p>Event Email: ${data.event_data.contact_info.email}</p>
              <p>Total applicants: ${applicants.length}</p>
            </div>
          </div>
        </div>
        <div class="event-headings">
          <h1>Applicants</h1>
        </div>
        <div class="event-requirement js-applicants">
         
          </div>
`;

  document.querySelector('.js-event-page').innerHTML = eventHtml;

  const sortedApplicantsData = await Promise.all(
    Object.values(applicants).map(async (applicant) => {
      const data = await getdata(`event_users/${applicant.applicant}`);
      return { applicant: applicant.applicant, ...data };
    })
  );
  sortedApplicantsData.sort((a, b) => a.personname.localeCompare(b.personname));
  
  let applicant_Html = '';
  sortedApplicantsData.forEach(async (applicants) => {
    applicant_Html += `
            <div class="req-text">
              <p class="event-des-text-id">Name: ${applicants.personname}</p>
              <p class="event-des-text-id">Userid: ${applicants.applicant}</p>
              <p class="event-des-text-id">Branch: ${applicants.details.branch}</p>  
              <p class="view-profile js-view-profile" view-profile-id="${applicants.applicant}">View Profile</p>
            </div>
`
  })
    document.querySelector('.js-applicants').innerHTML = applicant_Html;
    
    const profile_Button = document.querySelectorAll('.js-view-profile');
      profile_Button.forEach(profile_Button => {
        profile_Button.addEventListener('click', () => {
          const userid = profile_Button.getAttribute('view-profile-id')
          window.location.href = `/protected/profile?userid=${userid}`
      })
    })
  })
.catch(err => {
  console.log(err);
})
