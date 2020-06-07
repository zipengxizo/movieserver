
var cityModel = require('../models/city.js');

var cityList = async (req,res,next)=>{
	
	var result = await cityModel.cityList();
	if(result){
		res.send({
			msg : '影院信息',
			status : 0,
			data : {
				cities : result
			}
		});
	}
	else{
		res.send({
			msg : '获取用影院信息失败',
			status : -1
		});
	}

}

module.exports = {
	cityList
};