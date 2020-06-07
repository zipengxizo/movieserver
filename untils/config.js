var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var redis = require('redis');
var {redisip,auth} = require('./base');
var client = redis.createClient(6379, redisip);
client.auth(auth);

client.on('connect',function(){
    console.log('redis 连接成功');
});
client.on('error', function (err) {
    console.log('redis 连接失败');
});
client.on('ready',function(res){
    console.log('redis is ready');
});

client.on('end',function(err){
    console.log('redis is end');
});

var Mongoose = {
	url: 'mongodb://xzp:xzp362430%40@localhost:27017/miaomiao?authSource=admin',
	connect() {
		mongoose.connect(this.url, {
			useNewUrlParser: true
		}, (err) => {
			if (err) {
				console.log('mongodb连接失败');
				return;
			}
			console.log('mongodb连接成功');
		});
	}
};

var Email = {
	config: {
		host: "smtp.qq.com",
		port: 587,
		auth: {
			user: 'new666@qq.com',
			pass: 'xxxxxxxxxx'
		}
	},
	get transporter() {
		return nodemailer.createTransport(this.config);
	},
	get verify() {
		return Math.random().toString().substring(2, 6);
	},
	get time() {
		return Date.now();
	}
};

var Head = {
	baseUrl: 'http://localhost:3000/uploads/'
}

module.exports = {
	Mongoose,
	Email,
	Head
};