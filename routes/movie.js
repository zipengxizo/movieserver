var express = require('express');
var movieController = require('../controllers/movie.js');
var router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getMovieList',movieController.movieList);


module.exports = router;
