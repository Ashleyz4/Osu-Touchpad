var express = require('express');
var app = express();
var html = require('http').Server(app);
var ip = require('ip');
var parser = require('ua-parser-js');
var path = require('path');
var robot = require("robotjs");

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public/")));

var pop = () => {
    console.log();
    console.log();
};
app.get('/', (req, res) => {
    pop();
    var ua_data = parser(req.headers['user-agent']);
	var OS_NAME = ua_data.os.name;
	console.log("OS: " + OS_NAME);
	var MODEL_NAME = ua_data.device.model;
    console.log("Model: " + MODEL_NAME);
    
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/console", (req, res) => {
    var value = req.query.value;
    res.end();
});
app.post("/click", (req, res) => {
    robot.mouseClick();
    res.end();
});
app.post("/hi", (req, res) => {
    console.log("CONNECTED");
    res.end();
});
var screen_size = robot.getScreenSize();
app.get("/getXY", (req, res) => {
    var x = req.query.x;
    var y = req.query.y;
    var width = req.query.width;
    var height = req.query.height;
    var sW = screen_size.width;
    var sH = screen_size.height;
    var w_ratio = (sW / width);
    var h_ratio = (sH / height);
    var moveX = x * w_ratio;
    var moveY = y * h_ratio;
    robot.moveMouse(moveX, moveY);
    res.end();
});

var PORT = 3000;
try {
    html.listen(3000, "0.0.0.0", () => {
        var server_ip = ip.address() + ":" + 3000
        console.log("IP to join: " + server_ip);
    });
} catch(e) {

}