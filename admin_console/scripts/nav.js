
const menu = document.querySelector('.js-menu');
const menuHtml = `
        <a href="/dashboard"><img class="college-logo" src="/images/logo.webp">
        <a href="/admin" class="nav js-admin-page">Admin</a>
        <a href="/admin/manage_users" class="nav js-users-page">Manage Users</a>
        <a href="/admin/manage_events" class="nav js-events-page">Manage Events</a>
        <a href="/admin/manage_jobs" class="nav js-jobs-page">Manage Jobs</a>
      `
menu.innerHTML= menuHtml;