const express = require("express");
const bodyParser = require("body-parser")
const _ = require("lodash");
var {User} = require("./models/user");
var app = express();
var {authenticate} = require('./middleware/authenticate');


app.use(bodyParser.json());


app.post('/users', (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    user.save().then((user)=>{
        return user.generateAuthToken();

    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e) => res.status(400).send(e));

});


app.get('/users/me', authenticate, (req,res)=>{
    res.send(req.user);
});

app.listen(3000, ()=>{
    console.log("ZOTCoin user session example");
})