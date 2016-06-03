
"user strict"
var cron = require('node-cron');
var _ = require('lodash');
var promise = require('q');
//Scheduling data collection private
var scheduledJob = null; 
var tdapi = null;
var db = null;

//PUBLIC 
var schedulingService = function(telldusAPI, nedb){
    if (!telldusAPI) console.log("No telldusAPI defined");
    if(telldusAPI && nedb){
        tdapi = telldusAPI;
        db = nedb; 
        startScheduledCollectionSensors();
    }
}

//Private
startScheduledCollectionSensors = function(){
    var q = promise.defer();
    cron.schedule('*/5 * * * * *', function(){
           tdapi.getSensors().then(function(data){
                 var promiseCollection = [];
               _(data).forEach(function(sensor){
                    var a = tdapi.getSensorInfo(sensor.id).then(function(sensorInfo){
                        return promise(sensorInfo);
                    },function(){
                        return (null);
                    })
                       promiseCollection.push(a);
               });
               promise.all(promiseCollection).then(function (result) {
                     processSensors(result);
                });
            },function(err){
                console.log("err");
            })
    });
};

processSensors = function(sensorList){
    
    //TODO: refactor loop
     for(var o in sensorList){
         var sensor = sensorList[o];
         var dataObject = {date: new Date().toISOString()};
         var temps = _.find(sensor.data,function(i){
                return i.name == "temp";
         });
         var humitidy = _.find(sensor.data,function(i){
                return i.name == "humidity";
         });
         if(temps){
             dataObject.temp = temps.value;
         } 
         if(humitidy){
             dataObject.humidity = humitidy.value;
         }
         //TODO Dont use upsert
         db.sensors.update({'id':sensor.id},{$push: {data: dataObject}}, { upsert: true },function(err,doc){
                if (err) console.log(2,err);
                console.log(3,doc);
         });
     };
};

module.exports = schedulingService;