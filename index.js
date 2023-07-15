// Required imports and dependencies

const express = require("express");
const { handleNotFound, handleErrors } = require("./app/utils/errorHandlers");

const app = express();

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
