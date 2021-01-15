var therapyModel = require('../models/therapyModel.js');

/**
 * therapyController.js
 *
 * @description :: Server-side logic for managing therapys.
 */
module.exports = {

    /**
     * therapyController.list()
     */
    list: function (req, res) {
        therapyModel.find(function (err, therapys) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting therapy.',
                    error: err
                });
            }
            return res.json(therapys);
        });
    },

    /**
     * therapyController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        therapyModel.findOne({_id: id}, function (err, therapy) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting therapy.',
                    error: err
                });
            }
            if (!therapy) {
                return res.status(404).json({
                    message: 'No such therapy'
                });
            }
            return res.json(therapy);
        });
    },

    /**
     * therapyController.create()
     */
    create: function (req, res) {
        var therapy = new therapyModel({
			name : req.body.name,
			description : req.body.description,
			start_date : req.body.start_date,
			end_date : req.body.end_date,
			repetition : req.body.repetition,
            user_id : req.body.user_id,
            doctor_id : req.body.doctor_id

        });

        therapy.save(function (err, therapy) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating therapy',
                    error: err
                });
            }
            return res.status(201).json(therapy);
        });
    },

    /**
     * therapyController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        therapyModel.findOne({_id: id}, function (err, therapy) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting therapy',
                    error: err
                });
            }
            if (!therapy) {
                return res.status(404).json({
                    message: 'No such therapy'
                });
            }

            therapy.name = req.body.name ? req.body.name : therapy.name;
			therapy.description = req.body.description ? req.body.description : therapy.description;
			therapy.start_date = req.body.start_date ? req.body.start_date : therapy.start_date;
			therapy.end_date = req.body.end_date ? req.body.end_date : therapy.end_date;
			therapy.repetition = req.body.repetition ? req.body.repetition : therapy.repetition;
            therapy.user_id = req.body.user_id ? req.body.user_id : therapy.user_id;
            therapy.doctor_id = req.body.doctor_id ? req.body.doctor_id : therapy.doctor_id;
			
            therapy.save(function (err, therapy) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating therapy.',
                        error: err
                    });
                }

                return res.json(therapy);
            });
        });
    },

    /**
     * therapyController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        therapyModel.findByIdAndRemove(id, function (err, therapy) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the therapy.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
