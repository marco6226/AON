const userController = require("express").Router();
const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const Role = require("../helpers/role.enum");

userController.get("/", authService.authorize(Role.ADMIN), async function (req, res, onError) {
    try {
        let users = await userService.getAll();
        res.status(200).json(users);
    } catch (error) {
        onError(error);
    }
});

userController.get("/:id", authService.authorize(), async function (req, res, onError) {
    try {
        let user;

        if (req.user.role == Role.ADMIN) {
            user = await userService.getByIdForAdmin(req.params.id);
        } else {
            user = await userService.getById(req.params.id);
        }
        //data que no puede ir
        // const {creationDate,role,status,secretQuestion,lastTimeModified,lastTimeModifiedby,...userRes} = user._doc;
        // console.log(userRes);
        if (user) {
            res.status(200).json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        onError(error);
    }
});

userController.post("/search", authService.authorize(Role.ADMIN), async function (req, res, onError) {
    try {
        let users = await userService.getAll(req.body);
        res.status(200).json(users);
    } catch (error) {
        onError(error);
    }
});

userController.post("/", async function (req, res, onError) {
    try {
        let user = await userService.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        onError(error);
    }
});

userController.put("/", authService.authorize([Role.FACILITATOR, Role.ADMIN]), async function (req, res, onError) {
    try {
        console.log(req.user.role);
        if (req.body._id == req.user._id || req.user.role == Role.ADMIN) {
            // Prevenir el cambio de role y status a menos que sea un admin;
            console.log(req.body);
            let { role, status, ...userToUpdate } = req.body;

            if (req.user.role == Role.ADMIN) {
                userToUpdate = req.body;
                console.log("here");
            }

            let user = await userService.update(userToUpdate, req.user._id);

            if (user) {
                res.status(200).json(user);
            } else {
                res.sendStatus(304);
            }

        } else {
            onError({
                id: "unauthorized",
                message: "Unauthorized"
            });
        }

    } catch (error) {
        onError(error);
    }
});

userController.delete("/:id", authService.authorize(Role.ADMIN), async function (req, res, onError) {
    try {
        const deleted = await userService.delete(req.params.id, req.user._id);

        if (deleted) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        onError(error);
    }
});

module.exports = userController;