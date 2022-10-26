const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const resetToken = require('../model/resetTokens');
const user = require('../model/user');
const mailer = require('./sendMail');
const bcryptjs = require('bcryptjs');

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Veuillez entrer votre CIN et votre mot de passe pour vous connecter sur le site !");
        res.redirect('/login');
    }
}
router.get('/user/send-verification-email', checkAuth, async (req, res) => {
    
    if (req.user.isVerified || req.user.provider == 'google') {
        
        res.redirect('/home');
    } else {
        // generate a token 
        var token = crypto.randomBytes(32).toString('hex');
        // add that to database
       
        // send an email for verification
        await resetToken({ token: token, email: req.user.email }).save();
        // send an email for verification
        mailer.sendVerifyEmail(req.user.email,req.user.username, token);
        res.render('home', { username: req.user.username,email: req.user.email, verified: req.user.isVerified,is_profil_true:req.user.is_profil_true, emailsent: true });
    }
});

router.get('/user/verifyemail', async (req, res) => {
    // grab the token
    const token = req.query.token;
    // check if token exists 
    // or just send an error
    if (token) {
        var check = await resetToken.findOne({ token: token });
        if (check) {
            // token verified
            // set the property of verified to true for the user
            var userData = await user.findOne({ email: check.email });
            userData.isVerified = true;
            await userData.save();
            // delete the token now itself
            await resetToken.findOneAndDelete({ token: token });
            res.redirect('/home');
        } else {
            res.render('home', { username: req.user.username, verified: req.user.isVerified, err: "Jeton non valide ou jeton a expiré, réessayez." });
        }
    } else {
        // doesnt have a token
       
        res.redirect('/home');
    }
});


router.get('/user/forgot-password', async (req, res) => {
    // render reset password page 
    // not checking if user is authenticated 
    // so that you can use as an option to change password too
    res.render('forgot-password.ejs', { csrfToken: req.csrfToken() });

});


/*
router.get('/user/send-accept', async (req, res) => {
    // render reset password page 
    // not checking if user is authenticated 
    // so that you can use as an option to change password too
    res.render('display_offres.ejs');

});

router.post('/user/send-accept', async (req, res) => {
    const { email } = req.body;
    var userData = await user.findOne({ email: email });
    mailer.sendAcceptEmail(email, token);

});
*/

router.post('/user/forgot-password', async (req, res) => {
    const { email } = req.body;
    // not checking if the field is empty or not 
    // check if a user existss with this email
    var userData = await user.findOne({ email: email });
    console.log(userData);
    if (userData) {
        if (userData.provider == 'google') {
            // type is for bootstrap alert types
            res.render('forgot-password.ejs', { csrfToken: req.csrfToken(), msg: "L'utilisateur existe avec un compte Google. Essayez de réinitialiser le mot de passe de votre compte Google ou de vous connecter en l'utilisant.", type: 'danger' });
        } else {
            // user exists and is not with google
            // generate token
            var token = crypto.randomBytes(32).toString('hex');
            // add that to database
            await resetToken({ token: token, email: email}).save();
            // send an email for verification
            mailer.sendResetEmail(email,userData.username, token);

            res.render('forgot-password.ejs', { csrfToken: req.csrfToken(), msg: "L'e-mail de Réinitialisation envoyé. Veuillez vérifier votre e-mail.", type: 'success' });
        }
    } else {
        res.render('forgot-password.ejs', { csrfToken: req.csrfToken(), msg: "Aucun utilisateur n'existe avec cet e-mail.", type: 'danger' });

    }
});

router.get('/user/reset-password', async (req, res) => {
    // do as in user verify , first check for a valid token 
    // and if the token is valid send the forgot password page to show the option to change password 

    const token = req.query.token;
    if (token) {
        var check = await resetToken.findOne({ token: token });
        if (check) {
            // token verified
            // send forgot-password page with reset to true
            // this will render the form to reset password
            // sending token too to grab email later
            res.render('forgot-password.ejs', { csrfToken: req.csrfToken(), reset: true, email: check.email });
        } else {
            res.render('forgot-password.ejs', { csrfToken: req.csrfToken(), msg: "Token Tampered or Expired.", type: 'danger' });
        }
    } else {
        // doesnt have a token
        // I will simply redirect to profile 
        res.redirect('/login');
    }

});


router.post('/user/reset-password', async (req, res) => {
    // get passwords
    const { password, password2, email } = req.body;
    console.log(password);
    console.log(password2);
    if (!password || !password2 || (password2 != password)) {
        res.render('forgot-password.ejs', { csrfToken: req.csrfToken(), reset: true, err: "Les mots de passe ne sont pas identiques !", email: email });
    } else {
        // encrypt the password
        var salt = await bcryptjs.genSalt(12);
        if (salt) {
            var hash = await bcryptjs.hash(password, salt);
            await user.findOneAndUpdate({ email: email }, { $set: { password: hash } });
            res.redirect('/login');
        } else {
            res.render('forgot-password.ejs', { csrfToken: req.csrfToken(), reset: true, err: "Unexpected Error Try Again", email: email });

        }
    }
});


module.exports = router;