(function () {
  $(document).ready(() => {
    renderMap();
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}

$(() => {
  const $newMap = $('#new-map');

  $newMap.on('click', () => {
    console.log('hi');
    $('.nav').slideUp(250);
  })
});

// (function () {
//   $(document).ready(() => {
//     renderMap();
//   });

//   //create HTML skeleton//
//   const createMapElement = () => {
//     const $map = `

//     <section id="list-of-locations">
//       <button id="back-to-maps">Back to maps</button>
//       <h2>My places</h2>
//       <ul>
//         <li>Place 1</li>
//         <li>Place 2</li>
//         <li>Place 3</li>
//       </ul>
//     </section>
//     <div id="map-buttons">
//       <button class="add-marker">Add</button>
//       <button class="share-btn">Share</button>
//     </div>

//  `;
//     return $map;
//   };

//   const renderMap = function (map) {
//     $("#floating-menu").empty();
//     const $map = createMapElement(map);
//     $("#floating-menu").append($map);
//   };
// })();
