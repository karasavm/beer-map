


//Create the variables that will be used within the map configuration options.
//The latitude and longitude of the center of the map.

//The degree to which the map is zoomed in. This can range from 0 (least zoomed) to 21 and above (most zoomed).
var beerMapZoom = 7;
//The max and min zoom levels that are allowed.
var beerMapZoomMax = 9;
var beerMapZoomMin = beerMapZoom;

// -------------------------------------------------
var ZINDEX_MARKER = 100;
var MARKER_CAP_SIZE = 45;

var MARKER_CAP_HOVER_FACTOR = 7.5;

var MAX_ZOOM = 15;
var MIN_ZOOM = 3;
// var MIN_ZOOM = 2;
var MAX_ZOOM_CLUSTERS = 7;
var STAR_MODE_MAX_ZOOM = 9;
// var PINS_PATH = 'icons/pins/cp200x200cp/';
var PINS_PATH = 'icons/pins/150x150cp/';
var LOGO_PATH = 'icons/pins/compressed/';
var zoomCtrLocked = false;
var onGroupMode = 0;
var initState = false;
var on
var INITIAL_ZOOM = null;
var INITIAL_CENTER = new google.maps.LatLng(39.074208, 22.824311999999964);
// -------------------------------------------------
//These options configure the setup of the map.
var beerMapOptions = {

		  center: INITIAL_CENTER,
        zoom: MIN_ZOOM,
		  maxZoom: MAX_ZOOM,
		  minZoom: MIN_ZOOM,
		  backgroundColor: 'hsla(0, 0%, 0%, 0)',
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
		  panControl: false,
		  mapTypeControl: false,
		  streetViewControl: false
};
//Create the variable for the main map itself.
var beerMap;
var isStarMode = true; // start is when markers are in "star" position on map, on virtual positions
var currentCapSize = MARKER_CAP_SIZE;
var curOpenedPin;
var markerClusters;
var firstOpen = true;

var selectedMode, state;

var markers = [];
var spotsMarkers = [];

var markersLines = [];
var infoBoxes = [];
// var markersRaw = [];
var areaMarkersHiden, allMarkersHiden;
var curLang = 'gr';
///////// MAIN /////////////
var overrideSearchboxHash = false;

function onHashChange () {
	if (location.hash === '#map') {
		console.log("hash map")
		// closeIntroModal();
		if (($("#introModal").data('bs.modal') || {})._isShown) {
			closeIntroModal();
		}
		backBtnHandle();

		if (document.getElementById("searchlist").style.display === "block") {
				onSearchBoxClearClick();
		}


	}

	if (location.hash === '#zoomed') {

		$('#beerInfoModal').modal('hide');
	}

	if (location.hash === '#eye') {
		$('#beerInfoModal').modal('hide');
	}


	if (location.hash === '#searchbox' && overrideSearchboxHash) {
		window.history.back();
		overrideSearchboxHash = false;
	}

}



window.addEventListener('DOMContentLoaded', function() {

  // openIntroModal();
	translate();
	document.getElementsByTagName("BODY")[0].style.display = 'block';
}, true);





//When the page loads, the line below calls the function below called 'loadbeerMap' to load up the map.
google.maps.event.addDomListener(window, 'load', function() {
	console.log("addDomListener");

	document.getElementById("eyeBtn").addEventListener("touchstart", function(e) {
		// onEyeDown();
	}, false);

	document.getElementById("eyeBtn").addEventListener("touchend", function(e) {
		// onEyeUp();
	}, false);

	parseRawData();

	createAreaMarkers('beers');
	createAllMarkers(markersRaw, markers);
	createAllMarkers(spotsData, spotsMarkers);
	console.log("spotsMarkers",spotsMarkers)
	loadbeerMap();

});


/// ------------ LANGUAGES ----------- ////////

var languages = {
	'en' : {
		'groupsBtn': 'Groups',
		'pinsBtn': 'Pins',
		'brewsBtn': 'Brews',
		'beersBtn': 'Beers',
		'introBeers': 'BEERS',
		'introBrewers': 'BREWS',
		'areasBtn': 'Areas',
		'words' : {
			"beers": "Beers",
			"since": "since",
			"beersLabel": "beers",
			"brewsLabel": "brews"
		}
	},
	"gr" : {
		'groupsBtn': 'Γκρουπ',
		'pinsBtn': 'Πινς',
		'areasBtn': 'ΠΕΡΙΟΧΕΣ',
		'introBeers': 'ΜΠΥΡΕΣ',
		'brewsBtn': 'Ζυθοποιίες',
		'beersBtn': 'Μπύρες',
		'introBrewers': 'ΖΥΘΟΠΟΙΙΕΣ',
		'words' : {
			"beers": "Μπύρες",
			"since": "από το",
			"beersLabel": "μπύρες",
			"brewsLabel": "ζυθοποιίες"

		}
	}
}
function translate() {

	// Translate Static tags
	console.log("translating....")
	var allDom = document.getElementsByTagName("*");
	for(var i =0; i < allDom.length; i++){

			var elem = allDom[i];
	    var key = elem.getAttribute('lng-key');

	    if(key != null) {
	         elem.innerHTML = languages[curLang][key]  ;
	    }
	}

	// Translate List Itmes
	console.log("Translating List Items")
	for (var i=0; i < markersRaw.length; i++) {

		var a = document.getElementById("item-" + i.toString())
		if (a) {
				setWordingListItem(a, markersRaw[i])
		}

	}

}

function changeLang() {
	var selectBox = document.getElementById("langSelectBox");
  curLang = selectBox.options[selectBox.selectedIndex].value;

	translate(); // translate static tags

}
////////////////////////////////////////////////
//THE MAIN FUNCTION THAT IS CALLED WHEN THE WEB PAGE LOADS --------------------------------------------------------------------------------
function loadbeerMap() {


  // hidePinPreview()
  //The empty map variable ('beerMap') was created above. The line below creates the map, assigning it to this variable.
  //The line below also loads the map into the div with the id 'festival-map' (see code within the 'body' tags below), and applies the 'beerMapOptions' (above) to configure this map.
  beerMap = new google.maps.Map(document.getElementById("festival-map"), beerMapOptions);

	// texture
	var rainMapOverlay = new google.maps.ImageMapType({
	 getTileUrl: function(coord, zoom) {
		 return '../images/texture.jpg'
			return 'tiles2' + '/' +zoom+ '/' +coord.x+ '/' + coord.y +'.png';
	 },
	 tileSize: new google.maps.Size(256, 256),
	 opacity: 0.45
	});
	beerMap.overlayMapTypes.push(rainMapOverlay);



	// event handler
	beerMap.addListener('zoom_changed', onZoomChanged);

	// greece selection

	// beerMap.data.loadGeoJson(
	// 		'../data.json');
	// //
	// beerMap.data.setStyle({
	// 		fillColor: 'transparent',
	// 		// fillColor: '#ecc080',
	// 		strokeWeight: 0.5,
	// 		strokeColor: 'black',
	// 		fillOpacity: 1,
	// 		icon: '151933374.png',
	// 		zIndex: -1000
	// });



  loadStyledMap();
	// 1942530.6747511886 3829963.993290439
	// 3507961.0140315965 5395394.332570849
	// var swBound = new google.maps.LatLng(32.506365, 17.450050 );
	// var neBound = new google.maps.LatLng(43.545629,31.512550);
	// var bounds = new google.maps.LatLngBounds(swBound, neBound);
	//
	// var srcImage = '../testimage.png';
	// var srcImage = '../images/texture2.jpg';
	//
	// overlay = new USGSOverlay(bounds, srcImage, beerMap);




	var imageBounds = {
          north: 48.545629,
          south: 24.506365,
          east: 41.512550,
          west: 7.450050
        };

  // historicalOverlay = new google.maps.GroundOverlay(
  //     '../images/texture2.jpg',
  //     imageBounds, {opacity: 0.5});
  // historicalOverlay.setMap(beerMap);






	// translate();
  //Calls the function below to load up all the map markers.
  // loadMapMarkers(markersRaw, markers); // create markers list
  // updateMarkersSize();

  // loadClusters();
  // 	ters();
  loadBanner();
	initControlsState();



	setTimeout(function(){
		// showAreaMarkers(selectedMode)
	}, 1000)



	google.maps.event.addListenerOnce(beerMap, 'idle', function(){


    // do something only the first time the map is loaded

		// document.getElementById('controls').style.display = 'block';
		setTimeout(function test() {
			// document.getElementById('controls').style.display = 'block';
			openIntroModal();

		}, 10);

		setTimeout(function() {
			setSearchList();
		}, 4000)
	});

} // EDN OF loadbeerMap()



