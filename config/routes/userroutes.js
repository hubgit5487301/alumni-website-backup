const express = require('express');
const path = require('path');

const router = express();
const user = require('../../models/users');
const jobs = require('../../models/jobs');
const events = require('../../models/events');
const { resizeimage } = require('../util');

router.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

router.get('/alumni-directory', (req, res) =>{
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'alumni-directory.html'));
})

router.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'profile.html'))
})

router.get('/users', async (req,res) => {
  try {
    const users = await user.find({}, {userid: 1, personname: 1, personimage: 1, usertype: 1 }).sort({personname: 1});
    const filteredUsers = users.filter(user => user.usertype !== 'admin');
    res.status(200).json(filteredUsers);
  }
  catch (err){
    res.status(500).json({error: 'Error getting users',err})
  }
})

router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'profile.html'))
})

router.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'contact-us.html'))
})

router.get('/my-profile-page', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'myprofile.html'))
})

router.get(`/myprofile-appli`, async (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'myprofile-appli.html'));
})

router.get('/my-profile/edit_profile_info', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'myprofile-info-edit.html'));
})

router.get(`/users/:userid`, async (req,res) =>{
  try {
    const userid = req.params.userid;
    const founduser = await user.findOne({userid}, {_id: 0, salt: 0, passwordhash: 0});
    if (founduser) {
      res.status(200).json(founduser);
    }
    else {
      res.status(404).json({message: 'user not found'});
    }
  }
  catch (err){
    console.error('error fetching user:',err);
    res.status(501).json({error: 'internal server error'});
  }
})

router.get('/alumni-search', async (req, res) => {
  const {personname, batch, branch } = req.query;
  if(!personname && !batch && !branch) {
    return res.status(200).json([]);
  }
  try{
    const results = await user.find({
      personname: { $regex: `^${personname}`, $options: 'i' },
      "details.batch": {$regex: `^${batch}`, $options: 'i' },
      "details.branch": {$regex: `^${branch}`, $options: 'i'}},
      {personname: 1, personimage: 1,userid: 1 , usertype: 1}
    );
  if(results === undefined){
    return res.status(200).json([]);
  }
  const filteredUsers = results.filter(user => user.usertype !== 'admin');
  res.status(200).json(filteredUsers);
  }
  catch(err) {
    res.status(500).json({error: 'internal servor error'});
  }
});

router.get('/my-profile', async (req, res) => {
  if(req.isAuthenticated) {
  const data = ({userid: req.user.userid, personname: req.user.personname, personimage: req.user.personimage, details: req.user.details, usertype: req.user.usertype});
  res.status(200).json(data);
  } 
  else {
    res.redirect(`/login?alert=not-logged-in`);
  }
})

router.get('/my-usertype', async (req, res) => {
  if(req.isAuthenticated()) {
    const data = ({ usertype: req.user.usertype });
    res.status(200).json(data);
  }
  else {
    res.redirect(`/login?alert=not-logged-in`);
  }
})

router.get('/my-userid', async (req, res) => {
  if(req.isAuthenticated()) {
    const data = ({ userid: req.user.userid });
    res.status(200).json(data);
  }
  else {
    res.redirect(`/login?alert=not-logged-in`);
  }
})

router.get('/user_logo', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user.personimage);
  }
  else {
    res.redirect(`/login?alert=not-logged-in`);
  }
});

router.get('/user_info', (req, res) => {
  if(req.isAuthenticated()) {
    const data = ({aboutme: req.user.details.aboutme, education: req.user.details.education, currentrole: req.user.details.currentrole, experience: req.user.details.experience, contactinfo: req.user.details.contactinfo})
    res.status(200).json(data);
  }
  else {
    res.redirect(`/login?alert=not-logged-in`);
  }
});

router.get(`/myprofile-posts`, async (req, res) => {
  const usertype = req.user.usertype;
  if(usertype === 'alumni' || usertype === 'admin') return res.sendFile(path.join(__dirname, '..', '..', 'protected', 'users', 'myprofile-posts.html'));
  else return res.redirect(`/protected/my-profile-page`)
})

