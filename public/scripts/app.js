$().ready(() => {
  bindNavButtons();

  const $container = $('main');
  $container.append($(`<div id="map-container"></div>`));
});

const readCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};


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

  const $mapId = $('.card').attr('id');
  console.log($mapId);
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
  const $mapCard = $(`
  <a class="card" href="/maps/${map.id}">
    <div class="card-icons">
      <i class="fa-solid fa-heart"></i>
      <i class="fa-solid fa-share"></i>
    </div>
    <img src="https://i.stack.imgur.com/RdkOb.jpg" alt="">
    <div class="card-text">
      <h3>${map.name}</h3>
      <p>${map.description}</p>
    </div>
  </a>
  `);

  $mapCard.click(() => $.get(`/maps/${map.id}`));

  // Is map a favourite already?

  const $favButton = $mapCard.find('.heart-icon');
  // $favButton.toggle(
  //   () => {
  //     $.post('/favourites', {
  //       userId: readCookie('userId'),
  //       mapId: map.id
  //     })
  //   },
  //   () =>

  // );
  return $mapCard;
};

