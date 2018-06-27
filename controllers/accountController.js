var express = require('express'),
    SHA256 = require('crypto-js/sha256'),
    moment = require('moment');

var accountRepo = require('../repos/accountRepo');
var restrict = require('../middle-wares/restrict');

var router = express.Router();

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', (req, res) => {

    var dob = moment(req.body.dob, 'D/M/YYYY')
        .format('YYYY-MM-DDTHH:mm');

    var user = {
        username: req.body.username,
        password: SHA256(req.body.rawPWD).toString(),
        name: req.body.name,
        email: req.body.email,
        dob: dob,
        permission: 0
    };

    accountRepo.add(user).then(value => {
        var vm = {
            showTitle: true,
            errorMsg: 'Đăng kí thành công'
        };
        res.render('account/register', vm);
    });
});

router.get('/login', (req, res) => {
    res.render('account/login');
});

router.post('/login', (req, res) => {
    var user = {
        username: req.body.username,
        password: SHA256(req.body.rawPWD).toString(),
    };
    accountRepo.login(user).then(rows => {
        Object.keys(rows).forEach(function (key) {
            var row = rows[key];
            if (rows.length > 0) {
                if (row.f_Permission == '0') {
                    req.session.isLogged = true;
                    req.session.user = rows[0];
                    req.session.cart = [];

                    var url = '/';
                    if (req.query.retUrl) {
                        url = req.query.retUrl;
                    }
                    res.redirect(url);
                } else {
                    req.session.isLogged = true;
                    req.session.isLogged1 = true;
                    req.session.user = rows[0];
                    req.session.cart = [];

                    var url = '/category';
                    if (req.query.retUrl) {
                        url = req.query.retUrl;
                    }
                    res.redirect(url);
                }

            }
        });
        if (rows.length <= 0) {
            var vm = {
                showError: true,
                errorMsg: 'Đăng nhập thất bại'
            };
            res.render('account/login', vm);
        }
    });
});

router.get('/profile', restrict, (req, res) => {
    res.render('account/profile');
});

router.post('/logout', (req, res) => {
    req.session.isLogged = false;
    req.session.isLogged1 = false;
    req.session.user = null;
    // req.session.cart = [];
    res.redirect(req.headers.referer);
});

router.get('/', (req, res) => {
    accountRepo.loadAll().then(rows => {
        var vm = {
            account: rows
        };
        res.render('account/index', vm);
    });
});

router.get('/delete', (req, res) => {
    var vm = {
        f_ID: req.query.id
    }
    res.render('account/delete', vm);
});

router.post('/delete', (req, res) => {
    accountRepo.delete(req.body.ProID1).then(value => {
        res.redirect('/account');
    });
});

module.exports = router;