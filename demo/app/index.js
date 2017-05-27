var Geetest = require('../../'); // geetest3 on npm
var $ = require('jquery'); // just use jquery for ajax

var login = function (result) {
    $.post('/api/gt-validate', {
        geetest_challenge: result.geetest_challenge,
        geetest_validate: result.geetest_validate,
        geetest_seccode: result.geetest_seccode,
        username: $('#username').val(),
        password: $('#password').val()
    }, function (data) {
        if (data.status === 'success') {
            alert('login succeed');
            location.reload();
        } else if (data.status === 'fail') {
            alert('please complete verification');
        } else if (data.status === 'error') {
            alert(data.msg);
        }
    })
};

$.get('/api/gt-register?t=' + (new Date().getTime()), null, function (data) {
    var captcha = new Geetest({
        gt: data.gt,
        challenge: data.challenge,
        offline: !data.success,
        product: 'embed',
        // jsonp: true,
        lang: 'en'
    });

    captcha.appendTo('#captcha');

    captcha.onReady(function () {
        $('#tip').hide();
    });

    $('#submit').click(function (e) {
        var result = captcha.getValidate();
        if (result) {
            login(result);
        } else {
            alert('please complete verification');
        }
        e.preventDefault();
    })
});
