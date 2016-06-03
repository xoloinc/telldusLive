var express = require('express'),
TelldusLive = require('./TelldusLive'),
serverConfig = require('./server.json'),
sensorCollection = require('./app/sensorCollection')
database = require('./app/database')
scheduler = require('./app/scheduler')

var app = express(),
tdl = new TelldusLive(),
db = new database(),
schedule = null;

app.get('/api/sensors', function (req, res) {
  tdl.getSensors().then(function(data){
    res.send(data);
  })
});
app.get('/api/sensors/:sensorId', function (req, res) {
  tdl.getSensorInfo(req.params.sensorId).then(function(data){
    res.send(data);
  })
});
app.listen(serverConfig.port, function () {
  console.log("Server started on port:",serverConfig.port);
  //initial verificaton that oauth is correct
  tdl.initOauth().then(
    function(user){
      console.log("Authentication successfull");
      db.get('sensors').then(function(data){
        schedule = new scheduler(tdl,db);
      });
    },
    function(err){
      console.log('Authentication failed, reason:',err.data);
      app.close();
      process.exit(0)
    }
    )
});
