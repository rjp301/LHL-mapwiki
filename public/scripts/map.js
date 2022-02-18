/* global window, document, google, Cookies */
//initialize the map as a global valuable//
let map;
let allPins = {};
const mapId = window.location.pathname.split("/")[2];

$().ready(() => {
  initializePage();
  initMap();
  loadPins();
});

const getMap = () => {
  return $.get(`/maps/api/${mapId}`);
};

const initializePage = () => {
  // Load in map title and description
  // Need edit functionality implemented
  getMap().then((mapObject) => {
    $("#map-title").text(mapObject.name);
    $("#map-description").text(mapObject.description);
  });

  $("#edit-map").click(editMapInfo);

  // Change username
  $.get(`/users/${Cookies.get("userId")}`).then((name) =>
    $("#username").text(name)
  );

  // Assign button functions
  $("#new-pin").click(addPin);
};

// fetch user coordinates
const findUserLocation = () => {
  let position;
  navigator.geolocation.getCurrentPosition((position) => {
    position = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    map.setCenter(position);
  });
  return position;
};

const initMap = () => {
  getMap().then((mapObject) => {
    //if map is blank, center map on user coordinates
    if (!mapObject.avg_lat || !mapObject.avg_lng) {
      centerCoords = findUserLocation();
    } else {
      centerCoords = { lat: mapObject.avg_lat, lng: mapObject.avg_lng };
    }
    map = new google.maps.Map(document.getElementById("map"), {
      center: centerCoords,
      zoom: 14,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
    });
  });
};

//// MODIFYING MAP TITLE/DESCRIPTION ////
// send map data to database
const sendMapData = (mapData) => {
  $.ajax({
    url: `/maps/${mapId}`,
    method: "POST",
    data: mapData,
  });
};

//set selected text fields to editable or default
const toggleTextFields = (editable, texts) => {
  for (const item in texts) {
    if (editable) {
      texts[item].attr("contenteditable", "true");
      texts[item].css("background-color", "gainsboro");
    } else {
      texts[item].attr("contenteditable", "false");
      texts[item].css("background-color", "inherit");
    }
  }
};

// Update map title and description
const editMapInfo = function () {
  const $editButton = $(this);
  const $mapTitle = $("#map-title");
  const $mapDesc = $("#map-description");
  const mapInfo = { title: $mapTitle, description: $mapDesc };

  //toggle between "edit" and "save changes" when clicking edit button
  $editButton.toggleClass("edit-active");

  if ($editButton.hasClass("edit-active")) {
    $editButton.text("Save Changes");
    toggleTextFields(true, mapInfo);
  } else {
    $editButton.text("Edit Map");
    toggleTextFields(false, mapInfo);

    //collect and submit updated texts
    const mapData = {
      name: $mapTitle.text(),
      description: $mapDesc.text(),
    };
    sendMapData(mapData);
  }
};

////

const loadPins = () => {
  getMap().then((mapObject) => {
    $.get(`/pins/bymap/${mapObject.id}`)
      .then((pins) => renderPins(pins))
      .catch((err) => {
        console.log(err);
        console.error(err.stack);
      });
  });
};

const renderPins = (pins) => {
  const $pinList = $("#location-list");
  $pinList.empty();
  clearMapPins();
  for (const pin of pins) {
    const pinObject = createMapPin(pin); // add pin to map and pinlist
    $pinList.append(createPinElement(pin, pinObject)); // add pin to sidebar
  }
};

const clearMapPins = () => {
  const pinKeys = Object.keys(allPins);
  pinKeys.forEach((i) => allPins[i].pinMarker.setMap(null));
  allPins = {};
};

const closeAllWindows = () => {
  // const keys = Object.keys(allPins);
  // keys.forEach(i => allPins[i].pinWindow.close());
  google.maps.event.trigger(map, "click");
};

