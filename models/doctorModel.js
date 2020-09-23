var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var doctorSchema = new Schema({
	'medical_number' : String,
	'password' : String,
	'full_name' : String,
	'specialization' : String,
	'phone' : String,
	'location' : String,
	'private_key': String
});

doctorSchema.statics.authenticate = function (medical_number, password, callback) {
	Doctor.findOne({ medical_number: medical_number })
	  .exec(function (err, doctor) {
		if (err) {
		  return callback(err)
		} else if (!doctor) {
		  var err = new Error('Doctor not found.');
		  err.status = 401;
		  return callback(err);
		}
		bcrypt.compare(password, doctor.password, function (err, result) {
		  if (result === true) {
			return callback(null, doctor);
		  } else {
			return callback();
		  }
		})
	  });
  }
  
  doctorSchema.pre('save', function (next) {
	var doctor = this;
	bcrypt.hash(doctor.password, 10, function (err, hash) {
	  if (err) {
		return next(err);
	  }
	  doctor.password = hash;
	  next();
	})
  });

  /*doctorSchema.statics.getAll = function() {
	doctorModel.find(function (err, doctors) {
		if (err) {
			return res.status(500).json({
				message: 'Error when getting doctor.',
				error: err
			});
		}
		return res.json(doctors);
	});
  }*/

  var Doctor = mongoose.model('Doctor', doctorSchema);
  module.exports = Doctor;
