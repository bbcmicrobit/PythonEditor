/*
    This file is made up of a combination of original code, along with code extracted from the following repositories:
    https://github.com/mmoskal/dapjs/tree/a32f11f54e9e76a9c61896ddd425c1cb1a29c143
    https://github.com/microsoft/pxt-microbit

    The pxt-microbit license is included below.
*/
/*
    PXT - Programming Experience Toolkit

    The MIT License (MIT)

    Copyright (c) Microsoft Corporation

    All rights reserved.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

'use strict';

let loggedBoardId = 'none';
let loggedBoardFamilyHic = 'none';

let PartialFlashingUtils = {
    pageSize: null,
    numPages: null,
    log: console.log,

    // The Control/Status Word register is used to configure and control transfers through the APB interface.
    // This is drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/dap/constants.ts#L28
    // Csw.CSW_VALUE = (CSW_RESERVED | CSW_MSTRDBG | CSW_HPROT | CSW_DBGSTAT | CSW_SADDRINC)
    CSW_VALUE: (0x01000000 | 0x20000000 | 0x02000000 | 0x00000040 | 0x00000010),

    // Represents the micro:bit's core registers
    // Drawn from https://armmbed.github.io/dapjs/docs/enums/coreregister.html
    CoreRegister: {
        SP: 13,
        LR: 14,
        PC: 15
    },

    // FICR Registers
    FICR: {
        CODEPAGESIZE: 0x10000000 | 0x10,
        CODESIZE:     0x10000000 | 0x14,
    },

    read32FromUInt8Array: function(data, i) {
        return (data[i] | (data[i + 1] << 8) | (data[i + 2] << 16) | (data[i + 3] << 24)) >>> 0;
    },

    bufferConcat: function(bufs) {
        let len = 0;
        for (const b of bufs) {
            len += b.length;
        }
        const r = new Uint8Array(len);
        len = 0;
        for (const b of bufs) {
            r.set(b, len);
            len += b.length;
        }
        return r;
    },

    // Returns the MurmurHash of the data passed to it, used for checksum calculation.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L14
    murmur3_core: function(data) {
        let h0 = 0x2F9BE6CC;
        let h1 = 0x1EC3A6C8;

        for (let i = 0; i < data.byteLength; i += 4) {
            let k = this.read32FromUInt8Array(data, i) >>> 0;
            k = Math.imul(k, 0xcc9e2d51);
            k = (k << 15) | (k >>> 17);
            k = Math.imul(k, 0x1b873593);

            h0 ^= k;
            h1 ^= k;
            h0 = (h0 << 13) | (h0 >>> 19);
            h1 = (h1 << 13) | (h1 >>> 19);
            h0 = (Math.imul(h0, 5) + 0xe6546b64) >>> 0;
            h1 = (Math.imul(h1, 5) + 0xe6546b64) >>> 0;
        }
        return [h0, h1]
    },

    // Returns a representation of an Access Port Register.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/util.ts#L63
    apReg: function(r, mode) {
        const v = r | mode | (1 << 0); // DapVal.AP_ACC;
        return 4 + ((v & 0x0c) >> 2);
    },

    // Returns a code representing a request to read/write a certain register.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/util.ts#L92
    regRequest: function(regId, isWrite = false) {
        let request = !isWrite ? (1 << 1) /* READ */ : (0 << 1) /* WRITE */;

        if (regId < 4) {
            request |= (0 << 0) /* DP_ACC */;
        } else {
            request |= (1 << 0) /* AP_ACC */;
        }

        request |= (regId & 3) << 2;

        return request;
    },

    // Split buffer into pages, each of pageSize size.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L209
    pageAlignBlocks: function(buffer, targetAddr) {
        class Page {
            constructor(targetAddr, data) {
                this.targetAddr = targetAddr;
                this.data = data;
            }
        };

        let unaligned = new Uint8Array(buffer);
        let pages = [];
        for (let i = 0; i < unaligned.byteLength;) {
            let newbuf = new Uint8Array(this.pageSize).fill(0xff);
            let startPad = (targetAddr + i) & (this.pageSize - 1)
            let newAddr = (targetAddr + i) - startPad
            for (; i < unaligned.byteLength; ++i) {
                if (targetAddr + i >= newAddr + this.pageSize)
                    break
                newbuf[targetAddr + i - newAddr] = unaligned[i];
            }
            let page = new Page(newAddr, newbuf);
            pages.push(page);
        }
        return pages;
    },

    // Filter out all pages whose calculated checksum matches the corresponding checksum passed as an argument.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L523
    onlyChanged: function(pages, checksums) {
        return pages.filter(page => {
            let idx = page.targetAddr / this.pageSize
            if (idx * 8 + 8 > checksums.length)
                return true // out of range?
            let c0 = this.read32FromUInt8Array(checksums, idx * 8)
            let c1 = this.read32FromUInt8Array(checksums, idx * 8 + 4)
            let ch = this.murmur3_core(page.data)
            if (c0 == ch[0] && c1 == ch[1])
                return false
            return true
        })
    }
}

