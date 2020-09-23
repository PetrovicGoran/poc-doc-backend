var messageModel = require('../models/messageModel.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * messageController.js
 *
 * @description :: Server-side logic for managing messages.
 */
module.exports = {

    /**
     * messageController.list()
     */
    list: function (req, res) {
        messageModel.aggregate([
            {
                $match: 
                {
                    $or:
                    [
                        { 'fromPatient': ObjectId(req.params.patientId), 'toDoctor': ObjectId(req.params.doctorId)},
                        {'fromDoctor': ObjectId(req.params.doctorId),'toPatient': ObjectId(req.params.patientId)}
                    ]
                }
            },
            {
                $project : {
                    _id : 1,
                    content : 1,
                    fromPatient : 1,
                    toPatient : 1,
                    fromDoctor : 1,
                    toDoctor : 1
                }
            }

        ]).exec(function (err, messages){
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }
            return res.json(messages);
        });
    },

    /**
     * messageController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        messageModel.findOne({_id: id}, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting message.',
                    error: err
                });
            }
            if (!message) {
                return res.status(404).json({
                    message: 'No such message'
                });
            }
            return res.json(message);
        });
    },

    /**
     * messageController.create()
     */
    create: function (req, res) {
        var message;
        if(req.body.fromPatient != ''){
           message = new messageModel({
                fromPatient : ObjectId(req.body.fromPatient),
                toDoctor : ObjectId(req.body.toDoctor),
                content : req.body.content
    
            });
        }
        else{
            message = new messageModel({
                fromDoctor : ObjectId(req.body.fromDoctor),
                toPatient : ObjectId(req.body.toPatient),
                content : req.body.content
            });
        }

        message.save(function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating message',
                    error: err
                });
            }
            return res.status(201).json(message);
        });
    },

    /**
     * messageController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        messageModel.findOne({_id: id}, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting message',
                    error: err
                });
            }
            if (!message) {
                return res.status(404).json({
                    message: 'No such message'
                });
            }

            message.patientId = req.body.patientId ? req.body.patientId : message.patientId;
			message.doctorId = req.body.doctorId ? req.body.doctorId : message.doctorId;
			message.content = req.body.content ? req.body.content : message.content;
			
            message.save(function (err, message) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating message.',
                        error: err
                    });
                }

                return res.json(message);
            });
        });
    },

    /**
     * messageController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        messageModel.findByIdAndRemove(id, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the message.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
