(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.microbitFs = {}));
}(this, (function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var _library = false;

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.6.11' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var document = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document) && _isObject(document.createElement);
	var _domCreate = function (it) {
	  return is ? document.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode:  'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var _functionToString = _shared('native-function-to-string', Function.toString);

	var _redefine = createCommonjsModule(function (module) {
	var SRC = _uid('src');

	var TO_STRING = 'toString';
	var TPL = ('' + _functionToString).split(TO_STRING);

	_core.inspectSource = function (it) {
	  return _functionToString.call(it);
	};

	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if (O === _global) {
	    O[key] = val;
	  } else if (!safe) {
	    delete O[key];
	    _hide(O, key, val);
	  } else if (O[key]) {
	    O[key] = val;
	  } else {
	    _hide(O, key, val);
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString() {
	  return typeof this == 'function' && this[SRC] || _functionToString.call(this);
	});
	});

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // extend global
	    if (target) _redefine(target, key, out, type & $export.U);
	    // export
	    if (exports[key] != out) _hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	_global.core = _core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	var TYPED = _uid('typed_array');
	var VIEW = _uid('view');
	var ABV = !!(_global.ArrayBuffer && _global.DataView);
	var CONSTR = ABV;
	var i = 0;
	var l = 9;
	var Typed;

	var TypedArrayConstructors = (
	  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
	).split(',');

	while (i < l) {
	  if (Typed = _global[TypedArrayConstructors[i++]]) {
	    _hide(Typed.prototype, TYPED, true);
	    _hide(Typed.prototype, VIEW, true);
	  } else CONSTR = false;
	}

	var _typed = {
	  ABV: ABV,
	  CONSTR: CONSTR,
	  TYPED: TYPED,
	  VIEW: VIEW
	};

	var _redefineAll = function (target, src, safe) {
	  for (var key in src) _redefine(target, key, src[key], safe);
	  return target;
	};

	var _anInstance = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.1.15 ToLength

	var min = Math.min;
	var _toLength = function (it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	// https://tc39.github.io/ecma262/#sec-toindex


	var _toIndex = function (it) {
	  if (it === undefined) return 0;
	  var number = _toInteger(it);
	  var length = _toLength(number);
	  if (number !== length) throw RangeError('Wrong length!');
	  return length;
	};

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	// eslint-disable-next-line no-prototype-builtins
	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	var max = Math.max;
	var min$1 = Math.min;
	var _toAbsoluteIndex = function (index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes



	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var shared = _shared('keys');

	var _sharedKey = function (key) {
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = _toIobject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (_has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$1
	};

	// 7.1.13 ToObject(argument)

	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	var _arrayFill = function fill(value /* , start = 0, end = @length */) {
	  var O = _toObject(this);
	  var length = _toLength(O.length);
	  var aLen = arguments.length;
	  var index = _toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
	  var end = aLen > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : _toAbsoluteIndex(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	var _wks = createCommonjsModule(function (module) {
	var store = _shared('wks');

	var Symbol = _global.Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
	};

	$exports.store = store;
	});

	var def = _objectDp.f;

	var TAG = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

	var _typedBuffer = createCommonjsModule(function (module, exports) {











	var gOPN = _objectGopn.f;
	var dP = _objectDp.f;


	var ARRAY_BUFFER = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE = 'prototype';
	var WRONG_LENGTH = 'Wrong length!';
	var WRONG_INDEX = 'Wrong index!';
	var $ArrayBuffer = _global[ARRAY_BUFFER];
	var $DataView = _global[DATA_VIEW];
	var Math = _global.Math;
	var RangeError = _global.RangeError;
	// eslint-disable-next-line no-shadow-restricted-names
	var Infinity = _global.Infinity;
	var BaseBuffer = $ArrayBuffer;
	var abs = Math.abs;
	var pow = Math.pow;
	var floor = Math.floor;
	var log = Math.log;
	var LN2 = Math.LN2;
	var BUFFER = 'buffer';
	var BYTE_LENGTH = 'byteLength';
	var BYTE_OFFSET = 'byteOffset';
	var $BUFFER = _descriptors ? '_b' : BUFFER;
	var $LENGTH = _descriptors ? '_l' : BYTE_LENGTH;
	var $OFFSET = _descriptors ? '_o' : BYTE_OFFSET;

	// IEEE754 conversions based on https://github.com/feross/ieee754
	function packIEEE754(value, mLen, nBytes) {
	  var buffer = new Array(nBytes);
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
	  var i = 0;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
	  var e, m, c;
	  value = abs(value);
	  // eslint-disable-next-line no-self-compare
	  if (value != value || value === Infinity) {
	    // eslint-disable-next-line no-self-compare
	    m = value != value ? 1 : 0;
	    e = eMax;
	  } else {
	    e = floor(log(value) / LN2);
	    if (value * (c = pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }
	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * pow(2, eBias - 1) * pow(2, mLen);
	      e = 0;
	    }
	  }
	  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
	  buffer[--i] |= s * 128;
	  return buffer;
	}
	function unpackIEEE754(buffer, mLen, nBytes) {
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = eLen - 7;
	  var i = nBytes - 1;
	  var s = buffer[i--];
	  var e = s & 127;
	  var m;
	  s >>= 7;
	  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : s ? -Infinity : Infinity;
	  } else {
	    m = m + pow(2, mLen);
	    e = e - eBias;
	  } return (s ? -1 : 1) * m * pow(2, e - mLen);
	}

	function unpackI32(bytes) {
	  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
	}
	function packI8(it) {
	  return [it & 0xff];
	}
	function packI16(it) {
	  return [it & 0xff, it >> 8 & 0xff];
	}
	function packI32(it) {
	  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
	}
	function packF64(it) {
	  return packIEEE754(it, 52, 8);
	}
	function packF32(it) {
	  return packIEEE754(it, 23, 4);
	}

	function addGetter(C, key, internal) {
	  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
	}

	function get(view, bytes, index, isLittleEndian) {
	  var numIndex = +index;
	  var intIndex = _toIndex(numIndex);
	  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b;
	  var start = intIndex + view[$OFFSET];
	  var pack = store.slice(start, start + bytes);
	  return isLittleEndian ? pack : pack.reverse();
	}
	function set(view, bytes, index, conversion, value, isLittleEndian) {
	  var numIndex = +index;
	  var intIndex = _toIndex(numIndex);
	  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b;
	  var start = intIndex + view[$OFFSET];
	  var pack = conversion(+value);
	  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
	}

	if (!_typed.ABV) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    _anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
	    var byteLength = _toIndex(length);
	    this._b = _arrayFill.call(new Array(byteLength), 0);
	    this[$LENGTH] = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    _anInstance(this, $DataView, DATA_VIEW);
	    _anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = buffer[$LENGTH];
	    var offset = _toInteger(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
	    byteLength = byteLength === undefined ? bufferLength - offset : _toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
	    this[$BUFFER] = buffer;
	    this[$OFFSET] = offset;
	    this[$LENGTH] = byteLength;
	  };

	  if (_descriptors) {
	    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
	    addGetter($DataView, BUFFER, '_b');
	    addGetter($DataView, BYTE_LENGTH, '_l');
	    addGetter($DataView, BYTE_OFFSET, '_o');
	  }

	  _redefineAll($DataView[PROTOTYPE], {
	    getInt8: function getInt8(byteOffset) {
	      return get(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackI32(get(this, 4, byteOffset, arguments[1]));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packF32, value, arguments[2]);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set(this, 8, byteOffset, packF64, value, arguments[2]);
	    }
	  });
	} else {
	  if (!_fails(function () {
	    $ArrayBuffer(1);
	  }) || !_fails(function () {
	    new $ArrayBuffer(-1); // eslint-disable-line no-new
	  }) || _fails(function () {
	    new $ArrayBuffer(); // eslint-disable-line no-new
	    new $ArrayBuffer(1.5); // eslint-disable-line no-new
	    new $ArrayBuffer(NaN); // eslint-disable-line no-new
	    return $ArrayBuffer.name != ARRAY_BUFFER;
	  })) {
	    $ArrayBuffer = function ArrayBuffer(length) {
	      _anInstance(this, $ArrayBuffer);
	      return new BaseBuffer(_toIndex(length));
	    };
	    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
	    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
	      if (!((key = keys[j++]) in $ArrayBuffer)) _hide($ArrayBuffer, key, BaseBuffer[key]);
	    }
	    ArrayBufferProto.constructor = $ArrayBuffer;
	  }
	  // iOS Safari 7.x bug
	  var view = new $DataView(new $ArrayBuffer(2));
	  var $setInt8 = $DataView[PROTOTYPE].setInt8;
	  view.setInt8(0, 2147483648);
	  view.setInt8(1, 2147483649);
	  if (view.getInt8(0) || !view.getInt8(1)) _redefineAll($DataView[PROTOTYPE], {
	    setInt8: function setInt8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, true);
	}
	_setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	_setToStringTag($DataView, DATA_VIEW);
	_hide($DataView[PROTOTYPE], _typed.VIEW, true);
	exports[ARRAY_BUFFER] = $ArrayBuffer;
	exports[DATA_VIEW] = $DataView;
	});

	// getting tag from 19.1.3.6 Object.prototype.toString()

	var TAG$1 = _wks('toStringTag');
	// ES3 wrong here
	var ARG = _cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
	    // builtinTag case
	    : ARG ? _cof(O)
	    // ES3 arguments fallback
	    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var _iterators = {};

	// check on default Array iterator

	var ITERATOR = _wks('iterator');
	var ArrayProto = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)



	var _objectKeys = Object.keys || function keys(O) {
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  _anObject(O);
	  var keys = _objectKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var document$1 = _global.document;
	var _html = document$1 && document$1.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



	var IE_PROTO$1 = _sharedKey('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE$1 = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe');
	  var i = _enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


	var IE_PROTO$2 = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject(O);
	  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var ITERATOR$1 = _wks('iterator');

	var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || _iterators[_classof(it)];
	};

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg) {
	  return _cof(arg) == 'Array';
	};

	var SPECIES = _wks('species');

	var _arraySpeciesConstructor = function (original) {
	  var C;
	  if (_isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
	    if (_isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


	var _arraySpeciesCreate = function (original, length) {
	  return new (_arraySpeciesConstructor(original))(length);
	};

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex





	var _arrayMethods = function (TYPE, $create) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = $create || _arraySpeciesCreate;
	  return function ($this, callbackfn, that) {
	    var O = _toObject($this);
	    var self = _iobject(O);
	    var f = _ctx(callbackfn, that, 3);
	    var length = _toLength(self.length);
	    var index = 0;
	    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var val, res;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      val = self[index];
	      res = f(val, index, O);
	      if (TYPE) {
	        if (IS_MAP) result[index] = res;   // map
	        else if (res) switch (TYPE) {
	          case 3: return true;             // some
	          case 5: return val;              // find
	          case 6: return index;            // findIndex
	          case 2: result.push(val);        // filter
	        } else if (IS_EVERY) return false; // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)


	var SPECIES$1 = _wks('species');
	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES$1]) == undefined ? D : _aFunction(S);
	};

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto$1 = Array.prototype;
	if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});
	var _addToUnscopables = function (key) {
	  ArrayProto$1[UNSCOPABLES][key] = true;
	};

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
	};

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	var ITERATOR$2 = _wks('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  _iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR$2] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if ( typeof IteratorPrototype[ITERATOR$2] != 'function') _hide(IteratorPrototype, ITERATOR$2, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ( (BUGGY || VALUES_BUG || !proto[ITERATOR$2])) {
	    _hide(proto, ITERATOR$2, $default);
	  }
	  // Plug for library
	  _iterators[NAME] = $default;
	  _iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) _redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return _iterStep(1);
	  }
	  if (kind == 'keys') return _iterStep(0, index);
	  if (kind == 'values') return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	_iterators.Arguments = _iterators.Array;

	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	var ITERATOR$3 = _wks('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$3]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(riter, function () { throw 2; });
	} catch (e) { /* empty */ }

	var _iterDetect = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$3]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR$3] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};

	var SPECIES$2 = _wks('species');

	var _setSpecies = function (KEY) {
	  var C = _global[KEY];
	  if (_descriptors && C && !C[SPECIES$2]) _objectDp.f(C, SPECIES$2, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	var _arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = _toObject(this);
	  var len = _toLength(O.length);
	  var to = _toAbsoluteIndex(target, len);
	  var from = _toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = Math.min((end === undefined ? len : _toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};

	var f$2 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$2
	};

	var gOPD = Object.getOwnPropertyDescriptor;

	var f$3 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if (_ie8DomDefine) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$3
	};

	var _typedArray = createCommonjsModule(function (module) {
	if (_descriptors) {
	  var LIBRARY = _library;
	  var global = _global;
	  var fails = _fails;
	  var $export = _export;
	  var $typed = _typed;
	  var $buffer = _typedBuffer;
	  var ctx = _ctx;
	  var anInstance = _anInstance;
	  var propertyDesc = _propertyDesc;
	  var hide = _hide;
	  var redefineAll = _redefineAll;
	  var toInteger = _toInteger;
	  var toLength = _toLength;
	  var toIndex = _toIndex;
	  var toAbsoluteIndex = _toAbsoluteIndex;
	  var toPrimitive = _toPrimitive;
	  var has = _has;
	  var classof = _classof;
	  var isObject = _isObject;
	  var toObject = _toObject;
	  var isArrayIter = _isArrayIter;
	  var create = _objectCreate;
	  var getPrototypeOf = _objectGpo;
	  var gOPN = _objectGopn.f;
	  var getIterFn = core_getIteratorMethod;
	  var uid = _uid;
	  var wks = _wks;
	  var createArrayMethod = _arrayMethods;
	  var createArrayIncludes = _arrayIncludes;
	  var speciesConstructor = _speciesConstructor;
	  var ArrayIterators = es6_array_iterator;
	  var Iterators = _iterators;
	  var $iterDetect = _iterDetect;
	  var setSpecies = _setSpecies;
	  var arrayFill = _arrayFill;
	  var arrayCopyWithin = _arrayCopyWithin;
	  var $DP = _objectDp;
	  var $GOPD = _objectGopd;
	  var dP = $DP.f;
	  var gOPD = $GOPD.f;
	  var RangeError = global.RangeError;
	  var TypeError = global.TypeError;
	  var Uint8Array = global.Uint8Array;
	  var ARRAY_BUFFER = 'ArrayBuffer';
	  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
	  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	  var PROTOTYPE = 'prototype';
	  var ArrayProto = Array[PROTOTYPE];
	  var $ArrayBuffer = $buffer.ArrayBuffer;
	  var $DataView = $buffer.DataView;
	  var arrayForEach = createArrayMethod(0);
	  var arrayFilter = createArrayMethod(2);
	  var arraySome = createArrayMethod(3);
	  var arrayEvery = createArrayMethod(4);
	  var arrayFind = createArrayMethod(5);
	  var arrayFindIndex = createArrayMethod(6);
	  var arrayIncludes = createArrayIncludes(true);
	  var arrayIndexOf = createArrayIncludes(false);
	  var arrayValues = ArrayIterators.values;
	  var arrayKeys = ArrayIterators.keys;
	  var arrayEntries = ArrayIterators.entries;
	  var arrayLastIndexOf = ArrayProto.lastIndexOf;
	  var arrayReduce = ArrayProto.reduce;
	  var arrayReduceRight = ArrayProto.reduceRight;
	  var arrayJoin = ArrayProto.join;
	  var arraySort = ArrayProto.sort;
	  var arraySlice = ArrayProto.slice;
	  var arrayToString = ArrayProto.toString;
	  var arrayToLocaleString = ArrayProto.toLocaleString;
	  var ITERATOR = wks('iterator');
	  var TAG = wks('toStringTag');
	  var TYPED_CONSTRUCTOR = uid('typed_constructor');
	  var DEF_CONSTRUCTOR = uid('def_constructor');
	  var ALL_CONSTRUCTORS = $typed.CONSTR;
	  var TYPED_ARRAY = $typed.TYPED;
	  var VIEW = $typed.VIEW;
	  var WRONG_LENGTH = 'Wrong length!';

	  var $map = createArrayMethod(1, function (O, length) {
	    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
	  });

	  var LITTLE_ENDIAN = fails(function () {
	    // eslint-disable-next-line no-undef
	    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
	  });

	  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
	    new Uint8Array(1).set({});
	  });

	  var toOffset = function (it, BYTES) {
	    var offset = toInteger(it);
	    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
	    return offset;
	  };

	  var validate = function (it) {
	    if (isObject(it) && TYPED_ARRAY in it) return it;
	    throw TypeError(it + ' is not a typed array!');
	  };

	  var allocate = function (C, length) {
	    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
	      throw TypeError('It is not a typed array constructor!');
	    } return new C(length);
	  };

	  var speciesFromList = function (O, list) {
	    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
	  };

	  var fromList = function (C, list) {
	    var index = 0;
	    var length = list.length;
	    var result = allocate(C, length);
	    while (length > index) result[index] = list[index++];
	    return result;
	  };

	  var addGetter = function (it, key, internal) {
	    dP(it, key, { get: function () { return this._d[internal]; } });
	  };

	  var $from = function from(source /* , mapfn, thisArg */) {
	    var O = toObject(source);
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var iterFn = getIterFn(O);
	    var i, length, values, result, step, iterator;
	    if (iterFn != undefined && !isArrayIter(iterFn)) {
	      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
	        values.push(step.value);
	      } O = values;
	    }
	    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
	    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
	      result[i] = mapping ? mapfn(O[i], i) : O[i];
	    }
	    return result;
	  };

	  var $of = function of(/* ...items */) {
	    var index = 0;
	    var length = arguments.length;
	    var result = allocate(this, length);
	    while (length > index) result[index] = arguments[index++];
	    return result;
	  };

	  // iOS Safari 6.x fails here
	  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

	  var $toLocaleString = function toLocaleString() {
	    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
	  };

	  var proto = {
	    copyWithin: function copyWithin(target, start /* , end */) {
	      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    every: function every(callbackfn /* , thisArg */) {
	      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
	      return arrayFill.apply(validate(this), arguments);
	    },
	    filter: function filter(callbackfn /* , thisArg */) {
	      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
	        arguments.length > 1 ? arguments[1] : undefined));
	    },
	    find: function find(predicate /* , thisArg */) {
	      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    findIndex: function findIndex(predicate /* , thisArg */) {
	      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    forEach: function forEach(callbackfn /* , thisArg */) {
	      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    indexOf: function indexOf(searchElement /* , fromIndex */) {
	      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    includes: function includes(searchElement /* , fromIndex */) {
	      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    join: function join(separator) { // eslint-disable-line no-unused-vars
	      return arrayJoin.apply(validate(this), arguments);
	    },
	    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
	      return arrayLastIndexOf.apply(validate(this), arguments);
	    },
	    map: function map(mapfn /* , thisArg */) {
	      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
	      return arrayReduce.apply(validate(this), arguments);
	    },
	    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
	      return arrayReduceRight.apply(validate(this), arguments);
	    },
	    reverse: function reverse() {
	      var that = this;
	      var length = validate(that).length;
	      var middle = Math.floor(length / 2);
	      var index = 0;
	      var value;
	      while (index < middle) {
	        value = that[index];
	        that[index++] = that[--length];
	        that[length] = value;
	      } return that;
	    },
	    some: function some(callbackfn /* , thisArg */) {
	      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    sort: function sort(comparefn) {
	      return arraySort.call(validate(this), comparefn);
	    },
	    subarray: function subarray(begin, end) {
	      var O = validate(this);
	      var length = O.length;
	      var $begin = toAbsoluteIndex(begin, length);
	      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
	        O.buffer,
	        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
	        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
	      );
	    }
	  };

	  var $slice = function slice(start, end) {
	    return speciesFromList(this, arraySlice.call(validate(this), start, end));
	  };

	  var $set = function set(arrayLike /* , offset */) {
	    validate(this);
	    var offset = toOffset(arguments[1], 1);
	    var length = this.length;
	    var src = toObject(arrayLike);
	    var len = toLength(src.length);
	    var index = 0;
	    if (len + offset > length) throw RangeError(WRONG_LENGTH);
	    while (index < len) this[offset + index] = src[index++];
	  };

	  var $iterators = {
	    entries: function entries() {
	      return arrayEntries.call(validate(this));
	    },
	    keys: function keys() {
	      return arrayKeys.call(validate(this));
	    },
	    values: function values() {
	      return arrayValues.call(validate(this));
	    }
	  };

	  var isTAIndex = function (target, key) {
	    return isObject(target)
	      && target[TYPED_ARRAY]
	      && typeof key != 'symbol'
	      && key in target
	      && String(+key) == String(key);
	  };
	  var $getDesc = function getOwnPropertyDescriptor(target, key) {
	    return isTAIndex(target, key = toPrimitive(key, true))
	      ? propertyDesc(2, target[key])
	      : gOPD(target, key);
	  };
	  var $setDesc = function defineProperty(target, key, desc) {
	    if (isTAIndex(target, key = toPrimitive(key, true))
	      && isObject(desc)
	      && has(desc, 'value')
	      && !has(desc, 'get')
	      && !has(desc, 'set')
	      // TODO: add validation descriptor w/o calling accessors
	      && !desc.configurable
	      && (!has(desc, 'writable') || desc.writable)
	      && (!has(desc, 'enumerable') || desc.enumerable)
	    ) {
	      target[key] = desc.value;
	      return target;
	    } return dP(target, key, desc);
	  };

	  if (!ALL_CONSTRUCTORS) {
	    $GOPD.f = $getDesc;
	    $DP.f = $setDesc;
	  }

	  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
	    getOwnPropertyDescriptor: $getDesc,
	    defineProperty: $setDesc
	  });

	  if (fails(function () { arrayToString.call({}); })) {
	    arrayToString = arrayToLocaleString = function toString() {
	      return arrayJoin.call(this);
	    };
	  }

	  var $TypedArrayPrototype$ = redefineAll({}, proto);
	  redefineAll($TypedArrayPrototype$, $iterators);
	  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
	  redefineAll($TypedArrayPrototype$, {
	    slice: $slice,
	    set: $set,
	    constructor: function () { /* noop */ },
	    toString: arrayToString,
	    toLocaleString: $toLocaleString
	  });
	  addGetter($TypedArrayPrototype$, 'buffer', 'b');
	  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
	  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
	  addGetter($TypedArrayPrototype$, 'length', 'e');
	  dP($TypedArrayPrototype$, TAG, {
	    get: function () { return this[TYPED_ARRAY]; }
	  });

	  // eslint-disable-next-line max-statements
	  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
	    CLAMPED = !!CLAMPED;
	    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + KEY;
	    var SETTER = 'set' + KEY;
	    var TypedArray = global[NAME];
	    var Base = TypedArray || {};
	    var TAC = TypedArray && getPrototypeOf(TypedArray);
	    var FORCED = !TypedArray || !$typed.ABV;
	    var O = {};
	    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
	    var getter = function (that, index) {
	      var data = that._d;
	      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
	    };
	    var setter = function (that, index, value) {
	      var data = that._d;
	      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
	      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
	    };
	    var addElement = function (that, index) {
	      dP(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };
	    if (FORCED) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME, '_d');
	        var index = 0;
	        var offset = 0;
	        var buffer, byteLength, length, klass;
	        if (!isObject(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new $ArrayBuffer(byteLength);
	        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          buffer = data;
	          offset = toOffset($offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	            byteLength = $len - offset;
	            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (TYPED_ARRAY in data) {
	          return fromList(TypedArray, data);
	        } else {
	          return $from.call(TypedArray, data);
	        }
	        hide(that, '_d', {
	          b: buffer,
	          o: offset,
	          l: byteLength,
	          e: length,
	          v: new $DataView(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });
	      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
	      hide(TypedArrayPrototype, 'constructor', TypedArray);
	    } else if (!fails(function () {
	      TypedArray(1);
	    }) || !fails(function () {
	      new TypedArray(-1); // eslint-disable-line no-new
	    }) || !$iterDetect(function (iter) {
	      new TypedArray(); // eslint-disable-line no-new
	      new TypedArray(null); // eslint-disable-line no-new
	      new TypedArray(1.5); // eslint-disable-line no-new
	      new TypedArray(iter); // eslint-disable-line no-new
	    }, true)) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME);
	        var klass;
	        // `ws` module bug, temporarily remove validation length for Uint8Array
	        // https://github.com/websockets/ws/pull/645
	        if (!isObject(data)) return new Base(toIndex(data));
	        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          return $length !== undefined
	            ? new Base(data, toOffset($offset, BYTES), $length)
	            : $offset !== undefined
	              ? new Base(data, toOffset($offset, BYTES))
	              : new Base(data);
	        }
	        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
	        return $from.call(TypedArray, data);
	      });
	      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
	        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
	      });
	      TypedArray[PROTOTYPE] = TypedArrayPrototype;
	      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
	    }
	    var $nativeIterator = TypedArrayPrototype[ITERATOR];
	    var CORRECT_ITER_NAME = !!$nativeIterator
	      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
	    var $iterator = $iterators.values;
	    hide(TypedArray, TYPED_CONSTRUCTOR, true);
	    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
	    hide(TypedArrayPrototype, VIEW, true);
	    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

	    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
	      dP(TypedArrayPrototype, TAG, {
	        get: function () { return NAME; }
	      });
	    }

	    O[NAME] = TypedArray;

	    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

	    $export($export.S, NAME, {
	      BYTES_PER_ELEMENT: BYTES
	    });

	    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
	      from: $from,
	      of: $of
	    });

	    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

	    $export($export.P, NAME, proto);

	    setSpecies(NAME);

	    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

	    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

	    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

	    $export($export.P + $export.F * fails(function () {
	      new TypedArray(1).slice();
	    }), NAME, { slice: $slice });

	    $export($export.P + $export.F * (fails(function () {
	      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
	    }) || !fails(function () {
	      TypedArrayPrototype.toLocaleString.call([1, 2]);
	    })), NAME, { toLocaleString: $toLocaleString });

	    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
	    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
	  };
	} else module.exports = function () { /* empty */ };
	});

	_typedArray('Uint8', 1, function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


	_export(_export.P, 'Array', { fill: _arrayFill });

	_addToUnscopables('fill');

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(_defined(that));
	    var i = _toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var at = _stringAt(true);

	 // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var _advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? at(S, index).length : 1);
	};

	var builtinExec = RegExp.prototype.exec;

	 // `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var _regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw new TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }
	  if (_classof(R) !== 'RegExp') {
	    throw new TypeError('RegExp#exec called on incompatible receiver');
	  }
	  return builtinExec.call(R, S);
	};

	// 21.2.5.3 get RegExp.prototype.flags

	var _flags = function () {
	  var that = _anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var LAST_INDEX = 'lastIndex';

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/,
	      re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
	})();

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

	    match = nativeExec.call(re, str);

	    if (UPDATES_LAST_INDEX_WRONG && match) {
	      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      // eslint-disable-next-line no-loop-func
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var _regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: _regexpExec !== /./.exec
	}, {
	  exec: _regexpExec
	});

	var SPECIES$3 = _wks('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
	  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
	})();

	var _fixReWks = function (KEY, length, exec) {
	  var SYMBOL = _wks(KEY);

	  var DELEGATES_TO_SYMBOL = !_fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;
	    re.exec = function () { execCalled = true; return null; };
	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$3] = function () { return re; };
	    }
	    re[SYMBOL]('');
	    return !execCalled;
	  }) : undefined;

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var fns = exec(
	      _defined,
	      SYMBOL,
	      ''[KEY],
	      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
	        if (regexp.exec === _regexpExec) {
	          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	            // The native String method already delegates to @@method (this
	            // polyfilled function), leasing to infinite recursion.
	            // We avoid it by directly calling the native @@method method.
	            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	          }
	          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	        }
	        return { done: false };
	      }
	    );
	    var strfn = fns[0];
	    var rxfn = fns[1];

	    _redefine(String.prototype, KEY, strfn);
	    _hide(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return rxfn.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return rxfn.call(string, this); }
	    );
	  }
	};

	var max$1 = Math.max;
	var min$2 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	_fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = defined(this);
	      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return fn !== undefined
	        ? fn.call(searchValue, O, replaceValue)
	        : $replace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      var res = maybeCallNative($replace, regexp, this, replaceValue);
	      if (res.done) return res.value;

	      var rx = _anObject(regexp);
	      var S = String(this);
	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);
	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = _regexpExecAbstract(rx, S);
	        if (result === null) break;
	        results.push(result);
	        if (!global) break;
	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
	      }
	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];
	        var matched = String(result[0]);
	        var position = max$1(min$2(_toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	    // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = _toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return $replace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	// call something on iterator step with safe closing on error

	var _iterCall = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) _anObject(ret.call(iterator));
	    throw e;
	  }
	};

	var _forOf = createCommonjsModule(function (module) {
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
	  var f = _ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
	    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = _iterCall(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;
	});

	var _meta = createCommonjsModule(function (module) {
	var META = _uid('meta');


	var setDesc = _objectDp.f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !_fails(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!_has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!_has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};
	});
	var _meta_1 = _meta.KEY;
	var _meta_2 = _meta.NEED;
	var _meta_3 = _meta.fastKey;
	var _meta_4 = _meta.getWeak;
	var _meta_5 = _meta.onFreeze;

	var _validateCollection = function (it, TYPE) {
	  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
	  return it;
	};

	var dP$1 = _objectDp.f;









	var fastKey = _meta.fastKey;

	var SIZE = _descriptors ? '_s' : 'size';

	var getEntry = function (that, key) {
	  // fast case
	  var index = fastKey(key);
	  var entry;
	  if (index !== 'F') return that._i[index];
	  // frozen object case
	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};

	var _collectionStrong = {
	  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      _anInstance(that, C, NAME, '_i');
	      that._t = NAME;         // collection type
	      that._i = _objectCreate(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    _redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = _validateCollection(this, NAME);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.n;
	          var prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        _validateCollection(this, NAME);
	        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while (entry && entry.r) entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(_validateCollection(this, NAME), key);
	      }
	    });
	    if (_descriptors) dP$1(C.prototype, 'size', {
	      get: function () {
	        return _validateCollection(this, NAME)[SIZE];
	      }
	    });
	    return C;
	  },
	  def: function (that, key, value) {
	    var entry = getEntry(that, key);
	    var prev, index;
	    // change existing entry
	    if (entry) {
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if (!that._f) that._f = entry;
	      if (prev) prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if (index !== 'F') that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function (C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    _iterDefine(C, NAME, function (iterated, kind) {
	      this._t = _validateCollection(iterated, NAME); // target
	      this._k = kind;                     // kind
	      this._l = undefined;                // previous
	    }, function () {
	      var that = this;
	      var kind = that._k;
	      var entry = that._l;
	      // revert to the last existing entry
	      while (entry && entry.r) entry = entry.p;
	      // get next entry
	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return _iterStep(1);
	      }
	      // return step by kind
	      if (kind == 'keys') return _iterStep(0, entry.k);
	      if (kind == 'values') return _iterStep(0, entry.v);
	      return _iterStep(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    _setSpecies(NAME);
	  }
	};

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */


	var check = function (O, proto) {
	  _anObject(O);
	  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

	var setPrototypeOf = _setProto.set;
	var _inheritIfRequired = function (that, target, C) {
	  var S = target.constructor;
	  var P;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  } return that;
	};

	var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = _global[NAME];
	  var C = Base;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var proto = C && C.prototype;
	  var O = {};
	  var fixMethod = function (KEY) {
	    var fn = proto[KEY];
	    _redefine(proto, KEY,
	      KEY == 'delete' ? function (a) {
	        return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'has' ? function has(a) {
	        return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'get' ? function get(a) {
	        return IS_WEAK && !_isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
	        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
	    );
	  };
	  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    _redefineAll(C.prototype, methods);
	    _meta.NEED = true;
	  } else {
	    var instance = new C();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = _fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    var ACCEPT_ITERABLES = _iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && _fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new C();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });
	    if (!ACCEPT_ITERABLES) {
	      C = wrapper(function (target, iterable) {
	        _anInstance(target, C, NAME);
	        var that = _inheritIfRequired(new Base(), target, C);
	        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      });
	      C.prototype = proto;
	      proto.constructor = C;
	    }
	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
	    // weak collections should not contains .clear method
	    if (IS_WEAK && proto.clear) delete proto.clear;
	  }

	  _setToStringTag(C, NAME);

	  O[NAME] = C;
	  _export(_export.G + _export.W + _export.F * (C != Base), O);

	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

	var SET = 'Set';

	// 23.2 Set Objects
	var es6_set = _collection(SET, function (get) {
	  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value) {
	    return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
	  }
	}, _collectionStrong);

	// @@match logic
	_fixReWks('match', 1, function (defined, MATCH, $match, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = defined(this);
	      var fn = regexp == undefined ? undefined : regexp[MATCH];
	      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative($match, regexp, this);
	      if (res.done) return res.value;
	      var rx = _anObject(regexp);
	      var S = String(this);
	      if (!rx.global) return _regexpExecAbstract(rx, S);
	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = _regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(n);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _createForOfIteratorHelper(o) {
	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
	      var i = 0;

	      var F = function () {};

	      return {
	        s: F,
	        n: function () {
	          if (i >= o.length) return {
	            done: true
	          };
	          return {
	            done: false,
	            value: o[i++]
	          };
	        },
	        e: function (e) {
	          throw e;
	        },
	        f: F
	      };
	    }

	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  var it,
	      normalCompletion = true,
	      didErr = false,
	      err;
	  return {
	    s: function () {
	      it = o[Symbol.iterator]();
	    },
	    n: function () {
	      var step = it.next();
	      normalCompletion = step.done;
	      return step;
	    },
	    e: function (e) {
	      didErr = true;
	      err = e;
	    },
	    f: function () {
	      try {
	        if (!normalCompletion && it.return != null) it.return();
	      } finally {
	        if (didErr) throw err;
	      }
	    }
	  };
	}

	var _createProperty = function (object, index, value) {
	  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
	  else object[index] = value;
	};

	_export(_export.S + _export.F * !_iterDetect(function (iter) { Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = _toObject(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = core_getIteratorMethod(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = _toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

	var _strictMethod = function (method, arg) {
	  return !!method && _fails(function () {
	    // eslint-disable-next-line no-useless-call
	    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
	  });
	};

	var $sort = [].sort;
	var test = [1, 2, 3];

	_export(_export.P + _export.F * (_fails(function () {
	  // IE8-
	  test.sort(undefined);
	}) || !_fails(function () {
	  // V8 bug
	  test.sort(null);
	  // Old WebKit
	}) || !_strictMethod($sort)), 'Array', {
	  // 22.1.3.25 Array.prototype.sort(comparefn)
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? $sort.call(_toObject(this))
	      : $sort.call(_toObject(this), _aFunction(comparefn));
	  }
	});

	// most Object methods by ES6 should accept primitives



	var _objectSap = function (KEY, exec) {
	  var fn = (_core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
	};

	// 19.1.2.14 Object.keys(O)



	_objectSap('keys', function () {
	  return function keys(it) {
	    return _objectKeys(_toObject(it));
	  };
	});

	var f$4 = _wks;

	var _wksExt = {
		f: f$4
	};

	var defineProperty = _objectDp.f;
	var _wksDefine = function (name) {
	  var $Symbol = _core.Symbol || (_core.Symbol =  _global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
	};

	_wksDefine('asyncIterator');

	var f$5 = Object.getOwnPropertySymbols;

	var _objectGops = {
		f: f$5
	};

	// all enumerable object keys, includes symbols



	var _enumKeys = function (it) {
	  var result = _objectKeys(it);
	  var getSymbols = _objectGops.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = _objectPie.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

	var gOPN = _objectGopn.f;
	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	var f$6 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
	};

	var _objectGopnExt = {
		f: f$6
	};

	// ECMAScript 6 symbols shim





	var META = _meta.KEY;





















	var gOPD$1 = _objectGopd.f;
	var dP$2 = _objectDp.f;
	var gOPN$1 = _objectGopnExt.f;
	var $Symbol = _global.Symbol;
	var $JSON = _global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE$2 = 'prototype';
	var HIDDEN = _wks('_hidden');
	var TO_PRIMITIVE = _wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = _shared('symbol-registry');
	var AllSymbols = _shared('symbols');
	var OPSymbols = _shared('op-symbols');
	var ObjectProto$1 = Object[PROTOTYPE$2];
	var USE_NATIVE = typeof $Symbol == 'function' && !!_objectGops.f;
	var QObject = _global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = _descriptors && _fails(function () {
	  return _objectCreate(dP$2({}, 'a', {
	    get: function () { return dP$2(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD$1(ObjectProto$1, key);
	  if (protoDesc) delete ObjectProto$1[key];
	  dP$2(it, key, D);
	  if (protoDesc && it !== ObjectProto$1) dP$2(ObjectProto$1, key, protoDesc);
	} : dP$2;

	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
	  _anObject(it);
	  key = _toPrimitive(key, true);
	  _anObject(D);
	  if (_has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!_has(it, HIDDEN)) dP$2(it, HIDDEN, _propertyDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP$2(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  _anObject(it);
	  var keys = _enumKeys(P = _toIobject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = _toPrimitive(key, true));
	  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
	  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = _toIobject(it);
	  key = _toPrimitive(key, true);
	  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
	  var D = gOPD$1(it, key);
	  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN$1(_toIobject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto$1;
	  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto$1) $set.call(OPSymbols, value);
	      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, _propertyDesc(1, value));
	    };
	    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
	    return this._k;
	  });

	  _objectGopd.f = $getOwnPropertyDescriptor;
	  _objectDp.f = $defineProperty;
	  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
	  _objectPie.f = $propertyIsEnumerable;
	  _objectGops.f = $getOwnPropertySymbols;

	  if (_descriptors && !_library) {
	    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  _wksExt.f = function (name) {
	    return wrap(_wks(name));
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

	for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

	_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return _has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});

	_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FAILS_ON_PRIMITIVES = _fails(function () { _objectGops.f(1); });

	_export(_export.S + _export.F * FAILS_ON_PRIMITIVES, 'Object', {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return _objectGops.f(_toObject(it));
	  }
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!_isArray(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	_setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	_setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	_setToStringTag(_global.JSON, 'JSON', true);

	var ITERATOR$4 = _wks('iterator');
	var TO_STRING_TAG = _wks('toStringTag');
	var ArrayValues = _iterators.Array;

	var DOMIterables = {
	  CSSRuleList: true, // TODO: Not spec compliant, should be false.
	  CSSStyleDeclaration: false,
	  CSSValueList: false,
	  ClientRectList: false,
	  DOMRectList: false,
	  DOMStringList: false,
	  DOMTokenList: true,
	  DataTransferItemList: false,
	  FileList: false,
	  HTMLAllCollection: false,
	  HTMLCollection: false,
	  HTMLFormElement: false,
	  HTMLSelectElement: false,
	  MediaList: true, // TODO: Not spec compliant, should be false.
	  MimeTypeArray: false,
	  NamedNodeMap: false,
	  NodeList: true,
	  PaintRequestList: false,
	  Plugin: false,
	  PluginArray: false,
	  SVGLengthList: false,
	  SVGNumberList: false,
	  SVGPathSegList: false,
	  SVGPointList: false,
	  SVGStringList: false,
	  SVGTransformList: false,
	  SourceBufferList: false,
	  StyleSheetList: true, // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};

	for (var collections = _objectKeys(DOMIterables), i$1 = 0; i$1 < collections.length; i$1++) {
	  var NAME = collections[i$1];
	  var explicit = DOMIterables[NAME];
	  var Collection = _global[NAME];
	  var proto = Collection && Collection.prototype;
	  var key;
	  if (proto) {
	    if (!proto[ITERATOR$4]) _hide(proto, ITERATOR$4, ArrayValues);
	    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
	    _iterators[NAME] = ArrayValues;
	    if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
	  }
	}

	var $at = _stringAt(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	_iterDefine(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

	var MAP = 'Map';

	// 23.1 Map Objects
	var es6_map = _collection(MAP, function (get) {
	  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key) {
	    var entry = _collectionStrong.getEntry(_validateCollection(this, MAP), key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value) {
	    return _collectionStrong.def(_validateCollection(this, MAP), key === 0 ? 0 : key, value);
	  }
	}, _collectionStrong, true);

	var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var space = '[' + _stringWs + ']';
	var non = '\u200b\u0085';
	var ltrim = RegExp('^' + space + space + '*');
	var rtrim = RegExp(space + space + '*$');

	var exporter = function (KEY, exec, ALIAS) {
	  var exp = {};
	  var FORCE = _fails(function () {
	    return !!_stringWs[KEY]() || non[KEY]() != non;
	  });
	  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
	  if (ALIAS) exp[ALIAS] = fn;
	  _export(_export.P + _export.F * FORCE, 'String', exp);
	};

	// 1 -> String#trimLeft
	// 2 -> String#trimRight
	// 3 -> String#trim
	var trim = exporter.trim = function (string, TYPE) {
	  string = String(_defined(string));
	  if (TYPE & 1) string = string.replace(ltrim, '');
	  if (TYPE & 2) string = string.replace(rtrim, '');
	  return string;
	};

	var _stringTrim = exporter;

	var gOPN$2 = _objectGopn.f;
	var gOPD$2 = _objectGopd.f;
	var dP$3 = _objectDp.f;
	var $trim = _stringTrim.trim;
	var NUMBER = 'Number';
	var $Number = _global[NUMBER];
	var Base = $Number;
	var proto$1 = $Number.prototype;
	// Opera ~12 has broken Object#toString
	var BROKEN_COF = _cof(_objectCreate(proto$1)) == NUMBER;
	var TRIM = 'trim' in String.prototype;

	// 7.1.3 ToNumber(argument)
	var toNumber = function (argument) {
	  var it = _toPrimitive(argument, false);
	  if (typeof it == 'string' && it.length > 2) {
	    it = TRIM ? it.trim() : $trim(it, 3);
	    var first = it.charCodeAt(0);
	    var third, radix, maxCode;
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
	        default: return +it;
	      }
	      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
	        code = digits.charCodeAt(i);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
	  $Number = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var that = this;
	    return that instanceof $Number
	      // check on 1..constructor(foo) case
	      && (BROKEN_COF ? _fails(function () { proto$1.valueOf.call(that); }) : _cof(that) != NUMBER)
	        ? _inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
	  };
	  for (var keys = _descriptors ? gOPN$2(Base) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES6 (in case, if modules with ES6 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j$1 = 0, key$1; keys.length > j$1; j$1++) {
	    if (_has(Base, key$1 = keys[j$1]) && !_has($Number, key$1)) {
	      dP$3($Number, key$1, gOPD$2(Base, key$1));
	    }
	  }
	  $Number.prototype = proto$1;
	  proto$1.constructor = $Number;
	  _redefine(_global, NUMBER, $Number);
	}

	// 20.1.2.3 Number.isInteger(number)

	var floor$2 = Math.floor;
	var _isInteger = function isInteger(it) {
	  return !_isObject(it) && isFinite(it) && floor$2(it) === it;
	};

	// 20.1.2.3 Number.isInteger(number)


	_export(_export.S, 'Number', { isInteger: _isInteger });

	// 21.2.5.3 get RegExp.prototype.flags()
	if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: _flags
	});

	var TO_STRING = 'toString';
	var $toString = /./[TO_STRING];

	var define = function (fn) {
	  _redefine(RegExp.prototype, TO_STRING, fn, true);
	};

	// 21.2.5.14 RegExp.prototype.toString()
	if (_fails(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
	  define(function toString() {
	    var R = _anObject(this);
	    return '/'.concat(R.source, '/',
	      'flags' in R ? R.flags : !_descriptors && R instanceof RegExp ? _flags.call(R) : undefined);
	  });
	// FF44- RegExp#toString has a wrong name
	} else if ($toString.name != TO_STRING) {
	  define(function toString() {
	    return $toString.call(this);
	  });
	}

	// 19.1.3.6 Object.prototype.toString()

	var test$1 = {};
	test$1[_wks('toStringTag')] = 'z';
	if (test$1 + '' != '[object z]') {
	  _redefine(Object.prototype, 'toString', function toString() {
	    return '[object ' + _classof(this) + ']';
	  }, true);
	}

	var _stringRepeat = function repeat(count) {
	  var str = String(_defined(this));
	  var res = '';
	  var n = _toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
	  return res;
	};

	// https://github.com/tc39/proposal-string-pad-start-end




	var _stringPad = function (that, maxLength, fillString, left) {
	  var S = String(_defined(that));
	  var stringLength = S.length;
	  var fillStr = fillString === undefined ? ' ' : String(fillString);
	  var intMaxLength = _toLength(maxLength);
	  if (intMaxLength <= stringLength || fillStr == '') return S;
	  var fillLen = intMaxLength - stringLength;
	  var stringFiller = _stringRepeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
	  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	  return left ? stringFiller + S : S + stringFiller;
	};

	var navigator = _global.navigator;

	var _userAgent = navigator && navigator.userAgent || '';

	// https://github.com/tc39/proposal-string-pad-start-end




	// https://github.com/zloirock/core-js/issues/280
	var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(_userAgent);

	_export(_export.P + _export.F * WEBKIT_BUG, 'String', {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return _stringPad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});

	/**
	 * Parser/writer for the "Intel hex" format.
	 */

	/*
	 * A regexp that matches lines in a .hex file.
	 *
	 * One hexadecimal character is matched by "[0-9A-Fa-f]".
	 * Two hex characters are matched by "[0-9A-Fa-f]{2}"
	 * Eight or more hex characters are matched by "[0-9A-Fa-f]{8,}"
	 * A capture group of two hex characters is "([0-9A-Fa-f]{2})"
	 *
	 * Record mark         :
	 * 8 or more hex chars  ([0-9A-Fa-f]{8,})
	 * Checksum                              ([0-9A-Fa-f]{2})
	 * Optional newline                                      (?:\r\n|\r|\n|)
	 */
	var hexLineRegexp = /:([0-9A-Fa-f]{8,})([0-9A-Fa-f]{2})(?:\r\n|\r|\n|)/g; // Takes a Uint8Array as input,
	// Returns an integer in the 0-255 range.

	function checksum(bytes) {
	  return -bytes.reduce(function (sum, v) {
	    return sum + v;
	  }, 0) & 0xFF;
	} // Takes two Uint8Arrays as input,
	// Returns an integer in the 0-255 range.


	function checksumTwo(array1, array2) {
	  var partial1 = array1.reduce(function (sum, v) {
	    return sum + v;
	  }, 0);
	  var partial2 = array2.reduce(function (sum, v) {
	    return sum + v;
	  }, 0);
	  return -(partial1 + partial2) & 0xFF;
	} // Trivial utility. Converts a number to hex and pads with zeroes up to 2 characters.


	function hexpad(number) {
	  return number.toString(16).toUpperCase().padStart(2, '0');
	} // Polyfill as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger


	Number.isInteger = Number.isInteger || function (value) {
	  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
	};
	/**
	 * @class MemoryMap
	 *
	 * Represents the contents of a memory layout, with main focus into (possibly sparse) blocks of data.
	 *<br/>
	 * A {@linkcode MemoryMap} acts as a subclass of
	 * {@linkcode https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map|Map}.
	 * In every entry of it, the key is the starting address of a data block (an integer number),
	 * and the value is the <tt>Uint8Array</tt> with the data for that block.
	 *<br/>
	 * The main rationale for this is that a .hex file can contain a single block of contiguous
	 * data starting at memory address 0 (and it's the common case for simple .hex files),
	 * but complex files with several non-contiguous data blocks are also possible, thus
	 * the need for a data structure on top of the <tt>Uint8Array</tt>s.
	 *<br/>
	 * In order to parse <tt>.hex</tt> files, use the {@linkcode MemoryMap.fromHex} <em>static</em> factory
	 * method. In order to write <tt>.hex</tt> files, create a new {@linkcode MemoryMap} and call
	 * its {@linkcode MemoryMap.asHexString} method.
	 *
	 * @extends Map
	 * @example
	 * import MemoryMap from 'nrf-intel-hex';
	 *
	 * let memMap1 = new MemoryMap();
	 * let memMap2 = new MemoryMap([[0, new Uint8Array(1,2,3,4)]]);
	 * let memMap3 = new MemoryMap({0: new Uint8Array(1,2,3,4)});
	 * let memMap4 = new MemoryMap({0xCF0: new Uint8Array(1,2,3,4)});
	 */


	var MemoryMap = /*#__PURE__*/function () {
	  /**
	   * @param {Iterable} blocks The initial value for the memory blocks inside this
	   * <tt>MemoryMap</tt>. All keys must be numeric, and all values must be instances of
	   * <tt>Uint8Array</tt>. Optionally it can also be a plain <tt>Object</tt> with
	   * only numeric keys.
	   */
	  function MemoryMap(blocks) {
	    _classCallCheck(this, MemoryMap);

	    this._blocks = new Map();

	    if (blocks && typeof blocks[Symbol.iterator] === 'function') {
	      var _iterator = _createForOfIteratorHelper(blocks),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var tuple = _step.value;

	          if (!(tuple instanceof Array) || tuple.length !== 2) {
	            throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
	          }

	          this.set(tuple[0], tuple[1]);
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }
	    } else if (_typeof(blocks) === 'object') {
	      // Try iterating through the object's keys
	      var addrs = Object.keys(blocks);

	      for (var _i = 0, _addrs = addrs; _i < _addrs.length; _i++) {
	        var addr = _addrs[_i];
	        this.set(parseInt(addr), blocks[addr]);
	      }
	    } else if (blocks !== undefined && blocks !== null) {
	      throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
	    }
	  }

	  _createClass(MemoryMap, [{
	    key: "set",
	    value: function set(addr, value) {
	      if (!Number.isInteger(addr)) {
	        throw new Error('Address passed to MemoryMap is not an integer');
	      }

	      if (addr < 0) {
	        throw new Error('Address passed to MemoryMap is negative');
	      }

	      if (!(value instanceof Uint8Array)) {
	        throw new Error('Bytes passed to MemoryMap are not an Uint8Array');
	      }

	      return this._blocks.set(addr, value);
	    } // Delegate the following to the 'this._blocks' Map:

	  }, {
	    key: "get",
	    value: function get(addr) {
	      return this._blocks.get(addr);
	    }
	  }, {
	    key: "clear",
	    value: function clear() {
	      return this._blocks.clear();
	    }
	  }, {
	    key: "delete",
	    value: function _delete(addr) {
	      return this._blocks.delete(addr);
	    }
	  }, {
	    key: "entries",
	    value: function entries() {
	      return this._blocks.entries();
	    }
	  }, {
	    key: "forEach",
	    value: function forEach(callback, that) {
	      return this._blocks.forEach(callback, that);
	    }
	  }, {
	    key: "has",
	    value: function has(addr) {
	      return this._blocks.has(addr);
	    }
	  }, {
	    key: "keys",
	    value: function keys() {
	      return this._blocks.keys();
	    }
	  }, {
	    key: "values",
	    value: function values() {
	      return this._blocks.values();
	    }
	  }, {
	    key: Symbol.iterator,
	    value: function value() {
	      return this._blocks[Symbol.iterator]();
	    }
	    /**
	     * Parses a string containing data formatted in "Intel HEX" format, and
	     * returns an instance of {@linkcode MemoryMap}.
	     *<br/>
	     * The insertion order of keys in the {@linkcode MemoryMap} is guaranteed to be strictly
	     * ascending. In other words, when iterating through the {@linkcode MemoryMap}, the addresses
	     * will be ordered in ascending order.
	     *<br/>
	     * The parser has an opinionated behaviour, and will throw a descriptive error if it
	     * encounters some malformed input. Check the project's
	     * {@link https://github.com/NordicSemiconductor/nrf-intel-hex#Features|README file} for details.
	     *<br/>
	     * If <tt>maxBlockSize</tt> is given, any contiguous data block larger than that will
	     * be split in several blocks.
	     *
	     * @param {String} hexText The contents of a .hex file.
	     * @param {Number} [maxBlockSize=Infinity] Maximum size of the returned <tt>Uint8Array</tt>s.
	     *
	     * @return {MemoryMap}
	     *
	     * @example
	     * import MemoryMap from 'nrf-intel-hex';
	     *
	     * let intelHexString =
	     *     ":100000000102030405060708090A0B0C0D0E0F1068\n" +
	     *     ":00000001FF";
	     *
	     * let memMap = MemoryMap.fromHex(intelHexString);
	     *
	     * for (let [address, dataBlock] of memMap) {
	     *     console.log('Data block at ', address, ', bytes: ', dataBlock);
	     * }
	     */

	  }, {
	    key: "join",

	    /**
	     * Returns a <strong>new</strong> instance of {@linkcode MemoryMap}, containing
	     * the same data, but concatenating together those memory blocks that are adjacent.
	     *<br/>
	     * The insertion order of keys in the {@linkcode MemoryMap} is guaranteed to be strictly
	     * ascending. In other words, when iterating through the {@linkcode MemoryMap}, the addresses
	     * will be ordered in ascending order.
	     *<br/>
	     * If <tt>maxBlockSize</tt> is given, blocks will be concatenated together only
	     * until the joined block reaches this size in bytes. This means that the output
	     * {@linkcode MemoryMap} might have more entries than the input one.
	     *<br/>
	     * If there is any overlap between blocks, an error will be thrown.
	     *<br/>
	     * The returned {@linkcode MemoryMap} will use newly allocated memory.
	     *
	     * @param {Number} [maxBlockSize=Infinity] Maximum size of the <tt>Uint8Array</tt>s in the
	     * returned {@linkcode MemoryMap}.
	     *
	     * @return {MemoryMap}
	     */
	    value: function join() {
	      var maxBlockSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;
	      // First pass, create a Map of address→length of contiguous blocks
	      var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
	        return a - b;
	      });
	      var blockSizes = new Map();
	      var lastBlockAddr = -1;
	      var lastBlockEndAddr = -1;

	      for (var i = 0, l = sortedKeys.length; i < l; i++) {
	        var blockAddr = sortedKeys[i];
	        var blockLength = this.get(sortedKeys[i]).length;

	        if (lastBlockEndAddr === blockAddr && lastBlockEndAddr - lastBlockAddr < maxBlockSize) {
	          // Grow when the previous end address equals the current,
	          // and we don't go over the maximum block size.
	          blockSizes.set(lastBlockAddr, blockSizes.get(lastBlockAddr) + blockLength);
	          lastBlockEndAddr += blockLength;
	        } else if (lastBlockEndAddr <= blockAddr) {
	          // Else mark a new block.
	          blockSizes.set(blockAddr, blockLength);
	          lastBlockAddr = blockAddr;
	          lastBlockEndAddr = blockAddr + blockLength;
	        } else {
	          throw new Error('Overlapping data around address 0x' + blockAddr.toString(16));
	        }
	      } // Second pass: allocate memory for the contiguous blocks and copy data around.


	      var mergedBlocks = new MemoryMap();
	      var mergingBlock;
	      var mergingBlockAddr = -1;

	      for (var _i2 = 0, _l = sortedKeys.length; _i2 < _l; _i2++) {
	        var _blockAddr = sortedKeys[_i2];

	        if (blockSizes.has(_blockAddr)) {
	          mergingBlock = new Uint8Array(blockSizes.get(_blockAddr));
	          mergedBlocks.set(_blockAddr, mergingBlock);
	          mergingBlockAddr = _blockAddr;
	        }

	        mergingBlock.set(this.get(_blockAddr), _blockAddr - mergingBlockAddr);
	      }

	      return mergedBlocks;
	    }
	    /**
	     * Given a {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map|<tt>Map</tt>}
	     * of {@linkcode MemoryMap}s, indexed by a alphanumeric ID,
	     * returns a <tt>Map</tt> of address to tuples (<tt>Arrays</tt>s of length 2) of the form
	     * <tt>(id, Uint8Array)</tt>s.
	     *<br/>
	     * The scenario for using this is having several {@linkcode MemoryMap}s, from several calls to
	     * {@link module:nrf-intel-hex~hexToArrays|hexToArrays}, each having a different identifier.
	     * This function locates where those memory block sets overlap, and returns a <tt>Map</tt>
	     * containing addresses as keys, and arrays as values. Each array will contain 1 or more
	     * <tt>(id, Uint8Array)</tt> tuples: the identifier of the memory block set that has
	     * data in that region, and the data itself. When memory block sets overlap, there will
	     * be more than one tuple.
	     *<br/>
	     * The <tt>Uint8Array</tt>s in the output are
	     * {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray|subarrays}
	     * of the input data; new memory is <strong>not</strong> allocated for them.
	     *<br/>
	     * The insertion order of keys in the output <tt>Map</tt> is guaranteed to be strictly
	     * ascending. In other words, when iterating through the <tt>Map</tt>, the addresses
	     * will be ordered in ascending order.
	     *<br/>
	     * When two blocks overlap, the corresponding array of tuples will have the tuples ordered
	     * in the insertion order of the input <tt>Map</tt> of block sets.
	     *<br/>
	     *
	     * @param {Map.MemoryMap} memoryMaps The input memory block sets
	     *
	     * @example
	     * import MemoryMap from 'nrf-intel-hex';
	     *
	     * let memMap1 = MemoryMap.fromHex( hexdata1 );
	     * let memMap2 = MemoryMap.fromHex( hexdata2 );
	     * let memMap3 = MemoryMap.fromHex( hexdata3 );
	     *
	     * let maps = new Map([
	     *  ['file A', blocks1],
	     *  ['file B', blocks2],
	     *  ['file C', blocks3]
	     * ]);
	     *
	     * let overlappings = MemoryMap.overlapMemoryMaps(maps);
	     *
	     * for (let [address, tuples] of overlappings) {
	     *     // if 'tuples' has length > 1, there is an overlap starting at 'address'
	     *
	     *     for (let [address, tuples] of overlappings) {
	     *         let [id, bytes] = tuple;
	     *         // 'id' in this example is either 'file A', 'file B' or 'file C'
	     *     }
	     * }
	     * @return {Map.Array<mixed,Uint8Array>} The map of possibly overlapping memory blocks
	     */

	  }, {
	    key: "paginate",

	    /**
	     * Returns a new instance of {@linkcode MemoryMap}, where:
	     *
	     * <ul>
	     *  <li>Each key (the start address of each <tt>Uint8Array</tt>) is a multiple of
	     *    <tt>pageSize</tt></li>
	     *  <li>The size of each <tt>Uint8Array</tt> is exactly <tt>pageSize</tt></li>
	     *  <li>Bytes from the input map to bytes in the output</li>
	     *  <li>Bytes not in the input are replaced by a padding value</li>
	     * </ul>
	     *<br/>
	     * The scenario is wanting to prepare pages of bytes for a write operation, where the write
	     * operation affects a whole page/sector at once.
	     *<br/>
	     * The insertion order of keys in the output {@linkcode MemoryMap} is guaranteed
	     * to be strictly ascending. In other words, when iterating through the
	     * {@linkcode MemoryMap}, the addresses will be ordered in ascending order.
	     *<br/>
	     * The <tt>Uint8Array</tt>s in the output will be newly allocated.
	     *<br/>
	     *
	     * @param {Number} [pageSize=1024] The size of the output pages, in bytes
	     * @param {Number} [pad=0xFF] The byte value to use for padding
	     * @return {MemoryMap}
	     */
	    value: function paginate() {
	      var pageSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1024;
	      var pad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF;

	      if (pageSize <= 0) {
	        throw new Error('Page size must be greater than zero');
	      }

	      var outPages = new MemoryMap();
	      var page;
	      var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
	        return a - b;
	      });

	      for (var i = 0, l = sortedKeys.length; i < l; i++) {
	        var blockAddr = sortedKeys[i];
	        var block = this.get(blockAddr);
	        var blockLength = block.length;
	        var blockEnd = blockAddr + blockLength;

	        for (var pageAddr = blockAddr - blockAddr % pageSize; pageAddr < blockEnd; pageAddr += pageSize) {
	          page = outPages.get(pageAddr);

	          if (!page) {
	            page = new Uint8Array(pageSize);
	            page.fill(pad);
	            outPages.set(pageAddr, page);
	          }

	          var offset = pageAddr - blockAddr;
	          var subBlock = void 0;

	          if (offset <= 0) {
	            // First page which intersects the block
	            subBlock = block.subarray(0, Math.min(pageSize + offset, blockLength));
	            page.set(subBlock, -offset);
	          } else {
	            // Any other page which intersects the block
	            subBlock = block.subarray(offset, offset + Math.min(pageSize, blockLength - offset));
	            page.set(subBlock, 0);
	          }
	        }
	      }

	      return outPages;
	    }
	    /**
	     * Locates the <tt>Uint8Array</tt> which contains the given offset,
	     * and returns the four bytes held at that offset, as a 32-bit unsigned integer.
	     *
	     *<br/>
	     * Behaviour is similar to {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint32|DataView.prototype.getUint32},
	     * except that this operates over a {@linkcode MemoryMap} instead of
	     * over an <tt>ArrayBuffer</tt>, and that this may return <tt>undefined</tt> if
	     * the address is not <em>entirely</em> contained within one of the <tt>Uint8Array</tt>s.
	     *<br/>
	     *
	     * @param {Number} offset The memory offset to read the data
	     * @param {Boolean} [littleEndian=false] Whether to fetch the 4 bytes as a little- or big-endian integer
	     * @return {Number|undefined} An unsigned 32-bit integer number
	     */

	  }, {
	    key: "getUint32",
	    value: function getUint32(offset, littleEndian) {
	      var keys = Array.from(this.keys());

	      for (var i = 0, l = keys.length; i < l; i++) {
	        var blockAddr = keys[i];
	        var block = this.get(blockAddr);
	        var blockLength = block.length;
	        var blockEnd = blockAddr + blockLength;

	        if (blockAddr <= offset && offset + 4 <= blockEnd) {
	          return new DataView(block.buffer, offset - blockAddr, 4).getUint32(0, littleEndian);
	        }
	      }

	      return;
	    }
	    /**
	     * Returns a <tt>String</tt> of text representing a .hex file.
	     * <br/>
	     * The writer has an opinionated behaviour. Check the project's
	     * {@link https://github.com/NordicSemiconductor/nrf-intel-hex#Features|README file} for details.
	     *
	     * @param {Number} [lineSize=16] Maximum number of bytes to be encoded in each data record.
	     * Must have a value between 1 and 255, as per the specification.
	     *
	     * @return {String} String of text with the .hex representation of the input binary data
	     *
	     * @example
	     * import MemoryMap from 'nrf-intel-hex';
	     *
	     * let memMap = new MemoryMap();
	     * let bytes = new Uint8Array(....);
	     * memMap.set(0x0FF80000, bytes); // The block with 'bytes' will start at offset 0x0FF80000
	     *
	     * let string = memMap.asHexString();
	     */

	  }, {
	    key: "asHexString",
	    value: function asHexString() {
	      var lineSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
	      var lowAddress = 0; // 16 least significant bits of the current addr

	      var highAddress = -1 << 16; // 16 most significant bits of the current addr

	      var records = [];

	      if (lineSize <= 0) {
	        throw new Error('Size of record must be greater than zero');
	      } else if (lineSize > 255) {
	        throw new Error('Size of record must be less than 256');
	      } // Placeholders


	      var offsetRecord = new Uint8Array(6);
	      var recordHeader = new Uint8Array(4);
	      var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
	        return a - b;
	      });

	      for (var i = 0, l = sortedKeys.length; i < l; i++) {
	        var blockAddr = sortedKeys[i];
	        var block = this.get(blockAddr); // Sanity checks

	        if (!(block instanceof Uint8Array)) {
	          throw new Error('Block at offset ' + blockAddr + ' is not an Uint8Array');
	        }

	        if (blockAddr < 0) {
	          throw new Error('Block at offset ' + blockAddr + ' has a negative thus invalid address');
	        }

	        var blockSize = block.length;

	        if (!blockSize) {
	          continue;
	        } // Skip zero-length blocks


	        if (blockAddr > highAddress + 0xFFFF) {
	          // Insert a new 0x04 record to jump to a new 64KiB block
	          // Round up the least significant 16 bits - no bitmasks because they trigger
	          // base-2 negative numbers, whereas subtracting the modulo maintains precision
	          highAddress = blockAddr - blockAddr % 0x10000;
	          lowAddress = 0;
	          offsetRecord[0] = 2; // Length

	          offsetRecord[1] = 0; // Load offset, high byte

	          offsetRecord[2] = 0; // Load offset, low byte

	          offsetRecord[3] = 4; // Record type

	          offsetRecord[4] = highAddress >> 24; // new address offset, high byte

	          offsetRecord[5] = highAddress >> 16; // new address offset, low byte

	          records.push(':' + Array.prototype.map.call(offsetRecord, hexpad).join('') + hexpad(checksum(offsetRecord)));
	        }

	        if (blockAddr < highAddress + lowAddress) {
	          throw new Error('Block starting at 0x' + blockAddr.toString(16) + ' overlaps with a previous block.');
	        }

	        lowAddress = blockAddr % 0x10000;
	        var blockOffset = 0;
	        var blockEnd = blockAddr + blockSize;

	        if (blockEnd > 0xFFFFFFFF) {
	          throw new Error('Data cannot be over 0xFFFFFFFF');
	        } // Loop for every 64KiB memory segment that spans this block


	        while (highAddress + lowAddress < blockEnd) {
	          if (lowAddress > 0xFFFF) {
	            // Insert a new 0x04 record to jump to a new 64KiB block
	            highAddress += 1 << 16; // Increase by one

	            lowAddress = 0;
	            offsetRecord[0] = 2; // Length

	            offsetRecord[1] = 0; // Load offset, high byte

	            offsetRecord[2] = 0; // Load offset, low byte

	            offsetRecord[3] = 4; // Record type

	            offsetRecord[4] = highAddress >> 24; // new address offset, high byte

	            offsetRecord[5] = highAddress >> 16; // new address offset, low byte

	            records.push(':' + Array.prototype.map.call(offsetRecord, hexpad).join('') + hexpad(checksum(offsetRecord)));
	          }

	          var recordSize = -1; // Loop for every record for that spans the current 64KiB memory segment

	          while (lowAddress < 0x10000 && recordSize) {
	            recordSize = Math.min(lineSize, // Normal case
	            blockEnd - highAddress - lowAddress, // End of block
	            0x10000 - lowAddress // End of low addresses
	            );

	            if (recordSize) {
	              recordHeader[0] = recordSize; // Length

	              recordHeader[1] = lowAddress >> 8; // Load offset, high byte

	              recordHeader[2] = lowAddress; // Load offset, low byte

	              recordHeader[3] = 0; // Record type

	              var subBlock = block.subarray(blockOffset, blockOffset + recordSize); // Data bytes for this record

	              records.push(':' + Array.prototype.map.call(recordHeader, hexpad).join('') + Array.prototype.map.call(subBlock, hexpad).join('') + hexpad(checksumTwo(recordHeader, subBlock)));
	              blockOffset += recordSize;
	              lowAddress += recordSize;
	            }
	          }
	        }
	      }

	      records.push(':00000001FF'); // EOF record

	      return records.join('\n');
	    }
	    /**
	     * Performs a deep copy of the current {@linkcode MemoryMap}, returning a new one
	     * with exactly the same contents, but allocating new memory for each of its
	     * <tt>Uint8Array</tt>s.
	     *
	     * @return {MemoryMap}
	     */

	  }, {
	    key: "clone",
	    value: function clone() {
	      var cloned = new MemoryMap();

	      var _iterator2 = _createForOfIteratorHelper(this),
	          _step2;

	      try {
	        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var _step2$value = _slicedToArray(_step2.value, 2),
	              addr = _step2$value[0],
	              value = _step2$value[1];

	          cloned.set(addr, new Uint8Array(value));
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }

	      return cloned;
	    }
	    /**
	     * Given one <tt>Uint8Array</tt>, looks through its contents and returns a new
	     * {@linkcode MemoryMap}, stripping away those regions where there are only
	     * padding bytes.
	     * <br/>
	     * The start of the input <tt>Uint8Array</tt> is assumed to be offset zero for the output.
	     * <br/>
	     * The use case here is dumping memory from a working device and try to see the
	     * "interesting" memory regions it has. This assumes that there is a constant,
	     * predefined padding byte value being used in the "non-interesting" regions.
	     * In other words: this will work as long as the dump comes from a flash memory
	     * which has been previously erased (thus <tt>0xFF</tt>s for padding), or from a
	     * previously blanked HDD (thus <tt>0x00</tt>s for padding).
	     * <br/>
	     * This method uses <tt>subarray</tt> on the input data, and thus does not allocate memory
	     * for the <tt>Uint8Array</tt>s.
	     *
	     * @param {Uint8Array} bytes The input data
	     * @param {Number} [padByte=0xFF] The value of the byte assumed to be used as padding
	     * @param {Number} [minPadLength=64] The minimum number of consecutive pad bytes to
	     * be considered actual padding
	     *
	     * @return {MemoryMap}
	     */

	  }, {
	    key: "slice",

	    /**
	     * Returns a new instance of {@linkcode MemoryMap}, containing only data between
	     * the addresses <tt>address</tt> and <tt>address + length</tt>.
	     * Behaviour is similar to {@linkcode https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/slice|Array.prototype.slice},
	     * in that the return value is a portion of the current {@linkcode MemoryMap}.
	     *
	     * <br/>
	     * The returned {@linkcode MemoryMap} might be empty.
	     *
	     * <br/>
	     * Internally, this uses <tt>subarray</tt>, so new memory is not allocated.
	     *
	     * @param {Number} address The start address of the slice
	     * @param {Number} length The length of memory map to slice out
	     * @return {MemoryMap}
	     */
	    value: function slice(address) {
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;

	      if (length < 0) {
	        throw new Error('Length of the slice cannot be negative');
	      }

	      var sliced = new MemoryMap();

	      var _iterator3 = _createForOfIteratorHelper(this),
	          _step3;

	      try {
	        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	          var _step3$value = _slicedToArray(_step3.value, 2),
	              blockAddr = _step3$value[0],
	              block = _step3$value[1];

	          var blockLength = block.length;

	          if (blockAddr + blockLength >= address && blockAddr < address + length) {
	            var sliceStart = Math.max(address, blockAddr);
	            var sliceEnd = Math.min(address + length, blockAddr + blockLength);
	            var sliceLength = sliceEnd - sliceStart;
	            var relativeSliceStart = sliceStart - blockAddr;

	            if (sliceLength > 0) {
	              sliced.set(sliceStart, block.subarray(relativeSliceStart, relativeSliceStart + sliceLength));
	            }
	          }
	        }
	      } catch (err) {
	        _iterator3.e(err);
	      } finally {
	        _iterator3.f();
	      }

	      return sliced;
	    }
	    /**
	     * Returns a new instance of {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint32|Uint8Array}, containing only data between
	     * the addresses <tt>address</tt> and <tt>address + length</tt>. Any byte without a value
	     * in the input {@linkcode MemoryMap} will have a value of <tt>padByte</tt>.
	     *
	     * <br/>
	     * This method allocates new memory.
	     *
	     * @param {Number} address The start address of the slice
	     * @param {Number} length The length of memory map to slice out
	     * @param {Number} [padByte=0xFF] The value of the byte assumed to be used as padding
	     * @return {MemoryMap}
	     */

	  }, {
	    key: "slicePad",
	    value: function slicePad(address, length) {
	      var padByte = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xFF;

	      if (length < 0) {
	        throw new Error('Length of the slice cannot be negative');
	      }

	      var out = new Uint8Array(length).fill(padByte);

	      var _iterator4 = _createForOfIteratorHelper(this),
	          _step4;

	      try {
	        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
	          var _step4$value = _slicedToArray(_step4.value, 2),
	              blockAddr = _step4$value[0],
	              block = _step4$value[1];

	          var blockLength = block.length;

	          if (blockAddr + blockLength >= address && blockAddr < address + length) {
	            var sliceStart = Math.max(address, blockAddr);
	            var sliceEnd = Math.min(address + length, blockAddr + blockLength);
	            var sliceLength = sliceEnd - sliceStart;
	            var relativeSliceStart = sliceStart - blockAddr;

	            if (sliceLength > 0) {
	              out.set(block.subarray(relativeSliceStart, relativeSliceStart + sliceLength), sliceStart - address);
	            }
	          }
	        }
	      } catch (err) {
	        _iterator4.e(err);
	      } finally {
	        _iterator4.f();
	      }

	      return out;
	    }
	    /**
	     * Checks whether the current memory map contains the one given as a parameter.
	     *
	     * <br/>
	     * "Contains" means that all the offsets that have a byte value in the given
	     * memory map have a value in the current memory map, and that the byte values
	     * are the same.
	     *
	     * <br/>
	     * An empty memory map is always contained in any other memory map.
	     *
	     * <br/>
	     * Returns boolean <tt>true</tt> if the memory map is contained, <tt>false</tt>
	     * otherwise.
	     *
	     * @param {MemoryMap} memMap The memory map to check
	     * @return {Boolean}
	     */

	  }, {
	    key: "contains",
	    value: function contains(memMap) {
	      var _iterator5 = _createForOfIteratorHelper(memMap),
	          _step5;

	      try {
	        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
	          var _step5$value = _slicedToArray(_step5.value, 2),
	              blockAddr = _step5$value[0],
	              block = _step5$value[1];

	          var blockLength = block.length;
	          var slice = this.slice(blockAddr, blockLength).join().get(blockAddr);

	          if (!slice || slice.length !== blockLength) {
	            return false;
	          }

	          for (var i in block) {
	            if (block[i] !== slice[i]) {
	              return false;
	            }
	          }
	        }
	      } catch (err) {
	        _iterator5.e(err);
	      } finally {
	        _iterator5.f();
	      }

	      return true;
	    }
	  }, {
	    key: "size",
	    get: function get() {
	      return this._blocks.size;
	    }
	  }], [{
	    key: "fromHex",
	    value: function fromHex(hexText) {
	      var maxBlockSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
	      var blocks = new MemoryMap();
	      var lastCharacterParsed = 0;
	      var matchResult;
	      var recordCount = 0; // Upper Linear Base Address, the 16 most significant bits (2 bytes) of
	      // the current 32-bit (4-byte) address
	      // In practice this is a offset that is summed to the "load offset" of the
	      // data records

	      var ulba = 0;
	      hexLineRegexp.lastIndex = 0; // Reset the regexp, if not it would skip content when called twice

	      while ((matchResult = hexLineRegexp.exec(hexText)) !== null) {
	        recordCount++; // By default, a regexp loop ignores gaps between matches, but
	        // we want to be aware of them.

	        if (lastCharacterParsed !== matchResult.index) {
	          throw new Error('Malformed hex file: Could not parse between characters ' + lastCharacterParsed + ' and ' + matchResult.index + ' ("' + hexText.substring(lastCharacterParsed, Math.min(matchResult.index, lastCharacterParsed + 16)).trim() + '")');
	        }

	        lastCharacterParsed = hexLineRegexp.lastIndex; // Give pretty names to the match's capture groups

	        var _matchResult = matchResult,
	            _matchResult2 = _slicedToArray(_matchResult, 3),
	            recordStr = _matchResult2[1],
	            recordChecksum = _matchResult2[2]; // String to Uint8Array - https://stackoverflow.com/questions/43131242/how-to-convert-a-hexademical-string-of-data-to-an-arraybuffer-in-javascript


	        var recordBytes = new Uint8Array(recordStr.match(/[\da-f]{2}/gi).map(function (h) {
	          return parseInt(h, 16);
	        }));
	        var recordLength = recordBytes[0];

	        if (recordLength + 4 !== recordBytes.length) {
	          throw new Error('Mismatched record length at record ' + recordCount + ' (' + matchResult[0].trim() + '), expected ' + recordLength + ' data bytes but actual length is ' + (recordBytes.length - 4));
	        }

	        var cs = checksum(recordBytes);

	        if (parseInt(recordChecksum, 16) !== cs) {
	          throw new Error('Checksum failed at record ' + recordCount + ' (' + matchResult[0].trim() + '), should be ' + cs.toString(16));
	        }

	        var offset = (recordBytes[1] << 8) + recordBytes[2];
	        var recordType = recordBytes[3];
	        var data = recordBytes.subarray(4);

	        if (recordType === 0) {
	          // Data record, contains data
	          // Create a new block, at (upper linear base address + offset)
	          if (blocks.has(ulba + offset)) {
	            throw new Error('Duplicated data at record ' + recordCount + ' (' + matchResult[0].trim() + ')');
	          }

	          if (offset + data.length > 0x10000) {
	            throw new Error('Data at record ' + recordCount + ' (' + matchResult[0].trim() + ') wraps over 0xFFFF. This would trigger ambiguous behaviour. Please restructure your data so that for every record the data offset plus the data length do not exceed 0xFFFF.');
	          }

	          blocks.set(ulba + offset, data);
	        } else {
	          // All non-data records must have a data offset of zero
	          if (offset !== 0) {
	            throw new Error('Record ' + recordCount + ' (' + matchResult[0].trim() + ') must have 0000 as data offset.');
	          }

	          switch (recordType) {
	            case 1:
	              // EOF
	              if (lastCharacterParsed !== hexText.length) {
	                // This record should be at the very end of the string
	                throw new Error('There is data after an EOF record at record ' + recordCount);
	              }

	              return blocks.join(maxBlockSize);

	            case 2:
	              // Extended Segment Address Record
	              // Sets the 16 most significant bits of the 20-bit Segment Base
	              // Address for the subsequent data.
	              ulba = (data[0] << 8) + data[1] << 4;
	              break;

	            case 3:
	              // Start Segment Address Record
	              // Do nothing. Record type 3 only applies to 16-bit Intel CPUs,
	              // where it should reset the program counter (CS+IP CPU registers)
	              break;

	            case 4:
	              // Extended Linear Address Record
	              // Sets the 16 most significant (upper) bits of the 32-bit Linear Address
	              // for the subsequent data
	              ulba = (data[0] << 8) + data[1] << 16;
	              break;

	            case 5:
	              // Start Linear Address Record
	              // Do nothing. Record type 5 only applies to 32-bit Intel CPUs,
	              // where it should reset the program counter (EIP CPU register)
	              // It might have meaning for other CPU architectures
	              // (see http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.faqs/ka9903.html )
	              // but will be ignored nonetheless.
	              break;

	            default:
	              throw new Error('Invalid record type 0x' + hexpad(recordType) + ' at record ' + recordCount + ' (should be between 0x00 and 0x05)');
	          }
	        }
	      }

	      if (recordCount) {
	        throw new Error('No EOF record at end of file');
	      } else {
	        throw new Error('Malformed .hex file, could not parse any registers');
	      }
	    }
	  }, {
	    key: "overlapMemoryMaps",
	    value: function overlapMemoryMaps(memoryMaps) {
	      // First pass: create a list of addresses where any block starts or ends.
	      var cuts = new Set();

	      var _iterator6 = _createForOfIteratorHelper(memoryMaps),
	          _step6;

	      try {
	        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
	          var _step6$value = _slicedToArray(_step6.value, 2),
	              blocks = _step6$value[1];

	          var _iterator7 = _createForOfIteratorHelper(blocks),
	              _step7;

	          try {
	            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
	              var _step7$value = _slicedToArray(_step7.value, 2),
	                  address = _step7$value[0],
	                  block = _step7$value[1];

	              cuts.add(address);
	              cuts.add(address + block.length);
	            }
	          } catch (err) {
	            _iterator7.e(err);
	          } finally {
	            _iterator7.f();
	          }
	        }
	      } catch (err) {
	        _iterator6.e(err);
	      } finally {
	        _iterator6.f();
	      }

	      var orderedCuts = Array.from(cuts.values()).sort(function (a, b) {
	        return a - b;
	      });
	      var overlaps = new Map(); // Second pass: iterate through the cuts, get slices of every intersecting blockset

	      var _loop = function _loop(i, l) {
	        var cut = orderedCuts[i];
	        var nextCut = orderedCuts[i + 1];
	        var tuples = [];

	        var _iterator8 = _createForOfIteratorHelper(memoryMaps),
	            _step8;

	        try {
	          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
	            var _step8$value = _slicedToArray(_step8.value, 2),
	                setId = _step8$value[0],
	                _blocks = _step8$value[1];

	            // Find the block with the highest address that is equal or lower to
	            // the current cut (if any)
	            var blockAddr = Array.from(_blocks.keys()).reduce(function (acc, val) {
	              if (val > cut) {
	                return acc;
	              }

	              return Math.max(acc, val);
	            }, -1);

	            if (blockAddr !== -1) {
	              var _block = _blocks.get(blockAddr);

	              var subBlockStart = cut - blockAddr;
	              var subBlockEnd = nextCut - blockAddr;

	              if (subBlockStart < _block.length) {
	                tuples.push([setId, _block.subarray(subBlockStart, subBlockEnd)]);
	              }
	            }
	          }
	        } catch (err) {
	          _iterator8.e(err);
	        } finally {
	          _iterator8.f();
	        }

	        if (tuples.length) {
	          overlaps.set(cut, tuples);
	        }
	      };

	      for (var i = 0, l = orderedCuts.length - 1; i < l; i++) {
	        _loop(i);
	      }

	      return overlaps;
	    }
	    /**
	     * Given the output of the {@linkcode MemoryMap.overlapMemoryMaps|overlapMemoryMaps}
	     * (a <tt>Map</tt> of address to an <tt>Array</tt> of <tt>(id, Uint8Array)</tt> tuples),
	     * returns a {@linkcode MemoryMap}. This discards the IDs in the process.
	     *<br/>
	     * The output <tt>Map</tt> contains as many entries as the input one (using the same addresses
	     * as keys), but the value for each entry will be the <tt>Uint8Array</tt> of the <b>last</b>
	     * tuple for each address in the input data.
	     *<br/>
	     * The scenario is wanting to join together several parsed .hex files, not worrying about
	     * their overlaps.
	     *<br/>
	     *
	     * @param {Map.Array<mixed,Uint8Array>} overlaps The (possibly overlapping) input memory blocks
	     * @return {MemoryMap} The flattened memory blocks
	     */

	  }, {
	    key: "flattenOverlaps",
	    value: function flattenOverlaps(overlaps) {
	      return new MemoryMap(Array.from(overlaps.entries()).map(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2),
	            address = _ref2[0],
	            tuples = _ref2[1];

	        return [address, tuples[tuples.length - 1][1]];
	      }));
	    }
	  }, {
	    key: "fromPaddedUint8Array",
	    value: function fromPaddedUint8Array(bytes) {
	      var padByte = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF;
	      var minPadLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 64;

	      if (!(bytes instanceof Uint8Array)) {
	        throw new Error('Bytes passed to fromPaddedUint8Array are not an Uint8Array');
	      } // The algorithm used is naïve and checks every byte.
	      // An obvious optimization would be to implement Boyer-Moore
	      // (see https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string_search_algorithm )
	      // or otherwise start skipping up to minPadLength bytes when going through a non-pad
	      // byte.
	      // Anyway, we could expect a lot of cases where there is a majority of pad bytes,
	      // and the algorithm should check most of them anyway, so the perf gain is questionable.


	      var memMap = new MemoryMap();
	      var consecutivePads = 0;
	      var lastNonPad = -1;
	      var firstNonPad = 0;
	      var skippingBytes = false;
	      var l = bytes.length;

	      for (var addr = 0; addr < l; addr++) {
	        var byte = bytes[addr];

	        if (byte === padByte) {
	          consecutivePads++;

	          if (consecutivePads >= minPadLength) {
	            // Edge case: ignore writing a zero-length block when skipping
	            // bytes at the beginning of the input
	            if (lastNonPad !== -1) {
	              /// Add the previous block to the result memMap
	              memMap.set(firstNonPad, bytes.subarray(firstNonPad, lastNonPad + 1));
	            }

	            skippingBytes = true;
	          }
	        } else {
	          if (skippingBytes) {
	            skippingBytes = false;
	            firstNonPad = addr;
	          }

	          lastNonPad = addr;
	          consecutivePads = 0;
	        }
	      } // At EOF, add the last block if not skipping bytes already (and input not empty)


	      if (!skippingBytes && lastNonPad !== -1) {
	        memMap.set(firstNonPad, bytes.subarray(firstNonPad, l));
	      }

	      return memMap;
	    }
	  }]);

	  return MemoryMap;
	}();

	var textEncoderLite = createCommonjsModule(function (module) {
	  function TextEncoderLite() {}

	  function TextDecoderLite() {}

	  (function () {
	    // Thanks Feross et al! :-)

	    function utf8ToBytes(string, units) {
	      units = units || Infinity;
	      var codePoint;
	      var length = string.length;
	      var leadSurrogate = null;
	      var bytes = [];
	      var i = 0;

	      for (; i < length; i++) {
	        codePoint = string.charCodeAt(i); // is surrogate component

	        if (codePoint > 0xD7FF && codePoint < 0xE000) {
	          // last char was a lead
	          if (leadSurrogate) {
	            // 2 leads in a row
	            if (codePoint < 0xDC00) {
	              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	              leadSurrogate = codePoint;
	              continue;
	            } else {
	              // valid surrogate pair
	              codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000;
	              leadSurrogate = null;
	            }
	          } else {
	            // no lead yet
	            if (codePoint > 0xDBFF) {
	              // unexpected trail
	              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	              continue;
	            } else if (i + 1 === length) {
	              // unpaired lead
	              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	              continue;
	            } else {
	              // valid lead
	              leadSurrogate = codePoint;
	              continue;
	            }
	          }
	        } else if (leadSurrogate) {
	          // valid bmp char, but last char was a lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          leadSurrogate = null;
	        } // encode utf8


	        if (codePoint < 0x80) {
	          if ((units -= 1) < 0) break;
	          bytes.push(codePoint);
	        } else if (codePoint < 0x800) {
	          if ((units -= 2) < 0) break;
	          bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	        } else if (codePoint < 0x10000) {
	          if ((units -= 3) < 0) break;
	          bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	        } else if (codePoint < 0x200000) {
	          if ((units -= 4) < 0) break;
	          bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	        } else {
	          throw new Error('Invalid code point');
	        }
	      }

	      return bytes;
	    }

	    function utf8Slice(buf, start, end) {
	      var res = '';
	      var tmp = '';
	      end = Math.min(buf.length, end || Infinity);
	      start = start || 0;

	      for (var i = start; i < end; i++) {
	        if (buf[i] <= 0x7F) {
	          res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
	          tmp = '';
	        } else {
	          tmp += '%' + buf[i].toString(16);
	        }
	      }

	      return res + decodeUtf8Char(tmp);
	    }

	    function decodeUtf8Char(str) {
	      try {
	        return decodeURIComponent(str);
	      } catch (err) {
	        return String.fromCharCode(0xFFFD); // UTF 8 invalid char
	      }
	    }

	    TextEncoderLite.prototype.encode = function (str) {
	      var result;

	      if ('undefined' === typeof Uint8Array) {
	        result = utf8ToBytes(str);
	      } else {
	        result = new Uint8Array(utf8ToBytes(str));
	      }

	      return result;
	    };

	    TextDecoderLite.prototype.decode = function (bytes) {
	      return utf8Slice(bytes, 0, bytes.length);
	    };
	  })();

	  if ( module) {
	    module.exports.TextDecoderLite = TextDecoderLite;
	    module.exports.TextEncoderLite = TextEncoderLite;
	  }
	});
	var textEncoderLite_1 = textEncoderLite.TextDecoderLite;
	var textEncoderLite_2 = textEncoderLite.TextEncoderLite;

	/**
	 * Converts a string into a byte array of characters.
	 * @param str - String to convert to bytes.
	 * @returns A byte array with the encoded data.
	 */

	function strToBytes(str) {
	  var encoder = new textEncoderLite_2();
	  return encoder.encode(str);
	}
	/**
	 * Converts a byte array into a string of characters.
	 * @param byteArray - Array of bytes to convert.
	 * @returns String output from the conversion.
	 */

	function bytesToStr(byteArray) {
	  var decoder = new textEncoderLite_1();
	  return decoder.decode(byteArray);
	}
	/**
	 * Concatenates two Uint8Arrays.
	 *
	 * @param first - The first array to concatenate.
	 * @param second - The second array to concatenate.
	 * @returns New array with both inputs concatenated.
	 */

	var concatUint8Array = function concatUint8Array(first, second) {
	  var combined = new Uint8Array(first.length + second.length);
	  combined.set(first);
	  combined.set(second, first.length);
	  return combined;
	};

	/** User script located at specific flash address. */



	(function (AppendedBlock) {
	  AppendedBlock[AppendedBlock["StartAdd"] = 253952] = "StartAdd";
	  AppendedBlock[AppendedBlock["Length"] = 8192] = "Length";
	  AppendedBlock[AppendedBlock["EndAdd"] = 262144] = "EndAdd";
	})(exports.AppendedBlock || (exports.AppendedBlock = {}));
	/** Start of user script marked by "MP" + 2 bytes for the script length. */


	var HEADER_START_BYTE_0 = 77; // 'M'

	var HEADER_START_BYTE_1 = 80; // 'P'

	/** How many bytes per Intel Hex record line. */

	var HEX_RECORD_DATA_LEN = 16;
	/**
	 * Marker placed inside the MicroPython hex string to indicate where to
	 * inject the user Python Code.
	 */

	var HEX_INSERTION_POINT = ':::::::::::::::::::::::::::::::::::::::::::\n';
	/**
	 * Removes the old insertion line the input Intel Hex string contains it.
	 *
	 * @param intelHex - String with the intel hex lines.
	 * @returns The Intel Hex string without insertion line.
	 */

	function cleanseOldHexFormat(intelHex) {
	  return intelHex.replace(HEX_INSERTION_POINT, '');
	}
	/**
	 * Parses through an Intel Hex string to find the Python code at the
	 * allocated address and extracts it.
	 *
	 * @param intelHex - Intel Hex block to scan for the code.
	 * @return Python code.
	 */

	function getIntelHexAppendedScript(intelHex) {
	  var pyCode = '';
	  var hexFileMemMap = MemoryMap.fromHex(intelHex); // Check that the known flash location has user code

	  if (hexFileMemMap.has(exports.AppendedBlock.StartAdd)) {
	    var pyCodeMemMap = hexFileMemMap.slice(exports.AppendedBlock.StartAdd, exports.AppendedBlock.Length);
	    var codeBytes = pyCodeMemMap.get(exports.AppendedBlock.StartAdd);

	    if (codeBytes[0
	    /* Byte0 */
	    ] === HEADER_START_BYTE_0 && codeBytes[1
	    /* Byte1 */
	    ] === HEADER_START_BYTE_1) {
	      pyCode = bytesToStr(codeBytes.slice(4
	      /* Length */
	      )); // Clean null terminators at the end

	      pyCode = pyCode.replace(/\0/g, '');
	    }
	  }

	  return pyCode;
	}
	/**
	 * When the user code is inserted into the flash known location it needs to be
	 * packed with a header. This function outputs a byte array with a fully formed
	 * User Code Block.
	 *
	 * @param dataBytes - Array of bytes to include in the User Code block.
	 * @returns Byte array with the full User Code Block.
	 */


	function createAppendedBlock(dataBytes) {
	  var blockLength = dataBytes.length + 4
	  /* Length */
	  ; // Old DAPLink versions need padding on the last record to fill the line

	  if (blockLength % HEX_RECORD_DATA_LEN) {
	    blockLength += HEX_RECORD_DATA_LEN - blockLength % HEX_RECORD_DATA_LEN;
	  }

	  var blockBytes = new Uint8Array(blockLength).fill(0x00); // The user script block has to start with "MP" marker + script length

	  blockBytes[0] = HEADER_START_BYTE_0;
	  blockBytes[1] = HEADER_START_BYTE_1;
	  blockBytes[2] = dataBytes.length & 0xff;
	  blockBytes[3] = dataBytes.length >> 8 & 0xff;
	  blockBytes.set(dataBytes, 4
	  /* Length */
	  );
	  return blockBytes;
	}
	/**
	 * Converts the Python code into the Intel Hex format expected by
	 * MicroPython and injects it into a Intel Hex string containing a marker.
	 *
	 * TODO: Throw error if filesystem is using the penultimate page already.
	 *
	 * @param intelHex - Single string of Intel Hex records to inject the code.
	 * @param pyStr - Python code string.
	 * @returns Intel Hex string with the Python code injected.
	 */


	function addIntelHexAppendedScript(intelHex, pyCode) {
	  var codeBytes = strToBytes(pyCode);
	  var blockBytes = createAppendedBlock(codeBytes);

	  if (blockBytes.length > exports.AppendedBlock.Length) {
	    throw new RangeError('Too long');
	  } // Convert to Intel Hex format


	  var intelHexClean = cleanseOldHexFormat(intelHex);
	  var intelHexMap = MemoryMap.fromHex(intelHexClean);
	  intelHexMap.set(exports.AppendedBlock.StartAdd, blockBytes); // Older versions of DAPLink need the file to end in a new line

	  return intelHexMap.asHexString() + '\n';
	}
	/**
	 * Checks the Intel Hex memory map to see if there is an appended script.
	 *
	 * @param intelHexMap - Memory map for the MicroPython Intel Hex.
	 * @returns True if appended script is present, false otherwise.
	 */


	function isAppendedScriptPresent(intelHex) {
	  var intelHexMap;

	  if (typeof intelHex === 'string') {
	    var intelHexClean = cleanseOldHexFormat(intelHex);
	    intelHexMap = MemoryMap.fromHex(intelHexClean);
	  } else {
	    intelHexMap = intelHex;
	  }

	  var headerMagic = intelHexMap.slicePad(exports.AppendedBlock.StartAdd, 2, 0xff);
	  return headerMagic[0] === HEADER_START_BYTE_0 && headerMagic[1] === HEADER_START_BYTE_1;
	}

	var isEnum$1 = _objectPie.f;
	var _objectToArray = function (isEntries) {
	  return function (it) {
	    var O = _toIobject(it);
	    var keys = _objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!_descriptors || isEnum$1.call(O, key)) {
	        result.push(isEntries ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	// https://github.com/tc39/proposal-object-values-entries

	var $values = _objectToArray(false);

	_export(_export.S, 'Object', {
	  values: function values(it) {
	    return $values(it);
	  }
	});

	/**
	 * Interprets the data stored in the UICR memory space.
	 *
	 * For more info:
	 * https://microbit-micropython.readthedocs.io/en/latest/devguide/hexformat.html
	 *
	 * (c) 2019 Micro:bit Educational Foundation and the microbit-fs contributors.
	 * SPDX-License-Identifier: MIT
	 */
	var DEVICE_INFO = [{
	  deviceVersion: 1,
	  magicHeader: 0x17eeb07c,
	  flashSize: 0x40000
	}, {
	  deviceVersion: 2,
	  magicHeader: 0x47eeb07c,
	  flashSize: 0x80000
	}];
	var UICR_START = 0x10001000;
	var UICR_CUSTOMER_OFFSET = 0x80;
	var UICR_CUSTOMER_UPY_OFFSET = 0x40;
	var UICR_UPY_START = UICR_START + UICR_CUSTOMER_OFFSET + UICR_CUSTOMER_UPY_OFFSET;
	var UPY_MAGIC_LEN = 4;
	var UPY_END_MARKER_LEN = 4;
	var UPY_PAGE_SIZE_LEN = 4;
	var UPY_START_PAGE_LEN = 2;
	var UPY_PAGES_USED_LEN = 2;
	var UPY_DELIMITER_LEN = 4;
	var UPY_VERSION_LEN = 4;
	var UPY_REGIONS_TERMINATOR_LEN = 4;
	/** UICR Customer area addresses for MicroPython specific data. */

	var MicropythonUicrAddress;

	(function (MicropythonUicrAddress) {
	  MicropythonUicrAddress[MicropythonUicrAddress["MagicValue"] = UICR_UPY_START] = "MagicValue";
	  MicropythonUicrAddress[MicropythonUicrAddress["EndMarker"] = MicropythonUicrAddress.MagicValue + UPY_MAGIC_LEN] = "EndMarker";
	  MicropythonUicrAddress[MicropythonUicrAddress["PageSize"] = MicropythonUicrAddress.EndMarker + UPY_END_MARKER_LEN] = "PageSize";
	  MicropythonUicrAddress[MicropythonUicrAddress["StartPage"] = MicropythonUicrAddress.PageSize + UPY_PAGE_SIZE_LEN] = "StartPage";
	  MicropythonUicrAddress[MicropythonUicrAddress["PagesUsed"] = MicropythonUicrAddress.StartPage + UPY_START_PAGE_LEN] = "PagesUsed";
	  MicropythonUicrAddress[MicropythonUicrAddress["Delimiter"] = MicropythonUicrAddress.PagesUsed + UPY_PAGES_USED_LEN] = "Delimiter";
	  MicropythonUicrAddress[MicropythonUicrAddress["VersionLocation"] = MicropythonUicrAddress.Delimiter + UPY_DELIMITER_LEN] = "VersionLocation";
	  MicropythonUicrAddress[MicropythonUicrAddress["RegionsTerminator"] = MicropythonUicrAddress.VersionLocation + UPY_REGIONS_TERMINATOR_LEN] = "RegionsTerminator";
	  MicropythonUicrAddress[MicropythonUicrAddress["End"] = MicropythonUicrAddress.RegionsTerminator + UPY_VERSION_LEN] = "End";
	})(MicropythonUicrAddress || (MicropythonUicrAddress = {}));
	/**
	 * Reads a 32 bit little endian number from an Intel Hex memory map.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @param address - Start address of the 32 bit number.
	 * @returns Number with the unsigned integer representation of those 4 bytes.
	 */


	function getUint32FromIntelHexMap(intelHexMap, address) {
	  var uint32Data = intelHexMap.slicePad(address, 4, 0xff); // Typed arrays use the native endianness, force little endian with DataView

	  return new DataView(uint32Data.buffer).getUint32(0, true
	  /* little endian */
	  );
	}
	/**
	 * Reads a 16 bit little endian number from an Intel Hex memory map.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @param address - Start address of the 16 bit number.
	 * @returns Number with the unsigned integer representation of those 2 bytes.
	 */


	function getUint16FromIntelHexMap(intelHexMap, address) {
	  var uint16Data = intelHexMap.slicePad(address, 2, 0xff); // Typed arrays use the native endianness, force little endian with DataView

	  return new DataView(uint16Data.buffer).getUint16(0, true
	  /* little endian */
	  );
	}
	/**
	 * Decodes a UTF-8 null terminated string stored in the Intel Hex data at
	 * the indicated address.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @param address - Start address for the string.
	 * @returns String read from the Intel Hex data.
	 */


	function getStringFromIntelHexMap(intelHexMap, address) {
	  var memBlock = intelHexMap.slice(address).get(address);
	  var iStrEnd = 0;

	  while (iStrEnd < memBlock.length && memBlock[iStrEnd] !== 0) {
	    iStrEnd++;
	  }

	  if (iStrEnd === memBlock.length) {
	    // Could not find a null character to indicate the end of the string
	    return '';
	  }

	  var stringBytes = memBlock.slice(0, iStrEnd);
	  return bytesToStr(stringBytes);
	}
	/**
	 * Check if the magic number for the MicroPython UICR data is present in the
	 * Intel Hex memory map.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @return True if the magic number matches, false otherwise.
	 */


	function confirmMagicValue(intelHexMap) {
	  var readMagicHeader = getMagicValue(intelHexMap);

	  for (var _i = 0, DEVICE_INFO_1 = DEVICE_INFO; _i < DEVICE_INFO_1.length; _i++) {
	    var device = DEVICE_INFO_1[_i];

	    if (device.magicHeader === readMagicHeader) {
	      return true;
	    }
	  }

	  return false;
	}
	/**
	 * Reads the UICR data that contains the Magic Value that indicates the
	 * MicroPython presence in the hex data.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @returns The Magic Value from UICR.
	 */


	function getMagicValue(intelHexMap) {
	  return getUint32FromIntelHexMap(intelHexMap, MicropythonUicrAddress.MagicValue);
	}
	/**
	 * Reads the UICR data from an Intel Hex map and detects the device version.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @returns The micro:bit board version.
	 */


	function getDeviceVersion(intelHexMap) {
	  var readMagicHeader = getMagicValue(intelHexMap);

	  for (var _i = 0, DEVICE_INFO_2 = DEVICE_INFO; _i < DEVICE_INFO_2.length; _i++) {
	    var device = DEVICE_INFO_2[_i];

	    if (device.magicHeader === readMagicHeader) {
	      return device.deviceVersion;
	    }
	  }

	  throw new Error('Cannot find device version, unknown UICR Magic value');
	}
	/**
	 * Reads the UICR data from an Intel Hex map and retrieves the flash size.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @returns The micro:bit flash size.
	 */


	function getFlashSize(intelHexMap) {
	  var readMagicHeader = getMagicValue(intelHexMap);

	  for (var _i = 0, DEVICE_INFO_3 = DEVICE_INFO; _i < DEVICE_INFO_3.length; _i++) {
	    var device = DEVICE_INFO_3[_i];

	    if (device.magicHeader === readMagicHeader) {
	      return device.flashSize;
	    }
	  }

	  throw new Error('Cannot find flash size, unknown UICR Magic value');
	}
	/**
	 * Reads the UICR data that contains the flash page size.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @returns The size of each flash page size.
	 */


	function getPageSize(intelHexMap) {
	  var pageSize = getUint32FromIntelHexMap(intelHexMap, MicropythonUicrAddress.PageSize); // Page size is stored as a log base 2

	  return Math.pow(2, pageSize);
	}
	/**
	 * Reads the UICR data that contains the start page of the MicroPython runtime.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @returns The start page number of the MicroPython runtime.
	 */


	function getStartPage(intelHexMap) {
	  return getUint16FromIntelHexMap(intelHexMap, MicropythonUicrAddress.StartPage);
	}
	/**
	 * Reads the UICR data that contains the number of flash pages used by the
	 * MicroPython runtime.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @returns The number of pages used by the MicroPython runtime.
	 */


	function getPagesUsed(intelHexMap) {
	  return getUint16FromIntelHexMap(intelHexMap, MicropythonUicrAddress.PagesUsed);
	}
	/**
	 * Reads the UICR data that contains the address of the location in flash where
	 * the MicroPython version is stored.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @returns The address of the location in flash where the MicroPython version
	 * is stored.
	 */


	function getVersionLocation(intelHexMap) {
	  return getUint32FromIntelHexMap(intelHexMap, MicropythonUicrAddress.VersionLocation);
	}
	/**
	 * Reads the UICR data from an Intel Hex map and retrieves the MicroPython data.
	 *
	 * @throws {Error} When the Magic Header is not present.
	 *
	 * @param intelHexMap - Memory map of the Intel Hex data.
	 * @returns Object with the decoded UICR MicroPython data.
	 */


	function getHexMapUicrData(intelHexMap) {
	  var uicrMap = intelHexMap.slice(UICR_UPY_START);

	  if (!confirmMagicValue(uicrMap)) {
	    throw new Error('Could not find valid MicroPython UICR data.');
	  }

	  var flashPageSize = getPageSize(uicrMap);
	  var flashSize = getFlashSize(uicrMap);
	  var startPage = getStartPage(uicrMap);
	  var pagesUsed = getPagesUsed(uicrMap);
	  var versionAddress = getVersionLocation(uicrMap);
	  var version = getStringFromIntelHexMap(intelHexMap, versionAddress);
	  var deviceVersion = getDeviceVersion(uicrMap);
	  return {
	    flashPageSize: flashPageSize,
	    flashSize: flashSize,
	    runtimeStartPage: startPage,
	    runtimeStartAddress: startPage * flashPageSize,
	    runtimeEndUsed: pagesUsed,
	    runtimeEndAddress: pagesUsed * flashPageSize,
	    uicrStartAddress: MicropythonUicrAddress.MagicValue,
	    uicrEndAddress: MicropythonUicrAddress.End,
	    versionAddress: versionAddress,
	    version: version,
	    deviceVersion: deviceVersion
	  };
	}
	/**
	 * Reads the UICR data from an Intel Hex string and retrieves the MicroPython
	 * data.
	 *
	 * @throws {Error} When the Magic Header is not present.
	 *
	 * @param intelHex - MicroPython Intel Hex string.
	 * @returns Object with the decoded UICR MicroPython data.
	 */


	function getIntelHexUicrData(intelHex) {
	  return getHexMapUicrData(MemoryMap.fromHex(intelHex));
	}

	/** Sizes for the different parts of the file system chunks. */

	var CHUNK_LEN = 128;
	var CHUNK_MARKER_LEN = 1;
	var CHUNK_TAIL_LEN = 1;
	var CHUNK_DATA_LEN = CHUNK_LEN - CHUNK_MARKER_LEN - CHUNK_TAIL_LEN;
	var CHUNK_HEADER_END_OFFSET_LEN = 1;
	var CHUNK_HEADER_NAME_LEN = 1;
	var MAX_FILENAME_LENGTH = 120;
	/**
	 * Chunks are a double linked list with 1-byte pointers and the front marker
	 * (previous pointer) cannot have the values listed in the ChunkMarker enum
	 */

	var MAX_NUMBER_OF_CHUNKS = 256 - 4;
	/**
	 * To speed up the Intel Hex string generation with MicroPython and the
	 * filesystem we can cache some of the Intel Hex records and the parsed Memory
	 * Map. This function creates an object with cached data that can then be sent
	 * to other functions from this module.
	 *
	 * @param originalIntelHex Intel Hex string with MicroPython to cache.
	 * @returns Cached MpFsBuilderCache object.
	 */

	function createMpFsBuilderCache(originalIntelHex) {
	  var originalMemMap = MemoryMap.fromHex(originalIntelHex);
	  var uicrData = getHexMapUicrData(originalMemMap); // slice() returns a new MemoryMap with only the MicroPython data, so it will
	  // not include the UICR. The End Of File record is removed because this string
	  // will be concatenated with the filesystem data any thing else in the MemMap

	  var uPyIntelHex = originalMemMap.slice(uicrData.runtimeStartAddress, uicrData.runtimeEndAddress - uicrData.runtimeStartAddress).asHexString().replace(':00000001FF', '');
	  return {
	    originalIntelHex: originalIntelHex,
	    originalMemMap: originalMemMap,
	    uPyIntelHex: uPyIntelHex,
	    uPyEndAddress: uicrData.runtimeEndAddress,
	    fsSize: getMemMapFsSize(originalMemMap)
	  };
	}
	/**
	 * Scans the file system area inside the Intel Hex data a returns a list of
	 * available chunks.
	 *
	 * @param intelHexMap - Memory map for the MicroPython Intel Hex.
	 * @returns List of all unused chunks.
	 */


	function getFreeChunks(intelHexMap) {
	  var freeChunks = [];
	  var startAddress = getStartAddress(intelHexMap);
	  var endAddress = getLastPageAddress(intelHexMap);
	  var chunkAddr = startAddress;
	  var chunkIndex = 1;

	  while (chunkAddr < endAddress) {
	    var marker = intelHexMap.slicePad(chunkAddr, 1, 255
	    /* Unused */
	    )[0];

	    if (marker === 255
	    /* Unused */
	    || marker === 0
	    /* Freed */
	    ) {
	        freeChunks.push(chunkIndex);
	      }

	    chunkIndex++;
	    chunkAddr += CHUNK_LEN;
	  }

	  return freeChunks;
	}
	/**
	 * Calculates from the input Intel Hex where the MicroPython runtime ends and
	 * and where the start of the filesystem would be based on that.
	 *
	 * @param intelHexMap - Memory map for the MicroPython Intel Hex.
	 * @returns Filesystem start address
	 */


	function getStartAddress(intelHexMap) {
	  var uicrData = getHexMapUicrData(intelHexMap); // Calculate the maximum flash space the filesystem can possible take

	  var fsMaxSize = CHUNK_LEN * MAX_NUMBER_OF_CHUNKS; // We need to add the persistent data which is one page aligned after fs data

	  fsMaxSize += uicrData.flashPageSize - fsMaxSize % uicrData.flashPageSize;

	  if (uicrData.deviceVersion === 1) {
	    // TODO: v2 has persistent page inside the fs flash area
	    fsMaxSize += uicrData.flashPageSize;
	  }

	  var runtimeEndAddress = uicrData.runtimeEndAddress;

	  if (uicrData.deviceVersion === 2) {
	    // TODO: MicroPython for v2 is currently reserving a page for future expansion
	    runtimeEndAddress += uicrData.flashPageSize;
	  } // Fs is placed at the end of flash, the space available from the MicroPython
	  // end to the end of flash might be larger than the fs max possible size


	  var fsMaxSizeStartAddress = getEndAddress(intelHexMap) - fsMaxSize;
	  var startAddress = Math.max(runtimeEndAddress, fsMaxSizeStartAddress); // Ensure the start address is aligned with the page size

	  if (startAddress % uicrData.flashPageSize) {
	    throw new Error('File system start address from UICR does not align with flash page size.');
	  }

	  return startAddress;
	}
	/**
	 * Calculates the end address for the filesystem.
	 *
	 * Start from the end of flash, or from the top of appended script if
	 * one is included in the Intel Hex data.
	 * Then move one page up as it is used for the magnetometer calibration data.
	 *
	 * @param intelHexMap - Memory map for the MicroPython Intel Hex.
	 * @returns End address for the filesystem.
	 */


	function getEndAddress(intelHexMap) {
	  var uicrData = getHexMapUicrData(intelHexMap);
	  var endAddress = isAppendedScriptPresent(intelHexMap) ? exports.AppendedBlock.StartAdd : uicrData.flashSize;

	  if (uicrData.deviceVersion === 1) {
	    // In v1 the magnetometer calibration data takes one flash page
	    endAddress -= uicrData.flashPageSize;
	  } else if (uicrData.deviceVersion === 2) {
	    // TODO: For v2 72 KBs are used for bootloader and other pages (0x6E000)
	    // endAddress -= 72 * 1024;
	    // TODO: for the current release we need to overlap this page
	    endAddress -= 68 * 1024;
	  } else {
	    throw new Error('Unknown device flash map');
	  }

	  return endAddress;
	}
	/**
	 * Calculates the address for the last page available to the filesystem.
	 *
	 * @param intelHexMap - Memory map for the MicroPython Intel Hex.
	 * @returns Memory address where the last filesystem page starts.
	 */


	function getLastPageAddress(intelHexMap) {
	  var uicrData = getHexMapUicrData(intelHexMap);
	  return getEndAddress(intelHexMap) - uicrData.flashPageSize;
	}
	/**
	 * If not present already, it sets the persistent page in flash.
	 *
	 * This page can be located right below or right on top of the filesystem
	 * space.
	 *
	 * @param intelHexMap - Memory map for the MicroPython Intel Hex.
	 */


	function setPersistentPage(intelHexMap) {
	  // At the moment we place this persistent page at the end of the filesystem
	  // TODO: This could be set to the first or the last page. Check first if it
	  //  exists, if it doesn't then randomise its location.
	  intelHexMap.set(getLastPageAddress(intelHexMap), new Uint8Array([253
	  /* PersistentData */
	  ]));
	}
	/**
	 * Calculate the flash memory address from the chunk index.
	 *
	 * @param intelHexMap - Memory map for the MicroPython Intel Hex.
	 * @param chunkIndex - Index for the chunk to calculate.
	 * @returns Address in flash for the chunk.
	 */


	function chuckIndexAddress(intelHexMap, chunkIndex) {
	  // Chunk index starts at 1, so we need to account for that in the calculation
	  return getStartAddress(intelHexMap) + (chunkIndex - 1) * CHUNK_LEN;
	}
	/**
	 * Class to contain file data and generate its MicroPython filesystem
	 * representation.
	 */


	var FsFile =
	/** @class */
	function () {
	  /**
	   * Create a file.
	   *
	   * @param filename - Name for the file.
	   * @param data - Byte array with the file data.
	   */
	  function FsFile(filename, data) {
	    this._filename = filename;
	    this._filenameBytes = strToBytes(filename);

	    if (this._filenameBytes.length > MAX_FILENAME_LENGTH) {
	      throw new Error("File name \"" + filename + "\" is too long " + ("(max " + MAX_FILENAME_LENGTH + " characters)."));
	    }

	    this._dataBytes = data; // Generate a single byte array with the filesystem data bytes.
	    // When MicroPython uses up to the last byte of the last chunk it will
	    // still consume the next chunk, and leave it blank
	    // To replicate the same behaviour we add an extra 0xFF to the data block

	    var fileHeader = this._generateFileHeaderBytes();

	    this._fsDataBytes = new Uint8Array(fileHeader.length + this._dataBytes.length + 1);

	    this._fsDataBytes.set(fileHeader, 0);

	    this._fsDataBytes.set(this._dataBytes, fileHeader.length);

	    this._fsDataBytes[this._fsDataBytes.length - 1] = 0xff;
	  }
	  /**
	   * Generate an array of file system chunks for all this file content.
	   *
	   * @throws {Error} When there are not enough chunks available.
	   *
	   * @param freeChunks - List of available chunks to use.
	   * @returns An array of byte arrays, one item per chunk.
	   */


	  FsFile.prototype.getFsChunks = function (freeChunks) {
	    // Now form the chunks
	    var chunks = [];
	    var freeChunksIndex = 0;
	    var dataIndex = 0; // Prepare first chunk where the marker indicates a file start

	    var chunk = new Uint8Array(CHUNK_LEN).fill(0xff);
	    chunk[0
	    /* Marker */
	    ] = 254
	    /* FileStart */
	    ;
	    var loopEnd = Math.min(this._fsDataBytes.length, CHUNK_DATA_LEN);

	    for (var i = 0; i < loopEnd; i++, dataIndex++) {
	      chunk[CHUNK_MARKER_LEN + i] = this._fsDataBytes[dataIndex];
	    }

	    chunks.push(chunk); // The rest of the chunks follow the same pattern

	    while (dataIndex < this._fsDataBytes.length) {
	      freeChunksIndex++;

	      if (freeChunksIndex >= freeChunks.length) {
	        throw new Error("Not enough space for the " + this._filename + " file.");
	      } // The previous chunk has to be followed by this one, so add this index


	      var previousChunk = chunks[chunks.length - 1];
	      previousChunk[127
	      /* Tail */
	      ] = freeChunks[freeChunksIndex];
	      chunk = new Uint8Array(CHUNK_LEN).fill(0xff); // This chunk Marker points to the previous chunk

	      chunk[0
	      /* Marker */
	      ] = freeChunks[freeChunksIndex - 1]; // Add the data to this chunk

	      loopEnd = Math.min(this._fsDataBytes.length - dataIndex, CHUNK_DATA_LEN);

	      for (var i = 0; i < loopEnd; i++, dataIndex++) {
	        chunk[CHUNK_MARKER_LEN + i] = this._fsDataBytes[dataIndex];
	      }

	      chunks.push(chunk);
	    }

	    return chunks;
	  };
	  /**
	   * Generate a single byte array with the filesystem data for this file.
	   *
	   * @param freeChunks - List of available chunks to use.
	   * @returns A byte array with the data to go straight into flash.
	   */


	  FsFile.prototype.getFsBytes = function (freeChunks) {
	    var chunks = this.getFsChunks(freeChunks);
	    var chunksLen = chunks.length * CHUNK_LEN;
	    var fileFsBytes = new Uint8Array(chunksLen);

	    for (var i = 0; i < chunks.length; i++) {
	      fileFsBytes.set(chunks[i], CHUNK_LEN * i);
	    }

	    return fileFsBytes;
	  };
	  /**
	   * @returns Size, in bytes, of how much space the file takes in the filesystem
	   *     flash memory.
	   */


	  FsFile.prototype.getFsFileSize = function () {
	    var chunksUsed = Math.ceil(this._fsDataBytes.length / CHUNK_DATA_LEN);
	    return chunksUsed * CHUNK_LEN;
	  };
	  /**
	   * Generates a byte array for the file header as expected by the MicroPython
	   * file system.
	   *
	   * @return Byte array with the header data.
	   */


	  FsFile.prototype._generateFileHeaderBytes = function () {
	    var headerSize = CHUNK_HEADER_END_OFFSET_LEN + CHUNK_HEADER_NAME_LEN + this._filenameBytes.length;
	    var endOffset = (headerSize + this._dataBytes.length) % CHUNK_DATA_LEN;
	    var fileNameOffset = headerSize - this._filenameBytes.length; // Format header byte array

	    var headerBytes = new Uint8Array(headerSize);
	    headerBytes[1
	    /* EndOffset */
	    - 1] = endOffset;
	    headerBytes[2
	    /* NameLength */
	    - 1] = this._filenameBytes.length;

	    for (var i = fileNameOffset; i < headerSize; ++i) {
	      headerBytes[i] = this._filenameBytes[i - fileNameOffset];
	    }

	    return headerBytes;
	  };

	  return FsFile;
	}();
	/**
	 * @returns Size, in bytes, of how much space the file would take in the
	 *     MicroPython filesystem.
	 */


	function calculateFileSize(filename, data) {
	  var file = new FsFile(filename, data);
	  return file.getFsFileSize();
	}
	/**
	 * Adds a byte array as a file into a MicroPython Memory Map.
	 *
	 * @throws {Error} When the invalid file name is given.
	 * @throws {Error} When the the file doesn't have any data.
	 * @throws {Error} When there are issues calculating the file system boundaries.
	 * @throws {Error} When there is no space left for the file.
	 *
	 * @param intelHexMap - Memory map for the MicroPython Intel Hex.
	 * @param filename - Name for the file.
	 * @param data - Byte array for the file data.
	 */


	function addMemMapFile(intelHexMap, filename, data) {
	  if (!filename) throw new Error('File has to have a file name.');
	  if (!data.length) throw new Error("File " + filename + " has to contain data.");
	  var freeChunks = getFreeChunks(intelHexMap);

	  if (freeChunks.length === 0) {
	    throw new Error('There is no storage space left.');
	  }

	  var chunksStartAddress = chuckIndexAddress(intelHexMap, freeChunks[0]); // Create a file, generate and inject filesystem data.

	  var fsFile = new FsFile(filename, data);
	  var fileFsBytes = fsFile.getFsBytes(freeChunks);
	  intelHexMap.set(chunksStartAddress, fileFsBytes);
	  setPersistentPage(intelHexMap);
	}
	/**
	 * Adds a hash table of filenames and byte arrays as files to the MicroPython
	 * filesystem.
	 *
	 * @throws {Error} When the an invalid file name is given.
	 * @throws {Error} When a file doesn't have any data.
	 * @throws {Error} When there are issues calculating the file system boundaries.
	 * @throws {Error} When there is no space left for a file.
	 *
	 * @param intelHex - MicroPython Intel Hex string or MemoryMap.
	 * @param files - Hash table with filenames as the key and byte arrays as the
	 *     value.
	 * @returns MicroPython Intel Hex string with the files in the filesystem.
	 */


	function addIntelHexFiles(intelHex, files, returnBytes) {
	  if (returnBytes === void 0) {
	    returnBytes = false;
	  }

	  var intelHexMap;

	  if (typeof intelHex === 'string') {
	    intelHexMap = MemoryMap.fromHex(intelHex);
	  } else {
	    intelHexMap = intelHex.clone();
	  }

	  var uicrData = getHexMapUicrData(intelHexMap);
	  Object.keys(files).forEach(function (filename) {
	    addMemMapFile(intelHexMap, filename, files[filename]);
	  });
	  return returnBytes ? intelHexMap.slicePad(0, uicrData.flashSize) : intelHexMap.asHexString() + '\n';
	}
	/**
	 * Generates an Intel Hex string with MicroPython and files in the filesystem.
	 *
	 * Uses pre-cached MicroPython memory map and Intel Hex string of record to
	 * speed up the Intel Hex generation compared to addIntelHexFiles().
	 *
	 * @param cache - Object with cached data from createMpFsBuilderCache().
	 * @param files - Hash table with filenames as the key and byte arrays as the
	 *     value.
	 * @returns MicroPython Intel Hex string with the files in the filesystem.
	 */


	function generateHexWithFiles(cache, files) {
	  var memMapWithFiles = cache.originalMemMap.clone();
	  Object.keys(files).forEach(function (filename) {
	    addMemMapFile(memMapWithFiles, filename, files[filename]);
	  });
	  return cache.uPyIntelHex + memMapWithFiles.slice(cache.uPyEndAddress).asHexString() + '\n';
	}
	/**
	 * Reads the filesystem included in a MicroPython Intel Hex string or Map.
	 *
	 * @throws {Error} When multiple files with the same name encountered.
	 * @throws {Error} When a file chunk points to an unused chunk.
	 * @throws {Error} When a file chunk marker does not point to previous chunk.
	 * @throws {Error} When following through the chunks linked list iterates
	 *     through more chunks and used chunks (sign of an infinite loop).
	 *
	 * @param intelHex - The MicroPython Intel Hex string or MemoryMap to read from.
	 * @returns Dictionary with the filename as key and byte array as values.
	 */


	function getIntelHexFiles(intelHex) {
	  var hexMap;

	  if (typeof intelHex === 'string') {
	    hexMap = MemoryMap.fromHex(intelHex);
	  } else {
	    hexMap = intelHex.clone();
	  }

	  var startAddress = getStartAddress(hexMap);
	  var endAddress = getLastPageAddress(hexMap); // TODO: endAddress as the getLastPageAddress works now because this
	  // library uses the last page as the "persistent" page, so the filesystem does
	  // end there. In reality, the persistent page could be the first or the last
	  // page, so we should get the end address as the magnetometer page and then
	  // check if the persistent marker is present in the first of last page and
	  // take that into account in the memory range calculation.
	  // Note that the persistent marker is only present at the top of the page
	  // Iterate through the filesystem to collect used chunks and file starts

	  var usedChunks = {};
	  var startChunkIndexes = [];
	  var chunkAddr = startAddress;
	  var chunkIndex = 1;

	  while (chunkAddr < endAddress) {
	    var chunk = hexMap.slicePad(chunkAddr, CHUNK_LEN, 255
	    /* Unused */
	    );
	    var marker = chunk[0];

	    if (marker !== 255
	    /* Unused */
	    && marker !== 0
	    /* Freed */
	    && marker !== 253
	    /* PersistentData */
	    ) {
	        usedChunks[chunkIndex] = chunk;

	        if (marker === 254
	        /* FileStart */
	        ) {
	            startChunkIndexes.push(chunkIndex);
	          }
	      }

	    chunkIndex++;
	    chunkAddr += CHUNK_LEN;
	  } // Go through the list of file-starts, follow the file chunks and collect data


	  var files = {};

	  for (var _i = 0, startChunkIndexes_1 = startChunkIndexes; _i < startChunkIndexes_1.length; _i++) {
	    var startChunkIndex = startChunkIndexes_1[_i];
	    var startChunk = usedChunks[startChunkIndex];
	    var endChunkOffset = startChunk[1
	    /* EndOffset */
	    ];
	    var filenameLen = startChunk[2
	    /* NameLength */
	    ]; // 1st byte is the marker, 2nd is the offset, 3rd is the filename length

	    var chunkDataStart = 3 + filenameLen;
	    var filename = bytesToStr(startChunk.slice(3, chunkDataStart));

	    if (files.hasOwnProperty(filename)) {
	      throw new Error("Found multiple files named: " + filename + ".");
	    }

	    files[filename] = new Uint8Array(0);
	    var currentChunk = startChunk;
	    var currentIndex = startChunkIndex; // Chunks are basically a double linked list, so invalid data could create
	    // an infinite loop. No file should traverse more chunks than available.

	    var iterations = Object.keys(usedChunks).length + 1;

	    while (iterations--) {
	      var nextIndex = currentChunk[127
	      /* Tail */
	      ];

	      if (nextIndex === 255
	      /* Unused */
	      ) {
	          // The current chunk is the last
	          files[filename] = concatUint8Array(files[filename], currentChunk.slice(chunkDataStart, 1 + endChunkOffset));
	          break;
	        } else {
	        files[filename] = concatUint8Array(files[filename], currentChunk.slice(chunkDataStart, 127
	        /* Tail */
	        ));
	      }

	      var nextChunk = usedChunks[nextIndex];

	      if (!nextChunk) {
	        throw new Error("Chunk " + currentIndex + " points to unused index " + nextIndex + ".");
	      }

	      if (nextChunk[0
	      /* Marker */
	      ] !== currentIndex) {
	        throw new Error("Chunk index " + nextIndex + " did not link to previous chunk index " + currentIndex + ".");
	      }

	      currentChunk = nextChunk;
	      currentIndex = nextIndex; // Start chunk data has a unique start, all others start after marker

	      chunkDataStart = 1;
	    }

	    if (iterations <= 0) {
	      // We iterated through chunks more often than available chunks
	      throw new Error('Malformed file chunks did not link correctly.');
	    }
	  }

	  return files;
	}
	/**
	 * Calculate the MicroPython filesystem size.
	 *
	 * @param intelHexMap - The MicroPython Intel Hex Memory Map.
	 * @returns Size of the filesystem in bytes.
	 */


	function getMemMapFsSize(intelHexMap) {
	  var uicrData = getHexMapUicrData(intelHexMap);
	  var startAddress = getStartAddress(intelHexMap);
	  var endAddress = getEndAddress(intelHexMap); // One extra page is used as persistent page

	  return endAddress - startAddress - uicrData.flashPageSize;
	}

	var SimpleFile =
	/** @class */
	function () {
	  /**
	   * Create a SimpleFile.
	   *
	   * @throws {Error} When an invalid filename is provided.
	   * @throws {Error} When invalid file data is provided.
	   *
	   * @param filename - Name for the file.
	   * @param data - String or byte array with the file data.
	   */
	  function SimpleFile(filename, data) {
	    if (!filename) {
	      throw new Error('File was not provided a valid filename.');
	    }

	    if (!data) {
	      throw new Error("File " + filename + " does not have valid content.");
	    }

	    this.filename = filename;

	    if (typeof data === 'string') {
	      this._dataBytes = strToBytes(data);
	    } else if (data instanceof Uint8Array) {
	      this._dataBytes = data;
	    } else {
	      throw new Error('File data type must be a string or Uint8Array.');
	    }
	  }

	  SimpleFile.prototype.getText = function () {
	    return bytesToStr(this._dataBytes);
	  };

	  SimpleFile.prototype.getBytes = function () {
	    return this._dataBytes;
	  };

	  return SimpleFile;
	}();

	var MicropythonFsHex =
	/** @class */
	function () {
	  /**
	   * File System manager constructor.
	   * At the moment it needs a MicroPython hex string without a files included.
	   *
	   * @param intelHex - MicroPython Intel Hex string.
	   */
	  function MicropythonFsHex(intelHex, _a) {
	    var _b = (_a === void 0 ? {} : _a).maxFsSize,
	        maxFsSize = _b === void 0 ? 0 : _b;
	    this._files = {};
	    this._storageSize = 0;

	    if (!intelHex) {
	      throw new Error('Invalid MicroPython hex invalid.');
	    }

	    this._uPyFsBuilderCache = createMpFsBuilderCache(intelHex);
	    this.setStorageSize(maxFsSize || this._uPyFsBuilderCache.fsSize); // Check if there are files in the input hex

	    var hexFiles = getIntelHexFiles(this._uPyFsBuilderCache.originalMemMap);

	    if (Object.keys(hexFiles).length) {
	      throw new Error('There are files in the MicropythonFsHex constructor hex file input.');
	    }
	  }
	  /**
	   * Create a new file and add it to the file system.
	   *
	   * @throws {Error} When the file already exists.
	   * @throws {Error} When an invalid filename is provided.
	   * @throws {Error} When invalid file data is provided.
	   *
	   * @param filename - Name for the file.
	   * @param content - File content to write.
	   */


	  MicropythonFsHex.prototype.create = function (filename, content) {
	    if (this.exists(filename)) {
	      throw new Error('File already exists.');
	    }

	    this.write(filename, content);
	  };
	  /**
	   * Write a file into the file system. Overwrites a previous file with the
	   * same name.
	   *
	   * @throws {Error} When an invalid filename is provided.
	   * @throws {Error} When invalid file data is provided.
	   *
	   * @param filename - Name for the file.
	   * @param content - File content to write.
	   */


	  MicropythonFsHex.prototype.write = function (filename, content) {
	    this._files[filename] = new SimpleFile(filename, content);
	  };

	  MicropythonFsHex.prototype.append = function (filename, content) {
	    if (!filename) {
	      throw new Error('Invalid filename.');
	    }

	    if (!this.exists(filename)) {
	      throw new Error("File \"" + filename + "\" does not exist.");
	    } // TODO: Implement this.


	    throw new Error('Append operation not yet implemented.');
	  };
	  /**
	   * Read the text from a file.
	   *
	   * @throws {Error} When invalid file name is provided.
	   * @throws {Error} When file is not in the file system.
	   *
	   * @param filename - Name of the file to read.
	   * @returns Text from the file.
	   */


	  MicropythonFsHex.prototype.read = function (filename) {
	    if (!filename) {
	      throw new Error('Invalid filename.');
	    }

	    if (!this.exists(filename)) {
	      throw new Error("File \"" + filename + "\" does not exist.");
	    }

	    return this._files[filename].getText();
	  };
	  /**
	   * Read the bytes from a file.
	   *
	   * @throws {Error} When invalid file name is provided.
	   * @throws {Error} When file is not in the file system.
	   *
	   * @param filename - Name of the file to read.
	   * @returns Byte array from the file.
	   */


	  MicropythonFsHex.prototype.readBytes = function (filename) {
	    if (!filename) {
	      throw new Error('Invalid filename.');
	    }

	    if (!this.exists(filename)) {
	      throw new Error("File \"" + filename + "\" does not exist.");
	    }

	    return this._files[filename].getBytes();
	  };
	  /**
	   * Delete a file from the file system.
	   *
	   * @throws {Error} When invalid file name is provided.
	   * @throws {Error} When the file doesn't exist.
	   *
	   * @param filename - Name of the file to delete.
	   */


	  MicropythonFsHex.prototype.remove = function (filename) {
	    if (!filename) {
	      throw new Error('Invalid filename.');
	    }

	    if (!this.exists(filename)) {
	      throw new Error("File \"" + filename + "\" does not exist.");
	    }

	    delete this._files[filename];
	  };
	  /**
	   * Check if a file is already present in the file system.
	   *
	   * @param filename - Name for the file to check.
	   * @returns True if it exists, false otherwise.
	   */


	  MicropythonFsHex.prototype.exists = function (filename) {
	    return this._files.hasOwnProperty(filename);
	  };
	  /**
	   * Returns the size of a file in bytes.
	   *
	   * @throws {Error} When invalid file name is provided.
	   * @throws {Error} When the file doesn't exist.
	   *
	   * @param filename - Name for the file to check.
	   * @returns Size file size in bytes.
	   */


	  MicropythonFsHex.prototype.size = function (filename) {
	    if (!filename) {
	      throw new Error("Invalid filename: " + filename);
	    }

	    if (!this.exists(filename)) {
	      throw new Error("File \"" + filename + "\" does not exist.");
	    }

	    return calculateFileSize(this._files[filename].filename, this._files[filename].getBytes());
	  };
	  /**
	   * @returns A list all the files in the file system.
	   */


	  MicropythonFsHex.prototype.ls = function () {
	    var files = [];
	    Object.values(this._files).forEach(function (value) {
	      return files.push(value.filename);
	    });
	    return files;
	  };
	  /**
	   * Sets a storage size limit. Must be smaller than available space in
	   * MicroPython.
	   *
	   * @param {number} size - Size in bytes for the filesystem.
	   */


	  MicropythonFsHex.prototype.setStorageSize = function (size) {
	    if (size > this._uPyFsBuilderCache.fsSize) {
	      throw new Error('Storage size limit provided is larger than size available in the MicroPython hex.');
	    }

	    this._storageSize = size;
	  };
	  /**
	   * The available filesystem total size either calculated by the MicroPython
	   * hex or the max storage size limit has been set.
	   *
	   * @returns Size of the filesystem in bytes.
	   */


	  MicropythonFsHex.prototype.getStorageSize = function () {
	    return this._storageSize;
	  };
	  /**
	   * @returns The total number of bytes currently used by files in the file system.
	   */


	  MicropythonFsHex.prototype.getStorageUsed = function () {
	    var _this = this;

	    var total = 0;
	    Object.values(this._files).forEach(function (value) {
	      return total += _this.size(value.filename);
	    });
	    return total;
	  };
	  /**
	   * @returns The remaining storage of the file system in bytes.
	   */


	  MicropythonFsHex.prototype.getStorageRemaining = function () {
	    var _this = this;

	    var total = 0;
	    var capacity = this.getStorageSize();
	    Object.values(this._files).forEach(function (value) {
	      return total += _this.size(value.filename);
	    });
	    return capacity - total;
	  };
	  /**
	   * Read the files included in a MicroPython hex string and add them to this
	   * instance.
	   *
	   * @throws {Error} When there are no files to import in the hex.
	   * @throws {Error} When there is a problem reading the files from the hex.
	   * @throws {Error} When a filename already exists in this instance (all other
	   *     files are still imported).
	   *
	   * @param intelHex - MicroPython hex string with files.
	   * @param overwrite - Flag to overwrite existing files in this instance.
	   * @param formatFirst - Erase all the previous files before importing. It only
	   *     erases the files after there are no error during hex file parsing.
	   * @returns A filename list of added files.
	   */


	  MicropythonFsHex.prototype.importFilesFromIntelHex = function (intelHex, _a) {
	    var _this = this;

	    var _b = _a === void 0 ? {} : _a,
	        _c = _b.overwrite,
	        overwrite = _c === void 0 ? false : _c,
	        _d = _b.formatFirst,
	        formatFirst = _d === void 0 ? false : _d;

	    var files = getIntelHexFiles(intelHex);

	    if (!Object.keys(files).length) {
	      throw new Error('Hex does not have any files to import');
	    }

	    if (formatFirst) {
	      delete this._files;
	      this._files = {};
	    }

	    var existingFiles = [];
	    Object.keys(files).forEach(function (filename) {
	      if (!overwrite && _this.exists(filename)) {
	        existingFiles.push(filename);
	      } else {
	        _this.write(filename, files[filename]);
	      }
	    }); // Only throw the error at the end so that all other files are imported

	    if (existingFiles.length) {
	      throw new Error("Files \"" + existingFiles + "\" from hex already exists.");
	    }

	    return Object.keys(files);
	  };
	  /**
	   * Generate a new copy of the MicroPython Intel Hex with the filesystem
	   * included.
	   *
	   * @throws {Error} When a file doesn't have any data.
	   * @throws {Error} When there are issues calculating file system boundaries.
	   * @throws {Error} When there is no space left for a file.
	   *
	   * @returns A new string with MicroPython and the filesystem included.
	   */


	  MicropythonFsHex.prototype.getIntelHex = function () {
	    if (this.getStorageRemaining() < 0) {
	      throw new Error('There is no storage space left.');
	    }

	    var files = {};
	    Object.values(this._files).forEach(function (file) {
	      files[file.filename] = file.getBytes();
	    });
	    return generateHexWithFiles(this._uPyFsBuilderCache, files);
	  };
	  /**
	   * Generate a byte array of the MicroPython and filesystem data.
	   *
	   * @throws {Error} When a file doesn't have any data.
	   * @throws {Error} When there are issues calculating file system boundaries.
	   * @throws {Error} When there is no space left for a file.
	   *
	   * @returns A Uint8Array with MicroPython and the filesystem included.
	   */


	  MicropythonFsHex.prototype.getIntelHexBytes = function () {
	    if (this.getStorageRemaining() < 0) {
	      throw new Error('There is no storage space left.');
	    }

	    var files = {};
	    Object.values(this._files).forEach(function (file) {
	      files[file.filename] = file.getBytes();
	    });
	    return addIntelHexFiles(this._uPyFsBuilderCache.originalMemMap, files, true);
	  };

	  return MicropythonFsHex;
	}();

	exports.MicropythonFsHex = MicropythonFsHex;
	exports.addIntelHexAppendedScript = addIntelHexAppendedScript;
	exports.cleanseOldHexFormat = cleanseOldHexFormat;
	exports.getHexMapUicrData = getHexMapUicrData;
	exports.getIntelHexAppendedScript = getIntelHexAppendedScript;
	exports.getIntelHexUicrData = getIntelHexUicrData;
	exports.isAppendedScriptPresent = isAppendedScriptPresent;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=microbit-fs.umd.js.map
