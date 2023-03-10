const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');
const axios = require('axios');
const Razorpay = require('razorpay');

const app = express();

var instance = new Razorpay({
    key_id: 'rzp_test_q92KbX0ZwFyaN0',
    key_secret: 'UsklYi4BRYogWcehPPjnBtSu',
});
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

app.post('/order',async (req, res, next) => {
    try {
        const amount = req.body.amount;

        var options = {
            amount: amount,
            currency: "INR",
        };
        instance.orders.create(options, function (err, order) {
            console.log(order);
            if (err) {
                res.status(200).json({
                    status: "error",
                    error: err,

                })
            }

            res.status(200).json({
                status: "success",
                message: "Order created successfully",
                order
            })
        });

    } catch (error) {
        res.status(200).json({
            status: 'error',
            message: error.message
        })
    }
} )

app.get("/getotp", async (req,res, next) =>{
    let otp = req.params.otp;
    let number = req.params.number;

    var config = {
        method: 'get',
        url: `https://sms.k7marketinghub.com/app/smsapi/index.php?key=56391A88208C8A&campaign=14827&routeid=30&type=text&contacts=${number}&senderid=WBMCCE&msg=Dear%20Customer,%20Your%20OTP%20is%20${otp}%20for%20The%20Mind%20Labyrinth.%20Do%20not%20share%20this%20OTP%20to%20anyone%20for%20security%20reasons.%20-App%20Institute&template_id=1707167514169508879`,
       
    };

    axios(config)
        .then(function (response) {
            res.status(200).json({
                message: 'OTP API',
                otp: otp,
                number: number,
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