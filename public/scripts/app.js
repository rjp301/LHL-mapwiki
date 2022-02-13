// Client facing scripts here
(function () {
  $().ready(() => {
    console.log("ready ");
    loadMaps();
  });

  const loadMaps = function () {
    $.get("/api/maps")
      .then((maps) => {
        renderMaps(maps);
      })
      .catch((error) => {
        console.log(`loadMaps error: ${error}`);
      });
  };
  //create HTML skeleton//
  const createMapElement = (map) => {
    const $map = `
      <div class="map-container">
        <div class="card card-item">
          <p class="card-title">${map.name}</p>
          <p>${map.description}</p>
          <img
            class="card-img-top"
            src="https://image.shutterstock.com/image-vector/urban-vector-city-map-johannesburg-600w-1757922890.jpg"
            alt="Card image cap"
          />
          <span class="heart-icon"><i class="fa-solid fa-heart"></i></span>
        </div>
      </div>
      `;
    return $map;
  };

  //rendering map data from database//
  const renderMaps = function (maps) {
    $(".card-lists").empty();
    for (const map of maps) {
      const $map = createMapElement(map);
      $(".card-lists").prepend($map);
    }
  };
})();
