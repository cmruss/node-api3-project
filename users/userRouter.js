const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

//** POST USER **//
router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "Could not add user."})
  });
});

//** POST POST **//
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const id = req.params.id
  let post = req.body

  post = {...post, user_id: id}

  Posts.insert(post)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "Could not add post."})
  });
});

//** GET **//
router.get('/', (req, res) => {
  // do your magic!
  Users.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    res.status(500).json({ error: "The posts information could not be retrieved." })
  })
});

//** GET BY ID **//
router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user)
});

//** GET POSTS BY ID **//
router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
  .then(posts => {
    if (posts.length === 0){
      res.status(200).json({ message: "User has no posts"})
    } else {
      res.status(200).json(posts)
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: "Users posts could not be retrieved." })
  });
});

//** DELETE **//
router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
  .then(del => {
    if (del === 1 ){
      res.status(200).json({ message: "User deleted."})
    } else {
      res.status(500).json({ message: "The user could not be removed."})
    }
  })
  .catch(err => {
    res.status(500).json({ message: "The user could not be deleted."})
  });
});

//** PUT **//
router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  let changes = req.body;
  if (!changes){
    res.status(400).json({ errorMessage: "Please provide changes."})
  }
    Users.update(req.user.id, changes)
    .then(upd => {
      if (upd === 1) {
        Users.getById(req.user.id)
        .then(user => {
          res.status(200).json(user)
        })
      } else {
        res.status(500).json({ error: "The user could not be modified."})
      };
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The user did not update."})
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  if (req.params.id) {
    Users.getById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(400).json({ message: "Invalid user ID." })
      } else {
        req.user = user
        next();
      }
    })
  }
};

function validateUser(req, res, next) {
  // do your magic!
  if (Object.keys(req.body).length < 1){
      res.status(400).json({ message: 'Missing user data.' })
  } else if (!req.body.name) {
      res.status(400).json({ message: 'Missing required name field.' })
  } else {
      next();
  }
};

function validatePost(req, res, next) {
  // do your magic!
  if (Object.keys(req.body).length < 1) {
      res.status(400).json({ message: 'Missing post data.' })
  } else if (!req.body.text) {
      res.status(400).json({ message: 'Missing required text field.' })
  } else {
      next();
  };
};

module.exports = router;
