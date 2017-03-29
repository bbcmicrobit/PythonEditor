var $builtinmodule = function (name) {
	// withcode module
	
	
    var s = {
	};

	
	s.Image = new Sk.misceval.buildClass(s, function($gbl, $loc) {
		$loc.data = Sk.ffi.remapToPy([]);
		var imageData = undefined;
		var refreshTimeout = undefined;
		
		$loc.__init__ = new Sk.builtin.func(function(self, width, height) {
			// default param values
			if(width === undefined)
				width = 200;
			else
				width = Sk.ffi.remapToJs(width);
			
			if(height === undefined)
				height = 200;
			else
				height = Sk.ffi.remapToJs(height);
			
			$loc.id = "withcodeImage_" + Date.now();
			$loc.width = width;
			$loc.height = height;
			
			PythonIDE.python.outputListeners.push(function(e) {
				if(refreshTimeout) {
					clearTimeout(refreshTimeout);
					refreshTimout = undefined;
				}
				if(imageData) {
					setTimeout(function() {
						var c = document.getElementById($loc.id);
						var ctx = c.getContext("2d");
						ctx.putImageData(imageData, 0, 0);
					}, 100);
					
				}
			});
			
		});
		
		$loc.draw = new Sk.builtin.func(function(self, pyData) {
			var data = Sk.ffi.remapToJs(pyData);
			var colorModel = "B&W";
			
			var c = document.getElementById($loc.id);
			if(!c) {
				var html = '<canvas id="' + $loc.id + '" width="' + $loc.width + 'px" height="' + $loc.height + 'px" style="background-color: #FFF; border:1px solid #000000;"></canvas>';
			
				PythonIDE.python.output(html);
			}
			
			
			
			
			
			var c = document.getElementById($loc.id);
			var ctx = c.getContext("2d");

			var w = c.width;
			var h = c.height;

			if(data != undefined && data[0] != undefined && data[0][0] != undefined) {
				
				var cx = data[0].length;
				var cy = data.length;
				
				var cw = w / cx;
				var ch = h / cy;
				var x,y;
				
				// scan through for colour model
				if(data[0][0].length && data[0][0].length > 2) {
					colorModel = "RGB"
				} else {
					for(x = 0; x < w; x++) {
						if(data[0][x] > 1) {
							colorModel = "GS"
							break;
						}
					}
				}
				
				
				// fill in blocks
				for(y = 0; y < data.length; y++) {
					for(x = 0; x < data[y].length; x++) {
						switch(colorModel) {
							case 'GS':
								if(data[y][x] != undefined) {
									ctx.fillStyle="rgb(" + data[y][x] + "," + data[y][x] + "," + data[y][x] + ")";
									ctx.fillRect(x * cw, y * ch, cw, ch);
								}
							break;
							case 'B&W':
								if(data[y][x])
									ctx.fillRect(x * cw, y * ch, cw, ch);
								
								
							break;
							case 'RGB':
								if(data[y][x] && data[y][x][0] != undefined && data[y][x][1] != undefined && data[y][x][2] != undefined) {
									ctx.fillStyle="rgb(" + data[y][x][0] + "," + data[y][x][1] + "," + data[y][x][2] + ")";
									ctx.fillRect(x * cw, y * ch, cw, ch);
								}
									
							break;
						}
						
						
					}
				}
				
				// draw grid
				for(x = 0; x < cx; x++) {
					ctx.beginPath();
					ctx.moveTo(x * cw, 0);
					ctx.lineTo(x * cw, h);
					ctx.stroke();
				}
				for(y = 0; y < cy; y++) {
					ctx.beginPath();
					ctx.moveTo(0, y * ch);
					ctx.lineTo(w, y * ch);
					ctx.stroke();
				}
				imageData = ctx.getImageData(0, 0, w, h);

			}
		});
	}, 'Image', []);
		
	s.clear = new Sk.builtin.func(function() {
		PythonIDE.python.clear();
	});
	
	
	s.Visualiser = new Sk.misceval.buildClass(s, function($gbl, $loc) {
		$loc.__init__ = new Sk.builtin.func(function(self) {
			
		});
		
		$loc.map = new Sk.builtin.func(function(self, data) {
			var id = "vis_map_" + Date.now();
			var html = '<div id="' + id + '"></div>';
			PythonIDE.python.output(html);
			try {
				google.charts.load('current', { 'packages': ['map'] });
			} catch(e) {
				
			}
			data = Sk.ffi.remapToJs(data);
			google.charts.setOnLoadCallback(function() {
				var t = new google.visualization.DataTable();
				t.addColumn('string', 'Location');
				t.addColumn('string', 'Pin');
				
				
				t.addRows(data);
			  
			  var options = { showTip: true };
			  var map = new google.visualization.Map(document.getElementById(id));
			  map.draw(t, options);
			  
			});
			
		});
		
		$loc.geochart = new Sk.builtin.func(function(self, data) {
			var id = "vis_geo_" + Date.now();
			var html = '<div id="' + id + '"></div>';
			PythonIDE.python.output(html);
			try {
				google.charts.load('current', { 'packages': ['geochart'] });
			} catch(e) {
				
			}
			data = Sk.ffi.remapToJs(data);
			google.charts.setOnLoadCallback(function() {
			  var t = google.visualization.arrayToDataTable(data);
			  
			  var options = {};
			  var map = new google.visualization.GeoChart(document.getElementById(id));
			  map.draw(t, options);
			  
			});
			
		});
		
		$loc.pie = new Sk.builtin.func(function(self, data, options) {
			var id = "vis_piechart_" + Date.now();
			var html = '<div id="' + id + '"></div>';
			
			PythonIDE.python.output(html);
			try {
				google.charts.load('current', {'packages':['corechart']});
			} catch(e) {
				
			}
			google.charts.setOnLoadCallback(function() {
				if(data) {
					data = Sk.ffi.remapToJs(data);
				} else {
					data = {test:1};
				}
				if(options) {
					options = Sk.ffi.remapToJs(options);
				}
				else {
					options = {'title':'', 'width':400, 'height':300};
				}
				
				 // Create the data table.
				var t = new google.visualization.DataTable();
				t.addColumn('string', '');
				t.addColumn('number', '');
				
				var rows = [];
				for(var key in data) {
					rows.push([key, data[key]]);
				}
				t.addRows(rows);
				
				

				
				// Instantiate and draw our chart, passing in some options.
				var chart = new google.visualization.PieChart(document.getElementById(id));
				chart.draw(t, options);
			 }); 
		});
		
		
		$loc.pictogram = new Sk.builtin.func(function(self, data, titles, icons, colours, sizes) {
			
			var d = Sk.ffi.remapToJs(data);
			var t = titles?Sk.ffi.remapToJs(titles):undefined;
			var i = icons?Sk.ffi.remapToJs(icons):undefined;
			var cl = colours?Sk.ffi.remapToJs(colours):undefined;
			var sz = sizes?Sk.ffi.remapToJs(sizes):undefined;
			
			// show main title
			if(t && d && t.length > d.length)
				PythonIDE.python.output(t[t.length - 1] + "\n");
			
			for(var c = 0; c < d.length; c++) {
				var html = '';
				if(t && d && t[c])
					html += t[c] + " ";
				
				if(d && d[c]) {
					if(cl && cl[c]) {
						html += '<i style="color:' + cl[c] + '">';
					}
					if(sz && sz[c]) {
						html += '<i style="font-size:' + sz[c] + 'em;">';
					}
					for(var j = 0; j < d[c]; j++) {
						if(i && i[c]) {
							html += '<i class="fa fa-' + i[c] + '"></i>';
						} else {
							html += '#';
						}
						
					}
					if(cl && cl[c]) {
						html += '</i>';
					}
					if(sz && sz[c]) {
						html += '</i>';
					}
				}
				
				html += '\n';
				PythonIDE.python.output(html);
			}
		});
	}, 'Visualiser', []);
	
	s.Speech = new Sk.misceval.buildClass(s, function($gbl, $loc) {
		var voices = [];
		
		$loc.__init__ = new Sk.builtin.func(function(self) {
			
		});
		
		$loc.getVoices = new Sk.builtin.func(function(self) {
			return PythonIDE.runAsync(function(resolve, reject) {
				var timeoutCount = 0;
				var again = function() {
					if(timeoutCount++ > 10){
						reject("Timeout whilst waiting for voices");
					}
					voices = window.speechSynthesis.getVoices();
					if(voices.length === 0) {
						setTimeout(again, 100);
						
					} else {
						var names = [];
						for(i = 0; i < voices.length; i++){
							names.push(voices[i].name);
						}
						resolve(names);
					}
				};
				again();
				
				
			});
		});
		
		$loc.setVoice = new Sk.builtin.func(function(self, voiceName) {
			$loc.voiceName = voiceName.v;
		});
		
		$loc.setPitch = new Sk.builtin.func(function(self, pitch) {
			$loc.pitch = pitch.v;
		});
		
		$loc.setRate = new Sk.builtin.func(function(self, rate) {
			$loc.rate = rate.v;
		});
		
		$loc.listen = new Sk.builtin.func(function(self) {
			return PythonIDE.runAsync(function(resolve, reject) {
				if(!('webkitSpeechRecognition' in window)) {
					reject("This browser doesn't support speech recognition: try Safari / Chrome if possible");
				}
				var recognition = new webkitSpeechRecognition();
				recognition.continuous = true;
				recognition.interimResults = true;
				var final_transcript = '';

				recognition.onstart = function() {
					PythonIDE.python.output('<span id="speech_holder"><span id="speech_inner">listening...</span><button id="btn_speech_stop">Stop listening</button></span>');
					$('#btn_speech_stop').button().click(function() {
						recognition.stop();
					});
				};
				recognition.onresult = function(event) {
					var interim_transcript = '';
					
					for (var i = event.resultIndex; i < event.results.length; ++i) {
					  if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript;
					  } else {
						interim_transcript += event.results[i][0].transcript;
					  }
					}
					$('#speech_inner').html('<span class="speech_final">' + final_transcript + '</span><span class="speech_interim">' + interim_transcript + '</span>');
				};
				recognition.onerror = function(e) {
					reject(e.error);
				};
				recognition.onend = function() {
					$('#speech_holder').remove();
					PythonIDE.python.output('<span class="console_input">' + final_transcript + '</span>\n');
					resolve(final_transcript + '\n');
				};
				recognition.start();
			});
		});
		
		$loc.say = new Sk.builtin.func(function(self, text) {
			return PythonIDE.runAsync(function(resolve, reject) {
				/*timeout = setTimeout(function() {
					reject("Timeout whilst attempting to say " + text.v);
				}, 30000);*/
				if ('speechSynthesis' in window) {
					
					
					var msg = new SpeechSynthesisUtterance(text.v);
					msg.onend = function() {
						//clearTimeout(timeout);
						resolve();
					};
					if($loc.voiceName){
						for(i=0; i < voices.length; i++){
							if(voices[i].name == $loc.voiceName){
								msg.voice = voices[i];
								break;
							}
						}
						
						if($loc.rate) {
							msg.rate = $loc.rate;
						}
						
						if($loc.pitch) {
							msg.pitch = $loc.pitch;
						}
					}
					window.speechSynthesis.speak(msg);
						
				} else {
					//clearTimeout(timeout);
					reject("Unfortunately, the speech module isn't supported by your browser yet. Try Google Chrome if possible");
				}
				
			}); 
		});
		
		
	}, "Speech", []);
	
	return s;
	
};