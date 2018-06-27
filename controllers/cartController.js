var express = require('express');
var cartRepo = require('../repos/cartRepo'),
    productRepo = require('../repos/productRepo');
    accountRepo = require('../repos/accountRepo');
var datetime = require('node-datetime');

var router = express.Router();

router.get('/', (req, res) => {

    var arr_p = [];
    for (var i = 0; i < req.session.cart.length; i++) {
        var cartItem = req.session.cart[i];
        var p = productRepo.single(cartItem.ProId);
        arr_p.push(p);
    }
    accountRepo.loadAll().then(rows => {
        var acc = {
            account: rows
        };
        //console.log(rows);
        //console.log(req.session.a);
    });

    var temp = 0;
    var count;
    var items = [];
    Promise.all(arr_p).then(result => {
        for (var i = result.length - 1; i >= 0; i--) {
            var pro = result[i][0];
            var item = {
                Product: pro,
                Quantity: req.session.cart[i].Quantity,
                Amount: pro.Price1 * req.session.cart[i].Quantity,
            };
            items.push(item);
            temp = item.Amount + temp;
        }
        var vm = {
            items: items,
            showMoney: true,
            Money: temp
        };
        res.render('cart/index', vm);
    });
});

router.post('/', (req, res) => {

    var arr_p = [];
    for (var i = 0; i < req.session.cart.length; i++) {
        var cartItem = req.session.cart[i];
        var p = productRepo.single(cartItem.ProId);
        arr_p.push(p);
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
      var dt = datetime.create();
      var formatted = dt.format('m/d/Y H:M:S');
      console.log(formatted);
    var items = [];
    var t;
    var temp = 0;
    var menu = [];
    Promise.all(arr_p).then(result => {
        t = makeid();
        for (var i = result.length - 1; i >= 0; i--) {
            var pro = result[i][0];
            var item = { 
                OrderID: t,
                ProID : pro.ProID1,
                ProName: pro.ProName1,
                Price: pro.Price1 ,
                Quantity: req.session.cart[i].Quantity,
                Amount: pro.Price1 * req.session.cart[i].Quantity,
                User: res.locals.layoutVM.curUser.f_Name,
                Date: dt,
            };
            items.push(item);
            temp = item.Amount + temp;
            var menu = {
                OrderID: t,
                UserID: res.locals.layoutVM.curUser.f_ID,
                User: res.locals.layoutVM.curUser.f_Username,
                Date: formatted,
                Total: temp
            };
        }
        var vm;
        for(var i = 0;i < items.length; i ++){
            cartRepo.add1(items[i]).then(value => {
                
            });
            cartRepo.remove1(req.session.cart);
        }
        cartRepo.add2(menu).then(value => {
                
        });
        res.render('cart/index', vm);
    });
    
});

router.post('/add', (req, res) => {
    var item = {
        ProId: req.body.proId,
        Quantity: +req.body.quantity
    };

    cartRepo.add(req.session.cart, item);
    res.redirect(req.headers.referer);
});

router.post('/remove', (req, res) => {
    cartRepo.remove(req.session.cart, req.body.ProId);
    res.redirect(req.headers.referer);
});

router.get('/list', (req, res) => {
    cartRepo.loadAll().then(rows => {
        var vm = {
            cart: rows
        };
        res.render('cart/list', vm);
    });
});

/*router.get('/byMenu', (req, res) => {
    var OrderID = req.query.OrderID;
    cartRepo.loadAllByMenu(OrderID).then(rows => {
        var vm = {
            cart: rows
        };
        res.render('cart/byMenu', vm);
    });
});

router.get('/byMenu/:OrderID', (req, res) => {
    var OrderID = req.params.OrderID;
    cartRepo.loadAllByMenu(OrderID).then(rows => {
        var vm = {
            cart: rows,
            noCart: rows.length === 0
        };
        res.render('cart/byMenu', vm);
    });
});*/

router.get('/byMenu/:OrderID', (req, res) => {
    var OrderID = req.params.OrderID;
    console.log(OrderID);
    cartRepo.loadAll1(OrderID).then(rows => {
        var vm = {
            cart: rows
        };
        console.log(rows);
        res.render('cart/byMenu', vm);
    });
});

module.exports = router;