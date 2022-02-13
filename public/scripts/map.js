$(() => {
  //note: fix the async bug in this

  console.log('hello')
  // Initialize and add the map
  function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
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

  initMap();

});
