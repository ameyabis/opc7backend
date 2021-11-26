const Post = require('../models/post');

exports.createPost = (req, res, _next) => {
    const { idUSERS, title, content, attachment} = req.body

    Post.create({
        idUSERS,
        title,
        content,
        attachment,
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
    Post.destroy({ 
        where: { id: req.params.id } 
    })
    .then(() => {
        return res.status(200).json({ message: 'suppression reussite !'})
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getOnePost = (req, res, _next) => {
    Post.findByPk(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(error => res.status(400).json({ error }))
};

exports.getAllPosts = (_req, res, _next) => {
    Post.findAll()
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error }));
};

exports.likeOnePost = (req, res, _next) => {
    const like = req.body.like;

    Post.findByPk( req.params.id )
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