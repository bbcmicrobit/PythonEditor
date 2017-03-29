var $builtinmodule = function (name) {
	var mod = {
		data: {
			power: false
		}
	};

	radio = mod.data;

	mod.RATE_250KBIT = Sk.builtin.nmber(250);
	mod.RATE_1MBIT = Sk.builtin.nmber(1000);
	mod.RATE_2MBIT = Sk.builtin.nmber(2000);

	mod.on = new Sk.builtin.func(function() {
		mod.data.power = true;
	});

	mod.off = new Sk.builtin.func(function() {
		mod.data.power = false;
	});

	var config = function(length, queue, channel, power, address, group, data_rate) {
		if(length === undefined)
			length = Sk.builtin.nmber(32);
		if(queue === undefined)
			queue = Sk.builtin.nmber(3);
		if(channel === undefined)
			channel = Sk.builtin.nmber(7);
		if(power === undefined)
			power = Sk.builtin.nmber(0);
		if(address === undefined)
			address = Sk.builtin.str("0x75626974");
		if(group === undefined)
			group = Sk.builtin.nmber(0);
		if(data_rate === undefined)
			data_rate = Sk.builtin.nmber(mod.RATE_1MBIT);

		mod.data.length = length.v;
		mod.data.queue = queue.v;
		mod.data.channel = channel.v;
		mod.data.power = power.v;
		mod.data.address = address.v;
		mod.data.group = group.v;
		mod.data.data_rate = data_rate.v;
		mod.data.buffer = [];
		delete mod.data.fn_send;
		delete mod.data.fn_receive;
	};
	config();

	config.co_varnames = ['length', 'queue', 'channel', 'power', 'address', 'group', 'data_rate'];
	config.$defaults = [Sk.builtin.nmber(32), Sk.builtin.nmber(3), Sk.builtin.nmber(7), Sk.builtin.nmber(0), Sk.builtin.str("0x75626974"), Sk.builtin.nmber(0), Sk.builtin.nmber(mod.RATE_1MBIT)];
	config.co_numargs = 7;
	mod.config = new Sk.builtin.func(config);

	mod.reset = new Sk.builtin.func(function() {
		config();
	});

	mod.send_bytes = new Sk.builtin.func(function(message) {
		if(!mod.data.power) {
			throw new Exception("Radio is powered off");
		}
		if(mod.data.fn_send) {
			mod.data.fn_send(Sk.ffi.remapToJs(message));
		}
	});

	mod.receive_bytes = new Sk.builtin.func(function() {
		if(!mod.data.power) {
			throw new Sk.builtin.Exception("Radio is powered off");
		}
		if(mod.data.buffer.length > 0) {
			var data = mod.data.buffer[0];
			mod.data.buffer = mod.data.slice(1);
			var bytes = [];
			for(var i = 0; i < data.length; i++) {
				bytes.push(data.charCodeAt(i));
			}
			return Sk.ffi.remapToPy(bytes);
		}
		return new Sk.builtin.none();
	});

	mod.receive_bytes_into = new Sk.builtin.func(function(buffer) {
		if(!mod.data.power) {
			throw new Sk.builtin.Exception("Radio is powered off");
		}
		throw new Sk.builtin.Exception("Not implemented yet");
		return new Sk.builtin.none();
	});

	mod.send = new Sk.builtin.func(function(message) {
		if(!mod.data.power) {
			throw new Sk.builtin.Exception("Radio is powered off");
		}
		if(mod.data.fn_send) {
			mod.data.fn_send("\x00\x01\x00" + message.v);
		}
	});

	mod.receive = new Sk.builtin.func(function() {
		if(!mod.data.power) {
			throw new Sk.builtin.Exception("Radio is powered off");
		}
		if(mod.data.buffer.length > 0) {
			var data = mod.data.buffer[0];
			mod.data.buffer = mod.data.buffer.slice(1);
			return Sk.ffi.remapToPy(data.slice(3));
		}
		return new Sk.builtin.str("None");
	});



	return mod;

};
