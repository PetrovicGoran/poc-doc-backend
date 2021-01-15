var doctorModel = require('../models/doctorModel.js');
var ec = require('elliptic').ec;
var CryptoJS = require('crypto-js');

const EC = new ec('secp256k1');

/**
 * doctorController.js
 *
 * @description :: Server-side logic for managing doctors.
 */
module.exports = {

    /**
     * doctorController.list()
     */
    list: function (req, res) {
        doctorModel.find(function (err, doctors) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting doctor.',
                    error: err
                });
            }

            var resl = [];
            
            for(var i in doctors) {
                var newDoc = doctors[i].toObject();
                const key = EC.keyFromPrivate(newDoc.private_key, 'hex');
        
                newDoc.public_key = key.getPublic().encode('hex', false);
                newDoc.fullName = doctors[i].full_name;

                resl.push(newDoc);
            }

            return res.json(resl);
        });
    },

    /**
     * doctorController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        doctorModel.findOne({_id: id}, function (err, doctor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting doctor.',
                    error: err
                });
            }
            if (!doctor) {
                return res.status(404).json({
                    message: 'No such doctor'
                });
            }

            var newDoc = doctor.toObject();
            const key = EC.keyFromPrivate(newDoc.private_key, 'hex');
    
            newDoc.public_key = key.getPublic().encode('hex', false);

            return res.json(newDoc);
        });
    },

    /**
     * doctorController.create()
     */
    create: function (req, res) {
        var pk = "";


    
        var doctor = new doctorModel({
            medical_number : req.body.medical_number,
            password : req.body.password,
			full_name : req.body.full_name,
			specialization : req.body.specialization,
			phone : req.body.phone,
            location : req.body.location,
            private_key: pk
        });

        doctor.save(function (err, doctor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating doctor',
                    error: err
                });
            }
            return res.status(201).json(doctor);
        });
    },

    /**
     * doctorController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        doctorModel.findOne({_id: id}, function (err, doctor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting doctor',
                    error: err
                });
            }
            if (!doctor) {
                return res.status(404).json({
                    message: 'No such doctor'
                });
            }

            doctor.full_name = req.body.full_name ? req.body.full_name : doctor.full_name;
			doctor.specialization = req.body.specialization ? req.body.specialization : doctor.specialization;
			doctor.phone = req.body.phone ? req.body.phone : doctor.phone;
			doctor.location = req.body.location ? req.body.location : doctor.location;
			
            doctor.save(function (err, doctor) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating doctor.',
                        error: err
                    });
                }

                return res.json(doctor);
            });
        });
    },

    /**
     * doctorController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        doctorModel.findByIdAndRemove(id, function (err, doctor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the doctor.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    login: function (req, res,next) {
        doctorModel.authenticate(req.body.medical_number, req.body.password, function (error, doctor) {
        if (error || !doctor) {
          var err = new Error('Wrong medical number or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.doctorId = doctor._id;
           return res.status(201).json(doctor);
        }
      })
    },

    logout: function (req, res,next) {
        if (req.session) {
     req.session.destroy(function (err) {
       if (err) {
         return next(err);
       } else {
         return res.status(200);
       }
     });
     }
   }
};
