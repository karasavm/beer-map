


//Create the variables that will be used within the map configuration options.
//The latitude and longitude of the center of the map.

//The degree to which the map is zoomed in. This can range from 0 (least zoomed) to 21 and above (most zoomed).
var beerMapZoom = 7;
//The max and min zoom levels that are allowed.
var beerMapZoomMax = 9;
var beerMapZoomMin = beerMapZoom;

// -------------------------------------------------
var ZINDEX_MARKER = 100;
var MARKER_CAP_SIZE = 35;

var MARKER_CAP_HOVER_FACTOR = 7.5;

var MAX_ZOOM = 14	;
var MIN_ZOOM = 6;
// var MIN_ZOOM = 2;
var MAX_ZOOM_CLUSTERS = 7;
var STAR_MODE_MAX_ZOOM = 9;
// var PINS_PATH = 'icons/pins/cp200x200cp/';
var PINS_PATH = 'icons/pins/150x150cp/';
var LOGO_PATH = 'icons/pins/compressed/';
var zoomCtrLocked = false;
var onGroupMode = 0;
var on
var INITIAL_ZOOM = 6;
var INITIAL_CENTER = new google.maps.LatLng(39.074208, 22.824311999999964);
// -------------------------------------------------
//These options configure the setup of the map.
var beerMapOptions = {

		  center: INITIAL_CENTER,
          zoom: INITIAL_ZOOM,
		  maxZoom: MAX_ZOOM,
		  minZoom: MIN_ZOOM,
		  backgroundColor: 'hsla(0, 0%, 0%, 0)',
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
		  panControl: false,
		  mapTypeControl: false,
		  streetViewControl: false,
};
//Create the variable for the main map itself.
var beerMap;
var isStarMode = true; // start is when markers are in "star" position on map, on virtual positions
var currentCapSize = MARKER_CAP_SIZE;
var curOpenedPin;
var markerClusters;


var selectedMode, state;

var markers = [];

var markersLines = [];
var infoBoxes = [];
var markersRaw = [];

var curLang = 'gr';
///////// MAIN /////////////
window.addEventListener('DOMContentLoaded', function() {

  // openIntroModal();
	translate();
	document.getElementsByTagName("BODY")[0].style.display = 'block';
}, true);

