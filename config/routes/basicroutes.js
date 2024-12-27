const emailuser = process.env.user;
const pass = process.env.pass;
const service = process.env.service;

const express = require('express');
const path = require('path')
const router = express();

const user = require('../../models/users');
const otps = require('../../models/otps');

const passport = require('../../config/passport-config');


const {hashPassword, setBranchValue, generatetoken, sendlink, usertype_and_batchSet} = require('../util');

const nodemailer = require('nodemailer');
const verificationtoken = require('../../models/verificationtoken');

router.get('/verify_account', async (req, res) => {
  try{
    const token = req.query.token;
    const findtoken = await verificationtoken.findOne({token: token}, {userId: 1, createdAt: 1});
    if(findtoken === null) {
      return res.redirect('/login?alert=Link-not-found');
    }
    if((new Date(findtoken.createdAt).getTime() + 60 * 10 * 1000) < Date.now()) {
      await verificationtoken.deleteOne({token: token});
      const userdata = await user.findOne(
        {userid: findtoken.userId},
        {email: 1, userid:1});
      if(userdata) {
        const newtoken = await generatetoken(userdata.userid);
        await sendlink(userdata.email, newtoken);
      }
      return res.redirect('/login?alert=Link-expired');
    }
    const update_verified = await user.updateOne(
      {userid: findtoken.userId},
      {$set: {verified: true}})
      if (update_verified.matchedCount === 0){
        return res.redirect('/login?alert=User-not-found')
      }
    await verificationtoken.deleteOne({token: token});
    return res.redirect('/login?alert=account-verified')
  }
  catch(err) {
    console.log(err);
    return res.status(5000).json('internal server error')
  }
})

router.post('/send-otp' ,async (req, res) => {
  try {
    const userid = req.body.userid;
    const resetuser = await user.findOne({userid});
    if(!resetuser) {
      return res.status(200).json({message: 'User not found'});
    }
    const random = Math.floor(100000 + Math.random() * 900000);

    const findoldotp = await otps.find({"data.userid": userid});
    if(findoldotp) {
      await otps.deleteMany(
        {"data.userid": userid}
      )
    }
    const test = new otps(
      {"data.userid": userid,
      "data.otp": random}
    );
    const result = await test.save();
    if(result) {
      const useremail = resetuser.email;
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
        to: useremail,
        subject: 'Reset Password',
        text: `Your otp to reset your account password is ${random}. It will expire in 10 minutes`
      }
      transporter.sendMail(mailoption, (err, info) => {
        if(err) {
          console.error(err);
          return res.status({error : 'failed'})
        }
        else {
          console.log('otp email sent:' +info.response);
          res.status(200).json({message: 'OTP sent'});
        }
      })
    }
    else {
      console.log('something went wrong')
      res.status(404).json({error: 'something went wrong'});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
  }
})

router.get('/verify-otp', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..',  'public', 'reset-password.html'));
})

router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname,'..', '..',  'public', 'forgot-password.html'));
})

router.post('/verify-otp-input', async (req, res) => {
  try {
    if(!req.body) {
      return res.status(500).json({error: 'Invalid request'});
    }
    const userid = req.body.userid;
    const user_otp = parseInt(req.body.otpinput);
    const result = await otps.findOne({"data.userid": userid});
    

    if(!result) {
      return res.status(200).json({message: 'OTP not found'});
    }
    const otp = parseInt(result.data.otp);
    if ((new Date(result.createdAt).getTime() + 10 * 60 * 1000) < Date.now()) {
      console.log('hey')
      await otps.deleteOne({"data.userid": userid});
      return res.status(200).json({message: 'OTP has expired'});
    }
    if( otp === user_otp) {
      await otps.deleteOne({"data.userid": userid});
      return res.status(200).json({message : 'Verfied'});
    }
    else {
      return res.status(200).json({error: 'Invalid OTP'});
    }
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({error: 'failed to comply'})
  }
})

router.post('/change-password', async (req, res) => {
  try {
    const userid = req.body.userid;
    const pass = req.body.pass;
    const {salt, passwordhash} = hashPassword(pass);
    const result = await user.updateOne( 
      {userid: userid},
      {$set: { salt: salt, passwordhash: passwordhash}}
    );
    if(result.modifiedCount === 0) {
      return res.status(404).json({error: 'user not found'});
    }
    res.status(200).json({message: 'Password changed'})
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
})

router.post('/submit-alumni', async (req, res) => {
  try{
    const { personname, userid, email, getpassword } = req.body;
    const {salt, passwordhash} = hashPassword(getpassword);
    const branch =  setBranchValue(userid);
    const {usertype, batch} =  usertype_and_batchSet(userid);
    const newdetails = {
      batch: batch,
      branch: branch,
      aboutme:  undefined,
      education:  undefined,
      currentrole: undefined,
      experience:  undefined,
      contactinfo: undefined,
      resume: undefined,
      };

    const newUser = new user({
      personname,
      userid,
      usertype: usertype,
      email,
      userprivacy: 'public',
      salt,
      passwordhash,
      details: newdetails,
      verified: false,
    });
    
    const finduserbyuserid = await user.findOne({"userid":userid});
    const finduserbyuseremail = await user.findOne({"email":email});
    if(!finduserbyuserid && !finduserbyuseremail) {
      await newUser.save();
      const token = await generatetoken(userid);
      sendlink(email, token);
      res.status(200).json({message:'Data submitted'});
    }
    
    if(finduserbyuserid){
      return res.status(409).json({message:'user already exists'})
      }
    
    if(finduserbyuseremail) {
      return res.status(409).json({message:'email already exists'})
      }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error:'Failed to save data'});
  }
  }
);

router.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname,'..', '..',  'public', 'login.html'))            
})

router.get('/registration-form', async (req, res) => {
  res.sendFile(path.join(__dirname,'..', '..',  'public', 'registration-form.html'))            
})

router.get('/login', async (req, res) => {
  res.sendFile(path.join(__dirname,'..', '..',  'public', 'login.html'))            
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Login failed' });
      }
      return res.status(200).json({ message: 'Login successful' });
    });
  })(req, res, next);
});
 
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      return res.status(500).send("failed to logout")
    }
    res.redirect('/login')
  })
})

router.get('/dashboard', (req,res) => {
  if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname,'..', '..', 'protected', 'dashboard.html'));
  }
  else {
  res.redirect(`/login?alert=not-logged-in`);
  }
});


module.exports = router;