var Promise = require('q');
var Datastore = require('nedb')
var dbPath = 'data/';
var dataBase = function(){
        
}


dataBase.prototype.get = function(store){
    //fetch data store and append on current instance
        if(this.hasOwnProperty(store)){
            console.log('dataStore already initiated');
            return;
        }
        var q = Promise.defer();
        var db;
        db = new Datastore({ filename: 'data/'+store+'.db'})
        db.loadDatabase(function (err) {
            if(err){ q.reject(err);};
            q.resolve('success');
        });
        
        this[store] = db;
       return q.promise;
}



module.exports = dataBase;