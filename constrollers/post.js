const models = require('../models');
const utils = require('../util/jwtUtils');
const fs = require('fs');

exports.createPost = (req, res, _next) => {
  // const attachment = ''
  
  const id = utils.getUserId(req.headers.authorization)
  models.User.findOne({
    attributes: ['id', 'email', 'firstname', 'surname'],
    where: { id: id }
  })
  .then(user => {
    if (user !== null) {
      const content = req.body.content;
      const title = req.body.title
      const attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      if ((content == 'null' && attachment == null && title == 'null')) {
        res.status(400).json({ error: 'Rien à publier' })
      } else {
        models.Post.create({
          content: content,
          title: title,
          attachment: attachment,
          UserId: user.id,
          likes: 0,
          dislikes: 0,
          usersLike: 0,
          usersDislike: 0
        })
        .then((newPost) => {
          res.status(201).json(newPost)
        })
        .catch((err) => {
          res.status(500).json(err)
        })
      }
    } else {
      res.status(400).json(error);
    }
  })
  .catch(error => res.status(500).json(error))
};

// exports.modify = (req, res, _next) => {
//   const id = utils.getUserId(req.headers.authorization);
//   models.User.findOne({
//     attributes: ['id', 'email', 'firstname', 'surname', 'isAdmin'],
//     where: { id: id }
//   })
//   .then(user => {
//     models.Post.update({
//       tilte: req.body.title,
//       content: req.body.content,
//       attachment: req.body.attachment
//     })
//   })
// }

exports.modifyPost = (req, res, _next) => {
    models.Post.update({
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
    models.Post.findByPk(req.params.id)
    .then(post => {
      const filename = post.attachment.split('/images/')[1];
      fs.unlink(`images/${filename}`,() => {
        models.Post.destroy({ where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'suppression reussite !'}))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getAllPosts = (_req, res, _next) => {
    models.Post.findAll({
      include: [{
        model: models.User,
        attributes: ['firstname', 'surname']
      }],
      order:[['createdAt', 'DESC']]
    })
    .then(posts => {
      if (posts.length > null) {
        res.status(200).json(posts)
      } else {
        res.status(404).json({ error: 'Pas de post à afficher' })
      }
    })
    .catch(err => res.status(500).json( err ));
};

exports.getOnePost = (req, res, _next) => {
  models.Post.findByPk(req.params.id)
  .then(post => res.status(200).json(post))
  .catch(error => res.status(400).json({ error }))
};

exports.likeOnePost = (req, res, next) => {
  const like = req.body.like;

  models.Post.findByPk(req.params.id)
    .then(post => {
      let message = null;
      if(like === 1) {
        post.likes++
        post.usersLike = req.body.userId;

        message = "Vous aimez le post";
      }
      else if(like === -1){
        post.dislikes++;
        // post.usersDislike = req.body.userId;
        message = "Vous n'aimez pas le post";
      }

      if (like === 0){
        if (post.usersLike.find(userId => userId == req.body.userId) != undefined) {
          post.likes--;
          const filterUsersLike = post.usersLike.filter(elt => elt != req.body.userId);
          console.log(filterUsersLike);
          post.usersLike = filterUsersLike;
          console.log(post.usersLike);
          message = "J'aime retiré"
        } else {
          post.dislikes--;
          const filterUsersDislike = post.usersLike.filter(elt => elt != req.body.userId);
          post.usersDislike = filterUsersDislike;
          message = "Je n'aime plus retiré";
        }
      }

      models.Post.update({
        likes: post.likes,
        dislikes: post.dislikes,
        usersLike: post.usersLike,
        usersDislike: post.usersDislike
      },
      { where: { id: post.id }}
      )
        .then(() => res.status(200).json({ message: message }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};