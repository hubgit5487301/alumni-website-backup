import { API_BASE_URL } from "../../protected-scripts/config.js";
import { yearSelect } from "../../protected-scripts/util.js";
yearSelect('.js-search-input-year');


let personHtml = '';

fetch(`${API_BASE_URL}/protected/users`)
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
  })     
  .then(data => {
    personHtml = '';
    data.forEach((user, index) => {
    personHtml +=`
        <div class="person js-person">
            <img class="person-image" src="${user.personimage}"  loading="lazy">
            <div class="person-name js-person-name" id="${user.userid}">
              <h>${user.personname}</h>
            </div>
        </div>
`   })

    document.querySelector('.js-person-row').innerHTML = personHtml;
    data.forEach(user => {
      const personback = document.getElementById(user.userid);
      if(user.usertype) {
        if(user.usertype === 'alumni') {
          personback.style.backgroundColor = 'rgba(255, 0, 0, 0.59)';
        }
        else if(user.usertype === 'student') {
          personback.style.backgroundColor = 'rgba(43, 167, 221, 0.59)';
        }
      }
      else {
        personback.style.backgroundColor = 'rgba(46, 45, 45, 0.596)';
      }
    })
    document.querySelectorAll('.js-person').forEach((user, index) => {
          user.addEventListener('click' ,() => {
            const userid = data[index].userid;
            window.location.href = `profile?userid=${userid}`;
          });
        });
  })
  .catch(err => {
    console.log(err);
  })

let debounce = '';

const result = document.querySelector('.js-search-output');
const searchButton = document.querySelector('.js-search-button');
let searchHtml = '';
searchButton.addEventListener('click', () =>{
  const textinput = document.querySelector('.js-search-input').value.trim();
  const batchinput = document.querySelector('.js-search-input-year').value;
  const branchinput = document.querySelector('.js-search-input-branch').value;

  const query = new  URLSearchParams({
    personname: textinput,
    batch: batchinput, 
    branch: branchinput
  });


  clearTimeout(debounce);

  debounce = setTimeout(() => {
    if (!textinput && !batchinput && !branchinput) {
      result.innerHTML = `<div class="text-1 js-text-1">Please provide at least one search parameter.</div>`;
      result.classList.add('show');
      return;
    }
    
  fetch(`${API_BASE_URL}/protected/alumni-search?${query}`)
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
  })
  .then(data => {
    if(data.length === 0) {
      result.innerHTML = `<div class="text-1 js-text-1">No user found</div> `;
      result.classList.add('show');
          return;
   }
    searchHtml = '';
    data.forEach(user =>{
      searchHtml +=`
        <div class="person-1 js-person-1">
            <img class="person-image-1" src="${user.personimage}"  loading="lazy">
            <div class="person-name" id="${user.userid}">
              <h>${user.personname}</h>
            </div>
        </div>
` 
    })    
      result.innerHTML = searchHtml;
      
      result.classList.add('show');

      setTimeout(() => {
          document.querySelectorAll('.js-person-1').forEach((person, index) => {
            person.classList.add('show'); 
          });
        }, 10);
        data.forEach(user => {
          const personback = document.getElementById(`${user.userid}`);
          if(user.usertype) {
            if(user.usertype === 'alumni') {
              personback.style.backgroundColor = 'rgba(255, 0, 0, 0.59)';
            }
            else if(user.usertype === 'student') {
              personback.style.backgroundColor = 'rgba(43, 167, 221, 0.59)';
            }
          }
          else {
            personback.style.backgroundColor = 'rgba(46, 45, 45, 0.596)';
          }
        })
      document.querySelectorAll('.js-person-1').forEach((user, index) => {
        user.addEventListener('click' ,() => {
          const userid = data[index].userid;
          window.location.href = `profile?userid=${userid}`;
        });
      });
    })

.catch(err=> {
  console.error('error fetching data',err);
  result.innerHTML = '<div>There was an error fetching the data please reload the webpage</div>';
})
})
}, 250)



