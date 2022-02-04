const models = require('../models');
const jwtUtils = require('../util/jwtUtils');
const asyncLib = require('async');

exports.likesPost = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    const postId = parseInt(req.params.postId)

    if(postId <= 0) {
        return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
        function(done) {
            models.Post.findOne({
                where: { id: postId }
            })
            .then(function(postFound) {
                done(null, postFound);
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify post' });
            });
        },
        function(postFound, done) {
            if(postFound) {
                models.User.findOne({
                    where: { id: userId }
                })
                .then(function(userFound) {
                    done(null, postFound, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            } else {
                res.status(404).json({ 'error': 'post already liked' });
            }
        },
        function(postFound, userFound, done) {
            if(userFound) {
                models.Like.findOne({
                    where: {
                        userId: userId,
                        postId: postId
                    }
                })
                .then(function(isUserAlreadyLiked) {
                    done(null, postFound, userFound, isUserAlreadyLiked);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify if user already liked' });
                });
            } else {
                res.status(404).json({ 'error': 'user not exist' });
            }
        },
        function(postFound, userFound, isUserAlreadyLiked, done) {
            if(!isUserAlreadyLiked) {
                postFound.addUser(userFound)
                .then(function(alreadyLikeFound) {
                    done(null, postFound, userFound, isUserAlreadyLiked);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to set user reaction' });
                });
            } else {
                res.status(409).json({ 'error': 'message already liked' });
            }
        },
        function(postFound, userFound, done) {
            postFound.update({
                likes: postFound.likes +1,
            }).then(function() {
                done(postFound);
            }).catch(function(err) {
                res.status(500).json({ 'error': 'cannot update post like counter' });
            });
        },
    ], function(postFound) {
        if(postFound) {
            return res.status(201).json(postFound);
        } else {
            return res.status(500).json({ 'error': 'cannot update message' });
        }
    });
};

exports.dislikesPost = function(req, res) {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    const postId = parseInt(req.params.postId)

    if(postId <= 0) {
        return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
        function(done) {
            models.Post.findOne({
                where: { id: postId }
            })
            .then(function(postFound) {
                done(null, postFound);
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify post' });
            });
        },
        function(postFound, done) {
            if(postFound) {
                models.User.findOne({
                    where: { id: userId }
                })
                .then(function(userFound) {
                    done(null, postFound, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            } else {
                res.status(404).json({ 'error': 'post already liked' });
            }
        },
        function(postFound, userFound, done) {
            if(userFound) {
                models.Like.findOne({
                    where: {
                        userId: userId,
                        postId: postId
                    }
                })
                .then(function(isUserAlreadyLiked) {
                    done(null, postFound, userFound, isUserAlreadyLiked);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify if user already liked' });
                });
            } else {
                res.status(404).json({ 'error': 'user not exist' });
            }
        },
        function(postFound, userFound, isUserAlreadyLiked, done) {
            if(!isUserAlreadyLiked) {
                isUserAlreadyLiked.destroy()
                .then(function() {
                    done(null, postFound, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'cannot remove already liked post' });
                });
            } else {
                done(null, postFound, userFound);
            }
        },
        function(postFound, userFound, done) {
            postFound.update({
                likes: postFound.likes -1,
            }).then(function() {
                done(postFound);
            }).catch(function(err) {
                res.status(500).json({ 'error': 'cannot update post like counter' });
            });
        },
    ], function(postFound) {
        if(postFound) {
            return res.status(201).json(postFound);
        } else {
            return res.status(500).json({ 'error': 'cannot update message' });
        }
    });
}