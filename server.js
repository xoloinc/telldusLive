var express = require('express'),
TelldusLive = require('./app/TelldusLive'),
serverConfig = require('./server.json'),
sensorCollection = require('./app/sensorCollection')
database = require('./app/database')
scheduler = require('./app/scheduler')

var app = express(),
tdl = new TelldusLive(),
db = new database(),
schedule = null,
sensors = null;

var addHeader = function (req, res, next) {
  console.log("set header");
  res.set('Content-Type', 'application/json');
  next();
};

app.use(addHeader);

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
app.get('/api/sensors/:sensorId/history/:startDate?/:endDate?', function (req, res) {
  console.log(req.params.sensorId,req.params.startDate,req.params.endDate);
    sensors.getSensorHistory(req.params.sensorId,req.params.startDate,req.params.endDate).then(function(data){
      res.send(data);
      console.log(new Date(data[0].data[0].date));
    },function(){
        res.sendStatus(204);
    });
});
app.listen(serverConfig.port, function () {
  console.log("Server started on port:",serverConfig.port);
  //initial verificaton that oauth is correct
  tdl.initOauth().then(
    function(user){
      console.log("Authentication successfull");
      db.get('sensorsData').then(function(data){
        schedule = new scheduler(tdl,db);
        sensors = new sensorCollection(db);
      });
    },
    function(err){
      console.log('Authentication failed, reason:',err.data);
      app.close();
      process.exit(0)
    }
    )
});