class DAPWrapper {

    constructor(device) {
        this.reconnected = false;
        this.flashing = true;
        this.device = device;
        this.allocBoardInfo();
        this.allocDAP();
    }

    allocBoardInfo() {
        if (!this.device) {
            throw new Error('Could not obtain device info.');
        }
        // Check if the micro:bit is connected in MAINTENANCE mode (DAPLink bootloader)
        if (this.device.deviceClass == "0") {
            // This message is intercepted by python-main.js/webusbErrorHandler()
            // so ensure changes are reflected there as well
            throw new Error('device-bootloader');
        }
        // The micro:bit board ID is the serial number first 4 hex digits
        if (!this.device.serialNumber) {
            throw new Error('Could not detected ID from connected board.');
        }
        this.boardId = this.device.serialNumber.substring(0,4);
        this.boardFamilyId = this.device.serialNumber.substring(4, 8);
        this.boardHic = this.device.serialNumber.slice(-8);
        if (this.device.serialNumber.length !== 48) {
            PartialFlashingUtils.log("USB serial number unexpected length: " +
                this.device.serialNumber.length);
        }
        PartialFlashingUtils.log("Detected board ID " + this.boardId);
        let boardFamilyHic = this.boardFamilyId + this.boardHic;
        if ((loggedBoardId != this.boardId) || (loggedBoardFamilyHic != boardFamilyHic)) {
            document.dispatchEvent(new CustomEvent('webusb', { detail: {
                'flash-type': 'webusb',
                'event-type': 'info',
                'message': 'board-id/' + this.boardId,
            }}));
            document.dispatchEvent(new CustomEvent('webusb', { detail: {
                'flash-type': 'webusb',
                'event-type': 'info',
                'message': 'board-family-hic/' + boardFamilyHic,
            }}));
            loggedBoardId = this.boardId;
            loggedBoardFamilyHic = boardFamilyHic;
        }
    }

    allocDAP() {
        this.transport = new DAPjs.WebUSB(this.device);
        this.daplink = new DAPjs.DAPLink(this.transport);
        this.cortexM = new DAPjs.CortexM(this.transport);
    }

    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L119
    reconnectAsync() {
        let self = this;
        let p = Promise.resolve();

        // Only fully reconnect after the first time this object has reconnected.
        if (!self.reconnected) {
            self.reconnected = true;
            p = p.then(() => self.allocDAP())
                 .then(() => self.disconnectAsync());
        }
        return p
            .then(() => self.daplink.connect())
            .then(() => self.cortexM.connect());
    }

    disconnectAsync() {
        let self = this;
        if (self.device.opened && self.transport.interfaceNumber !== undefined) {
            return self.daplink.disconnect();
        }
        return Promise.resolve();
    }

    // Send a packet to the micro:bit directly via WebUSB and return the response.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/transport/cmsis_dap.ts#L161
    async send(packet) {
        const array = Uint8Array.from(packet);
        await this.transport.write(array.buffer);

        const response = await this.transport.read();
        return new Uint8Array(response.buffer);
    }

    // Send a command along with relevant data to the micro:bit directly via WebUSB and handle the response.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/transport/cmsis_dap.ts#L74
    async cmdNums(op, data) {
        data.unshift(op);

        const buf = await this.send(data);

        if (buf[0] !== op) {
            throw new Error(`Bad response for ${op} -> ${buf[0]}`);
        }

        switch (op) {
            case 0x02: // DapCmd.DAP_CONNECT:
            case 0x00: // DapCmd.DAP_INFO:
            case 0x05: // DapCmd.DAP_TRANSFER:
            case 0x06: // DapCmd.DAP_TRANSFER_BLOCK:
                break;
            default:
                if (buf[1] !== 0) {
                    throw new Error(`Bad status for ${op} -> ${buf[1]}`);
                }
        }

        return buf;
    }

