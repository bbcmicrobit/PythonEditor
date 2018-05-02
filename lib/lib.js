// nasty hacky animated title
var t;
function animateTitle(txt, id) {
	var chars = "0123456789ABCDEF";
	var finalChars = txt.split('');

	var jq = $('#' + id);

	var letterCount = -10;
	function onAnimTimeout() {
		var randomChars = "";
		if(letterCount >=0 ) {
			randomChars = txt.substring(0, letterCount);
		}

		randomChars += '<span class="randomChars">';
		for(var i = (letterCount < 0)?0:letterCount; i < txt.length; i++) {
			var c = Math.floor(Math.random() * chars.length);
			randomChars += chars[c];
		}
		randomChars += '</span>';


		jq.html(randomChars);
		letterCount++;
		clearTimeout(t);
		if(letterCount <= txt.length) {
			t = setTimeout(onAnimTimeout, 50);
		}
	}

	t = setTimeout(onAnimTimeout, 50);

}
// Main PythonIDE object
var PythonIDE = {

	// file currently being edited
	currentFile: 'mycode.py',

	// stores each of the files in the project

	files: {'mycode.py': decodeURIComponent(window.location.search.substring(6))},

	// functions and data needed for running the python code
	python: {
		outputListeners: [],

		output: function(text, header) {
			var id = header == undefined?'consoleOut': 'headerOut';
			var c = document.getElementById(id);
			c.innerHTML += text;

			var i = 0;
			while(i < PythonIDE.python.outputListeners.length) {
				var l = PythonIDE.python.outputListeners[i];
				try {
					l(text);
					i++;
				} catch(e) {
					PythonIDE.python.outputListeners.splice(i, 1);
				}
			}
			var c = c.parentNode.parentNode;
			c.scrollTop = c.scrollHeight;

		},

		clear: function() {
			var c = document.getElementById('consoleOut');
			c.innerHTML = '';
			var c = c.parentNode.parentNode;
			c.scrollTop = c.scrollHeight;
		},

		builtinread: function(x) {
			if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
			return Sk.builtinFiles["files"][x];
		}
	},

	// convenience function that allows modules to run syncronous code asyncrounously.
	// For example time.sleep needs to pause the python program but shouldn't make the browser unresponsive
	runAsync: function(asyncFunc) {
		var p = new Promise(asyncFunc);
		var result;
		var susp = new Sk.misceval.Suspension();
		susp.resume = function() {
			return result;
		}
		susp.data = {
			type: "Sk.promise",
			promise: p.then(function(value) {
				result = value;
				return value;
			}, function(err) {
				result = "";
				PythonIDE.handleError(err);
				return new Promise(function(resolve, reject){
				});
			})
		};
		return susp;
	},

	// run the code in the editor
	// runMode can be "anim" to step through each line of python code or "normal" to run the whole code as fast as possible
	runCode: function(runMode) {
		console.log(window);
		if(PythonIDE.unhandledError)
			delete PythonIDE.unhandledError;

		if(PythonIDE.animTimeout && runMode != "anim") {
			clearTimeout(PythonIDE.animTimeout);
			delete PythonIDE.animTimeout;
			return;
		}

		if(PythonIDE.continueDebug) {
			if(runMode != "normal") {
				PythonIDE.continueDebug();
				return;
			}
		}

		if(runMode === undefined)
			runMode = "normal";

		PythonIDE.runMode = runMode;
		PythonIDE.python.outputListeners = [];

		var code = decodeURIComponent(window.location.search.substring(6));
		
		var html = '';
		html += '<div id="headerOut"></div>';
		html += '<pre id="consoleOut"><div id="watch"><h2>Variables:</h2></div></pre>';
		html += '</pre>';
		if(code.indexOf("turtle") > 0) {
			html += '<div id="canvas"></div>';
		}

		$('#output').html(html);
		$('#dlg').dialog("open");

		if(!PythonIDE.whenFinished) {
			$('#btn_hideConsole').button().click(function() {
				$('#dlg').dialog("close");
			});
		} else {
			$('#btn_hideConsole').hide();
		}

		var handlers = [];
		if(runMode != "normal") {
			handlers["Sk.debug"] = function(susp) {
				// globals
				//console.log(susp.child);
				var html = '<h2>Global variables:</h2><table><tr><th>Name</th><th>Data type</th><th>Value</th></tr>';
				PythonIDE.watchVariables.expandHandlers = [];
				for(var key in susp.child.$gbl) {
					var pyVal = susp.child.$gbl[key];
					var val = JSON.stringify(Sk.ffi.remapToJs(pyVal));

					if(val === undefined) {
						val = "";
					}

					if(val && val.length && val.length > 20) {
						var eH = {"id":PythonIDE.watchVariables.expandHandlers.length, "fullText": val, "shortText": val.substring(0,17)};

						PythonIDE.watchVariables.expandHandlers.push(eH);
						val = '<span class="debug_expand_zone" id="debug_expand_' + eH.id + '">' + val.substring(0, 17) + '<img src="media/tools.png" class="debug_expand" title="Click to see full value"></span>';
					}

					var type = pyVal.skType?pyVal.skType : pyVal.__proto__.tp$name;
					if(type == "function") {
						continue;
					}
					if(type == "str") {
						type = "string";
					}
					if(type === undefined) {
						//console.log(pyVal, val, type);
						continue;
					}
					html += '<tr><td>' + key + '</td><td>' + type + '</td><td>' + val + '</td></tr>';
				}
				html += '</table>';



				$('#watch').html(html);

				$('span.debug_expand_zone').click(function(e) {
					var id = e.currentTarget.id;
					var idNum = id.replace("debug_expand_", "");
					$('#' + id).html(PythonIDE.watchVariables.expandHandlers[idNum].fullText);
				});

				var p = new Promise(function(resolve,reject){
					PythonIDE.continueDebug = function() {
						return resolve(susp.resume());
					}

					PythonIDE.abortDebug = function() {
						delete PythonIDE.abortDebug;
						delete PythonIDE.continueDebug;
						return reject("Program aborted");
					}

				});
				return p;
			}
			setTimeout(function() {PythonIDE.runCode(runMode); }, 100);
			$('#watch').show();
		} else {

			// if code contains a while loop
			if((code.indexOf("while ") > -1) && (code.indexOf("sleep") == -1)) {
				console.log("Crash prevention mode enabled: This happens when your code includes an infinite loop without a sleep() function call. Your code will run much more slowly in this mode.");

				var startTime = new Date().getTime();
				var lineCount = 0;
				handlers["Sk.debug"] = function(susp) {
					lineCount++;
					if(new Date().getTime() - startTime > 100) {
						if(lineCount < 100) {
							return;
						}
						startTime = new Date().getTime();
						var p = new Promise(function(resolve, reject) {
							setTimeout(function() {
								lineCount = 0;
								return resolve(susp.resume());
							}, 50);

						});
						return p;
					}


				};
			}
		}

		if (code) {
			Sk.misceval.callsimAsync(handlers, function() {
				return Sk.importMainWithBody("mycode",false,code,true);
			}).then(function(module){
				if(PythonIDE.continueDebug)
					delete PythonIDE.continueDebug;
				if(PythonIDE.abortDebug)
					delete PythonIDE.abortDebug;
				$('#btn_stopRunning').removeClass('visibleButton').addClass('hiddenButton');
				if(PythonIDE.whenFinished) {
					PythonIDE.whenFinished();
				}
			}, PythonIDE.handleError);
		}
	},

	// display errors caught when the python code runs
	handleError:function (err){

		console.log(err);

		if(!PythonIDE.unhandledError && PythonIDE.continueDebug) {
			PythonIDE.unhandledError = err;
			return;
		}

		var html = '<span class="error">' + err.toString() + '</span>';
		PythonIDE.python.output(html);
	},

	// initialise the python ide
	init: function(style) {
		PythonIDE.editor = CodeMirror(document.getElementById('editor'), {
			value: PythonIDE.files['mycode.py'],
			mode: 'python',
			lineNumbers: true,
			styleActiveLine: true,
			inputStyle: "textarea"
		});

		window.onerror=function(err) {
			var msg = err.toString().replace("Uncaught ", "");
			var html = '<span class="error">' + msg + '</span>';
			PythonIDE.python.output(html);
			console.log(err);

			return true;
		}

		$('#dlg').dialog({
			autoOpen:false,
			width: window.innerWidth,
			height: window.innerHeight
		});

		// add in additional libraries.
		// not all of these are complete but they serve as an example of how you can code your own modules.
		Sk.externalLibraries = {
			// added as a farewell message to a school direct student
			schooldirect: {
				path: 'lib/skulpt/schooldirect/__init__.js'
			},

			os: {
				path: 'lib/skulpt/os/__init__.js'
			},
			speech: {
				path: 'lib/skulpt/speech/__init__.js',
				dependencies: ['lib/skulpt/speech/sam.js']
			},
			radio: {
				path: 'lib/skulpt/radio/__init__.js'
			},


			// easy data visualisation functions unique to withcode.uk
			withcode: {
				path: 'lib/skulpt/withcode/__init__.js'
			},

			// not quite complete implementation of sqlite3
			sqlite3: {
				path: 'lib/skulpt/sqlite3/__init__.js'
			},

			// microbit simulator
			microbit: {
				path: 'lib/skulpt/microbit/__init__.js'
			},

			// music module compatible with microbit music module
			music: {
				path: 'lib/skulpt/music/__init__.js'
			},

			// anyone fancy implementing this?! Imagine the possibilities!
			py3d: {
				path: 'lib/skulpt/py3d/__init__.js',
				dependencies: ['/lib/skulpt/py3d/three.js'],
			},
			RPi: {
				path: 'lib/skulpt/rpi/__init__.js'
			},
			"RPi.GPIO": {
				path: 'lib/skulpt/rpi/__init__.js'
			}
		};
	}
}