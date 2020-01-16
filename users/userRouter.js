const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

function validateUserId(req, res, next) {
  // do your magic!
  if (req.params.id) {
    Users.getById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(400).json({ message: "Invalid user ID." })
      } else {
        req = { ...req, user: user}
        next();
      }
    })
  }
}

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

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  Posts.insert(req.body)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "Could not add post."})
  });
});

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

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user)
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

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user)
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
  if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: 'Missing user data.' })
  } else if (!req.body.name) {
      res.status(400).json({ message: 'Missing required name field.' })
  } else {
      next()
  }
};

function validatePost(req, res, next) {
  // do your magic!
  const body = req.body
  if (!body) {
      res.status(400).json({ message: 'Missing post data.' })
  } else if (!body.text) {
      res.status(400).json({ message: 'Missing required text field.' })
  } else {
      next()
  };
};

module.exports = router;
