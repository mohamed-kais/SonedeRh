var SONEDEDB = require('../model/model');
var Postulations = require('../model/postulations');

var Users = require('../model/users');

var moment = require('moment');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');


const { db } = require('../model/model');
const { postulations } = require('../services/render');



exports.create = (req,res)=>{
   
    const offres = new SONEDEDB({
        priorite : req.body.priorite,
        titre : req.body.titre,
        date_debut: req.body.date_debut,
        date_fin : req.body.date_fin,
        recruteur :req.body.recruteur,
        district :req.body.district,
        description : req.body.description,
        status : req.body.status
    })
    offres
    .save(offres)
    .then(data => {
        
        res.redirect('/index');
    })
    .catch(err =>{
        res.status(500).send({
            message : err.message || "Some error occurred while creating a create operation"
        });
    });

}

exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    SONEDEDB.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}

exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        SONEDEDB.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found offre with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving offre with id " + id})
            })

    }else{
        SONEDEDB.find()
            .then(offres => {
                res.send(offres)
                
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving offre information" })
            })
    }

    
}
exports.delete = (req,res)=>{
    const id = req.params.id;

    SONEDEDB.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Offre was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Offre with id=" + id
            });
        });
}    
/*
module.exports.register = (req, res, next) => {
    res.redirect("/");

}   
*/
/*
module.exports.login = (req, res, next) => {

          res.redirect("/index");
          
}

*/





exports.findpost = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Postulations.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found postulations with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving postulations with id " + id})
            })

    }else{
        Postulations.find()
            .then(postulations => {
                res.send(postulations)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving postulations information" })
            })
    }

    
}

exports.deletepost = (req,res)=>{
    const id = req.params.id;

    Postulations.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Postulations was deleted successfully!"
                   
                })


/*
                const archive = new Archives({
                    nomprenom : req.body.nomprenom,
                    cin : req.body.cin,
                    date: req.body.date,
                    mail : req.body.mail,
                    tel :req.body.tel,
                    score : req.body.score,
                    
                })
                archive
                .save(archive)
                .then(data => {
                    
                    res.redirect('/postulations');
                })
                .catch(err =>{
                    res.status(500).send({
                        message : err.message || "Some error occurred while creating a create operation"
                    });
                });

*/
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Postulations with id=" + id
            });
        });
}

exports.finddetails = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    SONEDEDB.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}

exports.getAllCondidats = (req, res)=>{
    let foundcandidats = SONEDEDB.find({id : req.params.id}).populate("candidats");
    res.json(foundcandidats);

}

  

exports.findusers = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Users.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Users.find()
            .then(users => {
                res.send(users)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}
exports.deleteusers = (req,res)=>{
    const id = req.params.id;

    Users.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "user was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete user with id=" + id
            });
        });
}    


exports.forgotPassword = (req,res)=>{
 const {email} = req.body;

    Users.findOne({email}), (err,user) =>{
        if(err || !user){
            return res.status(400).json({error: "User with this mail do not exist"});
        }
    }

}