router.get('/my-jobs-events-applied/:userid', async (req, res) => {
  try{
    const userid = req.params.userid;
    
    const all_jobs = await jobs.find({'applicants.applicant': userid },{_id: 1});
    const all_events = await events.find({'applicants.applicant': userid },{_id: 1});
    const data = ({all_jobs, all_events});
    res.status(200).json(data);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'});
  }
})

router.get('/my-jobs-events-posts/:userid', async (req, res) => {
  try{ 
  const userid = req.params.userid;
  const finduser = await user.findOne({userid}, {data: 1, usertype:1})
  res.status(201).json(finduser);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
}),

router.patch('/my-profile/edit-profile-pic', async (req, res) => {
  const {file64, userid} = req.body;
  const new_profile_pic = await resizeimage(file64, 60, 'webp', 100000)
  await user.updateOne(
    {"userid": userid},
    {$set: {"personimage": new_profile_pic}}
  ) ;
  res.status(200).json({message: 'Profile picture changed'});

})

router.patch('/update_details', async (req, res) => {
  try {
    const data = req.body;
    if(req.isAuthenticated()){
      const userid = req.user.userid;
      const update = await user.updateOne(
      {userid: userid},
      {
          $set: {
          "details.aboutme": data.aboutme,
          "details.education": data.education,
          "details.currentrole": data.currentrole,
          "details.experience": data.experience,
          "details.contactinfo": data.contactinfo
          }
      });
      if(update.modifiedCount>0) {
        return res.status(200).json({message: 'New details added successfully'})
      }
      else {
        return res.status(200).json({message: 'No changes made'});
      }
    }
    else {
      return res.redirect(`/login?alert=not-logged-in`);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal servor error', err});
  }
})

router.post('/my-profile/upload-resume', async (req, res) => {
  const user_id = req.user.userid;
  const file_64 = req.body.file64;
  const match = file_64.match(/^data:(.*);base64,/);
  if(match[1] == 'application/pdf')
  { const result = await user.updateOne(
      {userid: user_id}, 
      {$set: {"details.resume": file_64}
    })
    if(result) {
      return res.status(201).json({message: 'Uploaded Resume'})
    }
    else {
      return res.status(401).json({error: 'something went wrong'})
    }
  }
  else return res.status(500).json({error: 'file type not pdf'})
})

router.get('/my-profile/download-resume', async (req, res) => {
  try{
    const userid = req.user.userid;
    const result = await user.findOne({userid: userid}, {"details.resume": 1, personname: 1});

    if(result.details.resume !== 'empty') {
      return res.status(200).json({result, message: 'File Found'});
    }
    else {
      return res.status(200).json({error: 'File not found'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({err, error: 'internal server error'})
  }
})

router.get(`/job_users/:userid`, async (req,res) =>{
  try {
    const userid = req.params.userid;
    const founduser = await user.findOne({userid}, {personname: 1, "details.branch": 1, _id: 0});
    if (founduser) {
      res.status(200).json(founduser);
    }
    else {
      res.status(404).json({message: 'user not found'});
    }
  }
  catch (err){
    console.error('error fetching user:',err);
    res.status(501).json({error: 'internal server error'});
  }
})

router.get(`/event_users/:userid`, async (req,res) =>{
  try {
    const userid = req.params.userid;
    const founduser = await user.findOne({userid}, {personname: 1, "details.branch": 1, _id: 0});
    if (founduser) {
      res.status(200).json(founduser);
    }
    else {
      res.status(404).json({message: 'user not found'});
    }
  }
  catch (err){
    console.error('error fetching user:',err);
    res.status(501).json({error: 'internal server error'});
  }
})

router.get('/download-resume/:user_id', async (req, res) => {
  try{
    const userid = req.params.user_id
    const result = await user.findOne({userid: userid}, {"details.resume": 1, personname: 1});

    if(result.details.resume !== 'empty' && result.details.resume !== '' && result.details.resume !== null) {
      return res.status(200).json({result, message: 'File Found'});
    }
    else {
      return res.status(200).json({error: 'File not found'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({err, error: 'internal server error'})
  }
})

module.exports = router;  