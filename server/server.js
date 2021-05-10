const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

let corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use;

const db = require("./models");
const Role = db.role;
const dbConfig = require("./config/db.config");

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "donater",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'donater' to roles collection");
      });

      new Role({
        name: "volunter",
      }).save((err) => {
        if (err) {
          console.log("", err);
        }

        console.log("added 'volunter' to roles collection");
      });
    }
  });
}

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(8000);
