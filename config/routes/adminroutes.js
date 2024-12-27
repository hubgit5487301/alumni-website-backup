const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const user = require('../../models/users');
const event = require('../../models/events');
const job = require('../../models/jobs');

const router = express();
const {usertype_and_batchSet, startObjectId, endObjectId} = require('../util');
const events = require('../../models/events');

router.get('/manage_jobs', (req, res) => {
  if(req.user.usertype === 'admin')
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'jobs.html'))
  })

router.get('/manage_users', (req, res) => {
  if(req.user.usertype === 'admin')
  res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'users.html'))
  })

router.get('/', (req, res) => {
  if(req.user.usertype === 'admin')
    return res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'admin.html'))
  else {
    return res.redirect(`/dashboard`) 
  }
  })

router.get('/manage_events', (req, res) => {
  if(req.user.usertype === 'admin')
res.sendFile(path.join(__dirname, '..', '..', 'admin_console', 'events.html'))
})


router.get('/get_stats', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const session = mongoose.connection.collection('sessions');
      const active_users = await session.countDocuments();
      const total_users = await user.countDocuments();
      const total_events = await event.countDocuments();
      const total_jobs = await job.countDocuments();

      const today_events = await event.countDocuments({_id: {$gte: startObjectId, $lt: endObjectId}});
      const today_jobs = await job.countDocuments({_id: {$gte: startObjectId, $lt: endObjectId}})
      const stats_data = ({
        total_users, total_events, total_jobs, active_users, today_events, today_jobs
      })
      return res.status(200).json(stats_data);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/admin_data', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const admin_data = await user.find({usertype: 'admin', verified: true, userid: {$ne : '248650'}}, {userid: 1, personimage: 1, personname: 1});
      return res.status(200).json(admin_data);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error : 'internal server error'});
  }
})

router.patch('/revoke', async (req, res) => {
  try {
    if(req.user.usertype === 'admin') {
      const userid = req.query.userid;
      if(userid === '248650') {return res.status(404).json({message: 'unauthorized'})};
      const {usertype, batch} = usertype_and_batchSet(userid);
      await user.updateOne(
        {userid: userid},
        {$set: {usertype: usertype}})
      return res.status(200).json({message: 'admin rights revoked'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error : 'internal server error'});
  }
})

router.get('/user_name', async (req, res) => {
  if(req.isAuthenticated()) {
    const data = ({ personname: req.user.personname });
    res.status(200).json(data);
  }
  else {
    res.redirect(`/login?alert=not-logged-in`);
  }
})

router.get('/today_new_users_data', async (req, res) => {
  try {
    if(req.user.usertype === 'admin') {
      const today_new_users = await user.find({_id: {$gte: startObjectId, $lt: endObjectId}},{userid: 1, personimage: 1, personname: 1});
      return res.status(200).json(today_new_users)
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error : 'internal server error'});
    }
})

router.delete('/remove_user', async (req, res) => {
  try {
    const userid = req.query.userid;
    if(req.user.usertype === 'admin') {
      await user.deleteOne({userid:userid});
      return res.status(200).json({message: 'user deleted'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/today_new_events_data', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const today_events = await events.find({_id: {$gte: startObjectId, $lt: endObjectId}}, {name: 1, event_logo: 1, date: 1});
      return res.status(200).json(today_events);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error : 'internal server error'});
    }
})

router.delete('/remove_event', async (req, res) => {
  try {
    const _id = req.query._id;
    if(req.user.usertype === 'admin') {
      const data = await events.findOne({_id:_id},{userid: 1});
      const userid = data.userid;

      await user.updateOne(
        {userid: userid},
        {$pull: {"data.event_ids": {event_id: _id}}})
      await events.deleteOne({_id:_id});
      return res.status(200).json({message: 'event deleted'})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/today_new_jobs_data', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const today_jobs = await job.find({_id: {$gte: startObjectId, $lt: endObjectId}}, {job_tittle: 1, job_company_logo: 1, job_deadline: 1});
      return res.status(200).json(today_jobs);
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.delete('/remove_job', async (req, res) => {
  try {
    const _id = req.query._id;
    const data = await job.findOne({_id:_id},{userid: 1});
    const userid = data.userid;
    
    if(req.user.usertype === 'admin') {
      await user.updateOne(
        {userid: userid},
        {$pull: {"data.job_ids": {job_id: _id}}})

      await job.deleteOne({_id:_id});
      return res.status(200).json({message: 'job deleted'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/search_users', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const query = req.query;
      const result = await user.find({
        personname: { $regex: `^${query.personname}`, $options: 'i' },
        userid: {$regex: `^${query.userid}`,  $options: 'i'},
        usertype: {$ne: 'admin'}
      }, {userid: 1, personname: 1, usertype: 1, personimage: 1})
      return res.status(200).json(result); 
    }

  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/users', async (req,res) => {
  try {
    const users = await user.find({}, {userid: 1, personname: 1, personimage: 1, usertype: 1 }).sort({personname: 1});
    const filteredUsers = users.filter(user => user.usertype !== 'admin');
    res.status(200).json(filteredUsers);
  }
  catch (err){
    console.log(err);
    res.status(500).json({error: 'Error getting users',err})
  }
})

router.patch('/set_admin', async (req, res) => {
  try{
    if(req.user.usertype === 'admin') {
      const userid = req.query.userid;
      await user.updateOne({userid: userid},{
        $set: {usertype: 'admin'}
      })
      return res.status(200).json({message: 'made admin'});
    }
  }catch (err){
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/events', async (req, res) =>{
  try{
    const send_events = await events.find({}, {name: 1, date:1, event_logo:1 }).sort({ date:1});
    res.status(200).json(send_events) ;
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'error getting events',err});
  }
})

router.get('/search_events', async (req, res) => {
  let {eventname, date} = req.query;
  let results;
  try{
  if(date && !isNaN(Date.parse(date))) {
  const startDate = new Date(date + 'T00:00:00'); 
  const endDate = new Date(date + 'T23:59:59');  
  results = await events.find({
      name: { $regex: `^${eventname}`, $options: 'i' },
      date: { $gte: startDate, $lte: endDate}}, 
      {name: 1, date:1, event_logo:1 }
    );}
    else {
      results = await events.find({
        name: { $regex: `^${eventname}`, $options: 'i' }}, 
        {name: 1, date:1, event_logo:1 }
      );}
    

  if(results.length === 0){
    return res.status(200).json([]);
  }
  res.status(200).json(results);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal servor error'});
  }
});

router.get('/jobs', async(req, res) => {
  try{
    const jobs = await job.find({}, {job_tittle: 1, job_company_name: 1, job_company_logo: 1, job_deadline: 1, job_type: 1, job_level: 1}).sort({job_deadline: 1});
    res.status(200).json(jobs);
  }
  catch(err) {
    console.log(err);
  }
})

router.get(`/search_jobs`, async (req, res) => {
  const {jobname, company } = req.query;
  try{
    const results = await job.find(
      { job_tittle: { $regex: `^${jobname}`, $options: 'i' },
        job_company_name: { $regex: `^${company}`, $options: 'i' }
      },
      {job_tittle: 1, job_company_name: 1, job_level: 1, job_type: 1, job_deadline: 1, job_company_logo: 1});
    if(results.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(results);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})


module.exports = router;