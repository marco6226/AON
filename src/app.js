const aonController = require("./controllers/aon.controller");
const authController = require("./controllers/auth.controller");
const userController = require("./controllers/user.controller");

const app = require("express").Router();


//app.use("/auth", authController);
//app.use("/users", userController);
app.use("/aon", aonController);




module.exports = app;