const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profilesSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    date_dn : {type:Date,default: Date.now}, 
    matrimonial : {
        type: String,
        required: true,
    },
    sexe: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    tel_alt: {
        type: String,
        
    },
    adresse: {
        type: String,
        required: true,
    },
    ville: {
        type: String,
        required: true,
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
        required: true,
    },
    specialite: {
        type: String,
        required: true,
    },
    annee: {
        type: String,
        required: true,
    },
   
    type_permis_c: {
        type: String,
        
    },
    cv: [{
        
    }],
   motivation: [{
       
    }],
    score:{
        type : String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }

});

module.exports = mongoose.model('profil', profilesSchema);