var areaMarkers = [];
// var areaBrewMarkers = [];

var drop = true;
function start(marker) {
	return function() {
		marker.setMap(beerMap)
	}
}

function onEyeDown() {
	return;
	hideAreaMarkers();
	showAllMarkers(markers);

}

function onEyeUp() {
	return;
	hideAllMarkers();
	showAreaMarkers(selectedMode);
}
function createAllMarkers(markersRaw, markers) {
	// set the beers number
	// set the brews number
	for (var i=0; i < markersRaw.length; i++) {
		var data = markersRaw[i];

		var marker = createImageMarker(
			data.lat,
			data.log,
			data.icon,
			data.name[curLang] || data.name,
		)

		marker.rawData = markersRaw[i];

		// marker.setLabel(getAreaMarkerLabel(marker.rawData.beers.toString() + ' ' + languages[curLang]['words']['beersLabel']))

		markers.push(marker);

		google.maps.event.addListener(markers[i], "click", function() {
			location.hash='modal'
			setInfoModalValues(this);
			$('#beerInfoModal').modal();
      // x.style.display = "none"
      curOpenedPin = this;



      var latLng = new google.maps.LatLng(this.rawData.lat, this.rawData.log)
      // beerMap.setCenter(latLng);
      // beerMap.setZoom(MAX_ZOOM)

      // var contentString = '<div id="content">'+
      //           '<div id="bodyContent">'+
      //           '<a target="_blank" href="'+this.rawData.infoUrl+'">info</a> <br>'+
      //           '<a target="_blank" href="'+this.rawData.mapUrl+'">Navigate</a>'+
      //           '</div>';
      //
      // var infowindow = new google.maps.InfoWindow({
      //   content: contentString
      // });
      // infowindow.open(beerMap, this)
    })
	}
}
var fontSize = 15;
function getAreaMarkerLabel(text) {
	// console.log('getAreaMarkerLabel()')
	return {
		color: 'white',
		fontSize: (getMarkerResizeFactor()*fontSize).toString() + 'px',
		fontWeight: '',
		text: text,
		fontFamily: "Cursive, Helvetica, Arial, Sans-Serif"
	}
}
var areasLabels = [];
function createAreaMarkers(type) {


	console.log('createAreaMarkers()')

	for (var i=0; i < areasData.length; i++) {
		var data = areasData[i];
		var marker = createImageMarker(
			data.latLng.split(',')[0],
			data.latLng.split(',')[1],
			selectedMode + '.png',
			data.name,
			true)
		marker.setLabel(
			getAreaMarkerLabel(areasData[i].beers.toString())
		)
		marker.setAnimation(google.maps.Animation.DROP);
		marker.rawData = areasData[i];
		areaMarkers.push(marker);

		// add the double-click event listener

		google.maps.event.addListener(areaMarkers[i], "click", function() {

			var mrks = markers;
			if (selectedMode === 'spots') {
				mrks = spotsMarkers;
			}

			var found = false;
			for (var i = 0; i < mrks.length; i++) {
				var marker = mrks[i];
				if (marker.rawData.area === this.rawData.id) {
					found = true;
				}
			}
			if (!found) {return;}

			location.hash = 'zoomed';
			initState = false;
			console.log("GroupMode started", this)
			onGroupMode = {
				zoom: beerMap.getZoom(),
				center: beerMap.getCenter()
			};

			document.getElementById('mainModeCtls').style.display = 'none';
			document.getElementById('listContainer').style.display = 'none';
			document.getElementById('groupModeCtls').style.display = 'flex';

			hideAreaMarkers();

			showAllMarkers(mrks, this.rawData.id)

			var bounds = new google.maps.LatLngBounds(this.center_, this.center_);

			for (var i = 0; i < mrks.length; i++) {
				var marker = mrks[i];
				if (marker.rawData.area === this.rawData.id) {
					bounds.extend(marker.getPosition());
				}
			}

			beerMap.panTo(bounds.getCenter());

			zoominFunc(beerMap.getZoom() + 3, 100, function() {
				setTimeout(function() {
						beerMap.fitBounds(bounds);
				}, 200)
			})()
    })


		// geografika diamerismata
		// var size = MARKER_CAP_SIZE*0.01;
		// var image = {
	  //     origin: new google.maps.Point(0, 0),
	  //     url: PINS_PATH + 'stala.png',
		// 		labelOrigin: new google.maps.Point(0,35),
	  //     // scaledSize: new google.maps.Size(60, 88), // short pin
	  //     scaledSize: new google.maps.Size(size, size), // cap
	  //     // anchor: new google.maps.Point(31, 88), // short pin
	  //     anchor: new google.maps.Point(size/2, size/2), // cap
	  //   };
		//
		// var areaLabel =  new google.maps.Marker({
    //   position: new google.maps.LatLng(data.latLng.split(',')[0], data.latLng.split(',')[1]),
    //   title: '',
		// 	icon: image,
    //   animation: null,
    //   draggable: false,
		// 	clickable: false,
		// 	label: {
		// 			color: '#753b07',
		// 			fontSize: '12px',
		// 			fontWeight: 'bold',
		// 			text:areasData[i].name,
		// 			fontFamily: "Cursive, Helvetica, Arial, Sans-Serif"
		// 		},
		// 	// icon: getImageObj('icons/pins/60x60/eza.png', MARKER_CAP_SIZE),
    //   zIndex: ZINDEX_MARKER - 1
    // });

		// areasLabels.push(areaLabel);
		// areaLabel.setMap(beerMap)



	}
}

function showAreaMarkers(type, dropTime) {


	console.log('showAreaMarkers()');
	for (var i=0; i < areaMarkers.length; i++) {
		areaMarkers[i].setMap(null);
		areaMarkers[i].setAnimation(google.maps.Animation.DROP);
		areaMarkers[i].setIcon(getImageObj(PINS_PATH + type +'.png', MARKER_CAP_SIZE, true))
		areaMarkers[i].setLabel(
			getAreaMarkerLabel(areasData[i][type].toString())
		)



		// set valid icon size
		var icon = areaMarkers[i].icon;
		icon.scaledSize.width = getMarkerResizeFactor()*icon.initWidth;
		icon.scaledSize.height = getMarkerResizeFactor()*icon.initHeight;

		icon.labelOrigin.y = icon.scaledSize.height*icon.initLabelHeigthFactor;
		icon.labelOrigin.x = icon.scaledSize.width*icon.initLabelWidthFactor;
	}


	for (var i=0; i < areaMarkers.length; i++) {
		if (areasData[i][type] === 0){
			continue;
		}
		if (dropTime) {
			dropMarker(areaMarkers[i], 100 + 150*i)
			// dropMarker(areaMarkers[i], Math.floor((Math.random() * dropTime) + 1))
		} else {
			areaMarkers[i].setMap(beerMap);
		}
	}
}
function dropMarker(marker, delay) {

	marker.setAnimation(google.maps.Animation.DROP);
	setTimeout(function() {
		marker.setMap(beerMap);
	}, delay)
}
function showAllMarkers(markers, area, animation, noLabel) {
	console.log('showAllMarkers()');

	// enable animation
	if (animation) {
		for (var i=0; i < markers.length; i++) {
			markers[i].setAnimation(animation);
			// marker.setLabel(getAreaMarkerLabel(marker.rawData.beers, ''))
			markers[i].setLabel(null);
		}
	}

	// show markers
	var festIds = [4, 9, 10, 11, 13, 20, 22, 27, 37, 43, 47];
	var check = false;
	if (area == -1) {check = true; area = null}
	for (var i=0; i < markers.length; i++) {
		if (check) {
			console.log('--1111', i)
			var found = false;
			for (j=0; j < festIds.length;j++) {
				if (festIds[j]-1==i) {
					console.log('found')
					found = true;
					break;
				}

			}
			if (!found) {console.log("continur"); continue;}
		}
		if (!area || (area === markers[i].rawData.area) ) {
			console.log("mpike")
			markers[i].setLabel(null);
			if (!noLabel && selectedMode !== "spots") {markers[i].setLabel(getAreaMarkerLabel(markers[i].rawData.beers.toString() + ' ' + languages[curLang]['words']['beersLabel']))};
			if (selectedMode === 'spots') {
				markers[i].setLabel(getAreaMarkerLabel(markers[i].rawData.name))
			}
			// markers[i].setMap(beerMap);
			if (animation) {
					dropMarker(markers[i], Math.floor((Math.random() * 2000) + 1));
			} else {
				markers[i].setMap(beerMap);
			}

		}
	}

	// switch of animation
	if (animation) {
		setTimeout(function() {
			for (var i=0; i < markers.length; i++) {
				markers[i].setAnimation(null);
			}
		}, 2000)
	}
}


