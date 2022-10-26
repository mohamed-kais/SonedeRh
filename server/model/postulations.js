const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
var postschema = new mongoose.Schema({

      nomprenom :  String,
      cin :  String,
    
    date : {type:Date,default: Date.now}, 
   

    mail :  String,
    
    tel : String,
    score : String,
    
    offres : {
      type : Schema.Types.ObjectId,
      ref : "offres"
  }
})

const SONEDEDB = mongoose.model('postulations', postschema);

module.exports = SONEDEDB;