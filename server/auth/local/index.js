'use strict';

import express from 'express';
import passport from 'passport';
import {
  signToken
} from '../auth.service';
import issue from '../rememberme/issue';

var router = express.Router();
router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if(error) {
      return res.status(401)
        .json(error);
    }
    if(!user) {
      return res.status(404)
        .json({
          message: 'Something went wrong, please try again.'
        });
    }
    user.lastLogin = new Date();
    user.save();
    var token = signToken(user._id, user.role);
    issue(user, (err, t) => {
      res.cookie('remember_me', t, {path: '/', httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 14});
      res.json({
        token
      });
    });
  })(req, res, next);
});

export default router;