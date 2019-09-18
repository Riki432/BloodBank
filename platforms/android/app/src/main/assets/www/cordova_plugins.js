cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-phone-call.phonedialer",
      "file": "plugins/cordova-plugin-phone-call/www/dialer.js",
      "pluginId": "cordova-plugin-phone-call",
      "merges": [
        "cordova.plugins.phonedialer"
      ]
    },
    {
      "id": "cordova-plugin-badge.Badge",
      "file": "plugins/cordova-plugin-badge/www/badge.js",
      "pluginId": "cordova-plugin-badge",
      "clobbers": [
        "cordova.plugins.notification.badge"
      ]
    },
    {
      "id": "cordova-plugin-velda-devicefeedback.DeviceFeedback",
      "file": "plugins/cordova-plugin-velda-devicefeedback/DeviceFeedback.js",
      "pluginId": "cordova-plugin-velda-devicefeedback",
      "clobbers": [
        "window.plugins.deviceFeedback"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-phone-call": "1.0.7",
    "cordova-plugin-badge": "0.8.8",
    "cordova-plugin-velda-devicefeedback": "0.0.2"
  };
});