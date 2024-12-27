const crypto = require('crypto');
const sharp = require('sharp');
const emailuser = process.env.user;
const pass = process.env.pass;
const service = process.env.service;
const verificationtoken = require('../models/verificationtoken');
const user = require('../models/users');
const nodemailer = require('nodemailer');
const API_BASE_URL = process.env.API_BASE_URL;
const mongoose = require('mongoose')

function hashPassword(getpassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordhash = crypto.pbkdf2Sync(getpassword, salt, 1000, 64, 'sha256').toString('hex');
  return {salt, passwordhash };
}

function hashloginPassword (password, salt) {
  const passwordhash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  return passwordhash;
}


function verifyPassword(password, storedhash, salt) {
  const hashinput = hashloginPassword(password, salt);
  return hashinput == storedhash;
}


function isAuthenticated (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
    res.redirect('/login?alert=not-logged-in')
}

async function resizeimage(inputimage, quality, format, size) {
  if(!inputimage) {
    return null;
  }

  const match = inputimage.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)/);
  if(!match) {
    throw new Error('invalid image');
  }

  const base64body = match[2];
  const padlength = (base64body.match(/=+$/) || [''])[0].length;
  const sizeinbytes = ((base64body.length * 3) / 4 - padlength);

  const imagetype = match[1];
  const imagebuffer = Buffer.from(base64body, 'base64');const metadata = await sharp(imagebuffer).metadata();
  let { width, height } = metadata;
  let resizedbuffer = '' ;
  try {
    resizedbuffer = imagebuffer;
  while ( sizeinbytes >= size && quality >1) {
    const newWidth = Math.floor(width * 0.3);
     resizedbuffer = await sharp(resizedbuffer)
     .resize({width: newWidth})
    .toFormat(format, {quality})
    .toBuffer();

    const newbase64 = resizedbuffer.toString('base64');
    const newsize = (newbase64.length * 3) / 4 - (newbase64.match(/=+$/) || [''])[0].length;
    if(newsize <= size) {
      break;
    }
     quality -= 10 ;
  }
    const resizedBase64String = `data:image/${imagetype};base64,${resizedbuffer.toString('base64')}`;
    return resizedBase64String;
 }
  catch(err) {
    console.error('error resizing image', err);
    throw err;
  }
}

async function generatetoken(userid) {
  try{
    const newuser = await user.findOne({userid: userid});
    if(!newuser) {
      console.log('no user found');
      throw new Error('user not found');
    }

    const token = crypto.randomBytes(16).toString('hex');
    const newverificationtoken = new verificationtoken({
      userId: userid,
      token: token,
      createdAt: Date.now(),
    });
    console.log(newverificationtoken);
    const result = await newverificationtoken.save();
    console.log(result)
    return token;
  }
  catch(err) {
    console.log(err);
    throw err;
  }
  
}

async function sendlink(email, token) {
  try{
    const transporter = nodemailer.createTransport({
      host: service,
      port: 465,
      secure: true,
      auth: {
        user: emailuser,
        pass: pass,
      }
    })
    const mailoption = {
      from: emailuser,
      to: email,
      subject: 'Account Verfication',
      text: `Your acount verifiction link is ${API_BASE_URL}/verify_account?token=${token}. It will expire in 10 minutes`,
    }
    const info = await transporter.sendMail(mailoption);
    console.log('Email sent: %s', info.messageId);
  }
  catch(err) {
    console.log(err);
    throw err;
  }
}


function setBranchValue (textinput) {
  const match = textinput.match((/\d([A-Z]+)\d/));
  if (match && match[1]) {
    const idbranch = match[1];
    if(idbranch === 'CSE' || idbranch === 'cse') {
      return 'CSE';
    }
    else if ( idbranch === 'ME' || idbranch === 'me') {
      return 'ME';
    }
    else if ( idbranch === 'CE' || idbranch === 'ce') {
      return 'CE';
    }
    else if ( idbranch === 'EE' || idbranch === 'ee') {
      return 'EE';
    }
    else if ( idbranch === 'ECE' || idbranch === 'ece') {
      return 'ECE';
    }
  }
}

function usertype_and_batchSet (input) {
  let admissionyear = parseInt(input.substring(0, 2));
  const currentyear = parseInt((new Date().getFullYear()).toString().slice(-2));
  let usertype = '';

  if(currentyear >= admissionyear+4) {
    usertype = 'alumni';
  }
  else {
    usertype = 'student';
  }
  admissionyear = admissionyear + 2000;
  const batch = admissionyear.toString();
   
  return {usertype, batch};
}

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

const startObjectId = mongoose.Types.ObjectId.createFromTime(startOfToday / 1000);
const endObjectId = mongoose.Types.ObjectId.createFromTime(endOfToday / 1000);


module.exports = { hashPassword, setBranchValue, verifyPassword, isAuthenticated, resizeimage, generatetoken, sendlink, usertype_and_batchSet, startObjectId, endObjectId};