import * as express from 'express';
import * as http from 'http';
import * as ip from 'ip'
var parser = require('ua-parser-js'); // no way to change this(?)
import * as path from 'path';
import * as robotjs from 'robotjs'
import * as bodyParser from 'body-parser';
var app = express();
var html = new http.Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public/')));

app.get('/', (req, res) => {
    console.log('\n\n'); 
    var ua_data = parser(req.headers['user-agent']);
    var OS_NAME = ua_data.os.name;
    console.log('OS: ' + OS_NAME);
    var MODEL_NAME = ua_data.device.model;
    console.log('Model: ' + MODEL_NAME);

    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/console', (req, res) => {
    var value = req.query.value;
    res.end();
});
app.post('/click', (req, res) => {
    robotjs.mouseClick();
    res.end();
});
app.post('/hi', (req, res) => {
    console.log('CONNECTED');
    res.end();
});
var screen_size = robotjs.getScreenSize();
app.get('/getXY', (req, res) => {
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
    robotjs.moveMouse(moveX, moveY);
    res.end();
});

html.listen(3000, '0.0.0.0', () => {
    var server_ip = ip.address() + ':' + 3000
    console.log('IP to join: ' + server_ip);
});