// Client facing scripts here
(function () {
  $(document).ready(() => {
    renderMaps();
  });

  //create HTML skeleton//
  const createMapElement = () => {
    const $map = `
      <h3 calss="card-title">All maps</h3>
      <div class="map-container">
        <div class="card card-item">
          <p class="card-title">Map title</p>
          <img
            class="card-img-top"
            src="https://image.shutterstock.com/image-vector/urban-vector-city-map-johannesburg-600w-1757922890.jpg"
            alt="Card image cap"
          />
          <span class="heart-icon"><i class="fa-solid fa-heart"></i></span>
        </div>
      `;
    return $map;
  };

  //rendering map data from database//
  const renderMaps = function () {
    $(".card-lists").empty();
    // for (const map of maps) {
    // }
    const $map = createMapElement();
    $(".card-lists").prepend($map);
  };
})();
