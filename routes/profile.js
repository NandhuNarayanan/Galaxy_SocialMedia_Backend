const Router = require('express');
const router = Router();
const profileController = require('../controller/profileController')


router.get('/:id',profileController.profile)

router.get('/userPost',profileController.userPost)

router.patch('/follow', profileController.follow)

router.patch('/profilePicture', profileController.profilePicture)

router.patch('/editProfile', profileController.editProfile)



module.exports = router