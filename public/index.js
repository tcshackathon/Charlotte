jQuery(function($){
			
	$( "#datepicker" ).datepicker();
	$( "#datepicker2" ).datepicker();
	//alert('Hello');
	var $sessionData = {};
	var $mc = '';
	var dataR = {};
	var timeRange = '00:00-00:00';
	var arrayOfBlockedTime  = {};
	var $nDate = new Date();
	var htmlString = '';
	var OS = '';
	
	$('#sendLogin').click(function(e){
		e.preventDefault();
		
		
		if($('#Login-empID').val() ==""){
			Alert('Please enter Employee ID');
			return false;
		}
		
		if($('#Login-Password').val() == ""){
			Alert('Please enter Password');
			return false;
		}
		var btn = $(this);
		btn.button('loading');
		var data = {};
		data.emp = $('#Login-empID').val();
		data.pass = $('#Login-Password').val();
		
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/LoginReservation',						
			success: function(data) {
				
				if(data.msg=='Wrong'){
					Alert('Wrong UserID or Password');
					btn.button('reset');
				}
				else if(data.msg= 'success'){
				
					btn.button('reset');
					$sessionData.emp= data.emp;
					$sessionData.name = data.name;
					$(".ulClass li:nth-child(2)").addClass("hidden");
					$(".ulClass li:nth-child(3)").removeClass("hidden");
					$(".ulClass li:nth-child(4)").removeClass("hidden");
					$(".ulClass li:nth-child(6)").removeClass("hidden");
					$(".ulClass li:nth-child(8)").removeClass("hidden");
					$(".ulClass li:nth-child(5)").removeClass("hidden");
					$(".ulClass li:nth-child(7)").removeClass("hidden");
					$(".ulClass li:nth-child(7)").html('<a href="#"><center><i class="glyphicon glyphicon-user"></i>'+' 	Welcome ' + $sessionData.name.split(' ')[0]+'</center></a>')
					$("#loginform").addClass("hidden");
					$("#workStationList").removeClass("hidden").addClass("intro");
				}
				
				
			},
			error: function (error) {
				btn.button('reset');
				Alert('error');
			}
			
		});	
	
	});
	
	
	
	
	$('.sign-in').click(function(e){
		$('#signUP').removeClass("visible").addClass('hidden');
		$('#signIN').removeClass("hidden").addClass('visible');
	});
	
	
	
	
	
	$('.new-account').click(function(e){
		
		$('#signIN').removeClass("visible").addClass('hidden');
		$('#signUP').removeClass("hidden").addClass('visible');
	});






	$('#sendSignUP').click(function(e){
		e.preventDefault();
		var $empID = $('#Login-empID-signUP').val();
		var $name  = $('#Login-name-SignUP').val();
		var $email = $('#Login-email-SignUP').val();
		var $pass  = $('#Login-Password-SignUP').val();
		var $cPass = $('#Login-ConfirmPassword-SignUP').val();
		
		if($empID == '' || $empID != parseInt($empID)){
		
			Alert('Employee ID can not be blank' );
			return false;
		}
		
		if($name =="" || $name == parseInt($name)){
			
			Alert('Name can not be blank or Numeric');
			return false;
		}
		
		if($email == ''){
				
			Alert('Email can not be blank');
			return false;
		}
		else{
			$emailAfterAt = $email.split('@');
			//alert($emailAfterAt[1]);
			if(($emailAfterAt[1]).toLowerCase() != 'tcs.com') {
				
				Alert('Only TCS email');
				return false;
			}
		}
		
		if($pass == '' || $cPass == ''){
			
			Alert('Password can not be blank');
			return false;
		}
		
		if($pass != $cPass){
			Alert('Passwords do not match.');
			return false;
		}
		
		var btn = $(this);
		btn.button('loading');
		var data = {};
		
		data.employee = $empID;
		data.name = $name;
		data.email = $email;
		data.pass = $pass;
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/SignUpReservation',						
			success: function(data) {
				if(data.msg == 'AE'){
					
					Alert('Already Exisit');
					btn.button('reset');
				}
				else{
					
					//Alert('Success');
					btn.button('reset');
					$('#signUP').removeClass("visible").addClass('hidden');
					$('#signIN').removeClass("hidden").addClass('visible');
				}
				
				
			},
			error: function (error) {
				
				btn.button('reset');
				Alert('error connecting Server');
			}
			
		});	
	
	});


	$(".ulClass li:nth-child(8)").click(function(e){
		e.preventDefault();
		$sessionData = {};
		$mc = '';
		dataR = {};
		timeRange = '00:00-00:00';
		arrayOfBlockedTime  = {};
		$nDate = new Date();
		$(".ulClass li:nth-child(6)").html('');
		$.ajax({
			type: 'POST',
			data: JSON.stringify(dataR),
			contentType: 'application/json',
			url: '/LogoutReservation',						
			success: function(data) {
				
				//console.log('Successful Logout');
				window.location.href ='/';
				
			},
			error: function (error) {
				Alert('error connecting Server');
			}
			
		});	
		
		
	});
	
	$(".ulClass li:nth-child(5)").click(function(e){
		if($("#inventoryControl").hasClass("hidden")){
			//$("#inventoryControl").removeClass("hidden").addClass("visible");
		}
		else{
			//$("#inventoryControl").removeClass("visible").addClass("hidden");
		}
	});
	
	$(".ulClass li:nth-child(4)").click(function(e){
		
		if($("#about").hasClass("hidden")){
			$("#about").removeClass("hidden").addClass("visible");
		}
		else{
			$("#about").removeClass("visible").addClass("hidden");
		}
	});
	
	
	
	$('.WButton').click(function(e){
		$('#timeslot').removeClass('hidden').addClass('visible'); 
		$mc = this.value;
		$('#machineNumber').html('');
		$('#AvailablityTable').html('');
		//alert($mc);
	
	
	});

	$('#SubmitForTimeslot').click(function(e){
		e.preventDefault();
		
		if(!$('#submitbutton123').hasClass('hidden')){
			$('#submitbutton123').addClass('hidden')		
		}
		
		$date = $('#datepicker2').val();
		$('#machineNumber').html('');
		$dateToday = new Date();
		$nDate = new Date($date);
		$fdate = new Date($nDate.getFullYear(),$nDate.getMonth(),$nDate.getDate(),00,00,00,00);
		$tdate = new Date($nDate.getFullYear(),$nDate.getMonth(),$nDate.getDate(),23,59,59,00);
		
		if($date == '' || isFinite($date) || ($dateToday >= $tdate)){
			$('#AvailablityTable').html('');
			$('#submitbuttonReset').removeClass('visible').addClass('hidden');
			document.getElementById('errorCalendar').innerHTML='Please Select A Valid Date';
			//alert('Please select a correct date');
			
			return false;
		}
		$('#machineNumber').html('<font color ="black" size="4"> </br>Available Times For Workstation '+$mc+'</font>' );
		document.getElementById('errorCalendar').innerHTML='';
		
		//alert($fdate + ' ' + $tdate);
		
		
		dataR.fDate = $fdate;
		dataR.tDate = $tdate;
		dataR.mc = $mc;
		var btn = $(this);
		
		
		btn.button('loading');
		$('#AvailablityTable').html('<img src="http://www.travislayne.com/images/loading.gif" class="icon" />');
		$.ajax({
			type: 'POST',
			data: JSON.stringify(dataR),
			contentType: 'application/json',
			url: '/availReservation',						
			success: function(data) {
				arrayOfBlockedTime = data.msg;
				$('#AvailablityTable').html('<img src="http://www.travislayne.com/images/loading.gif" class="icon" />');
				btn.button('reset');
				htmlString = '';
				htmlString = '<div  class="table-responsive" style="height:300px;overflow-y:scroll;overflow-x:scroll;">';
				htmlString = htmlString + '<table class="table table-hover" width="100%">';
				//console.log(array['08:00-09:01']);
				//console.log(arrayOfBlockedTime);
				
				htmlString = htmlString+ '<tr>';
				var btnClass = '';
				var dateNow = new Date();
				var nowFromMin = dateNow.getMinutes() < 10 ? '0'+ dateNow.getMinutes() : dateNow.getMinutes();
				var nowFromHour = dateNow.getHours() < 10 ? '0'+ dateNow.getHours() : dateNow.getHours();
				var dateNowTimeString = nowFromHour +':'+nowFromMin;
				var todayMonth = dateNow.getMonth() < 10 ? '0'+ (dateNow.getMonth()+1) : (dateNow.getMonth()+1) ;
					todayDate = dateNow.getDate() < 10 ? '0'+ dateNow.getDate() : dateNow.getDate();
					todayYear= dateNow.getFullYear() < 10 ? '0'+ dateNow.getFullYear() : dateNow.getFullYear() ;
				
					todayDate = todayMonth +'/'+todayDate+'/'+todayYear;
				
				//alert(todayDate);
				for(var i=0;i<=23;i++){
					
					if(i%3 == 0 && i !=0 ) {
						htmlString = htmlString + '</tr>';
						htmlString = htmlString + '<tr>';
					}
					
					var f = i < 10 ? '0'+ i.toString() : i.toString();
					var t = (i+1) < 10 ? '0'+ (i+1).toString() : (i+1).toString();
					var timeString = f +':00-'+t+':00';
					
					if(timeString.split('-')[0] < dateNowTimeString && $date == todayDate ){
						
						arrayOfBlockedTime[timeString] = timeString;
						
					}
					
					if(arrayOfBlockedTime[timeString] != undefined){
					
						btnClass = 'btn-danger';
					}
					else {
					
						
						btnClass = 'btn-success clickable';
					}
					htmlString = htmlString + '<td><button type="button" id="'+timeString+'" value="'+timeString+'" class="btn '
											+ btnClass+' btn-md">'+timeString+'</button></td>';
					
					
			
					
				
				}
				htmlString = htmlString + '</tr></table>';
				$('#AvailablityTable').html('');
				//console.log(htmlString);
				$('#AvailablityTable').html(htmlString);
				$('#submitbutton123').removeClass('hidden').addClass('visible');
				$('#submitbuttonReset').removeClass('hidden').addClass('visible');
				
				
			},
			error: function (error) {
				btn.button('reset');
				Alert('error connecting to Server');
			}
			
		});	
		
		
		
	});

	$(document).on('click', '.clickable', function(e){
		if(!$(this).hasClass("btn-warning")){
			$(this).removeClass('btn-success clickable').addClass('btn-warning');
			
			
			//alert('TimeRange = ' + timeRange);
			if(timeRange =='00:00-00:00'){
				timeRange = this.value;
			}
			else{
				//var timeRangeArray = timeRange.split('-');
				var tempTimeRange = timeRange;
				if(timeRange.split('-')[0] > (this.value).split('-')[0]) 
				{
					
					timeRange = (this.value).split('-')[0] +'-'+timeRange.split('-')[1];
					
					var upperRange = (parseInt(timeRange.split('-')[1].split(':')[0]) - 1).toString() +':'+ timeRange.split('-')[1].split(':')[1];
					
					tempFrom = (parseInt(timeRange.split('-')[0].split(':')[0]) + 1).toString() +':'+timeRange.split('-')[0].split(':')[1];
					tempTo = (parseInt(timeRange.split('-')[0].split(':')[0]) + 2).toString() +':'+timeRange.split('-')[0].split(':')[1];
					
					if(tempFrom.length < 5)
					{
						tempFrom = '0'+tempFrom;
					}
					if(tempTo.length<5)
					{
						tempTo = '0'+tempTo;
					}
					
					tempTime = tempFrom+'-'+tempTo;
					
					while(upperRange > tempTime.split('-')[0])
					{
					
						var temp = document.getElementById(tempTime);
						temp.setAttribute('class','btn btn-warning btn-md');
						
						tempFrom = (parseInt(tempTime.split('-')[0].split(':')[0]) + 1).toString() +':'+tempTime.split('-')[0].split(':')[1];
						tempTo = (parseInt(tempTime.split('-')[0].split(':')[0]) + 2).toString() +':'+tempTime.split('-')[0].split(':')[1];
					
						if(tempFrom.length < 5)
						{
							tempFrom = '0'+tempFrom;
						}
						if(tempTo.length<5)
						{
							tempTo = '0'+tempTo;
						}
					
						tempTime = tempFrom+'-'+tempTo;
					
					}
					
				}
				else if (timeRange.split('-')[0] < (this.value).split('-')[0])
				{
					timeRange = timeRange.split('-')[0] +'-'+(this.value).split('-')[1];
					
					var upperRange = (parseInt(timeRange.split('-')[1].split(':')[0]) - 1).toString() +':'+ timeRange.split('-')[1].split(':')[1];
					
					tempFrom = (parseInt(timeRange.split('-')[0].split(':')[0]) + 1).toString() +':'+timeRange.split('-')[0].split(':')[1];
					tempTo = (parseInt(timeRange.split('-')[0].split(':')[0]) + 2).toString() +':'+timeRange.split('-')[0].split(':')[1];
					
					if(tempFrom.length < 5)
					{
						tempFrom = '0'+tempFrom;
					}
					if(tempTo.length<5)
					{
						tempTo = '0'+tempTo;
					}
					
					tempTime = tempFrom+'-'+tempTo;
					
					while(upperRange > tempTime.split('-')[0])
					{
						var temp = document.getElementById(tempTime);
						temp.setAttribute('class','btn btn-warning btn-md');
						
						tempFrom = (parseInt(tempTime.split('-')[0].split(':')[0]) + 1).toString() +':'+tempTime.split('-')[0].split(':')[1];
						tempTo = (parseInt(tempTime.split('-')[0].split(':')[0]) + 2).toString() +':'+tempTime.split('-')[0].split(':')[1];
					
						if(tempFrom.length < 5)
						{
							tempFrom = '0'+tempFrom;
						}
						if(tempTo.length < 5)
						{
							tempTo = '0'+tempTo;
						}
					
						tempTime = tempFrom+'-'+tempTo;
					}
				}
				else 
				{
							
						Alert('Already Selected');
				}
					
				if(checkTime(timeRange)){
					
					Alert('Can not book: ' + timeRange);
					timeRange = tempTimeRange;
					$(this).removeClass('btn-warning').addClass('btn-success clickable');
					
					
				}
				
				
			}
			
			document.getElementById('timeSpan').innerHTML=timeRange;
			//alert(timeRange);
		}
		else{
			
			Alert('Already Selected');
		}
		
	});

	
	var checkTime = function($value){
		
		var $fValue = $value.split('-')[0].split(':')[0];
		var $tValue = $value.split('-')[1].split(':')[0];
		
		//alert($fValue  +  ' ' + $tValue);
		var flag = false;
		while (!flag && $fValue != $tValue){
			var sString = $fValue + ':00-' ;
			var end		= parseInt($fValue) + 1;
			var eString = end < 10 ? '0'+ end.toString() : end.toString();
			var tString = sString + eString + ':00'; 
			//alert(tString);
			if(arrayOfBlockedTime[tString] != undefined){
				flag = true;
			}
			else {
				
			}
			$fValue = eString;
			
		}
		//alert(flag);
		return flag;
		
		
		
	};
	$(document).on('click', '#submitbutton123', function(e){
	
		//alert('submitbutton123');
		if(timeRange == '00:00-00:00'){
			document.getElementById('errorCalendar').innerHTML='Please Select A Valid Time';
			return false;
		}
		$sessionData.mc = $mc;
		$sessionData.from = new Date($nDate.getFullYear(),$nDate.getMonth(),$nDate.getDate(),timeRange.split('-')[0].split(':')[0],timeRange.split('-')[0].split(':')[1],00,00);
		$sessionData.to = new Date($nDate.getFullYear(),$nDate.getMonth(),$nDate.getDate(),timeRange.split('-')[1].split(':')[0],timeRange.split('-')[1].split(':')[1],00,00);
		
		//console.log($sessionData);
		document.getElementById('errorCalendar').innerHTML='';

		
		$('#download').removeClass('hidden').addClass('visible');
	});
	
	
	$(document).on('click', '#submitbuttonReset', function(e){
		timeRange = '00:00-00:00';
		document.getElementById('timeSpan').innerHTML="";
		delete $sessionData.from;
		delete $sessionData.to;
		bldTable();
		
		
		
		//console.log($sessionData);
		$('#submitbutton123').removeClass('visible').addClass('hidden');
	});
	
	
	
	
	$('#reservebutton').click(function(e){
		e.preventDefault();
		if($('#reserveComment').val() == ''){
			
			Alert('Please enter comment');
			return false;
		}
		else {
			var btn = $(this);
			btn.button('loading');
			$sessionData.reason = $('#reserveComment').val();
			$.ajax({
				type: 'POST',
				data: JSON.stringify($sessionData),
				contentType: 'application/json',
				url: '/doReservation',						
				success: function(data) {
					btn.button('reset');
					document.getElementById('alertSpan').innerHTML=data.message;
					$('#alertModal').modal('show');
					//alert(data.message);
					timeRange = '00:00-00:00';
					htmlString = '';
					arrayOfBlockedTime = {};
					delete $sessionData.mc ;
					delete $sessionData.from ;
					delete $sessionData.to ;
					delete $sessionData.reason ;
					//$('#AvailablityTable').html('<img src="http://www.travislayne.com/images/loading.gif" class="icon" />');
					//bldTable();
					$('#download').removeClass('visible').addClass('hidden');
					$('#timeslot').removeClass('visible').addClass('hidden'); 
					$('#submitbutton123').removeClass('visible').addClass('hidden');
					$('#submitbuttonReset').removeClass('visible').addClass('hidden');
					$('#AvailablityTable').html('');
					$('#datepicker2').val('');
					$('#reserveComment').val('');
					$('#machineNumber').html('');
					//$( ".ulClass li:nth-child(2)" ).trigger( "click" );
					//$( "#workStationList" ).trigger( "click" );
								
				},
				error: function (error) {
					btn.button('reset');
					
					Alert('error connecting Server');
				}
				
			});	
							
					
					
		}
		
	});


	var bldTable = function(){
		$date = $('#datepicker2').val();
		$.ajax({
			type: 'POST',
			data: JSON.stringify(dataR),
			contentType: 'application/json',
			url: '/availReservation',						
			success: function(data) {
				arrayOfBlockedTime = data.msg;
				$('#AvailablityTable').html('<img src="http://www.travislayne.com/images/loading.gif" class="icon" />');
				//btn.button('reset');
				htmlString = '';
				htmlString = '<div  class="table-responsive" style="height:300px;overflow-y:scroll;overflow-x:scroll;">';
				htmlString = htmlString + '<table class="table table-hover" width="100%">';
				//console.log(array['08:00-09:01']);
				//console.log(arrayOfBlockedTime);
				
				htmlString = htmlString+ '<tr>';
				var btnClass = '';
				var dateNow = new Date();
				var nowFromMin = dateNow.getMinutes() < 10 ? '0'+ dateNow.getMinutes() : dateNow.getMinutes();
				var nowFromHour = dateNow.getHours() < 10 ? '0'+ dateNow.getHours() : dateNow.getHours();
				var dateNowTimeString = nowFromHour +':'+nowFromMin;
				var todayMonth = dateNow.getMonth() < 10 ? '0'+ (dateNow.getMonth()+1) : (dateNow.getMonth()+1) ;
					todayDate = dateNow.getDate() < 10 ? '0'+ dateNow.getDate() : dateNow.getDate();
					todayYear= dateNow.getFullYear() < 10 ? '0'+ dateNow.getFullYear() : dateNow.getFullYear() ;
				
					todayDate = todayMonth +'/'+todayDate+'/'+todayYear;
				
				//alert(todayDate);
				for(var i=0;i<=23;i++){
					
					if(i%3 == 0 && i !=0 ) {
						htmlString = htmlString + '</tr>';
						htmlString = htmlString + '<tr>';
					}
					
					var f = i < 10 ? '0'+ i.toString() : i.toString();
					var t = (i+1) < 10 ? '0'+ (i+1).toString() : (i+1).toString();
					var timeString = f +':00-'+t+':00';
					
					if(timeString.split('-')[0] < dateNowTimeString && $date == todayDate ){
						
						arrayOfBlockedTime[timeString] = timeString;
						
					}
					
					if(arrayOfBlockedTime[timeString] != undefined){
					
						btnClass = 'btn-danger';
					}
					else {
					
						
						btnClass = 'btn-success clickable';
					}
					htmlString = htmlString + '<td><button type="button" id="'+timeString+'" value="'+timeString+'" class="btn '
											+ btnClass+' btn-md">'+timeString+'</button></td>';
					
					
			
					
				
				}
				htmlString = htmlString + '</tr></table>';
				$('#AvailablityTable').html('');
				//console.log(htmlString);
				$('#AvailablityTable').html(htmlString);
				$('#submitbutton123').removeClass('hidden').addClass('visible');
				$('#submitbuttonReset').removeClass('hidden').addClass('visible');
				
				
			},
			error: function (error) {
				//btn.button('reset');
				Alert('error connecting to Server');
			}
			
		});	
	
	
	
	};
	
	
	$('.ulClass li:nth-child(3)').click(function(e){
		//e.preventDefault();
		if($('#reservation').hasClass('hidden')){
			$('#reservation').removeClass('hidden').addClass('visible');
		}
		else{
			$('#reservation').removeClass('visible').addClass('hidden');
			return false;
		}
		var data = {};
		data.emp = $sessionData.emp;
		
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/getReservation',						
			success: function(data) {
				if(data.msg.length > 0){
					
					
				}
				else{
					
					showModal(data);
					
					
				}
			},
			error: function (error) {
				
				Alert('Error connecting to server');
				
			}
			
		});	
	
	});
	
	
	 $('#myNav').click('li', function() {
          $('#myNav').collapse('hide');
        });
    $("#aAbout").hover(
          function() {
            $( this ).append( $( "<center><span> about</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
        $("#logout").hover(
          function() {
            $( this ).append( $( "<center><span> logout</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
        $("#aReservation").hover(
          function() {
            $( this ).append( $( "<center><span> Reservation</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
        $("#aInventoryControl").hover(
          function() {
            $( this ).append( $( "<center><span> Inventory</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
        $("#feedback").hover(
          function() {
            $( this ).append( $( "<center><span> feedback</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
	
	
	var showModal =function($data){
	
		var month=new Array();
		month[0]="Jan";
		month[1]="Feb";
		month[2]="Mar";
		month[3]="Apr";
		month[4]="May";
		month[5]="Jun";
		month[6]="Jul";
		month[7]="Aug";
		month[8]="Sep";
		month[9]="Oct";
		month[10]="Nov";
		month[11]="Dec";
	
		$("#myReservation").html("");
		
		var htmlString= "<center><div class="+'table-responsive'+"><table id='mytable' class="+'table table-hover'+"><tr><th>WorkStation</th><th>From Date & Time</th><th>To Date & Time</th><th>Action</th></tr></center>";
		
		
		
		$data.R.forEach( function(doc){
			
			
			
			fromDate = new Date(doc.from);
			toDate = new Date(doc.to);
			
			fromMonth = month[fromDate.getMonth()];
			fromYear = fromDate.getFullYear();
			
			toMonth = month[toDate.getMonth()];
			toYear = toDate.getFullYear();
			
			fromMin = fromDate.getMinutes() < 10 ? '0'+fromDate.getMinutes() : fromDate.getMinutes();
			toMin = toDate.getMinutes() < 10 ? '0'+ toDate.getMinutes() : toDate.getMinutes();
			fromDay = fromDate.getDate() < 10 ? '0'+fromDate.getDate() :fromDate.getDate();
			toDay  =  toDate.getDate() < 10 ? '0'+toDate.getDate() : toDate.getDate() ;
			fromHour = fromDate.getHours() < 10 ? '0'+fromDate.getHours() : fromDate.getHours();
			toHour = toDate.getHours() < 10 ? '0'+toDate.getHours() : toDate.getHours() ;
		
		
			htmlString = htmlString + '<tr id=tr'+doc._id+'><td>'+doc.mc+'</td><td>'+fromDay 
				+ "-"+fromMonth+'-'+ fromYear+'  '+ fromHour + ":"
				+ fromMin+'</td><td>'+toDay + "-"+ toMonth + "-"+ toYear+ '  '+  toHour + ":" 
				+ toMin+'</td><td><button class="btn btn-danger btn-sm btnDelete" data-loading-text="Wait..."'
				+  'id='+doc._id+'>Cancel</button></td></tr>';
			
			
			
			
		});
		htmlString = htmlString + '</div></table>' ;
		
		//console.log(htmlString);
		
		$("#myReservation").html(htmlString);
		
		
		
	};
	
	
	$(document).on('click', '.btnDelete', function(e){ 
		e.preventDefault();
		var btn = $(this);
		btn.button('loading');
		var $id = this.id;
		var data = {};
		data.id= $id;
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/DelReservation',						
			success: function(data) {

				
				btn.button('reset');
				btn.html('Done');
				$('#tr'+$id).hide();
			
				
			},
			error: function (error) {
				
				Alert('Error connecting to server');
				btn.button('reset');
			}
			
		});	
	});
	
	
	$('#sendFeedback').click(function(e){
		e.preventDefault();
		
		if ( $('#contact-feedback').val()=="" ){
			
			alertM("Feedback can not be empty");
			return false;
		}

		else {

			var btn = $(this);
			btn.button('loading');
			
			var data = {};
			data.name = $sessionData.name;
			data.id = $sessionData.emp;
			data.feedback = $('#contact-feedback').val();
			
			$.ajax({
				type: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json',
				url: '/feedback',						
				success: function(data) {
					//console.log('success');
					//console.log(JSON.stringify(data.msg));
					btn.button('reset');
					$('#feedForm').hide();
					$('#thank').show();
					$('#sendFeedback').hide();
					$("#thank").html("<font color='black'><strong></strong></font>");
					$("#thank").append('<br><center><font color="black">' + data.msg + "</font></center><br/>"); 
				},
				error: function (xhr, status, error) {
					$('#feedForm').hide();
					btn.button('reset');
					$('#thank').show();
					$('#sendFeedback').hide();
					$("#thank").html("<font color='black'><strong></strong></font>");
					$("#thank").append('<br><center><font color="black">' + 'Error connecting to the server' + "</font></center><br/>"); 
				}
				
			});
		
		}
	
	});
	
	
	$("#btnClose").click(function(e){
		$('#contact-feedback').val('');
		$('#feedForm').show();
		$('#sendFeedback').show();
		$('#thank').hide();
		
	});
	
	
	var availableTags = [];
	
	var PossibleSoftwares = ['TCS Mastercraft','Eclipse','JBOSS Webserver','Tomcat Webserver','Jetty Webserver','PHP','Python','Java jdk','Ruby',
	
		'COBOL','MongoDB','Heroku Toolbelt','NodeJS','Git Bash','Git Shell for Windows','MySQL','Oracle','Datastage','Informatica','C','C++','Microsoft Visual Studio',
		'MS Visual Studio','MS Office','Robomongo','Google Chrome','Oracle VM','Virtual Machine','Mozilla Firefox','Android Dev Kit','iOS Dev Kit','X-code','Objective-C',
		'Notepad++','Opera Browser','IE','Anti-Virus','McAfee','Norton','Windows','Mircosoft'
	];
	
	$( "#Software" ).autocomplete({
				source: PossibleSoftwares
	});
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(dataR),
		contentType: 'application/json',
		url: '/getSoftwareList',						
		success: function(data) {
			availableTags = data.sw;
			console.log(availableTags);
			$( "#searchAutoComplete" ).autocomplete({
				source: availableTags
			});
			
			
			
		},
		error: function (xhr, status, error) {
			Alert('Error connecting to Server');
		}
			
	});
	
	$('#serachSubmit').click(function(e){
		e.preventDefault();
		//console.log(availableTags.indexOf($('#searchAutoComplete').val()));
		if(availableTags.indexOf($('#searchAutoComplete').val()) == -1){
			document.getElementById('invAlertSpan').style.color="red";
			document.getElementById('invAlertSpan').innerHTML='select software';
			return false;
		}
		var data ={}
		data.sw = $('#searchAutoComplete').val();
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/getMachineNumbers',						
			success: function(data) {
				if(data.msg=='NF'){
					document.getElementById('invAlertSpan').style.color="red";
					document.getElementById('invAlertSpan').innerHTML='This software is not found';
				}
				else{
					document.getElementById('invAlertSpan').style.color="green";
					document.getElementById('invAlertSpan').innerHTML='That software is available at these machines:  '+ data.msg;
					
				}
				
			},
			error: function (xhr, status, error) {
				document.getElementById('invAlertSpan').style.color="red";
				document.getElementById('invAlertSpan').innerHTML='Error connecting to Server';
			}
			
		});
		
	});
	
	
	
	
	
	
	
	
	
	
	$('#siriachaSubmit').click(function(e){
		e.preventDefault();		
		if($('#Software').val() == ''){
			document.getElementById('alertSpan').innerHTML='Please select/add software';
			
		}else{
			var allVals = $('.ws:checked').map(function() {return this.value;}).get().join(',');
			//console.log(allVals);
			
			var data ={}
			data.sw = $('#Software').val();
			data.mc = allVals;
			$.ajax({
				type: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json',
				url: '/addSoftware',						
				success: function(data) {
					//console.log(data.msg);
					availableTags.push($('#Software').val());
					document.getElementById('alertSpan').innerHTML='Succesfully Added Software';
					
				},
				error: function (xhr, status, error) {
					document.getElementById('alertSpan').innerHTML='Error connecting to Server';
				}

			
			});
		}
		
		
		
	});		
	
	var Alert = function($value){
		
		document.getElementById('alertSpan').innerHTML=$value;
		$('#alertModal').modal('show');
		
	};
	
		
	
			
			
			
		
});