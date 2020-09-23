var express = require('express');
var router = express.Router();
var doctorController = require('../controllers/doctorController.js');


function requiresLogin(req, res, next) {
    console.log("auth-doc!");
      if (req.session && req.session.doctorId) {
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
router.get('/', doctorController.list);
router.get('/:id', doctorController.show);

/*
 * POST
 */

router.post('/', doctorController.create);
router.post('/login', doctorController.login);


/*
 * PUT
 */
router.put('/:id', doctorController.update);

/*
 * DELETE
 */
router.delete('/:id', doctorController.remove);

module.exports = router;
