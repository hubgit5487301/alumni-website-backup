import { API_BASE_URL } from "../../protected-scripts/config.js";
import { upload, inputCheck } from "../../protected-scripts/util.js";

let file = undefined;

const allowed_files = 'application/pdf'
upload('.js-file-input', allowed_files, false, '.js-file-input', (file64) => {
  file = file64;
})


document.querySelector('.js-submit-button').addEventListener('click', (e) => {
  e.preventDefault();
  const file_name= document.querySelector('.js-file-name').value;
  const tags = document.querySelector('.js-search-tags').value;
  const branch= document.querySelector('.js-branch').value;
  const file_type = document.querySelector('.js-file-type').value;
  const sem = document.querySelector('.js-sem').value;
  const subject = document.querySelector('.js-subject').value;

  const fields = [
    {value: file_name, selector: '.js-file-name'},
    {value: tags, selector: '.js-search-tags'},
    {value: branch, selector: '.js-branch'},
    {value: file_type, selector: '.js-file-type'},
    {value: sem, selector: '.js-sem'},
    {value: subject, selector: '.js-subject'},
    {value: file, selector: '.js-file-input'}
  ]
  
  const inputcheck = inputCheck(fields);
  if(inputcheck === true ) {
    alert('provide all details');
    return;
  }

  const data = ({
    file_name, tags, branch, file_type, sem, subject, file
  })

  fetch(`${API_BASE_URL}/protected/submit_resource`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if(!response.ok) {
      throw new Error('Response not ok')
    }
    return response.json()
  })
  .then(data=> {
    if(data.message = 'File Uploaded') {
      alert(data.message);
    }
    else {
      alert('something went wrong')
    }
  })
  .catch(err => {
    console.log(err)
  })


})