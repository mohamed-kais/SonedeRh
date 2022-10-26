const mongoose = require('mongoose');
const Schema = mongoose.Schema;



 
var archive_emploi_schema = new mongoose.Schema({
priorite: {
        type: String
},

fonction: {
        type: String
},
recruteur: {
      type: String
},
contrat: {
  type: String
}, 
date_debut : {type:Date,default: Date.now}, 
  
secteur: {
  type: String
},
paiment: {
        type: String,
        
      }

})


module.exports = mongoose.model('archive_emploi', archive_emploi_schema);