//When the page loads, the line below calls the function below called 'loadbeerMap' to load up the map.
google.maps.event.addDomListener(window, 'load', function() {
	console.log("addDomListener");

	parseRawData();
	createAreaMarkers('beers');
	createAllMarkers();
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
			"since": "since"
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
			"since": "από το"
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

	beerMap.addListener('zoom_changed', onZoomChanged);

  loadStyledMap();


	function preloadImages(array) {
	  if (!preloadImages.list) {
	      preloadImages.list = [];
	  }
	  var list = preloadImages.list;
	  for (var i = 0; i < array.length; i++) {
	      var img = new Image();
	      img.onload = function() {
	          var index = list.indexOf(this);
	          if (index !== -1) {
	              // remove image from the array once it's loaded
	              // for memory consumption reasons
	              list.splice(index, 1);
	          }
	      }
	      list.push(img);
	      img.src = array[i];
	  }
	}

	var images = []
	for (var i=0; i < markersRaw.length; i++) {
		images.push( + markersRaw[i].icon)
	}

	// preloadImages(images)



  var rainMapOverlay = new google.maps.ImageMapType({
   getTileUrl: function(coord, zoom) {
   return 'tiles2' + '/' +zoom+ '/' +coord.x+ '/' + coord.y +'.png';
   },
   tileSize: new google.maps.Size(256, 256)
  });
	// translate();
  // beerMap.overlayMapTypes.insertAt(0, rainMapOverlay);

  //Calls the function below to load up all the map markers.
  // loadMapMarkers(markersRaw, markers); // create markers list
  // updateMarkersSize();

  // loadClusters();
  // 	ters();
  loadBanner();
	initControlsState();
	showAreaMarkers(selectedMode)



	google.maps.event.addListenerOnce(beerMap, 'idle', function(){
    // do something only the first time the map is loaded

		// document.getElementById('controls').style.display = 'block';
		setTimeout(function test() {
			// document.getElementById('controls').style.display = 'block';
			openIntroModal();
			setSearchList();
		}, 1000);
	});

} // EDN OF loadbeerMap()



var areaMarkers = [];
// var areaBrewMarkers = [];



function createAllMarkers() {
	// set the beers number
	// set the brews number
	for (var i=0; i < markersRaw.length; i++) {
		var data = markersRaw[i];
		var marker = createImageMarker(
			data.lat,
			data.log,
			data.icon,
			data.name
		)
		marker.rawData = markersRaw[i];
		markers.push(marker);

		google.maps.event.addListener(markers[i], "click", function() {
			console.log(this)
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

function getAreaMarkerLabel(number, text) {
	console.log('getAreaMarkerLabel()')
	return {
		color: 'white',
		fontSize: '15px',
		fontWeight: 'bold',
		text: number.toString() + ' ' + text,
		fontFamily: "Cursive, Helvetica, Arial, Sans-Serif"
	}
}
var areasLabels = [];
function createAreaMarkers(type) {
	console.log('createAreaMarkers()')
	for (var i=0; i < areasData.length; i++) {
		console.log(areasData[i])
		var data = areasData[i];
		var marker = createImageMarker(
			data.latLng.split(',')[0],
			data.latLng.split(',')[1],
			'beers.png',
			data.name)
		marker.setLabel(
			getAreaMarkerLabel(areasData[i].beers, "")
		)
		marker.rawData = areasData[i];
		areaMarkers.push(marker);

		google.maps.event.addListener(areaMarkers[i], "click", function() {

			console.log("GroupMode started", this)
			onGroupMode = {
				zoom: beerMap.getZoom(),
				center: beerMap.getCenter()
			};

			document.getElementById('mainModeCtls').style.display = 'none';
			document.getElementById('listContainer').style.display = 'none';
			document.getElementById('groupModeCtls').style.display = 'flex';

			hideAreaMarkers();

			showAllMarkers(selectedMode, this.rawData.id)

			var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
			for (var i = 0; i < markers.length; i++) {
				var marker = markers[i];
				if (marker.rawData.area === this.rawData.id) {
					bounds.extend(marker.getPosition());
				}
			}

			beerMap.panTo(bounds.getCenter());
			zoominFunc(beerMap.getZoom() + 3, 100, function() {
				setTimeout(function() {
						beerMap.fitBounds(bounds);
				}, 500)
			})()



			return


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


    })


		// geografika diamerismata
		var size = MARKER_CAP_SIZE*0.01;
		var image = {
	      origin: new google.maps.Point(0, 0),
	      url: PINS_PATH + 'stala.png',
				labelOrigin: new google.maps.Point(0,35),
	      // scaledSize: new google.maps.Size(60, 88), // short pin
	      scaledSize: new google.maps.Size(size, size), // cap
	      // anchor: new google.maps.Point(31, 88), // short pin
	      anchor: new google.maps.Point(size/2, size/2), // cap
	    };

		var areaLabel =  new google.maps.Marker({
      position: new google.maps.LatLng(data.latLng.split(',')[0], data.latLng.split(',')[1]),
      title: '',
			icon: image,
      animation: null,
      draggable: false,
			clickable: false,
			label: {
					color: '#753b07',
					fontSize: '12px',
					fontWeight: 'bold',
					text:areasData[i].name,
					fontFamily: "Cursive, Helvetica, Arial, Sans-Serif"
				},
			// icon: getImageObj('icons/pins/60x60/eza.png', MARKER_CAP_SIZE),
      zIndex: ZINDEX_MARKER - 1
    });

		areasLabels.push(areaLabel);
		// areaLabel.setMap(beerMap)



	}
}

function showAreaMarkers(type) {
	console.log('showAreaMarkers()')
	for (var i=0; i < areaMarkers.length; i++) {
		areaMarkers[i].setIcon(getImageObj(PINS_PATH + type +'.png', MARKER_CAP_SIZE+20))

		areaMarkers[i].setLabel(
			getAreaMarkerLabel(areasData[i][type], '')
		)
		areaMarkers[i].setMap(beerMap)
		// areasLabels[i].setMap(beerMap)
	}
}

function showAllMarkers(type, area) {
	console.log('showAllMarkers()');
	for (var i=0; i < markers.length; i++) {
		if (!area || (area === markers[i].rawData.area) ) {
			if ( type === 'beers') {
					// markers[i].setIcon(getImageObj(PINS_PATH + type +'.png', MARKER_CAP_SIZE+20))
					markers[i].setLabel(getAreaMarkerLabel(markers[i].rawData.beers, ''))
					markers[i].setLabel(getAreaMarkerLabel(markers[i].rawData.beers,''))
			} else {
				// markers[i].setIcon(getImageObj(PINS_PATH + markers[i].rawData.icon, MARKER_CAP_SIZE+20))
				markers[i].setLabel(null, '')
			}

			markers[i].setMap(beerMap);
		}

	}
}


function hideAreaMarkers() {
	console.log('hideAreaMarkers()')
	for (var i=0; i < areaMarkers.length; i++) {
		areaMarkers[i].setMap(null);
	}
}
console.log('hideAreaMarkers()');
function hideAllMarkers() {
	console.log('hideAllMarkers()')
	for (var i=0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

function parseRawData() {
	for (var i=0; i < rawData.length; i ++) {

	  if (rawData[i].mapUrl !== '') {

	    var sp = rawData[i].mapUrl.split("!3d");

	    sp = sp[sp.length-1]
	    markersRaw.push({
	      id: rawData[i].id.toString(),
	      name: { 'en': rawData[i].name.toString().split("/")[0], 'gr': rawData[i].name.toString().split("/")[1]},
				city: { 'en': rawData[i].city.toString().split("/")[0], 'gr': rawData[i].city.toString().split("/")[1]},
	      lat: Number(sp.split("!4d")[0]),
	      log: Number(sp.split("!4d")[1]),
	      icon: rawData[i].icon || "temp.png",
	      mapUrl: rawData[i].mapUrl,
	      fbUrl: rawData[i].fbUrl,
				webUrl: rawData[i].webUrl,
				tel: rawData[i].tel,
				yearCreated: '2005', // todo update with excels data
				numberOfBeers: 4, // todo update with excels data
	      type: rawData[i].type,
				beers: Number(rawData[i].beers),
				area: rawData[i].area
	    })
	  } else {

	  }

	}
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

function getImageObj(url, size) {

  var image = {
      origin: new google.maps.Point(0, 0),
      url: url,
			labelOrigin: new google.maps.Point(25,35),
      // scaledSize: new google.maps.Size(60, 88), // short pin
      scaledSize: new google.maps.Size(size, size), // cap
      // anchor: new google.maps.Point(31, 88), // short pin
      anchor: new google.maps.Point(size/2, size/2), // cap
    };

  return image;
}
var tempPinCounter = 1;
function createImageMarker(lat, log, imageUrl, legend, areaLabel) {

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
      // icon: getImageObj(PINS_PATH + imageUrl, MARKER_CAP_SIZE+15),
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
	state = 'area';
	showAreaMarkers(selectedMode)
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
			var matches = markersRaw[i].name[curLang].toLowerCase().search(key.toLowerCase()) != -1;

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
function closeSearchBox() {
	var searchBox = document.getElementById("searchbox");


	searchBox.value = '';
	updateSearchList();

	document.getElementById("searchbox-cancel").style.display = "none";
	document.getElementById("searchlist").style.display = "none";
	searchBox.classList.remove("searchbox-focus");
	searchbox.style.backgroundImage = "url('images/view-list.png')";
}

function onKeyupSearcBox() {

	updateSearchList();

}
function onSearchboxFocus() {

	var searchBox = document.getElementById("searchbox");

	if ( !searchBox.classList.contains('searchbox-focus') ) {
		// fist click on searchBox

		searchbox.style.backgroundImage = "url('images/magnify.png')";
		searchBox.blur();
		searchBox.classList.add("searchbox-focus");
	}

	document.getElementById("searchlist").style.display = "block";
	setTimeout(function() {
		document.getElementById("searchbox-cancel").style.display = "inline-block";
	}, 400)

}


function onSearchBoxClearClick() {


	console.log("onSearchBoxClearClick");
	var searchBox = document.getElementById("searchbox");

	/////// functionality //////
	/// only to close the search box panel
	/// remove if you want to clear text with first clicked
	/// and close panel with the second click
	searchBox.value = '';
	closeSearchBox();
	return;
	/////////////////////////

	if ( searchBox.value === '' ) {
		closeSearchBox();
	} else {
		searchBox.value = '';
		updateSearchList();
		searchBox.focus();

	}
}

function openInNewTab(url) {

  var win = window.open(url, '_blank');
  win.focus();
}

function setInfoModalValues(pin) {

	curOpenedPin = pin;

  document.getElementById("infoModalImg").src= LOGO_PATH + pin.rawData.icon;
  document.getElementById("infoModalTitle").innerHTML= pin.rawData.name[curLang];
  document.getElementById("infoModalCity").innerHTML= pin.rawData.city[curLang];


  document.getElementById("infoModalWebBtn").style.display = pin.rawData.webUrl === '' ? 'none' : 'inline-block';
	document.getElementById("infoModalFbBtn").style.display = pin.rawData.fbUrl === '' ? 'none' : 'inline-block';
	document.getElementById("infoModalTelBtn").style.display = pin.rawData.tel === '' ? 'none' : 'inline-block';

  // document.getElementById("preview-info").href=curOpenedPin.rawData.infoUrl
  // document.getElementById("preview-nav").href=curOpenedPin.rawData.mapUrl
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
                    console.log(Math.floor(i/5));
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
			console.log("aaaaaaaa", cluster)
			setTimeout(function(){
					// beerMap.fitBounds(cluster.getBounds())
			}, 100)


		})();


});
}

// -------------------------- EVENT HANDLERS -------------

function onZoomChanged() {
	// return;
  // updateMarkersSize();

	// increase area areasLabels

	// for (var i=0; i < areasLabels.length; i++) {
	// 	var style = areasLabels[i].getLabel();
	// 	console.log(style)
	// 	style.fontSize = (5+(beerMap.getZoom() - 5)*5).toString()+'px'
	// 	console.log(style)
	// 	areasLabels[i].setLabel(style)
	// }
	console.log(markers)
	return;
	if ( beerMap.getZoom() >= 8) {
		if (state !== 'all') {
			state = 'all';
			hideAreaMarkers();
			showAllMarkers(selectedMode)
		}

	} else {
		if (state !== 'area') {
			state = 'area';
			hideAllMarkers();
			showAreaMarkers(selectedMode);
		}

	}
	return;
	var controls = document.getElementById('controls');
	if (beerMap.getZoom() <= MAX_ZOOM_CLUSTERS) {
		controls.style.display = 'block';
	} else {
		controls.style.display = 'none';
	}
	return;
  var currentZoom = beerMap.getZoom();

  // FROM STAR TO ORIGINAL LOCATION
  if (currentZoom > STAR_MODE_MAX_ZOOM && isStarMode) { // currentZoom not in star mode && previous mode was start Mode
    isStarMode = false;

    // remove lines
    for (var i=0; i < lines.length; i++) {
      lines[i].setMap(null);
    }



    // set oroginal positions to markers
    for (i=0; i < markersRaw.length; i++) {
      if (markersRaw[i].latV) { // only if there is apossibility for virtual position
        var position = new google.maps.LatLng(markersRaw[i].lat, markersRaw[i].log);
        markers[i].setPosition(position)
      }
    }
  }
  else if (!isStarMode && currentZoom <= STAR_MODE_MAX_ZOOM) { // previous mode wasnt start mode and now in star mode
    isStarMode = true;
    for (i=0; i < markersRaw.length; i++) {
      if (markersRaw[i].latV) {
        lat = markersRaw[i].latV;
        log = markersRaw[i].logV;
        var position = new google.maps.LatLng(lat, log);
        markers[i].setPosition(position)
      }
    }

    // redraw lines
    for (i=0; i < lines.length; i++) {
      lines[i].setMap(beerMap);
    }

  }
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



//
function closeIntroModal() {
	$('#introModal').modal('hide');
}


function zoominFunc(endZoomIn, delayZoom, execFun) {
	return function zoomin() {
		if (beerMap.getZoom() < endZoomIn) {
			console.log("zooming in")
			beerMap.setZoom(beerMap.getZoom() + 1)
			setTimeout(zoomin, delayZoom)

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

	var latLng = new google.maps.LatLng(markers[id].rawData.lat, markers[id].rawData.log)

	closeSearchBox();


	document.getElementById('mainModeCtls').style.display = 'none';
	document.getElementById('listContainer').style.display = 'none';
	document.getElementById('groupModeCtls').style.display = 'flex';

	hideAreaMarkers();


	showAllMarkers(selectedMode, this.rawData.id)

	var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i];
		if (marker.rawData.area === this.rawData.id) {
			bounds.extend(marker.getPosition());
		}
	}

	beerMap.panTo(bounds.getCenter());
	zoominFunc(beerMap.getZoom() + 3, 100, function() {
		setTimeout(function() {
				beerMap.fitBounds(bounds);
		}, 500)
	})()



	return;
	// clear map
	// beerMap.maxZoom = MAX_ZOOM;
	// markerClusters.clearMarkers(); //if group mode
	setMapMarkers(null);

	// clear controls state
	// document.getElementById('groupsMode').classList.remove('active');
	// document.getElementById('pinsMode').classList.remove('active');

	// wait before any step
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

				// setTimeout(function(){markers[id].setAnimation(null)}, 500)


				beerMap.panTo(latLng);
				setTimeout(function() {
					zoominFunc(endZoomIn, delayZoom, function() {
						setTimeout(function() {
						setInfoModalValues(markers[id]);
							$('#beerInfoModal').modal();
							// show markers or groups
							// setTimeout(function() {
							// 	if (selectedMode === 'groups') {
							// 		showClusters();
							// 	} else {
							// 		showMarkers(null)
							// 	}
							// }, 500)
						}, 1200)
					})();
				}, 1200)
			}, firstDelay)
		})();


	}, 500)

}

