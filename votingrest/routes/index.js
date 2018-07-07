var express = require('express');
var router = express.Router();
const fs = require('fs');
/* GET home page. */
router.get('', function(req, res, next) {
  res.json({data:'data'})
})
router.post('/', function(req, res, next) {



  console.log('POST')
  fs.readFile('votes.json', function (err, data) {

    var json = JSON.parse(data)
    req.body.timestamp = (new Date()).toUTCString()
    json.push(req.body)
    console.log(json)
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
