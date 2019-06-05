/*
  DapJS / USB utilities
*/

const usb = require('usb');
const DAPjs = require('dapjs');
const fs = require('fs');

// Terminates the process due to device disconnect
function terminate(error){
  console.log("!! Connection lost to device:");
  console.log(error);
  console.log("!! Please repeat the tests with a device, or try without.");
  process.exit();
}

// Returns the micro:bit device
function fetchDevice(vendorID) {
  return new Promise((resolve, reject) => {
    let devices = usb.getDeviceList();
    devices = devices.filter(device => device.deviceDescriptor.idVendor === vendorID);
    if (devices.length === 0) {
      resolve(null);
    }else{
      resolve(devices[0]);
    }
  });
}

// Connects to serial and listens for a given 'responseCode'
function listenForSuccess(device, responseCode){
  return new Promise(function(resolve, reject){
    const transport = new DAPjs.USB(device);
    const target = new DAPjs.DAPLink(transport);
    let timeout = null;

    target.on(DAPjs.DAPLink.EVENT_SERIAL_DATA, data => {
      if (data.includes(responseCode)){
        target.stopSerialRead();
        target.disconnect();
        clearTimeout(timeout);
        resolve(1);
      }
    });

    target.connect()
    .then(() => {
      target.setSerialBaudrate(115200);
      return target.getSerialBaudrate();
    })
    .then(baud => {
      target.startSerialRead();
      console.log(`> Listening at ${baud} baud...`);
      timeout = setTimeout(function(){target.stopSerialRead();target.disconnect();resolve(0);}, 1500); // Fail after n seconds
      // TODO: Enter REPL, return Python error code
    })
    .catch((e) => {
      console.log("!! Unable to finish Serial testing.");
      terminate(e);
    });
  });
}

// Flashes a file to the micro:bit
function flash(transport, program) {
  console.log(`> Flashing binary file ${program.byteLength} words long...`);
  const target = new DAPjs.DAPLink(transport);

  target.on(DAPjs.DAPLink.EVENT_PROGRESS, progress => {
    //console.log(progress);
  });

  return target.connect()
  .then(() => {
    return target.flash(program);
  })
  .then(() => {
    console.log("> Flashing complete.");
    return target.disconnect();
  })
  .catch((e) => {
    console.log("!! An error occurred when flashing:");
    terminate(e);
  });
}

// Flash file wrapper
function flashFile(filepath, device){
  const transport = new DAPjs.USB(device);
  const file = fs.readFileSync(filepath);
  const program = new Uint8Array(file).buffer;
  return flash(transport, program);
}

module.exports = {
  flashFile : flashFile,
  fetchDevice : fetchDevice,
  listenForSuccess : listenForSuccess
};
