var express = require('express');
var router = express.Router();
var therapyController = require('../controllers/therapyController.js');

/*
 * GET
 */
router.get('/', therapyController.list);

/*
 * GET
 */
router.get('/:id', therapyController.show);

/*
 * POST
 */
router.post('/', therapyController.create);

/*
 * PUT
 */
router.put('/:id', therapyController.update);

/*
 * DELETE
 */
router.delete('/:id', therapyController.remove);

module.exports = router;
