$(function() {
	
	var marketIds = [];
	var marketName = [];
	var marketAddress = [];
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
	
	function addInfo(name,data){
		return  "<h3>" + name + "</h3>Address: " + data.Address + "<br>Schedule: " + data.Schedule; 
		
	}

	function addMarker(data, name) {
		$.each(data, function(key, value) {
			var results = data[key];
			var googleLink = results['GoogleLink'];
			var marketlatlng = decodeURIComponent(googleLink.substring(googleLink.indexOf("=")+1, googleLink.indexOf("("))).split(',');		
			var marketlat = marketlatlng[0];
			var marketlng = marketlatlng[1];
			var marker = new google.maps.Marker({
				position : new google.maps.LatLng(marketlat,marketlng),
				map : map,
			});
			var content = addInfo(name,results);
			allMarkers.push(marker);
			google.maps.event.addListener(marker, 'click', (function(marker) {
	            return function() {
	                infoWindow.setContent(content);
	                infoWindow.open(map, marker);
	            }
	        })(marker));
		});	
	}

	$('#search').click(findStore);
	function findStore(){
		map.setCenter({lat : userCoord.latitude, lng : userCoord.longitude});
		map.setZoom(10);
		$.ajax({
			url: 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat='+userCoord.latitude + "&lng=" + userCoord.longitude,
			type: 'GET',
			dataType: 'json',
			success : function(data){
				$.each(data.results, function(index, val) {
					marketIds.push(val.id);
					marketName.push(val.marketname);
				});
				var counter = 0;
				$.each(marketIds, function(index, val) {
					 $.ajax({
						url: 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id='+ val,
						type: 'GET',
						dataType: 'json',
						success : function (data){	
							addMarker(data,marketName[counter]);
							counter++;
						}
					});	
				});

			}
		});
	}

});