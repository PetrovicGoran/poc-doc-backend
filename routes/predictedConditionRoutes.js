var express = require('express');
var router = express.Router();
var predictedConditionController = require('../controllers/predictedConditionController.js');

router.get('/:id', predictedConditionController.show);
router.get('/user/:id', predictedConditionController.userList);
router.get('/doctor/:id', predictedConditionController.doctorList);


router.post('/', predictedConditionController.create);

router.put('/:id', predictedConditionController.update);

router.delete('/:id', predictedConditionController.remove);

module.exports = router;
