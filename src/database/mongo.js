const mongoose = require("mongoose");

const { MONGO_USER, MONGO_PASS, MONGO_DB } = process.env;

const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.h3ocx.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log(err));
