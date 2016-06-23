
"use strict"
var cron = require('node-cron');
var _ = require('lodash');
var serverConfig = require('../server.json');
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
var startScheduledCollectionSensors = function(){
    var q = promise.defer();
    cron.schedule(serverConfig.schedule, function(){
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

var processSensors = function(sensorList){
    function validateList(){
        if(sensorList.length > 0){
            remove();
        }
    }
    //TODO: refactor loop
     function remove(){
         var sensor = sensorList.pop();
         var dataObject = {date: new Date()};
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
         var sensor_id = sensor.id;
         db.sensorsData.find({id:sensor_id}, function(err,doc){
             
                if(doc == null || doc.length == 0){
                    var addNew = {
                        id: sensor_id,
                        data: [dataObject]
                    }
                    db.sensorsData.insert(addNew,function(err,doc){
                      validateList();
                    });
                }else{
                    db.sensorsData.update({id: sensor_id},{$push: {data: dataObject}},function(err,doc){
                    if (err) console.log(err);});
                    validateList();
                }
         });
     };
     
  validateList();
};

module.exports = schedulingService;