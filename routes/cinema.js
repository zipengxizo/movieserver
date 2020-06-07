var express = require('express');
var cinemaController = require('../controllers/cinema.js');
var router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/cinemaList',cinemaController.cinemaList);


module.exports = router;
