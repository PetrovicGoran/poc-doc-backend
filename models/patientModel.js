var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var patientSchema = new Schema({
	'medical_number' : String,
	'password' : String,
	'full_name' : String,
	'phone' : String,
	'location' : String,
	'private_key': String
});


patientSchema.statics.authenticate = function (medical_number, password, callback) {
	Patient.findOne({ medical_number: medical_number })
	  .exec(function (err, patient) {
		if (err) {
		  return callback(err)
		} else if (!patient) {
		  var err = new Error('Patient not found.');
		  err.status = 401;
		  return callback(err);
		}
		bcrypt.compare(password, patient.password, function (err, result) {
		  if (result === true) {
			return callback(null, patient);
		  } else {
			return callback();
		  }
		})
	  });
  }
  
  patientSchema.pre('save', function (next) {
	var patient = this;
	bcrypt.hash(patient.password, 10, function (err, hash) {
	  if (err) {
		return next(err);
	  }
	  patient.password = hash;
	  next();
	})
  });

  var Patient = mongoose.model('Patient', patientSchema);
  module.exports = Patient;

