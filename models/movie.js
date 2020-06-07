var mongoose = require('mongoose');

mongoose.set('useCreateIndex',true);

var movieSchema = new mongoose.Schema({
	id : { type : String , required : true , index : { unique : true } },
	haspromotionTag : { type : Boolean },
	img : { type : String },
	version : { type : String },
	nm : { type : String },
	preShow : { type : Boolean},
	sc : { type : String },
	globalReleased : { type : Boolean},
	wish : { type : String },
	star : { type : String },
	rt : { type : String ,},
	showst : { type : String  },
	wishst : { type : String },
	comingTitle : { type : String },
});

var movieModel = mongoose.model('movies' , movieSchema);
movieModel.createIndexes();

var moviesList = ()=>{
	return movieModel.find((err,res)=>{});
}


module.exports = {
	moviesList
};