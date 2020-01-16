const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

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

router.get('/:id', (req, res) => {
  // do your magic!
  Posts.getById(req.params.id)
  .then(post => {
    if (!post){
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      res.status(200).json(post)
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: "The post information could not be retrieved." })
  });
});

router.delete('/:id', (req, res) => {
  // do your magic!
  Posts.getById(req.params.id)
  .then(post => {
    if (!post){
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }else {
      Posts.remove(req.params.id)
      .then(del => {
        if (del === 1 ){
          res.status(200).json({ message: "Post deleted."})
        } else {
          res.status(500).json({ message: "The post could not be removed."})
        }
      })
    }    
  })
  .catch(err => {
    res.status(500).json({ message: "The post could not be deleted."})
  });
});



router.put('/:id', (req, res) => {
  // do your magic!
  let changes = req.body;
  if (!changes){
    res.status(400).json({ errorMessage: "Please provide changes."})
  }
  Posts.getById(req.params.id)
  .then(post => {
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      Posts.update(req.params.id, changes)
      .then(upd => {
        if (upd === 1) {
          Posts.getById(req.params.id)
          .then(post => {
            res.status(200).json(post)
          })
        } else {
          res.status(500).json({ error: "The post could not be modified."})
        };
      })
      .catch(err => {
        res.status(500).json({ error: "The post did not update."})
      })
    }
  })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
