const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mailer = require('./sendMail');
const user = require('../model/user');
const Emploi = require('../model/model');
const Vacant = require('../model/vacancy');
const Profil = require('../model/profils');
const Postulation = require('../model/postulation');
const Archive_emploi = require('../model/archive_emploi');
const Archive_user = require('../model/archive_user');
const fetch = require("isomorphic-fetch");
  var path = require('path');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
require('./passportLocal')(passport);
const crypto = require('crypto');
require('./googleAuth')(passport);
const multer = require('multer');
require('dotenv/config');
const userRoutes = require('./accountRoutes');
const fs = require ('fs');
const nodemailer = require('nodemailer');

var GoogleStrategy = require('passport-google-oauth20').Strategy;
const Meeting = require('google-meet-api').meet;

const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
      callback(null, './assets/uploads');
    },
  
    //add back the extension
    filename: function (request, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fieldSize: 1024 * 1024 * 3,
    },
  });



router.get('/',(req,res)=>{
    Emploi.find().exec((err,emplois)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('visitor', { emplois : emplois });
      
        }
    });
});

router.get('/login',checkNotAuth, (req, res) => {
    res.render("login", { csrfToken: req.csrfToken() });
});

router.get('/signup', (req, res) => {
    res.render("signup", { csrfToken: req.csrfToken() });
});

router.post('/signup', upload.single('image'), (req, res) => {
   
    const { username,email, cin, password, password2, image} = req.body;
   
    if (typeof req.file === "undefined") {
        img1 = '/img/profil.png'
    }else{

        img1 = req.file.filename
    }
    if (isNaN(cin)) {
        res.render("signup", { err: "Votre Numéro d'identification national doit être un nombre de 8 chiffres  !", csrfToken: req.csrfToken() });
    }
    else if (password != password2) {
        res.render("signup", { err: "Les mots de passe ne sont pas identiques !", csrfToken: req.csrfToken() });
    }
    
   else{
        user.findOne({ $or: [{ email: email },{ cin: cin }] }, function (err, data) {
            if (err) throw err;
            if (data) {
                res.render("signup", { err: "Utilisateur existe déjà !", csrfToken: req.csrfToken() });
            } else {
                // generate a salt
                bcryptjs.genSalt(12, (err, salt) => {
                    if (err) throw err;
                    // hash the password
                    bcryptjs.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        // save user in db
                        /*if (!req.file.filename){
                            img1 = 'img/profil.png'  ;
                           }else{
                               img1 = req.file.filename;
                           }*/
                        user({
                            username: username,
                            email: email,
                            cin: cin,
                            password: hash,
                            
                            img: img1,
                            googleId: null,
                            provider: 'email',
                        }).save((err, data) => {
                            if (err) throw err;
                            // login the user
                            // use req.login
                            // redirect , if you don't want to login
                            mailer.sendInsEmail(email,username,password);
                            res.redirect('/login');
                        });
                    })
                });
            }
        });
    }

    

});  



router.post('/login', (req, res, next) => {
            passport.authenticate('local', {
                failureRedirect: '/login',
                successRedirect: '/home',
                failureFlash: true,
            })(req, res, next);
       
});

router.get('/logout',(req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});

function checkuser(req, res, next) {
    if (req.user.isAdmin) {
       next();
       
}else{ res.redirect('/404');}
        
    
}

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Veuillez entrer votre CIN et votre mot de passe pour vous connecter sur le site !");
        res.redirect('/login');
    }
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
       
        res.redirect('/home');
    }
    next();
}
function checkAuth2(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Veuillez entrer votre CIN et votre mot de passe pour vous connecter sur le site !");
        res.redirect('/display_emploi');
    }
}

router.get('/home', checkAuth, (req, res) => {
    // adding a new parameter for checking verification
    res.render('home', { username: req.user.username, email:req.user.email, is_profil_true:req.user.is_profil_true, verified : req.user.isVerified });
    
});

router.get('/home_user', checkAuth, (req, res) => {
    // adding a new parameter for checking verification
    res.render('home_user', { username: req.user.username, email:req.user.email, is_profil_true:req.user.is_profil_true, verified : req.user.isVerified });
    
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/home');
});


router.get('/display_emploi', checkuser,checkAuth2, (req,res)=>{
    Emploi.find().exec((err,emplois)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('display_offres', { csrfToken: req.csrfToken(), emplois : emplois, username: req.user.username, email:req.user.email,image: req.user.img, verified : req.user.isVerified });
      
        }
    });
});


