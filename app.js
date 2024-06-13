const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const flash = require("express-flash");
const session = require("express-session");
const helpers = require("./helpers");
const fileUpload = require("express-fileupload");

dotenv.config({
  path: "./.env",
});

const app = express();
const publicDirectory = path.join(__dirname, "./public");

// 1 year cache time for everything under public folder
const cacheTime = process.env.PUBLIC_DIRECTORY_CACHE_TIME;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDirectory, { maxAge: cacheTime }));

// Set up Handlebars with helpers
const hbs = exphbs.create({
  helpers: helpers,
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
});

// UNCOMMENT WHEN NEEDED (for session stuff)
// =====================================================
// app.use(
//   session({
//     cookie: { maxAge: process.env.SESSION_MAX_AGE },
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     rolling: true,
//     saveUninitialized: false,
//   })
// );
// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.message = req.session.message;
//   delete req.session.message;
//   next();
// });
// =======================================================

// Set Handlebars as the view engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// enable file uploads
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Define Routes directory
app.use("/", require("./routes/pages"));

app.listen(process.env.PORT, (err) =>
  !err
    ? console.log("Server started on Port " + process.env.PORT)
    : console.log("Something went wrong\n", err)
);
