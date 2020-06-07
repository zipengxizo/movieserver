var mongoose = require('mongoose');

mongoose.set('useCreateIndex',true);

var citySchema = new mongoose.Schema({
	id : { type : String , required : true , index : { unique : true } },
	nm : { type : String },
	isHot : { type : String },
	py : { type : String }
});

var cityModel = mongoose.model('citys' , citySchema);
cityModel.createIndexes();

var cityList = ()=>{
	return cityModel.find((err,res)=>{});
}


module.exports = {
	cityList
};