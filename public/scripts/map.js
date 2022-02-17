/* global window, document, google, Cookies */
//initialize the map as a global valuable//
let map;
let allPins = {};
let infowindowIsOpen = false;
const mapId = window.location.pathname.split("/")[2];

$().ready(() => {

  $
    .get(`/maps/api/${mapId}`)
    .then(mapObject => {
      initializePage(mapObject);
      initMap(mapObject);
      loadPins(mapObject);
    })
    .catch(err => console.error(err.stack));
});

const initializePage = (mapObject) => {
  // Load in map title and description
  $('#map-title').text(mapObject.name);
  $('#map-description').text(mapObject.description);

  // Change username
  $
    .get(`/users/${Cookies.get('userId')}`)
    .then(name => $('#username').text(name));

  // Assign button functions
  $('#new-pin').click(addPin);
};

const initMap = function(mapObject) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: mapObject.avg_lat, lng: mapObject.avg_lng },
    zoom: 14,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });
};

const loadPins = (mapObject) => {
  $
    .get(`/pins/bymap/${mapObject.id}`)
    .then(pins => renderPins(pins))
    .catch(err => console.error(err.stack));
};

const renderPins = pins => {
  const $pinList = $('#location-list');
  $pinList.empty();
  clearMapPins();
  for (const pin of pins) {
    $pinList.append(createPinElement(pin));
    createMapPin(pin);
  }
};

const clearMapPins = () => {
  const pinKeys = Object.keys(allPins);
  pinKeys.forEach(i => allPins[i].pinMarker.setMap(null));
  allPins = {};
};

const createPinElement = (pin) => {
  const $pin = $(`
  <div class="pin-item">
    <div class="pin-name">${pin.title}</div>
    <div class="icon-group">
      <i class="fa-solid fa-trash-can"></i>
      <i class="fa-solid fa-pen-to-square"></i>
    </div>
  </div>
  `);

  const editPin = function() {

  };

  const deletePin = function() {
    $
      .get(`/pins/${pin.id}/delete`)
      .then(loadPins)
      .catch(err => console.error(err.stack));
  };

  $pin.find('.fa-trash-can').click(deletePin);
  $pin.find('.fa-pen-to-square').click(editPin);

  return $pin;
};

const createMapPin = (pin) => {
  const mapPin = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map,
  });

  const contentString = `
    <div class='info-window'>
      <h3>${pin.title}</h3>
      <img src='${pin.image_url}'>
      <p>${pin.description}</p>
    </div>
    `;

  const infoWindow = new google.maps.InfoWindow({
    content: contentString
  });

  mapPin.addListener('click', () => {
    infoWindow.open({
      anchor: mapPin,
      map,
      shouldFocus: true,
    });
  });

  map.addListener('click', () => {
    infoWindow.close();
  });

  allPins[pin.id] = {
    rawPin: pin,
    pinMarker: mapPin,
    pinWindow: infoWindow
  };
};

const addPin = function() {

  const listener = map.addListener('click', event => {
    const pin = {
      map_id: mapId,
      lat: event.latLng.lat,
      lng: event.latLng.lng
    };
    console.log(pin);
    google.maps.event.removeListener(listener); //
    $
      .post('/pins/new', pin)
      .then(loadPins)
      .catch(err => console.error(err.stack));
  });
};


// //get mapid from route/
// const pathname = window.location.pathname;
// const mapId = pathname.split("/")[2];

//   $().ready(() => {
//     fetchMap();
//     selectPinOnMap();
//     loadEditMapListener();
//   });


//   //// For updating map title, description ////
//   // set click listener for updating map title and description
//   const loadEditMapListener = () => {

//     $("#floating-menu").on("click", ".inner-editmap-btn", function () {

//       const $editButton = $(this);
//       const $mapTitle = $("#list-of-locations > h2");
//       const $mapDesc = $("#list-of-locations > p");
//       const mapInfo = { title: $mapTitle, description: $mapDesc };

