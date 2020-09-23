var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController.js');

/*
 * GET
 */
router.get('/:doctorId/:patientId', messageController.list);

/*
 * POST
 */
router.post('/', messageController.create);

/*
 * PUT
 */
router.put('/:id', messageController.update);

/*
 * DELETE
 */
router.delete('/:id', messageController.remove);

module.exports = router;
