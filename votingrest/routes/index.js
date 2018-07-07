var express = require('express');
var router = express.Router();
const fs = require('fs');
/* GET home page. */
router.get('', function(req, res, next) {
  res.json({data:'data'})
})
router.post('/', function(req, res, next) {


  var output = {
    "ip": "2a02:214b:822e:a200:485b:fb2a:461a:c730",
    "city": "Thessaloniki"
  };
  const content = JSON.stringify(output);



  fs.readFile('votes.json', function (err, data) {

    var json = JSON.parse(data)
    json.push(output)
    console.log('File parsed', json)
    fs.writeFile("votes.json", JSON.stringify(json), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        res.json({message: 'ok', data: json});
    });


    // res.json({ title: 'Express' });
  });
});
module.exports = router;
