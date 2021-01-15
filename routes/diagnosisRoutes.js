var express = require('express');
var router = express.Router();
var diagnosisController = require('../controllers/diagnosisController.js');

/*
 * GET
 */
router.get('/', diagnosisController.list);

/*
 * GET
 */
router.get('/:id', diagnosisController.show);

/*
 * POST
 */
router.post('/', diagnosisController.create);

/*
 * PUT
 */
router.put('/:id', diagnosisController.update);

/*
 * DELETE
 */
router.delete('/:id', diagnosisController.remove);

module.exports = router;
