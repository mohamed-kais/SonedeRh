const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const archive_userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cin: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    googleId: {
        type: String,
    },
    provider: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        default: 'placeholder.jpg',
      },
   /* date_post: {
        type:Date,
    },*/
      status: {
        type: Boolean,
        default: true
      },

      isAdmin: {
        type: Boolean,
        default: false,
    },
/*
    profil: {
        type: Schema.Types.ObjectId,
        ref: 'profil'
    }
  */
 
    
    nom: {
        type: String,
        
    },
    prenom: {
        type: String,
       
    },
    date_dn : {type:Date,default: Date.now}, 
    matrimonial : {
        type: String,
        
    },
    sexe: {
        type: String,
        
    },
    tel: {
        type: String,
        
    },
    tel_alt: {
        type: String,
        
    },
    adresse: {
        type: String,
        
    },
    ville: {
        type: String,
       
    },

    nationalite: {
        type: String,
        default: false,
    },
    permis_c: {
        type: String,
        default: false,
    },





    f_public: {
        type: String,
        default: false,
    },
    secourisme: {
        type: String,
        default: false,
    },
    justice: {
        type: String,
        default: false,
    },





    diplome: {
        type: String,
       
    },
    specialite: {
        type: String,
        
    },
    annee: {
        type: String,
        
    },
   
    type_permis_c: {
        type: String,
        
    },





    cv: [{
        
    }],
   motivation: [{
       
    }],


is_profil_true:{
    type : Boolean,
    default:false,
},


    
    score:{
        type : String,
    },

    status_post:{type : String},

    psy_ent:{
        type: String,
    },
    heure_ent:{
        type: String,
    },
    cv_ent: {
        type: String,
        
    },
    mot_ent:{
        type: String,
    },
    cin_ent:{
        type: String,
    },


});

module.exports = mongoose.model('archive_user',archive_userSchema);