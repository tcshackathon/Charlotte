jQuery(function($){

//encapsulation function
(function(){
			
	$( "#datepicker" ).datepicker();
	$( "#datepicker2" ).datepicker();


	var $sessionData = {};
	var $mc = '';
	var dataR = {};
	var timeRange = '00:00-00:00';
	var arrayOfBlockedTime  = {};
	var $nDate = new Date();
	var htmlString = '';
	var OS = '';
    var report = {};
    
    //Reservation Data Storage Object
    var resData = {};
	
    
    //Existing User Login, Login Authentication 
	$('#sendLogin').click(function(e){
		//prevents page refresh 
        e.preventDefault();

		//Client Side Validation: Enter Emp ID
        if($('#Login-empID').val() ==""){
			Alert('Please enter Employee ID');
			return false;
		}
		
		//Client Side Validation: Enter Password
        if($('#Login-Password').val() == ""){
			Alert('Please enter Password');
			return false;
		}
        
		var btn = $(this);
		btn.button('loading');
		var data = {};
		data.emp = $('#Login-empID').val();
		data.pass = $('#Login-Password').val();
		
		//Less call to database with only one AJAX call 
        $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/LoginReservation',						
			success: function(data) {
				
				if(data.msg=='Wrong'){
					//Modal Alert: Wrong ID or Password
                    Alert('Wrong UserID or Password');
					btn.button('reset');
				}
				else if(data.msg== 'success'){
				
					btn.button('reset');
					$sessionData.emp= data.emp;
					$sessionData.name = data.name;
                    //hidden
					$(".ulClass li:nth-child(2)").addClass("hidden");
                    //visible
					$(".ulClass li:nth-child(3)").removeClass("hidden");
					$(".ulClass li:nth-child(4)").removeClass("hidden");
					$(".ulClass li:nth-child(6)").removeClass("hidden");
					$(".ulClass li:nth-child(8)").removeClass("hidden");
					$(".ulClass li:nth-child(5)").removeClass("hidden");
					$(".ulClass li:nth-child(7)").removeClass("hidden");
                   // $(".ulClass li:nth-child(9)").removeClass("hidden");
                    //Displays Name of Employee in Nav bar
					$(".ulClass li:nth-child(7)").html('<a href="#"><center><i class="glyphicon glyphicon-user"></i>'+' 	Welcome ' + $sessionData.name.split(' ')[0]+'</center></a>')
					//hid login form after logged in successfully  
                    $("#loginform").addClass("hidden");
                    //goes from hidden to intro style defined in index.ejs
					$("#workStationList").removeClass("hidden").addClass("intro");
				}
				else if(data.msg== 'Admin'){
				
					btn.button('reset');
					$sessionData.emp= data.emp;
					$sessionData.name = data.name;
                    //hidden
					document.getElementById("adminGlyphicon").innerHTML = data.admin;
					//User Reports
					$("#useReports").hover(
						function() {
						$( this ).append( $( "<center><span>Reports</span></center>" ) );
						  }, function() {
							$( this ).find( "span:last" ).remove();
						}
					);		

					$(".ulClass li:nth-child(2)").addClass("hidden");
                    //visible
					$(".ulClass li:nth-child(3)").removeClass("hidden");
					$(".ulClass li:nth-child(4)").removeClass("hidden");
					$(".ulClass li:nth-child(6)").removeClass("hidden");
					$(".ulClass li:nth-child(8)").removeClass("hidden");
					$(".ulClass li:nth-child(5)").removeClass("hidden");
					$(".ulClass li:nth-child(7)").removeClass("hidden");
                    //$(".ulClass li:nth-child(9)").removeClass("hidden");
                    //Displays Name of Employee in Nav bar
					$(".ulClass li:nth-child(7)").html('<a href="#"><center><i class="glyphicon glyphicon-user"></i>'+' 	Welcome ' + $sessionData.name.split(' ')[0]+'</center></a>')
					//hid login form after logged in successfully  
                    $("#loginform").addClass("hidden");
                    //goes from hidden to intro style defined in index.ejs
					$("#workStationList").removeClass("hidden").addClass("intro");
								
				}

                    //Success Login (Reservation Data)
                    //getting past reserved reservation(s) from database after user logs in 
                        resData=data;
                        report=data;
			},
			error: function (error) {
				btn.button('reset');
				Alert('error');
			}
			
		});	
        
   //Show Reservation (makes it visible)-- <div id="reservation">
    $('.ulClass li:nth-child(3)').click(function(e){
		if($('#reservation').hasClass('hidden')){
			$('#reservation').removeClass('hidden').addClass('visible');
		}
		else{
			$('#reservation').removeClass('visible').addClass('hidden');
			return false;
		}
        
       if(resData.msg != 'success'){
					

		}
		//Show Reservation Data from Database
        else{
					
            //Show reservation table
            showModal(resData);
		
		}
		
	});
    
    
    
	
});

    
    //
	$('.clean').click(function(e){
		timeRange = '00:00-00:00';
		document.getElementById('timeSpan').innerHTML="";
		delete $sessionData.from;
		delete $sessionData.to;
		$('#timeslot').removeClass('visible').addClass('hidden');
		$('#inventoryControl').removeClass('visible').addClass('hidden');
		$('#download').removeClass('visible').addClass('hidden');
		$('#reservation').removeClass('visible').addClass('hidden');
	});
	
	
	$('.sign-in').click(function(e){
		$('#signUP').removeClass("visible").addClass('hidden');
		$('#signIN').removeClass("hidden").addClass('visible');
	});
	
	$('.new-account').click(function(e){
		
		$('#signIN').removeClass("visible").addClass('hidden');
		$('#signUP').removeClass("hidden").addClass('visible');
	});


	//Registration Form: Sign Up Button
    $('#sendSignUP').click(function(e){
		e.preventDefault();
		
        var $empID = $('#Login-empID-signUP').val();
		var $name  = $('#Login-name-SignUP').val();
		var $email = $('#Login-email-SignUP').val();
		var $pass  = $('#Login-Password-SignUP').val();
		var $cPass = $('#Login-ConfirmPassword-SignUP').val();
		
		//Validations
        if($empID == '' || $empID != parseInt($empID)){
		
			Alert('Employee ID can not be blank and must be Numeric' );
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
        data.cPass = $cPass;
        
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
		
					btn.button('reset');
					$('#signUP').removeClass("visible").addClass('hidden');
					$('#signIN').removeClass("hidden").addClass('visible');
				}

                Alert(data.msg);
			},
			error: function (error) {
				
				btn.button('reset');
				Alert('error connecting Server');
			}
			
		});
	});


	//User Logout
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
				
				//goes back to sign in page (/)
				window.location.href ='/';
				
			},
			error: function (error) {
				Alert('error connecting Server');
			}
			
		});	
	});
	
	//Reveals section
    $(".ulClass li:nth-child(5)").click(function(e){
		if($("#inventoryControl").hasClass("hidden")){
			$("#inventoryControl").removeClass("hidden").addClass("visible");
		}
		else{
			$("#inventoryControl").removeClass("visible").addClass("hidden");
		}
	});
    
    
    //Reveals user reports 
    $(".ulClass li:nth-child(9)").click(function(e){
    	if($("#reports").hasClass("hidden")){
			$("#reports").removeClass("hidden").addClass("visible");
		}
		else{
			$("#reports").removeClass("visible").addClass("hidden");
		}
        
        //Shows user reports(calls showReports function)

        showReports(report);
	});
        
        
	
	//Modal pops up 
    $(".ulClass li:nth-child(4)").click(function(e){
		
		if($("#about").hasClass("hidden")){
			$("#about").removeClass("hidden").addClass("visible");
		}
		else{
			$("#about").removeClass("visible").addClass("hidden");
		}
	});
	

	
	
	$('.WButton').click(function(e){
		console.log("wbutton");
		$('#timeslot').removeClass('hidden').addClass('visible'); 
		$mc = this.value;
		$('#machineNumber').html('');
		$('#AvailablityTable').html('');
		//alert($mc);
	
	
	});

	
    //Submit Available Date & Timeslot
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
		
		//Validation on selecting a valid date
        if($date == '' || isFinite($date) || ($dateToday >= $tdate)){
			$('#AvailablityTable').html('');
			$('#submitbuttonReset').removeClass('visible').addClass('hidden');
			//document.getElementById('errorCalendar').innerHTML='Please Select A Valid Date';
			Alert("Please Select A Valid Date");
			return false;
		}
        
		//Available Times for Workstation__ (shows mc that was selected)
        $('#machineNumber').html('<font color ="black" size="4"> </br>Available Times For Workstation '+$mc+'</font>' );
		document.getElementById('errorCalendar').innerHTML='';
		
		dataR.fDate = $fdate;
		dataR.tDate = $tdate;
		dataR.mc = $mc;
		var btn = $(this);
	
		btn.button('loading');
        
		//Same as Build Table (bldTable)
        $('#AvailablityTable').html('<img src="http://www.travislayne.com/images/loading.gif" class="icon" />');
		$.ajax({
			type: 'POST',
			data: JSON.stringify(dataR),
			contentType: 'application/json',
			url: '/availReservation',						
			
            //success function
            success: function(data) {
				arrayOfBlockedTime = data.msg;
				$('#AvailablityTable').html('<img src="http://www.travislayne.com/images/loading.gif" class="icon" />');
				btn.button('reset');
				htmlString = '';
				htmlString = '<div  class="table-responsive">';
				htmlString = htmlString + '<table class="table table-hover" width="100%">';
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
					
						//Not an available time, Button=Red
                        btnClass = 'btn-danger';
					}
					else {
					
						//Time available, Button=Green/Clickable
						btnClass = 'btn-success clickable';
					}
					htmlString = htmlString + '<td><button type="button" id="'+timeString+'" value="'+timeString+'" class="btn '
											+ btnClass+' btn-md">'+timeString+'</button></td>';
				}
				
                htmlString = htmlString + '</tr></table>';
				$('#AvailablityTable').html('');
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

	
    //
    $(document).on('click', '.clickable', function(e){
		if(!$(this).hasClass("btn-warning")){
			$(this).removeClass('btn-success clickable').addClass('btn-warning');
			
			
			//alert('TimeRange = ' + timeRange);
			if(timeRange =='00:00-00:00')
			{
				timeRange = this.value;
			}
			else
			{
				//var timeRangeArray = timeRange.split('-');
				var tempTimeRange = timeRange;
				if(timeRange.split('-')[0] > (this.value).split('-')[0]) 
				{
					timeRange = (this.value).split('-')[0] +'-'+timeRange.split('-')[1];
					if(checkTime(timeRange))
					{		
						Alert('Can not book: ' + timeRange);
						timeRange = tempTimeRange;
						$(this).removeClass('btn-warning').addClass('btn-success clickable');	
					}
					else{
						addTime(tempTimeRange);
					}
				}
				else if (timeRange.split('-')[0] < (this.value).split('-')[0])
				{
					timeRange = timeRange.split('-')[0] +'-'+(this.value).split('-')[1];
					if(checkTime(timeRange))
					{		
						Alert('Can not book: ' + timeRange);
						timeRange = tempTimeRange;
						$(this).removeClass('btn-warning').addClass('btn-success clickable');	
					}
					else{
						addTime(tempTimeRange);
					}
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
			//document.getElementById('errorCalendar').innerHTML='Please Select A Valid Time';
			Alert("Please Select A Valid Time");
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
		
		$('#submitbutton123').removeClass('visible').addClass('hidden');
	});
	
	
	
	
	//Reserving section: clicking "Reserve" button to complete reservation
    $('#reservebutton').click(function(e){
		e.preventDefault();
		if($('#reserveComment').val() == ''){
			
			//Alert function: Must enter reason for reserving PC
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
                 
                    if (data.message.indexOf("successful") > -1)
                    {
                            //assigning it to an object called user 
                        User = {_id     : data.newId._id, 
                                id   	: $sessionData.emp,
                                name 	: $sessionData.name,
                                from 	: $sessionData.from,
                                to   	: $sessionData.to,
                                reason 	: $sessionData.reason,
                                mc     	: $sessionData.mc,
                                resDate : new Date() };
                            
                        
                        //pushing it to resData if successful 
                        resData.R.push(User);
                       
                    };
                
                
					btn.button('reset');
					document.getElementById('alertSpan').innerHTML=data.message;
					$('#alertModal').modal('show');
					//alert(data.message);
					timeRange = '00:00-00:00';
					document.getElementById('timeSpan').innerHTML="";
					htmlString = '';
					arrayOfBlockedTime = {};
					delete $sessionData.mc ;
					delete $sessionData.from ;
					delete $sessionData.to ;
					delete $sessionData.reason ;
					
					$('#download').removeClass('visible').addClass('hidden');
					$('#timeslot').removeClass('visible').addClass('hidden'); 
					$('#submitbutton123').removeClass('visible').addClass('hidden');
					$('#submitbuttonReset').removeClass('visible').addClass('hidden');
					$('#AvailablityTable').html('');
					$('#datepicker2').val('');
					$('#reserveComment').val('');
					$('#machineNumber').html('');
				},
				error: function (error) {
					btn.button('reset');
					
					//modal Alert
                    Alert('Error Connecting Server');
				}
				
			});						
		}
		
	});


	//Builds Timeslot table after reserving a MC (Rebuilds table after resetting times)
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
				
				htmlString = '';
				htmlString = '<div  class="table-responsive">';
				htmlString = htmlString + '<table class="table table-hover" width="100%">';
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
				$('#AvailablityTable').html(htmlString);
				$('#submitbutton123').removeClass('hidden').addClass('visible');
				$('#submitbuttonReset').removeClass('hidden').addClass('visible');
				
				
			},
			error: function (error) {
				Alert('error connecting to Server');
			}
			
		});	
	
	};
	

   
