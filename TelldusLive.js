
var tdAPI = require('telldus-live');
var _ = require('lodash');
var config = require('./config.json');
var promise = require('q');
var publicKey    = config.publicKey
  , privateKey   = config.privateKey
  , token        = config.token
  , tokenSecret  = config.tokenSecret
function telldusLive(){
  this.cloud = null;
};
telldusLive.prototype.initOauth = function() {
  var q = promise.defer();
  this.cloud = new tdAPI.TelldusAPI({ publicKey  : publicKey, privateKey : privateKey});
  this.cloud.login(token, tokenSecret,function(err,user){
    if(!!err){
      q.reject(err);
      return;
    };
    q.resolve(user);
  });
  return q.promise;
};

telldusLive.prototype.getSensors = function() {
  var q = promise.defer()
  this.cloud.getSensors(function(err, devices) {
    if (err){
      console.log("gestSensors failed");
      q.reject(err.message);
      return;
    };
      console.log("gestSensors");
      q.resolve(devices);
  });
  return q.promise;
};

telldusLive.prototype.getSensorInfo = function(device_id) {
 var q = promise.defer()
 this.cloud.getSensorInfo({id:device_id}, function(err, sensor) {
    if (err){
      q.reject(err.message);
      return;
    };
      q.resolve(sensor);
 });
 return q.promise;
}
module.exports = telldusLive;
