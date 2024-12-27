import { API_BASE_URL } from "../../protected-scripts/config.js";
import { formatjobdate } from "../../protected-scripts/util.js";



fetch(`${API_BASE_URL}/protected/jobs`)
.then(response => {
  if(!response.ok) {
    throw new Error('response not ok');
  }
  return response.json()
})
.then(jobs => {
  let jobsHtml = '';
  jobs.forEach( job => {
    jobsHtml += `
    <div class="job js-job">
      <img class="j-job-icon js-job-icon" src="${job.job_company_logo}" loading="lazy">
      <div class="job-info js-job-info">
        <h1>${job.job_tittle}</h1>
        <h2>${job.job_company_name}</h2>
        <p>Level: ${job.job_level}</p>
        <p>Type: ${job.job_type}</p>
        <p>Last date: ${formatjobdate(job.job_deadline)}</p>
      </div>
      </div>
  `})
  document.querySelector('.js-job-row').innerHTML = jobsHtml;
  document.querySelectorAll('.js-job').forEach((job, index) => {
  job.addEventListener('click', () => {
    const job_id = jobs[index]._id;
    window.location.href = `job?_id=${job_id}`;
  })
  })

})

const searchButton = document.querySelector('.js-search-button');
const result = document.querySelector('.js-search-output');

let searchHtml = '';
searchButton.addEventListener('click', () =>{
  const job_tittle = document.querySelector('.js-search-input').value.trim();
  const job_type = document.querySelector('.js-search-input-type').value;
  const job_level = document.querySelector('.js-search-input-level').value;
  const job_company_name = document.querySelector('.js-search-input-emp').value;

  const query = new URLSearchParams({
    job_tittle, job_type, job_level, job_company_name
  })

  let debounce = '';
  clearTimeout(debounce);

  debounce = setTimeout(() => {

    if(!job_tittle && !job_company_name && job_level === '' && job_type ==='') {
      result.classList.add('show');
        result.innerHTML = `<div class="text js-text">No Please provide at least one search parameter.</div> `;
        document.querySelector('.js-text').classList.add('show');
      return;
    }
    
  fetch(`${API_BASE_URL}/protected/job-search?${query}`)
  .then(response => {
    if(!response.ok) {
      throw new Error('response not ok');
    }
    return response.json();
  })
  .then(data => {
    searchHtml = '';
    if(data.length === 0) {
        result.classList.add('show');
        result.innerHTML = `<div class="text js-text">No job found</div> `;
        document.querySelector('.js-text').classList.add('show');
     }
    data.forEach(job =>{
      searchHtml +=`<div class="job-search js-job">
      <img class="j-job-icon-search js-job-icon" src="${job.job_company_logo}"  loading="lazy">
      <div class="job-info-search js-job-info">
        <h1>${job.job_tittle}</h1>
        <h2>${job.job_company_name}</h2>
        <p>Level: ${job.job_level}</p>
        <p>Type: ${job.job_type}</p>
        <p>Last date: ${formatjobdate(job.job_deadline)}</p>
      </div>
      </div>
`;
      result.innerHTML = searchHtml;
      setTimeout(() => {
        document.querySelectorAll('.js-job').forEach(job => {
          job.classList.add('show');
        });
      }, 10);
      result.classList.add('show');
      document.querySelectorAll('.js-job').forEach((job, index) => {
        job.addEventListener('click' ,() => {
          const job_id = data[index]._id;
          window.location.href =  `job?_id=${job_id}`;
        });
      });
    })
})
  .catch(err=> {
    console.error('error fetching data',err);
    result.innerHTML = '<div>There was an error fetching the data please reload the webpage</div>';
  })
 
}, 250)})