function hideAreaMarkers() {
	areaMarkersHiden = true;
	console.log('hideAreaMarkers()')
	for (var i=0; i < areaMarkers.length; i++) {
		areaMarkers[i].setMap(null);
	}
}
console.log('hideAreaMarkers()');
function hideAllMarkers() {
	// if (allMarkersHiden) {return;}
	allMarkersHiden = true;
	console.log('hideAllMarkers()')
	for (var i=0; i < markers.length; i++) {
		markers[i].setMap(null);
	}

	for (var i=0; i < spotsMarkers.length; i++) {
		spotsMarkers[i].setMap(null);
	}
}

function parseRawData() {

}
function createXMarker(lat, log) {

    var position = new google.maps.LatLng(lat, log);

    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.

    var image = {
      origin: new google.maps.Point(0, 0),
      url: 'icons/pins/x.png',
      scaledSize: new google.maps.Size(20, 20),
      anchor: new google.maps.Point(10, 10),
    };

    // todo: set coords
    var shape = {
      coords: [1, 1, 1, 45, 45, 45, 45, 1],
      type: 'poly'
    };

    var marker = new google.maps.Marker({
      position: position,
      title: 'X',
      animation: null,
      draggable: false,
      shape: shape,
      icon: image,
      zIndex: 10
    });

    return marker;
}

function convertFromLatLngToPoint(latlng, map, elementContainingMap){

  var worldMapWidth = 256*map.getZoom();

  var mapWidth = elementContainingMap.clientWidth ;
  var mapHeight = elementContainingMap.clientWidth ;

  var mapLonRight = map.getBounds().getNorthEast().lng();
  var mapLonLeft = map.getBounds().getSouthWest().lng();
  var mapLonDelta= mapLonRight-mapLonLeft;

  var mapLatBottom = map.getBounds().getSouthWest().lat();
  var mapLatBottomDegree = mapLatBottom * Math.PI / 180;

  var longitude = latlng.lng();
  var latitude = latlng.lat();

  var x = (longitude - mapLonLeft) * (mapWidth / mapLonDelta);

  latitude = latitude * Math.PI / 180;
  worldMapWidth = ((mapWidth / mapLonDelta) * 360) / (2 * Math.PI);
  var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
  var y = mapHeight - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitude)) / (1 - Math.sin(latitude)))) - mapOffsetY);



  return [x,y];
}

function getBounds(markers) {
	console.log("fiBounds()")
	var bounds = new google.maps.LatLngBounds(0,0);
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i];
		bounds.extend(marker.getPosition());
	}
	return bounds;
}
function fitBounds(markers) {
	console.log("fitBounds()")
	var bounds = new google.maps.LatLngBounds(0,0);
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i];
		bounds.extend(marker.getPosition());
	}
	beerMap.panTo(bounds.getCenter());
	beerMap.fitBounds(bounds);
	// zoominFunc(beerMap.getZoom() + 3, 100, function() {
	// 	setTimeout(function() {
	// 			beerMap.fitBounds(bounds);
	// 	}, 200)
	// })()


}
function getImageObj(url, size, factor) {
	if (!factor) {
		factor = 1
	} else {
		factor = 1.1
	}

	var vf = 0.84;
	var hf = 0.19;
  var image = {
      origin: new google.maps.Point(0, 0),
      url: url,
			labelOrigin: new google.maps.Point(size*hf,size*factor*vf),
      // scaledSize: new google.maps.Size(60, 88), // short pin
      scaledSize: new google.maps.Size(size, size*factor), // cap
      // anchor: new google.maps.Point(31, 88), // short pin
      anchor: new google.maps.Point(size/2, size*factor/2), // cap
    };

		image.initHeight = size*factor;
		image.initWidth = size;

		image.initLabelHeigthFactor = vf;
		image.initLabelWidthFactor = hf;
  return image;
}
var tempPinCounter = 1;
function createImageMarker(lat, log, imageUrl, legend, areaLabel, factor) {

    var position = new google.maps.LatLng(lat, log);

    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.

    // imageUrl = 'sknipa-min.png'
    // todo: set coords
    var shape = {
      coords: [1, 1, 1, 80, 80, 80, 80, 1],
      type: 'poly'
    };

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, log),
      title: legend,
      animation: null,
      draggable: false,
      shape: shape,
			clickable: true,
      icon: getImageObj(PINS_PATH + imageUrl, MARKER_CAP_SIZE, factor),
			// icon: getImageObj('icons/pins/60x60/eza.png', MARKER_CAP_SIZE),
      zIndex: ZINDEX_MARKER
    });


    return marker;
}


//Function that loads the map markers.
// markersRaw = markersRaw.slice(1,1)
var lines = [];
function loadMapMarkers (markersRaw, markers){
	for(var i=0; i < markersRaw.length; i++) {
    // console.log(markersRaw[i].lat, markersRaw[i].log)
		// markers.push(createXMarker(markersRaw[i].lat, markersRaw[i].log));

    var lat = markersRaw[i].lat;
    var log = markersRaw[i].log;

    var marker = createImageMarker(lat, log, markersRaw[i].icon, markersRaw[i].name['en'])
    marker.rawData = markersRaw[i];
    markers.push(marker);

    marker.setMap(beerMap);

    // MARKERS EVENT HANDLERS
    google.maps.event.addListener(markers[i], "mouseover", function() {
            // showPinPreview(this)
            return
           this.setIcon(
            getImageObj(this.getIcon().url, MARKER_CAP_SIZE*MARKER_CAP_HOVER_FACTOR)
            );
           this.setZIndex(ZINDEX_MARKER + 1);});
    google.maps.event.addListener(markers[i], "mouseout", function() {
       // marker.setIcon(this.icon);
       // hidePinPreview()
       return;
       function test(that) {
        function callback(){

          that.setIcon(
            getImageObj(that.getIcon().url, get_new_cap_size())
            )

          that.setZIndex(ZINDEX_MARKER);
        }
        return callback

       };
       setTimeout(test(this), 1000);


     });
    google.maps.event.addListener(markers[i], "click", function() {
			setInfoModalValues(this);
			$('#beerInfoModal').modal();
      // x.style.display = "none"
      curOpenedPin = this;



      var latLng = new google.maps.LatLng(this.rawData.lat, this.rawData.log)
      // beerMap.setCenter(latLng);
      // beerMap.setZoom(MAX_ZOOM)

      // var contentString = '<div id="content">'+
      //           '<div id="bodyContent">'+
      //           '<a target="_blank" href="'+this.rawData.infoUrl+'">info</a> <br>'+
      //           '<a target="_blank" href="'+this.rawData.mapUrl+'">Navigate</a>'+
      //           '</div>';
      //
      // var infowindow = new google.maps.InfoWindow({
      //   content: contentString
      // });
      // infowindow.open(beerMap, this)
    });}

	for (i=0; i < markers.length; i ++) {
		markers[i].setMap(beerMap)
	}
}

function initControlsState() {
	selectedMode = 'beers';
	selectedMode = 'brews';
	state = 'area';
	initState = true;

	// setTimeout(function(){
		// showAreaMarkers(selectedMode)
	// }, 10000)
	// markerClusters.clearMarkers();
	// showMarkers(selectedType);
	// beerMap.maxZoom = MAX_ZOOM_CLUSTERS;
	// showClusters();

}

function showClusters() {

	markerClusters.clearMarkers();
	for (var i=0; i < markers.length; i++) {
		console.log("Show Clusters")
		markerClusters.addMarker(markers[i], true);
	}
	// markerClusters.redraw();


}
function setVisibleMarkers(isVisible) {
	for (var i=0; i < markers.length; i+=1) {
			markers[i].setVisible(isVisible);

	}
}

function setMapMarkers(value) {
	for (var i=0; i < markers.length; i+=1) {
			markers[i].setMap(value);
	}
}

