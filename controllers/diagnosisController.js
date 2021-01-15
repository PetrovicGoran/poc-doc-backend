var diagnosisModel = require('../models/diagnosisModel.js');

/**
 * diagnosisController.js
 *
 * @description :: Server-side logic for managing diagnosiss.
 */
module.exports = {

    /**
     * diagnosisController.list()
     */
    list: function (req, res) {
        diagnosisModel.find(function (err, diagnosiss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting diagnosis.',
                    error: err
                });
            }
            return res.json(diagnosiss);
        });
    },

    /**
     * diagnosisController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        diagnosisModel.findOne({_id: id}, function (err, diagnosis) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting diagnosis.',
                    error: err
                });
            }
            if (!diagnosis) {
                return res.status(404).json({
                    message: 'No such diagnosis'
                });
            }
            return res.json(diagnosis);
        });
    },

    /**
     * diagnosisController.create()
     */
    create: function (req, res) {
        var diagnosis = new diagnosisModel({
			name : req.body.name,
			description : req.body.description,
			user_id : req.body.user_id,
			doctor_id : req.body.doctor_id

        });

        diagnosis.save(function (err, diagnosis) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating diagnosis',
                    error: err
                });
            }
            return res.status(201).json(diagnosis);
        });
    },

    /**
     * diagnosisController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        diagnosisModel.findOne({_id: id}, function (err, diagnosis) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting diagnosis',
                    error: err
                });
            }
            if (!diagnosis) {
                return res.status(404).json({
                    message: 'No such diagnosis'
                });
            }

            diagnosis.name = req.body.name ? req.body.name : diagnosis.name;
			diagnosis.description = req.body.description ? req.body.description : diagnosis.description;
			diagnosis.user_id = req.body.user_id ? req.body.user_id : diagnosis.user_id;
			diagnosis.doctor_id = req.body.doctor_id ? req.body.doctor_id : diagnosis.doctor_id;
			
            diagnosis.save(function (err, diagnosis) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating diagnosis.',
                        error: err
                    });
                }

                return res.json(diagnosis);
            });
        });
    },

    /**
     * diagnosisController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        diagnosisModel.findByIdAndRemove(id, function (err, diagnosis) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the diagnosis.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
