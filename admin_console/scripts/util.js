import { API_BASE_URL } from "./config.js";
export function changefieldcolor(input) {
  input.classList.add('input-error');
  input.classList.remove('input-default');
}

export function changefieldcolordefault(input) {
  input.classList.remove('input-error');
  input.classList.add('input-default');
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function inputCheck(fields) {
  let inputcheck = false;

  fields.forEach(({ value, selector }) => {
    const field = document.querySelector(selector);
    if (!value) {
      changefieldcolor(field);
      inputcheck = true;
    } else {
      changefieldcolordefault(field);
    }
  });

  return inputcheck;
}

export function passwordMatchcheck (password, renterpassword, input1, input2){
  if (password != renterpassword)
  { changefieldcolor(document.querySelector(input1));
    changefieldcolor(document.querySelector(input2));
    alert("Passwords do not match!");
    return false;
  }
  return true;
}

export function isValidUserid(userid) {
  const useridregex = /^(98|99|[0-9]{2})(CSE|ME|CE|EE|ECE)(0[1-9]|[1-9][0-9])$/
  return useridregex.test(userid);
}


export function upload (input, allowed, value, name, callback) {
  document.querySelector(input).addEventListener('change', (event) => {
    const file =event.target.files[0];
    if (file) {
      
      if (!allowed.includes(file.type)) {
        alert(`invalid file type please provide file of type ${allowed}`);
        return;
      }
    }
    if(value)
    {
      document.querySelector(name).innerHTML = file.name;
    }

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const file64 = reader.result;
        if (callback) callback(file64);
      }
    }
  })}


export function download(base64, mimeType, fileName) {
  
  const base64Data = base64.startsWith('data:') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(base64Data); 
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i); 
    }

    byteArrays.push(new Uint8Array(byteNumbers)); 
  }

  const blob = new Blob(byteArrays, { type: mimeType });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName; 
  link.click();  
}



export function formatEventDate(eventdate) {
  const date = new Date(eventdate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${date.toLocaleString('default', { month: 'long' })} ${year}, ${hours}:${minutes}`;
}

export function formatjobdate(jobdate) {
  const date = new Date(jobdate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${date.toLocaleString('default', { month: 'long' })} ${year}`;
}

/*
export function darkMode () {
  document.querySelector('.js-dark-mode-button').addEventListener('click', () => {
  const generaldashboard = document.querySelector('.general-dashboard');
  const bottombox = document.querySelector('.bottom-box');
  const navbar = document.querySelector('.js-top-box');
  const bottombar = document.querySelector('.js-bottom');
  const inputboxes = document.querySelectorAll('input');
  const currentBgColor = getComputedStyle(navbar).backgroundColor;

    if(currentBgColor === 'rgb(255, 255, 255)') {
      generaldashboard.style.color = 'rgb(255, 255, 255)';
      navbar.style.backgroundColor = 'black';
      bottombar.style.backgroundColor = 'black';
      bottombox.style.backgroundColor = 'black';
      document.querySelectorAll('a').forEach(link => {link.style.color = 'rgb(255, 255, 255)';});
      inputboxes.forEach(input => { input.style.backgroundColor = 'rgb(255, 255, 255)';})
      //console.log('a' + bottombox.style.backgroundColor);
     }
     else {
      generaldashboard.style.color = 'black';
      bottombox.style.backgroundColor = 'rgb(255, 255, 255)';
      navbar.style.backgroundColor = 'rgb(255, 255, 255)';
      bottombar.style.backgroundColor = 'rgb(255, 255, 255)';
      document.querySelectorAll('a').forEach(link => {link.style.color = 'black';});
      //console.log('b' + bottombox.style.backgroundColor);
    }
  })

}
*/

export async function getdataonevent (address) {
  try{
    const response = await fetch(`${API_BASE_URL}/admin/${address}`);
    if(!response.ok) {
      throw new Error('response not ok');
    }
    const data = await response.json();
    return data;
  }
  catch(err) {
    console.log(err)
    throw err;
  }    
}


export async function deletedataonevent (address) {
  try{
    const response = await fetch(`${API_BASE_URL}/admin/${address}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(!response.ok) {
      throw new Error('response not ok');
    }
    const data = await response.json();
    return data;
  }
  catch(err) {
    throw err;
  }    
}

export async function updatedataonevent (address) {
  try{
    const response = await fetch(`${API_BASE_URL}/admin/${address}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify()
    });
    if(!response.ok) {
      throw new Error('response not ok');
    }
    const datarecieve = await response.json();
    return datarecieve;
  }
  catch(err) {
    throw err;
  }    
}



export function yearSelect (input) {
  const startYear = 1998;
  const endYear = (new Date().getFullYear()) + 4;
  const yearSelect = document.querySelector(input);
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
};

