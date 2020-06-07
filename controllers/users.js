var {
	Email,
	Head
} = require('../untils/config.js');
var UserModel = require('../models/users.js');
var fs = require('fs');
var url = require('url');
const jwt = require('jsonwebtoken');
var {
	setCrypto,
	createVerify
} = require('../untils/base.js');
var request = require('request');
var redis = require('redis');
var {redisip,auth} = require('../untils/base');
const client = redis.createClient(6379, redisip);
client.auth(auth)

var loginWeixin = async (req, res, next) => {
	var {
		code
	} = req.query;
	var appid = 'wx2fabe09bd81eee32';
	var secret = '0e52139370d1fc8dcea09be40be337f2';
	var baseUrl = 'https://api.weixin.qq.com/sns/jscode2session'
	var code2SessionUrl = baseUrl + '?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'
	request(code2SessionUrl, function (error, response) {
		if (!error && response.statusCode == 200) {
			var obj = JSON.parse(response.body);
			var openid = obj.openid;
			var session_key = obj.session_key;
			//生成token
			let secretOrPrivateKey = openid + session_key;
			let token = jwt.sign(obj, secretOrPrivateKey, {
				expiresIn: 60 * 60 * 24
			});
			//要用redis把token和username,isAdmin等字段，用key和value存起来
			let redisObj = {
				openid: openid,
				session_key: session_key
			};
			client.set(token, JSON.stringify(redisObj));
			client.get(token, function (err, v) {
				console.log("redis get token =", err, v);
			})
			res.send({
				msg: '登录成功',
				status: 0,
				data: {
					token: token,
					openid: openid
				}
			});

		} else {
			res.send({
				msg: '登录失败',
				status: -1
			});
		}
	})
}

var login = async (req, res, next) => {
	var {
		username,
		password,
		verifyImg
	} = req.body;

	if (verifyImg !== req.session.verifyImg) {
		res.send({
			msg: '验证码输入不正确',
			status: -3
		});
		return;
	}

	var result = await UserModel.findLogin({
		username,
		password: setCrypto(password)
	});

	if (result) {

		req.session.username = username;
		req.session.isAdmin = result.isAdmin;
		req.session.userHead = result.userHead;
		req.session.password = result.password;
		//生成token
		let content = {
			name: req.body.username
		}
		let secretOrPrivateKey = result.username + result.password;
		let token = jwt.sign(content, secretOrPrivateKey, {
			expiresIn: 60 * 60 * 24
		});
		//要用redis把token和username,isAdmin等字段，用key和value存起来
		var redisObj = {
			username: username,
			isAdmin: result.isAdmin,
			password: result.password,
			roles:result.roles
		};
		client.set(token, JSON.stringify(redisObj));
		if (result.isFreeze) {
			res.send({
				msg: '账号已冻结',
				status: -2
			});
		} else {
			res.send({
				msg: '登录成功',
				status: 0,
				data: {
					token: token,
					username:username
				}
			});
		}

	} else {
		res.send({
			msg: '登录失败',
			status: -1
		});
	}
};

var register = async (req, res, next) => {

	var {
		username,
		password,
		email,
		verify
	} = req.body;

	// if( email !== req.session.email || verify !== req.session.verify ){
	// 	res.send({
	// 		msg : '验证码错误',
	// 		status : -1
	// 	});
	// 	return;
	// }

	// if( (Email.time - req.session.time)/1000 > 60 ){
	// 	res.send({
	// 		msg : '验证码已过期',
	// 		status : -3
	// 	});
	// 	return;
	// }

	var result = await UserModel.save({
		username,
		password: setCrypto(password),
		email
	});

	if (result) {
		res.send({
			msg: '注册成功',
			status: 0
		});
	} else {
		res.send({
			msg: '注册失败',
			status: -2
		});
	}


};

var verify = async (req, res, next) => {

	var email = req.query.email;
	var verify = Email.verify;

	req.session.verify = verify;
	req.session.email = email;
	req.session.time = Email.time;

	var mailOptions = {
		from: 'new666@qq.com',
		to: email,
		subject: '网邮箱验证码',
		text: '验证码：' + verify
	}

	Email.transporter.sendMail(mailOptions, (err) => {

		if (err) {
			res.send({
				msg: '验证码发送失败',
				status: -1
			});
		} else {
			res.send({
				msg: '验证码发送成功',
				status: 0
			});
		}

	});



};

var logout = async (req, res, next) => {
	req.session.username = '';
	res.send({
		msg: '退出成功',
		status: 0
	});
};

var getUser = async (req, res, next) => {

	var token = req.headers.token;
	console.log('token=', token);
	var username, password, isAdmin;
	client.get(token, function (err, v) {
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
						status: -1
					});
				} else {
					res.send({
						msg: '获取用户信息成功',
						status: 0,
						data: {
							username: username,
							isAdmin: isAdmin,
							userHead: '',
							roles: roles
						}
					});
				}
			})
		} else {
			res.statusCode = 401;
			res.send({
				msg: 'token失效',
				status: -1
			});

		}
	});


};

var findPassword = async (req, res, next) => {
	var {
		email,
		password,
		verify
	} = req.body;

	if (email === req.session.email && verify === req.session.verify) {
		var result = await UserModel.updatePassword(email, setCrypto(password));
		if (result) {
			res.send({
				msg: '修改密码成功',
				status: 0
			});
		} else {
			res.send({
				msg: '修改密码失败',
				status: -1
			});
		}
	} else {
		res.send({
			msg: '验证码失败',
			status: -1
		});
	}

};

var verifyImg = async (req, res, next) => {
	var result = await createVerify(req, res);
	if (result) {
		res.send(result);
	}
}

var uploadUserHead = async (req, res, next) => {

	//console.log( req.file );

	await fs.rename('public/uploads/' + req.file.filename, 'public/uploads/' + req.session.username + '.jpg');

	var result = await UserModel.updateUserHead(req.session.username, url.resolve(Head.baseUrl, req.session.username + '.jpg'));

	if (result) {
		res.send({
			msg: '头像修改成功',
			status: 0,
			data: {
				userHead: url.resolve(Head.baseUrl, req.session.username + '.jpg')
			}
		});
	} else {
		res.send({
			msg: '头像修改失败',
			status: -1
		});
	}

}

module.exports = {
	login,
	register,
	verify,
	logout,
	getUser,
	findPassword,
	verifyImg,
	uploadUserHead,
	loginWeixin
};