//first initialize the map as a global valuable//
let map;
let allPins = [];
let infowindowIsOpen = false;

//get mapid from route/
const pathname = window.location.pathname;
const mapId = pathname.split("/")[2];

$(document).ready(() => {
  fetchMap();

  // show pin position on map when selected from side menu
  $('#floating-menu').on('mouseover', 'li', function () {
    const $listOfPins = $('ul').children();
    for (let i = 0; i < $listOfPins.length; i++) {
      $($listOfPins[i]).on("click", () => {
        showSelectedPinOnMap(i);
        // if ($($listOfPins[i]).hasClass("green")) {
        //   $($listOfPins[i]).removeClass("green");
        // } else {
        //   $($listOfPins[i]).addClass("green");
        // }
      })
    }
  })
});

// bounce and show selected pin on map
const showSelectedPinOnMap = function(index) {
  //show pin data card
  google.maps.event.trigger(allPins[index], 'click');

  //bounce pin
  allPins[index].setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => {
    allPins[index].setAnimation(null);
  }, 350);
};

// refresh sidebar with newest pin added
const reloadSidebar = () => {
  $(".pin-list").empty();
  allPins = [];
  fetchPins(mapId);
};


//Load fullsize google map//
const loadMap = (mapData) => {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: mapData.avg_lat, lng: mapData.avg_lng },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });

  // Listen for any clicks on the map
  map.addListener('click', onMapClick);
};

// Add a new marker when clicking map
const onMapClick = (event) => {
    const coordinates = event.latLng;
    addNewPin(coordinates);
}

// Add a new marker to map
const addNewPin = (position) => {
  const newPin = new google.maps.Marker({
    position,
    map,
  });

  const pinData = {
    map_id: mapId,
    title: "Untitled pin",
    description: 'Enter description',
    image_url: 'Image URL',
    latitude: newPin.getPosition().lat(),
    longitude: newPin.getPosition().lng()
  };

  // New marker is automatically added to database
  $.ajax({
    url: "/pins/new",
    method: 'POST',
    data: pinData
  }).then(() => {
      reloadSidebar();
  }).catch((err) => console.log('OOPSIE DOOPSIE', err.message));
};

//For google map pins//
const mapPins = (pin) => {
  const marker = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map: map,
    draggable: true
  });
  allPins.unshift(marker);

  const infowindow = new google.maps.InfoWindow({
    content: `<h3>${pin.title}</h3>
              <img src='${pin.image_url}'>
              <p>${pin.description}</p>
             `,
  });

  marker.addListener("click", () => {
    // if (infowindowIsOpen) {
    //   infowindow.close();
    //   infowindowIsOpen = false;
    // } else if (!infowindowIsOpen) {
      infowindow.open({
      anchor: marker,
      map,
      });
    //   infowindowIsOpen = true;
    // }
  });
};

//create HTML skeleton//
const createMapElement = (map) => {
  const mapName = map.name;
  const mapDesc = map.description;
  const $map = `
    <section id="list-of-locations">
      <a id="back-to-maps" href="/">Back to maps</a>
      <h2>${mapName}</h2>
      <p>${mapDesc}</p>
      <ul class='pin-list'>
      </ul>
    </section>

    <div id="map-buttons">
      <button class="add-marker">Add</button>
      <button class="share-btn">Share</button>
    </div>
 `;
  return $map;
};



const fetchMap = () => {
  $.get(`/maps/api/${mapId}`).then((map) => renderMap(map));
};

const renderPins = (pins) => {
  for (const pin of pins) {
    mapPins(pin);
    $(".pin-list").prepend(`<li>${pin.title}</li>`);
  }
};

const fetchPins = (mapId) => {
  $.get(`/pins/bymap/${mapId}`).then((pins) => {
    renderPins(pins);
  });
};

const renderMap = function (map) {
  loadMap(map);
  fetchPins(map.id);

  $("#floating-menu").empty();
  const $map = createMapElement(map);
  $("#floating-menu").append($map);
};

//
//
// future/stretch ideas //
  //could add optional drag function //
  //in routes/queries, add || to determine which fields get updated and which stay the same value
  // google.maps.event.addListener(marker, 'dragend', function (evt) {
  //   const pinNewPosition = evt.latLng;
  //   $.ajax({
  //     url: "/pins/:id",
  //     method: 'POST',
  //     data: pinNewPosition
  //   });
  //   // map.panTo(evt.latLng);
  // })
