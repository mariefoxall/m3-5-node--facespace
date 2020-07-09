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
  console.log(currentUser);
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

const handleRemove = (req, res) => {
  const unfriendID = req.body.removeID.toString();
  const unfriendIndex = currentUser.friends.findIndex((friendID) => {
    return friendID === unfriendID;
  });
  currentUser.friends.splice(unfriendIndex, 1);
  const unfriended = users.find((user) => {
    return user._id === unfriendID;
  });
  const currentuserIndex = unfriended.friends.findIndex((friendID) => {
    return friendID === currentUser._id;
  });
  unfriended.friends.splice(currentuserIndex, 1);

  console.log(currentUser.friends);
  res.status(200).redirect(`/users/${unfriendID}`);
};

const handleAddFriend = (req, res) => {
  const newfriendID = req.body.addID.toString();
  const newFriend = users.find((user) => {
    return user._id === newfriendID;
  });
  newFriend.pendingfriends = [];
  newFriend.pendingfriends.push(currentUser._id);
  res.status(200).redirect(`users/${newfriendID}`);
};

const handleAccept = (req, res) => {
  const acceptFriendID = req.body.acceptfriendID.toString();
  currentUser.friends.push(acceptFriendID);
  const acceptFriend = users.find((user) => {
    return user._id === acceptFriendID;
  });
  acceptFriend.friends.push(currentUser._id);
  const acceptFriendIndex = currentUser.friends.findIndex((friendID) => {
    return friendID === acceptFriendID;
  });
  currentUser.pendingfriends.splice(acceptFriendIndex, 1);
  res.status(200).redirect(`users/${acceptFriendID}`);
};

const handleSignout = (req, res) => {
  currentUser = {};
  res.status(200).redirect("/signin");
};

const handleSignUp = (req, res) => {
  res.status(200).render("pages/signup", {
    users: users,
    currentUser: currentUser,
  });
};

const handleNewUser = (req, res) => {
  const newUserName = req.body.newUserFirstName;
  console.log("line 122", req.body);
  const newUserImage = req.body.newUserImg;
  users.push({
    _id: `${1010 + users.length}`,
    name: newUserName,
    friends: [],
    avatarUrl: newUserImage,
  });
  res.status(200).render("pages/homepage", {
    users: users,
    currentUser: currentUser,
  });
  // console.log(users);
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

  .get("/signup", handleSignUp)

  .post("/getname", handleName)

  .post("/removefriend", handleRemove)

  .post("/addfriend", handleAddFriend)

  .post("/acceptfriend", handleAccept)

  .post("/usersignup", handleNewUser)

  .post("/signout", handleSignout)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
