var TelldusLive = require('./TelldusLive');
var express = require('express');
var app = express();
var tdl = new TelldusLive();
app.get('/', function (req, res) {
  tdl.getSensors().then(function(data){
    res.send(data);
  })

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
