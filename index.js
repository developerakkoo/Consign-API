const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.get('/getgst/:gst', async (req, res, next) => {
    let gst = req.params.gst;
    let mail = req.params.mail;

    var config = {
        method: 'get',
        url: `https://api.mastergst.com/public/search?email=mvk20@rediffmail.com&gstin=${gst}`,
        headers: {
            'client_id': 'GSP4ea49af0-17d3-4df7-8aed-c620e4806b9c',
            'client_secret': 'GSP286e85df-4313-43dd-9b54-fc79b81f5ffb'
        }
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.status(200).json({
                message: 'Gst API',
                gst,
                data: response.data
            })
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).json({
                message: error,
                data: "Something went wrong!"
            })
        });

})

app.all("*", (req, res, next) => {
    res.status(404).json({
        message:"Page not found"
    });
});



app.listen(3000, () => {
    console.log(`Server started on 3000.`);
})