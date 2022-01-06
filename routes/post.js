const express = require('express');
const router = express.Router();

const postCtrl = require('../constrollers/post');
// const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', multer, postCtrl.createPost);
router.put('/:id', multer, postCtrl.modifyPost);
router.delete('/:id', postCtrl.deletePost);
router.get('/:id', postCtrl.getOnePost);
router.get('/', postCtrl.getAllPosts);
router.post('/:id/like', postCtrl.likeOnePost);

module.exports = router;