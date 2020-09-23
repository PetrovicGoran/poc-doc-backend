var express = require('express');
var router = express.Router();
var patientController = require('../controllers/patientController.js');


function requiresLogin(req, res, next) {
    console.log("auth!");
      if (req.session && req.session.patientId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', patientController.list);
router.get('/:id', patientController.show);

/*
 * POST
 */
router.post('/login', patientController.login);
router.post('/', patientController.create);

/*
 * PUT
 */
router.put('/:id', patientController.update);

/*
 * DELETE
 */
router.delete('/:id', patientController.remove);

module.exports = router;
