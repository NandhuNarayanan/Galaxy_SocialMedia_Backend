const Router = require('express');
const router = Router();
const postController = require('../controller/postController');
const likeController = require('../controller/likeController');
const commentController = require('../controller/commentController');

router.post('/uploadpost', postController.post)

router.get('/getpost', postController.getPosts)

router.patch('/liked',likeController.liked)

router.post('/comment', commentController.comment )

router.get('/getComments/:id', commentController.getComments )




module.exports = router
