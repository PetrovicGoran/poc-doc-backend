var predictedConditionModel = require('../models/predictedConditionModel.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * predictedConditionController.js
 *
 * @description :: Server-side logic for managing predictedConditions.
 */
module.exports = {

    /**
     * predictedConditionController.list()
     */
    userList: function (req, res) {
        predictedConditionModel.aggregate([ 
            { 
                $match : { 
                    user_id : ObjectId(req.params.id),
                    confirmed : false
                } 
            }

        ]).exec(function (err, predictions){
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting predictions for user.',
                    error: err
                });
            }

            var resl = [];

            for (var i in predictions) {
                var newPrediction = predictions[i];
                newPrediction.doctorId = newPrediction.doctor_id;
                newPrediction.id = newPrediction._id;
                newPrediction.filePath = newPrediction.filepath;
                resl.push(newPrediction);
            }

            return res.json(resl);
        });
    },

    doctorList: function (req, res) {
        predictedConditionModel.aggregate([ 
            { 
                $match : { 
                    doctor_id : ObjectId(req.params.id),
                    confirmed : false
                } 
            }

        ]).exec(function (err, predictions){
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting predictions for doctor.',
                    error: err
                });
            }
            return res.json(predictions);
        });
    },

    /**
     * predictedConditionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        predictedConditionModel.findOne({_id: id}, function (err, predictedCondition) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting predictedCondition.',
                    error: err
                });
            }
            if (!predictedCondition) {
                return res.status(404).json({
                    message: 'No such predictedCondition'
                });
            }
            return res.json(predictedCondition);
        });
    },

    /**
     * predictedConditionController.create()
     */
    create: function (req, res) {
        var predictedCondition = new predictedConditionModel({
            prediction : req.body.prediction,
            filepath : req.body.filePath,
			date : req.body.date,
			image : req.body.image,
			confirmed : req.body.confirmed,
			user_id : req.body.userId,
			doctor_id : req.body.doctorId

        });

        predictedCondition.save(function (err, predictedCondition) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating predictedCondition',
                    error: err
                });
            }


            return res.status(201).json({
                id : predictedCondition._id,
                prediction : predictedCondition.prediction,
                filePath : predictedCondition.filepath,
                date : predictedCondition.date,
                image : predictedCondition.image,
                confirmed : predictedCondition.confirmed,
                userId : predictedCondition.userId,
                doctorId : predictedCondition.doctorId
            });
        });
    },

    /**
     * predictedConditionController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        predictedConditionModel.findOne({_id: id}, function (err, predictedCondition) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting predictedCondition',
                    error: err
                });
            }
            if (!predictedCondition) {
                return res.status(404).json({
                    message: 'No such predictedCondition'
                });
            }

            predictedCondition.prediction = req.body.prediction ? req.body.prediction : predictedCondition.prediction;
			predictedCondition.date = req.body.date ? req.body.date : predictedCondition.date;
			predictedCondition.image = req.body.image ? req.body.image : predictedCondition.image;
			predictedCondition.confirmed = req.body.confirmed ? req.body.confirmed : predictedCondition.confirmed;
			predictedCondition.user_id = req.body.userId ? req.body.userId : predictedCondition.user_id;
			predictedCondition.doctor_id = req.body.doctorId ? req.body.doctorId : predictedCondition.doctor_id;
			
            predictedCondition.save(function (err, predictedCondition) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating predictedCondition.',
                        error: err
                    });
                }

                return res.json({
                    id : predictedCondition._id,
                    prediction : predictedCondition.prediction,
                    date : predictedCondition.date,
                    image : predictedCondition.image,
                    confirmed : predictedCondition.confirmed,
                    userId : predictedCondition.user_id,
                    doctorId : predictedCondition.doctor_id});
            });
        });
    },

    /**
     * predictedConditionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        predictedConditionModel.findByIdAndRemove(id, function (err, predictedCondition) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the predictedCondition.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
