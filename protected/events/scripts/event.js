import { API_BASE_URL } from "../../protected-scripts/config.js";
import { formatEventDate, getdataonevent, download as download_event_file } from "../../protected-scripts/util.js";

const urlParams = new URLSearchParams(window.location.search);
const event_id = urlParams.get('_id');

  fetch(`${API_BASE_URL}/protected/events/${event_id}`)
  .then( response => {
      if(!response.ok) {
        throw new Error('response not ok');
      }
      return response.json();
  })
  .then(event => {
    const eventHtml = `
        <div class="first-view">
          <img class="event-pic" src="${event.event_logo}">
          <div class="basic-data">
            <p class="name">${event.name}</p>
            <div class="basic-data-details">
              <p>Event Date & Time: ${formatEventDate(event.date)}</p>
              <div class="download-button js-download-button">Download Event Details</div>
            </div>
          </div>
        </div>
        <div class="event-requirement">
          <div class="event-req-details">
            <div class="req-text">
                <h2>Description:</h2> 
                <p>${event.event_des}</p>
            </div>
            <div class="short-info">
              <div class="req-text">
                <h2>Location:</h2>
                <p>${event.location}</p>
              </div>
              <div class="req-text">
                <h2>Phone No:</h2>
                <p>${event.contact_info.phone_no}</p>
              </div>
              <div class="req-text">
                <h2>Email:</h2>
                <p>${event.contact_info.email}</p>
              </div>
            </div
          </div>
        </div>
      <button class="submit-button js-submit-button">Apply</button>
`;         
  document.querySelector('.js-event-page').innerHTML = eventHtml;
  
  
  const applyButton = document.querySelector('.js-submit-button');
  applyButton.addEventListener('click', async () => {
    const data = await getdataonevent('/my-userid');
    const userid = data.userid;
    const send_data = ({userid, event_id});
    fetch(`${API_BASE_URL}/protected/apply-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(send_data)
    })
    .then(response => {
      if(!response.ok) {
        return response.json().then( errorData => {
          throw new Error(errorData.error || 'reponse not ok')
        })
      }
      return response.json()
    })
    .then(data => {
      if(data.message === 'Applied to event'){ 
        alert(data.message);
        applyButton.disabled = true;
      }
    })
    .catch(err => {
      alert(err);
      console.log(err);
      applyButton.disabled = true;
    }) 
  })

  const download_Button = document.querySelector('.js-download-button');
  download_Button.addEventListener('click', async () => {
    const data = await getdataonevent(`event-file/${event._id}`)
    if(data.error) {
      alert(data.error)
    }
    else {
      download_event_file(data, 'application/pdf', formatEventDate(event.date))
    }
  })



})
  .catch(err => {
    console.error('error while fetching event:',err);
  })