export function load_content(data, sem, content, address) {
  let file_html = '';
  const file_selector = document.querySelector(content);
  const filtered_data = data.filter(item => item.semester === sem);
  if(filtered_data.length >0) {
    filtered_data.forEach(data => {
        file_html += `<div class="file js-file" id="${data._id}">${data.name}</div>`;
      })  
      file_selector.innerHTML = file_html;
      const file_button = file_selector.querySelectorAll('.js-file');
      download_search_file(file_button, 'resources/download');
    }
    else {
      file_selector.innerHTML = `<div class="no-file">No files found</div>`;
    }   
}

export async function download_search_file(file_button, address) {
  file_button.forEach(file_button => {
        file_button.addEventListener('click', async () => {
          const _id = file_button.getAttribute('id');
          const file64 = await getdataonevent(`${address}/${_id}`);
          download(file64.file, 'application/pdf', file64.name)
        })
      })
}

export async function user_search(input1, input2, address) {
  console.log('hi');
  const personname = document.querySelector(input1).value;
  const userid= document.querySelector(input2).value;
  let search_html = '';
  const query = new URLSearchParams({
      personname, userid
    });
  const search_result = document.querySelector('.js-list-search-users');
  if(!personname && !userid) {
    search_result.style.justifyItems= 'center'
    search_html += `<div class="no-input">Please provide at least one parameter</div>`
    search_result.innerHTML = search_html;
    return;
  }
  const search_data = await getdataonevent(`${address}?${query}`);
  console.log(search_data);
  if(search_data.length > 0) {
  search_data.forEach(user => {
    search_html += `
    <div class="data js-user-data" user-id="${user.userid}">
      <img class="image" src="${user.personimage}">
      <div class="name">${user.userid}
      </div>
      <div class="name">${user.personname}
      </div>
      <div class="name">${user.usertype}
      </div>
    </div>
    <div class="set-admin js-set-admin" user-admin="${user.userid}">Make Admin</div>
    <div class="revoke-button js-remove-button" remove-button="${user.userid}">Remove</div>`
  });}
  else {
    search_html += `<div class="no-input">No user found with provided parameters</div>`
  }
  search_result.innerHTML = search_html;
}



export async function event_search(input1, input2, address) {
  const eventname = document.querySelector(input1).value;
  const date= document.querySelector(input2).value;
  let search_html = '';
  const query = new URLSearchParams({
      eventname, date
    });
  const search_result = document.querySelector('.js-list-search-events');
  if(!eventname && !date) {
    search_result.style.display= 'grid';
    search_result.style.gridTemplateColumns= '1fr';
    search_html += `<div class="no-input">Please provide at least one parameter</div>`
    search_result.innerHTML = search_html;
    return;
  }
  const search_data = await getdataonevent(`${address}?${query}`);
  if(search_data.length > 0) {
    search_result.style.display= 'grid';
    search_data.forEach(event => {
      search_html += `
      <div class="data js-event-data" event-id="${event._id}">
        <img class="image" src="${event.event_logo}">
        <div class="name">${event.name}
        </div>
        <div class="name">${formatEventDate(event.date)}
        </div>
      </div>
      <div class="revoke-button js-remove-button" remove-button="${event._id}">Remove</div>`
  });}
  else {
    search_result.style.display= 'grid';
    search_result.style.gridTemplateColumns= '1fr';
    search_html = `<div class="no-input">No event found with provided parameters</div>`
  }
  search_result.innerHTML = search_html;
}


export async function job_search(input1, input2, address) {
  const jobname = document.querySelector(input1).value;
  const company= document.querySelector(input2).value;
  let search_html = '';
  const query = new URLSearchParams({
      jobname, company
    });
  const search_result = document.querySelector('.js-list-search-jobs');
  if(!jobname && !company) {
    search_result.style.display= 'grid';
    search_result.style.gridTemplateColumns= '1fr';
    search_html += `<div class="no-input">Please provide at least one parameter</div>`
    search_result.innerHTML = search_html;
    return;
  }
  const search_data = await getdataonevent(`${address}?${query}`);
  if(search_data.length > 0) {
    search_result.style.display= 'grid';
    search_data.forEach(job => {
      search_html += `
    <div class="data js-job-data" job-id="${job._id}">
      <img class="image" src="${job.job_company_logo}">
      <div class="name">${job.job_tittle}
      </div>
      <div class="name">${job.job_company_name}
      </div>
      <div class="name">${formatjobdate(job.job_deadline)}
      </div>
    </div>
    <div class="revoke-button js-remove-button" remove-button="${job._id}">Remove</div>`
  });}
  else {
    search_result.style.display= 'grid';
    search_result.style.gridTemplateColumns= '1fr';
    search_html = `<div class="no-input">No job found with provided parameters</div>`
  }
  search_result.innerHTML = search_html;
}