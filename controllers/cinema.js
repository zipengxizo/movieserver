
var cinemaModel = require('../models/cinema.js');

var cinemaList = async (req,res,next)=>{
	
	var result = await cinemaModel.cinemaList();
	if(result){
		res.send({
			msg : '影院信息',
			status : 0,
			data : {
				cinemas : result
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
	cinemaList
};