router.get('/display_vacant', checkuser,checkAuth2, (req,res)=>{
    Vacant.find().exec((err,vacants)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('display_vacant', { csrfToken: req.csrfToken(), vacants : vacants, username: req.user.username, email:req.user.email, verified : req.user.isVerified });
      
        }
    });
});



router.get('/display_users_list', checkuser,checkAuth, (req,res)=>{
    user.find().exec((err,users)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('display_users_list', { csrfToken: req.csrfToken(), users : users, username: req.user.username, image: req.user.img, verified : req.user.isVerified });
      
        }
    });
});




router.get('/ajouter_emploi',checkuser, checkAuth,(req,res)=>{
    res.render('ajouter_emploi', {csrfToken: req.csrfToken() , username: req.user.username});
});

router.post('/ajouter_emploi',upload.single('image'),checkuser, (req, res) => {
    //const { fonction,recruteur, contrat, date_debut, date_fin,district,secteur,image,description} = req.body;

    const emploi =new Emploi({
        fonction: req.body.fonction,
        recruteur: req.body.recruteur,
        contrat: req.body.contrat,
        disponibilite: req.body.disponibilite,
       
        date_debut: req.body.date_debut,
        paiment: req.body.paiment,
       
        secteur: req.body.secteur,
        img: req.file.filename,
        description: req.body.description,
    });
    emploi.save((err)=>{
        if(err){
            res.json({message: err.message, type: "danger"});
        }else{
          req.session.message = {
            type: "success" ,
            message: "Vous avez ajouter une nouvelle offre d'emploi !",
          };
            res.redirect('/display_emploi');
        }
    });
});



router.get('/ajouter_vacant',checkuser, checkAuth,(req,res)=>{
    res.render('ajouter_vacant', {csrfToken: req.csrfToken() , username: req.user.username});
});

router.post('/ajouter_vacant',checkuser, (req, res) => {
    
    const vacant =new Vacant({
    
        disponibilite: req.body.disponibilite,
        sujet: req.body.sujet,
        encadreur: req.body.encadreur,
        type_stage: req.body.type_stage,
        date_debut: req.body.date_debut,
        secteur: req.body.secteur,
       
    });
    vacant.save((err)=>{
        if(err){
            res.json({message: err.message, type: "danger"});
        }else{
          req.session.message = {
            type: "success" ,
            message: "Vous avez ajouter un nouveau poste vacant !",
          };
            res.redirect('/display_vacant');
        }
    });
});


router.get("/edit_emploi/:id",checkuser,(req,res)=>{
let id =req.params.id;
Emploi.findById(id,(err,emploi)=>{
if(err){
    res.redirect("/display_emploi");
}else{
    if(emploi == null){
        res.redirect("/display_emploi");
    }else{
        res.render('edit_emploi', { csrfToken: req.csrfToken(),emploi:emploi,username: req.user.username, msg: "Vous venez de mettre a jour une offre.", type: 'success' });

    }
}
});
});

router.get("/edit_vacant/:id",checkuser,(req,res)=>{
    let id =req.params.id;
    Vacant.findById(id,(err,vacant)=>{
    if(err){
        res.redirect("/display_vacant");
    }else{
        if(vacant == null){
            res.redirect("/display_vacant");
        }else{
            res.render('edit_vacant', { csrfToken: req.csrfToken(),vacant:vacant,username: req.user.username, msg: "Vous venez de mettre a jour le poste vacant.", type: 'success' });
    
        }
    }
    });
    });

router.post("/edit_emploi/:id",upload.single('image'),(req,res)=>{
            let id = req.params.id;
            let new_image = '';
            if(req.file){
            new_image = req.file.filename;
        try{
            fs.unlinkSync("./assets/uploads/" + req.body.old_image);
        }catch (err){
            console.log(err);
        }
        }else{
            new_image = req.body.old_image;
        }
        Emploi.findByIdAndUpdate(id,{
            fonction: req.body.fonction,
            recruteur: req.body.recruteur,
            contrat: req.body.contrat,
            disponibilite: req.body.disponibilite,
            
            
            secteur: req.body.secteur,
            paiment: req.body.paiment,
            img: new_image,
            description: req.body.description,
            }, (err,result)=>{
                if(err){
                    res.json({message : err.message, type: 'danger'});
                }else{
                    req.session.message = {
                        type : "success",
                        message : "l'offre a été mise à jour avec succès !",
                    };
                    res.redirect("/display_emploi");
                }
           
        })
});



