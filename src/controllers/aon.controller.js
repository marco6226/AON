const aonController = require("express").Router();
const axios = require('axios');
const {
    query
} = require("express");
const https = require('https');

aonController.post("/token", async function (req, res, onError) {
    let {
        email,
        password
    } = req.query;
    try {
        const response = await axios.post('https://tools.segurosaon.com.co/API/login', {
            email,
            password
        })
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json(error);
    }
});



aonController.get("/registers", async function (req, res, onError) {
    let {
        token,
        cc,
        fechai,
        fechafi
    } = req.query;
    let fechafinal = new Date();
    console.log(cc);
    try {
        let config = {
            data: {
                identificacion: cc,
                fecha_inicio: fechai,
                fecha_fin: fechafinal.toISOString().slice(0, 10)
            },
            headers: {
                'Authorization': token
            }
        }
        const response = await axios.get('https://tools.segurosaon.com.co/API/api/v1/registros', config)
        res.status(200).json(response.data);

    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = aonController;