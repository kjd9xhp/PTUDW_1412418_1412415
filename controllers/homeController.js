var express = require('express');
var categoryRepo = require('../repos/categoryRepo');

var router = express.Router();

router.get('/', (req, res) => {
    res.render('home/index');
});

router.get('/about', (req, res) => {
    res.render('home/about');
});

router.post('/upload',function(req,res){
    console.log(req.files);
    if(req.files.upfile){
      var file = req.files.upfile,
        name = file.name,
        type = file.mimetype;
        var uploadpath = __dirname + '/upload/' + name;
        file.mv(uploadpath,function(err){
        if(err){
          console.log("File Upload Failed",name,err);
          res.end('fail');
        }
        else {
          console.log("File Uploaded",name);
          res.send('Done! Uploading files')
        }
      });
    }
    else {
      res.send("No File selected !");
      res.end('fail');
    };
  })

module.exports = router;