var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var predictedConditionSchema = new Schema({
	'prediction' : String,
	'filepath' : String,
	'date' : String,
	'image' : String,
	'confirmed' : Boolean,
	'user_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'users'
	},
	'doctor_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'doctors'
	}
});

module.exports = mongoose.model('predictedCondition', predictedConditionSchema);
