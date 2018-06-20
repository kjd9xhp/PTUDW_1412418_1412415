var db = require('../fn/db');
var config = require('../config/config');

exports.loadAll = () => {
    var sql = 'select * from products';
    return db.load(sql);
}

exports.single = (id) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from products where ProID = ${id}`;
        db.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            } else {
                resolve(rows[0]);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

 exports.loadAllByCat = (catId) => {
     var sql = `select * from products,test where ProName = TName and TId = ${catId}`;
     return db.load(sql);
 }

/*exports.loadAllByCat = (catId, offset) => {
    var sql = `select * from products where CatID = ${catId} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}*/

exports.countByCat = catId => {
	var sql = `select count(*) as total from products where CatID = ${catId}`;
    return db.load(sql);
}