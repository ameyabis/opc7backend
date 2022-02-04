const express = require('express');
const router = express.Router();

const likeCtrl = require('../constrollers/like');
const auth = require('../middleware/auth');

router.post(':postId/vote/like', auth, likeCtrl.likesPost);
router.post(':postId/vote/dislike', auth, likeCtrl.dislikesPost);


module.exports = router;