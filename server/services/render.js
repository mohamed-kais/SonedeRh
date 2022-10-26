const axios = require('axios');
/*
exports.login = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
            res.render('login', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.homeRoutes =  (req,res)=>{
    res.render('login');
}
*/
/*
exports.register = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
            res.render('register', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}


exports.register =  (req,res)=>{
    res.render('register');
}
*/






exports.index = (req, res) => {
    // Make a get request to /api/users
  
    
    axios.get('http://localhost:3000/api/offres')
        .then(function(response){
            res.render('index', { offres : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
    
    
}

exports.afficher_users =  (req,res)=>{
    res.render('afficher_users');
}

exports.afficher_users = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/afficher_users')
        .then(function(response){
            res.render('afficher_users', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}


exports.contact =  (req,res)=>{
    res.render('contact');
}
exports.postulations = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/postulations')
        .then(function(response){
            res.render('postulations', { postulations : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.ajouter_offre =  (req,res)=>{
    res.render('ajouter_offre');
}



exports.maj_offre = (req, res) =>{
    axios.get('http://localhost:3000/api/offres/', { params : { id : req.query.id }})
        .then(function(offredata){
            res.render("maj_offre", { offres : offredata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}






exports.details =  (req,res)=>{
    axios.get('http://localhost:3000/api/offres', { params : { id : req.query.id }})
        .then(function(offredata){
            res.render("details", { offres : offredata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}

exports.candidats =  (req,res)=>{
    res.render('candidats');
}

exports.candidats = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/offres/:id/candidats')
        .then(function(response){
            res.render('offres', { offres : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}