const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var user = require('./user');

const Contrat = Object.freeze({
    CDD: 'Contrat à durée déterminée',
    CDI: 'Contrat à durée indéterminée',
    verbal: 'Contrat verbal',
    ecrit: 'Contrat écrit'
});
  const Status = Object.freeze({
    Ouvert: 'Ouvert',
    Fermer: 'Fermer'
  });
  
var offreschema = new mongoose.Schema({
  disponibilite: {
    type: String,default: 'disponible',
   
},
fonction: {
        type: String,
       
},
recruteur: {
      type: String,
      
},
contrat: {
  type: String,
  enum: Object.values(Contrat)
}, 
date_debut : {type:Date}, 



secteur: {
  type: String,
  
},
status: {
        type: String,
        enum: Object.values(Status)
},
description: {
  type: String,
  
},
paiment: {
  type: String,
  
},
img: {
        type: String,
        default: 'placeholder.jpg',
},

postulations: [{
  type: Schema.Types.ObjectId,
  ref: 'user'
}]
});


const SONEDEDB = mongoose.model('sonededb', offreschema);

module.exports = SONEDEDB;