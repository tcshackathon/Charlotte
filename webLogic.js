var mongoose = require('mongoose');
var schema = require('./schema');

//schemas for the database collections from schema.js file
var User = schema.User();
var CLTlab = schema.CLTLab();
var CLTAdmin = schema.CLTAdmin();
var Inv = schema.Inv();
var feedBack = schema.feedBack();

//One page solution(everything is in index.ejs)
exports.index = function(req,res){
	res.render('./views/index',{message:""});
};

//Feedback--in modal(index.ejs)
exports.feedback = function(req, res){
	
	new feedBack({
			id : parseInt(req.body.id),
			name : req.body.name,
			feedback : req.body.feedback,
			postedON : new Date()
			
	}).save(function(err,doc){
		if(err) {
			console.log("Error from MongoDB: socket feedback " + err);
			res.send({msg:'Database Error. Please try later.'});
		}
		else {
			
			res.send({msg:'You Feedback has been successfully recorded'});
			sendgrid.send({ 
					  to: 'somenath.ghosh84@gmail.com', 
					  from: 'NoReply_TCSCharlottelab@tcs.com', 
					  subject: 'FeedBack', 
					  text:  'From:' + req.body.name + ' and Text : ' + req.body.feedback
			}, function(err, json) { 
					if (err) { 
						console.log("Error with Sending Email to somenath.ghosh84@gmail.com "); 
						console.error(err); 
					} 
					//console.log(json); 
			});
			
			
		}
	});

};


//Processing Reservation, Do Reservation in index.js
exports.doReservation = function(req, res){
	
	//Server side validation
    //Prevents Null & past dates when selecting a date
    var currentDate = new Date();
    //converting date 
    currentDate = currentDate.toISOString();
    
    //Server side validation
    if(req.body.to != null && req.body.from != null && currentDate < req.body.from && currentDate < req.body.to){ 
    
    //find one entry--checking the time range--checking if this query is already in the database
    User.findOne({to: {"$gt": req.body.from},from: {"$lt":req.body.to},id: parseInt(req.body.emp)},function(err,docs){
		
		if(err){
			console.log("Error from MongoDB-1:" + err);
			res.send({message:'Database Error'});
			
		}
        
		//Alert: Already have Machine booked around the same time
        if(docs){
			var msg = "You already have Machine# " + docs.mc + " booked around same time";
			res.send({message: msg});
			
			
		}
		else {
			
			User.findOne({to: {"$gt":req.body.from},from: {"$lt":req.body.to},mc: parseInt(req.body.mc)},function(err,user){
			if (err) {
				console.log("Error from MongoDB-2" + err);
				res.send({message:'Database Error'});
				
			}
			if(user) {
				
				//timeslot is not available
                var msg = "The selected slot is not available";
				res.send({message:msg});
				
			}
			else{

				new User({
							
							id   	: parseInt(req.body.emp),
							name 	: req.body.name,
							from 	: req.body.from,
							to   	: req.body.to,
							reason 	: req.body.reason,
							mc     	: parseInt(req.body.mc),
							resDate : new Date()
							
						}).save(function(err, doc){
							
							if(err) {
								console.log("Error from MongoDB-3:" + err);
								res.send({message:'Database Error'});
							}
								
							else {

								var empID = (req.body.emp).toString();
                                //Confirmation Email
                                htmlBody = "Dear "+ req.body.name+ ",\nYour reservation has been confirmed.\n\n M/C# " + req.body.mc + "\n " + "FROM : " + new Date(req.body.from) + "\n TO : " + new Date(req.body.to) +".";
								htmlBody = htmlBody + "\n\nThanks,\nTCS Charlotte Lab Team.\n\nP.S. This is a system-generated email. Please do not reply."; 
								CLTlab.findOne({employeeID : empID },function(err,docs){
									if(err) {
										console.log("Error from MongoDB: socket reservation CLTLab" + err);
										
									}
									
									if(docs) {
			
										if (docs.EmailID) {
											
											var args = {
											  data: {"EmailID": docs.EmailID, "EmailText": htmlBody},
											  headers:{"Content-Type": "application/json"} 
											};

											client.put("http://intense-ravine-4499.herokuapp.com/sendEmailforReservation/" + docs.EmailID, args, function(data,response) {
												  // parsed response body as js object
												console.log(data);
												// raw response
												console.log(response.statusCode);
											});
											
										}
									}

										
								});
								
								//Alert: reservation successful at Machine#: __
                                //Finding most recent reservation
                                var msg = "Your reservation is successful at Machine#: " + req.body.mc;
                                               
                                //Registration just made (was just sent to DB)-- fetching it from the database
                                User.findOne({id : parseInt(req.body.emp), 
                                            name 	: req.body.name,
                                            from 	: req.body.from,
                                            to   	: req.body.to,
                                            reason 	: req.body.reason,
                                            mc     	: parseInt(req.body.mc)}, function(err,user){
                                            
                                            if (err) {
                                            console.log("Error from MongoDB-2" + err);
                                            res.send({message:'Database Error'});
				
                                            }
                                            
                                            else{
                                      
          
                                                res.send({message: msg, newId: user});
                                                
                                            }
                                    });

							}
						});
					}
				});
			
			}

		});
        
       }
       
       //Server side validation
       else{
       res.send({message:'Invalid Date'});
       
       }
};