    // Read a certain register a specified amount of times.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/dap/dap.ts#L117
    async readRegRepeat(regId, cnt) {
        const request = PartialFlashingUtils.regRequest(regId);
        const sendargs = [0, cnt];

        for (let i = 0; i < cnt; ++i) {
            sendargs.push(request);
        }

        // Transfer the read requests to the micro:bit and retrieve the data read.
        const buf = await this.cmdNums(0x05 /* DapCmd.DAP_TRANSFER */, sendargs);

        if (buf[1] !== cnt) {
            throw new Error(("(many) Bad #trans " + buf[1]));
        } else if (buf[2] !== 1) {
            throw new Error(("(many) Bad transfer status " + buf[2]));
        }

        return buf.subarray(3, 3 + cnt * 4);
    }

    // Write to a certain register a specified amount of data.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/dap/dap.ts#L138
    async writeRegRepeat(regId, data) {
        const request = PartialFlashingUtils.regRequest(regId, true);
        const sendargs = [0, data.length, 0, request];

        data.forEach((d) => {
            // separate d into bytes
            sendargs.push(d & 0xff, (d >> 8) & 0xff, (d >> 16) & 0xff, (d >> 24) & 0xff);
        });

        // Transfer the write requests to the micro:bit and retrieve the response status.
        const buf = await this.cmdNums(0x06 /* DapCmd.DAP_TRANSFER */, sendargs);

        if (buf[3] !== 1) {
            throw new Error(("(many-wr) Bad transfer status " + buf[2]));
        }
    }

    // Core functionality reading a block of data from micro:bit RAM at a specified address.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/memory/memory.ts#L181
    async readBlockCore(addr, words) {
        // Set up CMSIS-DAP to read/write from/to the RAM address addr using the register ApReg.DRW to write to or read from.
        await this.cortexM.writeAP(0x00 /* ApReg.CSW */, PartialFlashingUtils.CSW_VALUE /* Csw.CSW_VALUE */ | 0x00000002 /* Csw.CSW_SIZE32 */);
        await this.cortexM.writeAP(0x04 /* ApReg.TAR */, addr);

        let lastSize = words % 15;
        if (lastSize === 0) {
            lastSize = 15;
        }

        const blocks = [];

        for (let i = 0; i < Math.ceil(words / 15); i++) {
            const b = await this.readRegRepeat(
                PartialFlashingUtils.apReg(0x0C /* ApReg.DRW */, 1 << 1 /* DapVal.READ */),
                i === blocks.length - 1 ? lastSize : 15,
            );
            blocks.push(b);
        }

        return PartialFlashingUtils.bufferConcat(blocks).subarray(0, words * 4);
    }

    // Core functionality writing a block of data to micro:bit RAM at a specified address.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/memory/memory.ts#L205
    async writeBlockCore(addr, words) {
        try {
            // Set up CMSIS-DAP to read/write from/to the RAM address addr using the register ApReg.DRW to write to or read from.
            await this.cortexM.writeAP(0x00 /* ApReg.CSW */, PartialFlashingUtils.CSW_VALUE /* Csw.CSW_VALUE */ | 0x00000002 /* Csw.CSW_SIZE32 */);
            await this.cortexM.writeAP(0x04 /* ApReg.TAR */, addr);

            await this.writeRegRepeat(PartialFlashingUtils.apReg(0x0C /* ApReg.DRW */, 0 << 1 /* DapVal.WRITE */), words)
        } catch (e) {
            if (e.dapWait) {
                // Retry after a delay if required.
                PartialFlashingUtils.log(`transfer wait, write block`);
                await delay(100);
                return await this.writeBlockCore(addr, words);
            } else {
                throw e;
            }
        }
    }

