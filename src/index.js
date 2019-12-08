const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const fetch = require("node-fetch");

const user = require("./model");

const mongoose = require("mongoose");
const uri = "mongodb://172.19.0.3:27017/social";

try {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (error) {
  console.log(error);
}

const app = express();

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "template")));

app.post("/login-with-facebook", async (req, res) => {
  const { accessToken, userID } = req.body;

  const response = await fetch(
    `https://graph.facebook.com/v5.0/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`
  );
  const json = await response.json();

  if (json.id === userID) {
    console.log(json);

    const currentUser = await user.findOne({ faceBookID: userID });

    console.log(currentUser);

    if (currentUser) {
      // user is registered create a session
      console.log("user exist");
      return res.send({ status: "ok", data: "you are logged in" });
    } else {
      console.log("user not exist");
      const newUser = new user({
        name: json.name,
        faceBookID: userID,
        accessToken
      });

      await newUser.save();
      return res.send({
        status: "ok",
        data: "you are registered and logged in "
      });
    }
  } else {
    // invalid user
    return res.send({ status: "ok", data: "wrong" });
  }
});

https
  .createServer(
    {
      key: fs.readFileSync("./server.key"),
      cert: fs.readFileSync("./server.cert")
    },
    app
  )
  .listen(3000, _ => console.log("server run"));
