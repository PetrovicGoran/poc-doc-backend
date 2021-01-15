var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var diagnosisSchema = new Schema({
	'name' : String,
	'description' : String,
	'user_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'INSERT_YOUR_REFERENCE_NAME_HERE'
	},
	'doctor_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'INSERT_YOUR_REFERENCE_NAME_HERE'
	}
});

module.exports = mongoose.model('diagnosis', diagnosisSchema);
