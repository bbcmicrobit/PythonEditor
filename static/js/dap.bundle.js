(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DAPjs = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("../proxy");
var cmsis_dap_1 = require("../proxy/cmsis-dap");
/**
 * Arm Debug Interface class
 */
var ADI = /** @class */ (function () {
    function ADI(transportOrDap, mode, clockFrequency) {
        if (mode === void 0) { mode = 0 /* DEFAULT */; }
        if (clockFrequency === void 0) { clockFrequency = cmsis_dap_1.DEFAULT_CLOCK_FREQUENCY; }
        function isTransport(test) {
            return test.open !== undefined;
        }
        this.proxy = isTransport(transportOrDap) ? new proxy_1.CmsisDAP(transportOrDap, mode, clockFrequency) : transportOrDap;
    }
    ADI.prototype.delay = function (timeout) {
        return new Promise(function (resolve, _reject) {
            setTimeout(resolve, timeout);
        });
    };
    /**
     * Continually run a function until it returns true
     * @param fn The function to run
     * @param timer The milliseconds to wait between each run
     * @param timeout Optional timeout to wait before giving up and rejecting
     * @returns Promise
     */
    ADI.prototype.waitDelay = function (fn, timer, timeout) {
        var _this = this;
        if (timer === void 0) { timer = 100; }
        if (timeout === void 0) { timeout = 0; }
        var running = true;
        var chain = function (condition) {
            if (!running)
                return Promise.resolve();
            return condition
                ? Promise.resolve()
                : _this.delay(timer)
                    .then(fn)
                    .then(chain);
        };
        return new Promise(function (resolve, reject) {
            if (timeout > 0) {
                setTimeout(function () {
                    running = false;
                    reject("Wait timed out");
                }, timeout);
            }
            return chain(false)
                .then(function () { return resolve(); });
        });
    };
    ADI.prototype.concatTypedArray = function (arrays) {
        // Only one array exists
        if (arrays.length === 1)
            return arrays[0];
        // Determine array length
        var length = 0;
        for (var _i = 0, arrays_1 = arrays; _i < arrays_1.length; _i++) {
            var array = arrays_1[_i];
            length += array.length;
        }
        // Concat the arrays
        var result = new Uint32Array(length);
        for (var i = 0, j = 0; i < arrays.length; i++) {
            result.set(arrays[i], j);
            j += arrays[i].length;
        }
        return result;
    };
    ADI.prototype.readDPCommand = function (register) {
        return [{
                mode: 2 /* READ */,
                port: 0 /* DEBUG */,
                register: register
            }];
    };
    ADI.prototype.writeDPCommand = function (register, value) {
        if (register === 8 /* SELECT */) {
            if (value === this.selectedAddress) {
                return [];
            }
            this.selectedAddress = value;
        }
        return [{
                mode: 0 /* WRITE */,
                port: 0 /* DEBUG */,
                register: register,
                value: value
            }];
    };
    ADI.prototype.readAPCommand = function (register) {
        var address = (register & 4278190080 /* APSEL */) | (register & 240 /* APBANKSEL */);
        return this.writeDPCommand(8 /* SELECT */, address).concat({
            mode: 2 /* READ */,
            port: 1 /* ACCESS */,
            register: register
        });
    };
    ADI.prototype.writeAPCommand = function (register, value) {
        if (register === 0 /* CSW */) {
            if (value === this.cswValue) {
                return [];
            }
            this.cswValue = value;
        }
        var address = (register & 4278190080 /* APSEL */) | (register & 240 /* APBANKSEL */);
        return this.writeDPCommand(8 /* SELECT */, address).concat({
            mode: 0 /* WRITE */,
            port: 1 /* ACCESS */,
            register: register,
            value: value
        });
    };
    ADI.prototype.readMem16Command = function (register) {
        return this.writeAPCommand(0 /* CSW */, 587202640 /* VALUE */ | 1 /* SIZE_16 */)
            .concat(this.writeAPCommand(4 /* TAR */, register))
            .concat(this.readAPCommand(12 /* DRW */));
    };
    ADI.prototype.writeMem16Command = function (register, value) {
        return this.writeAPCommand(0 /* CSW */, 587202640 /* VALUE */ | 1 /* SIZE_16 */)
            .concat(this.writeAPCommand(4 /* TAR */, register))
            .concat(this.writeAPCommand(12 /* DRW */, value));
    };
    ADI.prototype.readMem32Command = function (register) {
        return this.writeAPCommand(0 /* CSW */, 587202640 /* VALUE */ | 2 /* SIZE_32 */)
            .concat(this.writeAPCommand(4 /* TAR */, register))
            .concat(this.readAPCommand(12 /* DRW */));
    };
    ADI.prototype.writeMem32Command = function (register, value) {
        return this.writeAPCommand(0 /* CSW */, 587202640 /* VALUE */ | 2 /* SIZE_32 */)
            .concat(this.writeAPCommand(4 /* TAR */, register))
            .concat(this.writeAPCommand(12 /* DRW */, value));
    };
    ADI.prototype.transferSequence = function (operations) {
        var _this = this;
        // Flatten operations into single array
        var merged = [];
        merged = merged.concat.apply(merged, operations);
        var chain = Promise.resolve([]);
        var _loop_1 = function () {
            var sequence = merged.splice(0, this_1.proxy.operationCount);
            chain = chain.then(function (results) { return _this.proxy.transfer(sequence).then(function (result) { return results.concat([result]); }); });
        };
        var this_1 = this;
        // Split operations into sequences no longer than operation count
        while (merged.length) {
            _loop_1();
        }
        return chain
            .then(function (arrays) { return _this.concatTypedArray(arrays); });
    };
    /**
     * Connect to target device
     * @returns Promise
     */
    ADI.prototype.connect = function () {
        var _this = this;
        var mask = 536870912 /* CDBGPWRUPACK */ | -2147483648 /* CSYSPWRUPACK */;
        return this.proxy.connect()
            .then(function () { return _this.readDP(0 /* DPIDR */); })
            .then(function () { return _this.transferSequence([
            _this.writeDPCommand(0 /* ABORT */, 4 /* STKERRCLR */),
            _this.writeDPCommand(8 /* SELECT */, 0 /* CSW */),
            _this.writeDPCommand(4 /* CTRL_STAT */, 1073741824 /* CSYSPWRUPREQ */ | 268435456 /* CDBGPWRUPREQ */)
        ]); })
            // Wait until system and debug have powered up
            .then(function () { return _this.waitDelay(function () {
            return _this.readDP(4 /* CTRL_STAT */)
                .then(function (status) { return ((status & mask) === mask); });
        }); });
    };
    /**
     * Disconnect from target device
     * @returns Promise
     */
    ADI.prototype.disconnect = function () {
        return this.proxy.disconnect();
    };
    /**
     * Reconnect to target device
     * @returns Promise
     */
    ADI.prototype.reconnect = function () {
        var _this = this;
        return this.disconnect()
            .then(function () { return _this.delay(100); })
            .then(function () { return _this.connect(); });
    };
    /**
     * Reset target device
     * @returns Promise
     */
    ADI.prototype.reset = function () {
        return this.proxy.reset();
    };
    /**
     * Read from a debug port register
     * @param register DP register to read
     * @returns Promise of register value
     */
    ADI.prototype.readDP = function (register) {
        return this.proxy.transfer(this.readDPCommand(register))
            .then(function (result) { return result[0]; });
    };
    /**
     * Write to a debug port register
     * @param register DP register to write
     * @param value Value to write
     * @returns Promise
     */
    ADI.prototype.writeDP = function (register, value) {
        return this.proxy.transfer(this.writeDPCommand(register, value))
            .then(function () { return undefined; });
    };
    /**
     * Read from an access port register
     * @param register AP register to read
     * @returns Promise of register value
     */
    ADI.prototype.readAP = function (register) {
        return this.proxy.transfer(this.readAPCommand(register))
            .then(function (result) { return result[0]; });
    };
    /**
     * Write to an access port register
     * @param register AP register to write
     * @param value Value to write
     * @returns Promise
     */
    ADI.prototype.writeAP = function (register, value) {
        return this.proxy.transfer(this.writeAPCommand(register, value))
            .then(function () { return undefined; });
    };
    /**
     * Read a 16-bit word from a memory access port register
     * @param register ID of register to read
     * @returns Promise of register data
     */
    ADI.prototype.readMem16 = function (register) {
        return this.proxy.transfer(this.readMem16Command(register))
            .then(function (result) { return result[0]; });
    };
    /**
     * Write a 16-bit word to a memory access port register
     * @param register ID of register to write to
     * @param value The value to write
     * @returns Promise
     */
    ADI.prototype.writeMem16 = function (register, value) {
        value = value << ((register & 0x02) << 3);
        return this.proxy.transfer(this.writeMem16Command(register, value))
            .then(function () { return undefined; });
    };
    /**
     * Read a 32-bit word from a memory access port register
     * @param register ID of register to read
     * @returns Promise of register data
     */
    ADI.prototype.readMem32 = function (register) {
        return this.proxy.transfer(this.readMem32Command(register))
            .then(function (result) { return result[0]; });
    };
    /**
     * Write a 32-bit word to a memory access port register
     * @param register ID of register to write to
     * @param value The value to write
     * @returns Promise
     */
    ADI.prototype.writeMem32 = function (register, value) {
        return this.proxy.transfer(this.writeMem32Command(register, value))
            .then(function () { return undefined; });
    };
    /**
     * Read a block of 32-bit words from a memory access port register
     * @param register ID of register to read from
     * @param count The count of values to read
     * @returns Promise of register data
     */
    ADI.prototype.readBlock = function (register, count) {
        var _this = this;
        var chain = this.transferSequence([
            this.writeAPCommand(0 /* CSW */, 587202640 /* VALUE */ | 2 /* SIZE_32 */),
            this.writeAPCommand(4 /* TAR */, register),
        ])
            .then(function () { return []; });
        // Split into requests no longer than block size
        var remainder = count;
        var _loop_2 = function () {
            var chunkSize = Math.min(remainder, this_2.proxy.blockSize);
            chain = chain.then(function (results) { return _this.proxy.transferBlock(1 /* ACCESS */, 12 /* DRW */, chunkSize)
                .then(function (result) { return results.concat([result]); }); });
            remainder -= chunkSize;
        };
        var this_2 = this;
        while (remainder > 0) {
            _loop_2();
        }
        return chain
            .then(function (arrays) { return _this.concatTypedArray(arrays); });
    };
    /**
     * Write a block of 32-bit words to a memory access port register
     * @param register ID of register to write to
     * @param values The values to write
     * @returns Promise
     */
    ADI.prototype.writeBlock = function (register, values) {
        var _this = this;
        var chain = this.transferSequence([
            this.writeAPCommand(0 /* CSW */, 587202640 /* VALUE */ | 2 /* SIZE_32 */),
            this.writeAPCommand(4 /* TAR */, register),
        ])
            .then(function () { return undefined; });
        // Split values into chunks no longer than block size
        var index = 0;
        var _loop_3 = function () {
            var chunk = values.slice(index, index + this_3.proxy.blockSize);
            chain = chain.then(function () { return _this.proxy.transferBlock(1 /* ACCESS */, 12 /* DRW */, chunk); });
            index += this_3.proxy.blockSize;
        };
        var this_3 = this;
        while (index < values.length) {
            _loop_3();
        }
        return chain;
    };
    return ADI;
}());
exports.ADI = ADI;



},{"../proxy":7,"../proxy/cmsis-dap":6}],2:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var adi_1 = require("./adi");
exports.ADI = adi_1.ADI;



},{"./adi":1}],3:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("../proxy");
/**
 * @hidden
 */
