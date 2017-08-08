const express = require('express');
const bodyParser = require('body-parser');

var app = express();
const router = require('./routes');

app.use("/api", router);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.listen(8080, function() {
    console.log("All right ! I am alive at Port 8080.");
});
