const mongoose = require('mongoose');

 
var pendingschema = new mongoose.Schema({

      nomprenom :  String,
      cin :  String,
    
    date : {type:Date,default: Date.now}, 
   

    mail :  String,
    
    tel : String,
    score : String
    
    
})

const SONEDEDB = mongoose.model('post_pending', pendingschema);

module.exports = SONEDEDB;