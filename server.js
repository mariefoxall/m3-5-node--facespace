"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200);
  res.render("pages/homepage", {
    users: users,
    currentUser: currentUser,
  });
};

const handleProfilePage = (req, res) => {
  const currentProfile = users.find((user) => {
    return user._id === req.params.id;
  });
  if (currentProfile !== undefined) {
    res.status(200).render("pages/profile", {
      users: users,
      user: currentProfile,
      currentUser: currentUser,
    });
  } else {
    res.status(404).send("I couldn't find what you're looking for.");
  }
};

const handleSignin = (req, res) => {
  if (currentUser._id) {
    res.status(200).render("pages/homepage", {
      users: users,
      currentUser: currentUser,
    });
  } else {
    res.status(200).render("pages/signin", {
      users: users,
      currentUser: currentUser,
    });
  }
};

const handleName = (req, res) => {
  let firstName = req.body.firstName;
  console.log(firstName);
  currentUser = users.find((user) => {
    return user.name === firstName;
  });
  if (currentUser !== undefined) {
    res.status(200).redirect(`/users/${currentUser._id}`);
  } else {
    res.status(404).redirect("/signin");
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints

  .get("/", handleHomepage)

  .get("/users/:id", handleProfilePage)

  .get("/signin", handleSignin)

  .post("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
