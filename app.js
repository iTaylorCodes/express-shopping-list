const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");
const ExpressError = require("./expressError");

app.use(express.json());
app.use("/items", itemsRoutes);

app.use((req, res, next) => {
  // Custom 404 Page
  const err = new ExpressError("Page not found", 404);
  return next(err);
});

app.use(function (err, req, res, next) {
  // Set a default status code
  let status = err.status || 500;
  let msg = err.msg;

  // Set status and alert the user
  return res.status(status).json({ error: { msg, status } });
});

module.exports = app;
