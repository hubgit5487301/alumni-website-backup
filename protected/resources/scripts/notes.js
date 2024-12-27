import {getdataonevent as getdata, load_content, search} from '../../protected-scripts/util.js';

const urlParams = new URLSearchParams(window.location.search);
const branch = urlParams.get('branch');
document.querySelector('.top-heading').innerHTML = `${branch} Notes`


const search_button = document.querySelector('.js-submit-button')
const search_enter = document.querySelector('.search-box');

search_button.addEventListener('click', () => search('Notes','.js-search-name','.js-search-sem','.js-search-subject', 'resources_search', branch));
search_enter.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    search('Notes','.js-search-name','.js-search-sem','.js-search-subject', 'resources_search', branch);
  }
});


const data = await getdata(`resources/${branch}&Notes`);

load_content(data, 1, '.js-content-1');
load_content(data, 2, '.js-content-2');
load_content(data, 3, '.js-content-3');
load_content(data, 4, '.js-content-4');
load_content(data, 5, '.js-content-5');
load_content(data, 6, '.js-content-6');
load_content(data, 7, '.js-content-7');
load_content(data, 8, '.js-content-8');


