var $builtinmodule = function (name) {
    var s = {
			
	};
	
	// versions same as from test platform
	s.version = new Sk.builtin.str('2.6.0');
	s.version_info = new Sk.builtin.tuple([2,6,0]);
	s.sqlite_version = Sk.builtin.str('3.6.21');
	s.sqlite_version_info = Sk.builtin.tuple([3,6,21]);
	s.PARSE_DECLTYPES = Sk.ffi.remapToPy(1);
	s.PARSE_COLNAMES = Sk.ffi.remapToPy(2);
	
	
	/// TODO:
	s.register_converter = new Sk.builtin.func(function(typename, callable) {
		throw Sk.builtin.Exception("Not implemented yet");
	});
	
	s.register_adapter = new Sk.builtin.func(function(type, callable) {
		throw Sk.builtin.Exception("Not implemented yet");
	});
	
	s.enable_callback_tracebacks = new Sk.builtin.func(function(flag) {
		throw Sk.builtin.Exception("Not implemented yet");
	});
	
	/// END TOTO
	
	
	s.complete_statement = new Sk.builtin.func(function(sql) {
		// check for semicolon at end
		if(sql.v.search(/;\s*$/) < 0)
			return false;
		
		// search for unclosed quotes
		var sQ = false;
		var dQ = false;
		var escapeNext = false;
		for(var i = 0; i < sql.v.length; i++) {
			if(escapeNext) {
				escapeNext = false;
				continue;
			}
			var c = sql.v[i];
			switch(c) {
				case '"':
					sQ = !sQ;
				break;
				case "'":
					dQ = !dQ;
				break;
				case "\\":
					escapeNext = true;
				break;
			}
			
		}
		if(sQ) // unmatched single quotes
			return false;
			
		if(dQ) // unmatched double quotes
			return false;
		return true;
	});
	
	
	
	s.Cursor = new Sk.misceval.buildClass (s, function($gbl, $loc) {
		$loc.__init__ = new Sk.builtin.func(function(self, connection) {
			self.connection = connection;
			self.results = [];
			self.currentRowID = 0;
		});
		
		$loc.__iter__ = new Sk.builtin.func(function(self) {

			var allLines = self.results;

            return Sk.builtin.makeGenerator(function () {
                if (this.$index >= this.$lines.length) {
                    return undefined;
                }
                return this.$lines[this.$index++];
            }, {
                $obj  : self,
                $index: 0,
                $lines: allLines
            });
		});
		
		$loc.close = new Sk.builtin.func(function(self){
			
		});
		
		
		
		$loc.execute = new Sk.builtin.func(function(self,sql) {
			// run select queries immediately. Queue all others for commit
			if(sql.v.toUpperCase().search(/^\s*SELECT/) == 0){
				return PythonIDE.runAsync(function(resolve, reject){
					var pCommit = new Promise(self.connection.commit);
					pCommit.then(function(){
						self.connection.db.transaction(function(tx){
							self.results = [];
							tx.executeSql(sql.v, [], function(tx, result){
								for(i = 0; i < result.rows.length; i++){
									var record = [];
									for(key in result.rows[i]){
										record.push(result.rows[i][key]);
									}
									self.results.push(Sk.ffi.remapToPy(record));
								}
								resolve(self);
							}, function(tx, error){
								reject(error);
							});
						});
					}).catch(function(e){
						reject(e);
					});
					
					
					
					
				});
			} else {
				self.connection.queue.push(sql.v);
				return self;
			}
			
			
			
			
			
		});
	}, 'Cursor', []);
	
	s.Connection = new Sk.misceval.buildClass(s, function($gbl, $loc) {
		$loc.__init__ = new Sk.builtin.func(function(self, filename) {
			
			self.filename = filename;
			self.queue = [];
			
			self.db = openDatabase(filename.v, '1.0', 'sqlite3', 1024);
			
			self.commit = function(done, fail) {
				console.log(self.queue);
				self.db.transaction(function(tx) {
					var promises = [];
					for(var i = 0; i < self.queue.length; i++) {
						var p = new Promise(function(resolve, reject){
							console.log(i, "SQL commit:", self.queue[i])
							tx.executeSql(self.queue[i], [], function(tx, results){
								//console.log(results);
								resolve();
							}, function(tx, error) {
								reject(error);
							});
							
						});
						promises.push(p);
					}
					
					// create SQL dump
					
					
					Promise.all(promises).then(function(r) {
						done();
						//console.log("init completed");
					}).catch(function(error) {
						console.log(error);
					});
				});
			};
			
			self.db.transaction(function(tx) {
				
				// delete all tables
				tx.executeSql("SELECT * FROM sqlite_master WHERE type='table'", [], function(tx, result){
					for(i = 0; i < result.rows.length; i++) {
						var tableName = result.rows[i].name;
						//console.log(result.rows[i])
						tx.executeSql("DROP TABLE IF EXISTS " + tableName,[], 
							function(tx, r){
								//console.log("Dropped table: ", tableName)
							}, function(tx, error) {
								//console.log("Couldn't drop table: ", tableName)
							});
						
					}
				});
				
				// load sql from file
				var sql;
				if(Sk.readFile && (sql = Sk.readFile(filename.v))) {
					//console.log("found:", sql);
					statements = sql.split(/;\n/);
					
					var promises = [];
					for(var i = 0; i < statements.length; i++) {
						var p = new Promise(function(resolve, reject){
							tx.executeSql(statements[i], [], function(tx, results){
								resolve();
							}, function(tx, error) {
								reject(error);
							});
							
						});
						promises.push(p);
					}
					Promise.all(promises).then(function(r) {
						self.loaded = true;
						//console.log("init completed");
					}).catch(function(error) {
						console.log(error);
					});
					
				} else {
					if(Sk.writeFile) {
						Sk.writeFile(filename.v, "");
						self.loaded = true;
					}
				}
			});
		});
		
		// default isolation level
		$loc.isolation_level = Sk.ffi.remapToPy("");
		
		// rolls back any changes since last commit
		$loc.rollback = new Sk.builtin.func(function(self) {
			self.queue = [];
		});
		
		$loc.close = new Sk.builtin.func(function(self){
			
		});
		
		$loc.cursor = new Sk.builtin.func(function(self) {
			return Sk.misceval.callsim(s.Cursor, self);
		});
		
		$loc.commit = new Sk.builtin.func(function(self) {
			return PythonIDE.runAsync(self.commit);
			
		});
	}, 'Connection', []);
	
	
	
	s.connect = new Sk.builtin.func(function(filename) {
		var connection = Sk.misceval.callsim(s.Connection, filename);
		return connection;
	});
	
	return s;
	
};
