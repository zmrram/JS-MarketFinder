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
	var marker = new google.maps.Marker({
		position : new google.maps.LatLng(34.0565284,-117.8237182),
		map : map
	});
	market.setMap(map);
});