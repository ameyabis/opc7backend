const models = require('../models');
const utils = require('../util/jwtUtils');
const fs = require('fs');

exports.createPost = (req, res, _next) => {
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
          usersLike: '',
          usersDislike: ''
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
//     },
//     { where: { id: req.params.id }}
//     )
//   })
// }

exports.modifyPost = (req, res, _next) => {
    models.Post.update({
      title: req.body.title,
      content: req.body.content,
      attachment: req.body.attachment,
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
      //ajout like
      if(like === 1) {
        var arrayLike = post.usersLike.split(',')
        var idLike = 0;

        for(var i = 0; arrayLike[i] != req.body.userId; i++) {
          if(arrayLike[i] != undefined){
            idLike = i
          } else {
            break;
          }
        }
        
        idLike++
        if (arrayLike[idLike] != undefined) {
          message = "Vous avez deja like";
        } else {
          post.likes++
          post.usersLike = post.usersLike + ',' + req.body.userId;
  
          message = "Vous aimez le post";
        }
      }
      // ajout dislike
      else if(like === -1){
        var arrayDislike = post.usersDislike.split(',')
        var idLike = 0;

        for(var i = 0; arrayDislike[i] == req.body.userId; i++) {
          if(arrayDislike[i] != undefined){
            idLike = i
          } else {
            break;
          }
        }

        idLike++
        if (arrayDislike[idLike] != undefined) {
          message = "Vous n'aimez pas déjà"
        } else {
          post.dislikes++
          post.usersDislike = post.usersDislike + ',' + req.body.userId;

          message = "Vous n'aimez pas le post";
        }
      }

      //suppression like
      if (like === 0){
        var arrayLike = post.usersLike.split(',')
        var idLike = 0;

        for(var i = 0; arrayLike[i] != req.body.userId; i++){
          idLike = i
        }

        if (arrayLike[idLike++] != undefined){
          console.log(idLike)
          post.likes--
          var myIndex = arrayLike.indexOf(arrayLike[idLike])
          if(myIndex !== -1) {
            arrayLike.splice(myIndex, 1)
          }
          post.usersLike = arrayLike.join(',');
          message = "J'aime retiré"
        }
      }

      //suppression dislike
      if (like === -2) {
        var arrayLike = post.usersDislike.split(',')
        console.log(post.usersDislike.split(','))
        var idLike = 0;

        for(var i = 0; arrayLike[i] != req.body.userId; i++){
          idLike = i
        }

        if (arrayLike[idLike++] != undefined){
          post.dislikes--
          var myIndex = arrayLike.indexOf(arrayLike[idLike])
          if (myIndex !== -1) {
            arrayLike.splice(myIndex, 1)
          }
          post.usersDislike = arrayLike.join(',');
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