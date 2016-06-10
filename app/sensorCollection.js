"user strict"

var promise = require('q');
var db;
var SensorCollection = function(databaseInstance){
    console.log("new sensorCollection");
    db = databaseInstance;
}
SensorCollection.prototype.getAllRegistredSensors = function(){
    //return all sensors
}
SensorCollection.prototype.getSensor = function(sensorId){
    //return specific sensor
}
SensorCollection.prototype.getSensorHistory = function(sensorId,startDate,endDate){
    //return specific sensor
    var dateQueries = [];
    var q = promise.defer();
    var query = {id:sensorId};
    
    if(startDate){
        var dO = new Date(startDate);
        startQuery =  {'data.date': {$gte: dO}};
        dateQueries.push(startQuery);     
    }
    if(endDate){
        var dO = new Date(endDate);
        endQuery =  {'data.date': {$lte: dO}};
        dateQueries.push(endQuery);
        
    }
    if(dateQueries.length>0){
        query['$and'] =dateQueries; 
    }
    db.sensorsData.find(query,function(err,docs){
            if(err){ q.reject(err)};
            q.resolve(docs);
        });
    
    return q.promise;
}

module.exports = SensorCollection; 