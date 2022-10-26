const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var vacantschema = new mongoose.Schema({
  disponibilite: {
    type: String,default: 'disponible',
   
},
sujet: {
        type: String,
       
},
encadreur: {
      type: String,
      
},
type_stage: {
  type: String,
}, 
date_debut : {type:String}, 

secteur: {
  type: String,
  
}
});


module.exports = mongoose.model('vacant', vacantschema);