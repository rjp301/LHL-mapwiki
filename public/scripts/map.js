//first initialize the map as a global valuable//
let map;

//get mapid from route/
const pathname = window.location.pathname;
const mapId = pathname.split("/")[2];
$(document).ready(() => {
  // const $addPinButton = $('#floating-menu').children('.add-marker')
  // $addPinButton.on('click', console.log('YO YO YO'));
  // const $editSubmit = $(".edit-form").children(".edit-submit");
  // $editSubmit.on("click", editSubmit);
  console.log("add click");
  $(document).on("#edit-form", "submit", submitEdit);
  fetchAppMap();
  // initialize();
  // loadMap(mapData);
});

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
// function initialize() {
//   var mapProp = {
//     center: new google.maps.LatLng(38, -78),
//     zoom: 6,
//     mapTypeId: google.maps.MapTypeId.ROADMAP,
//   };
//   map = new google.maps.Map(document.getElementById("map"), mapProp);
// }

const submitEdit = (e) => {
  e.preventDefault();

  console.log("hello");

  // const title = $(".edit-title").text();
  // const description = $(".edit-description").text();
  // const url = $(".edit-url").text();

  // const pinData = { title, description, url };

  // $.post(`/pins/${pinId}`, pinData)
  //   .then(() => {
  //     console.log(`Success to Edit pin`);
  //     fetchMap();
  //   })
  //   .catch((err) => {
  //     console.log(`Edit pin Error :`, err.message);
  //   });
};

const reloadSidebar = () => {
  $(".pin-list").empty();
  fetchPins(mapId);
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

//create map pins//
const mapPins = (pin) => {
  const marker = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map: map,
  });

  //shows infowindow when click map pin//
  marker.addListener("click", () => {
    const infoWindow = mapInfo(pin);

    infowindow.open({
      anchor: marker,
      map,
    });
  });
};

//creat map info//
const mapInfo = (pin) => {
  return (infowindow = new google.maps.InfoWindow({
    content: generateInfoContent(pin),
  }));
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

        <img onClick='editPin(${pin.id})' class='pin-edit' src='../docs/icons8-pencil-50.png'>
       </div>
     </div>
  </div>
  `;
  return content;
};

//Edit pin when click the pen icon

const editPin = (pinId) => {
  //these are existing data from the database //
  // console.log("coming from edit pin ", pinId, pinTitle, pinImg, pinDesc);

  const editContent = `
  <form id="edit-form" method="POST" >
     <label>Title</label>
     <input name="title" type="text" class="edit-title">
     <label>Description</label>
     <input name="description" type="text" class="edit-description">
     <label>Image URL</label>
     <input name="url" type="text" class="edit-url">

    <button class='edit-submit' type="button">Edit</button>

  </form>`;

  //when user add in the new input and sumbit it with Edit button//
  //send the data to editSubmit function (pinTitle, pinDesc, pinImg, pinId)
  // <button onClick="console.log("hi")" class="edit-submit" >Edit</button>
  $(".info-window").empty().append(editContent);
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

const fetchAppMap = () => {
  $.get(`/maps/api/${mapId}`)
    .then((map) => renderMap(map))
    .catch((error) => {
      console.log(error.message);
    });
};

const fetchPins = (mapId) => {
  return $.get(`/pins/bymap/${mapId}`)
    .then((pins) => {
      renderPins(pins);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const renderMap = function (map) {
  // loadfullMap(map);
  // fetchPins(map.id).then(() => {
  //   $("#floating-menu").empty();
  //   const $map = createMapElement(map);
  //   $("#floating-menu").append($map);
  // });
};

//delete pin when click the trash icon//
const deletePin = (pinId) => {
  $.get(`/pins/${pinId}/delete`).then(() => {
    console.log(`delete pin`);
  });
  fetchAppMap();
};