router.post("/edit_vacant/:id",(req,res)=>{
    let id = req.params.id;
Vacant.findByIdAndUpdate(id,{

    disponibilite: req.body.disponibilite,
        sujet: req.body.sujet,
        encadreur: req.body.encadreur,
        type_stage: req.body.type_stage, 
        
        date_debut: req.body.date_debut,  
        secteur: req.body.secteur,
    }, (err,result)=>{
        if(err){
            res.json({message : err.message, type: 'danger'});
        }else{
            req.session.message = {
                type : "success",
                message : "le poste a été mise à jour avec succès !",
            };
            res.redirect("/display_vacant");
        }
   
})
});

router.get("/delete_emploi/:id",checkuser,(req,res)=>{
    const id = req.params.id;

    Emploi.findByIdAndRemove(id,(err,result)=>{
        if(result.image != ""){
            try{
                fs.unlinkSync("./assets/uploads/" + result.image);
            }catch(err){

                console.log(err);
            }
        }
        if(err){
            res.json({message: err.message});
        }else{

        Archive_emploi.insertMany([result])
            .then(r => {
                console.log("Saved Successfully");
            })
            .catch(error => {
                console.log(error);
            })

            req.session.message = {
                type : "info",
                message : "l'offre a été supprimer avec succès !",
            };
            res.redirect("/display_emploi");
        
        }
    });
     
});   


router.get("/delete_vacant/:id",checkuser,(req,res)=>{
    const id = req.params.id;

    Vacant.findByIdAndRemove(id,(err,result)=>{
        
        if(err){
            res.json({message: err.message});
        }else{

        

            req.session.message = {
                type : "info",
                message : "l'offre a été supprimer avec succès !",
            };
            res.redirect("/display_vacant");
        
        }
    });
     
});   


router.get('/display_users', checkuser,checkAuth, (req,res)=>{
    user.find().exec((err,users)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('display_users', { csrfToken: req.csrfToken(), users : users, username: req.user.username, image: req.user.img, verified : req.user.isVerified });
      
        }
    });
});

router.get("/delete_user/:id", checkuser,checkAuth,(req,res)=>{
    const id = req.params.id;

    user.findByIdAndRemove(id,(err,result)=>{
        if(result.image != ""){
            try{
                fs.unlinkSync("./assets/uploads/" + result.image);
            }catch(err){

                console.log(err);
            }
        }
        if(err){
            res.json({message: err.message});
        }else{

            Archive_user.insertMany([result])
            .then(r => {
                console.log("Saved Successfully");
            })
            .catch(error => {
                console.log(error);
            })

            req.session.message = {
                type : "info",
                message : "l'utilisateur a été supprimer avec succès !",
            };
            res.redirect("/display_users");
        
        }
    });
     
});   

router.get('/details_user/:id', checkuser, checkAuth, (req,res)=>{
    const id = req.params.id;
    user.findById(id).exec((err,users)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('details_user', { csrfToken: req.csrfToken(), users : users, username: req.user.username, image: req.user.img, verified : req.user.isVerified });
      
        }
    });
});



router.get('/ajouter_profil', checkAuth,(req,res)=>{
    res.render('ajouter_profil', {csrfToken: req.csrfToken() });
});

router.get('/display_emploi_user', checkAuth,(req,res)=>{
    Emploi.find().exec((err,emplois)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('display_emploi_user', { csrfToken: req.csrfToken(), emplois : emplois, username: req.user.username, image: req.user.img, verified : req.user.isVerified });
      
        }
    });
});

router.get('/display_list_postulation', checkAuth,(req,res)=>{
    Vacant.find().exec((err,vacants)=>{
    Emploi.find().exec((err,emplois)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('display_list_postulation', { csrfToken: req.csrfToken(), emplois : emplois,vacants : vacants, username: req.user.username, adresse: req.user.adresse, tel: req.user.tel, diplome: req.user.diplome,email: req.user.email, verified : req.user.isVerified });
      
        }
    });
});
});

router.get('/details_emploi_user', checkAuth,(req,res)=>{
    res.render('details_emploi_user', {csrfToken: req.csrfToken() });
});

