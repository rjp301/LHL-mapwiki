$().ready(() => {
  const $container = $('main');

  bindNavButtons();
  $container.append($(`<div id="map-container"></div>`));
});

const bindNavButtons = () => {
  $('#maps-new');
  $('#login-button').click(() => $.get('/login'));
  $('#maps-view-all').click({ path: '/' }, loadMaps);
  $('#maps-view-fav').click({ path: '/favourites' }, loadMaps);
  $('#maps-view-edit').click({ path: '/editable' },loadMaps);
};

const loadMaps = (data) => {
  const path = data.data.path;
  console.log(`Fetching maps from /maps${path}...`);
  $
    .get("/maps" + path)
    .then(maps => renderMaps(maps))
    .catch(err => console.error(err.stack));
};

const renderMaps = (maps) => {
  const $mapContainer = $('#map-container');
  $mapContainer.empty();
  for (const map of maps) {
    const $map = createMapElement(map);
    $mapContainer.append($map);
  }
};

const createMapElement = (map) => {
  return $(`
  <div class="card" >
     <span class="heart-icon"><i class="fa-solid fa-heart"></i></span>
     <img class="card-img-top" src="https://image.shutterstock.com/image-vector/urban-vector-city-map-johannesburg-600w-1757922890.jpg" alt="Card image cap">
     <div class="card-body">
     <h6 class="card-title">${map.name}</h6>
     <p class="card-text">${map.description}</p>
     <a href="#" class="btn btn-info  btn-block">Map Page</a>
  </div>`);
};

