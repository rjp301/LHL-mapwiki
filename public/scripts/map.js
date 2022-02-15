//first initialize the map as a global valuable//
let map;

//get mapid from route/
const pathname = window.location.pathname;
const mapId = pathname.split("/")[2];

$(document).ready(() => {
  fetchMap();
});


//Load fullsize google map//
const loadMap = (mapData) => {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: mapData.avg_lat, lng: mapData.avg_lng },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });

  map.addListener('click', (event) => {
    addNewPin(event.latLng);
  })
};

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

  $.ajax({
    url: "/pins/new",
    method: 'POST',
    data: pinData
  }).then(() => {
      console.log('new pin added!');
  }).catch((err) => console.log('OOPSIE DOOPSIE', err.message));
};

//For google map pins//
const mapPins = (pin) => {
  // console.log(pin);
  const marker = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map: map,
  });

  const infowindow = new google.maps.InfoWindow({
    content: `<h3>${pin.title}</h3>
              <img src='${pin.image_url}'>
              <p>${pin.description}</p>
             `,
  });

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
    });
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

const renderMap = function (map) {
  const fetchPins = (mapId) => {
    $.get(`/pins/bymap/${mapId}`).then((pins) => {
      renderPins(pins);
    });
  };

  const renderPins = (pins) => {
    for (const pin of pins) {
      mapPins(pin);

      $(".pin-list").prepend(`<li>${pin.title}</li>`);
    }
  };

  loadMap(map);
  fetchPins(map.id);

  $("#floating-menu").empty();
  const $map = createMapElement(map);
  $("#floating-menu").append($map);
};

//