    // Reads a block of data from micro:bit RAM at a specified address.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/memory/memory.ts#L143
    async readBlockAsync(addr, words) {
        const bufs = [];
        const end = addr + words * 4;
        let ptr = addr;

        // Read a single page at a time.
        while (ptr < end) {
            let nextptr = ptr + PartialFlashingUtils.pageSize;
            if (ptr === addr) {
                nextptr &= ~(PartialFlashingUtils.pageSize - 1);
            }
            const len = Math.min(nextptr - ptr, end - ptr);
            bufs.push(await this.readBlockCore(ptr, len >> 2));
            ptr = nextptr;
        }
        const result = PartialFlashingUtils.bufferConcat(bufs);
        return result.subarray(0, words * 4);
    }

    // Writes a block of data to micro:bit RAM at a specified address.
    async writeBlockAsync(address, data) {
        let payloadSize = this.transport.packetSize - 8;
        if (data.buffer.byteLength > payloadSize) {
            let start = 0;
            let end = payloadSize;

            // Split write up into smaller writes whose data can each be held in a single packet.
            while (start != end) {
                let temp = new Uint32Array(data.buffer.slice(start, end))
                await this.writeBlockCore(address + start, temp);

                start = end;
                end = Math.min(data.buffer.byteLength, end + payloadSize);
            }
        }
        else {
            await this.writeBlockCore(address, data);
        }
    }

    // Execute code at a certain address with specified values in the registers.
    // Waits for execution to halt.
    async executeAsync(address, code, sp, pc, lr) {
        if (arguments.length > 17) {
            return Promise.resolve();
        }

        await this.cortexM.halt(true)
            .then(() => this.writeBlockAsync(address, code))
            .then(() => this.cortexM.writeCoreRegister(PartialFlashingUtils.CoreRegister.PC, pc))
            .then(() => this.cortexM.writeCoreRegister(PartialFlashingUtils.CoreRegister.LR, lr))
            .then(() => this.cortexM.writeCoreRegister(PartialFlashingUtils.CoreRegister.SP, sp))

        for (let i = 5; i < arguments.length; ++i) {
            await this.cortexM.writeCoreRegister(i - 5, arguments[i]);
        }

        return Promise.resolve().then(() => this.cortexM.resume(true))
            .then(() => this.waitForHalt());
    }

    // Checks whether the micro:bit has halted or timeout has been reached.
    // Recurses otherwise.
    async waitForHaltCore(halted, timeout) {
        let self = this;
        if (new Date().getTime() > timeout) {
            return Promise.reject("Timeout waiting for halt core.");
        }
        if (halted) {
            return Promise.resolve();
        }
        else {
            return this.cortexM.isHalted().then(a => self.waitForHaltCore(a, timeout));
        }
    }

    // Initial function to call to wait for the micro:bit halt.
    async waitForHalt(timeToWait = 10000) {
        return this.waitForHaltCore(false, new Date().getTime() + timeToWait);
    }

    // Resets the micro:bit in software by writing to NVIC_AIRCR.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/cortex/cortex.ts#L347
    async softwareReset() {
        await this.cortexM.writeMem32(3758157068 /* NVIC_AIRCR */, 100270080 /* NVIC_AIRCR_VECTKEY */ | 4 /* NVIC_AIRCR_SYSRESETREQ */);

        // wait for the system to come out of reset
        let dhcsr = await this.cortexM.readMem32(3758157296 /* DHCSR */);

        while ((dhcsr & 33554432 /* S_RESET_ST */) !== 0) {
            dhcsr = await this.cortexM.readMem32(3758157296 /* DHCSR */);
        }
    }

    // Reset the micro:bit, possibly halting the core on reset.
    // Drawn from https://github.com/mmoskal/dapjs/blob/a32f11f54e9e76a9c61896ddd425c1cb1a29c143/src/cortex/cortex.ts#L248
    async reset(halt = false) {
        if (halt) {
            await this.cortexM.halt(true);

            let demcrAddr = 3758157308;

            // VC_CORERESET causes the core to halt on reset.
            const demcr = await this.cortexM.readMem32(demcrAddr);
            await this.cortexM.writeMem32(demcrAddr, demcr | 1 /* DEMCR_VC_CORERESET */);

            await this.softwareReset();
            await this.waitForHalt();

            // Unset the VC_CORERESET bit
            await this.cortexM.writeMem32(demcrAddr, demcr);
        } else {
            await this.softwareReset();
        }
    }
}

