import {getdataonevent as getdata, load_content, search} from '../../protected-scripts/util.js';

const urlParams = new URLSearchParams(window.location.search);
const branch = urlParams.get('branch');
document.querySelector('.top-heading').innerHTML = `${branch} Question Papers`

const search_button = document.querySelector('.js-submit-button')
const search_enter = document.querySelector('.search-box');

search_button.addEventListener('click', () => search('qpapers','.js-search-name','.js-search-sem','.js-search-subject', 'resources_search', branch));
search_enter.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    search('qpapers','.js-search-name','.js-search-sem','.js-search-subject', 'resources_search', branch);
  }
});

const data = await getdata(`resources/${branch}&qpapers`);

load_content(data, 1, '.js-content-1',`resources/download`);
load_content(data, 2, '.js-content-2',`resources/download`);
load_content(data, 3, '.js-content-3',`resources/download`);
load_content(data, 4, '.js-content-4',`resources/download`);
load_content(data, 5, '.js-content-5',`resources/download`);
load_content(data, 6, '.js-content-6',`resources/download`);
load_content(data, 7, '.js-content-7',`resources/download`);
load_content(data, 8, '.js-content-8',`resources/download`);


