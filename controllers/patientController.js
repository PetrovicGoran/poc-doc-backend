var patientModel = require('../models/patientModel.js');
var connectedModel = require("../models/connectionModel.js");
const http = require("http");
var ip = require("ip");
var fs = require("fs");
var path = require('path');
var ec = require('elliptic').ec;
var CryptoJS = require('crypto-js');
const { hostname } = require('os');
const app = require('../app.js');

const EC = new ec('secp256k1');

/**
 * patientController.js
 *
 * @description :: Server-side logic for managing patients.
 */
module.exports = {

    /**
     * patientController.list()
     */
    list: function (req, res) {
        patientModel.find(function (err, patients) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting patient.',
                    error: err
                });
            }

            var resl = [];
            
            for(var i in patients) {
                var newPat = patients[i].toObject();
                
                const key = EC.keyFromPrivate(newPat.private_key, 'hex');
        
                newPat.public_key = key.getPublic().encode('hex', false);

                resl.push(newPat);
            }

            return res.json(resl);
        });
    },

    /**
     * patientController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        patientModel.findOne({_id: id}, function (err, patient) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting patient.',
                    error: err
                });
            }
            if (!patient) {
                return res.status(404).json({
                    message: 'No such patient'
                });
            }

            var newPat = patient.toObject();
            const key = EC.keyFromPrivate(newPat.private_key, 'hex');
            newPat.public_key = key.getPublic().encode('hex', false);

            return res.json(newPat);
        });
    },

    /**
     * patientController.create()
     */
    create: function (req, res) {

        //var pk = "";        //wallet/newWallet

        /*http.post('http://192.168.18.7:8080/wallet/newWallet', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(data);
            });

        });*/
        //var test = connectedModel.sendHttpPost("/wallet/newWallet", null);

        const sendData = JSON.stringify({"data": null});

		
		const options = {
			hostname: global.host_ip,
			port: global.host_port_int,
			path: "/wallet/newWallet",
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': sendData.length
			}
		};
		
		const reqs = http.request(options, resl => {
            //console.log("statusCode: " + res.statusCode + ";");
            let data = '';

			resl.on('data', d => {
                //process.stdout.write(d)
                //console.log(JSON.stringify(d, null, "\t"));

                //return d;

                data += d;
            });
            
            resl.on('end', () => {

                //console.log(data);

                var medical_number_value = req.body.medical_number;
                var full_name_value = req.body.full_name;

                if(medical_number_value == null)
                    medical_number_value = req.body.medicalNumber;

                if(full_name_value == null)
                    full_name_value = req.body.fullName;

                var patient = new patientModel({
                    medical_number : medical_number_value,
                    password : req.body.password,
                    full_name : full_name_value,
                    phone : req.body.phone,
                    location : req.body.location,
                    private_key: JSON.parse(data).privateKey
                });
        
                patient.save(function (err, patient) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating patient',
                            error: err
                        });
                    }
                    return res.status(201).json({
                        _id : patient._id,
                        id : patient._id,
                        medical_number : patient.medical_number,
                        medicalNumber : patient.medical_number,
                        password : patient.password,
                        full_name : patient.full_name,
                        fullName : patient.full_name,
                        phone : patient.phone,
                        location : patient.location,
                        privateKey: patient.private_key,
                        private_key: patient.private_key
                    });
                });
            });
		});

		reqs.on('error', error => {
			//pomeni, da tista adresa ni dosegljiva --> brisemo je iz seznama
			/*connected.removeNode(this.address.toString(), this.port);
			console.log("[[in post]]removed from connection with port: " + this.port.toString());
			
			if(ip.address().toString() === saServerIp && parseInt(serverPortNumber) === saServerPort && connected.getConnectedNodesLength() <= 1) {	//samo server je v p2p omrezju
				writeToFile();
			}
		
			//posiljanje spremembe vsemi ostalimi vozlisci
			connected.sendHttpPostToAll(ip.address().toString(), parseInt(serverPortNumber), "/nodes/nodeNetworkChanged", JSON.stringify(connected));
			*/
			
            //console.error(error);
            
            console.log("error: " + JSON.stringify(error));
		});
	
		reqs.write(sendData);
		reqs.end();
    },

    /**
     * patientController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        patientModel.findOne({_id: id}, function (err, patient) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting patient',
                    error: err
                });
            }
            if (!patient) {
                return res.status(404).json({
                    message: 'No such patient'
                });
            }

            patient.medical_number = req.body.medical_number ? req.body.medical_number : patient.medical_number;
            patient.password = req.body.password ? req.body.password : patient.password;
            patient.full_name = req.body.full_name ? req.body.full_name : patient.full_name;
			patient.phone = req.body.phone ? req.body.phone : patient.phone;
            patient.location = req.body.location ? req.body.location : patient.location;
           
			
            patient.save(function (err, patient) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating patient.',
                        error: err
                    });
                }

                return res.json(patient);
            });
        });
    },

    /**
     * patientController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        patientModel.findByIdAndRemove(id, function (err, patient) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the patient.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    login: function (req, res,next) {
       
        var medical_number_value = req.body.medical_number;
        if(medical_number_value == null)
                    medical_number_value = req.body.medicalNumber;

        patientModel.authenticate(medical_number_value, req.body.password, function (error, patient) {
        if (error || !patient) {
          var err = new Error('Wrong medical number or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.patientId = patient._id;

          const key = EC.keyFromPrivate(patient.private_key, 'hex');

           return res.status(201).json({
            _id : patient._id,
            id : patient._id,
            medical_number : patient.medical_number,
            medicalNumber : patient.medical_number,
            password : patient.password,
            full_name : patient.full_name,
            fullName : patient.full_name,
            phone : patient.phone,
            location : patient.location,
            privateKey: patient.private_key,
            private_key: patient.private_key,
            publicKey : key.getPublic().encode('hex', false),
            public_key : key.getPublic().encode('hex', false)
        });
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
