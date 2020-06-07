var express = require('express');
var cityController = require('../controllers/city.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/cityList',cityController.cityList);


module.exports = router;