router.post("/postulation/:id", function(req, res) {
    
    _id= req.body.post_id;
    let ts = Date.now();
    const response_key = req.body["g-recaptcha-response"];
    const secret_key = "6LdGvRccAAAAAFO_ktG40QOKPlu5A_8ZbyjRDYlE";
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
  
    fetch(url, {
        method: "post",
      })
        .then((response) => response.json())
        .then((google_response) => {
      
          // google_response is the object return by
          // google as a response 
          if (google_response.success == true) {

            /*user.findByIdAndUpdate({ _id:req.user._id }, {$push: {date_post: ts}}, { new: true })
            .then(function(err,users) {
            });
*/
    Emploi.findByIdAndUpdate({ _id }, {$addToSet: {postulations: req.user._id}}, { new: true })
    .then(function(err,postulation) {
    




        req.session.message = {
            type : "success",
            message : "Succès de postulation !",
        };
        // If we were able to successfully update a Product, send it back to the client
        res.redirect("/display_emploi_user");
      })
      
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.redirect("/display_emploi_user");
        
      });

    

    
    } else {
        req.session.message = {
            type : "danger",
            message : "Veuillez cocher la captcha !",
        };
        res.redirect("/display_emploi_user");
       
    }
})
.catch((err) => {
    // Some error while verify captcha
    res.redirect("/display_emploi_user",{message: err.message});
   
});  
    
 
});



router.get("/display_postulation/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Emploi.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("postulations")
      .then(function(emplois) {
        
        res.render('display_postulations', { csrfToken: req.csrfToken(), emplois : emplois, username: req.user.username,image: req.user.img, verified : req.user.isVerified });
        //res.json(emplois);
      })
      .catch(function(err) {
       
        res.json(err);
      });
  });
 




router.get("/accept_mail/:id", function(req, res) {
    const id = req.params.id;
    var lienmeet='';

    
  Meeting({
    clientId : "92649856364-vstlp9rbn5h520redn0rhl9oq6mmn6k8.apps.googleusercontent.com",
    clientSecret : "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",
    refreshToken : '1//04cgNsY5c-Jb6CgYIARAAGAQSNwF-L9IrVCV4XPk66d2w9DL9yWlhh-KKpz5BKBRwJRv2WrZdx9hcbtrdeGf1a2VRCfvdKFeXsrQ',
    date : "2020-12-01",
    time : "10:59",
    summary : 'summary',
    location : 'location',
    description : 'description'
    }).then(function(lienmeet){
    console.log(lienmeet);
    user.findByIdAndUpdate(id).exec((err,users)=>{
        mailer.sendAcceptEmail(users.email,users.nom,users.prenom,lienmeet);
        users.status = !users.status;
        users.status_post = "accepter";
       users.save();
            
       res. redirect(req. get('referer'));
    console.log(users.status);
    });
    })

   
});

/*
router.get("/refuse_mail/:id", function(req, res) {
    _id = req.params.id;
    let id_emp = '';
    id_emp = req.body.emp_id;
   Emploi.findById({id_emp}, {$pull: {postulations: _id}}).exec((err,emplois)=>{
      console.log(id_emp);
   });
});
*/


router.get('/refuse_mail/:id/post/:id1',function(req,res){
    
    Emploi.findByIdAndUpdate({ _id : req.params.id}, {$pull: {postulations: req.params.id1}}, { new: true })
    .then(function(err,users) {
        user.findById(req.params.id1).exec((err,users)=>{
            mailer.sendRefusEmail(users.email,users.nom,users.prenom);
            users.status_post = "refuser";
            users.save();
        });
        res. redirect(req. get('referer'));
      })
   
});

router.get('/404',checkAuth, (req, res) => {
    res.render("404", { csrfToken: req.csrfToken() });
});

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


