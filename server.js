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
  });
};

const handleProfilePage = (req, res) => {
  const currentUser = users.find((user) => {
    return user._id === req.params.id;
  });
  res.status(200).render("pages/profile", {
    users: users,
    user: currentUser,
  });
};

const handleSignin = (req, res) => {
  res.status(200).render("pages/signin");
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

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