function showMarkers(animation) {
	for (var i=0; i < markers.length; i++) {
		markers[i].setAnimation(animation)
	}

	setTimeout(function() {
		for (var i=0; i < markers.length; i+=3) {
			var marker =  markers[i];
			if (!marker.map){
				marker.setMap(beerMap);
			}
		}
	}, 400)

	setTimeout(function() {
		for (var i=1; i < markers.length; i+=3) {
			var marker =  markers[i];
			if (!marker.map){
				marker.setMap(beerMap);
			}
		}
	}, 200)

	setTimeout(function() {
		for (var i=2; i < markers.length; i+=3) {
			var marker =  markers[i];
			if (!marker.map){
				marker.setMap(beerMap);
			}
		}
	}, 300)

	// wait the above delays and then remove animation
	if (animation) { // in case not null animation
		setTimeout(function() {
			for (var i=0; i < markers.length; i++) {
				markers[i].setAnimation(null)
			}
		}, 800)
	}


}

function setWordingListItem(a, pinRawData) {

	a.getElementsByTagName('h6')[0].innerHTML = pinRawData.name[curLang];
	a.getElementsByTagName('p')[0].innerHTML = pinRawData.city[curLang];
	a.getElementsByTagName('small')[0].innerHTML = languages[curLang]['words']['since'] + " " + pinRawData.yearCreated;
	a.getElementsByTagName('small')[1].innerHTML = pinRawData.numberOfBeers + " " + languages[curLang]['words']['beers'];

}
function setSearchList() {


  var list = document.getElementById("searchlist");

  for (var i=0; i < markersRaw.length; i++) {
		var a = document.getElementById("templateListItem").cloneNode(true);

		setWordingListItem(a, markersRaw[i]);

		a.getElementsByTagName('img')[0].src = PINS_PATH + markersRaw[i].icon
		a.setAttribute("id", "item-" + i.toString()); // added line
		a.setAttribute("onclick", "onClickListItem("+i+")")
		list.appendChild(a);

		a.classList.remove("d-none");
		document.getElementById("item-" + i.toString()).classList.add("d-flex");
	}
}
function updateSearchList() {
	// return;
	console.log("SEARCHING....")
	var key = document.getElementById("searchbox").value;

	if ( key === "") {
		// document.getElementById('searchbox-cancel').style.display = 'none';
		for (var i=0; i < markersRaw.length; i++) {
			document.getElementById("item-" + i.toString()).classList.remove("d-none");
			document.getElementById("item-" + i.toString()).classList.add("d-flex");

			// console.log(document.getElementById("item-" + i.toString()).style.display)
		}
	} else {
		// document.getElementById('searchbox-cancel').style.display = 'inline-block';
		for (var i=0; i < markersRaw.length; i++) {

			var matches = normalizeKey(
				markersRaw[i].name[curLang] + markersRaw[i].city[curLang] + markersRaw[i].beerNamesKey[curLang]
			).search(normalizeKey(key)) != -1;

			if (matches) {
				document.getElementById("item-" + i.toString()).classList.remove("d-none");
				document.getElementById("item-" + i.toString()).classList.add("d-flex");
			} else {
				document.getElementById("item-" + i.toString()).classList.remove("d-flex");
				document.getElementById("item-" + i.toString()).classList.add("d-none");
			}
		}
	}

}
function normalizeKey(key) {
	return key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
function closeSearchBox() {
	var searchBox = document.getElementById("searchbox");


	searchBox.value = '';
	updateSearchList();

	document.getElementById("searchbox-cancel").style.display = "none";
	document.getElementById("searchlist").style.display = "none";
	searchBox.classList.remove("searchbox-focus");
	// searchbox.style.backgroundImage = "url('images/view-list.png')";
}

function onKeyupSearcBox() {

	updateSearchList();

}
function onSearchboxFocus() {
	window.location.hash = '#searchbox';
	document.getElementById('introBtnCol').style.display = 'none';
	var searchBox = document.getElementById("searchbox");

	if ( !searchBox.classList.contains('searchbox-focus') ) {
		// fist click on searchBox

		// searchbox.style.backgroundImage = "url('images/magnify.png')";
		searchBox.blur();
		searchBox.classList.add("searchbox-focus");
	}

	document.getElementById("searchlist").style.display = "block";
	setTimeout(function() {
		document.getElementById("searchbox-cancel").style.display = "inline-block";
	}, 400)

}


function onSearchBoxClearClick() {
	if (location.hash === '#searchbox') {
			window.history.back();
	}

	console.log("onSearchBoxClearClick");
	var searchBox = document.getElementById("searchbox");

	/////// functionality //////
	/// only to close the search box panel
	/// remove if you want to clear text with first clicked
	/// and close panel with the second click
	searchBox.value = '';
	closeSearchBox();
	setTimeout(function() {
		document.getElementById('introBtnCol').style.display = 'block';
	}, 200);
	return;
}

function openInNewTab(url) {

  var win = window.open(url, '_blank');
  win.focus();
}

function setInfoModalValues(pin) {

	curOpenedPin = pin;

  document.getElementById("infoModalImg").src= LOGO_PATH + pin.rawData.icon;
  document.getElementById("infoModalTitle").innerHTML= pin.rawData.name[curLang] || pin.rawData.name;
  document.getElementById("infoModalCity").innerHTML= pin.rawData.city[curLang] || pin.rawData.city;


  document.getElementById("infoModalWebBtn").style.display = !pin.rawData.webUrl || pin.rawData.webUrl === '' ? 'none' : 'inline-block';
	document.getElementById("infoModalFbBtn").style.display = !pin.rawData.fbUrl || pin.rawData.fbUrl === '' ? 'none' : 'inline-block';
	document.getElementById("infoModalTelBtn").style.display = !pin.rawData.tel || pin.rawData.tel === '' ? 'none' : 'inline-block';


	var list = document.getElementById("beerList");

	var listItems = list.getElementsByTagName('li');
	var found = false;
	for (var i=0; i < listItems.length; i++) {
		console.log("items",listItems[i]);
		if (listItems[i].getAttribute('id').search(pin.rawData.id + "-") !== -1) {
			found = true;
			console.log("found")
			listItems[i].style.display = 'flex';
		} else {
			console.log('hide', listItems[i])
			listItems[i].style.display = 'none';
		}
	}
	if (!found) {
		for (var i=0; i < pin.rawData.beerNames[curLang].length; i++) {

			var li = document.getElementById("beerItemTemplate").cloneNode(true);
			li.style.display = 'flex';

			li.getElementsByTagName('h6')[0].innerHTML = pin.rawData.beerNames[curLang][i];// " Lager 330lt";
		// 	a.getElementsByTagName('img')[0].src = PINS_PATH + markersRaw[i].icon
			li.setAttribute("id", pin.rawData.id + "-" + i.toString()); // added line
		// 	a.setAttribute("onclick", "onClickListItem("+i+")")
			list.appendChild(li);
		//
		// 	a.classList.remove("d-none");
		// 	document.getElementById("item-" + i.toString()).classList.add("d-flex");
		}
	}

}

function hidePinPreview() {
  var prv = document.getElementById("over-map");
  prv.style.display = "none";

  var back = document.getElementById("cboxOverlay");
  back.style.display = 'none';
}

function get_new_cap_size() {
  var currentZoom = beerMap.getZoom();

	if (currentZoom >= 12) return MARKER_CAP_SIZE*2.2;
  if (currentZoom >= 11) return MARKER_CAP_SIZE*2;
  if (currentZoom >= 10) return MARKER_CAP_SIZE*1.8;
	if (currentZoom >= 9) return MARKER_CAP_SIZE*1.6;
	if (currentZoom >= 8) return MARKER_CAP_SIZE*1.4;
	if (currentZoom >= 7) return MARKER_CAP_SIZE*1.2;
	if (currentZoom >= 6) return MARKER_CAP_SIZE*1;
  return MARKER_CAP_SIZE;
}

function getMarkerResizeFactor() {
	if (!beerMap) {return 1;}
  var currentZoom = beerMap.getZoom();

	// if (currentZoom >= MAX_ZOOM ) return 0.;
  if (currentZoom >= 11) return 2;
  if (currentZoom >= 10) return 1.8;
	if (currentZoom >= 9) return 1.6;
	if (currentZoom >= 8) return 1.4;
	if (currentZoom >= 7) return 1.2;
	if (currentZoom >= 6) return 1;
	if (currentZoom >= 5) return 0.8;
  return 1;
}

function updateMarkersSize() {

  var currentZoom = beerMap.getZoom();

  // we need resize the caps according to new zoom level
  // maybe we will not resize them
  var newCapSize = get_new_cap_size();
  if (currentCapSize != newCapSize) {
    currentCapSize = newCapSize;
    for (var i=0; i < markers.length; i++) {
      markers[i].setIcon(
        getImageObj(markers[i].getIcon().url, newCapSize)
      );
    }
  }
}

// -------------------------- CLUSTERS -----------------
function loadClusters() {


  function getOffset() {

    var z = beerMap.getZoom();

    if (z == 6) {
      return 1.5;
    }

    if (z == 7) {
      return 0.75;
    }

    if (z == 8) {
      return 0.4;
    }

    if (z == 9){
      return 0.2;
    }

    if (z == 10) {
      return 0.1;
    }

    if (z == 11) {
      return 0.05;
    }

  }



  var testMarkers = [];
  var options = {
								cssClass: 'custom-pin',
								maxZoom: MAX_ZOOM_CLUSTERS ,
								gridSize: 70,
								averageCenter: true,
								zoomOnClick: false,
								minimumClusterSize: 1,
								onMouseoverCluster: function (clusterIcon, event) {
									return;
                  // console.log(clusterIcon.cluster_.markers_, event)
                  console.log("mouse in", clusterIcon.cluster_.markers_[0]);

                  for(let i=0; i < clusterIcon.cluster_.markers_.length; i++) {
                    var curMarker = clusterIcon.cluster_.markers_[i]
                    testMarkers.push(createImageMarker(
                      clusterIcon.cluster_.center_.lat()+getOffset() + 0.7*getOffset()*Math.floor(i/5),
                      clusterIcon.cluster_.center_.lng()-2*getOffset() + getOffset()*(i%5),
                      curMarker.icon.url.split('/')[curMarker.icon.url.split('/').length - 1])
                    );

                    testMarkers[i].setMap(beerMap);
                  }

                  // for(let i=0; i < markerCluster.clusters_.length; i++ ) {
                  //   markerCluster.clusters_[i].setMap(null)
                  // }
                  // markerCluster.clusters_[0].markerClusterer_.setMap(null)


                },
                onMouseoutCluster: function (clusterIcon, event) {
									return;
                  console.log("mouse out");

                  for(let i=0; i < testMarkers.length; i++) {
                    testMarkers[i].setMap(null);
                  }
                  testMarkers = []
                },
								onClickCluster: function(clusterIcon, event) {
									console.log("nai reee")
								}
              };


  markerClusters = new MarkerClusterer(beerMap, [], options);
	google.maps.event.addListener(markerClusters, 'clusterclick', function(cluster) {
    // SET GROUP MODE situation  GROUP MODE
		onGroupMode = beerMap.getZoom();
		document.getElementById('mainModeCtls').style.display = 'none';
		document.getElementById('listContainer').style.display = 'none';
		document.getElementById('groupModeCtls').style.display = 'flex';
		beerMap.setOptions({maxZoom: MAX_ZOOM});
		setVisibleMarkers(false)
		for (var i=0; i < cluster.getMarkers().length; i++) {
			cluster.getMarkers()[i].setVisible(true)
		}
		// hide clusters with the above trick
		markerClusters.maxZoom_ = 1;

		beerMap.panTo(cluster.center_);
		var bounds = cluster.getBounds();





		// zoomCtrLocked = true;
		zoominFunc(beerMap.getZoom() + 4, 100, function() {
			setTimeout(function() {

					beerMap.fitBounds(bounds);
					zoomCtrLocked = false;
					// beerMap.draggable = false
						// beerMap.setOptions({draggable: false});
					// beerMap.maxZoom = MAX_ZOOM_CLUSTERS;
					// beerMap.minZoom = beerMap.getZoom();
			}, 500)
		})()


		return;
		// hide all markers
		for (var j=0; j < markers.length; j++) {
			markers[j].setVisible(false)
		}

		// animate markers
		for (var i=0; i < cluster.getMarkers().length; i++) {
			var marker = cluster.getMarkers()[i];
			marker.setVisible(true); // set to hide before
			marker.setAnimation(google.maps.Animation.BOUNCE)
			setTimeout(function(marker) {
				return function() {
					marker.setAnimation(null)
					for (var j=0; j < markers.length; j++) {
						markers[j].setVisible(true)
					}
				}
			}(marker), 3000)
		}

		beerMap.panTo(cluster.center_);

		zoominFunc(MAX_ZOOM_CLUSTERS, 20, function() {

			setTimeout(function(){
					// beerMap.fitBounds(cluster.getBounds())
			}, 100)


		})();


});
}

// -------------------------- EVENT HANDLERS -------------
function updataMarkersSize() {
	for (var i=0; i < markers.length; i++) {

		if (beerMap.getZoom() === MAX_ZOOM) {
				markers[i].icon__ = markers[i].icon;
				markers[i].setIcon(null);
		} else {
			if(!markers[i].icon){
				markers[i].setIcon(markers[i].icon__)
			}

			var icon = markers[i].icon;
			icon.scaledSize.width = getMarkerResizeFactor()*icon.initWidth;
			icon.scaledSize.height = getMarkerResizeFactor()*icon.initHeight;

			icon.labelOrigin.y = icon.scaledSize.height*1.1;
			icon.labelOrigin.x = icon.scaledSize.width*0.5;
		}

	}

	for (var i=0; i < spotsMarkers.length; i++) {

		if (beerMap.getZoom() === MAX_ZOOM) {
				spotsMarkers[i].icon__ = spotsMarkers[i].icon;
				spotsMarkers[i].setIcon(null);
		} else {
			if(!spotsMarkers[i].icon){
				spotsMarkers[i].setIcon(spotsMarkers[i].icon__)
			}

			var icon = spotsMarkers[i].icon;
			icon.scaledSize.width = 0.5*getMarkerResizeFactor()*icon.initWidth;
			icon.scaledSize.height = 0.5*getMarkerResizeFactor()*icon.initHeight;

			icon.labelOrigin.y = icon.scaledSize.height*1.1;
			icon.labelOrigin.x = icon.scaledSize.width*0.5;
		}

	}

	for (var i=0; i < areaMarkers.length; i++) {
		var icon = areaMarkers[i].icon;
		icon.scaledSize.width = getMarkerResizeFactor()*icon.initWidth;
		icon.scaledSize.height = getMarkerResizeFactor()*icon.initHeight;

		icon.labelOrigin.y = icon.scaledSize.height*icon.initLabelHeigthFactor;
		icon.labelOrigin.x = icon.scaledSize.width*icon.initLabelWidthFactor;

		var label = areaMarkers[i].getLabel();
		label.fontSize = (fontSize*getMarkerResizeFactor()).toString() + 'px';

		areaMarkers[i].setLabel(label)
	}
}
function onZoomChanged() {
	updataMarkersSize();

}
// ------------------------- MAP STYLE ---------------------
function loadStyledMap() {

  var styledMapType = new google.maps.StyledMapType(map_style);

  beerMap.mapTypes.set('styled_map', styledMapType);
  beerMap.setMapTypeId('styled_map');
}

// ------------------------- BANNER ----------------------------
//Function that creates the control panel area, ie. the map title and the 2 buttons just beneath it.
function loadBanner() {


  function createControlPanel (controlPanelDiv){
   controlPanelDiv.style.padding = '0px';
   controlUI = document.createElement('div');
   controlUI.style.border='0px solid white';
   controlUI.style.margin='10px';
   controlUI.style.paddingTop='11px';
   controlUI.style.paddingBottom='5px';
   controlUI.style.paddingLeft='0px';
   controlUI.style.paddingRight='0px';
   controlUI.style.width='245px';
   controlUI.style.height='419px';
   controlPanelDiv.appendChild(controlUI);

   //Map title
   titleBar = document.createElement('div');
   titleBar.style.backgroundColor = '#89CBED';
   titleBar.style.height='255px';
   titleBar.style.width='245px';
   titleBar.style.marginTop='0px';
   titleBar.style.marginBottom='0px';
   titleBar.style.marginLeft='0px';
   titleBar.style.marginRight='0px';
   titleBar.style.paddingTop='6px';
   titleBar.style.paddingBottom='2px';
   titleBar.style.paddingLeft='0px';
   titleBar.style.paddingRight='0px';
   titleBar.style.borderTopLeftRadius='5px';
   titleBar.style.borderTopRightRadius='5px';
   titleBar.style.borderBottomLeftRadius='0px';
   titleBar.style.borderBottomLeftRadius='0px';
   titleBar.style.cssFloat='left';
   titleBar.innerHTML = '<div align="center"><img src="icons/map_title.png" width="230" height="252" border="0"/></div>';
   controlUI.appendChild(titleBar);

   yellowStripe = document.createElement('div');
   yellowStripe.style.backgroundColor = '#FFFF00';
   yellowStripe.style.height='2px';
   yellowStripe.style.width='245px';
   yellowStripe.style.marginTop='3px';
   yellowStripe.style.marginBottom='3px';
   yellowStripe.style.marginLeft='0px';
   yellowStripe.style.marginRight='0px';
   yellowStripe.style.paddingTop='0px';
   yellowStripe.style.paddingBottom='0px';
   yellowStripe.style.paddingLeft='0px';
   yellowStripe.style.paddingRight='0px';
   yellowStripe.style.cssFloat='left';
   yellowStripe.style.fontFamily='Georgia, serif';
   yellowStripe.style.fontSize='14px';
   controlUI.appendChild(yellowStripe);

   //'Smaller' events button.
   smallEvents = document.createElement('div');
   smallEvents.style.height='108px';
   smallEvents.style.width='129px';
   smallEvents.style.marginTop='0px';
   smallEvents.style.marginBottom='0px';
   smallEvents.style.marginLeft='0px';
   smallEvents.style.marginRight='0px';
   smallEvents.style.paddingTop='0px';
   smallEvents.style.paddingBottom='2px';
   smallEvents.style.paddingLeft='0px';
   smallEvents.style.paddingRight='0px';
   smallEvents.style.cssFloat='left';
   smallEvents.innerHTML = '<div align="center" onClick="handleRequests(\'small_events\')" OnMouseOver="this.style.cursor=\'pointer\';" OnMouseOut="this.style.cursor=\'default\';"><img src="icons/button_small_event.png" width="128" height="107" border="0"/></div>';
   controlUI.appendChild(smallEvents);

   //Umbrella button
   brolly = document.createElement('div');
   brolly.style.height='149px';
   brolly.style.width='94px';
   brolly.style.marginTop='0px';
   brolly.style.marginBottom='0px';
   brolly.style.marginLeft='0px';
   brolly.style.marginRight='0px';
   brolly.style.paddingTop='0px';
   brolly.style.paddingBottom='2px';
   brolly.style.paddingLeft='0px';
   brolly.style.paddingRight='0px';
   brolly.style.cssFloat='left';
   brolly.innerHTML = '<div align="center" onClick="handleRequests(\'rainfall\')" OnMouseOver="this.style.cursor=\'pointer\';" OnMouseOut="this.style.cursor=\'default\';"><img src="icons/button_brolly.png" width="93" height="148" border="0"/></div>';
   controlUI.appendChild(brolly);

  }
	function createResetButton (resetButtonDiv){
	 resetButtonDiv.style.padding = '0px';
	 controlUI2 = document.createElement('div');
	 controlUI2.style.backgroundColor = '#ffffff';
	 controlUI2.style.borderRadius='5px';
	 controlUI2.style.margin='10px';
	 controlUI2.style.paddingTop='2px';
	 controlUI2.style.paddingBottom='2px';
	 controlUI2.style.paddingLeft='2px';
	 controlUI2.style.paddingRight='5px';
	 controlUI2.style.textAlign='center';
	 controlUI2.style.width='148px';
	 controlUI2.style.height='31px';
	 controlUI2.innerHTML = '<div onClick="handleRequests(\'reset\')" OnMouseOver="this.style.cursor=\'pointer\';" OnMouseOut="this.style.cursor=\'default\';" ><img src="icons/button_reset.png" width="148" height="31" border="0"/></div>';
	 resetButtonDiv.appendChild(controlUI2);
	}


  var controlPanelDiv = document.createElement('div');
  var beerMapControlPanel = new createControlPanel(controlPanelDiv);

	var resetDiv = document.createElement('div');
	var beerMapResetButton = new createResetButton(resetDiv);



  //Add the control panel and reset button (created previously) to the map.

  // beerMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(controlPanelDiv);
	// beerMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(resetDiv);

	// beerMap.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById('controls'));

}


//Function that creates the 'Reser map' button.


//Function that is called when either the 'smaller events', unbrella or the 'reset map' buttons are clicked.

// $ = jQuery;
function drinkToggle(event,n) {

	var cl = 'rgb(236, 159, 37)';
	var btn = event.target;
	var col = event.target.parentElement.parentElement.getElementsByTagName('i');
	// console.log(event.target.parentElement)

	var voted = 0
	for (var i=0 ; i < col.length; i ++) {
		console.log(col[i].style.color)
		if (col[i].style.color === cl) {
			voted++;
		}
	}

	console.log(voted);
	for (var i=0 ; i < col.length; i ++) {
		console.log(i,n)

		if (voted == n) {
			col[i].style.color = 'grey';
			continue;
		}

		if (i+1 <= n) {
			console.log("mpike")
			col[i].style.color = cl;
		} else {
			col[i].style.color = 'grey';
		}
	}

		$.getJSON('https://ipapi.co/json/', function(data) {
		var li = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
		var results = {
			ip: data.ip,
			city: data.city,
			country: data.country,
			longitude: data.longitude,
			latitude: data.latitude,
			beerId: li.getAttribute('id')
		}
	  console.log(JSON.stringify(data, null, 2));

		$.ajax({
		    type: 'POST',
		    url: 'http://138.68.180.1:3000/api',
		    data: JSON.stringify (results),
		    success: function(data) { alert('Vote Confirmed'); },
		    contentType: "application/json",
		    dataType: 'json'
		});
	});



}
//
function closeIntroModal() {

	console.log("closeIntroModal")
	if (firstOpen) {

			//////    DEBUG MODE
			// var bounds = getBounds(areaMarkers);
			// showAreaMarkers(selectedMode, 2000);
			// beerMap.fitBounds(bounds);
			// MIN_ZOOM = 4;
			// beerMap.minZoom = 4;
			// INITIAL_ZOOM = beerMap.getZoom();
			// INITIAL_CENTER = beerMap.getCenter();
			// document.getElementById('mainModeCtls').style.display = 'flex';
			// document.getElementById('listContainer').style.display = 'block';
			// document.getElementById('groupModeCtls').style.display = 'none';
			// firstOpen = false;
			//////    DEBUG MODE


		setTimeout(function() {
			var bounds = getBounds(areaMarkers);
			showAreaMarkers(selectedMode, 2000);
			// beerMap.panTo(bounds.getCenter());

				// beerMap.setZoom(beerMap.getZoom() + 1);
			setTimeout(function() {
					beerMap.fitBounds(bounds);
					MIN_ZOOM = 4;
					beerMap.minZoom = 4;
					INITIAL_ZOOM = beerMap.getZoom();
					INITIAL_CENTER = beerMap.getCenter();
					setTimeout(function() {
						document.getElementById('mainModeCtls').style.display = 'flex';
						document.getElementById('listContainer').style.display = 'block';
						document.getElementById('groupModeCtls').style.display = 'none';
					}, 1000)


			},2000)




			// backBtnHandle();
			firstOpen = false;
		}, 500)

	}
	if (location.hash === '#intro') {
			window.history.back();
	}

	$('#introModal').modal('hide');
}


// window.onbeforeunload = function() { console.log("Your work will be lost.")};

function zoominFunc(endZoomIn, delayZoom, execFun) {
	return function zoomin() {
		console.log("end zoom", endZoomIn)
		console.log("current zoom", beerMap.getZoom())
		if (beerMap.getZoom() < endZoomIn) {
			console.log("zooming in")

			var z = google.maps.event.addListener(beerMap, 'zoom_changed', function(event){
					google.maps.event.removeListener(z);
					zoomin();
			});
			setTimeout(function(){beerMap.setZoom(beerMap.getZoom() + 1)}, delayZoom); // 80ms is what I found to work well on my system -- it might not work well on all systems

		} else {
			execFun();
		}
	}
}

function zoomoutFunc(endZoomOut, delayZoom, execFun) {

	return function zoomout() {
		if (beerMap.getZoom() > endZoomOut) {
			console.log("zooming out")
			beerMap.setZoom(beerMap.getZoom() - 1)
			setTimeout(zoomout, delayZoom)
		} else {
			execFun();
		}
	}
}

function onClickListItem(id) {

	location.hash = '#zoomed';
	initState = false;
	overrideSearchboxHash = true;

	document.getElementById('introBtnCol').style.display = 'block';

	var latLng = new google.maps.LatLng(markers[id].rawData.lat, markers[id].rawData.log)

	closeSearchBox();
	document.getElementById('mainModeCtls').style.display = 'none';
	document.getElementById('listContainer').style.display = 'none';
	document.getElementById('groupModeCtls').style.display = 'flex';

	hideAreaMarkers();

	setTimeout(function() {

		var delayZoom = 100;
		var endZoomOut = 6
		var endZoomIn = 11
		var firstDelay = 1200;

		if (beerMap.getZoom() <= endZoomOut) {
			firstDelay = 10;
		}
		zoomoutFunc(endZoomOut, delayZoom, function() {
			setTimeout(function() {
				markers[id].setAnimation(google.maps.Animation.DROP)
				markers[id].setMap(beerMap);
				beerMap.panTo(latLng);
				setTimeout(function() {
					zoominFunc(endZoomIn, delayZoom, function() {
						setTimeout(function() {
							setInfoModalValues(markers[id]);
							$('#beerInfoModal').modal();
							location.hash = '#modal';
						}, 1200)
					})();
				}, 1200)
			}, firstDelay)
		})();


	}, 500)

}

function openIntroModal() {
	// return;
	$('#introModal').modal();
	location.hash = "#intro";
	document.getElementById("introModal").addEventListener("touchstart", function(e) {
		// closeIntroModal();
		console.log("Touchstart")
	}, false);

	var beersNum = 0;
	for (var i=0 ;i < areaMarkers.length; i ++){
		beersNum += areaMarkers[i].rawData.beers;
	}

	// return;
	var delay = 2000;
	var brewsNum = markers.length;
	var microNum = 47;


	function adjustThbFontSize() {
	    var w = window.innerWidth;
			var thubs = document.getElementsByClassName("thumbnail");

			var fontSize;
			if (w >= 540) {
				fontSize = '65px';
			} else if (w >= 440) {
				fontSize = '55px';
			} else if (w >= 340) {
				fontSize = '45px';
			} else if (w >= 290) {
				fontSize = '40px';
			}
			else {
				fontSize = '30px';
			}

			y1 = 65;
			y2 = 30;
			x1 = 540;
			x2 = 240;


			if (w >= 540) {
				 fontSize = '65px';
			} else
			{
				y = (y1 - y2)/(x1 - x2)*(w - x2) + y2
				fontSize = Math.round(y).toString() + 'px';
			}
			thubs[0].style.fontSize = fontSize;
			thubs[1].style.fontSize = fontSize;
			// thubs[2].style.fontSize = fontSize;
	}

	adjustThbFontSize()


	document.getElementById("allNumber").innerHTML = 0;
	// var int1 = setInterval(function() {
			var num = Number(document.getElementById("allNumber").innerHTML);

			if (num == brewsNum) {
				window.clearInterval(int1);
			} else {
				num = num +1;
				document.getElementById("allNumber").innerHTML = num.toString();
			}


	// }, delay/brewsNum)

	document.getElementById("clientNumber").innerHTML = 0;
	// var int2 = setInterval(function() {
			var num = Number(document.getElementById("clientNumber").innerHTML);

			if (num == beersNum) {

				window.clearInterval(int2);
			} else {
				num = num +1;
				document.getElementById("clientNumber").innerHTML = num.toString();
			}

	// }, delay/beersNum)
	document.getElementById("allNumber").innerHTML = brewsNum.toString();
	document.getElementById("clientNumber").innerHTML = beersNum.toString();
	// document.getElementById("microNumber").innerHTML = 0;
	// var int3 = setInterval(function() {
	// 		var num = Number(document.getElementById("microNumber").innerHTML);
	//
	// 		if (num == microNum) {
	//
	// 			window.clearInterval(int3);
	// 		} else {
	// 			num = num +1;
	// 			document.getElementById("microNumber").innerHTML = num.toString();
	// 		}
	//
	// }, delay/microNum)
}
function resetZindexes() {
	console.log("Reset z indexed. check guides")
}
function backBtnHandle () {
	console.log("backBtnHandle")


	if (!initState) {
		setTimeout(function() {
			zoomoutFunc(INITIAL_ZOOM, 100, function() {
					fitBounds(areaMarkers);
					initState = true;
					hideAllMarkers();
					setTimeout(hideAllMarkers, 1000);
					showAreaMarkers(selectedMode);

					// show again main controrls
					document.getElementById('mainModeCtls').style.display = 'flex';
					document.getElementById('listContainer').style.display = 'block';
					document.getElementById('groupModeCtls').style.display = 'none';

			})()
		}, 100)

	}



	onGroupMode = null;
}
function handleRequests (buttonPressed) {
	console.log("handleRequests.")
	if (buttonPressed === 'showBeers') {
		document.getElementById('beersMode').classList.add('mode-checked')
		document.getElementById('brewsMode').classList.remove('mode-checked')
		document.getElementById('spotsMode').classList.remove('mode-checked')
		if (selectedMode !== 'beers') {
				selectedMode = 'beers';
				hideAllMarkers();
				showAreaMarkers(selectedMode);
		}
	} else if (buttonPressed === "showBrews") {
		document.getElementById('beersMode').classList.remove('mode-checked')
		document.getElementById('brewsMode').classList.add('mode-checked')
		document.getElementById('spotsMode').classList.remove('mode-checked')
		if (selectedMode !== 'brews') {
				selectedMode = 'brews';
				hideAllMarkers();
				showAreaMarkers(selectedMode);
		}
	} else if (buttonPressed === "showSpots") {
		document.getElementById('beersMode').classList.remove('mode-checked')
		document.getElementById('brewsMode').classList.remove('mode-checked')
		document.getElementById('spotsMode').classList.add('mode-checked')

		if (selectedMode !== 'spots') {
				selectedMode = 'spots';
				hideAllMarkers();
				// hideAreaMarkers();
				showAreaMarkers(selectedMode);


				// showAreaMarkers(selectedMode);
		}
	}
	else if (buttonPressed === "back"){

		console.log('Pressed "back"');
		window.history.back();
		// initial state
		// beerMap.setZoom(INITIAL_ZOOM);
		// beerMap.panTo(INITIAL_CENTER);




		// backBtnHandle();
	}
	else if (buttonPressed === "eye"){
		location.hash = '#eye';
		initState = false;

		hideAreaMarkers()
		showAllMarkers(markers, -1, google.maps.Animation.DROP, true);

		document.getElementById('mainModeCtls').style.display = 'none';
		document.getElementById('listContainer').style.display = 'none';
		document.getElementById('groupModeCtls').style.display = 'flex';
		// document.getElementById('eyeBtn').classList.add('mode-checked');
		// document.getElementById('eyeBtn').classList.remove('active')
	}
	// else if (selectedMode === 'pins') {
	// 		beerMap.maxZoom = MAX_ZOOM;
	// 		beerMap.panTo(INITIAL_CENTER);
	// 		beerMap.setZoom(INITIAL_ZOOM);
	//
	// 		markerClusters.clearMarkers();
	// 		showMarkers(null);
	// 	}
	//
	// 	if (beerMap.getZoom() > INITIAL_ZOOM) {
	// 		zoomoutFunc(INITIAL_ZOOM, 100, function() {
	// 			setTimeout(function() {
	// 				beerMap.panTo(INITIAL_CENTER)
	// 			}, 800)
	// 		})();
	// 	} else if (beerMap.getZoom() < INITIAL_ZOOM) {
	// 		zoominFunc(INITIAL_ZOOM, 100, function() {
	// 			setTimeout(function() {
	// 				beerMap.panTo(INITIAL_CENTER)
	// 			}, 800)
	// 		})();
	// 	} else {
	// 		setTimeout(function() {
	// 			beerMap.panTo(INITIAL_CENTER)
	// 		}, 100)
	// 	}
	//
	// 	// beerMap.setCenter(INITIAL_CENTER);
	// 	// resetZindexes();
	// } else if (buttonPressed === 'back') {
	// 	// unset back
	//
	//
	// 	markerClusters.maxZoom_ = MAX_ZOOM_CLUSTERS;
	// 	markerClusters.resetViewport()
	//
	// 	beerMap.setZoom(onGroupMode); //todo make it smouth, check for zoom in or out
	// 	setTimeout(function() {
	// 			beerMap.panTo(INITIAL_CENTER);
	// 	}, 200)
	//
	// 	beerMap.setOptions({maxZoom: MAX_ZOOM_CLUSTERS});
	// 	onGroupMode = 0;
	//
	// 	document.getElementById('groupModeCtls').style.display = 'none';
	// 	document.getElementById('listContainer').style.display = 'block';
	// 	document.getElementById('mainModeCtls').style.display = 'flex';
	// 	setVisibleMarkers(true);
	//
	//
	// }
	// else if (buttonPressed === "small_events"){
	// 	alert("This button will do something useful in a later tutorial!");
	// }
	// else if (buttonPressed === "rainfall"){
	// 	alert("This button will do something useful in a later tutorial!");
	// }
	// else if (buttonPressed === "showGroups" && selectedMode !== 'groups') {
	// 	selectedMode = "groups";
	// 	beerMap.setOptions({maxZoom: MAX_ZOOM_CLUSTERS});
	// 	showClusters();
	// 	// markerClusters.resetViewport()
	// 	beerMap.setZoom(INITIAL_ZOOM);
	// 	beerMap.panTo(INITIAL_CENTER);
	// 	document.getElementById('groupsMode').classList.add('mode-checked');
	// 	document.getElementById('pinsMode').classList.remove('mode-checked');
	//
	// 	// loadClusters();
	// }
	// else if (buttonPressed === "showPins") {
	// 	selectedMode = "pins";
	// 	beerMap.maxZoom = MAX_ZOOM;
	// 	beerMap.setZoom(INITIAL_ZOOM);
	// 	beerMap.panTo(INITIAL_CENTER);
	// 	document.getElementById('groupsMode').classList.remove('mode-checked');
	// 	document.getElementById('pinsMode').classList.add('mode-checked');
	// 	markerClusters.clearMarkers();
	// 	showMarkers(google.maps.Animation.DROP);
	// 	// showMarkers();
	// }
	else if (buttonPressed === 'menu') {
		openIntroModal()
		// $('#beerInfoModal').modal();
	}



		// while (true) {
		// 	if (Number(document.getElementById("allNumber").innerHTML) == 69) {
		// 		clearInterval(interval)
		// 	}
		// }

}



function USGSOverlay(bounds, image, map) {

  // Initialize all properties.
  this.bounds_ = bounds;
  this.image_ = image;
  this.map_ = map;

  // Define a property to hold the image's div. We'll
  // actually create this div upon receipt of the onAdd()
  // method so we'll leave it null for now.
  this.div_ = null;

  // Explicitly call setMap on this overlay.
  this.setMap(map);
}
// [END region_constructor]

// [START region_attachment]
/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
 USGSOverlay.prototype = new google.maps.OverlayView();

USGSOverlay.prototype.onAdd = function() {

  var div = document.createElement('div');
  div.style.borderStyle = 'none';
  div.style.borderWidth = '0px';
  div.style.position = 'absolute';

  // Create the img element and attach it to the div.
  var img = document.createElement('img');
  img.src = this.image_;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.position = 'absolute';
  div.appendChild(img);

  this.div_ = div;

  // Add the element to the "overlayLayer" pane.
  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
};
// [END region_attachment]

// [START region_drawing]
USGSOverlay.prototype.draw = function() {

  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
  var overlayProjection = this.getProjection();

  // Retrieve the south-west and north-east coordinates of this overlay
  // in LatLngs and convert them to pixel coordinates.
  // We'll use these coordinates to resize the div.
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's div to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};
// [END region_drawing]

// [START region_removal]
// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
USGSOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};
// [END region_removal]
// --------------------------------------------------------
var map_style = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "color": "#ff7000"
            },
            {
                "lightness": "69"
            },
            {
                "saturation": "100"
            },
            {
                "weight": "1.17"
            },
            {
                "gamma": "2.04"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#cb8536"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "color": "#ffb471"
            },
            {
                "lightness": "66"
            },
            {
                "saturation": "100"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "gamma": 0.01
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -31
            },
            {
                "lightness": -33
            },
            {
                "weight": 2
            },
            {
                "gamma": 0.8
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "-8"
            },
            {
                "gamma": "0.98"
            },
            {
                "weight": "2.45"
            },
            {
                "saturation": "26"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 30
            },
            {
                "saturation": 30
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": 20
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "saturation": -20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 10
            },
            {
                "saturation": -30
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": 25
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "lightness": -20
            },
            {
                "color": "#ecc080"
            }
        ]
    }
]