var addTime = function(tempTimeRange)
	{
					
		var upperRange = (parseInt(timeRange.split('-')[1].split(':')[0]) - 1).toString() +':'+ timeRange.split('-')[1].split(':')[1];
		
		if(upperRange.length < 5)
		{
			upperRange = '0' + upperRange;
		}
				
		tempFrom = (parseInt(timeRange.split('-')[0].split(':')[0]) + 1).toString() +':'+timeRange.split('-')[0].split(':')[1];
		tempTo = (parseInt(timeRange.split('-')[0].split(':')[0]) + 2).toString() +':'+timeRange.split('-')[0].split(':')[1];
				
		if(tempFrom.length < 5)
		{
			tempFrom = '0'+tempFrom;
		}
		if(tempTo.length< 5)
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
	
	
	 //Navigation Bar: Displays Text to each Graphic
        $('#myNav').click('li', function() {
          $('#myNav').collapse('hide');
        });
        //About
        $("#aAbout").hover(
          function() {
            $( this ).append( $( "<center><span> about</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
        //Logout
        $("#logout").hover(
          function() {
            $( this ).append( $( "<center><span> logout</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
        //My Reservation
        $("#aReservation").hover(
          function() {
            $( this ).append( $( "<center><span> Reservation</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
        //Inventory
        $("#aInventoryControl").hover(
          function() {
            $( this ).append( $( "<center><span> Inventory</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );
        //Feedback
        $("#feedback").hover(
          function() {
            $( this ).append( $( "<center><span> feedback</span></center>" ) );
          }, function() {
            $( this ).find( "span:last" ).remove();
          }
        );

		var reportFilter = function(){
		var filteredReport ={user:[]};
		var reservedDateEnd= new Date(document.getElementById("filterReserved").value);
		reservedDateEnd.setDate(reservedDateEnd.getDate()+1);
		report.user.forEach(function(doc){
			var checkMark = true;
			if(doc.name.toUpperCase().indexOf(document.getElementById("filterName").value.toUpperCase()) <= -1){
				checkMark=false;
			}
			if(String(doc.id).toUpperCase().indexOf(document.getElementById("filterEmpid").value.toUpperCase())<=-1){
				checkMark=false;	
			}
			
			if(String(doc.mc).toUpperCase().indexOf(document.getElementById("filterWorkstation").value.toUpperCase())<=-1){
				checkMark=false;	
			}
			
			if(String(doc.reason).toUpperCase().indexOf(document.getElementById("filterReason").value.toUpperCase())<=-1){
				checkMark=false;	
			}			
			
			if(document.getElementById("filterFrom").value != ""){
				if(new Date(doc.from)<new Date(document.getElementById("filterFrom").value)){
					checkMark=false;
				}
			}
			
			if(document.getElementById("filterTo").value != ""){
				if(new Date(doc.to)>new Date(document.getElementById("filterTo").value)){
					checkMark=false;
				}
			}
			
			if(document.getElementById("filterReserved").value != ""){
				if(new Date(doc.resDate)<new Date(document.getElementById("filterReserved").value)||new Date(doc.resDate)>reservedDateEnd){
					checkMark=false;
				}
			}

			if(checkMark){
				filteredReport.user.push(doc);
			}
			
		});
		showReports(filteredReport);			
	};
	
	var nameFilter = "";
	var empIDFilter = "";
	var workstationFilter = "";
	var reasonFilter = "";
	var fromFilter = "";
	var toFilter = "";
	var reservedFilter = "";
	
	//User Reports Table
    var showReports = function(report){
    
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
        
        //empty string(.html(""))..clears table
        $("#userReports").html("");
		
		//format of reservation table
        var htmlString= "<center><div class="+'table-responsive'+"><table id='myReports' class="+'table table-hover'+"><tr><th>Name</th><th>Employee ID</th><th>Workstation</th><th>From Date & Time</th><th>To Date & Time</th><th>Date Reserved</th><th>Reason</th></tr></center>";
		htmlString = htmlString + "<tr><td><input style=\"width:80%\" type=\"text\" name=\"filter\" id=\"filterName\"></input></td><td><input style=\"width:80%\"  type=\"text\"  name=\"filter\" id=\"filterEmpid\"></input></td><td><input type=\"text\" name=\"filter\" style=\"width:80%\" id=\"filterWorkstation\"></input></td><td><input style=\"width:80%\" type=\"text\" name=\"filter\" readonly id=\"filterFrom\"></input><input style=\"width:80%\" type=\"button\" class=\"btn btn-default \" name=\"filter\" value=\"Clear\" id=\"filterFromClear\"></input></td><td><input style=\"width:80%\"  type=\"text\" name=\"filter\" readonly id=\"filterTo\"></input><input style=\"width:80%\" type=\"button\" class=\"btn btn-default \" name=\"filter\" value=\"Clear\" id=\"filterToClear\"></td><td><input style=\"width:80%\"  type=\"text\" name=\"filter\" readonly id=\"filterReserved\"></input><input style=\"width:80%\" type=\"button\" class=\"btn btn-default \" name=\"filter\" value=\"Clear\" id=\"filterReservedClear\"></td> <td><input style=\"width:80%\" type=\"text\" name=\"filter\" id=\"filterReason\"></input></td></tr> "

        //data of the table
        report.user.forEach( function(doc){
			fromDate = new Date(doc.from);
			toDate = new Date(doc.to);
            currentDate = new Date();
            reservationDate= new Date(doc.resDate);
			
			fromMonth = month[fromDate.getMonth()];
			fromYear = fromDate.getFullYear();
			
			toMonth = month[toDate.getMonth()];
			toYear = toDate.getFullYear();
            
            resMonth = month[reservationDate.getMonth()];
            resYear = reservationDate.getFullYear();
			
			fromMin = fromDate.getMinutes() < 10 ? '0'+fromDate.getMinutes() : fromDate.getMinutes();
			toMin = toDate.getMinutes() < 10 ? '0'+ toDate.getMinutes() : toDate.getMinutes();
			fromDay = fromDate.getDate() < 10 ? '0'+fromDate.getDate() :fromDate.getDate();
			toDay  =  toDate.getDate() < 10 ? '0'+toDate.getDate() : toDate.getDate() ;
			fromHour = fromDate.getHours() < 10 ? '0'+fromDate.getHours() : fromDate.getHours();
			toHour = toDate.getHours() < 10 ? '0'+toDate.getHours() : toDate.getHours() ;
            resMin = reservationDate.getMinutes() < 10 ? '0'+reservationDate.getMinutes() : reservationDate.getMinutes();
            resDay = reservationDate.getDate() < 10 ? '0'+reservationDate.getDate() :reservationDate.getDate();
            resHour = reservationDate.getHours() < 10 ? '0'+reservationDate.getHours() : reservationDate.getHours() ;
            
            htmlString = htmlString + '<tr id=tr'+doc._id+'><td>'+doc.name+'</td><td>'+doc.id+'</td><td>'+doc.mc+'</td><td width="15%">'+fromDay 
				+ "-"+fromMonth+'-'+ fromYear+'  '+ fromHour + ":"
				+ fromMin+'</td><td width="15%">'+toDay + "-"+ toMonth + "-"+ toYear+ '  '+  toHour + ":" 
				+ toMin+'</td><td width="15%">'+resDay	+ "-"+resMonth+'-'+ resYear+'  '+ resHour + ":"
				+ resMin+'</td><td>'+doc.reason+'</td></tr>';
            
            });
       
            
             htmlString = htmlString + '</div></table>' ;
             
             //JavaScript Way
             //document.getElementById('userReports').innerHTML=htmlString;
		
            //JQuery Way
        $("#userReports").html(htmlString);
		$( "#filterTo" ).datepicker({
			onSelect: function (dateText, inst) {
			toFilter = dateText;
			loadFilters();
			reportFilter();
			loadFilters();
		}
		});
		$("#filterToClear").click(function (){
			toFilter = "";
			loadFilters();
			reportFilter();
			loadFilters();
		})
		
		$( "#filterFrom" ).datepicker({
			onSelect: function (dateText, inst) {
			fromFilter = dateText;
			loadFilters();
			reportFilter();
			loadFilters();
		}
		});
		$("#filterFromClear").click(function (){
			fromFilter = "";
			loadFilters();
			reportFilter();
			loadFilters();
		})
		
		$( "#filterReserved" ).datepicker({
			onSelect: function (dateText, inst) {
			reservedFilter = dateText;
			loadFilters();
			reportFilter();
			loadFilters();
		}
		});
		$("#filterReservedClear").click(function (){
			reservedFilter = "";
			loadFilters();
			reportFilter();
			loadFilters();
		})
		
		$('#filterName').keypress(function( event ) {
			event.preventDefault();
			nameFilter = nameFilter+String.fromCharCode(event.which);
			loadFilters();
			reportFilter();
			loadFilters();
			$('#filterName').focus();
		})
		
		$('#filterName').keyup(function( event ) {
			if(event.which == 8 ||event.which == 46){
				nameFilter = document.getElementById('filterName').value;
				loadFilters();
				reportFilter();
				loadFilters();
				$('#filterName').focus();
			}
		})
		$('#filterEmpid').keypress(function( event ) {
			event.preventDefault();
			empIDFilter = empIDFilter+String.fromCharCode(event.which);
			loadFilters();
			reportFilter();
			loadFilters();
			$('#filterEmpid').focus();
		})
		
		$('#filterEmpid').keyup(function( event ) {
			if(event.which == 8 ||event.which == 46){
				empIDFilter = document.getElementById('filterEmpid').value;
				loadFilters();
				reportFilter();
				loadFilters();
				$('#filterEmpid').focus();
			}
		})
		$('#filterWorkstation').keypress(function( event ) {
			event.preventDefault();
			workstationFilter = workstationFilter+String.fromCharCode(event.which);
			loadFilters();
			reportFilter();
			loadFilters();
			$('#filterWorkstation').focus();
		})
		
		$('#filterWorkstation').keyup(function( event ) {
			if(event.which == 8 ||event.which == 46){
				workstationFilter = document.getElementById('filterWorkstation').value;
				loadFilters();
				reportFilter();
				loadFilters();
				$('#filterWorkstation').focus();
			}
		})
		$('#filterReason').keypress(function( event ) {
			event.preventDefault();
			reasonFilter = reasonFilter+String.fromCharCode(event.which);
			loadFilters();
			reportFilter();
			loadFilters();
			$('#filterReason').focus();
		})
		
		$('#filterReason').keyup(function( event ) {
			if(event.which == 8 ||event.which == 46){
				reasonFilter = document.getElementById('filterReason').value;
				loadFilters();
				reportFilter();
				loadFilters();
				$('#filterReason').focus();
			}
		})
		
		
		
	};
	var loadFilters = function(){
		document.getElementById('filterEmpid').value = empIDFilter;
		document.getElementById('filterName').value = nameFilter;
		document.getElementById('filterWorkstation').value = workstationFilter;
		document.getElementById('filterReason').value = reasonFilter;
		document.getElementById('filterFrom').value = fromFilter;
		document.getElementById('filterTo').value = toFilter;
		document.getElementById('filterReserved').value = reservedFilter;
	}
    
    //My Reservation, <div id="myReservation">
    var showModal =function($resData){
	
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
	
		//empty string(.html(""))
        $("#myReservation").html("");
		
		//format of reservation table
        var htmlString= "<center><div class="+'table-responsive'+"><table id='mytable' class="+'table table-hover'+"><tr><th>WorkStation</th><th>From Date & Time</th><th>To Date & Time</th><th>Action</th></tr></center>";
		
		
		
		
        //data of the table
        $resData.R.forEach( function(doc){
			
			
			
			fromDate = new Date(doc.from);
			toDate = new Date(doc.to);
            currentDate = new Date();
			
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
		
            if(currentDate < toDate){
		
			htmlString = htmlString + '<tr id=tr'+doc._id+'><td>'+doc.mc+'</td><td>'+fromDay 
				+ "-"+fromMonth+'-'+ fromYear+'  '+ fromHour + ":"
				+ fromMin+'</td><td>'+toDay + "-"+ toMonth + "-"+ toYear+ '  '+  toHour + ":" 
				+ toMin+'</td><td><button class="btn btn-danger btn-sm btnDelete" data-loading-text="Wait..."'
				+  'id='+doc._id+'>Cancel</button></td></tr>';
              }
              
              else{
              
              htmlString = htmlString + '<tr id=tr'+doc._id+'><td>'+doc.mc+'</td><td>'+fromDay 
				+ "-"+fromMonth+'-'+ fromYear+'  '+ fromHour + ":"
				+ fromMin+'</td><td>'+toDay + "-"+ toMonth + "-"+ toYear+ '  '+  toHour + ":" 
				+ toMin+'</td><td><button class="btn btn-danger btn-sm btnDelete disabled" data-loading-text="Wait..."'
				+  'id='+doc._id+'>Cancel</button></td></tr>';
            }
              
		});
        
		
        htmlString = htmlString + '</div></table>' ;
		
		//console.log(htmlString);
		
		$("#myReservation").html(htmlString);
	};
	
	
	//Deleting reservation from table: document-->index.ejs
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
                //Remove from resData object
                resData.R.forEach(function(doc){
              
                    //_id: objectID $id=cancel button id
                    if(doc._id == $id){
                    
                    var delData = resData.R.indexOf(doc);
                    
                    //Remove
                    if (delData > -1) {
                        resData.R.splice(delData, 1);
                    }
                    
                  }
                
                
               });
                
			
				
			},
			error: function (error) {
				
				//modal
                Alert('Error Connecting to Server');
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
	
	
	//Getting Software List from Database with AutoComplete
    var filterArray = function($arr){
			uniqueArray = $arr.filter(function(elem, pos, self) {
				return self.indexOf(elem) == pos;
			});
			return uniqueArray;
	};
	
	var availableTags = [];
	
	var PossibleSoftwares = ['TCS Mastercraft','Eclipse','JBOSS Webserver','Tomcat Webserver','Jetty Webserver','PHP','Python','Java jdk','Ruby',
        'COBOL','MongoDB','Heroku Toolbelt','NodeJS','Git Bash','Git Shell for Windows','MySQL','Oracle','Datastage','Informatica','C','C++','Microsoft Visual Studio',
		'MS Visual Studio','MS Office','Robomongo','Google Chrome','Oracle VM','Virtual Machine','Mozilla Firefox','Android Dev Kit','iOS Dev Kit','X-code','Objective-C',
		'Notepad++','Opera Browser','IE','Anti-Virus','McAfee','Norton','Windows','Mircosoft'];
	
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
			
			//Finding Software with AutoComplete
            $( "#searchAutoComplete" ).autocomplete({
				source: availableTags
			});	
		},
		error: function (xhr, status, error) {
			Alert('Error connecting to Server');
		}
			
	});
	
	//Finding Software Button (Submit)
    $('#serachSubmit').click(function(e){
		e.preventDefault();

		//Validation on finding software
        if(availableTags.indexOf($('#searchAutoComplete').val()) == -1){
			document.getElementById('invAlertSpan').style.color="red";
			document.getElementById('invAlertSpan').innerHTML='Please Select a Software';
			return false;
		}
		//AutoComplete
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
					document.getElementById('invAlertSpan').innerHTML='This Software is not Found';
				}
				else{
					document.getElementById('invAlertSpan').style.color="green";
					document.getElementById('invAlertSpan').innerHTML='That Software is Available at these Machines:  '+ data.msg;
					
				}
				
			},
			error: function (xhr, status, error) {
				document.getElementById('invAlertSpan').style.color="red";
				document.getElementById('invAlertSpan').innerHTML='Error connecting to Server';
			}
			
		});
		
	});
	
	//Adding Software Button (Add To Inventory)
	$('#siriachaSubmit').click(function(e){
		e.preventDefault();
		
		//Validation if text field is empty
        if($('#Software').val() == ''){
			//Modal Alert
            Alert('Please Select/Add software');
			return false;
		}
		var allVals = $('.ws:checked').map(function() {return this.value;});
		var mcArr = [];
		var data ={}
		data.sw = $('#Software').val();
		
		for(var i=0 ; i< allVals.length ; i++){
			console.log(allVals[i]);
			mcArr.push(parseInt(allVals[i]));
		}
		console.log(allVals.length);
		data.mc = mcArr;
		console.log(data.mc);
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/addSoftware',						
			success: function(data) {
				
				if(data.msg =='success'){
					if (availableTags.indexOf($('#Software').val()) == -1){
						availableTags.push($('#Software').val());
						
					}
					if (PossibleSoftwares.indexOf($('#Software').val()) == -1){
						PossibleSoftwares.push($('#Software').val());
					}
				
					Alert('software successfully added');
				}
				else if(data.msg =='AA'){
					Alert('That software is already available at those machines');
				}
			},
			error: function (xhr, status, error) {
				Alert('Error connecting to Server');
			}
			
		});

	});		
			
	//Modal Alert Function (makes every alert a modal)
	var Alert = function($value){
		
		document.getElementById('alertSpan').innerHTML=$value;
		$('#alertModal').modal('show');
		
	};
  })();
});