let PartialFlashing = {

    // Source code for binaries in can be found at https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/external/sha/source/main.c
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L243
    // Update from https://github.com/microsoft/pxt-microbit/commit/a35057717222b8e48335144f497b55e29e9b0f25
    flashPageBIN: new Uint32Array([
        0xbe00be00, // bkpt - LR is set to this
        0x2502b5f0, 0x4c204b1f, 0xf3bf511d, 0xf3bf8f6f, 0x25808f4f, 0x002e00ed,
        0x2f00595f, 0x25a1d0fc, 0x515800ed, 0x2d00599d, 0x2500d0fc, 0xf3bf511d,
        0xf3bf8f6f, 0x25808f4f, 0x002e00ed, 0x2f00595f, 0x2501d0fc, 0xf3bf511d,
        0xf3bf8f6f, 0x599d8f4f, 0xd0fc2d00, 0x25002680, 0x00f60092, 0xd1094295,
        0x511a2200, 0x8f6ff3bf, 0x8f4ff3bf, 0x2a00599a, 0xbdf0d0fc, 0x5147594f,
        0x2f00599f, 0x3504d0fc, 0x46c0e7ec, 0x4001e000, 0x00000504,
    ]),

    // void computeHashes(uint32_t *dst, uint8_t *ptr, uint32_t pageSize, uint32_t numPages)
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L253
    computeChecksums2: new Uint32Array([
        0x4c27b5f0, 0x44a52680, 0x22009201, 0x91004f25, 0x00769303, 0x24080013,
        0x25010019, 0x40eb4029, 0xd0002900, 0x3c01407b, 0xd1f52c00, 0x468c0091,
        0xa9044665, 0x506b3201, 0xd1eb42b2, 0x089b9b01, 0x23139302, 0x9b03469c,
        0xd104429c, 0x2000be2a, 0x449d4b15, 0x9f00bdf0, 0x4d149e02, 0x49154a14,
        0x3e01cf08, 0x2111434b, 0x491341cb, 0x405a434b, 0x4663405d, 0x230541da,
        0x4b10435a, 0x466318d2, 0x230541dd, 0x4b0d435d, 0x2e0018ed, 0x6002d1e7,
        0x9a009b01, 0x18d36045, 0x93003008, 0xe7d23401, 0xfffffbec, 0xedb88320,
        0x00000414, 0x1ec3a6c8, 0x2f9be6cc, 0xcc9e2d51, 0x1b873593, 0xe6546b64,
    ]),

    membase: 0x20000000,
    loadAddr: 0x20000000,
    dataAddr: 0x20002000,
    stackAddr: 0x20001000,

    // Returns a new DAPWrapper or reconnects a previously used one.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L161
    dapAsync: function() {
        if (window.previousDapWrapper) {
            if (window.previousDapWrapper.device.opened) {
                return window.previousDapWrapper.reconnectAsync(false) // Always fully reconnect to handle device unplugged mid-session
                    .then(() => window.previousDapWrapper);
            }
        }
        return Promise.resolve()
            .then(() => {
                if (window.previousDapWrapper) {
                    return window.previousDapWrapper.disconnectAsync();
                }
                return Promise.resolve();
            })
            .then(() => {
                if (window.previousDapWrapper && window.previousDapWrapper.device) {
                    return window.previousDapWrapper.device;
                }
                return navigator.usb.requestDevice({ filters: [{vendorId: 0x0d28, productId: 0x0204}] });
            })
            .then(device => {
                let w = new DAPWrapper(device);
                window.previousDapWrapper = w;
                return w.reconnectAsync(true).then(() => w)
            });
    },

    // Runs the checksum algorithm on the micro:bit's whole flash memory, and returns the results.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L365
    getFlashChecksumsAsync: function(dapwrapper) {
        return dapwrapper.executeAsync(this.loadAddr, this.computeChecksums2, this.stackAddr, this.loadAddr + 1, 0xffffffff,
                                      this.dataAddr, 0, PartialFlashingUtils.pageSize, PartialFlashingUtils.numPages)
            .then(() => {
                return dapwrapper.readBlockAsync(this.dataAddr, PartialFlashingUtils.numPages * 2);
            });
    },

    // Runs the code on the micro:bit to copy a single page of data from RAM address addr to the ROM address specified by the page.
    // Does not wait for execution to halt.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L340
    runFlash: async function(page, addr) {
        await dapwrapper.cortexM.halt(true);
        return Promise.all([dapwrapper.cortexM.writeCoreRegister(PartialFlashingUtils.CoreRegister.PC, this.loadAddr + 4 + 1),
              dapwrapper.cortexM.writeCoreRegister(PartialFlashingUtils.CoreRegister.LR, this.loadAddr + 1),
              dapwrapper.cortexM.writeCoreRegister(PartialFlashingUtils.CoreRegister.SP, this.stackAddr),
              dapwrapper.cortexM.writeCoreRegister(0, page.targetAddr),
              dapwrapper.cortexM.writeCoreRegister(1, addr),
              dapwrapper.cortexM.writeCoreRegister(2, PartialFlashingUtils.pageSize >> 2)])
            .then(() => dapwrapper.cortexM.resume(false));
    },

    // Write a single page of data to micro:bit ROM by writing it to micro:bit RAM and copying to ROM.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L385
    partialFlashPageAsync: function(dapwrapper, page, nextPage, i) {
        // TODO: This short-circuits UICR, do we need to update this?
        if (page.targetAddr >= 0x10000000)
            return Promise.resolve();

        let writeBl = Promise.resolve();

        // Use two slots in RAM to allow parallelisation of the following two tasks.
        // 1. DAPjs writes a page to one slot.
        // 2. flashPageBIN copies a page to flash from the other slot.
        let thisAddr = (i & 1) ? this.dataAddr : this.dataAddr + PartialFlashingUtils.pageSize;
        let nextAddr = (i & 1) ? this.dataAddr + PartialFlashingUtils.pageSize : this.dataAddr;

        // Write first page to slot in RAM.
        // All subsequent pages will have already been written to RAM.
        if (i == 0) {
            let u32data = new Uint32Array(page.data.length / 4);
            for (let j = 0; j < page.data.length; j += 4) {
                u32data[j >> 2] = PartialFlashingUtils.read32FromUInt8Array(page.data, j);
            }
            writeBl = dapwrapper.writeBlockAsync(thisAddr, u32data);
        }

        return writeBl
            .then(() => this.runFlash(page, thisAddr))
            .then(() => {
                if (!nextPage)
                    return Promise.resolve();
                // Write next page to micro:bit RAM if it exists.
                let buf = new Uint32Array(nextPage.data.buffer);
                return dapwrapper.writeBlockAsync(nextAddr, buf);
            })
            .then(() => dapwrapper.waitForHalt());
    },

    // Write pages of data to micro:bit ROM.
    partialFlashCoreAsync: async function(dapwrapper, pages, updateProgress) {
        PartialFlashingUtils.log("Partial flash");
        let startTime = new Date().getTime();
        for (let i = 0; i < pages.length; ++i) {
            updateProgress(i / pages.length);
            await this.partialFlashPageAsync(dapwrapper, pages[i], pages[i+1], i);
        }
        updateProgress(1);
    },

    // Flash the micro:bit's ROM with the provided image by only copying over the pages that differ.
    // Falls back to a full flash if partial flashing fails.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L335
    partialFlashAsync: async function(dapwrapper, flashBytes, hexBuffer, updateProgress) {
        let checksums;
        return this.getFlashChecksumsAsync(dapwrapper)
            .then(buf => {
                checksums = buf;
                // Write binary to RAM, ready for execution.
                return dapwrapper.writeBlockAsync(this.loadAddr, this.flashPageBIN);
            })
            .then(async () => {
                let aligned = PartialFlashingUtils.pageAlignBlocks(flashBytes, 0);
                const totalPages = aligned.length;
                PartialFlashingUtils.log("Total pages: " + totalPages);
                aligned = PartialFlashingUtils.onlyChanged(aligned, checksums);
                PartialFlashingUtils.log("Changed pages: " + aligned.length);

                if (aligned.length > (totalPages / 2)) {
                    try {
                        await this.fullFlashAsync(dapwrapper, hexBuffer, updateProgress);
                    } catch(err) {
                        PartialFlashingUtils.log(err);
                        PartialFlashingUtils.log("Full flash failed, attempting partial flash.");
                        await this.partialFlashCoreAsync(dapwrapper, aligned, updateProgress);
                    }
                }
                else {
                    try {
                        await this.partialFlashCoreAsync(dapwrapper, aligned, updateProgress);
                    } catch(err) {
                        PartialFlashingUtils.log(err);
                        PartialFlashingUtils.log("Partial flash failed, attempting full flash.");
                        await this.fullFlashAsync(dapwrapper, hexBuffer, updateProgress);
                    }
                }

                return Promise.resolve()
                    .then(() => dapwrapper.reset())
                    // Allow errors on resetting, user can always manually reset if necessary.
                    .catch(() => {})
                    .then(() => {
                        PartialFlashingUtils.log("Flashing Complete");
                        dapwrapper.flashing = false;
                    });
            })
    },

    // Perform full flash of micro:bit's ROM using daplink.
    fullFlashAsync: function(dapwrapper, image, updateProgress) {
        PartialFlashingUtils.log("Full flash");
        // Event to monitor flashing progress
        dapwrapper.daplink.on(DAPjs.DAPLink.EVENT_PROGRESS, (progress) => {
            updateProgress(progress, true);
        });
        return dapwrapper.transport.open()
            .then(() => dapwrapper.daplink.flash(image))
            .then(() => {
                // Send event
                document.dispatchEvent(new CustomEvent("webusb", { detail: {
                    "flash-type": "full-flash",
                    "event-type": "info",
                    "message": "full-flash-successful"
                }}));
            });
    },

    // Connect to the micro:bit using WebUSB and setup DAPWrapper.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L439
    connectDapAsync: function() {
        return Promise.resolve()
            .then(() => {
                if (window.previousDapWrapper) {
                    window.previousDapWrapper.flashing = true;
                    return Promise.resolve()
                        .then(() => new Promise(resolve => setTimeout(resolve, 1000)));
                }
                return Promise.resolve();
            })
            .then(this.dapAsync)
            .then(w => {
                window.dapwrapper = w;
                PartialFlashingUtils.log("Connection Complete");
            })
            .then(() => {
                return dapwrapper.cortexM.readMem32(PartialFlashingUtils.FICR.CODEPAGESIZE);
            })
            .then((pageSize) => {
                PartialFlashingUtils.pageSize = pageSize;

                return dapwrapper.cortexM.readMem32(PartialFlashingUtils.FICR.CODESIZE);
            })
            .then((numPages) => {
                PartialFlashingUtils.numPages = numPages;
            })
            .then(() => {
                return dapwrapper.disconnectAsync();
            });
    },

    // Flash the micro:bit's ROM with the provided image, resetting the micro:bit first.
    // Drawn from https://github.com/microsoft/pxt-microbit/blob/dec5b8ce72d5c2b4b0b20aafefce7474a6f0c7b2/editor/extension.tsx#L439
    flashAsync: async function(dapwrapper, flashBytes, hexBuffer, updateProgress) {
        try {
            let p = Promise.resolve()
                .then(() => {
                    // Reset micro:bit to ensure interface responds correctly.
                    PartialFlashingUtils.log("Begin reset");
                    return dapwrapper.reset(true)
                        .catch(e => {
                            PartialFlashingUtils.log("Retrying reset");
                            return dapwrapper.reconnectAsync(false)
                                .then(() => dapwrapper.reset(true));
                        });
                });

            let timeout = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("timeout");
                }, 1000)
            })

            // Use race to timeout the reset.
            let ret = await Promise.race([p, timeout])
            .then((result) => {
                if(result === "timeout") {
                    PartialFlashingUtils.log("Resetting micro:bit timed out");
                    PartialFlashingUtils.log("Partial flashing failed. Attempting Full Flash");
                    // Send event
                    document.dispatchEvent(new CustomEvent("webusb", { detail: {
                        "flash-type": "partial-flash",
                        "event-type": "info",
                        "message": "flash-failed" + "/" + "attempting-full-flash"
                    }}));
                    return this.fullFlashAsync(dapwrapper, hexBuffer, updateProgress);
                } else {
                    // Start flashing
                    PartialFlashingUtils.log("Begin Flashing");
                    return this.partialFlashAsync(dapwrapper, flashBytes, hexBuffer, updateProgress);
                }
            })
            .finally(() => {
                return dapwrapper.disconnectAsync();
            });
            return ret;
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