/*
router.post('/ajouter_profil',upload.fields([{
    name: 'motiv', maxCount: 1
  }, {
    name: 'cv', maxCount: 1
  }])  , (req, res) => {

    var x=0;
    //const { fonction,recruteur, contrat, date_debut, date_fin,district,secteur,image,description} = req.body;
if(req.body.matrimoniale == "mariée"){
x+=10;
}
if(req.body.nationalite == "Oui"){
    x+=50;
}
if(req.body.permis == "Oui"){
    x+=30;
}
if(req.body.publique == "Oui"){
    x+=10;
}
if(req.body.bns == "Oui"){
    x+=10;
}
if(req.body.justice == "Oui"){
    x-=50;
}
if(parseInt(req.body.annee) >= 2){
    x+=20;
}else if(parseInt(req.body.annee) === 1){
x+=10;
}
if(req.body.diplome == "Je n'ai pas eu de diplôme"){
    x-=10;
}else if(req.body.diplome == "Baccalauréat" || req.body.diplome == "BTP / BTS"){
    x+=10;
}else if(req.body.diplome == "License appliquée" || req.body.diplome == "License fondamentale"){
    x+=20;
}else if(req.body.diplome == "Master professionnel" || req.body.diplome == "Master de recherche"){
    x+=30;
}else if(req.body.diplome == "Diplôme National d'Ingénieur"){
    x+=50;
}


if(getAge(req.body.date_nc)>=50){
    x-=5;
}else if(getAge(req.body.date_nc)<50 && getAge(req.body.date_nc)>40){
    x+=5; 
}else if(getAge(req.body.date_nc)<=40 && getAge(req.body.date_nc)>25){
    x+=10; 
}else if(getAge(req.body.date_nc)<=25 && getAge(req.body.date_nc)>=18){
    x+=5; 
}
    const profil =new Profil({
        nom: req.body.nom,
        prenom: req.body.prenom,
        date_dn: req.body.date_nc,
        matrimonial: req.body.matrimoniale,
        sexe: req.body.sexe,
        tel: req.body.tel,
        tel_alt : req.body.alt_tel,
        adresse: req.body.adresse,
        ville: req.body.ville,
        nationalite: req.body.nationalite,
        permis_c: req.body.permis,
        f_public : req.body.publique,
        secourisme: req.body.bns,
        justice: req.body.justice,
        diplome: req.body.diplome,
        specialite: req.body.spec,
        annee: req.body.annee,
        type_permis_c : req.body.type_permis_c,
        motivation: req.files['motiv'],
        cv: req.files['cv'],
        score: x,
        
        
    });
    profil.save((err)=>{
        if(err){
            res.json({message: err.message, type: "danger"});
        }else{
            user.findByIdAndUpdate(req.user._id).populate('profil');
                   
                    res.redirect('/display_emploi_user');
        
        }

       
       
       
    });

    

    
});
*/

router.post("/ajouter_profil",upload.single('cv'), function(req, res) {
    const _id = req.user._id;

    var x=0;

if(req.body.matrimoniale == "mariée"){
x+=10;
}

if(req.body.nationalite == "Oui"){
    x+=50;
}
if(req.body.type_permis_c == "Je n'ai pas le permis de conduire"){
    x-=10;
}
if(req.body.type_permis_c == "A1" || req.body.type_permis_c == "A et A1"|| req.body.type_permis_c == "B,A1 et H"){
    x+=20;
}
if(req.body.type_permis_c == "C" || req.body.type_permis_c == "C,C+E" || req.body.type_permis_c == "D et D1" || req.body.type_permis_c == "C,C+E,D1 et D+E"|| req.body.type_permis_c == "B+E" || req.body.type_permis_c == "B"|| req.body.type_permis_c == "D1"){
    x+=30;
}
if(req.body.publique == "Oui"){
    x+=10;
}
if(req.body.bns == "Oui"){
    x+=10;
}
if(req.body.justice == "Oui"){
    x-=50;
}
if(parseInt(req.body.annee) >= 2){
    x+=20;
}else if(parseInt(req.body.annee) === 1){
x+=10;
}
if(req.body.diplome == "Je n'ai pas eu de diplôme"){
    x-=10;
}else if(req.body.diplome == "Baccalauréat" || req.body.diplome == "BTP / BTS"){
    x+=10;
}else if(req.body.diplome == "License appliquée" || req.body.diplome == "License fondamentale"){
    x+=20;
}else if(req.body.diplome == "Master professionnel" || req.body.diplome == "Master de recherche"){
    x+=30;
}else if(req.body.diplome == "Diplôme National d'Ingénieur"){
    x+=50;
}


if(getAge(req.body.date_nc)>=50){
    x-=5;
}else if(getAge(req.body.date_nc)<50 && getAge(req.body.date_nc)>40){
    x+=5; 
}else if(getAge(req.body.date_nc)<=40 && getAge(req.body.date_nc)>25){
    x+=10; 
}else if(getAge(req.body.date_nc)<=25 && getAge(req.body.date_nc)>=18){
    x+=5; 
}
  
       
if(typeof req.file === "undefined" || req.body.nom==="" || req.body.prenom==="" || req.body.matrimoniale==="" || req.body.sexe==="" || req.body.ville==="" || req.body.adresse==="" || req.body.diplome==="" || req.body.spec==="" || req.body.tel==="" || req.body.annee==="" ) {
    res.render("ajouter_profil", { err: "Veuillez remplir tous les champs obligatoires !", csrfToken: req.csrfToken() });
}else{

    user.findByIdAndUpdate(_id  ,{
        

        nom: req.body.nom,
        prenom: req.body.prenom,
        date_dn: req.body.date_nc,
        matrimonial: req.body.matrimoniale,
        sexe: req.body.sexe,
        tel: req.body.tel,
        tel_alt : req.body.alt_tel,
        adresse: req.body.adresse,
        ville: req.body.ville,
        nationalite: req.body.nationalite,
        
        f_public : req.body.publique,
        secourisme: req.body.bns,
        justice: req.body.justice,
        diplome: req.body.diplome,
        specialite: req.body.spec,
        annee: req.body.annee,
        type_permis_c : req.body.type_permis_c,
        
        cv: req.file.filename,
        score: x,
        is_profil_true:true,
        


        }, (err,users)=>{
            if(err){
                res.json({message : err.message, type: 'danger'});
                console.log(req.body.nom);
            }else{
                req.session.message = {
                    type : "success",
                    message : "Votre profil a été mise à jour avec succès !",
                };
                res.redirect("/display_emploi_user");
                
            }
       
    })
}
});


