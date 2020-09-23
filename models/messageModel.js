var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var messageSchema = new Schema({
	'fromPatient' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'patient'
	},
	'toPatient' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'patient'
	},
	'fromDoctor' : {
		type: Schema.Types.ObjectId,
		ref: 'doctor'
   },
   'toDoctor' : {
		type: Schema.Types.ObjectId,
		ref: 'doctor'
   },
	'content' : String
});

module.exports = mongoose.model('message', messageSchema);
