	var mongoose = require('mongoose');
	var Schema = new mongoose.Schema({
	
	id     	: Number,
	name   	: String,
	from   	: Date,
	to     	: Date,
	reason 	: String,
	mc     	: Number,
	resDate : Date
	
	});
	var User;
	exports.Model = function(collection){
		return  User = mongoose.model(collection,Schema,collection);
	}