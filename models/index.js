exports.feedback = function(req, res){
	var obj = {};
	//console.log('body: ' + JSON.stringify(req.body));
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
					console.log(json); 
			});	
		}
	});
}