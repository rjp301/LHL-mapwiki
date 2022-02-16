//first initialize the map as a global valuable//
let map;

//get mapid from route/
const pathname = window.location.pathname;
const mapId = pathname.split("/")[2];

$(document).ready(() => {
  fetchMap();
  // const $addPinButton = $('#floating-menu').children('.add-marker')
  // $addPinButton.on('click', console.log('YO YO YO'));
});

const reloadSidebar = () => {
  $(".pin-list").empty();
  fetchPins(mapId);
};

//Load fullsize google map//
const loadMap = (mapData) => {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: mapData.avg_lat, lng: mapData.avg_lng },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });

  // Listen for any clicks on the map
  map.addListener("click", onMapClick);
};

// Add a new marker when clicking map
const onMapClick = (event) => {
  const coordinates = event.latLng;
  addNewPin(coordinates);
};

// Add a new marker to map
const addNewPin = (position) => {
  const newPin = new google.maps.Marker({
    position,
    map,
  });

  //fun little bounce animation: for later use :)
  // newPin.setAnimation(google.maps.Animation.BOUNCE);

  const pinData = {
    map_id: mapId,
    title: "Untitled pin",
    description: "Enter description",
    image_url: "Image URL",
    latitude: newPin.getPosition().lat(),
    longitude: newPin.getPosition().lng(),
  };

  // New marker is automatically added to database
  $.ajax({
    url: "/pins/new",
    method: "POST",
    data: pinData,
  })
    .then(() => {
      reloadSidebar();
    })
    .catch((err) => console.log("OOPSIE DOOPSIE", err.message));
};

//For google map pins//
const mapPins = (pin) => {
  const marker = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map: map,
  });

  marker.addListener("click", () => {
    const infoWindow = mapInfo(pin);

    infowindow.open({
      anchor: marker,
      map,
    });
  });
};

//Initial infowindow HTML skeleton//
const generateInfoContent = (pin) => {
  const content = `
  <div class='info-window'>
     <h3>${pin.title}</h3>
     <img src='${pin.image_url}'>
     <p>${pin.description}</p>
     <div class='info-buttons'>
       <img onClick="deletePin(${pin.id})" class='pin-trash' src='../docs/icons8-waste-50.png'>
       <div >
        <img onClick='editPin("${pin.id}, ${pin.title}, ${pin.image_url}, ${pin.description}")' class='pin-edit' src='../docs/icons8-pencil-50.png'>
       </div>
     </div>
  </div>
  `;
  return content;
};

//For google map info//
const mapInfo = (pin) => {
  return (infowindow = new google.maps.InfoWindow({
    content: generateInfoContent(pin),
  }));
};

//Edit pin when click the pen icon

const editPin = (pinId, pinTitle, pinImg, pinDesc) => {
  console.log("coming from edit pin ", pinId, pinTitle, pinImg, pinDesc);
  const editContent = `
  <form >
     <label>Title</label>
     <input type="text" value="${pinTitle}">
     <label>Description</label>
     <input type="text" value="${pinDesc}">
     <label>Image URL</label>
     <input type="text" value="${pinImg}">
    <button onClick="editSubmit(${pinId})">Edit</button>
  </form>`;

  $(".info-window").empty().append(editContent);
};

const editSubmit = (pinId) => {
  const pinData = {};
  $.post(`/pins/${pinId}`, pinId, pinData)
    .then(() => {
      console.log(`Success to Edit pin`);
    })
    .catch((err) => {
      console.log(`Edit pin Error :`, err.message);
    });
};

//create HTML skeleton//
const createMapElement = (map) => {
  const mapName = map.name;
  const mapDesc = map.description;
  const $map = `
    <section id="list-of-locations">
      <a id="back-to-maps" href="/">Back to maps</a>
      <h2>${mapName}</h2>
      <p>${mapDesc}</p>
      <ul class='pin-list'>
      </ul>
    </section>
    <div id="map-buttons">
      <button class="add-marker">Add</button>
      <button class="share-btn">Share</button>
    </div>
 `;
  return $map;
};

const renderPins = (pins) => {
  for (const pin of pins) {
    mapPins(pin);
    $(".pin-list").prepend(`<li>${pin.title}</li>`);
  }
};

const fetchMap = () => {
  $.get(`/maps/api/${mapId}`).then((map) => renderMap(map));
};

const fetchPins = (mapId) => {
  $.get(`/pins/bymap/${mapId}`).then((pins) => {
    renderPins(pins);
  });
};

const renderMap = function (map) {
  loadMap(map);
  fetchPins(map.id);

  $("#floating-menu").empty();
  const $map = createMapElement(map);
  $("#floating-menu").append($map);
};

//delete pin when click the trash icon//
const deletePin = (pinId) => {
  $.get(`/pins/${pinId}/delete`).then(() => {
    alert("pin is deleted");
  });
  fetchMap();
};
