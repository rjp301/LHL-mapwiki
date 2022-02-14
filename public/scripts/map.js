function initMap() {
  // The location of Uluru
  const uluru = { lat: -25.344, lng: 131.036 };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: uluru,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}

$(() => {
  const $newMap = $("#new-map");

  $newMap.on("click", () => {
    console.log("hi");
    $(".nav").slideUp(250);
  });

  const $container = $("body > section");

  bindNavButtons();
  $container.append($(`<div id="map-container"></div>`));
});

//create HTML skeleton//
const createMapElement = () => {
  const $map = `

    <section id="list-of-locations">
      <button id="back-to-maps">Back to maps</button>
      <h2>My places</h2>
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