map_style = [
  {
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "off"
      },
      {
        "weight": 2
      }
    ]
  },
  {
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape",
    "stylers": [
      {
        "color": "#c8d7d4"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 45
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#7b7b7b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#46bcec"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c8d7d4"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#070707"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  }
]

map_style = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "color": "#ff7000"
            },
            {
                "lightness": "69"
            },
            {
                "saturation": "100"
            },
            {
                "weight": "1.17"
            },
            {
                "gamma": "2.04"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#cb8536"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "color": "#ffb471"
            },
            {
                "lightness": "66"
            },
            {
                "saturation": "100"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "gamma": 0.01
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -31
            },
            {
                "lightness": -33
            },
            {
                "weight": 2
            },
            {
                "gamma": 0.8
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "-8"
            },
            {
                "gamma": "0.98"
            },
            {
                "weight": "2.45"
            },
            {
                "saturation": "26"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 30
            },
            {
                "saturation": 30
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": 20
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "saturation": -20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "weight": "0.51"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 10
            },
            {
                "saturation": -30
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": 25
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "all",
        "stylers": [
            {
                "color": "#d13232"
            },
            {
                "weight": "2.08"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "lightness": -20
            },
            {
                "color": "#ecc080"
            }
        ]
    }
]

blackWhite = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "saturation": "0"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    }
]

