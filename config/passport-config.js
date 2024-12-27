const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Users = require('../models/users');
const {hashPassword, verifyPassword} = require('./util');


passport.use(new localStrategy( 
  { usernameField: 'userid'},
  async(userid, password, done) => {
    try {
      const user = await Users.findOne({userid});
      if(!user) {
        return done(null, false, {message: 'userid not registered'});
      }
      if(!verifyPassword(password, user.passwordhash, user.salt)) {
        return done(null, false, {message: 'Incorrect password'});
      }
      if(!user.verified) {
        return done(null, false, {message: 'Verify your account first'})
      }
      return done(null, user)
    }
    catch(err) {
      return done(err)
    }
  }
));

passport.serializeUser((user, done) => {
  done(null,user.id)
})


passport.deserializeUser(async (id, done)=> {
  try {
    const user = await Users.findById(id);
    done(null, user);
  }
  catch(err) {
    done(err);
  }
});

module.exports = passport;