var db = require('../fn/db');

exports.loadAll = () => {
    var sql = 'select * from products1';
    return db.load(sql);
}

exports.loadAllCat = () => {
    var sql = 'select * from categories';
    return db.load(sql);
}

exports.single = (id) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from products1 where ProID1 = ${id}`;
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

exports.add = (c) => {
    var sql = `insert into products1(ProName1, ProNXB1, ProKind1, TinyDes1, FullDes1, Price1, Quantity1) 
    values('${c.ProName}','${c.ProNXB}','${c.ProKind}','${c.TinyDes}','${c.FullDes}','${c.Price}','${c.Quantiny}')`;
    return db.save(sql);
}

exports.delete = (id) => {
    var sql = `delete from products1 where ProID1 = ${id}`;
    return db.save(sql);
}

exports.update = (c) => {
    var sql = `update products1 set ProName1 = '${c.ProName}', ProNXB1 = '${c.ProNXB}' where ProID1 = ${c.ProId}`;
    return db.save(sql);
}
