const express = require('express');
const axios = require('axios');
const fs = require('fs');
const { json } = require('body-parser');
const app = express();
app.use(express.json());
app.post('/api/search', (req, res) => {

    let url = req.body.url;
    let requestPayload = req.body.requestPayload
    let headers =  req.body.headers
    axios.post(url, requestPayload, { headers })
        .then(response => {
            let rt = response.data;
            console.log(rt);
            res.send(rt);
        })
        .catch(error => {
            res.send(error);
        });
});
app.use('', express.static('./')).listen(3000);