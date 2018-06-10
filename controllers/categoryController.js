var express = require('express');
var categoryRepo = require('../repos/categoryRepo');

var router = express.Router();

router.get('/', (req, res) => {
    categoryRepo.loadAllCat().then(rows => {
        var vm = {
            categories1: rows
        };
        res.render('category/index', vm);
    });
});

router.get('/list', (req, res) => {
    categoryRepo.loadAll().then(rows => {
        var vm = {
            categories: rows
        };
        res.render('category/list', vm);
    });
});

router.get('/add', (req, res) => {
    var vm = {
        showAlert: false
    };
    res.render('category/add', vm);
});

router.post('/add', (req, res) => {
    categoryRepo.add(req.body).then(value => {
        var vm = {
            showAlert: true
        };
        res.render('category/add', vm);
    }).catch(err => {
        res.end('fail');
    });
});

router.get('/delete', (req, res) => {
    var vm = {
        ProID1: req.query.id
    }
    res.render('category/delete', vm);
});

router.post('/delete', (req, res) => {
    categoryRepo.delete(req.body.ProID1).then(value => {
        res.redirect('/category/list');
    });
});

router.get('/edit', (req, res) => {
    categoryRepo.single(req.query.id).then(c => {
    	// console.log(c);
        var vm = {
            category: c
        };
        res.render('category/edit', vm);
    });
});

router.post('/edit', (req, res) => {
    categoryRepo.update(req.body).then(value => {
        res.redirect('/category/list');
    });
});

module.exports = router;