function testing() {
	console.log("ela re file")

}
function openIntroModal() {
	return;
	$('#introModal').modal();

	document.getElementById("introModalMainBody").addEventListener("touchstart", function(e) {
		closeIntroModal();
	}, false);

	// return;
	var delay = 2000;
	var allNum = 69;
	var microNum = 47;
	var clientNum = 235;

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
	var int1 = setInterval(function() {
			var num = Number(document.getElementById("allNumber").innerHTML);

			if (num == allNum) {
				window.clearInterval(int1);
			} else {
				num = num +1;
				document.getElementById("allNumber").innerHTML = num.toString();
			}

	}, delay/allNum)

	document.getElementById("clientNumber").innerHTML = 0;
	var int2 = setInterval(function() {
			var num = Number(document.getElementById("clientNumber").innerHTML);

			if (num == clientNum) {

				window.clearInterval(int2);
			} else {
				num = num +1;
				document.getElementById("clientNumber").innerHTML = num.toString();
			}

	}, delay/clientNum)


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

function handleRequests (buttonPressed) {
	if (buttonPressed === 'showBeers') {
		selectedMode = 'beers';
		if (state === 'area' ) {
			//todo change icon and number in areaMarkers to beers
			showAreaMarkers('beers')
		} else {
			showAllMarkers('beers')
			//todo change icon and number in markers to beers
		}
	} else if (buttonPressed === "showBrews") {
		selectedMode = 'brews';
		if (state === 'area' ) {
			//todo change icon and number in areaMarkers to beers
			showAreaMarkers('brews')
		} else {
			showAllMarkers('brews')
			//todo change icon and number in markers to beers
		}
	}
	else if (buttonPressed === "back"){

		console.log('Pressed "back"')
		beerMap.setZoom(INITIAL_ZOOM);
		beerMap.panTo(INITIAL_CENTER);

		hideAllMarkers();
		showAreaMarkers(selectedMode);

		document.getElementById('mainModeCtls').style.display = 'flex';
		document.getElementById('listContainer').style.display = 'block';
		document.getElementById('groupModeCtls').style.display = 'none';

		onGroupMode = null;
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
