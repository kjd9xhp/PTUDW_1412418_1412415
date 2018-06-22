var express = require('express');
var categoryRepo = require('../repos/categoryRepo');
var multer = require('multer');
var router = express.Router();

router.get('/index1', (req, res) => {
    categoryRepo.loadAllCat().then(rows => {
        var vm = {
            categories1: rows
        };
        res.render('category/index1', vm);
    });
});

router.get('/', (req, res) => {
    categoryRepo.loadAll().then(rows => {
        var vm = {
            categories: rows
        };
        res.render('category/index', vm);
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
        res.redirect('/category');
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
        res.redirect('/category');
    });
});

router.get('/add1', (req, res) => {
    res.render('category/add1');
});

const multerConfig = {
    storage: multer.diskStorage({
        //Setup where the user's file will go
        destination: function (req, file, next) {
            next(null, './public/imgs/products');
        },

        //Then give the file a unique name
        filename: function (req, file, next) {
            var imgName = req.body.ProName;
            console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, imgName +'.' + ext);
        }
    }),

    //A means of ensuring only images are uploaded. 
    fileFilter: function (req, file, next) {
        if (!file) {
            next();
        }
        const image = file.mimetype.startsWith('image/');
        if (image) {
            console.log('photo uploaded');
            next(null, true);
        } else {
            console.log("file not supported");

            //TODO:  A better message response to user on failure.
            return next();
        }
    }
};

router.get('/add', (req, res) => {
    var vm = {
        showAlert: false
    };
    res.render('category/add', vm);
});

router.post('/add', multer(multerConfig).single('photo'), (req, res) => {
    categoryRepo.add(req.body).then(value => {
        var vm = {
            showAlert: true
        };
        res.render('category/add', vm);
    }).catch(err => {
        res.end('fail');
    });
});

router.post('/add1', multer(multerConfig).single('photo'), function (req, res) {
    res.send('Complete!');
});

module.exports = router;