var DEFAULT_BAUDRATE = 9600;
/**
 * @hidden
 */
var DEFAULT_SERIAL_DELAY = 200;
/**
 * @hidden
 */
var DEFAULT_PAGE_SIZE = 62;
/**
 * DAPLink Class
 */
var DAPLink = /** @class */ (function (_super) {
    __extends(DAPLink, _super);
    function DAPLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Detect if buffer contains text or binary data
     */
    DAPLink.prototype.isBufferBinary = function (buffer) {
        var numberArray = Array.prototype.slice.call(new Uint16Array(buffer, 0, 50));
        var bufferString = String.fromCharCode.apply(null, numberArray);
        for (var i = 0; i < bufferString.length; i++) {
            var charCode = bufferString.charCodeAt(i);
            // 65533 is a code for unknown character
            // 0-8 are codes for control characters
            if (charCode === 65533 || charCode <= 8) {
                return true;
            }
        }
        return false;
    };
    DAPLink.prototype.writeBuffer = function (buffer, pageSize, offset) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        var end = Math.min(buffer.byteLength, offset + pageSize);
        var page = buffer.slice(offset, end);
        var data = new Uint8Array(page.byteLength + 1);
        data.set([page.byteLength]);
        data.set(new Uint8Array(page), 1);
        return this.send(140 /* WRITE */, data)
            .then(function () {
            _this.emit(DAPLink.EVENT_PROGRESS, offset / buffer.byteLength);
            if (end < buffer.byteLength) {
                return _this.writeBuffer(buffer, pageSize, end);
            }
            return Promise.resolve();
        });
    };
    /**
     * Flash the target
     * @param buffer The image to flash
     * @param pageSize The page size to use (defaults to 62)
     * @returns Promise
     */
    DAPLink.prototype.flash = function (buffer, pageSize) {
        var _this = this;
        if (pageSize === void 0) { pageSize = DEFAULT_PAGE_SIZE; }
        function isView(source) {
            return source.buffer !== undefined;
        }
        var arrayBuffer = isView(buffer) ? buffer.buffer : buffer;
        var streamType = this.isBufferBinary(arrayBuffer) ? 0 : 1;
        return this.send(138 /* OPEN */, new Uint32Array([streamType]))
            .then(function (result) {
            // An error occurred
            if (result.getUint8(1) !== 0)
                return Promise.reject("Flash error");
            return _this.writeBuffer(arrayBuffer, pageSize);
        })
            .then(function () {
            _this.emit(DAPLink.EVENT_PROGRESS, 1.0);
            return _this.send(139 /* CLOSE */);
        })
            .then(function (result) {
            // An error occurred
            if (result.getUint8(1) !== 0)
                return Promise.reject("Flash error");
            return _this.send(137 /* RESET */);
        })
            .then(function () { return undefined; });
    };
    /**
     * Get the serial baud rate setting
     * @returns Promise of baud rate
     */
    DAPLink.prototype.getSerialBaudrate = function () {
        return this.send(129 /* READ_SETTINGS */)
            .then(function (result) {
            return result.getUint32(1, true);
        });
    };
    /**
     * Set the serial baud rate setting
     * @param baudrate The baudrate to use (defaults to 9600)
     * @returns Promise
     */
    DAPLink.prototype.setSerialBaudrate = function (baudrate) {
        if (baudrate === void 0) { baudrate = DEFAULT_BAUDRATE; }
        return this.send(130 /* WRITE_SETTINGS */, new Uint32Array([baudrate]))
            .then(function () { return undefined; });
    };
    /**
     * Start listening for serial data
     * @param serialDelay The serial delay to use (defaults to 200)
     */
    DAPLink.prototype.startSerialRead = function (serialDelay) {
        var _this = this;
        if (serialDelay === void 0) { serialDelay = DEFAULT_SERIAL_DELAY; }
        this.stopSerialRead();
        this.timer = setInterval(function () {
            return _this.send(131 /* READ */)
                .then(function (serialData) {
                if (serialData.byteLength > 0) {
                    // check if there is any data returned from the device
                    // first byte contains the vendor code
                    // second byte contains the actual length of data read from the device
                    var dataLength = serialData.getUint8(1);
                    if (dataLength !== 0) {
                        var offset = 2;
                        var dataArray = serialData.buffer.slice(offset, offset + dataLength);
                        var numberArray = Array.prototype.slice.call(new Uint8Array(dataArray));
                        var data = String.fromCharCode.apply(null, numberArray);
                        _this.emit(DAPLink.EVENT_SERIAL_DATA, data);
                    }
                }
            });
        }, serialDelay);
    };
    /**
     * Stop listening for serial data
     */
    DAPLink.prototype.stopSerialRead = function () {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    };
    /**
     * Write serial data
     * @param data The data to write
     * @returns Promise
     */
    DAPLink.prototype.serialWrite = function (data) {
        var arrayData = data.split("").map(function (e) { return e.charCodeAt(0); });
        arrayData.unshift(arrayData.length);
        return this.send(132 /* WRITE */, new Uint8Array(arrayData).buffer)
            .then(function () { return undefined; });
    };
    /**
     * Progress event
     * @event
     */
    DAPLink.EVENT_PROGRESS = "progress";
    /**
     * Serial read event
     * @event
     */
    DAPLink.EVENT_SERIAL_DATA = "serial";
    return DAPLink;
}(proxy_1.CmsisDAP));
exports.DAPLink = DAPLink;



},{"../proxy":7}],4:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dap_1 = require("../dap");
/**
 * @hidden
 */
