var path = require('path');

var express = require("express");
var session = require('express-session');
var bodyParser = require("body-parser");
var minimist = require('minimist');
var Geetest = require('gt3-sdk'); // gt-node-sdk

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./demo'));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/demo/login.html'));
});
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true
}));

var captcha1 = new Geetest({
    geetest_id: 'fd660d518d2b1feb5e7a8d2cc610ba49',
    geetest_key: '51185c02d4efa9aacaa3e6894328a270'
});

app.get("/api/gt-register", function (req, res) {    
    // 向极验申请每次验证所需的challenge
    captcha1.register(null, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }

        if (!data.success) {
            // 进入 failback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
            // 可以通过修改 hosts 把极验服务器 api.geetest.com 指到不可访问的地址

            // 为以防万一，你可以选择以下两种方式之一：

            // 1. 继续使用极验提供的failback备用方案
            req.session.fallback = true;
            res.send(data);

            // 2. 使用自己提供的备用方案
            // todo

        } else {
            // 正常模式
            req.session.fallback = false;
            res.send(data);
        }
    });
});
app.post("/api/gt-validate", function (req, res) {

    // 对ajax提供的验证凭证进行二次验证
    captcha1.validate(req.session.fallback, {
        challenge: req.body.geetest_challenge,
        validate: req.body.geetest_validate,
        seccode: req.body.geetest_seccode
    }, function (err, success) {

        if (err) {
            // 网络错误
            res.send({
                status: 'error',
                msg: err
            });

        } else if (!success) {

            // 二次验证失败
            res.send({
                status: 'fail'
            });
        } else {
            res.send({
                status: 'success'
            });
        }

    });
});

var args = minimist(process.argv.slice(2));

var port = args.port || 9991;
app.listen(port, function () {
    console.log('localhost: ' + port)
});