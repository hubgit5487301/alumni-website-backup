import { getdataonevent as getdata } from "../../protected-scripts/util.js";

const data = await getdata('my-usertype');

if(data.usertype === 'admin') {
  const upload_button = document.querySelectorAll('.js-upload-file');
  const grid = document.querySelectorAll('.js-branch-button');
  grid.forEach( grid => {
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  })
  upload_button.forEach( button => {
    button.style.display = 'block';
    button.addEventListener('click', () => {
      window.location.href = '/protected/upload_resources'
    })
  })
}

function click(input, address) {
  document.querySelectorAll(input).forEach( button => {
    button.addEventListener('click', async () => {
      const branch = button.getAttribute('id');
      window.location.href = `/protected/${address}/?branch=${branch}`;
  })
})
}

click('.js-notes', 'notes');
click('.js-ques-paper', 'ques_papers');