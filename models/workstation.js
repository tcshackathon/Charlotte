	var mongoose = require('mongoose');
	var Schema = new mongoose.Schema({
	
	id   : Number,
	Unavailiable   : Date[],
	Software 	: String[],
	});
	var Workstation;
	exports.Model = function(collection){
		return  User = mongoose.model(collection,Schema,collection);
	}