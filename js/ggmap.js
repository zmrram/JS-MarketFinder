$(function() {
	
	var allLatLong = [];
	var allMarkers = [];
	var infoWindow = null;
	var position;
	var userCoord;
	var tempMarkerHolder = [];

	if (navigator.geolocation) {

		function error (err){
			console.warn('ERROR(' + err.code + '): ' + err.message);
		}

		function success(position){
			userCoord = position.coords;
			console.log(userCoord);

		}

		navigator.geolocation.getCurrentPosition(success,error);
	}
	else {
		alert('Geolocation is not supported')
	}

	var mapOptions = {
		zoom : 5,
		center: new google.maps.LatLng(32.09024,-100,712991),
		panControl : false,
		panControlOptions : {
			position: google.maps.ControlPosition.BOTTOM_LEFT
		},
		zoomControl : true,
		zoomControlOptions :{
			style : google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		scaleControl : false
	};

	infoWindow = new google.maps.InfoWindow({
		content : ""
	});

	map = new google.maps.Map(document.getElementById('map'),mapOptions);
	google.maps.event.addListener (map, 'click', function(){
		infoWindow.close();
	});
	
	$('#search').click(findStore);
	function findStore(){
		map.setCenter({lat : userCoord.latitude, lng : userCoord.longitude});
		map.setZoom(10);
		var marketIds = [];
		var market = [];
		var maddress = [];
		$.ajax({
			url: 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat='+userCoord.latitude + "&lng=" + userCoord.longitude,
			type: 'GET',
			dataType: 'json',
			success : function(data){
				for (var i = 0; i < data.results.length; i++){
					marketIds[i] = data.results[i].id;
					market[i] = {marketName : data.results[i].marketname, marketAddress : ""};
				}
				var index = 0;
				while (index < data.results.length){
					$.ajax({
						url: 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id='+marketIds[index],
						type: 'GET',
						dataType: 'json',
						success : function (data){
							maddress.push(data.marketdetails.Address);	
							console.log(maddress);				
						}
					});	
					index++;			
				}
				console.log(maddress);
				console.log(market);
			}

		});
		for (var i = 0; i < sampleData.data.length; i++){
			console.log("Hello");
			var marker = new google.maps.Marker({
			position : sampleData.data[i].location,
			map : map,
			});	
			allMarkers.push(marker);

			google.maps.event.addListener(marker, 'click', (function(marker, i) {
	            return function() {
	                infoWindow.setContent("<h3>" +sampleData.data[i].storeName  + "</h3>Price: " +  sampleData.data[i].price + "\nRating: " +  sampleData.data[i].rating);
	                infoWindow.open(map, marker);
	                }
	        })(marker, i));
		}
	}

});