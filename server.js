require('dotenv').config({path:'./.env'});
const port = process.env.PORT;
const key = process.env.KEY;
const mongoURI = process.env.mongoURI;

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connectDB = require('./config/mongo');

const adminroute = require('./config/routes/adminroutes')
const basicroutes = require('./config/routes/basicroutes')
const userRoutes = require('./config/routes/userroutes');
const loginroutes = require('./config/routes/loginauthenticationroutes');
const eventroutes = require('./config/routes/eventroutes');
const messageroute = require('./config/routes/messageroute');
const jobroute = require('./config/routes/jobroutes');
const servicesroute = require('./config/routes/servicesroute');
const resourcesroute = require('./config/routes/resourcesroute')

const passport = require('./config/passport-config');

const {isAuthenticated} = require('./config/util');
const otps = require('./models/otps.js');
const verificationtoken = require('./models/verificationtoken.js');

const app = express();
app.use('/styles', express.static(path.join(__dirname, 'admin_console', 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'admin_console', 'scripts')));
app.use('/admin_console', express.static(path.join(__dirname, 'admin_console')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/protected-styles', express.static(path.join(__dirname, 'protected', 'protected-styles')));
app.use('/protected-scripts', express.static(path.join(__dirname, 'protected', 'protected-scripts')));
app.use('/protected', express.static(path.join(__dirname, 'protected')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));


app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

connectDB();

app.use(session({
  secret: key,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoURI,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    secure: false,
    maxAge: 60000 * 60,
  }
}));

app.set('trust proxy', 1); 

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  //console.log(`Visitor IP: ${req.ip}, URL: ${req.url}`);
  next();
});

app.use(basicroutes)
app.use(loginroutes);
app.use(messageroute);
app.use('/admin', isAuthenticated, adminroute)
app.use('/protected', isAuthenticated, jobroute);
app.use('/protected', isAuthenticated, servicesroute);
app.use('/protected', isAuthenticated, messageroute);
app.use('/protected', isAuthenticated, eventroutes);
app.use('/protected', isAuthenticated, userRoutes);
app.use('/protected', isAuthenticated, resourcesroute);


app.listen(port ,() => {console.log(`server is running at port ${port}`)});


setInterval( async() => {
  const now = new Date(Date.now() - 10 * 60 * 1000);
  try{
    const result = await otps.deleteMany({createdAt: {$lt: now}});
    const token = await verificationtoken.deleteMany({createdAt: {$lt: now}})
    console.log(`Deleted ${result.deletedCount} expired otps`);
    console.log(`Deleted ${token.deletedCount} expired tokens`);
  }
catch(err) {
  console.log(err);
}
}, 1000 * 60 * 10);
