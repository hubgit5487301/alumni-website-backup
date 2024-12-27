const express = require('express');
const path = require('path');

const router = express();
const events = require('../../models/events');
const user = require('../../models/users');
const { resizeimage } = require('../util')


router.get('/event-form', (req, res) => {
  const usertype = req.user.usertype;
  if(usertype === 'admin') return res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event-form.html'));
  else return res.redirect(`/protected/services`)
})

router.post('/submit-event', async (req, res) => {
  try{
    const {name, date, location, contact_info, event_des, event_file, event_logo} = req.body;
    const resizedLogo = await resizeimage(event_logo, 60, 'webp', 200000); 
    const logo = resizedLogo != null ? resizedLogo : undefined;
    const userid = req.user.userid;

    const event_date = new Date(date);
    const newEvent = new events({
      userid,
      name,
      date: event_date,
      location,
      contact_info: contact_info,
      event_des,
      event_file: event_file || undefined,
      event_logo: logo,
    })
    const eventDate = new Date(req.body.date);
    const findeventbydate = await events.findOne({date: eventDate});
    const findeventbyname = await events.findOne({name: name});
    if(findeventbydate) {
      if(!findeventbyname) {
        
        const saved_data = await newEvent.save();
        const event_id = saved_data._id.toString();

        await user.updateOne(
          {"userid": userid},
          {$push: {"data.event_ids": {event_id: event_id}}}) 

          return res.status(500).json({message: 'Data submitted'});
      }
      else {
        return res.status(500).json({message: 'This event exists already'})
      }
    }
    if(findeventbyname) {
      if(!findeventbydate) {
       const saved_data = await newEvent.save();
        const event_id = saved_data._id.toString();
        
        await user.updateOne(
          {"userid": userid},
          {$push: {"data.event_ids": {event_id: event_id}}}) 

        return res.status(200).json({message: 'Data submitted'});
      }
      else {
        return res.status(500).json({message: 'This event exists already'})
      }
    }
    const saved_data = await newEvent.save();
    const event_id = saved_data._id.toString();
    await user.updateOne(
          {"userid": userid},
          {$push: {"data.event_ids": {event_id: event_id}}}) 

    res.status(200).json({message: 'data submitted'});
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error:'failed to save data'});
  }
});

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

router.get(`/events/:event_id`, async (req,res) => {
  try{
    const _id = req.params.event_id;
    const found_event = await events.findOne({_id},{event_file: 0, applicants: 0});
    if(found_event) {
      return res.status(200).json(found_event);
    }
    else {
      return res.status(402).json({error: 'event not found'});
    }
  }
  catch(err) {
    console.log('error fetching event',err);
    res.status(502).json({error: 'internal servor error'});
  }
})

router.get(`/event`, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event.html'));
})

router.get('/event-file/:event_id', async (req, res) => {
  const event_id = req.params.event_id;
  try{
    const data = await events.findOne({_id: event_id}, {event_file: 1});
    if(data.event_file !== 'temp' && data.event_file !== null) {
      return res.status(200).json(data.event_file)
    }
    else {
      res.status(200).json({error: 'No event file was provided'})
    }
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error '})
  }
})

router.get('/event-search', async (req, res) => {
  let {name, date} = req.query;
  let results;
  try{
  if(date && !isNaN(Date.parse(date))) {
  const startDate = new Date(date + 'T00:00:00'); 
  const endDate = new Date(date + 'T23:59:59');  
  results = await events.find({
      name: { $regex: `^${name}`, $options: 'i' },
      date: { $gte: startDate, $lte: endDate}}, 
      {name: 1, date:1, event_logo:1 }
    );}
    else {
      results = await events.find({
        name: { $regex: `^${name}`, $options: 'i' }}, 
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

router.get('/homeevents', async (req,res) => {
  try {
    const send_events = await events.find({}, {name: 1, date:1, event_logo:1 }).sort({ date:1});
     res.status(200).json(send_events) ;
  }
  catch(err) {
    console.error('error getting events', err);
    res.status(503).json({error:'internal server error'})
  }
})

router.get('/event-directory', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event-directory.html'))
})

router.post('/apply-event', async (req, res) => {
  try{
    const { userid, event_id} = req.body;
    const findevent = await events.findOne({"applicants.applicant": userid, "_id": event_id});
    if(findevent) return res.status(409).json({error: 'Already applied'});

    await events.updateOne(
      {"_id": event_id},
      {$push: {"applicants": {applicant: userid}}}
    )
    return res.status(201).json({message: 'Applied to event'})
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.delete(`/myprofile-posts/:userid/delete-event/:event_id`, async (req, res) => {
  try{
    const {userid, event_id } = req.params;
    const deleteevent = await events.deleteOne({_id: event_id});
    const deleteeventuser = await user.updateOne(
      {"userid": userid},
      {$pull: {"data.event_ids": {"event_id": event_id}}}
    )
    if(deleteevent && deleteeventuser) {
      return res.status(200).json({message: 'event post deleted'})
    }
    return res.status(404).json({error: 'event not found'})
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})

router.get('/applicants/event', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'protected', 'events', 'event-applicants.html'))
})

router.get('/applicants/event/:event_id', async (req,res) => {
  try{
    const event_id = req.params.event_id;
    const applicants_data = await events.find({_id: event_id}, {applicants: 1});
    const event_data = await events.findOne({_id: event_id},{event_file: 0});
    if(applicants_data.length > 0) {
      const message = 'applicants found';
      data = ({event_data, applicants_data, message})
      return res.status(200).json(data);
    }
    else {
      return res.status(205).json({error: 'no applicants found'});
    }
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'internal server error'})
  }
})


module.exports = router;