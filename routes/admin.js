var express = require('express');
var adminController = require('../controllers/admin.js');
const jwt = require('jsonwebtoken');
var router = express.Router();
var redis = require('redis');
var {redisip,auth} = require('../untils/base');
const client = redis.createClient(6379, redisip);
client.auth(auth);

/* GET users listing. */

router.use((req, res, next) => {
	let {
		fullPath
	} = req.body;
	//验证token
	let token = req.headers.token;
	var username, password, isAdmin;
	client.get(token, function (err, v) {
		console.log(err,v)
		if (!err && v) {
			username = JSON.parse(v).username;
			password = JSON.parse(v).password;
			isAdmin = JSON.parse(v).isAdmin;
			roles = JSON.parse(v).roles;
			let secretOrPrivateKey = username + password;
			jwt.verify(token, secretOrPrivateKey, (err, decode) => {
				if (err) {
					res.statusCode = 401;
					res.send({
						msg: 'token失效',
						fullPath: fullPath,
						status: -1
					});
				} else {
					next();
				}
			})
		} else {
			res.statusCode = 401;
			res.send({
				msg: 'token失效',
				fullPath: fullPath,
				status: -1
			});

		}
	});
});

router.post('/', adminController.index);
router.get('/usersList', adminController.usersList);
router.post('/updateFreeze', adminController.updateFreeze);
router.post('/deleteUser', adminController.deleteUser);

module.exports = router;