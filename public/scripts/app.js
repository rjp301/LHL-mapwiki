/* global Cookies */


$().ready(() => {
  bindNavButtons();
  loadMaps();
  login();
});

// const Cookies.get = (name) => {
//   const nameEQ = name + "=";
//   const ca = document.cookie.split(';');
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// };


const bindNavButtons = () => {
  $('#maps-new').click(newMap);
  $('#login-button').click(login);
  $('#maps-view-all').click({ state: 0}, changeView);
  $('#maps-view-fav').click({ state: 1}, changeView);
  $('#maps-view-edit').click({ state: 2}, changeView);
};

const login = () => {
  $.get('/login');
  $
    .get(`/users/${Cookies.get('userId')}`)
    .then(name => {
      $('#username').text(name);
      $('#login-button').text("Logout");
    });
};

const newMap = () => {
  $
    .post('/maps/', {
      creator_id: Cookies.get('userId'),
    })
    .then(map => {
      console.log(map);
      loadMaps();
    });
};

const changeView = state => {
  Cookies.set('viewState', state.data.state);
  loadMaps();
};

const loadMaps = () => {
  const viewState = Cookies.get('viewState');
  const paths = ['/', '/favourites', '/editable'];
  const path = paths[viewState];

  console.log(`Fetching maps from /maps${path}...`);

  // need to fetch filtered maps but also favourited maps
  // to compare and colour heart so need two promises
  const p1 = $.get('/maps' + path);
  const p2 = $.get('/maps/favourites');

  // When both promises resolve pass both values into rendermaps
  Promise
    .all([p1, p2])
    .then(values => {
      console.log(values);
      renderMaps(...values);
    })
    .catch(err => {
      console.log('LoadMaps error');
      console.log(err);
      console.error(err.stack);
    });
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
  const apiKey = Cookies.get('mapsAPIKey');

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
      <i class="fa-solid fa-trash-can"></i>
    </div>
    <img src="${thumbnail}" alt="">
    <div class="card-text">
      <div class="card-url">localhost:8080/maps/${map.id}</div>
      <h3>${map.name}</h3>
    </div>
  </a>
  `);

  const toggleFavourite = function(event) {
    event.preventDefault();
    const mapUser = {
      userId: Cookies.get('userId'),
      mapId: map.id
    };

    if ($(this).hasClass('red')) {
      console.log(`Removing ${map.name} from favourites...`);
      $(this).removeClass('red');
      $.
        post('/favourites/delete', mapUser)
        .then(loadMaps);

    } else {
      console.log(`Adding ${map.name} to favourites...`);
      $(this).addClass('red');
      $
        .post('/favourites', mapUser)
        .then(loadMaps);
    }
  };

  const toggleShare = function(event) {
    event.preventDefault();
    $mapCard.find('.card-url').slideToggle();
  };

  const delMap = function(event) {
    event.preventDefault();
    $
      .get(`/maps/${map.id}/delete`)
      .then(loadMaps);
  };

  // Bind actions to buttons
  $mapCard.find('.card-url').hide();
  $mapCard.find('.fa-heart').click(toggleFavourite);
  $mapCard.find('.fa-share').click(toggleShare);
  $mapCard.find('.fa-trash-can').click(delMap);

  if (isFav) {
    $mapCard.find('.fa-heart').addClass('red');
  }

  return $mapCard;
};

