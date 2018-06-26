var db = require('../fn/db');

exports.add = (cart, item) => {
    for (i = cart.length - 1; i >= 0; i--) {
        if (cart[i].ProId === item.ProId) {
            cart[i].Quantity += item.Quantity;
            return;
        }
    }

    cart.push(item);
}

exports.add1 = items => {
    var sql = `insert into orderdetails(OrderID, ProID, Quantity, Price, Amount) values('${items[0].Amount}', '${items[0].Amount}', '${items[0].Amount}', '${items[0].Amount}', '${items[0].Amount}')`;
    return db.save(sql);
}

exports.remove = (cart, proId) => {
    for (var i = cart.length - 1; i >= 0; i--) {
        if (proId === cart[i].ProId) {
            cart.splice(i, 1);
            return;
        }
    }
}