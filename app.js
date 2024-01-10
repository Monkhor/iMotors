const express = require("express");
const xss = require("xss-clean");
const helmet = require("helmet");
const bodyParser = require('body-parser');
const app = express();
const houseRouter = require("./api/house/profile.router");
const userRouter = require('./api/authentication/user.router');
const carRouter = require('./api/americacar/car.router');

app.use(express.json());
app.use(xss());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/upload', express.static('upload/images'));   // token shalgana
app.use('/upload/car', express.static('upload/car'));  // token shalgana
app.use("/api/house", houseRouter);
app.use('/api/login', userRouter);
app.use('/api/car', carRouter);

const port = 3000;
app.listen(port, () => {
    console.log("server up and running on PORT :", port);
});
//trent edit hiih uyd hugatsaa 1 odroor haoishilj bna 
//date iig ynzalna