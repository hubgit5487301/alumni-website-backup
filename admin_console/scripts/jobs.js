import { job_search as search, getdataonevent as getdata, formatjobdate, deletedataonevent as deletedata } from "./util.js";

const all_jobs = await  getdata('jobs');

const list_jobs = document.querySelector('.js-list-jobs')

if(all_jobs.length === 0) {
  list_jobs.innerHTML = `<div class="text-info">No jobs found</div>`
}
else if(all_jobs.length > 0) {
  let jobHtml = '';
  all_jobs.forEach(job => {
    jobHtml += `
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
  });
  list_jobs.innerHTML = jobHtml;
      
  const search_button = document.querySelector('.js-search-button');
  search_button.addEventListener('click', () => {
    search('.js-search-jobname','.js-search-company','/search_jobs');
  })
  const search_jobname = document.querySelector('.js-search-jobname');

  search_jobname.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      search('.js-search-jobname','.js-search-company','search_jobs').then(()=> {setjob()})
    }
  })

  const search_company = document.querySelector('.js-search-company');
  search_company.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      search('.js-search-jobname','.js-search-company','search_jobs').then(()=> {setjob()})
    }
  })
  setjob()
}



function setjob() {

  const job_button = document.querySelectorAll('.js-job-data');
  job_button.forEach(button => {
    button.addEventListener('click', () => {
      const jobid = button.getAttribute('job-id');
      window.location.href = `/protected/job?_id=${jobid}`
    })
  })
  const remove_button = document.querySelectorAll('.js-remove-button');
  remove_button.forEach(button => {
    button.addEventListener('click', async () => {
      const jobResponse = confirm('Delete job')
      if(jobResponse) {
        const jobid = button.getAttribute('remove-button');
        const data = await deletedata(`remove_job?_id=${jobid}`, '');
        if(data.message === 'job deleted') {
          const jobelement = document.querySelector(`.data.js-job-data[job-id="${jobid}"]`);
          const removeelement = document.querySelector(`.revoke-button.js-remove-button[remove-button="${jobid}"]`);
          if(jobelement) jobelement.remove();
          if(removeelement) removeelement.remove();
          if(list_jobs.innerHTML.trim() === ''){
            list_jobs.innerHTML = '<div class="text-info">No jobs found</div>' }
        }
      }
    })
  })
}