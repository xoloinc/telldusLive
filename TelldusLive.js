
var TelldusAPI = require('telldus-live');
var _ = require('lodash');
var config = require('./config.json');
var promise = require('q');

var publicKey    = config.publicKey
  , privateKey   = config.privateKey
  , token        = config.token
  , tokenSecret  = config.tokenSecret
function telldusLive(){
  this.cloud = new TelldusAPI.TelldusAPI({ publicKey  : publicKey, privateKey : privateKey });
  this.cloud.login(token, tokenSecret,function(err,user){});
}
telldusLive.prototype.getSensors = function() {
  var q = promise.defer()
  this.cloud.getSensors(function(err, devices) {
    if (!!err){
      q.reject(err.message);
    };
      q.resolve(devices);
  });
  return q.promise;
}
telldusLive.prototype.getSensorInfo = function(device) {
 this.cloud.getSensorInfo(device, function(err, sensor) {

 });
}
module.exports = telldusLive;
