var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var therapySchema = new Schema({
	'name' : String,
	'description' : String,
	'start_date' : String,
	'end_date' : String,
	'repetition' : Number,
	'user_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'INSERT_YOUR_REFERENCE_NAME_HERE'
	},
	'doctor_id' : {
		type: Schema.Types.ObjectId,
		ref: 'INSERT_YOUR_REFERENCE_NAME_HERE'
   }
});

module.exports = mongoose.model('therapy', therapySchema);
