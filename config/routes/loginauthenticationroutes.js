const express = require('express');
const path = require('path');
const router = express(); 




router.get('/alumni-directory', (req,res) => {
  if(!req.isAuthenticated()) {
  res.redirect('/login?alert=not-logged-in');
  }
  else if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname,'..', '..', 'protected', 'alumni-directory.html'))
  }
});

router.get('/event-directory', (req,res) => {
  if(!req.isAuthenticated()) {
  res.redirect('/login?alert=not-logged-in');
  }
  else if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname,'..', '..', 'protected', 'event-directory.html'))
  }
});

router.get('/job-directory', (req,res) => {
  if(!req.isAuthenticated()) {
  res.redirect('/login?alert=not-logged-in');
  }
  else if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname,'..', '..', 'protected', 'job-directory.html'))
  }
});

router.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'contact-us.html'))
})

router.get('/services', (req, res) => {
  if(req.isAuthenticated()) {
  res.sendFile(path.join(__dirname,'..', '..', 'protected', 'services.html'))}
  else
  res.redirect('/login?alert=not-logged-in')
})

module.exports = router;