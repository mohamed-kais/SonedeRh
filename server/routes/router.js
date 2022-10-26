const express = require('express');
const route = express.Router();
const user = require('../model/user');


/*
const  credential = {
    email : "admin@gmail.com",
    password : "admin123"
}
*/
const services = require('../services/render');
const controller = require('../controller/controller');


/**
 *  @description register Register
 *  @method GET /
 */
 //route.get('/register', services.register);

/*
route.post('/', (req, res)=>{
    if(req.body.cin == credential.cin && req.body.password == credential.password){
        req.session.user = req.body.cin;
        res.redirect('/index');
        res.end("Login Successful...!");
    }else{
        res.end("Invalid Username")
    }
});

*/

/**
 *  @description Root Route
 *  @method GET /
 */
//route.get('/', services.homeRoutes);

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
      res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
      next();
  } else {
      req.flash('error_messages', "Veuillez entrer votre CIN et votre mot de passe pour vous connecter sur le site !");
      res.redirect('/login');
  }
}
  
/**
 *  @description index
 *  @method GET /index
 */

 route.get('/index', checkAuth,services.index, function(req,res){
         res.render('index', { username: req.user.username, verified : req.user.isVerified });

});



  
/**
 *  @description postulations
 *  @method GET /postulations
 */
 route.get('/postulations',services.postulations, function(req,res){
  postulations.findById(req.session.postulationsId).exec(function (error, postulations) {
    if (error) {
      return next(error);
    } else {
      console.log(postulations);
      postulations.find({},function(err,postulations){
        if (err) throw err;
        res.render('admin_content/admin_user',{'postulations':postulations, postulations:postulations});
      });
    }
  });

});

/**
 *  @description details
 *  @method GET /details
 */
 route.get('/details',services.details, function(req,res){
  details.findById(req.session.detailsId).exec(function (error, details) {
    if (error) {
      return next(error);
    } else {
      console.log(details);
      details.find({},function(err,details){
        if (err) throw err;
        res.render('admin_content/admin_user',{'details':details, details:details});
      });
    }
  });

});

  
/**
 *  @description afficher_users
 *  @method GET /afficher_users
 */
 route.get('/afficher_users',services.afficher_users, function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      User.find({},function(err,users){
        if (err) throw err;
        res.render('admin_content/admin_user',{'users':users, user:user});
      });
    }
  });

});
// route.get('/index',services.index)
route.get('/contact',services.contact)
route.post('/postulations',services.postulations)


/**
 *  @description ajouter offre
 *  @method GET /ajouter_offre
 */
route.get('/ajouter_offre',services.ajouter_offre)


/**
 *  @description for maj offre
 *  @method GET /maj_offre
 */
route.get('/maj_offre',services.maj_offre)

/**
 *  @description details
 *  @method GET /details
 */
 route.get('/details',services.details)


 
route.post('/api/offres', controller.create);
route.get('/api/offres', controller.find);
route.put('/api/offres/:id', controller.update);
route.delete('/api/offres/:id', controller.delete);

route.get('/api/offres/:id/candidats', controller.getAllCondidats);



//route.get('/api/login', controller.login);
//route.get('/api/register', controller.register);

route.get('/api/postulations', controller.findpost);
route.get('/api/postulations/:id', controller.findpost);
route.delete('/api/postulations/:id', controller.deletepost);

route.get('/api/details/:id', controller.finddetails);


route.get('/api/afficher_users', controller.findusers);
route.delete('/api/afficher_users/:id', controller.deleteusers);

//route.put('/forgot_password', controller.forgotPassword);

module.exports = route