//Delete Reservation
exports.delReservation = function(req, res){
	
	if(req.session.empID){
		User.findOne({_id: req.body.id},function(err,doc){
			if(err) {
				console.log("Error from MongoDB:" + err);
				res.send({msg:'Database Error'});
			}
			
			if(doc) {
			
				//Server side validation-- prevents hackers from actually deleting past reservations
                currentDate = new Date();
                if(currentDate < doc.to){
                
                //Removes from database
                User.remove({_id:req.body.id, id: req.session.empID},function(err){
					if(err) {
						console.log("Error from MongoDB:" + err);
						res.send({msg:'Database Error'});
					}
					
					else {
						res.send({msg:''});
						
					}			
				});
              }
              
              //Server side validation
              else{
              res.send({msg:'Cannot Delete Old Dates'});
 
              }
			}
			
			if(!doc){
				res.send({msg:'NoUser'});
			}
		});
		
	}
	else{
		//console.log(req.session);
		res.send({msg:'NoUser'});
	}
};

//User Login
exports.loginReservation = function(req, res){
	
	//Server side validation
    if(req.body.emp != '' && req.body.pass !=''){
    
    //convert number to string
    var empID = (req.body.emp).toString();
	
	CLTlab.findOne({EmployeeID : empID, password: req.body.pass},function(err,doc){
		
        if(err) {
		
			console.log("Error from MongoDB:" + err);
			res.send({msg:'Database Error'});
		}
		
		if(doc){
			req.session.empID = req.body.emp;
			//console.log(doc.employeeID);

            //For My Reservations
            User.find({id: req.body.emp}).sort({from:1}).exec(function(err,docs2){
            //Getting everything from the User Table--for User Reports
            User.find({},function(err,docs3){
            
            if(err) {
                console.log("Error from MongoDB:" + err);
                res.send({msg:'Database Error'});
            }
            if(!docs2){
                res.send({msg:'No reservation found', user:docs3});
            }
            else {
                res.send({msg:'success', emp:empID, name:doc.FullName, R: docs2, user:docs3});
            }	
           })            
		 });
        }
		//Not in database
        if(!doc) {
			CLTAdmin.findOne({EmployeeID : empID, password: req.body.pass},function(err,doc){
				
				if(err) {
				
					console.log("Error from MongoDB:" + err);
					res.send({msg:'Database Error'});
				}
				
				if(doc){
					req.session.empID = req.body.emp;
					//console.log(doc.employeeID);

					//For My Reservations
					User.find({id: req.body.emp}).sort({from:1}).exec(function(err,docs2){
					//Getting everything from the User Table--for User Reports
					User.find({},function(err,docs3){
					
					if(err) {
						console.log("Error from MongoDB:" + err);
						res.send({msg:'Database Error'});
					}
					if(!docs2){
						res.send({msg:'No reservation found', user:docs3});
					}
					else {
						res.send({msg:'Admin', emp:empID, name:doc.FullName, R: docs2, user:docs3, admin:" <a class=\"clean\" id=\"useReports\" href=\"#reports\"><center><i class=\"glyphicon glyphicon-book\" ></i></center></a>" });
					}	
				   })            
				 });
				}
			});
			//res.send({msg:'Wrong'});
			
		}
            
    });
   }
   
   //Server side validation
   else{
    res.send({msg:'Wrong'});
   }
};

//New User Registers 
exports.signUp = function(req, res){
	
    //Server side validations 
    var empID = (req.body.employee).toString();
    var val = signValidation(empID, req.body.name, req.body.email, req.body.pass, req.body.cPass);
    
    //if no error message do:
    if(val == ''){
	
	CLTlab.findOne({EmployeeID : empID },function(err,doc){
		if(err) {
            console.log("Error from MongoDB:" + err);
			res.send({msg:'Database Error'});
		}
		
		if(doc){
			res.send({msg:'AE'});
		}
		if(!doc) {
			new CLTlab({
			
				EmployeeID : empID , 
				password : req.body.pass, 
				FullName: req.body.name, 
				EmailID : req.body.email
			
			}).save(function(err,doc){
				if(err){
					console.log('Database Insert Err' + err);
					res.send({msg:'Database Error'});
				}
				
				if(doc){
					res.send({msg:'sucess'});
				}			
			});
			
		}	
		
	});
    
   }
   
   //Server side validation (display error message)
   else{
    res.send({msg:val});
   }
};