router.get('/download/:id',(req,res)=>{  
    user.find({_id:req.params.id},(err,data)=>{  
        if(err){  
            console.log(err)  
        }   
        else{  
           var path= './assets/uploads/'+data[0].cv;  
           res.download(path);  
        }  
    })  
})  

router.get('/details_offre/:id', checkAuth, (req,res)=>{
    const id = req.params.id;
    Emploi.findById(id).exec((err,emplois)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('details', { csrfToken: req.csrfToken(), emplois : emplois, username: req.user.username, image: emplois.img, verified : req.user.isVerified });
      
        }
    });
});

router.get('/details_offre_user/:id', checkAuth, (req,res)=>{
    const id = req.params.id;
    Emploi.findById(id).exec((err,emplois)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('details_emploi_user', { csrfToken: req.csrfToken(), emplois : emplois, username: req.user.username, image: emplois.img, verified : req.user.isVerified });
      
        }
    });
});


router.get('/contact_user/:id',checkuser, checkAuth,(req,res)=>{
    const id = req.params.id;
    user.findById(id).exec((err,users)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('contact', { csrfToken: req.csrfToken(), users : users, username: req.user.username,email: req.user.email ,verified : req.user.isVerified });
      
        }
    });
 
});



router.post('/send_user', (req, res) => {
    mailer.sendEmailUser(req.body.to,req.body.objet,req.body.message);
});

router.get('/en_attente/:id', (req, res) => {
    const id = req.params.id;
    user.findById(req.params.id).exec((err,users)=>{
        users.status_post = "en attente";
        users.save();
        res. redirect(req. get('referer'));
    });
   
});



router.post('/ajout_ent/:id',checkuser, (req, res) => {
    const id = req.params.id;
    user.findByIdAndUpdate(id).exec((err,users)=>{
        users.psy_ent = req.body.psy_ent;
        users.heure_ent = req.body.heure_ent;
        users.cv_ent = req.body.cv_ent;
        users.mot_ent = req.body.mot_ent;
        users.cin_ent = req.body.cin_ent;
        users.save();
        res. redirect(req. get('referer'));
    });
    
      
});


router.get('/display_archive_emploi', checkuser,checkAuth2, (req,res)=>{
    Archive_emploi.find().exec((err,emplois)=>{
        Archive_user.find().exec((err,users)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('archive', { csrfToken: req.csrfToken(), emplois : emplois,users : users, username: req.user.username, email:req.user.email,image: req.user.img, verified : req.user.isVerified });
      
        }
    });
});



});


router.get('/display_archive_user', checkuser,checkAuth2, (req,res)=>{
    Archive_user.find().exec((err,users)=>{
        Archive_emploi.find().exec((err,emplois)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render('archive_users', { csrfToken: req.csrfToken(), emplois : emplois,users : users, username: req.user.username, email:req.user.email,image: req.user.img, verified : req.user.isVerified });
      
        }
    });
});



});

router.use(userRoutes);
module.exports = router;