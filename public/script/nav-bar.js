import { API_BASE_URL } from "./config.js";
//import { darkMode} from "/script/util.js";
let headerhtml = `
          <div class="left-content">
              <a href="/dashboard" class="home-link">
                <button class="home-button">
                  <img src="/images/logo.webp" class="logo-icon">
                  Alumni Portal</button> 
              </a>
            </div>
            <div class="middle-content">
              <a class="dashlink" href="/dashboard">
                <img class="home-icon js-nav-icon" src="/images/home.svg">
                <div class="tooltip">Dashboard</div></a>
              <a class="serviceslink" href="/services">
                <img class="services-icon js-services-icon" src="/images/services.svg">
                <div class="tooltip">Services</div></a>
              <a class="alumnilink" href="/alumni-directory">
                <img class="friends-icon js-nav-icon" src="/images/friends.svg">
                <div class="tooltip">ALumni directory</div></a>
              <a class="eventlink" href="/event-directory">
                <img class="events-icon js-nav-icon" src="/images/events.svg">
                <div class="tooltip">Event directory</div></a>
              <a class="joblink" href="/job-directory">
                <img class="job-icon js-nav-icon" src="/images/job.svg">
                <div class="tooltip">Career services</div></a>
              <a class="contactlink" href="/contact-us">
                <img class="contact-us-icon js-nav-icon" src="/images/contact-us.svg">
                <div class="tooltip">Contact us</div></a>
            </div>
          <div class="right-content">
            <a class="login-link" href="login">
              <p class="Hi js-Hi" >Login</p></a>
          </div>
        ` ;

document.querySelector('.js-top-box').innerHTML = headerhtml;

const footerhtml =
      `
            <div class="footer-left-content">
                <p>Copyright <span>&#169;</span> 2024</p>
            </div>
            <div class="footer-middle-content">
              <div class="social-links">
                <a href="http://www.linkedin.com/company/ietagra/?originalSubdomain=in" >
                <img class="social-icon" src="images/linkedin.svg" alt="linkedin"></a>
                <a href="http://www.instagram.com/iet_khandari_agra_official/" >
                <img class="social-icon" src="images/instagram.svg" alt="linkedin"></a>
                <a href="http://www.facebook.com/IETDBRAUAGRA/" >
                <img class="social-icon" src="images/facebook.svg" alt="linkedin"></a>
                <!--<button class='dark-mode-button js-dark-mode-button'>mode</button>-->
              </div>
            </div>
            <div class="footer-right-content">
              <a class="footer-policy" href="">Terms | Privacy Policy</a>
            </div> `
        
document.querySelector('.js-bottom').innerHTML = footerhtml;

