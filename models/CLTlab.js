	var mongoose = require('mongoose');

		var Schema = new mongoose.Schema({	
				EmployeeID : String,
				password   : String,
				EmailID   	: String,
				FullName    : String
				});	
				var CLTlab;
	exports.Model = function(collection){
		return  CLTlab = mongoose.model(collection,Schema,collection);
	}