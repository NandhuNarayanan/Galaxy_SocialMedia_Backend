const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const verifyJWT = require('../controller/middleware/verifyJWT');

router.get('/refresh', authController.refresh)
router.get('/logout', verifyJWT, authController.logout)
router.get('/getUsers/:id',authController.getUsers)
router.get('/getAllUsers/:id',authController.getAllUsers)

router.post('/signup', authController.signup)
router.post('/login', authController.login)



module.exports = router;