//       //toggle between "edit" and "save changes" when clicking edit button
//       $editButton.toggleClass("edit-active");

//       if ($editButton.hasClass("edit-active")) {
//         $editButton.text("Save Changes");
//         toggleTextFields(true, mapInfo);
//       } else {
//         $editButton.text("Edit");
//         toggleTextFields(false, mapInfo);

//         //collect and submit updated texts
//         const mapData = {
//           name: $mapTitle.text(),
//           description: $mapDesc.text(),
//         }
//         sendMapData(mapData);
//       }
//     })
//   }

//   // send map data to database
//   const sendMapData = (mapData) => {
//     $.ajax({
//       url: `/maps/${mapId}`,
//       method: "POST",
//       data: mapData,
//     })
//   }
//   // set selected text fields to editable or default
//   const toggleTextFields = (editable, texts) => {
//     for (const item in texts) {
//       if (editable) {
//         texts[item].attr("contenteditable", "true");
//         texts[item].css("background-color", "gainsboro");
//       } else {
//         texts[item].attr("contenteditable", "false");
//         texts[item].css("background-color", "inherit");
//       }
//     }
//   };



//   // show pin position on map when selected from side menu
//   const selectPinOnMap = () => {
//     $('#floating-menu').on('mouseover', 'li', function () {
//       const $listOfPins = $('ul').children();
//       for (let i = 0; i < $listOfPins.length; i++) {
//         $($listOfPins[i]).on("click", () => {
//           showSelectedPinOnMap(i);
//           // work in progress -- OPTION TO HIGHLIGHT THE SELECTED TEXT WHEN PIN IS ACTIVE
//           // if ($($listOfPins[i]).hasClass("green")) {
//           //   $($listOfPins[i]).removeClass("green");
//           // } else {
//           //   $($listOfPins[i]).addClass("green");
//           // }
//         })
//       }
//     })
//   }

//   // bounce and show selected pin on map
//   const showSelectedPinOnMap = function(index) {
//     //show pin data card
//     google.maps.event.trigger(allPins[index], 'click');

//     //bounce pin
//     allPins[index].setAnimation(google.maps.Animation.BOUNCE);
//     setTimeout(() => {
//       allPins[index].setAnimation(null);
//     }, 350);
//   };

//   // refresh sidebar with newest pin added
//   const reloadSidebar = () => {
//     $(".pin-list").empty();
//     allPins = [];
//     fetchPins(mapId);
//   };

//   //Load fullsize google map//
//   const initMap = (mapData) => {
//     map = new google.maps.Map(document.getElementById("map"), {
//       zoom: 12,
//       center: { lat: mapData.avg_lat, lng: mapData.avg_lng },
//       streetViewControl: false,
//       fullscreenControl: false,
//       mapTypeControl: false,
//     });

//     // Listen for any clicks on the map
//     map.addListener("click", onMapClick);
//   };

//   // Add a new marker when clicking map
//   const onMapClick = (event) => {
//     const coordinates = event.latLng;
//     addNewPin(coordinates);
//   };

//   // Add a new pin to map
//   const addNewPin = (position) => {
//     const newPin = new google.maps.Marker({
//       position,
//       map,
//     });

//     const pinData = {
//       map_id: mapId,
//       title: "Untitled pin",
//       description: "Enter description",
//       image_url: "Image URL",
//       latitude: newPin.getPosition().lat(),
//       longitude: newPin.getPosition().lng(),
//     };
//     infowindowIsOpen = true;
//     addPinToDatabase(pinData);
//   };

//   // Add new pin to Database
//   const addPinToDatabase = (pinData) => {
//     $.ajax({
//       url: "/pins/new",
//       method: "POST",
//       data: pinData,
//     })
//       .then(() => {
//         reloadSidebar();
//       })
//       .catch((err) => console.log("OOPSIE DOOPSIE", err.message));
//   };

//   //create map pins//
//   const mapPins = (pin) => {
//     const marker = new google.maps.Marker({
//       position: { lat: pin.lat, lng: pin.lng },
//       map: map,
//       draggable: true
//     });
//     allPins.unshift(marker);