var EXECUTE_TIMEOUT = 10000;
/**
 * @hidden
 */
var BKPT_INSTRUCTION = 0xBE2A;
/**
 * @hidden
 */
var GENERAL_REGISTER_COUNT = 12;
/**
 * Cortex M class
 */
var CortexM = /** @class */ (function (_super) {
    __extends(CortexM, _super);
    function CortexM() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CortexM.prototype.enableDebug = function () {
        return this.writeMem32(3758157296 /* DHCSR */, -1604386816 /* DBGKEY */ | 1 /* C_DEBUGEN */);
    };
    CortexM.prototype.readCoreRegisterCommand = function (register) {
        return this.writeMem32Command(3758157300 /* DCRSR */, register)
            .concat(this.readMem32Command(3758157296 /* DHCSR */))
            .concat(this.readMem32Command(3758157304 /* DCRDR */));
    };
    CortexM.prototype.writeCoreRegisterCommand = function (register, value) {
        return this.writeMem32Command(3758157304 /* DCRDR */, value)
            .concat(this.writeMem32Command(3758157300 /* DCRSR */, register | 65536 /* REGWnR */));
    };
    /**
     * Get the state of the processor core
     * @returns Promise of CoreState
     */
    CortexM.prototype.getState = function () {
        var _this = this;
        return this.readMem32(3758157296 /* DHCSR */)
            .then(function (dhcsr) {
            var state;
            if (dhcsr & 524288 /* S_LOCKUP */)
                state = 1 /* LOCKUP */;
            else if (dhcsr & 262144 /* S_SLEEP */)
                state = 2 /* SLEEPING */;
            else if (dhcsr & 131072 /* S_HALT */)
                state = 3 /* DEBUG */;
            else
                state = 4 /* RUNNING */;
            if (dhcsr & 33554432 /* S_RESET_ST */) {
                // The core has been reset, check if an instruction has run
                return _this.readMem32(3758157296 /* DHCSR */)
                    .then(function (newDhcsr) {
                    if (newDhcsr & 33554432 /* S_RESET_ST */ && !(newDhcsr & 16777216 /* S_RETIRE_ST */)) {
                        return 0 /* RESET */;
                    }
                    else {
                        return state;
                    }
                });
            }
            else {
                return state;
            }
        });
    };
    /**
     * Whether the target is halted
     * @returns Promise of halted state
     */
    CortexM.prototype.isHalted = function () {
        return this.readMem32(3758157296 /* DHCSR */)
            .then(function (dhcsr) {
            return !!(dhcsr & 131072 /* S_HALT */);
        });
    };
    /**
     * Halt the target
     * @param wait Wait until halted before returning
     * @param timeout Milliseconds to wait before aborting wait
     * @returns Promise
     */
    CortexM.prototype.halt = function (wait, timeout) {
        var _this = this;
        if (wait === void 0) { wait = true; }
        if (timeout === void 0) { timeout = 0; }
        return this.isHalted()
            .then(function (halted) {
            if (halted)
                return Promise.resolve();
            return _this.writeMem32(3758157296 /* DHCSR */, -1604386816 /* DBGKEY */ | 1 /* C_DEBUGEN */ | 2 /* C_HALT */)
                .then(function () {
                if (!wait)
                    return Promise.resolve();
                return _this.waitDelay(function () { return _this.isHalted(); }, 100, timeout);
            });
        });
    };
    /**
     * Resume a target
     * @param wait Wait until resumed before returning
     * @param timeout Milliseconds to wait before aborting wait
     * @returns Promise
     */
    CortexM.prototype.resume = function (wait, timeout) {
        var _this = this;
        if (wait === void 0) { wait = true; }
        if (timeout === void 0) { timeout = 0; }
        return this.isHalted()
            .then(function (halted) {
            if (!halted)
                return Promise.resolve();
            return _this.writeMem32(3758157104 /* DFSR */, 4 /* DWTTRAP */ | 2 /* BKPT */ | 1 /* HALTED */)
                .then(function () { return _this.enableDebug(); })
                .then(function () {
                if (!wait)
                    return Promise.resolve();
                return _this.waitDelay(function () { return _this.isHalted().then(function (result) { return !result; }); }, 100, timeout);
            });
        });
    };
    /**
     * Read from a core register
     * @param register The register to read
     * @returns Promise of value
     */
    CortexM.prototype.readCoreRegister = function (register) {
        var _this = this;
        return this.transferSequence([
            this.writeMem32Command(3758157300 /* DCRSR */, register),
            this.readMem32Command(3758157296 /* DHCSR */)
        ])
            .then(function (results) {
            var dhcsr = results[0];
            if (!(dhcsr & 65536 /* S_REGRDY */)) {
                throw new Error("Register not ready");
            }
            return _this.readMem32(3758157304 /* DCRDR */);
        });
    };
    /**
     * Read an array of core registers
     * @param registers The registers to read
     * @returns Promise of register values in an array
     */
    CortexM.prototype.readCoreRegisters = function (registers) {
        var _this = this;
        var chain = Promise.resolve([]);
        registers.forEach(function (register) {
            chain = chain.then(function (results) { return _this.readCoreRegister(register).then(function (result) { return results.concat([result]); }); });
        });
        return chain;
    };
    /**
     * Write to a core register
     * @param register The register to write to
     * @param value The value to write
     * @returns Promise
     */
    CortexM.prototype.writeCoreRegister = function (register, value) {
        return this.transferSequence([
            this.writeMem32Command(3758157304 /* DCRDR */, value),
            this.writeMem32Command(3758157300 /* DCRSR */, register | 65536 /* REGWnR */),
            this.readMem32Command(3758157296 /* DHCSR */)
        ])
            .then(function (results) {
            var dhcsr = results[0];
            if (!(dhcsr & 65536 /* S_REGRDY */)) {
                throw new Error("Register not ready");
            }
        });
    };
    /**
     * Exucute code at a specified memory address
     * @param address The address to put the code
     * @param code The code to use
     * @param stackPointer The stack pointer to use
     * @param programCounter The program counter to use
     * @param linkRegister The link register to use (defaults to address + 1)
     * @param registers Values to add to the general purpose registers, R0, R1, R2, etc.
     */
    CortexM.prototype.execute = function (address, code, stackPointer, programCounter, linkRegister) {
        var _this = this;
        if (linkRegister === void 0) { linkRegister = address + 1; }
        var registers = [];
        for (var _i = 5; _i < arguments.length; _i++) {
            registers[_i - 5] = arguments[_i];
        }
        // Ensure a breakpoint exists at the end of the code
        if (code[code.length - 1] !== BKPT_INSTRUCTION) {
            var newCode = new Uint32Array(code.length + 1);
            newCode.set(code);
            newCode.set([BKPT_INSTRUCTION], code.length - 1);
            code = newCode;
        }
        // Create sequence of core register writes
        var sequence = [
            this.writeCoreRegisterCommand(13 /* SP */, stackPointer),
            this.writeCoreRegisterCommand(15 /* PC */, programCounter),
            this.writeCoreRegisterCommand(14 /* LR */, linkRegister)
        ];
        // Add in register values R0, R1, R2, etc.
        for (var i = 0; i < Math.min(registers.length, GENERAL_REGISTER_COUNT); i++) {
            sequence.push(this.writeCoreRegisterCommand(i, registers[i]));
        }
        return this.halt() // Halt the target
            .then(function () { return _this.transferSequence(sequence); }) // Write the registers
            .then(function () { return _this.writeBlock(address, code); }) // Write the code to the address
            .then(function () { return _this.resume(false); }) // Resume the target, without waiting
            .then(function () { return _this.waitDelay(function () { return _this.isHalted(); }, 100, EXECUTE_TIMEOUT); }); // Wait for the target to halt on the breakpoint
    };
    return CortexM;
}(dap_1.ADI));
exports.CortexM = CortexM;



},{"../dap":2}],5:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var cortex_m_1 = require("./cortex-m");
exports.CortexM = cortex_m_1.CortexM;



},{"./cortex-m":4}],6:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
/**
 * @hidden
 */
