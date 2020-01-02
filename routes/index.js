var express = require('express');
var router = express.Router();
var auth = require('./auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', url : auth.getAuthUrl() });
});

module.exports = router;
