const express = require('express');

const Posts = require('./postDb');

const router = express.Router();


//** GET **//
router.get('/', (req, res) => {
  // do your magic!
  Posts.get()
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    res.status(500).json({ error: "The posts information could not be retrieved." })
  })
});
//** GET BY ID **//
router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
      res.status(200).json(req.post)
});

//** DELETE **//
router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.post.id)
  .then(del => {
    if (del === 1 ){
      res.status(200).json({ message: "Post deleted."})
    } else {
      res.status(500).json({ message: "The post could not be removed."})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "The post could not be deleted."})
  });
});

//** PUT **//
router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  let changes = req.body;
  if (!changes){
    res.status(400).json({ errorMessage: "Please provide changes."})
  }
  Posts.update(req.post.id, changes)
  .then(upd => {
    if (upd === 1) {
      Posts.getById(req.post.id)
      .then(post => {
        res.status(200).json(post)
      })
    } else {
      res.status(500).json({ error: "The post could not be modified."})
    };
  })
  .catch(err => {
    res.status(500).json({ error: "The post did not update."})
  });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  if (req.params.id) {
    Posts.getById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(400).json({ message: "Invalid user ID." })
      } else {
        req.post = post
        next();
      }
    })
  }
}

module.exports = router;
