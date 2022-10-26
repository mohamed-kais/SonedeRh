const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var conschema = new mongoose.Schema({
    nomprenom : String,
    date_naissance :{type:Date,default: Date.now},
    diplome : String,
    formation : String,
    experience : String,
    adresse : String,
    ville : String,
    langue : String,
    etat_matrimonial : String,
    permis_conduite :String,

    offres : {
        type : Schema.Types.ObjectId,
        ref : "offres"
    }
})


const SONEDEDB = mongoose.model('candidats', conschema);

module.exports = SONEDEDB;