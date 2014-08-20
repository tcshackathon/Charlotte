
//helps connect with MongoDB
var mongoose = require('mongoose');

//reservation schema
var User= function(){
    var Schema = new mongoose.Schema({
        
        id     	: Number,
        name   	: String,
        from   	: Date,
        to     	: Date,
        reason 	: String,
        mc     	: Number,
        resDate : Date
        
    });
    var User = mongoose.model('reservation',Schema);
    return User;
};


//login authentication schema
var CLTLab = function(){
    var Schema = new mongoose.Schema({
        
        EmployeeID : String,
        password   : String,
        EmailID   	: String,
        FullName    : String
   
    },{ collection : 'charlottelabauthentication' }); //helps prevent pluralization 
        
    var CLTLab = mongoose.model('charlottelabauthentication',Schema);
    return CLTLab;
};

var CLTAdmin = function(){
    var Schema = new mongoose.Schema({
        
        EmployeeID : String,
        password   : String,
        EmailID   	: String,
        FullName    : String
   
    },{ collection : 'admins' }); //helps prevent pluralization 
        
    var CLTLab = mongoose.model('admins',Schema);
    return CLTLab;
};


//software inventory schema
var Inv = function(){
    var Schema = new mongoose.Schema({
        
        sw : String,
        sw_name: String,
        mc   : new Array()
    
    },{ collection : 'SWInventory' }); //helps prevent pluralization 
        
    var Inv = mongoose.model('SWInventory',Schema);
    return Inv;
};

//feedback schema
var feedBack = function(){
    var feedSchema = new mongoose.Schema({
       
        id       : Number,
        name     : String,
        feedback : String,
        postedON : Date       
    });

    var feedBack = mongoose.model('feedBack',feedSchema);
    return feedBack;
};

//exports all the collections
exports.User=User;
exports.CLTLab=CLTLab;
exports.Inv=Inv;
exports.feedBack=feedBack;
exports.CLTAdmin=CLTAdmin;
