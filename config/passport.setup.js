const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

const FacebookStrategy = require('passport-facebook');


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
    done(null, user);
    })
});


passport.use(
    new GoogleStrategy({
            //options for strategy
            callbackURL: '/auth/google/redirect',
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret
        },
        (accessToken, refreshToken, profile, done) => {
        // passport cb f-n
            User.findOne({googleId: profile.id}).then((currentUser) => {
                if (currentUser) {
                    console.log(currentUser);
                    done(null, currentUser);
                } else {
                    // if not create new user in our db
                    new User({
                        username: profile.displayName,
                        googleId: profile.id,
                        rights: 'user'
                    }).save().then((newUser) => {
                        console.log('new user created ' + newUser);
                        done(null, newUser);
                    })
                }
            })

    })
);

passport.use(new FacebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: "/auth/facebook/redirect"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        User.findOne({facebookId: profile.id}).then((currentUser) => {
            if (currentUser) {
                done(null, currentUser);
            } else {
                // if not create new user in our db
                new User({
                    username: profile.displayName,
                    facebookId: profile.id,
                    rights: 'user'
                }).save().then((newUser) => {
                    console.log('new user created ' + newUser);
                    done(null, newUser);
                })
            }
        })
    }
));

