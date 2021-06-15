const authController = require("express").Router();
const authService = require("../services/auth.service");

authController.get("/login/:username", async function (req, res, onError) {
    try {
        let serverRand = await authService.createServerLoginToken(req.params.username);
        console.log(serverRand);
        res.status(200).json(serverRand);
    } catch (error) {
        onError(error);
    }
});

authController.post("/login", async function (req, res, onError) {
    try {
        let token = await authService.login(req.body);
        console.log(req.body);
        if (token) {
            res.status(200).json(token);
        } else {
            onError({
                id: "wrong_username_or_password",
                message: "Wrong username or password"
            });
        }
    } catch (error) {
        console.log(error);
        onError(error);
    }
});

module.exports = authController;