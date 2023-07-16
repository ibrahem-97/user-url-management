// Required imports and dependencies

const express = require("express");
const { handleNotFound, handleErrors } = require("./app/utils/errorHandlers");
const bodyParser = require("body-parser");
const multer = require("multer");
var fs = require("fs");

const app = express();
// Configure multer for file upload

var dir = "uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Specify the directory to save the profile pictures
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename for the profile picture
  },

  fileFilter: function fileFilter(_req, file, cb) {
    const givenExtension = path.extname(file.originalname).replace(".", "");
    const allowdExtensions = ["pdf", "png", "jpeg", "jpg"]; // list of allowed file types
    const index = allowdExtensions.indexOf(givenExtension);
    index >= 0
      ? cb(null, true) // file type allowed
      : cb(new Error("extension_not_allowed"), false);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    files: 1,
    fileSize: 8000000,
    fields: 6,
    fieldSize: 500000,
  },
});
app.use(upload.any());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware setup
app.use(express.json());

// Routes setup
app.use("/auth", require("./app/routes/authRoutes"));
app.use("/users", require("./app/routes/userRoutes"));
app.use("/urls", require("./app/routes/urlRoutes"));

// Error handler middleware
app.use(handleNotFound);
app.use(handleErrors);

// Server setup

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
