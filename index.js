#!/usr/bin/env node

"use strict";

(async () => {
    try {
        require("./environment");
        const bodyParser = require("body-parser");
        const express = require("express");

        const app = require("./src/app");
        const errorHandler = require("./src/helpers/errorHandler");

        const server = express();



        server.use(function (req, res, next) {
            var allowedOrigins = process.env.ALLOWED_ORIGIN_CORS.split(", ");
            var origin = req.headers.origin;
            if (allowedOrigins.indexOf(origin) > -1) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.header('Access-Control-Allow-Credentials', true);
            next();
        });

        server.use(bodyParser.json({
            limit: '10mb',
            extended: true
        }));

        server.use(process.env.ROUTE_PREFIX, app);

        server.use(errorHandler);



        server.listen(parseInt(process.env.LISTEN_PORT), function () {
            console.log("Escuchando puerto " + process.env.LISTEN_PORT);
        });

        // https.createServer(credentials, expressApp).listen(8081);

    } catch (error) {
        console.error("Ocurrió el siguiente error:", process.env.NODE_ENV == "production" ? error.message : error.stack);
    }
})();