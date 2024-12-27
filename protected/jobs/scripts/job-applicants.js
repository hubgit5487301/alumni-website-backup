import { API_BASE_URL } from "../../protected-scripts/config.js";
import { formatjobdate , getdataonevent as getdata, download as resume_download} from "../../protected-scripts/util.js";

const urlParam = new URLSearchParams(window.location.search);
const job_id = urlParam.get('job_id');

fetch(`${API_BASE_URL}/protected/applicants/job/${job_id}`)
.then(response => {
  if(!response.ok) {
    throw new Error('response not ok');
  }
  return response.json();
})
.then( async data => {
  const applicants = data.applicants_data[0].applicants;
  const jobHtml = `<div class="job-page js-job-page">
        <div class="first-view">
          <img class="job-pic" src="${data.job_data.job_company_logo}" loading="lazy">
          <div class="basic-data">
            <p class="name">${data.job_data.job_tittle}</p>
            <div class="basic-data-details">
              <p>Employer : ${data.job_data.job_company_name}</p>
              <p>Last date to apply: ${formatjobdate(data.job_data.job_deadline)}</p>
              <p>Location: ${data.job_data.job_location}</p>
              <p>Job Type: ${data.job_data.job_level}</p>
              <p>Application Email: ${data.job_data.job_app_email}</p>
              <p>Salary (Monthly): ${data.job_data.job_salary} Rs</p>
              <p>Total Applicants: ${applicants.length}</p>
            </div>
          </div>
        </div>
         <div class="job-headings">
            <h1>Applicants</h1>
          </div>
        <div class="job-requirement js-applicants">
          </div>
`;

  document.querySelector('.js-job-page').innerHTML = jobHtml;

  const sortedApplicantsData = await Promise.all(
    Object.values(applicants).map(async (applicant) => {
      const data = await getdata(`job_users/${applicant.applicant}`);
      return { applicant: applicant.applicant, ...data };
    })
  );
  sortedApplicantsData.sort((a, b) => a.personname.localeCompare(b.personname));

  let applicant_Html = '';
  sortedApplicantsData.forEach(async (applicants) => {
    
    applicant_Html += `
            <div class="req-text">
              <p class="job-des-text-id">${applicants.personname}</p>
              <p class="job-des-text-id">${applicants.applicant}</p>
              <p class="job-des-text-id">${applicants.details.branch}</p>  
              <p class="resume-download js-view-profile" view-profile-id="${applicants.applicant}">View Profile</p>
              <div class="resume-download js-resume-download" download-resume="${applicants.applicant}"> Download Resume</div>
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

    const download_Button = document.querySelectorAll('.js-resume-download');
    download_Button.forEach(download_Button => {
      download_Button.addEventListener('click', async ()=> {
        const userid = download_Button.getAttribute('download-resume');
        const data = await getdata(`download-resume/${userid}`);
        if(data.message === 'File Found') {
          const file64 = data.result.details.resume;
          const filetype = 'application/pdf'
          resume_download(file64, filetype, `${userid}.pdf`);
        }
        else if(data.error === 'File not found') {
          alert('No file was found')
        }
      })
    }) 
  })
.catch(err => {
  console.log(err);
})
