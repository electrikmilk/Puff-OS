var device = {
  bluetooth: {
    count: function() {
      navigator.bluetooth.getDevices().then(devices => {
        return devices.length;
      });
    },
    list: function() {
      navigator.bluetooth.getDevices().then(devices => {
        if (devices) {
          var list = [];
          devices.forEach(device => {
            list.push({
              name: device.productName,
              serial: device.serialNumber
            });
          });
          return list;
        } else return false;
      });
    },
    request: function() {
      navigator.bluetooth.requestDevice({
          acceptAllDevices: true
        })
        .then(device => {
          console.log(device);
        });
    }
  },
  usb: {
    count: function() {
      navigator.usb.getDevices().then(devices => {
        return devices.length;
      });
    },
    list: function() {
      navigator.usb.getDevices().then(devices => {
        if (devices) {
          var list = [];
          devices.forEach(device => {
            list.push({
              name: device.productName,
              serial: device.serialNumber
            });
          });
          return list;
        } else return false;
      });
    }
  }
};