	var mongoose = require('mongoose');
	var feedSchema = new mongoose.Schema({
		id       : Number,
		name     : String,
		feedback : String,
		postedON : Date	
	});
	var feedBack;
	exports.Model = function(collection){
		return  feedBack = mongoose.model(collection,feedSchema,collection);
	}