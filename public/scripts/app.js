$().ready(() => {
<<<<<<< HEAD
  // const $container = $('body > section');
  bindNavButtons();
=======
  bindNavButtons();

  const $container = $('main');
  $container.append($(`<div id="map-container"></div>`));
>>>>>>> mapIndex
});

const readCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (const i = 0; i < ca.length; i++) {
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
    console.log($mapId)
};

const renderMaps = (maps) => {
  const $mapContainer = $('#map-container');
  $mapContainer.empty();
  for (const map of maps) {
    const $map = createMapElement(map);
    $mapContainer.append($map);
  }
}




const createMapElement = (map) => {
  const $mapCard = $(`
  <div class="card">
    <i class="fa-solid fa-heart heart-icon"></i>
    <img src="https://lh3.googleusercontent.com/hfTxtV7Li6wz2nOM24_imRCnKcEoxZZyI98rZBPlluTAmMpsnb-cg3qSc-OKX4I_FVcwrOHMNHaDceP_GpqB7a178xtaxFDtNu4EgZP6J2kYeboN6u-fIEDdyS7qYdcj4li02eHU59rRVKQT1Pry7NYLCzB0_r2tvLXZv00N9A5fxalYfJK0U-zWsFHj8ZsRTA_WQtkQzAcIF54d_FgZfcL6ANahsppEzJ8rwio3hSVsxA676dc4IIX0AgN5snX5zxUD1oTbYKTOjFXHSmbn30Mi3_CwK1u8eNEAGa_P71N5SFuU_F4XMov5hP4cSTlkiEmPNZuqfjAHf3T74vKVMPdHzL6sdHdMFtvU5brXclTyXPSw54csfHGD-AaCU6Go5LbnWaTobRBJOiQB7d7Mv6svodRm102ONsfbimgqT3MZwdMklUugld4_giz01a24B9hx7_ZieXycWK-6AwpkPhJUWl-vuP_DOXs_YOo0LxFbAq9Nf75dphTWvPQp-dMRgl9BZVJrOI2Ez6uDHGkK3q7LCvnvSMaSkkhO7gR6VGbM8GbJyyicoVYNdoKByX7hYEnsNwPAqgBoCFL_JsvmK-rYgQBiviXYvh_W-tqXL1acjSRvkg2_aaj8Z5OGWi4k-LKFvvEoRzBURM9q_UkJ9Y_a8rcah0lgz6XhIQsMaIDkez352p6nGbOusKpwrzyEKwAeMcEf_KFYy5QDTzQCYq8Q=w920-h485-no?authuser=0" alt="">
    <div class="card-text">
      <h3>${map.name}</h3>
      <p>${map.description}</p>
    </div>
  </div>
  `);

  // Is map a favourite already?

  const $favButton = $mapCard.find('.heart-icon');
  $favButton.toggle(
    () => {
      $.post('/favourites', {
        userId: readCookie('userId'),
        mapId: map.id
      })
    },
    () =>

  );
  return $mapCard;
};

