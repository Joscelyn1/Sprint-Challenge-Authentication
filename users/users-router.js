const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/authenticate-middleware.js');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json({ users, loggedInUser: req.user.username });
    })
    .catch(err => res.send(err));
});
router.get('/:username', restricted, (req, res) => {
  let username = req.params.username;
  Users.findByName(username)
    .then(user => {
      res.json({ user, loggedInUser: req.user.username });
    })
    .catch(err => res.send(err));
});

module.exports = router;
