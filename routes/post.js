const Router = require('express');
const router = Router();
const postController = require('../controller/postController');
const likeController = require('../controller/likeController');
const commentController = require('../controller/commentController');

router.post('/uploadpost', postController.post)

router.get('/getpost', postController.getPosts)

router.get('/getUserPost/:id', postController.getUserPost)

router.get('/getSavedPost/:id', postController.getSavedPost)

router.get('/getComments/:id', commentController.getComments )

router.patch('/liked',likeController.liked)

router.patch('/savedPost',postController.savedPost)

router.patch('/deletePost',postController.deletePost)

router.post('/comment', commentController.comment )





module.exports = router
