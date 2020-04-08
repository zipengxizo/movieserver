
var movieModel = require('../models/movie.js');

var movieList = async (req,res,next)=>{
	
	var result = await movieModel.moviesList();
	if(result){
		res.send({
			msg : '电影信息',
			status : 0,
			data : {
				movieList : result
			}
		});
	}
	else{
		res.send({
			msg : '获取用电影信息失败',
			status : -1
		});
	}

}

module.exports = {
	movieList
};