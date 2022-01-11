const Post = require('../models/post');
const User = require('../models/user')
const fs = require('fs');

exports.createPost = (req, res, _next) => {
    const { userId, title, content, attachment} = req.body

    Post.create({
        userId,
        title,
        content,
        attachment, //: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: "",
        usersDisliked: "",
    })
    .then(function(post) {
        return res.status(201).json({
            post
        })
    })
    .catch(function() {
        return res.status(500).json({ 'error': 'Impossible d\'ajouter le post' });
    })
};

exports.modifyPost = (req, res, _next) => {
    Post.update({
        title: req.body.title,
        content: req.body.content,
        attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    },
    { where: { id: req.params.id }}
    )
    .then(() => {
        return res.status(201).json({ message: 'Modification reussite !' })
    })
    .catch(error => res.status(500).json({ error }))
};

exports.deletePost = (req, res, _next) => {
    Post.findByPk(req.params.id)
    .then(post => {
      const filename = post.attachment.split('/images/')[1];
      fs.unlink(`images/${filename}`,() => {
        Post.destroy({ where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'suppression reussite !'}))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getOnePost = (req, res, _next) => {
    Post.findByPk(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(error => res.status(400).json({ error }))
};

exports.getAllPosts = async (_req, res, _next) => {
    await Post.findAll()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json({ error }));
};

exports.likeOnePost = (req, res, _next) => {
    const like = req.body.like;

    Post.findByPk( req.body.id )
      .then(post => {
        let message = null;
        if(like === 1) {
          post.likes++
          post.usersLiked.push(req.body.idUSERS);
          message = "Vous aimez le post";
        }
        else if(like === -1){
          post.dislikes++;
          post.usersDisliked.push(req.body.idUSERS);
          message = "Vous n'aimez pas le post";
        }
  
        if (like === 0){
          if (post.usersLiked.find(idUSERS => idUSERS == req.body.idUSERS) != undefined) {
            post.likes--;
            const filterUsersLiked = post.usersLiked.filter(elt => elt != req.body.idUSERS);
            console.log(filterUsersLiked);
            post.usersLiked = filterUsersLiked;
            console.log(post.usersLiked);
            message = "J'aime retiré"
          } else {
            post.dislikes--;
            const filterUsersDisliked = post.usersLiked.filter(elt => elt != req.body.idUSERS);
            post.usersDisliked = filterUsersDisliked;
            message = "Je n'aime plus retiré";
          }
        }
  
        Post.update({
          likes: post.likes,
          dislikes: post.dislikes,
          usersLiked: post.usersLiked,
          usersDisliked: post.usersDisliked
        },
        { where : { id: req.params.id }}
        )
          .then(() => res.status(200).json({ message: message }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(400).json({ error }));
};