//Sign Up Server Side Validations
function signValidation($empID, $name, $email, $pass, $cPass){

        var message = '';
        
        //Validations
        if($empID == '' || $empID != parseInt($empID)){
		
			message = 'Employee ID can not be blank and must be Numeric';
		}
		
		if($name =="" || $name == parseInt($name)){
			
			message = 'Name can not be blank or Numeric';
			
		}
		
		if($email == ''){
				
			message = 'Email can not be blank';
		}
		else{
			$emailAfterAt = $email.split('@');
			if(($emailAfterAt[1]).toLowerCase() != 'tcs.com') {
				
				message = 'Only TCS email';
				
			}
		}
		
		if($pass == '' || $cPass == ''){
			
			message = 'Password can not be blank';
		}
		
		if($pass != $cPass){
			message = 'Passwords do not match.';
		}

        return message;

};


//Available Reservation
exports.availableReseravtions = function(req, res){
	
    var data ={};
	var i = 0;

	//checks to see if time is available or not
    User.find({to: {"$gt":req.body.fDate},from: {"$lt":req.body.tDate},mc: parseInt(req.body.mc)}).sort({from:1}).exec(function(err,docs){
		if(err) {
		
			console.log("Error from MongoDB:" + err);
			res.send({msg:'Database Error'});
		}
		//Exist=Red Button
        if(docs){
			docs.forEach( function(doc){
			
				var diff = (doc.to - doc.from)/(3600*1000);
		
				for (var j=0;j<diff;j++){
					var fHour = (doc.from.getHours() + j) <10 ? '0' + (doc.from.getHours() + j) : (doc.from.getHours() + j);
					var fHour1 = (doc.from.getHours() + j + 1) < 10 ? '0' + (doc.from.getHours() + j + 1) : (doc.from.getHours() + j + 1); 
					data[fHour+':00-'+fHour1+':00'] = fHour+':00-'+fHour1+':00';
					i +=1;
				}
			});
			res.send({msg:data});
		}
		
		if(!docs){
			//Free=Green Button
            res.send({msg:'Free'});
		}
		
	});
   
   
};


//User Logout
exports.logoutReservation = function(req, res){
	
	//console.log('In Logout');
	req.session.destroy();
	res.send({msg:'LogOut'});

};

//Displays the Name of Softwares in Database 
exports.getSoftwareList = function(req, res){
	//console.log('into getSW');
	Inv.find(function(err,items){
		if(err) {

			console.log("Error from MongoDB:" + err);
			res.send({msg:'Database Error'});
		}
		if(items){
			//console.log(items);
			var arr = [];
			for(var i=0;i < items.length ; i++){
				arr.push(items[i].sw_name);
			}
			//console.log(arr);
			res.send({sw:arr});
		}
	});
};

//Finding Machine Numbers for Selected Software
exports.getMachineNum = function(req, res){

	Inv.findOne({sw:req.body.sw.toUpperCase()},{mc:1,_id:0},function(err,doc){
		if(err) {

			console.log("Error from MongoDB:" + err);
			res.send({msg:'Database Error'});
		}
		if(doc){
			res.send({msg:doc.mc});
		}

		if(!doc){
			res.send({msg:'NF'});

		}

	});

};
//Add Inventory to machines 
exports.addSoftware = function(req, res){

	Inv.findOne({sw:req.body.sw.toUpperCase()},function(err,doc){
		if(err) {

			console.log("Error from MongoDB:" + err);
			res.send({msg:'Database Error'});
		}
		if(doc){
			//console.log(doc.mc);
			var docArr = doc.mc;
			//console.log(docArr);

			var reqArr = req.body.mc;
			//console.log(reqArr + ' ' + reqArr.length);

			var arr = [];

			for(var i=0;i< reqArr.length ; i++){
				if(docArr.indexOf(reqArr[i]) == -1){
					arr.push(reqArr[i]);
				}

			}


			if(arr.length ==0){
				res.send({msg:'AA'});
			}
			else{
				for (var i=0 ; i <docArr.length ; i++){
					arr.push(docArr[i]);
				}
				//console.log('Update' + arr);
				//res.send({msg:'Update'});
				doc.mc=arr.sort();
				doc.save(function(err,doc){

					if(err){
						console.log('Database Insert Err' + err);
						res.send({msg:'Database Error'});
					}

					if(doc){
						//console.log(doc);
						res.send({msg:'success'});
					}			
				});
				
				InvUpdate.update({_id: doc._id},{$set :{mc:arr}},function(err,doc){
				
					if(err){
						console.log('Database Insert Err' + err);
						res.send({msg:'Database Error'});
					}
					
					if(doc){
						console.log(doc);
						res.send({msg:'success'});
					}			
				});
				
			}	

		}
		if(!doc){
			new Inv({

				sw : req.body.sw.toUpperCase(),
				sw_name : req.body.sw,
				mc : req.body.mc


			}).save(function(err,doc){
				if(err){
					console.log('Database Insert Err' + err);
					res.send({msg:'Database Error'});
				}

				if(doc){
					res.send({msg:'success'});
				}			
			});


		}

	});

};