transparent = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#ff0000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
]
map_style = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "color": "#ff7000"
            },
            {
                "lightness": "69"
            },
            {
                "saturation": "100"
            },
            {
                "weight": "1.17"
            },
            {
                "gamma": "2.04"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#cb8536"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "color": "#ffb471"
            },
            {
                "lightness": "66"
            },
            {
                "saturation": "100"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "gamma": 0.01
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -31
            },
            {
                "lightness": -33
            },
            {
                "weight": 2
            },
            {
                "gamma": 0.8
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "weight": "1.22"
            },
            {
                "saturation": "41"
            },
            {
                "lightness": "-22"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "saturation": "-42"
            },
            {
                "weight": "4.39"
            },
            {
                "lightness": "27"
            },
            {
                "color": "#ba9494"
            },
            {
                "gamma": "1.87"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": "64"
            },
            {
                "lightness": "-27"
            },
            {
                "gamma": "4.30"
            },
            {
                "weight": "2.33"
            },
            {
                "visibility": "on"
            },
            {
                "invert_lightness": true
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "99"
            },
            {
                "color": "#000000"
            },
            {
                "saturation": "100"
            },
            {
                "gamma": "5.98"
            },
            {
                "weight": "6.26"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e69d32"
            },
            {
                "weight": "9.63"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "-8"
            },
            {
                "gamma": "0.98"
            },
            {
                "weight": "2.45"
            },
            {
                "saturation": "26"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "gamma": "1"
            },
            {
                "saturation": "30"
            },
            {
                "lightness": "30"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": 20
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#584516"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "saturation": "27"
            },
            {
                "visibility": "off"
            },
            {
                "color": "#827a51"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#795514"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "saturation": "100"
            },
            {
                "hue": "#ff0000"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": "-5"
            },
            {
                "saturation": -30
            },
            {
                "visibility": "simplified"
            },
            {
                "gamma": "0.84"
            },
            {
                "weight": "0.48"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": 25
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "saturation": "-100"
            },
            {
                "lightness": "-17"
            },
            {
                "gamma": "1.32"
            },
            {
                "weight": "0.71"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "saturation": "100"
            },
            {
                "lightness": "-68"
            },
            {
                "gamma": "1.68"
            },
            {
                "weight": "1.04"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "lightness": -20
            },
            {
                "color": "#ecc080"
            }
        ]
    }
]
