var express = require('express');
var adminController = require('../controllers/admin.js');
const jwt = require('jsonwebtoken');
var router = express.Router();

/* GET users listing. */

router.use((req,res,next)=>{
	//验证token
	let token = req.headers.token;
	let secretOrPrivateKey = "zipeng";
	let {fullPath} = req.body;
	jwt.verify(token,secretOrPrivateKey,(err,decode)=>{
		if (err) {
			res.statusCode = 401;
			res.send({
				msg : 'token失效',
				fullPath : fullPath,
				status : -1
			});
		}
		else{
			if (req.session.username && req.session.isAdmin) {
				next();
			}
			else{
				res.statusCode = 403;
				res.send({
					msg : '没有管理员权限',
					status : -1,
					fullPath : fullPath
				})
			}
		}
	})
});

router.post('/', adminController.index);
router.get('/usersList',adminController.usersList);
router.post('/updateFreeze' , adminController.updateFreeze);
router.post('/deleteUser' , adminController.deleteUser);

module.exports = router;