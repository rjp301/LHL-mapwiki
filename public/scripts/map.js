function initMap() {
  // The location of Uluru
  const uluru = { lat: -25.344, lng: 131.036 };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: uluru,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}

(function () {
  $(document).ready(() => {
    renderMap();
  });

  const pathname = window.location.pathname;
  const mapId = pathname.split('/')[2];

  $
    .get(`/maps/api/${mapId}`)
    .then((map) => renderMap(map))

  //create HTML skeleton//
  const createMapElement = (map) => {
    const mapName = map.name;
    const mapDesc = map.description;
    const $map = `
    <section id="list-of-locations">
      <button id="back-to-maps">Back to maps</button>
      <h2>${mapName}</h2>
      <p>${mapDesc}</p>
      <ul>
        <li>Place 1</li>
        <li>Place 2</li>
        <li>Place 3</li>
      </ul>
    </section>
    <div id="map-buttons">
      <button class="add-marker">Add</button>
      <button class="share-btn">Share</button>
    </div>
 `;
    return $map;
  };

  const renderMap = function (map) {
    $("#floating-menu").empty();
    const $map = createMapElement(map);
    $("#floating-menu").append($map);
  };
})();