exports.DEFAULT_CLOCK_FREQUENCY = 10000000;
/**
 * @hidden
 */
var SWD_SEQUENCE = 0xE79E;
/**
 * @hidden
 */
var JTAG_SEQUENCE = 0xE73C;
/**
 * @hidden
 */
var BLOCK_HEADER_SIZE = 4;
/**
 * @hidden
 */
var TRANSFER_HEADER_SIZE = 2;
/**
 * @hidden
 */
var TRANSFER_OPERATION_SIZE = 5;
/**
 * CMSIS-DAP class
 * https://www.keil.com/pack/doc/CMSIS/DAP/html/group__DAP__Commands__gr.html
 */
var CmsisDAP = /** @class */ (function (_super) {
    __extends(CmsisDAP, _super);
    /**
     * CMSIS-DAP constructor
     * @param transport Debug transport to use
     * @param mode Debug mode to use
     * @param clockFrequency Communication clock frequency to use (default 10000000)
     */
    function CmsisDAP(transport, mode, clockFrequency) {
        if (mode === void 0) { mode = 0 /* DEFAULT */; }
        if (clockFrequency === void 0) { clockFrequency = exports.DEFAULT_CLOCK_FREQUENCY; }
        var _this = _super.call(this) || this;
        _this.transport = transport;
        _this.mode = mode;
        _this.clockFrequency = clockFrequency;
        // Determine the block size
        _this.blockSize = _this.transport.packetSize - BLOCK_HEADER_SIZE - 1; // -1 for the DAP_TRANSFER_BLOCK command
        // Determine the operation count possible
        var operationSpace = _this.transport.packetSize - TRANSFER_HEADER_SIZE - 1; // -1 for the DAP_TRANSFER command
        _this.operationCount = Math.floor(operationSpace / TRANSFER_OPERATION_SIZE);
        return _this;
    }
    CmsisDAP.prototype.delay = function (timeout) {
        return new Promise(function (resolve, _reject) {
            setTimeout(resolve, timeout);
        });
    };
    CmsisDAP.prototype.bufferSourceToUint8Array = function (prefix, data) {
        if (!data) {
            return new Uint8Array([prefix]);
        }
        function isView(source) {
            return source.buffer !== undefined;
        }
        var arrayBuffer = isView(data) ? data.buffer : data;
        var result = new Uint8Array(arrayBuffer.byteLength + 1);
        result.set([prefix]);
        result.set(new Uint8Array(arrayBuffer), 1);
        return result;
    };
    /**
     * Switches the CMSIS-DAP unit to use SWD
     * http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.ddi0316d/Chdhfbhc.html
     */
    CmsisDAP.prototype.selectProtocol = function (protocol) {
        var _this = this;
        var sequence = protocol === 2 /* JTAG */ ? JTAG_SEQUENCE : SWD_SEQUENCE;
        return this.swjSequence(new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])) // Sequence of 1's
            .then(function () { return _this.swjSequence(new Uint16Array([sequence])); }) // Send protocol sequence
            .then(function () { return _this.swjSequence(new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])); }) // Sequence of 1's
            .then(function () { return _this.swjSequence(new Uint8Array([0x00])); });
    };
    /**
     * Send a command
     * @param command Command to send
     * @param data Data to use
     * @returns Promise of DataView
     */
    CmsisDAP.prototype.send = function (command, data) {
        var _this = this;
        var array = this.bufferSourceToUint8Array(command, data);
        return this.transport.write(array)
            .then(function () { return _this.transport.read(); })
            .then(function (response) {
            if (response.getUint8(0) !== command) {
                throw new Error("Bad response for " + command + " -> " + response.getUint8(0));
            }
            switch (command) {
                case 3 /* DAP_DISCONNECT */:
                case 8 /* DAP_WRITE_ABORT */:
                case 9 /* DAP_DELAY */:
                case 10 /* DAP_RESET_TARGET */:
                case 17 /* DAP_SWJ_CLOCK */:
                case 18 /* DAP_SWJ_SEQUENCE */:
                case 19 /* DAP_SWD_CONFIGURE */:
                case 29 /* DAP_SWD_SEQUENCE */:
                case 23 /* DAP_SWO_TRANSPORT */:
                case 24 /* DAP_SWO_MODE */:
                case 26 /* DAP_SWO_CONTROL */:
                case 21 /* DAP_JTAG_CONFIGURE */:
                case 22 /* DAP_JTAG_ID_CODE */:
                case 4 /* DAP_TRANSFER_CONFIGURE */:
                    if (response.getUint8(1) !== 0 /* DAP_OK */) {
                        throw new Error("Bad status for " + command + " -> " + response.getUint8(1));
                    }
            }
            return response;
        });
    };
    /**
     * Get DAP information
     * @param request Type of information to get
     * @returns Promise of number or string
     */
    CmsisDAP.prototype.dapInfo = function (request) {
        return this.send(0 /* DAP_INFO */, new Uint8Array([request]))
            .then(function (result) {
            var length = result.getUint8(1);
            if (length === 0) {
                throw new Error("DAP Info Failure");
            }
            switch (request) {
                case 240 /* CAPABILITIES */:
                case 254 /* PACKET_COUNT */:
                case 255 /* PACKET_SIZE */:
                case 253 /* SWO_TRACE_BUFFER_SIZE */:
                    // Byte
                    if (length === 1)
                        return result.getUint8(2);
                    // Short
                    if (length === 2)
                        return result.getUint16(2);
                    // Word
                    if (length === 4)
                        return result.getUint32(2);
            }
            var ascii = Array.prototype.slice.call(new Uint8Array(result.buffer, 2, length));
            return String.fromCharCode.apply(null, ascii);
        });
    };
    /**
     * Send an SWJ Sequence
     * https://www.keil.com/pack/doc/CMSIS/DAP/html/group__DAP__SWJ__Sequence.html
     * @param sequence The sequence to send
     * @returns Promise
     */
    CmsisDAP.prototype.swjSequence = function (sequence) {
        var bitLength = sequence.byteLength * 8;
        var data = this.bufferSourceToUint8Array(bitLength, sequence);
        return this.send(18 /* DAP_SWJ_SEQUENCE */, data)
            .then(function () { return undefined; });
    };
    /**
     * Configure Transfer
     * https://www.keil.com/pack/doc/CMSIS/DAP/html/group__DAP__TransferConfigure.html
     * @param idleCycles Number of extra idle cycles after each transfer
     * @param waitRetry Number of transfer retries after WAIT response
     * @param matchRetry Number of retries on reads with Value Match in DAP_Transfer
     * @returns Promise
     */
    CmsisDAP.prototype.configureTransfer = function (idleCycles, waitRetry, matchRetry) {
        var data = new Uint8Array(5);
        var view = new DataView(data.buffer);
        view.setUint8(0, idleCycles);
        view.setUint16(1, waitRetry, true);
        view.setUint16(3, matchRetry, true);
        return this.send(4 /* DAP_TRANSFER_CONFIGURE */, data)
            .then(function () { return undefined; });
    };
    /**
     * Connect to target device
     * @returns Promise
     */
    CmsisDAP.prototype.connect = function () {
        var _this = this;
        return this.transport.open()
            .then(function () { return _this.send(17 /* DAP_SWJ_CLOCK */, new Uint32Array([_this.clockFrequency])); })
            .then(function () { return _this.send(2 /* DAP_CONNECT */, new Uint8Array([_this.mode])); })
            .then(function (result) {
            if (result.getUint8(1) === 0 /* FAILED */ || _this.mode !== 0 /* DEFAULT */ && result.getUint8(1) !== _this.mode) {
                throw new Error("Mode not enabled.");
            }
        })
            .then(function () { return _this.configureTransfer(0, 100, 0); })
            .then(function () { return _this.selectProtocol(1 /* SWD */); });
    };
    /**
     * Disconnect from target device
     * @returns Promise
     */
    CmsisDAP.prototype.disconnect = function () {
        var _this = this;
        return this.send(3 /* DAP_DISCONNECT */)
            .then(function () {
            return _this.transport.close();
        });
    };
    /**
     * Reconnect to target device
     * @returns Promise
     */
    CmsisDAP.prototype.reconnect = function () {
        var _this = this;
        return this.disconnect()
            .then(function () { return _this.delay(100); })
            .then(function () { return _this.connect(); });
    };
    /**
     * Reset target device
     * @returns Promise of whether a device specific reset sequence is implemented
     */
    CmsisDAP.prototype.reset = function () {
        return this.send(10 /* DAP_RESET_TARGET */)
            .then(function (response) { return response.getUint8(2) === 1 /* RESET_SEQUENCE */; });
    };
    CmsisDAP.prototype.transfer = function (portOrOps, mode, register, value) {
        if (mode === void 0) { mode = 2 /* READ */; }
        if (register === void 0) { register = 0; }
        if (value === void 0) { value = 0; }
        var operations;
        if (typeof portOrOps === "number") {
            operations = [{
                    port: portOrOps,
                    mode: mode,
                    register: register,
                    value: value
                }];
        }
        else {
            operations = portOrOps;
        }
        var data = new Uint8Array(TRANSFER_HEADER_SIZE + (operations.length * TRANSFER_OPERATION_SIZE));
        var view = new DataView(data.buffer);
        // DAP Index, ignored for SWD
        view.setUint8(0, 0);
        // Transfer count
        view.setUint8(1, operations.length);
        operations.forEach(function (operation, index) {
            var offset = TRANSFER_HEADER_SIZE + (index * TRANSFER_OPERATION_SIZE);
            // Transfer request
            view.setUint8(offset, operation.port | operation.mode | operation.register);
            // Transfer data
            view.setUint32(offset + 1, operation.value || 0, true);
        });
        return this.send(5 /* DAP_TRANSFER */, data)
            .then(function (result) {
            // Transfer count
            if (result.getUint8(1) !== operations.length) {
                throw new Error("Transfer count mismatch");
            }
            // Transfer response
            var response = result.getUint8(2);
            if (response === 2 /* WAIT */) {
                throw new Error("Transfer response WAIT");
            }
            if (response === 4 /* FAULT */) {
                throw new Error("Transfer response FAULT");
            }
            if (response === 8 /* PROTOCOL_ERROR */) {
                throw new Error("Transfer response PROTOCOL_ERROR");
            }
            if (response === 16 /* VALUE_MISMATCH */) {
                throw new Error("Transfer response VALUE_MISMATCH");
            }
            if (response === 7 /* NO_ACK */) {
                throw new Error("Transfer response NO_ACK");
            }
            if (typeof portOrOps === "number") {
                return result.getUint32(3, true);
            }
            var length = operations.length * 4;
            return new Uint32Array(result.buffer.slice(3, 3 + length));
        });
    };
    CmsisDAP.prototype.transferBlock = function (port, register, countOrValues) {
        var operationCount;
        var mode;
        var dataSize = BLOCK_HEADER_SIZE;
        if (typeof countOrValues === "number") {
            operationCount = countOrValues;
            mode = 2 /* READ */;
        }
        else {
            operationCount = countOrValues.length;
            mode = 0 /* WRITE */;
            dataSize += countOrValues.byteLength;
        }
        var data = new Uint8Array(dataSize);
        var view = new DataView(data.buffer);
        // DAP Index, ignored for SWD
        view.setUint8(0, 0);
        // Transfer count
        view.setUint16(1, operationCount, true);
        // Transfer request
        view.setUint8(3, port | mode | register);
        if (typeof countOrValues !== "number") {
            // Transfer data
            data.set(countOrValues, BLOCK_HEADER_SIZE);
        }
        return this.send(6 /* DAP_TRANSFER_BLOCK */, view)
            .then(function (result) {
            // Transfer count
            if (result.getUint16(1, true) !== operationCount) {
                throw new Error("Transfer count mismatch");
            }
            // Transfer response
            var response = result.getUint8(3);
            if (response & 2 /* WAIT */) {
                throw new Error("Transfer response WAIT");
            }
            if (response & 4 /* FAULT */) {
                throw new Error("Transfer response FAULT");
            }
            if (response & 8 /* PROTOCOL_ERROR */) {
                throw new Error("Transfer response PROTOCOL_ERROR");
            }
            if (response & 7 /* NO_ACK */) {
                throw new Error("Transfer response NO_ACK");
            }
            if (typeof countOrValues === "number") {
                return new Uint32Array(result.buffer.slice(4));
            }
            return undefined;
        });
    };
    return CmsisDAP;
}(events_1.EventEmitter));
exports.CmsisDAP = CmsisDAP;



},{"events":10}],7:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var cmsis_dap_1 = require("./cmsis-dap");
exports.CmsisDAP = cmsis_dap_1.CmsisDAP;



},{"./cmsis-dap":6}],8:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
var DEFAULT_CONFIGURATION = 1;
/**
 * @hidden
 */
