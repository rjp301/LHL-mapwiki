// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/login", (req, res) => {
  console.log(process.env.USER_ID);
  res.cookie('userId', process.env.USER_ID);
  res.cookie('mapsAPIKey', process.env.API_KEY);
  res.redirect("/");
});

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./routes/maps");
const pinsRoutes = require("./routes/pins");
const favouritesRoutes = require("./routes/favourites");
const map_editorsRoutes = require("./routes/map_editors");

// Mount all resource routes
app.use('/users', usersRoutes);
app.use('/maps', mapsRoutes);
app.use('/pins', pinsRoutes);
app.use('/favourites', favouritesRoutes);
app.use('/map_editors', map_editorsRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
