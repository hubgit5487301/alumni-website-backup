import {getdataonevent as getdata, deletedataonevent as deletedata, updatedataonevent as patchdata} from './util.js'


function setuser() {
  const user_button = document.querySelectorAll('.js-user-data');
  user_button.forEach(button => {
    button.addEventListener('click', () => {
      const userid = button.getAttribute('user-id');
      window.location.href = `/protected/profile?userid=${userid}`
    })
  })
  const set_admin = document.querySelectorAll('.js-set-admin');
  set_admin.forEach(button => {
    button.addEventListener('click',async () => {
      const userResponse = confirm('Are you sure you want to set user as an admin')
      if(userResponse) {
        const userid = button.getAttribute('user-admin')
        const data = await patchdata(`set_admin?userid=${userid}`);
        if(data.message === 'made admin') {
          const userelement = document.querySelector(`.data.js-user-data[user-id="${userid}"]`);
          const removeelement = document.querySelector(`.revoke-button.js-remove-button[remove-button="${userid}"]`);
          const adminelemet = document.querySelector(`.set-admin.js-set-admin[user-admin="${userid}"]`)
          if(userelement) userelement.remove();
          if(removeelement) removeelement.remove();
          if(adminelemet) adminelemet.remove();
          if(list_users.innerHTML.trim() === ''){
            list_users.innerHTML = '<div class="text-info">No users found</div>'
            list_users.style.gridTemplateColumns= '1fr' }
        }
      }
    })
  })
  const remove_button = document.querySelectorAll('.js-remove-button');
  remove_button.forEach(button => {
    button.addEventListener('click', async () => {
      const userResponse = confirm('Delete User')
      if(userResponse) {
        const userid = button.getAttribute('remove-button');
        const data = await deletedata(`remove_user?userid=${userid}`, '');
        if(data.message === 'user deleted') {
          const userelement = document.querySelector(`.data.js-user-data[user-id="${userid}"]`);
          const removeelement = document.querySelector(`.revoke-button.js-remove-button[remove-button="${userid}"]`);
          const adminelemet = document.querySelector(`.set-admin.js-set-admin[user-admin="${userid}"]`)
          if(userelement) userelement.remove();
          if(removeelement) removeelement.remove();
          if(adminelemet) adminelemet.remove();
          if(list_users.innerHTML.trim() === ''){
            list_users.innerHTML = '<div class="text-info">No users found</div>';
            list_users.style.gridTemplateColumns= '1fr'}
        }
      }
    })
  })
}


const list_users = document.querySelector('.js-list-users');
let all_users = []
async function fetch_users() {
  all_users = await getdata('users');
  list_users.innerHTML = render_users(all_users);
}

window.addEventListener('load', async () => {
  await fetch_users();
  setuser();
})


let find_data = '';
const search_button = document.querySelector('.js-search-button');

const personname = document.querySelector('.js-search-username');
const userid= document.querySelector('.js-search-userid');
search_button.addEventListener('click', () => {
  find_data = find();
  list_users.innerHTML = render_users(find_data);
})
personname.addEventListener('keydown', (e)=> {
  if(e.key === 'Enter') {
    find_data =  find();
    list_users.innerHTML = render_users(find_data);
  }
})
userid.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
    find_data = find();
    list_users.innerHTML = render_users(find_data);
  }
})

function render_users (data) {
  let html_data = '';
  if(data.length > 0) {
    list_users.style.gridTemplateColumns= '8fr 1fr 1fr';
  data.forEach(user => {
    html_data += `
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
  });
  return html_data;
  }
  else if(data.length === 0){
    const no_html = '<div>No users found</div>';
    list_users.style.gridTemplateColumns= '1fr';
    return no_html;
  }
}


function find() {
  if(personname.value && userid.value) {  
    const match = all_users.filter(user => (user.personname.toLowerCase().startsWith(personname.value.toLowerCase()))&& user.userid.toLowerCase().startsWith(userid.value.toLowerCase()))
    return match;
  }
  else if(personname.value) {
    const match = all_users.filter(user => user.personname.toLowerCase().startsWith(personname.value.toLowerCase()))
    return match;
  }
  else if(userid.value) {
    const match = all_users.filter(user => user.userid.toLowerCase().startsWith(userid.value.toLowerCase()))
    return match;
  }
   return all_users;
}