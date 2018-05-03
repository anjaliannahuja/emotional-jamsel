const app = require('express')();
const db = require('./db/index');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const session = require('express-session');
// const HttpsProxyAgent = require('https-proxy-agent');

// const proxy = { host: 'http://server', port: 3001 };
// const agent = new HttpsProxyAgent(proxy);
// GoogleStrategy.setAgent(agent);
const { addGoogleUser, findGoogleUser } = require('./db/index');

// Middleware to check if user logged in
const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/');
  } else {
    // if logged in
    next();
  }
};

// Use cookie session for auth
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/hello', (req, res) => res.send('Hello'));

app.get('/api', (req, res) => res.send('Other route'));

passport.use(new GoogleStrategy(
  {
    // options for strategy
    callbackURL: '/auth/google/redirect',
    clientID: '1033411001538-v9nke9ooclfvepgplf73boh84sg8r675.apps.googleusercontent.com',
    clientSecret: 'FuKzjhCzUTq0Pi95luCOS2nD',
  },
  async (accessToken, refreshToken, profile, done) => {
    // check if user already exists in database
    try {
      const currentUser = await findGoogleUser(profile.id);
      if (currentUser !== undefined) {
        await done(null, currentUser);
      } else {
        const newUser = await addGoogleUser(
          profile.id,
          profile.displayName,
          profile.name.givenName,
        );
        await done(null, newUser);
      }
    } catch (err) {
      console.log(err);
    }
  },
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  const currentUser = await findGoogleUser(user[0].google_id);

  done(null, currentUser);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// auth with google
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile'],
  }),
);

// callback route for google to redirect to
app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3001);
