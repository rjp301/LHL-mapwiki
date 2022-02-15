//first initialize the map as a global valuable//
let map;

$(document).ready(() => {
  fetchMap();
});

//For fulsize google map//
const loadMap = (mapData) => {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: mapData.avg_lat, lng: mapData.avg_lng },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });
};

//For google map pins//
const passPins = (pin) => {
  const marker = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map: map,
  });
  console.log(marker);
};

//create HTML skeleton//
const createMapElement = (map) => {
  const mapName = map.name;
  const mapDesc = map.description;
  const $map = `
    <section id="list-of-locations">
      <button id="back-to-maps">Back to maps</button>
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

//get mapid from route/
const pathname = window.location.pathname;
const mapId = pathname.split("/")[2];

const fetchMap = () => {
  $.get(`/maps/api/${mapId}`).then((map) => renderMap(map));
};

const renderMap = function (map) {
  const fetchPins = (mapId) => {
    $.get(`/pins/${mapId}`).then((pins) => {
      renderPins(pins);
    });
  };

  const renderPins = (pins) => {
    for (const pin of pins) {
      passPins(pin);
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
