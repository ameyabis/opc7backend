const models = require('../models');
const utils = require('../util/jwtUtils');
const fs = require('fs');

exports.createPost = (req, res, _next) => {
  const attachmentURL = ''
  
  const id = utils.getUserId(req.headers.authorization)
  models.User.findOne({
    attributes: ['id', 'email', 'firstname', 'surname'],
    where: { id: id }
  })
  .then(user => {
    // console.log(user)
    if (user !== null) {
      const content = req.body.content;
      const title = req.body.title
      if (req.file != undefined) {
        attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      } else {
        attachmentURL == null
      };
      console.log("attachment" + attachmentURL)
      if ((content == 'null' && attachmentURL == null && title == 'null')) {
        res.status(400).json({ error: 'Rien à publier' })
      } else {
        models.Post.create({
          content: content,
          title: title,
          attachment: attachmentURL,
          likes: 0,
          UserId: user.id
        })
        .then((newPost) => {
          console.log(newPost)
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

exports.modifyPost = (req, res, _next) => {
    models.Post.update({
        title: req.body.title,
        content: req.body.content,
        attachment: ''//`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
      console.log(posts)
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