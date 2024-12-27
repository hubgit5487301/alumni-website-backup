import { event_search as search, getdataonevent as getdata, formatEventDate, deletedataonevent as deletedata } from "./util.js";

const all_events = await  getdata('events');

const list_events = document.querySelector('.js-list-events')

if(all_events.length === 0) {
  list_events.innerHTML = `<div class="text-info">No events found</div>`
}
else if(all_events.length > 0) {
  let eventHtml = '';
  all_events.forEach(event => {
    eventHtml += `
    <div class="data js-event-data" event-id="${event._id}">
      <img class="image" src="${event.event_logo}">
      <div class="name">${event.name}
      </div>
      <div class="name">${formatEventDate(event.date)}
      </div>
    </div>
    <div class="revoke-button js-remove-button" remove-button="${event._id}">Remove</div>`    
  });
  list_events.innerHTML = eventHtml;
      
  const search_button = document.querySelector('.js-search-button');
  search_button.addEventListener('click', () => {
    search('.js-search-eventname','.js-search-date','/search_events');
  })
  const search_eventname = document.querySelector('.js-search-eventname');

  search_eventname.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      search('.js-search-eventname','.js-search-date','/search_events').then(()=> {setevent()})
    }
  })
  setevent()
}



function setevent() {

  const event_button = document.querySelectorAll('.js-event-data');
  event_button.forEach(button => {
    button.addEventListener('click', () => {
      const eventid = button.getAttribute('event-id');
      window.location.href = `/protected/event?_id=${eventid}`
    })
  })
  const remove_button = document.querySelectorAll('.js-remove-button');
  remove_button.forEach(button => {
    button.addEventListener('click', async () => {
      const eventResponse = confirm('Delete event')
      if(eventResponse) {
        const eventid = button.getAttribute('remove-button');
        const data = await deletedata(`remove_event?_id=${eventid}`, '');
        if(data.message === 'event deleted') {
          const eventelement = document.querySelector(`.data.js-event-data[event-id="${eventid}"]`);
          const removeelement = document.querySelector(`.revoke-button.js-remove-button[remove-button="${eventid}"]`);
          if(eventelement) eventelement.remove();
          if(removeelement) removeelement.remove();
          if(list_events.innerHTML.trim() === ''){
            list_events.innerHTML = '<div class="text-info">No events found</div>' }
        }
      }
    })
  })
}