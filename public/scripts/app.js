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

    <div class="card" >
       <span class="heart-icon"><i class="fa-solid fa-heart"></i></span>
       <img class="card-img-top" src="https://image.shutterstock.com/image-vector/urban-vector-city-map-johannesburg-600w-1757922890.jpg" alt="Card image cap">
       <div class="card-body">
       <h6 class="card-title">${map.name}</h6>
       <p class="card-text">${map.description}</p>
       <a href="#" class="btn btn-info  btn-block">Map Page</a>
    </div>
      `;
    return $map;
  };

  //rendering map data from database//
  const renderMaps = function (maps) {
    $(".map-container").empty();
    for (const map of maps) {
      const $map = createMapElement(map);
      $(".map-container").prepend($map);
    }
  };
})();
