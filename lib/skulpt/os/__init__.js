var $builtinmodule = function (name) {
	var mod = {

	};

	mod.listdir = new Sk.builtin.func(function() {
		var files = [];
		for(var key in PythonIDE.files) {
			files.push(key);
		}
		return Sk.ffi.remapToPy(files);
	});

	mod.remove = new Sk.builtin.func(function(filename) {
		if(PythonIDE.files[filename.v] === undefined) {
			throw new Sk.builtin.Exception("OS Error");
		}
		delete PythonIDE.files[filename.v];
		PythonIDE.updateFileTabs();
	});

	mod.size = new Sk.builtin.func(function() {
		if(PythonIDE.files[filename.v] === undefined) {
			throw new Sk.builtin.Exception("OS Error");
		}
		return Sk.builtin.nmber(PythonIDE.files[filename.v].length);
	});

	mod.uname = new Sk.builtin.func(function() {
		throw new Sk.builtin.Exception("Not implemented yet");
	});
	return mod;

};
