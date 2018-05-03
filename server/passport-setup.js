const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { addGoogleUser, findGoogleUser } = require('./db/index');

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
      if (!currentUser === undefined) {
        done(null, currentUser);
      } else {
        const newUser = await addGoogleUser(
          profile.id,
          profile.displayName,
          profile.name.givenName,
        );
        done(null, newUser);
      }
    } catch (err) {
      console.log(err);
    }
  },
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  findGoogleUser(user[0].google_id).then((currentUser) => {
    done(null, currentUser);
  });
});
