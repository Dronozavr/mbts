const router = require('express').Router();
const passport = require('passport');

// auth logout
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));


// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google', {
    successReturnToOrRedirect : '/ui/my-blog',
    failureRedirect           : '/ui/login',
    failureFlash              : true
}));

// auth logout
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['profile']
}));


// callback route for google to redirect to
router.get('/facebook/redirect', passport.authenticate('facebook', {
    successReturnToOrRedirect : '/ui/my-blog',
    failureRedirect           : '/ui/login',
    failureFlash              : true
}));

module.exports = router;
