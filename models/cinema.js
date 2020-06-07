var mongoose = require('mongoose');

mongoose.set('useCreateIndex',true);

var cinemaSchema = new mongoose.Schema({
	id : { type : String , required : true , index : { unique : true } },
	mark : { type : String },
	nm : { type : String },
	sellPrice : { type : String },
	addr : { type : String },
	distance : { type : String},
	tag : { type : Object },
	promotion : { type : Object},
	showTimes : { type : String },
	star : { type : String }
});

var cinamaModel = mongoose.model('cinemas' , cinemaSchema);
cinamaModel.createIndexes();

var cinemaList = ()=>{
	return cinamaModel.find((err,res)=>{});
}


module.exports = {
	cinemaList
};