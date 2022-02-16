/* global document

*/

$().ready(() => {
  bindNavButtons();
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
  $('#login-button').click(login);
  $('#maps-view-all').click({ path: '/' }, loadMaps);
  $('#maps-view-fav').click({ path: '/favourites' }, loadMaps);
  $('#maps-view-edit').click({ path: '/editable' },loadMaps);
};

const login = () => {
  const userId = readCookie('userId');
  $.get('/login');
  $
    .get(`/users/${userId}`)
    .then(name => {
      $('#username').text(name)
    });
};

const loadMaps = (data) => {
  const path = data.data.path;
  console.log(`Fetching maps from /maps${path}...`);

  // need to fetch filtered maps but also favourited maps
  // to compare and colour heart so need two promises
  const p1 = $.get("/maps" + path);
  const p2 = $.get('/maps/favourites');

  // When both promises resolve pass both values into rendermaps
  Promise
    .all([p1, p2])
    .then(values => {
      console.log(values);
      renderMaps(...values);
    })
    .catch(err => console.error(err.stack));
};

const renderMaps = (maps, favourites) => {
  const $mapContainer = $('#map-container');
  $mapContainer.empty();

  for (const map of maps) {
    const isFav = favourites.map(i => i.id).includes(map.id);
    const $map = createMapElement(map, isFav);
    $mapContainer.append($map);
  }
};

const createMapElement = (map, isFav) => {
  const apiKey = readCookie('mapsAPIKey');

  const thumbnail = 'https://maps.googleapis.com/maps/api/staticmap?' + $.param({
    center: `${map.avg_lat},${map.avg_lng}`,
    zoom: 12,
    size: '400x600',
    maptype: 'roadmap',
    key: apiKey,
  });

  const $mapCard = $(`
  <a class="card" href="/maps/${map.id}">
    <div class="card-icons">
      <i class="fa-solid fa-heart"></i>
      <i class="fa-solid fa-share"></i>
    </div>
    <img src="${thumbnail}" alt="">
    <div class="card-text">
      <div class="card-url">localhost:8080/maps/${map.id}</div>
      <h3>${map.name}</h3>
      <p>${map.description}</p>
    </div>
  </a>
  `);

  const toggleFavourite = function(event) {
    // click event handler tied to heart icon
    event.preventDefault();
    console.log($(this));
    if ($(this).hasClass('red')) {
      console.log(`Removing ${map.name} from favourites...`);
      $(this).removeClass('red');
      $.post('/favourites/delete', {
        userId: readCookie('userId'),
        mapId: map.id
      });
    } else {
      console.log(`Adding ${map.name} to favourites...`);
      $(this).addClass('red');
      $.post('/favourites', {
        userId: readCookie('userId'),
        mapId: map.id
      });
    }
  };

  const toggleShare = function(event) {
    event.preventDefault();
    $mapCard.find('.card-url').slideToggle();
  };

  // Bind actions to buttons
  $mapCard.find('.card-url').hide();
  $mapCard.find('.fa-heart').click(toggleFavourite);
  $mapCard.find('.fa-share').click(toggleShare);

  if (isFav) {
    $mapCard.find('.fa-heart').addClass('red');
  }

  return $mapCard;
};

