const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/refresh', authController.refresh)
router.get('/getUsers/:id',authController.getUsers)
router.get('/getAllUsers',authController.getAllUsers)

router.post('/signup', authController.signup)
router.post('/login', authController.login)



module.exports = router;