//     //shows infowindow when click map pin//
//     marker.addListener("click", () => {
//       const infoWindow = mapInfo(pin);

//       infowindow.open({
//         anchor: marker,
//         map,
//         });
//       //   infowindowIsOpen = true;
//       // }

//         // work in progress ---
//         // click pin to toggle infowindow
//       //   if (infowindowIsOpen) {
//       //   infowindow.close();
//       //   infowindowIsOpen = false;
//       // } else if (!infowindowIsOpen) {
//       //     infowindow.open({
//       //     anchor: marker,
//       //     map,
//       //     });
//       //     infowindowIsOpen = true;
//       // }
//     });
//   };

//   //create map info//
//   const mapInfo = (pin) => {
//     return (infowindow = new google.maps.InfoWindow({
//       content: generateInfoContent(pin),
//     }));
//   };

//   //Initial infowindow HTML skeleton//
//   const generateInfoContent = (pin) => {
//     const content = `
//     <div class='info-window'>
//       <h3>${pin.title}</h3>
//       <img src='${pin.image_url}'>
//       <p>${pin.description}</p>
//       <div class='info-buttons'>
//         <img onClick="deletePin(${pin.id})" class='pin-trash' src='../docs/icons8-waste-50.png'>
//         <div >
//           <img onClick='editPin("${pin.id}, ${pin.title}, ${pin.image_url}, ${pin.description}")' class='pin-edit' src='../docs/icons8-pencil-50.png'>
//         </div>
//       </div>
//     </div>
//     `;
//     return content;
//   };

//   //Edit pin when click the pen icon

//   const editPin = (pinId, pinTitle, pinImg, pinDesc) => {
//     console.log("coming from edit pin ", pinId, pinTitle, pinImg, pinDesc);
//     const editContent = `
//     <form >
//       <label>Title</label>
//       <input type="text" value="${pinTitle}">
//       <label>Description</label>
//       <input type="text" value="${pinDesc}">
//       <label>Image URL</label>
//       <input type="text" value="${pinImg}">
//       <button onClick="editSubmit(${pinId})">Edit</button>
//     </form>`;

//     $(".info-window").empty().append(editContent);
//   };

//   const editSubmit = (pinId) => {
//     const pinData = {};
//     $.post(`/pins/${pinId}`, pinId, pinData)
//       .then(() => {
//         console.log(`Success to Edit pin`);
//       })
//       .catch((err) => {
//         console.log(`Edit pin Error :`, err.message);
//       });
//   };

//   //create HTML skeleton//
//   const createMapElement = (map) => {
//     const mapName = map.name;
//     const mapDesc = map.description;
//     const $map = `
//       <section id="list-of-locations">
//         <a id="back-to-maps" href="/">Back to maps</a>
//         <h2>${mapName}</h2>
//         <p>${mapDesc}</p>
//         <ul class='pin-list'>
//         </ul>
//       </section>
//       <div id="map-buttons">
//         <button class="inner-editmap-btn">Edit</button>
//         <button class="inner-fav-btn">Fav</button>
//         <button class="inner-share-btn">Share</button>
//       </div>
//   `;
//     return $map;
//   };



//   const fetchMap = () => {
//     $.get(`/maps/api/${mapId}`).then((map) => renderMap(map));
//   };

//   const fetchPins = (mapId) => {
//     $.get(`/pins/bymap/${mapId}`).then((pins) => {
//       renderPins(pins);
//     });
//   };

//   const renderMap = function (map) {
//     initMap(map);
//     fetchPins(map.id);

//     $("#floating-menu").empty();
//     const $map = createMapElement(map);
//     $("#floating-menu").append($map);
//   };

//   //delete pin when click the trash icon//
//   const deletePin = (pinId) => {
//     $.get(`/pins/${pinId}/delete`).then(() => {
//       alert("pin is deleted");
//     });
//     fetchMap();
//   };


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