const createPinElement = (pin, pinObject) => {
  const $pin = $(`
  <div class="pin-item">
  <div class="pin-name">${pin.title}</div>
  <div class="icon-group">
  <i class="fa-solid fa-trash-can"></i>
  <i class="fa-solid fa-pen-to-square"></i>
  </div>
  </div>
  `);

  //// Need implementation ////
  const editPin = (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeAllWindows();

    const contentString = `
    <div class='info-window'>
      <div contenteditable="true" id="new-pin-img">${pin.image_url}</div>
      <h3 contenteditable="true" id="new-pin-title">${pin.title}</h3>
      <p contenteditable="true" id="new-pin-desc">${pin.description}</p>
      <div class="btn-group">
        <button class="pin-save">Save Changes</button>
      </div>
    </div>
    `;

    const editWindow = new google.maps.InfoWindow({ content: contentString });

    editWindow.open(map, pinObject.pinMarker);

    google.maps.event.addListener(editWindow, "domready", () => {
      $(".pin-move").click(() => {
        //
      });

      $(".pin-save").click(() => {
        // get values from window and send to database
        const newPin = {
          title: $("#new-pin-title").text(),
          image_url: $("#new-pin-img").text(),
          description: $("#new-pin-desc").text(),
        };

        $.post(`/pins/${pin.id}`, newPin)
          .then(() => {
            google.maps.event.trigger(map, "click");
            loadPins();
          })
          .catch((err) => console.error(err.stack));
      });
    });

    map.addListener("click", () => {
      editWindow.close();
    });
  };

  const deletePin = (event) => {
    event.preventDefault();
    event.stopPropagation();
    $.get(`/pins/${pin.id}/delete`)
      .then(loadPins)
      .catch((err) => console.error(err.stack));
  };

  $pin.click(() => {
    google.maps.event.trigger(pinObject.pinMarker, "click");
  });
  $pin.find(".fa-trash-can").click(deletePin);
  $pin.find(".fa-pen-to-square").click(editPin);

  return $pin;
};

const createMapPin = (pin) => {
  //Add pin to map along with all accompanying infrastructure
  const mapPin = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map,
  });

  const contentString = `
  <div class='info-window'>
  <img src='${pin.image_url}'>
  <h3 >${pin.title}</h3>
  <p>${pin.description}</p>
  </div>
  `;

  const infoWindow = new google.maps.InfoWindow({
    content: contentString,
  });

  mapPin.addListener("click", () => {
    closeAllWindows();
    mapPin.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => {
      mapPin.setAnimation(null);
      infoWindow.open({
        anchor: mapPin,
        map,
        shouldFocus: true,
      });
    }, 500);
  });

  map.addListener("click", () => {
    infoWindow.close();
  });

  const pinObject = {
    rawPin: pin,
    pinMarker: mapPin,
    pinWindow: infoWindow,
  };
  allPins[pin.id] = pinObject;
  return pinObject;
};
// }

const addPin = function () {
  const listener = map.addListener("click", (event) => {
    const pin = {
      map_id: mapId,
      lat: event.latLng.lat,
      lng: event.latLng.lng,
    };
    console.log(pin);
    google.maps.event.removeListener(listener); // remove listener after single use
    $.post("/pins/new", pin)
      .then(loadPins)
      .catch((err) => console.error(err.stack));
  });
};

//
//
// future/stretch ideas //
//could add optional drag function //
//in routes/queries, add || to determine which fields get updated and which stay the same value
// google.maps.event.addListener(marker, 'dragend', function (evt) {
//   const pinNewPosition = evt.latLng;
//   $.ajax({
//     url: "/pins/:id",
//     method: 'POST',
//     data: pinNewPosition
//   });
//   // map.panTo(evt.latLng);
// })

// click pin to toggle infowindow
// if (infowindowIsOpen) {
//   infowindow.close();
//   infowindowIsOpen = false;
// } else if (!infowindowIsOpen) {