var DEFAULT_CLASS = 0xFF;
/**
 * @hidden
 */
var GET_REPORT = 0x01;
/**
 * @hidden
 */
var SET_REPORT = 0x09;
/**
 * @hidden
 */
var OUT_REPORT = 0x200;
/**
 * @hidden
 */
var IN_REPORT = 0x100;
/**
 * WebUSB Transport class
 * https://wicg.github.io/webusb/
 */
var WebUSB = /** @class */ (function () {
    /**
     * WebUSB constructor
     * @param device WebUSB device to use
     * @param interfaceClass Optional interface class to use (default: 0xFF)
     * @param configuration Optional Configuration to use (default: 1)
     */
    function WebUSB(device, interfaceClass, configuration) {
        if (interfaceClass === void 0) { interfaceClass = DEFAULT_CLASS; }
        if (configuration === void 0) { configuration = DEFAULT_CONFIGURATION; }
        this.device = device;
        this.interfaceClass = interfaceClass;
        this.configuration = configuration;
        this.packetSize = 64;
    }
    WebUSB.prototype.extendBuffer = function (data, packetSize) {
        function isView(source) {
            return source.buffer !== undefined;
        }
        var arrayBuffer = isView(data) ? data.buffer : data;
        var length = Math.min(arrayBuffer.byteLength, packetSize);
        var result = new Uint8Array(length);
        result.set(new Uint8Array(arrayBuffer));
        return result;
    };
    /**
     * Open device
     * @returns Promise
     */
    WebUSB.prototype.open = function () {
        var _this = this;
        return this.device.open()
            .then(function () { return _this.device.selectConfiguration(_this.configuration); })
            .then(function () {
            var interfaces = _this.device.configuration.interfaces.filter(function (iface) {
                return iface.alternates[0].interfaceClass === _this.interfaceClass;
            });
            if (!interfaces.length) {
                throw new Error("No valid interfaces found.");
            }
            _this.interfaceNumber = interfaces[0].interfaceNumber;
            return _this.device.claimInterface(_this.interfaceNumber);
        });
    };
    /**
     * Close device
     * @returns Promise
     */
    WebUSB.prototype.close = function () {
        return this.device.close();
    };
    /**
     * Read from device
     * @returns Promise of DataView
     */
    WebUSB.prototype.read = function () {
        if (!this.interfaceNumber)
            return Promise.reject("No device opened");
        return this.device.controlTransferIn({
            requestType: "class",
            recipient: "interface",
            request: GET_REPORT,
            value: IN_REPORT,
            index: this.interfaceNumber
        }, this.packetSize)
            .then(function (result) { return result.data; });
    };
    /**
     * Write to device
     * @param data Data to write
     * @returns Promise
     */
    WebUSB.prototype.write = function (data) {
        if (!this.interfaceNumber)
            return Promise.reject("No device opened");
        var buffer = this.extendBuffer(data, this.packetSize);
        return this.device.controlTransferOut({
            requestType: "class",
            recipient: "interface",
            request: SET_REPORT,
            value: OUT_REPORT,
            index: this.interfaceNumber
        }, buffer)
            .then(function () { return undefined; });
    };
    return WebUSB;
}());
exports.WebUSB = WebUSB;



},{}],9:[function(require,module,exports){
"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
exports.CmsisDAP = proxy_1.CmsisDAP;
var daplink_1 = require("./daplink");
exports.DAPLink = daplink_1.DAPLink;
var dap_1 = require("./dap");
exports.ADI = dap_1.ADI;
var processor_1 = require("./processor");
exports.CortexM = processor_1.CortexM;
var webusb_1 = require("./transport/webusb");
exports.WebUSB = webusb_1.WebUSB;



},{"./dap":2,"./daplink":3,"./processor":5,"./proxy":7,"./transport/webusb":8}],10:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}]},{},[9])(9)
});

//# sourceMappingURL=dap.bundle.js.map
