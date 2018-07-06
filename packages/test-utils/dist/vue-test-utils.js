'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var util = require('shared/util');
var Vue = _interopDefault(require('vue'));
var validators = require('shared/validators');
var createInstance = _interopDefault(require('create-instance'));
var mergeOptions = require('shared/merge-options');
var stubComponents = require('shared/stub-components');

// 

function warnIfNoWindow () {
  if (typeof window === 'undefined') {
    util.throwError(
      "window is undefined, vue-test-utils needs to be " +
        "run in a browser environment.\n" +
        ("You can run the tests in node using jsdom + " +
          "jsdom-global.\n") +
        ("See " +
          "https://vue-test-utils.vuejs.org/guides/common-tips.html " +
          "for more details.")
    );
  }
}

if (typeof Element !== 'undefined' && !Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s);
      var i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1
    };
}

if (typeof Object.assign !== 'function') {
  (function () {
    Object.assign = function (target) {
      var arguments$1 = arguments;

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments$1[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output
    };
  })();
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var this$1 = this;

  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this$1.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var this$1 = this;

  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this$1.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var this$1 = this;

  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this$1.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq_1(object[key], value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike_1(value) && isArrayLike_1(value);
}

var isArrayLikeObject_1 = isArrayLikeObject;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$7 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/**
 * Gets the value at `key`, unless `key` is "__proto__".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  return key == '__proto__'
    ? undefined
    : object[key];
}

var _safeGet = safeGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn$1;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return _copyObject(value, keysIn_1(value));
}

var toPlainObject_1 = toPlainObject;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = _safeGet(object, key),
      srcValue = _safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    _assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray_1(srcValue),
        isBuff = !isArr && isBuffer_1(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_1(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject_1(objValue)) {
        newValue = _copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = _cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = _cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
      newValue = objValue;
      if (isArguments_1(objValue)) {
        newValue = toPlainObject_1(objValue);
      }
      else if (!isObject_1(objValue) || (srcIndex && isFunction_1(objValue))) {
        newValue = _initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  _assignMergeValue(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  _baseFor(source, function(srcValue, key) {
    if (isObject_1(srcValue)) {
      stack || (stack = new _Stack);
      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      _assignMergeValue(object, key, newValue);
    }
  }, keysIn_1);
}

var _baseMerge = baseMerge;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
  return _defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = _createAssigner(function(object, source, srcIndex, customizer) {
  _baseMerge(object, source, srcIndex, customizer);
});

var mergeWith_1 = mergeWith;

var NAME_SELECTOR = 'NAME_SELECTOR';
var COMPONENT_SELECTOR = 'COMPONENT_SELECTOR';
var REF_SELECTOR = 'REF_SELECTOR';
var DOM_SELECTOR = 'DOM_SELECTOR';
var VUE_VERSION = Number(
  ((Vue.version.split('.')[0]) + "." + (Vue.version.split('.')[1]))
);
var FUNCTIONAL_OPTIONS =
  VUE_VERSION >= 2.5 ? 'fnOptions' : 'functionalOptions';

// 

function getSelectorTypeOrThrow (
  selector,
  methodName
) {
  if (validators.isDomSelector(selector)) { return DOM_SELECTOR }
  if (validators.isNameSelector(selector)) { return NAME_SELECTOR }
  if (validators.isVueComponent(selector)) { return COMPONENT_SELECTOR }
  if (validators.isRefSelector(selector)) { return REF_SELECTOR }

  util.throwError(
    "wrapper." + methodName + "() must be passed a valid CSS selector, " +
    "Vue constructor, or valid find option object"
  );
}

// 

function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (c && (c.componentOptions || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $FlowIgnore
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

var TransitionStub = {
  render: function render (h) {
    var children = this.$options._renderChildren;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (children.length > 1) {
      util.warn(
        "<transition> can only be used on a single element. " + "Use " +
         '<transition-group> for lists.'
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      util.warn(
        'invalid <transition> mode: ' + mode
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);

    if (!child) {
      return rawChild
    }

    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {}));
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);
    if (child.data.directives &&
      child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    // mark v-show
    // so that the transition module can hand over the control
    // to the directive
    if (child.data.directives &&
      child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }
    if (
      oldChild &&
         oldChild.data &&
         !isSameChild(child, oldChild) &&
         !isAsyncPlaceholder(oldChild) &&
         // #6687 component root is a comment node
         !(oldChild.componentInstance &&
          oldChild.componentInstance._vnode.isComment)
    ) {
      oldChild.data = Object.assign({}, data);
    }
    return rawChild
  }
}

// 

var TransitionGroupStub = {
  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var children = this.$slots.default || [];

    return h(tag, null, children)
  }
}

var config = {
  stubs: {
    transition: TransitionStub,
    'transition-group': TransitionGroupStub
  },
  mocks: {},
  methods: {},
  provide: {},
  logModifiedComponents: true,
  silent: true
}

// 

function findAllVueComponentsFromVm (
  vm,
  components
) {
  if ( components === void 0 ) components = [];

  components.push(vm);
  vm.$children.forEach(function (child) {
    findAllVueComponentsFromVm(child, components);
  });

  return components
}

function findAllVueComponentsFromVnode (
  vnode,
  components
) {
  if ( components === void 0 ) components = [];

  if (vnode.child) {
    components.push(vnode.child);
  }
  if (vnode.children) {
    vnode.children.forEach(function (child) {
      findAllVueComponentsFromVnode(child, components);
    });
  }

  return components
}

function findAllFunctionalComponentsFromVnode (
  vnode,
  components
) {
  if ( components === void 0 ) components = [];

  if (vnode[FUNCTIONAL_OPTIONS] || vnode.functionalContext) {
    components.push(vnode);
  }
  if (vnode.children) {
    vnode.children.forEach(function (child) {
      findAllFunctionalComponentsFromVnode(child, components);
    });
  }
  return components
}

function vmCtorMatchesName (vm, name) {
  return !!(
    name && (
      (vm._vnode &&
      vm._vnode.functionalOptions &&
      vm._vnode.functionalOptions.name === name) ||
    (vm.$options && vm.$options.name === name) ||
    (vm.options && vm.options.name === name)
    ))
}

function vmCtorMatchesSelector (
  component,
  selector
) {
  var Ctor = selector._Ctor || (selector.options && selector.options._Ctor);
  if (!Ctor) {
    return false
  }
  var constructor = component.__proto__.constructor;
  return Object.keys(Ctor || {}).some(function (c) {
    return Ctor[c] === constructor || Ctor[c] === constructor.super
  })
}

function vmFunctionalCtorMatchesSelector (
  component,
  Ctor
) {
  if (VUE_VERSION < 2.3) {
    util.throwError(
      "find for functional components is not support in " + "Vue < 2.3"
    );
  }

  if (!Ctor) {
    return false
  }

  if (!component[FUNCTIONAL_OPTIONS]) {
    return false
  }
  var Ctors = Object.keys(component[FUNCTIONAL_OPTIONS]._Ctor);
  return Ctors.some(function (c) { return Ctor[c] === component[FUNCTIONAL_OPTIONS]._Ctor[c]; })
}

function findVueComponents (
  root,
  selectorType,
  selector
) {
  if (selector.functional) {
    var nodes = root._vnode
      ? findAllFunctionalComponentsFromVnode(root._vnode)
      : findAllFunctionalComponentsFromVnode(root);
    return nodes.filter(
      function (node) { return vmFunctionalCtorMatchesSelector(node, selector._Ctor) ||
        node[FUNCTIONAL_OPTIONS].name === selector.name; }
    )
  }
  var nameSelector =
    typeof selector === 'function' ? selector.extendOptions.name : selector.name;
  var components = root._isVue
    ? findAllVueComponentsFromVm(root)
    : findAllVueComponentsFromVnode(root);
  return components.filter(function (component) {
    if (!component.$vnode && !component.$options.extends) {
      return false
    }
    return (
      vmCtorMatchesSelector(component, selector) ||
      vmCtorMatchesName(component, nameSelector)
    )
  })
}

// 

var WrapperArray = function WrapperArray (wrappers) {
  var length = wrappers.length;
  // $FlowIgnore
  Object.defineProperty(this, 'wrappers', {
    get: function () { return wrappers; },
    set: function () { return util.throwError('wrapperArray.wrappers is read-only'); }
  });
  // $FlowIgnore
  Object.defineProperty(this, 'length', {
    get: function () { return length; },
    set: function () { return util.throwError('wrapperArray.length is read-only'); }
  });
};

WrapperArray.prototype.at = function at (index) {
  if (index > this.length - 1) {
    util.throwError(("no item exists at " + index));
  }
  return this.wrappers[index]
};

WrapperArray.prototype.attributes = function attributes () {
  this.throwErrorIfWrappersIsEmpty('attributes');

  util.throwError(
    "attributes must be called on a single wrapper, use " +
      "at(i) to access a wrapper"
  );
};

WrapperArray.prototype.classes = function classes () {
  this.throwErrorIfWrappersIsEmpty('classes');

  util.throwError(
    "classes must be called on a single wrapper, use " +
      "at(i) to access a wrapper"
  );
};

WrapperArray.prototype.contains = function contains (selector) {
  this.throwErrorIfWrappersIsEmpty('contains');

  return this.wrappers.every(function (wrapper) { return wrapper.contains(selector); })
};

WrapperArray.prototype.exists = function exists () {
  return this.length > 0 && this.wrappers.every(function (wrapper) { return wrapper.exists(); })
};

WrapperArray.prototype.filter = function filter (predicate) {
  return new WrapperArray(this.wrappers.filter(predicate))
};

WrapperArray.prototype.visible = function visible () {
  this.throwErrorIfWrappersIsEmpty('visible');

  return this.length > 0 && this.wrappers.every(function (wrapper) { return wrapper.visible(); })
};

WrapperArray.prototype.emitted = function emitted () {
  this.throwErrorIfWrappersIsEmpty('emitted');

  util.throwError(
    "emitted must be called on a single wrapper, use " +
      "at(i) to access a wrapper"
  );
};

WrapperArray.prototype.emittedByOrder = function emittedByOrder () {
  this.throwErrorIfWrappersIsEmpty('emittedByOrder');

  util.throwError(
    "emittedByOrder must be called on a single wrapper, " +
      "use at(i) to access a wrapper"
  );
};

WrapperArray.prototype.hasAttribute = function hasAttribute (attribute, value) {
  this.throwErrorIfWrappersIsEmpty('hasAttribute');

  return this.wrappers.every(function (wrapper) { return wrapper.hasAttribute(attribute, value); }
  )
};

WrapperArray.prototype.hasClass = function hasClass (className) {
  this.throwErrorIfWrappersIsEmpty('hasClass');

  return this.wrappers.every(function (wrapper) { return wrapper.hasClass(className); })
};

WrapperArray.prototype.hasProp = function hasProp (prop, value) {
  this.throwErrorIfWrappersIsEmpty('hasProp');

  return this.wrappers.every(function (wrapper) { return wrapper.hasProp(prop, value); })
};

WrapperArray.prototype.hasStyle = function hasStyle (style, value) {
  this.throwErrorIfWrappersIsEmpty('hasStyle');

  return this.wrappers.every(function (wrapper) { return wrapper.hasStyle(style, value); })
};

WrapperArray.prototype.findAll = function findAll () {
  this.throwErrorIfWrappersIsEmpty('findAll');

  util.throwError(
    "findAll must be called on a single wrapper, use " +
      "at(i) to access a wrapper"
  );
};

WrapperArray.prototype.find = function find () {
  this.throwErrorIfWrappersIsEmpty('find');

  util.throwError(
    "find must be called on a single wrapper, use at(i) " +
      "to access a wrapper"
  );
};

WrapperArray.prototype.html = function html () {
  this.throwErrorIfWrappersIsEmpty('html');

  util.throwError(
    "html must be called on a single wrapper, use at(i) " +
      "to access a wrapper"
  );
};

WrapperArray.prototype.is = function is (selector) {
  this.throwErrorIfWrappersIsEmpty('is');

  return this.wrappers.every(function (wrapper) { return wrapper.is(selector); })
};

WrapperArray.prototype.isEmpty = function isEmpty () {
  this.throwErrorIfWrappersIsEmpty('isEmpty');

  return this.wrappers.every(function (wrapper) { return wrapper.isEmpty(); })
};

WrapperArray.prototype.isVisible = function isVisible () {
  this.throwErrorIfWrappersIsEmpty('isVisible');

  return this.wrappers.every(function (wrapper) { return wrapper.isVisible(); })
};

WrapperArray.prototype.isVueInstance = function isVueInstance () {
  this.throwErrorIfWrappersIsEmpty('isVueInstance');

  return this.wrappers.every(function (wrapper) { return wrapper.isVueInstance(); })
};

WrapperArray.prototype.name = function name () {
  this.throwErrorIfWrappersIsEmpty('name');

  util.throwError(
    "name must be called on a single wrapper, use at(i) " +
      "to access a wrapper"
  );
};

WrapperArray.prototype.props = function props () {
  this.throwErrorIfWrappersIsEmpty('props');

  util.throwError(
    "props must be called on a single wrapper, use " +
      "at(i) to access a wrapper"
  );
};

WrapperArray.prototype.text = function text () {
  this.throwErrorIfWrappersIsEmpty('text');

  util.throwError(
    "text must be called on a single wrapper, use at(i) " +
      "to access a wrapper"
  );
};

WrapperArray.prototype.throwErrorIfWrappersIsEmpty = function throwErrorIfWrappersIsEmpty (method) {
  if (this.wrappers.length === 0) {
    util.throwError((method + " cannot be called on 0 items"));
  }
};

WrapperArray.prototype.setComputed = function setComputed (computed) {
  this.throwErrorIfWrappersIsEmpty('setComputed');

  this.wrappers.forEach(function (wrapper) { return wrapper.setComputed(computed); });
};

WrapperArray.prototype.setData = function setData (data) {
  this.throwErrorIfWrappersIsEmpty('setData');

  this.wrappers.forEach(function (wrapper) { return wrapper.setData(data); });
};

WrapperArray.prototype.setMethods = function setMethods (props) {
  this.throwErrorIfWrappersIsEmpty('setMethods');

  this.wrappers.forEach(function (wrapper) { return wrapper.setMethods(props); });
};

WrapperArray.prototype.setProps = function setProps (props) {
  this.throwErrorIfWrappersIsEmpty('setProps');

  this.wrappers.forEach(function (wrapper) { return wrapper.setProps(props); });
};

WrapperArray.prototype.setValue = function setValue (value) {
  this.throwErrorIfWrappersIsEmpty('setValue');

  this.wrappers.forEach(function (wrapper) { return wrapper.setValue(value); });
};

WrapperArray.prototype.setChecked = function setChecked (checked) {
    if ( checked === void 0 ) checked = true;

  this.throwErrorIfWrappersIsEmpty('setChecked');

  this.wrappers.forEach(function (wrapper) { return wrapper.setChecked(checked); });
};

WrapperArray.prototype.setSelected = function setSelected () {
  this.throwErrorIfWrappersIsEmpty('setSelected');

  util.throwError(
    "setSelected must be called on a single wrapper, " +
      "use at(i) to access a wrapper"
  );
};

WrapperArray.prototype.trigger = function trigger (event, options) {
  this.throwErrorIfWrappersIsEmpty('trigger');

  this.wrappers.forEach(function (wrapper) { return wrapper.trigger(event, options); });
};

WrapperArray.prototype.update = function update () {
  this.throwErrorIfWrappersIsEmpty('update');
  util.warn(
    "update has been removed. All changes are now " +
      "synchrnous without calling update"
  );
};

WrapperArray.prototype.destroy = function destroy () {
  this.throwErrorIfWrappersIsEmpty('destroy');

  this.wrappers.forEach(function (wrapper) { return wrapper.destroy(); });
};

// 

var ErrorWrapper = function ErrorWrapper (selector) {
  this.selector = selector;
};

ErrorWrapper.prototype.at = function at () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call at() on empty Wrapper")
  );
};

ErrorWrapper.prototype.attributes = function attributes () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call attributes() on empty Wrapper")
  );
};

ErrorWrapper.prototype.classes = function classes () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call classes() on empty Wrapper")
  );
};

ErrorWrapper.prototype.contains = function contains () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call contains() on empty Wrapper")
  );
};

ErrorWrapper.prototype.emitted = function emitted () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call emitted() on empty Wrapper")
  );
};

ErrorWrapper.prototype.emittedByOrder = function emittedByOrder () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call emittedByOrder() on empty Wrapper")
  );
};

ErrorWrapper.prototype.exists = function exists () {
  return false
};

ErrorWrapper.prototype.filter = function filter () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call filter() on empty Wrapper")
  );
};

ErrorWrapper.prototype.visible = function visible () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call visible() on empty Wrapper")
  );
};

ErrorWrapper.prototype.hasAttribute = function hasAttribute () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call hasAttribute() on empty Wrapper")
  );
};

ErrorWrapper.prototype.hasClass = function hasClass () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call hasClass() on empty Wrapper")
  );
};

ErrorWrapper.prototype.hasProp = function hasProp () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call hasProp() on empty Wrapper")
  );
};

ErrorWrapper.prototype.hasStyle = function hasStyle () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call hasStyle() on empty Wrapper")
  );
};

ErrorWrapper.prototype.findAll = function findAll () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call findAll() on empty Wrapper")
  );
};

ErrorWrapper.prototype.find = function find () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call find() on empty Wrapper")
  );
};

ErrorWrapper.prototype.html = function html () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call html() on empty Wrapper")
  );
};

ErrorWrapper.prototype.is = function is () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call is() on empty Wrapper")
  );
};

ErrorWrapper.prototype.isEmpty = function isEmpty () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call isEmpty() on empty Wrapper")
  );
};

ErrorWrapper.prototype.isVisible = function isVisible () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call isVisible() on empty Wrapper")
  );
};

ErrorWrapper.prototype.isVueInstance = function isVueInstance () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call isVueInstance() on empty Wrapper")
  );
};

ErrorWrapper.prototype.name = function name () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call name() on empty Wrapper")
  );
};

ErrorWrapper.prototype.props = function props () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call props() on empty Wrapper")
  );
};

ErrorWrapper.prototype.text = function text () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call text() on empty Wrapper")
  );
};

ErrorWrapper.prototype.setComputed = function setComputed () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call setComputed() on empty Wrapper")
  );
};

ErrorWrapper.prototype.setData = function setData () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call setData() on empty Wrapper")
  );
};

ErrorWrapper.prototype.setMethods = function setMethods () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call setMethods() on empty Wrapper")
  );
};

ErrorWrapper.prototype.setProps = function setProps () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call setProps() on empty Wrapper")
  );
};

ErrorWrapper.prototype.setValue = function setValue () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call setValue() on empty Wrapper")
  );
};

ErrorWrapper.prototype.setChecked = function setChecked () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call setChecked() on empty Wrapper")
  );
};

ErrorWrapper.prototype.setSelected = function setSelected () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call setSelected() on empty Wrapper")
  );
};

ErrorWrapper.prototype.trigger = function trigger () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call trigger() on empty Wrapper")
  );
};

ErrorWrapper.prototype.update = function update () {
  util.throwError(
    "update has been removed from vue-test-utils." +
    "All updates are now synchronous by default"
  );
};

ErrorWrapper.prototype.destroy = function destroy () {
  util.throwError(
    ("find did not return " + (this.selector) + ", cannot call destroy() on empty Wrapper")
  );
};

// 

function findAllVNodes (vnode, nodes) {
  if ( nodes === void 0 ) nodes = [];

  nodes.push(vnode);

  if (Array.isArray(vnode.children)) {
    vnode.children.forEach(function (childVNode) {
      findAllVNodes(childVNode, nodes);
    });
  }

  if (vnode.child) {
    findAllVNodes(vnode.child._vnode, nodes);
  }

  return nodes
}

function removeDuplicateNodes (vNodes) {
  var vNodeElms = vNodes.map(function (vNode) { return vNode.elm; });
  return vNodes.filter(
    function (vNode, index) { return index === vNodeElms.indexOf(vNode.elm); }
  )
}

function nodeMatchesRef (node, refName) {
  return node.data && node.data.ref === refName
}

function findVNodesByRef (vNode, refName) {
  var nodes = findAllVNodes(vNode);
  var refFilteredNodes = nodes.filter(function (node) { return nodeMatchesRef(node, refName); });
  // Only return refs defined on top-level VNode to provide the same
  // behavior as selecting via vm.$ref.{someRefName}
  var mainVNodeFilteredNodes = refFilteredNodes.filter(
    function (node) { return !!vNode.context.$refs[node.data.ref]; }
  );
  return removeDuplicateNodes(mainVNodeFilteredNodes)
}

function nodeMatchesSelector (node, selector) {
  return node.elm && node.elm.getAttribute && node.elm.matches(selector)
}

function findVNodesBySelector (vNode, selector) {
  var nodes = findAllVNodes(vNode);
  var filteredNodes = nodes.filter(function (node) { return nodeMatchesSelector(node, selector); }
  );
  return removeDuplicateNodes(filteredNodes)
}

function findVnodes (
  vnode,
  vm,
  selectorType,
  selector
) {
  if (selectorType === REF_SELECTOR) {
    if (!vm) {
      util.throwError(
        "$ref selectors can only be used on Vue component " + "wrappers"
      );
    }
    // $FlowIgnore
    return findVNodesByRef(vnode, selector.ref)
  }
  // $FlowIgnore
  return findVNodesBySelector(vnode, selector)
}

// 

function findDOMNodes (
  element,
  selector
) {
  var nodes = [];
  if (!element || !element.querySelectorAll || !element.matches) {
    return nodes
  }

  if (element.matches(selector)) {
    nodes.push(element);
  }
  // $FlowIgnore
  return nodes.concat([].slice.call(element.querySelectorAll(selector)))
}

// 

function find (
  vm,
  vnode,
  element,
  selector
) {
  var selectorType = getSelectorTypeOrThrow(selector, 'find');

  if (!vnode && !vm && selectorType !== DOM_SELECTOR) {
    util.throwError(
      "cannot find a Vue instance on a DOM node. The node " +
        "you are calling find on does not exist in the " +
        "VDom. Are you adding the node as innerHTML?"
    );
  }

  if (selectorType === COMPONENT_SELECTOR || selectorType === NAME_SELECTOR) {
    var root = vm || vnode;
    if (!root) {
      return []
    }
    return findVueComponents(root, selectorType, selector)
  }

  if (
    vm &&
    vm.$refs &&
    selector.ref in vm.$refs &&
    vm.$refs[selector.ref] instanceof Vue
  ) {
    return [vm.$refs[selector.ref]]
  }

  if (vnode) {
    var nodes = findVnodes(vnode, vm, selectorType, selector);
    if (selectorType !== DOM_SELECTOR) {
      return nodes
    }
    return nodes.length > 0 ? nodes : findDOMNodes(element, selector)
  }

  return findDOMNodes(element, selector)
}

// 

function createWrapper (
  node,
  options
) {
  var componentInstance = node.componentInstance || node.child;
  if (componentInstance) {
    return new VueWrapper(componentInstance, options)
  }
  return node instanceof Vue
    ? new VueWrapper(node, options)
    : new Wrapper(node, options)
}

// 

var i = 0;

function orderDeps (watcher) {
  watcher.deps.forEach(function (dep) {
    if (dep._sortedId === i) {
      return
    }
    dep._sortedId = i;
    dep.subs.forEach(orderDeps);
    dep.subs = dep.subs.sort(function (a, b) { return a.id - b.id; });
  });
}

function orderVmWatchers (vm) {
  if (vm._watchers) {
    vm._watchers.forEach(orderDeps);
  }

  if (vm._computedWatchers) {
    Object.keys(vm._computedWatchers).forEach(function (computedWatcher) {
      orderDeps(vm._computedWatchers[computedWatcher]);
    });
  }

  vm._watcher && orderDeps(vm._watcher);

  vm.$children.forEach(orderVmWatchers);
}

function orderWatchers (vm) {
  orderVmWatchers(vm);
  i++;
}

// 

var Wrapper = function Wrapper (
  node,
  options,
  isVueWrapper
) {
  var vnode = node instanceof Element ? null : node;
  var element = node instanceof Element ? node : node.elm;
  // Prevent redefine by VueWrapper
  if (!isVueWrapper) {
    // $FlowIgnore
    Object.defineProperty(this, 'vnode', {
      get: function () { return vnode; },
      set: function () { return util.throwError('wrapper.vnode is read-only'); }
    });
    // $FlowIgnore
    Object.defineProperty(this, 'element', {
      get: function () { return element; },
      set: function () { return util.throwError('wrapper.element is read-only'); }
    });
    // $FlowIgnore
    Object.defineProperty(this, 'vm', {
      get: function () { return undefined; },
      set: function () { return util.throwError('wrapper.vm is read-only'); }
    });
  }
  var frozenOptions = Object.freeze(options);
  // $FlowIgnore
  Object.defineProperty(this, 'options', {
    get: function () { return frozenOptions; },
    set: function () { return util.throwError('wrapper.options is read-only'); }
  });
  if (
    this.vnode &&
    (this.vnode[FUNCTIONAL_OPTIONS] || this.vnode.functionalContext)
  ) {
    this.isFunctionalComponent = true;
  }
  this.version = Number(
    ((Vue.version.split('.')[0]) + "." + (Vue.version.split('.')[1]))
  );
};

Wrapper.prototype.at = function at () {
  util.throwError('at() must be called on a WrapperArray');
};

/**
 * Returns an Object containing all the attribute/value pairs on the element.
 */
Wrapper.prototype.attributes = function attributes () {
  var attributes = this.element.attributes;
  var attributeMap = {};
  for (var i = 0; i < attributes.length; i++) {
    var att = attributes.item(i);
    attributeMap[att.localName] = att.value;
  }
  return attributeMap
};

/**
 * Returns an Array containing all the classes on the element
 */
Wrapper.prototype.classes = function classes () {
    var this$1 = this;

  var className = this.element.getAttribute('class');
  var classes = className ? className.split(' ') : [];
  // Handle converting cssmodules identifiers back to the original class name
  if (this.vm && this.vm.$style) {
    var cssModuleIdentifiers = {};
    var moduleIdent;
    Object.keys(this.vm.$style).forEach(function (key) {
      moduleIdent = this$1.vm && this$1.vm.$style[key];
      // CSS Modules may be multi-class if they extend others.
      // Extended classes should be already present in $style.
      if (moduleIdent) {
        moduleIdent = moduleIdent.split(' ')[0];
        cssModuleIdentifiers[moduleIdent] = key;
      }
    });
    classes = classes.map(
      function (className) { return cssModuleIdentifiers[className] || className; }
    );
  }
  return classes
};

/**
 * Checks if wrapper contains provided selector.
 */
Wrapper.prototype.contains = function contains (selector) {
  var selectorType = getSelectorTypeOrThrow(selector, 'contains');
  var nodes = find(this.vm, this.vnode, this.element, selector);
  var is = selectorType === REF_SELECTOR ? false : this.is(selector);
  return nodes.length > 0 || is
};

/**
 * Returns an object containing custom events emitted by the Wrapper vm
 */
Wrapper.prototype.emitted = function emitted (
  event
) {
  if (!this._emitted && !this.vm) {
    util.throwError("wrapper.emitted() can only be called on a Vue instance");
  }
  if (event) {
    return this._emitted[event]
  }
  return this._emitted
};

/**
 * Returns an Array containing custom events emitted by the Wrapper vm
 */
Wrapper.prototype.emittedByOrder = function emittedByOrder () {
  if (!this._emittedByOrder && !this.vm) {
    util.throwError(
      "wrapper.emittedByOrder() can only be called on a Vue instance"
    );
  }
  return this._emittedByOrder
};

/**
 * Utility to check wrapper exists. Returns true as Wrapper always exists
 */
Wrapper.prototype.exists = function exists () {
  if (this.vm) {
    return !!this.vm && !this.vm._isDestroyed
  }
  return true
};

Wrapper.prototype.filter = function filter () {
  util.throwError('filter() must be called on a WrapperArray');
};

/**
 * Utility to check wrapper is visible. Returns false if a parent
 * element has display: none or visibility: hidden style.
 */
Wrapper.prototype.visible = function visible () {
  util.warn(
    "visible has been deprecated and will be removed in " +
      "version 1, use isVisible instead"
  );
  var element = this.element;
  while (element) {
    if (
      element.style &&
      (element.style.visibility === 'hidden' ||
        element.style.display === 'none')
    ) {
      return false
    }
    element = element.parentElement;
  }

  return true
};

/**
 * Checks if wrapper has an attribute with matching value
 */
Wrapper.prototype.hasAttribute = function hasAttribute (attribute, value) {
  util.warn(
    "hasAttribute() has been deprecated and will be " +
    "removed in version 1.0.0. Use attributes() " +
    "instead—https://vue-test-utils.vuejs.org/api/wrapper/#attributes"
  );

  if (typeof attribute !== 'string') {
    util.throwError(
      "wrapper.hasAttribute() must be passed attribute as a string"
    );
  }

  if (typeof value !== 'string') {
    util.throwError(
      "wrapper.hasAttribute() must be passed value as a string"
    );
  }

  return !!(this.element.getAttribute(attribute) === value)
};

/**
 * Asserts wrapper has a class name
 */
Wrapper.prototype.hasClass = function hasClass (className) {
    var this$1 = this;

  util.warn(
    "hasClass() has been deprecated and will be removed " +
    "in version 1.0.0. Use classes() " +
    "instead—https://vue-test-utils.vuejs.org/api/wrapper/#classes"
  );
  var targetClass = className;

  if (typeof targetClass !== 'string') {
    util.throwError('wrapper.hasClass() must be passed a string');
  }

  // if $style is available and has a matching target, use that instead.
  if (this.vm && this.vm.$style && this.vm.$style[targetClass]) {
    targetClass = this.vm.$style[targetClass];
  }

  var containsAllClasses = targetClass
    .split(' ')
    .every(function (target) { return this$1.element.classList.contains(target); });

  return !!(this.element && containsAllClasses)
};

/**
 * Asserts wrapper has a prop name
 */
Wrapper.prototype.hasProp = function hasProp (prop, value) {
  util.warn(
    "hasProp() has been deprecated and will be removed " +
    "in version 1.0.0. Use props() " +
    "instead—https://vue-test-utils.vuejs.org/api/wrapper/#props"
  );

  if (!this.isVueInstance()) {
    util.throwError('wrapper.hasProp() must be called on a Vue instance');
  }
  if (typeof prop !== 'string') {
    util.throwError('wrapper.hasProp() must be passed prop as a string');
  }

  // $props object does not exist in Vue 2.1.x, so use
  // $options.propsData instead
  if (
    this.vm &&
    this.vm.$options &&
    this.vm.$options.propsData &&
    this.vm.$options.propsData[prop] === value
  ) {
    return true
  }

  return !!this.vm && !!this.vm.$props && this.vm.$props[prop] === value
};

/**
 * Checks if wrapper has a style with value
 */
Wrapper.prototype.hasStyle = function hasStyle (style, value) {
  util.warn(
    "hasStyle() has been deprecated and will be removed " +
    "in version 1.0.0. Use wrapper.element.style " +
    "instead"
  );

  if (typeof style !== 'string') {
    util.throwError("wrapper.hasStyle() must be passed style as a string");
  }

  if (typeof value !== 'string') {
    util.throwError('wrapper.hasClass() must be passed value as string');
  }

  /* istanbul ignore next */
  if (
    navigator.userAgent.includes &&
    (navigator.userAgent.includes('node.js') ||
      navigator.userAgent.includes('jsdom'))
  ) {
    util.warn(
      "wrapper.hasStyle is not fully supported when " +
      "running jsdom - only inline styles are supported"
    );
  }
  var body = document.querySelector('body');
  var mockElement = document.createElement('div');

  if (!(body instanceof Element)) {
    return false
  }
  var mockNode = body.insertBefore(mockElement, null);
  // $FlowIgnore : Flow thinks style[style] returns a number
  mockElement.style[style] = value;

  if (!this.options.attachedToDocument && (this.vm || this.vnode)) {
    // $FlowIgnore : Possible null value, will be removed in 1.0.0
    var vm = this.vm || this.vnode.context.$root;
    body.insertBefore(vm.$root._vnode.elm, null);
  }

  var elStyle = window.getComputedStyle(this.element)[style];
  var mockNodeStyle = window.getComputedStyle(mockNode)[style];
  return !!(elStyle && mockNodeStyle && elStyle === mockNodeStyle)
};

/**
 * Finds first node in tree of the current wrapper that
 * matches the provided selector.
 */
Wrapper.prototype.find = function find$$1 (selector) {
  var nodes = find(this.vm, this.vnode, this.element, selector);
  if (nodes.length === 0) {
    if (selector.ref) {
      return new ErrorWrapper(("ref=\"" + (selector.ref) + "\""))
    }
    return new ErrorWrapper(
      typeof selector === 'string' ? selector : 'Component'
    )
  }
  // Using CSS Selector, returns a VueWrapper instance if the root element
  // binds a Vue instance.
  if (nodes[0].elm === this.element) {
    return this
  }
  return createWrapper(nodes[0], this.options)
};

/**
 * Finds node in tree of the current wrapper that matches
 * the provided selector.
 */
Wrapper.prototype.findAll = function findAll$1 (selector) {
    var this$1 = this;

  getSelectorTypeOrThrow(selector, 'findAll');
  var nodes = find(this.vm, this.vnode, this.element, selector);
  var wrappers = nodes.map(function (node) {
    // Using CSS Selector, returns a VueWrapper instance if the root element
    // binds a Vue instance.
    return node.elm === this$1.element
      ? this$1
      : createWrapper(node, this$1.options)
  });
  return new WrapperArray(wrappers)
};

/**
 * Returns HTML of element as a string
 */
Wrapper.prototype.html = function html () {
  return this.element.outerHTML
};

/**
 * Checks if node matches selector
 */
Wrapper.prototype.is = function is (selector) {
  var selectorType = getSelectorTypeOrThrow(selector, 'is');

  if (selectorType === NAME_SELECTOR) {
    if (!this.vm) {
      return false
    }
    return vmCtorMatchesName(this.vm, selector.name)
  }

  if (selectorType === COMPONENT_SELECTOR) {
    if (!this.vm) {
      return false
    }
    if (selector.functional) {
      return vmFunctionalCtorMatchesSelector(this.vm._vnode, selector._Ctor)
    }
    return vmCtorMatchesSelector(this.vm, selector)
  }

  if (selectorType === REF_SELECTOR) {
    util.throwError('$ref selectors can not be used with wrapper.is()');
  }

  if (typeof selector === 'object') {
    return false
  }

  return !!(
    this.element.getAttribute &&
    this.element.matches(selector)
  )
};

/**
 * Checks if node is empty
 */
Wrapper.prototype.isEmpty = function isEmpty () {
  if (!this.vnode) {
    return this.element.innerHTML === ''
  }
  if (this.vnode.children) {
    return this.vnode.children.every(function (vnode) { return vnode.isComment; })
  }
  return (
    this.vnode.children === undefined || this.vnode.children.length === 0
  )
};

/**
 * Checks if node is visible
 */
Wrapper.prototype.isVisible = function isVisible () {
  var element = this.element;
  while (element) {
    if (
      element.style &&
      (element.style.visibility === 'hidden' ||
        element.style.display === 'none')
    ) {
      return false
    }
    element = element.parentElement;
  }

  return true
};

/**
 * Checks if wrapper is a vue instance
 */
Wrapper.prototype.isVueInstance = function isVueInstance () {
  return !!this.vm
};

/**
 * Returns name of component, or tag name if node is not a Vue component
 */
Wrapper.prototype.name = function name () {
  if (this.vm) {
    return this.vm.$options.name
  }

  if (!this.vnode) {
    return this.element.tagName
  }

  return this.vnode.tag
};

/**
 * Returns an Object containing the prop name/value pairs on the element
 */
Wrapper.prototype.props = function props () {
    var this$1 = this;

  if (this.isFunctionalComponent) {
    util.throwError(
      "wrapper.props() cannot be called on a mounted " +
        "functional component."
    );
  }
  if (!this.vm) {
    util.throwError('wrapper.props() must be called on a Vue instance');
  }

  var props = {};
  var keys = this.vm && this.vm.$options._propKeys;

  if (keys) {
    keys.forEach(function (key) {
      if (this$1.vm) {
        props[key] = this$1.vm[key];
      }
    });
  }
  return props
};

/**
 * Sets vm data
 */
Wrapper.prototype.setData = function setData (data) {
    var this$1 = this;

  if (this.isFunctionalComponent) {
    util.throwError(
      "wrapper.setData() cannot be called on a functional " +
      "component"
    );
  }

  if (!this.vm) {
    util.throwError(
      "wrapper.setData() can only be called on a Vue " +
      "instance"
    );
  }

  Object.keys(data).forEach(function (key) {
    if (
      typeof data[key] === 'object' &&
      data[key] !== null &&
      !Array.isArray(data[key])
    ) {
      var newObj = mergeWith_1(
        // $FlowIgnore : Problem with possibly null this.vm
        this$1.vm[key],
        data[key],
        function (objValue, srcValue) {
          return Array.isArray(srcValue) ? srcValue : undefined
        }
      );
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm.$set(this$1.vm, [key], newObj);
    } else {
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm.$set(this$1.vm, [key], data[key]);
    }
  });
};

/**
 * Sets vm computed
 */
Wrapper.prototype.setComputed = function setComputed (computed) {
    var this$1 = this;

  if (!this.isVueInstance()) {
    util.throwError(
      "wrapper.setComputed() can only be called on a Vue " +
      "instance"
    );
  }

  util.warn(
    "setComputed() has been deprecated and will be " +
      "removed in version 1.0.0. You can overwrite " +
      "computed properties by passing a computed object " +
      "in the mounting options"
  );

  Object.keys(computed).forEach(function (key) {
    if (this$1.version > 2.1) {
      // $FlowIgnore : Problem with possibly null this.vm
      if (!this$1.vm._computedWatchers[key]) {
        util.throwError(
          "wrapper.setComputed() was passed a value that " +
          "does not exist as a computed property on the " +
          "Vue instance. Property " + key + " does not exist " +
          "on the Vue instance"
        );
      }
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm._computedWatchers[key].value = computed[key];
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm._computedWatchers[key].getter = function () { return computed[key]; };
    } else {
      var isStore = false;
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm._watchers.forEach(function (watcher) {
        if (watcher.getter.vuex && key in watcher.vm.$options.store.getters) {
          watcher.vm.$options.store.getters = Object.assign({}, watcher.vm.$options.store.getters);
          Object.defineProperty(watcher.vm.$options.store.getters, key, {
            get: function () {
              return computed[key]
            }
          });
          isStore = true;
        }
      });

      // $FlowIgnore : Problem with possibly null this.vm
      if (!isStore && !this$1.vm._watchers.some(function (w) { return w.getter.name === key; })) {
        util.throwError(
          "wrapper.setComputed() was passed a value that does " +
          "not exist as a computed property on the Vue instance. " +
          "Property " + key + " does not exist on the Vue instance"
        );
      }
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm._watchers.forEach(function (watcher) {
        if (watcher.getter.name === key) {
          watcher.value = computed[key];
          watcher.getter = function () { return computed[key]; };
        }
      });
    }
  });
  // $FlowIgnore : Problem with possibly null this.vm
  this.vm._watchers.forEach(function (watcher) {
    watcher.run();
  });
};

/**
 * Sets vm methods
 */
Wrapper.prototype.setMethods = function setMethods (methods) {
    var this$1 = this;

  if (!this.isVueInstance()) {
    util.throwError(
      "wrapper.setMethods() can only be called on a Vue " +
      "instance"
    );
  }
  Object.keys(methods).forEach(function (key) {
    // $FlowIgnore : Problem with possibly null this.vm
    this$1.vm[key] = methods[key];
    // $FlowIgnore : Problem with possibly null this.vm
    this$1.vm.$options.methods[key] = methods[key];
  });

  if (this.vnode) {
    var context = this.vnode.context;
    if (context.$options.render) { context._update(context._render()); }
  }
};

/**
 * Sets vm props
 */
Wrapper.prototype.setProps = function setProps (data) {
    var this$1 = this;

  var originalConfig = Vue.config.silent;
  Vue.config.silent = config.silent;
  if (this.isFunctionalComponent) {
    util.throwError(
      "wrapper.setProps() cannot be called on a " +
      "functional component"
    );
  }
  if (!this.vm) {
    util.throwError(
      "wrapper.setProps() can only be called on a Vue " +
      "instance"
    );
  }

  Object.keys(data).forEach(function (key) {
    if (
      !this$1.vm ||
      !this$1.vm.$options._propKeys ||
      !this$1.vm.$options._propKeys.some(function (prop) { return prop === key; })
    ) {
      util.throwError(
        "wrapper.setProps() called with " + key + " property which " +
        "is not defined on the component"
      );
    }
    if (
      typeof data[key] === 'object' &&
      data[key] !== null &&
      // $FlowIgnore : Problem with possibly null this.vm
      data[key] === this$1.vm[key]
    ) {
      util.throwError(
        "wrapper.setProps() called with the same object " +
        "of the existing " + key + " property. " +
        "You must call wrapper.setProps() with a new object " +
        "to trigger reactivity"
      );
    }

    if (this$1.vm && this$1.vm._props) {
      this$1.vm._props[key] = data[key];
    } else {
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm[key] = data[key];
      // $FlowIgnore : Problem with possibly null this.vm.$options
      this$1.vm.$options.propsData[key] = data[key];
    }
  });
  // $FlowIgnore : Problem with possibly null this.vm
  this.vm.$forceUpdate();
  // $FlowIgnore : Problem with possibly null this.vm
  orderWatchers(this.vm || this.vnode.context.$root);
  Vue.config.silent = originalConfig;
};

/**
 * Sets element value and triggers input event
 */
Wrapper.prototype.setValue = function setValue (value) {
  var tagName = this.element.tagName;
  var type = this.attributes().type;

  if (tagName === 'SELECT') {
    util.throwError(
      "wrapper.setValue() cannot be called on a <select> " +
        "element. Use wrapper.setSelected() instead"
    );
  } else if (tagName === 'INPUT' && type === 'checkbox') {
    util.throwError(
      "wrapper.setValue() cannot be called on a <input " +
        "type=\"checkbox\" /> element. Use " +
        "wrapper.setChecked() instead"
    );
  } else if (tagName === 'INPUT' && type === 'radio') {
    util.throwError(
      "wrapper.setValue() cannot be called on a <input " +
        "type=\"radio\" /> element. Use wrapper.setChecked() " +
        "instead"
    );
  } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
    // $FlowIgnore
    this.element.value = value;
    this.trigger('input');
  } else {
    util.throwError("wrapper.setValue() cannot be called on this element");
  }
};

/**
 * Checks radio button or checkbox element
 */
Wrapper.prototype.setChecked = function setChecked (checked) {
    if ( checked === void 0 ) checked = true;

  if (typeof checked !== 'boolean') {
    util.throwError('wrapper.setChecked() must be passed a boolean');
  }
  var tagName = this.element.tagName;
  var type = this.attributes().type;

  if (tagName === 'SELECT') {
    util.throwError(
      "wrapper.setChecked() cannot be called on a " +
        "<select> element. Use wrapper.setSelected() " +
        "instead"
    );
  } else if (tagName === 'INPUT' && type === 'checkbox') {
    // $FlowIgnore
    if (this.element.checked !== checked) {
      if (!navigator.userAgent.includes('jsdom')) {
        // $FlowIgnore
        this.element.checked = checked;
      }
      this.trigger('click');
      this.trigger('change');
    }
  } else if (tagName === 'INPUT' && type === 'radio') {
    if (!checked) {
      util.throwError(
        "wrapper.setChecked() cannot be called with " +
          "parameter false on a <input type=\"radio\" /> " +
          "element."
      );
    } else {
      // $FlowIgnore
      if (!this.element.checked) {
        this.trigger('click');
        this.trigger('change');
      }
    }
  } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
    util.throwError(
      "wrapper.setChecked() cannot be called on \"text\" " +
        "inputs. Use wrapper.setValue() instead"
    );
  } else {
    util.throwError("wrapper.setChecked() cannot be called on this element");
  }
};

/**
 * Selects <option></option> element
 */
Wrapper.prototype.setSelected = function setSelected () {
  var tagName = this.element.tagName;
  var type = this.attributes().type;

  if (tagName === 'OPTION') {
    // $FlowIgnore
    this.element.selected = true;
    // $FlowIgnore
    if (this.element.parentElement.tagName === 'OPTGROUP') {
      // $FlowIgnore
      createWrapper(this.element.parentElement.parentElement, this.options)
        .trigger('change');
    } else {
      // $FlowIgnore
      createWrapper(this.element.parentElement, this.options)
        .trigger('change');
    }
  } else if (tagName === 'SELECT') {
    util.throwError(
      "wrapper.setSelected() cannot be called on select. " +
        "Call it on one of its options"
    );
  } else if (tagName === 'INPUT' && type === 'checkbox') {
    util.throwError(
      "wrapper.setSelected() cannot be called on a <input " +
        "type=\"checkbox\" /> element. Use " +
        "wrapper.setChecked() instead"
    );
  } else if (tagName === 'INPUT' && type === 'radio') {
    util.throwError(
      "wrapper.setSelected() cannot be called on a <input " +
        "type=\"radio\" /> element. Use wrapper.setChecked() " +
        "instead"
    );
  } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
    util.throwError(
      "wrapper.setSelected() cannot be called on \"text\" " +
        "inputs. Use wrapper.setValue() instead"
    );
  } else {
    util.throwError("wrapper.setSelected() cannot be called on this element");
  }
};

/**
 * Return text of wrapper element
 */
Wrapper.prototype.text = function text () {
  return this.element.textContent.trim()
};

/**
 * Calls destroy on vm
 */
Wrapper.prototype.destroy = function destroy () {
  if (!this.isVueInstance()) {
    util.throwError("wrapper.destroy() can only be called on a Vue instance");
  }

  if (this.element.parentNode) {
    this.element.parentNode.removeChild(this.element);
  }
  // $FlowIgnore
  this.vm.$destroy();
};

/**
 * Dispatches a DOM event on wrapper
 */
Wrapper.prototype.trigger = function trigger (type, options) {
    if ( options === void 0 ) options = {};

  if (typeof type !== 'string') {
    util.throwError('wrapper.trigger() must be passed a string');
  }

  if (options.target) {
    util.throwError(
      "you cannot set the target value of an event. See " +
        "the notes section of the docs for more " +
        "details—https://vue-test-utils.vuejs.org/api/wrapper/trigger.html"
    );
  }

  // Don't fire event on a disabled element
  if (this.attributes().disabled) {
    return
  }

  var modifiers = {
    enter: 13,
    tab: 9,
    delete: 46,
    esc: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    end: 35,
    home: 36,
    backspace: 8,
    insert: 45,
    pageup: 33,
    pagedown: 34
  };

  var event = type.split('.');

  var eventObject;

  // Fallback for IE10,11 - https://stackoverflow.com/questions/26596123
  if (typeof window.Event === 'function') {
    eventObject = new window.Event(event[0], {
      bubbles: true,
      cancelable: true
    });
  } else {
    eventObject = document.createEvent('Event');
    eventObject.initEvent(event[0], true, true);
  }

  if (options) {
    Object.keys(options).forEach(function (key) {
      // $FlowIgnore
      eventObject[key] = options[key];
    });
  }

  if (event.length === 2) {
    // $FlowIgnore
    eventObject.keyCode = modifiers[event[1]];
  }

  this.element.dispatchEvent(eventObject);
  if (this.vnode) {
    orderWatchers(this.vm || this.vnode.context.$root);
  }
};

Wrapper.prototype.update = function update () {
  util.warn(
    "update has been removed from vue-test-utils. All " +
      "updates are now synchronous by default"
  );
};

// 

function setDepsSync (dep) {
  dep.subs.forEach(setWatcherSync);
}

function setWatcherSync (watcher) {
  if (watcher.sync === true) {
    return
  }
  watcher.sync = true;
  watcher.deps.forEach(setDepsSync);
}

function setWatchersToSync (vm) {
  if (vm._watchers) {
    vm._watchers.forEach(setWatcherSync);
  }

  if (vm._computedWatchers) {
    Object.keys(vm._computedWatchers).forEach(function (computedWatcher) {
      setWatcherSync(vm._computedWatchers[computedWatcher]);
    });
  }

  setWatcherSync(vm._watcher);

  vm.$children.forEach(setWatchersToSync);
  // preventing double registration
  if (!vm.$_vueTestUtils_updateInSetWatcherSync) {
    vm.$_vueTestUtils_updateInSetWatcherSync = vm._update;
    vm._update = function (vnode, hydrating) {
      var this$1 = this;

      this.$_vueTestUtils_updateInSetWatcherSync(vnode, hydrating);
      if (VUE_VERSION >= 2.1 && this._isMounted && this.$options.updated) {
        this.$options.updated.forEach(function (handler) {
          handler.call(this$1);
        });
      }
    };
  }
}

// 

var VueWrapper = (function (Wrapper$$1) {
  function VueWrapper (vm, options) {
    Wrapper$$1.call(this, vm._vnode, options, true);

    // $FlowIgnore : issue with defineProperty
    Object.defineProperty(this, 'vnode', {
      get: function () { return vm._vnode; },
      set: function () { return util.throwError('wrapper.vnode is read-only'); }
    });
    // $FlowIgnore
    Object.defineProperty(this, 'element', {
      get: function () { return vm.$el; },
      set: function () { return util.throwError('wrapper.element is read-only'); }
    });
    // $FlowIgnore
    Object.defineProperty(this, 'vm', {
      get: function () { return vm; },
      set: function () { return util.throwError('wrapper.vm is read-only'); }
    });
    if (options.sync) {
      setWatchersToSync(vm);
      orderWatchers(vm);
    }
    this.isFunctionalComponent = vm.$options._isFunctionalContainer;
    this._emitted = vm.__emitted;
    this._emittedByOrder = vm.__emittedByOrder;
  }

  if ( Wrapper$$1 ) VueWrapper.__proto__ = Wrapper$$1;
  VueWrapper.prototype = Object.create( Wrapper$$1 && Wrapper$$1.prototype );
  VueWrapper.prototype.constructor = VueWrapper;

  return VueWrapper;
}(Wrapper));

// 

function createElement () {
  if (document) {
    var elem = document.createElement('div');

    if (document.body) {
      document.body.appendChild(elem);
    }
    return elem
  }
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$11.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$9.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$12 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$12.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
  var result = [];
  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise = _getNative(_root, 'Promise');

var _Promise = Promise;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (_Map && getTag(new _Map) != mapTag$1) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$1) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used for built-in method references. */
var objectProto$13 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$13.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$10.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return _cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return _cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return _cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$3;
}

var _baseIsMap = baseIsMap;

/* Node.js helper references. */
var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

var isMap_1 = isMap;

/** `Object#toString` result references. */
var setTag$3 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$3;
}

var _baseIsSet = baseIsSet;

/* Node.js helper references. */
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

var isSet_1 = isSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$1 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$3] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject_1(value)) {
    return value;
  }
  var isArr = isArray_1(value);
  if (isArr) {
    result = _initCloneArray(value);
    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$3 || tag == argsTag$2 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? _copySymbolsIn(value, _baseAssignIn(result, value))
          : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = _initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet_1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap_1(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn : _getAllKeys)
    : (isFlat ? keysIn : keys_1);

  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
}

var cloneDeep_1 = cloneDeep;

// 

function errorHandler (
  errorOrString,
  vm
) {
  var error =
    typeof errorOrString === 'object'
      ? errorOrString
      : new Error(errorOrString);

  vm._error = error;

  throw error
}

// 

function createLocalVue (_Vue) {
  if ( _Vue === void 0 ) _Vue = Vue;

  var instance = _Vue.extend();

  // clone global APIs
  Object.keys(_Vue).forEach(function (key) {
    if (!instance.hasOwnProperty(key)) {
      var original = _Vue[key];
      instance[key] =
        typeof original === 'object' ? cloneDeep_1(original) : original;
    }
  });

  // config is not enumerable
  instance.config = cloneDeep_1(Vue.config);

  instance.config.errorHandler = errorHandler;

  // option merge strategies need to be exposed by reference
  // so that merge strats registered by plugins can work properly
  instance.config.optionMergeStrategies = Vue.config.optionMergeStrategies;

  // make sure all extends are based on this instance.
  // this is important so that global components registered by plugins,
  // e.g. router-link are created using the correct base constructor
  instance.options._base = instance;

  // compat for vue-router < 2.7.1 where it does not allow multiple installs
  if (instance._installedPlugins && instance._installedPlugins.length) {
    instance._installedPlugins.length = 0;
  }
  var use = instance.use;
  instance.use = function (plugin) {
    var rest = [], len = arguments.length - 1;
    while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

    if (plugin.installed === true) {
      plugin.installed = false;
    }
    if (plugin.install && plugin.install.installed === true) {
      plugin.install.installed = false;
    }
    use.call.apply(use, [ instance, plugin ].concat( rest ));
  };
  return instance
}

// 

Vue.config.productionTip = false;
Vue.config.devtools = false;

function mount (
  component,
  options
) {
  if ( options === void 0 ) options = {};

  var existingErrorHandler = Vue.config.errorHandler;
  Vue.config.errorHandler = errorHandler;

  warnIfNoWindow();

  // Remove cached constructor
  delete component._Ctor;
  var vueConstructor = createLocalVue(options.localVue);

  var elm = options.attachToDocument ? createElement() : undefined;

  var mergedOptions = mergeOptions.mergeOptions(options, config);

  var parentVm = createInstance(
    component,
    mergedOptions,
    vueConstructor,
    elm
  );

  var vm = parentVm.$mount(elm).$refs.vm;

  // Workaround for Vue < 2.5
  vm._staticTrees = [];

  var componentsWithError = findAllVueComponentsFromVm(vm).filter(
    function (c) { return c._error; }
  );

  if (componentsWithError.length > 0) {
    throw componentsWithError[0]._error
  }

  Vue.config.errorHandler = existingErrorHandler;

  var wrapperOptions = {
    attachedToDocument: !!mergedOptions.attachToDocument,
    sync: mergedOptions.sync
  };

  return new VueWrapper(vm, wrapperOptions)
}

// 

function shallowMount (
  component,
  options
) {
  if ( options === void 0 ) options = {};

  var vue = options.localVue || Vue;

  // remove any recursive components added to the constructor
  // in vm._init from previous tests
  if (component.name && component.components) {
    delete component.components[util.capitalize(util.camelize(component.name))];
    delete component.components[util.hyphenate(component.name)];
  }

  return mount(component, Object.assign({}, options,
    {components: Object.assign({}, stubComponents.createComponentStubsForGlobals(vue),
      stubComponents.createComponentStubsForAll(component))}))
}

// 
var toTypes = [String, Object];
var eventTypes = [String, Array];

var RouterLinkStub = {
  name: 'RouterLinkStub',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    return h(this.tag, undefined, this.$slots.default)
  }
}

function shallow (component, options) {
  util.warn(
    "shallow has been renamed to shallowMount. shallow " +
      "will be removed in 1.0.0, use shallowMount instead"
  );
  return shallowMount(component, options)
}

var index = {
  createLocalVue: createLocalVue,
  config: config,
  mount: mount,
  shallow: shallow,
  shallowMount: shallowMount,
  TransitionStub: TransitionStub,
  TransitionGroupStub: TransitionGroupStub,
  RouterLinkStub: RouterLinkStub
}

module.exports = index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLXRlc3QtdXRpbHMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy93YXJuLWlmLW5vLXdpbmRvdy5qcyIsIi4uL3NyYy9tYXRjaGVzLXBvbHlmaWxsLmpzIiwiLi4vc3JjL29iamVjdC1hc3NpZ24tcG9seWZpbGwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVDbGVhci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZXEuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVHZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19MaXN0Q2FjaGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0NsZWFyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tEZWxldGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0dldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrSGFzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzTWFza2VkLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9Tb3VyY2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYXRpdmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRWYWx1ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE5hdGl2ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hDbGVhci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hEZWxldGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoR2V0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hTZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZURlbGV0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlR2V0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVIYXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZVNldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcENhY2hlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tTZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TdGFjay5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2RlZmluZVByb3BlcnR5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduTWVyZ2VWYWx1ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVCdWZmZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19VaW50OEFycmF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVBcnJheUJ1ZmZlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lVHlwZWRBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDcmVhdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UHJvdG90eXBlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2VPYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzUGxhaW5PYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NhZmVHZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NpZ25WYWx1ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlPYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXNJbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzSW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXNJbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9QbGFpbk9iamVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNZXJnZURlZXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWVyZ2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lkZW50aXR5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXBwbHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyUmVzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvY29uc3RhbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2V0VG9TdHJpbmcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zaG9ydE91dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFRvU3RyaW5nLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVJlc3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0l0ZXJhdGVlQ2FsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUFzc2lnbmVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9tZXJnZVdpdGguanMiLCIuLi9zcmMvY29uc3RzLmpzIiwiLi4vc3JjL2dldC1zZWxlY3Rvci10eXBlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNpdGlvblN0dWIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UcmFuc2l0aW9uR3JvdXBTdHViLmpzIiwiLi4vc3JjL2NvbmZpZy5qcyIsIi4uL3NyYy9maW5kLXZ1ZS1jb21wb25lbnRzLmpzIiwiLi4vc3JjL3dyYXBwZXItYXJyYXkuanMiLCIuLi9zcmMvZXJyb3Itd3JhcHBlci5qcyIsIi4uL3NyYy9maW5kLXZub2Rlcy5qcyIsIi4uL3NyYy9maW5kLWRvbS1ub2Rlcy5qcyIsIi4uL3NyYy9maW5kLmpzIiwiLi4vc3JjL2NyZWF0ZS13cmFwcGVyLmpzIiwiLi4vc3JjL29yZGVyLXdhdGNoZXJzLmpzIiwiLi4vc3JjL3dyYXBwZXIuanMiLCIuLi9zcmMvc2V0LXdhdGNoZXJzLXRvLXN5bmMuanMiLCIuLi9zcmMvdnVlLXdyYXBwZXIuanMiLCIuLi9zcmMvY3JlYXRlLWVsZW1lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbkluLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFN5bWJvbHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9scy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UHVzaC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFN5bWJvbHNJbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzSW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0QWxsS2V5cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRBbGxLZXlzSW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZURhdGFWaWV3LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVSZWdFeHAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVN5bWJvbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUJ5VGFnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc01hcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1NldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ2xvbmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoL2Nsb25lRGVlcC5qcyIsIi4uL3NyYy9lcnJvci1oYW5kbGVyLmpzIiwiLi4vc3JjL2NyZWF0ZS1sb2NhbC12dWUuanMiLCIuLi9zcmMvbW91bnQuanMiLCIuLi9zcmMvc2hhbGxvdy1tb3VudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JvdXRlckxpbmtTdHViLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdzaGFyZWQvdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2FybklmTm9XaW5kb3cgKCk6IHZvaWQge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYHdpbmRvdyBpcyB1bmRlZmluZWQsIHZ1ZS10ZXN0LXV0aWxzIG5lZWRzIHRvIGJlIGAgK1xuICAgICAgICBgcnVuIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudC5cbmAgK1xuICAgICAgICAoYFlvdSBjYW4gcnVuIHRoZSB0ZXN0cyBpbiBub2RlIHVzaW5nIGpzZG9tICsgYCArXG4gICAgICAgICAgYGpzZG9tLWdsb2JhbC5cbmApICtcbiAgICAgICAgKGBTZWUgYCArXG4gICAgICAgICAgYGh0dHBzOi8vdnVlLXRlc3QtdXRpbHMudnVlanMub3JnL2d1aWRlcy9jb21tb24tdGlwcy5odG1sIGAgK1xuICAgICAgICAgIGBmb3IgbW9yZSBkZXRhaWxzLmApXG4gICAgKVxuICB9XG59XG4iLCJpZiAodHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmICFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPVxuICAgIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgRWxlbWVudC5wcm90b3R5cGUub01hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxuICAgIGZ1bmN0aW9uIChzKSB7XG4gICAgICBjb25zdCBtYXRjaGVzID0gKHRoaXMuZG9jdW1lbnQgfHwgdGhpcy5vd25lckRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHMpXG4gICAgICBsZXQgaSA9IG1hdGNoZXMubGVuZ3RoXG4gICAgICB3aGlsZSAoLS1pID49IDAgJiYgbWF0Y2hlcy5pdGVtKGkpICE9PSB0aGlzKSB7fVxuICAgICAgcmV0dXJuIGkgPiAtMVxuICAgIH1cbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAoZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5hc3NpZ24gPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAndXNlIHN0cmljdCdcbiAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0JylcbiAgICAgIH1cblxuICAgICAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpXG4gICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XVxuICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkobmV4dEtleSkpIHtcbiAgICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0XG4gICAgfVxuICB9KSgpXG59XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlQ2xlYXI7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlR2V0O1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVIYXM7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVTZXQ7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tEZWxldGU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrSGFzO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRWYWx1ZTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVDcmVhdGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENhY2hlO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tTZXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGFzc2lnblZhbHVlYCBleGNlcHQgdGhhdCBpdCBkb2Vzbid0IGFzc2lnblxuICogYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmICgodmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhZXEob2JqZWN0W2tleV0sIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25NZXJnZVZhbHVlO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcbiIsInZhciBjcmVhdGVCYXNlRm9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlcyBvdmVyIGBvYmplY3RgXG4gKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQnVmZmVyO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gVWludDhBcnJheTtcbiIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lVHlwZWRBcnJheTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRQcm90b3R5cGU7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNBcnJheUxpa2VgIGV4Y2VwdCB0aGF0IGl0IGFsc28gY2hlY2tzIGlmIGB2YWx1ZWBcbiAqIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS1saWtlIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2VPYmplY3Q7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkZhbHNlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gaW5mZXIgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLiAqL1xudmFyIG9iamVjdEN0b3JTdHJpbmcgPSBmdW5jVG9TdHJpbmcuY2FsbChPYmplY3QpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuOC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSB8fCBiYXNlR2V0VGFnKHZhbHVlKSAhPSBvYmplY3RUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gZ2V0UHJvdG90eXBlKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3RvLCAnY29uc3RydWN0b3InKSAmJiBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiZcbiAgICBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUGxhaW5PYmplY3Q7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5hcnk7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICAvLyBVc2UgYHV0aWwudHlwZXNgIGZvciBOb2RlLmpzIDEwKy5cbiAgICB2YXIgdHlwZXMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUucmVxdWlyZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUoJ3V0aWwnKS50eXBlcztcblxuICAgIGlmICh0eXBlcykge1xuICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH1cblxuICAgIC8vIExlZ2FjeSBgcHJvY2Vzcy5iaW5kaW5nKCd1dGlsJylgIGZvciBOb2RlLmpzIDwgMTAuXG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsInZhciBiYXNlSXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fYmFzZUlzVHlwZWRBcnJheScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCwgdW5sZXNzIGBrZXlgIGlzIFwiX19wcm90b19fXCIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzYWZlR2V0KG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBrZXkgPT0gJ19fcHJvdG9fXydcbiAgICA/IHVuZGVmaW5lZFxuICAgIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2FmZUdldDtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyk7XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3Q7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUaW1lcztcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuXG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlID09ICdudW1iZXInIHx8XG4gICAgICAodHlwZSAhPSAnc3ltYm9sJyAmJiByZUlzVWludC50ZXN0KHZhbHVlKSkpICYmXG4gICAgICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuIiwidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUxpa2VLZXlzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5c0luO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzSW4gPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzSW4nKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXNJbihvYmplY3QpO1xuICB9XG4gIHZhciBpc1Byb3RvID0gaXNQcm90b3R5cGUob2JqZWN0KSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5c0luO1xuIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXNJbiA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzSW4nKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCwgdHJ1ZSkgOiBiYXNlS2V5c0luKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5c0luO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgcGxhaW4gb2JqZWN0IGZsYXR0ZW5pbmcgaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nXG4gKiBrZXllZCBwcm9wZXJ0aWVzIG9mIGB2YWx1ZWAgdG8gb3duIHByb3BlcnRpZXMgb2YgdGhlIHBsYWluIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBwbGFpbiBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIG5ldyBGb28pO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgXy50b1BsYWluT2JqZWN0KG5ldyBGb28pKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9XG4gKi9cbmZ1bmN0aW9uIHRvUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3QodmFsdWUsIGtleXNJbih2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGxhaW5PYmplY3Q7XG4iLCJ2YXIgYXNzaWduTWVyZ2VWYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnbk1lcmdlVmFsdWUnKSxcbiAgICBjbG9uZUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQnVmZmVyJyksXG4gICAgY2xvbmVUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fY2xvbmVUeXBlZEFycmF5JyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9faW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi9pc1BsYWluT2JqZWN0JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKSxcbiAgICBzYWZlR2V0ID0gcmVxdWlyZSgnLi9fc2FmZUdldCcpLFxuICAgIHRvUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuL3RvUGxhaW5PYmplY3QnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VNZXJnZWAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBtZXJnZXMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgbWVyZ2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBtZXJnZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXJnZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1lcmdlIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIHZhbHVlcyBhbmQgdGhlaXIgbWVyZ2VkXG4gKiAgY291bnRlcnBhcnRzLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBtZXJnZUZ1bmMsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIHZhciBvYmpWYWx1ZSA9IHNhZmVHZXQob2JqZWN0LCBrZXkpLFxuICAgICAgc3JjVmFsdWUgPSBzYWZlR2V0KHNvdXJjZSwga2V5KSxcbiAgICAgIHN0YWNrZWQgPSBzdGFjay5nZXQoc3JjVmFsdWUpO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgc3RhY2tlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgOiB1bmRlZmluZWQ7XG5cbiAgdmFyIGlzQ29tbW9uID0gbmV3VmFsdWUgPT09IHVuZGVmaW5lZDtcblxuICBpZiAoaXNDb21tb24pIHtcbiAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHNyY1ZhbHVlKSxcbiAgICAgICAgaXNCdWZmID0gIWlzQXJyICYmIGlzQnVmZmVyKHNyY1ZhbHVlKSxcbiAgICAgICAgaXNUeXBlZCA9ICFpc0FyciAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheShzcmNWYWx1ZSk7XG5cbiAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgIGlmIChpc0FyciB8fCBpc0J1ZmYgfHwgaXNUeXBlZCkge1xuICAgICAgaWYgKGlzQXJyYXkob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0FycmF5TGlrZU9iamVjdChvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBjb3B5QXJyYXkob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNCdWZmKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gY2xvbmVCdWZmZXIoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNUeXBlZCkge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lVHlwZWRBcnJheShzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgaWYgKGlzQXJndW1lbnRzKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRvUGxhaW5PYmplY3Qob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIWlzT2JqZWN0KG9ialZhbHVlKSB8fCAoc3JjSW5kZXggJiYgaXNGdW5jdGlvbihvYmpWYWx1ZSkpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gaW5pdENsb25lT2JqZWN0KHNyY1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoaXNDb21tb24pIHtcbiAgICAvLyBSZWN1cnNpdmVseSBtZXJnZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBzdGFjay5zZXQoc3JjVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICBtZXJnZUZ1bmMobmV3VmFsdWUsIHNyY1ZhbHVlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIHN0YWNrWydkZWxldGUnXShzcmNWYWx1ZSk7XG4gIH1cbiAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNZXJnZURlZXA7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFzc2lnbk1lcmdlVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25NZXJnZVZhbHVlJyksXG4gICAgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBiYXNlTWVyZ2VEZWVwID0gcmVxdWlyZSgnLi9fYmFzZU1lcmdlRGVlcCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyksXG4gICAgc2FmZUdldCA9IHJlcXVpcmUoJy4vX3NhZmVHZXQnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tZXJnZWAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKG9iamVjdCA9PT0gc291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJhc2VGb3Ioc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgaWYgKGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIGJhc2VNZXJnZSwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgICAgPyBjdXN0b21pemVyKHNhZmVHZXQob2JqZWN0LCBrZXkpLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH0sIGtleXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsIi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcbiIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcbiIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcbiIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcbiIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgb3ZlclJlc3QgPSByZXF1aXJlKCcuL19vdmVyUmVzdCcpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVJlc3Q7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdClcbiAgICAgICkge1xuICAgIHJldHVybiBlcShvYmplY3RbaW5kZXhdLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwidmFyIGJhc2VSZXN0ID0gcmVxdWlyZSgnLi9fYmFzZVJlc3QnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIGJhc2VSZXN0KGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkO1xuXG4gICAgY3VzdG9taXplciA9IChhc3NpZ25lci5sZW5ndGggPiAzICYmIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG4iLCJ2YXIgYmFzZU1lcmdlID0gcmVxdWlyZSgnLi9fYmFzZU1lcmdlJyksXG4gICAgY3JlYXRlQXNzaWduZXIgPSByZXF1aXJlKCcuL19jcmVhdGVBc3NpZ25lcicpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ubWVyZ2VgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGN1c3RvbWl6ZXJgIHdoaWNoXG4gKiBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIG1lcmdlZCB2YWx1ZXMgb2YgdGhlIGRlc3RpbmF0aW9uIGFuZCBzb3VyY2VcbiAqIHByb3BlcnRpZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgLCBtZXJnaW5nIGlzIGhhbmRsZWQgYnkgdGhlXG4gKiBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBpbnZva2VkIHdpdGggc2l4IGFyZ3VtZW50czpcbiAqIChvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gc291cmNlcyBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUpIHtcbiAqICAgaWYgKF8uaXNBcnJheShvYmpWYWx1ZSkpIHtcbiAqICAgICByZXR1cm4gb2JqVmFsdWUuY29uY2F0KHNyY1ZhbHVlKTtcbiAqICAgfVxuICogfVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogWzFdLCAnYic6IFsyXSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IFszXSwgJ2InOiBbNF0gfTtcbiAqXG4gKiBfLm1lcmdlV2l0aChvYmplY3QsIG90aGVyLCBjdXN0b21pemVyKTtcbiAqIC8vID0+IHsgJ2EnOiBbMSwgM10sICdiJzogWzIsIDRdIH1cbiAqL1xudmFyIG1lcmdlV2l0aCA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplcikge1xuICBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlV2l0aDtcbiIsImltcG9ydCBWdWUgZnJvbSAndnVlJ1xuXG5leHBvcnQgY29uc3QgTkFNRV9TRUxFQ1RPUiA9ICdOQU1FX1NFTEVDVE9SJ1xuZXhwb3J0IGNvbnN0IENPTVBPTkVOVF9TRUxFQ1RPUiA9ICdDT01QT05FTlRfU0VMRUNUT1InXG5leHBvcnQgY29uc3QgUkVGX1NFTEVDVE9SID0gJ1JFRl9TRUxFQ1RPUidcbmV4cG9ydCBjb25zdCBET01fU0VMRUNUT1IgPSAnRE9NX1NFTEVDVE9SJ1xuZXhwb3J0IGNvbnN0IFZVRV9WRVJTSU9OID0gTnVtYmVyKFxuICBgJHtWdWUudmVyc2lvbi5zcGxpdCgnLicpWzBdfS4ke1Z1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMV19YFxuKVxuZXhwb3J0IGNvbnN0IEZVTkNUSU9OQUxfT1BUSU9OUyA9XG4gIFZVRV9WRVJTSU9OID49IDIuNSA/ICdmbk9wdGlvbnMnIDogJ2Z1bmN0aW9uYWxPcHRpb25zJ1xuIiwiLy8gQGZsb3dcblxuaW1wb3J0IHtcbiAgaXNEb21TZWxlY3RvcixcbiAgaXNOYW1lU2VsZWN0b3IsXG4gIGlzUmVmU2VsZWN0b3IsXG4gIGlzVnVlQ29tcG9uZW50XG59IGZyb20gJ3NoYXJlZC92YWxpZGF0b3JzJ1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJ3NoYXJlZC91dGlsJ1xuaW1wb3J0IHtcbiAgUkVGX1NFTEVDVE9SLFxuICBDT01QT05FTlRfU0VMRUNUT1IsXG4gIE5BTUVfU0VMRUNUT1IsXG4gIERPTV9TRUxFQ1RPUlxufSBmcm9tICcuL2NvbnN0cydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0U2VsZWN0b3JUeXBlT3JUaHJvdyAoXG4gIHNlbGVjdG9yOiBTZWxlY3RvcixcbiAgbWV0aG9kTmFtZTogc3RyaW5nXG4pOiBzdHJpbmcgfCB2b2lkIHtcbiAgaWYgKGlzRG9tU2VsZWN0b3Ioc2VsZWN0b3IpKSByZXR1cm4gRE9NX1NFTEVDVE9SXG4gIGlmIChpc05hbWVTZWxlY3RvcihzZWxlY3RvcikpIHJldHVybiBOQU1FX1NFTEVDVE9SXG4gIGlmIChpc1Z1ZUNvbXBvbmVudChzZWxlY3RvcikpIHJldHVybiBDT01QT05FTlRfU0VMRUNUT1JcbiAgaWYgKGlzUmVmU2VsZWN0b3Ioc2VsZWN0b3IpKSByZXR1cm4gUkVGX1NFTEVDVE9SXG5cbiAgdGhyb3dFcnJvcihcbiAgICBgd3JhcHBlci4ke21ldGhvZE5hbWV9KCkgbXVzdCBiZSBwYXNzZWQgYSB2YWxpZCBDU1Mgc2VsZWN0b3IsIGAgK1xuICAgIGBWdWUgY29uc3RydWN0b3IsIG9yIHZhbGlkIGZpbmQgb3B0aW9uIG9iamVjdGBcbiAgKVxufVxuIiwiLy8gQGZsb3dcblxuaW1wb3J0IHsgd2FybiB9IGZyb20gJ3NoYXJlZC91dGlsJ1xuXG5mdW5jdGlvbiBnZXRSZWFsQ2hpbGQgKHZub2RlOiA/Vk5vZGUpOiA/Vk5vZGUge1xuICBjb25zdCBjb21wT3B0aW9ucyA9IHZub2RlICYmIHZub2RlLmNvbXBvbmVudE9wdGlvbnNcbiAgaWYgKGNvbXBPcHRpb25zICYmIGNvbXBPcHRpb25zLkN0b3Iub3B0aW9ucy5hYnN0cmFjdCkge1xuICAgIHJldHVybiBnZXRSZWFsQ2hpbGQoZ2V0Rmlyc3RDb21wb25lbnRDaGlsZChjb21wT3B0aW9ucy5jaGlsZHJlbikpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZub2RlXG4gIH1cbn1cblxuZnVuY3Rpb24gaXNTYW1lQ2hpbGQgKGNoaWxkOiBWTm9kZSwgb2xkQ2hpbGQ6IFZOb2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiBvbGRDaGlsZC5rZXkgPT09IGNoaWxkLmtleSAmJiBvbGRDaGlsZC50YWcgPT09IGNoaWxkLnRhZ1xufVxuXG5mdW5jdGlvbiBnZXRGaXJzdENvbXBvbmVudENoaWxkIChjaGlsZHJlbjogP0FycmF5PFZOb2RlPik6ID9WTm9kZSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGMgPSBjaGlsZHJlbltpXVxuICAgICAgaWYgKGMgJiYgKGMuY29tcG9uZW50T3B0aW9ucyB8fCBpc0FzeW5jUGxhY2Vob2xkZXIoYykpKSB7XG4gICAgICAgIHJldHVybiBjXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlICh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHxcbiAgICAvLyAkRmxvd0lnbm9yZVxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcgfHxcbiAgICB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJ1xuICApXG59XG5cbmZ1bmN0aW9uIGlzQXN5bmNQbGFjZWhvbGRlciAobm9kZTogVk5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUuaXNDb21tZW50ICYmIG5vZGUuYXN5bmNGYWN0b3J5XG59XG5jb25zdCBjYW1lbGl6ZVJFID0gLy0oXFx3KS9nXG5leHBvcnQgY29uc3QgY2FtZWxpemUgPSAoc3RyOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2FtZWxpemVSRSwgKF8sIGMpID0+IGMgPyBjLnRvVXBwZXJDYXNlKCkgOiAnJylcbn1cblxuZnVuY3Rpb24gaGFzUGFyZW50VHJhbnNpdGlvbiAodm5vZGU6IFZOb2RlKTogP2Jvb2xlYW4ge1xuICB3aGlsZSAoKHZub2RlID0gdm5vZGUucGFyZW50KSkge1xuICAgIGlmICh2bm9kZS5kYXRhLnRyYW5zaXRpb24pIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcmVuZGVyIChoOiBGdW5jdGlvbikge1xuICAgIGxldCBjaGlsZHJlbjogP0FycmF5PFZOb2RlPiA9IHRoaXMuJG9wdGlvbnMuX3JlbmRlckNoaWxkcmVuXG4gICAgaWYgKCFjaGlsZHJlbikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gZmlsdGVyIG91dCB0ZXh0IG5vZGVzIChwb3NzaWJsZSB3aGl0ZXNwYWNlcylcbiAgICBjaGlsZHJlbiA9IGNoaWxkcmVuLmZpbHRlcigoYzogVk5vZGUpID0+IGMudGFnIHx8IGlzQXN5bmNQbGFjZWhvbGRlcihjKSlcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gd2FybiBtdWx0aXBsZSBlbGVtZW50c1xuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBgPHRyYW5zaXRpb24+IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBzaW5nbGUgZWxlbWVudC4gYCArIGBVc2UgYCArXG4gICAgICAgICAnPHRyYW5zaXRpb24tZ3JvdXA+IGZvciBsaXN0cy4nXG4gICAgICApXG4gICAgfVxuXG4gICAgY29uc3QgbW9kZTogc3RyaW5nID0gdGhpcy5tb2RlXG5cbiAgICAvLyB3YXJuIGludmFsaWQgbW9kZVxuICAgIGlmIChtb2RlICYmIG1vZGUgIT09ICdpbi1vdXQnICYmIG1vZGUgIT09ICdvdXQtaW4nXG4gICAgKSB7XG4gICAgICB3YXJuKFxuICAgICAgICAnaW52YWxpZCA8dHJhbnNpdGlvbj4gbW9kZTogJyArIG1vZGVcbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCByYXdDaGlsZDogVk5vZGUgPSBjaGlsZHJlblswXVxuXG4gICAgLy8gaWYgdGhpcyBpcyBhIGNvbXBvbmVudCByb290IG5vZGUgYW5kIHRoZSBjb21wb25lbnQnc1xuICAgIC8vIHBhcmVudCBjb250YWluZXIgbm9kZSBhbHNvIGhhcyB0cmFuc2l0aW9uLCBza2lwLlxuICAgIGlmIChoYXNQYXJlbnRUcmFuc2l0aW9uKHRoaXMuJHZub2RlKSkge1xuICAgICAgcmV0dXJuIHJhd0NoaWxkXG4gICAgfVxuXG4gICAgLy8gYXBwbHkgdHJhbnNpdGlvbiBkYXRhIHRvIGNoaWxkXG4gICAgLy8gdXNlIGdldFJlYWxDaGlsZCgpIHRvIGlnbm9yZSBhYnN0cmFjdCBjb21wb25lbnRzIGUuZy4ga2VlcC1hbGl2ZVxuICAgIGNvbnN0IGNoaWxkOiA/Vk5vZGUgPSBnZXRSZWFsQ2hpbGQocmF3Q2hpbGQpXG5cbiAgICBpZiAoIWNoaWxkKSB7XG4gICAgICByZXR1cm4gcmF3Q2hpbGRcbiAgICB9XG5cbiAgICBjb25zdCBpZDogc3RyaW5nID0gYF9fdHJhbnNpdGlvbi0ke3RoaXMuX3VpZH0tYFxuICAgIGNoaWxkLmtleSA9IGNoaWxkLmtleSA9PSBudWxsXG4gICAgICA/IGNoaWxkLmlzQ29tbWVudFxuICAgICAgICA/IGlkICsgJ2NvbW1lbnQnXG4gICAgICAgIDogaWQgKyBjaGlsZC50YWdcbiAgICAgIDogaXNQcmltaXRpdmUoY2hpbGQua2V5KVxuICAgICAgICA/IChTdHJpbmcoY2hpbGQua2V5KS5pbmRleE9mKGlkKSA9PT0gMCA/IGNoaWxkLmtleSA6IGlkICsgY2hpbGQua2V5KVxuICAgICAgICA6IGNoaWxkLmtleVxuXG4gICAgY29uc3QgZGF0YTogT2JqZWN0ID0gKGNoaWxkLmRhdGEgfHwgKGNoaWxkLmRhdGEgPSB7fSkpXG4gICAgY29uc3Qgb2xkUmF3Q2hpbGQ6ID9WTm9kZSA9IHRoaXMuX3Zub2RlXG4gICAgY29uc3Qgb2xkQ2hpbGQ6ID9WTm9kZSA9IGdldFJlYWxDaGlsZChvbGRSYXdDaGlsZClcbiAgICBpZiAoY2hpbGQuZGF0YS5kaXJlY3RpdmVzICYmXG4gICAgICBjaGlsZC5kYXRhLmRpcmVjdGl2ZXMuc29tZShkID0+IGQubmFtZSA9PT0gJ3Nob3cnKSkge1xuICAgICAgY2hpbGQuZGF0YS5zaG93ID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vIG1hcmsgdi1zaG93XG4gICAgLy8gc28gdGhhdCB0aGUgdHJhbnNpdGlvbiBtb2R1bGUgY2FuIGhhbmQgb3ZlciB0aGUgY29udHJvbFxuICAgIC8vIHRvIHRoZSBkaXJlY3RpdmVcbiAgICBpZiAoY2hpbGQuZGF0YS5kaXJlY3RpdmVzICYmXG4gICAgICBjaGlsZC5kYXRhLmRpcmVjdGl2ZXMuc29tZShkID0+IGQubmFtZSA9PT0gJ3Nob3cnKSkge1xuICAgICAgY2hpbGQuZGF0YS5zaG93ID0gdHJ1ZVxuICAgIH1cbiAgICBpZiAoXG4gICAgICBvbGRDaGlsZCAmJlxuICAgICAgICAgb2xkQ2hpbGQuZGF0YSAmJlxuICAgICAgICAgIWlzU2FtZUNoaWxkKGNoaWxkLCBvbGRDaGlsZCkgJiZcbiAgICAgICAgICFpc0FzeW5jUGxhY2Vob2xkZXIob2xkQ2hpbGQpICYmXG4gICAgICAgICAvLyAjNjY4NyBjb21wb25lbnQgcm9vdCBpcyBhIGNvbW1lbnQgbm9kZVxuICAgICAgICAgIShvbGRDaGlsZC5jb21wb25lbnRJbnN0YW5jZSAmJlxuICAgICAgICAgIG9sZENoaWxkLmNvbXBvbmVudEluc3RhbmNlLl92bm9kZS5pc0NvbW1lbnQpXG4gICAgKSB7XG4gICAgICBvbGRDaGlsZC5kYXRhID0geyAuLi5kYXRhIH1cbiAgICB9XG4gICAgcmV0dXJuIHJhd0NoaWxkXG4gIH1cbn1cbiIsIi8vIEBmbG93XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcmVuZGVyIChoOiBGdW5jdGlvbikge1xuICAgIGNvbnN0IHRhZzogc3RyaW5nID0gdGhpcy50YWcgfHwgdGhpcy4kdm5vZGUuZGF0YS50YWcgfHwgJ3NwYW4nXG4gICAgY29uc3QgY2hpbGRyZW46IEFycmF5PFZOb2RlPiA9IHRoaXMuJHNsb3RzLmRlZmF1bHQgfHwgW11cblxuICAgIHJldHVybiBoKHRhZywgbnVsbCwgY2hpbGRyZW4pXG4gIH1cbn1cbiIsImltcG9ydCBUcmFuc2l0aW9uU3R1YiBmcm9tICcuL2NvbXBvbmVudHMvVHJhbnNpdGlvblN0dWInXG5pbXBvcnQgVHJhbnNpdGlvbkdyb3VwU3R1YiBmcm9tICcuL2NvbXBvbmVudHMvVHJhbnNpdGlvbkdyb3VwU3R1YidcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzdHViczoge1xuICAgIHRyYW5zaXRpb246IFRyYW5zaXRpb25TdHViLFxuICAgICd0cmFuc2l0aW9uLWdyb3VwJzogVHJhbnNpdGlvbkdyb3VwU3R1YlxuICB9LFxuICBtb2Nrczoge30sXG4gIG1ldGhvZHM6IHt9LFxuICBwcm92aWRlOiB7fSxcbiAgbG9nTW9kaWZpZWRDb21wb25lbnRzOiB0cnVlLFxuICBzaWxlbnQ6IHRydWVcbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgeyBGVU5DVElPTkFMX09QVElPTlMsIFZVRV9WRVJTSU9OIH0gZnJvbSAnLi9jb25zdHMnXG5pbXBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAnc2hhcmVkL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQWxsVnVlQ29tcG9uZW50c0Zyb21WbSAoXG4gIHZtOiBDb21wb25lbnQsXG4gIGNvbXBvbmVudHM6IEFycmF5PENvbXBvbmVudD4gPSBbXVxuKTogQXJyYXk8Q29tcG9uZW50PiB7XG4gIGNvbXBvbmVudHMucHVzaCh2bSlcbiAgdm0uJGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgIGZpbmRBbGxWdWVDb21wb25lbnRzRnJvbVZtKGNoaWxkLCBjb21wb25lbnRzKVxuICB9KVxuXG4gIHJldHVybiBjb21wb25lbnRzXG59XG5cbmZ1bmN0aW9uIGZpbmRBbGxWdWVDb21wb25lbnRzRnJvbVZub2RlIChcbiAgdm5vZGU6IENvbXBvbmVudCxcbiAgY29tcG9uZW50czogQXJyYXk8Q29tcG9uZW50PiA9IFtdXG4pOiBBcnJheTxDb21wb25lbnQ+IHtcbiAgaWYgKHZub2RlLmNoaWxkKSB7XG4gICAgY29tcG9uZW50cy5wdXNoKHZub2RlLmNoaWxkKVxuICB9XG4gIGlmICh2bm9kZS5jaGlsZHJlbikge1xuICAgIHZub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgZmluZEFsbFZ1ZUNvbXBvbmVudHNGcm9tVm5vZGUoY2hpbGQsIGNvbXBvbmVudHMpXG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBjb21wb25lbnRzXG59XG5cbmZ1bmN0aW9uIGZpbmRBbGxGdW5jdGlvbmFsQ29tcG9uZW50c0Zyb21Wbm9kZSAoXG4gIHZub2RlOiBDb21wb25lbnQsXG4gIGNvbXBvbmVudHM6IEFycmF5PENvbXBvbmVudD4gPSBbXVxuKTogQXJyYXk8Q29tcG9uZW50PiB7XG4gIGlmICh2bm9kZVtGVU5DVElPTkFMX09QVElPTlNdIHx8IHZub2RlLmZ1bmN0aW9uYWxDb250ZXh0KSB7XG4gICAgY29tcG9uZW50cy5wdXNoKHZub2RlKVxuICB9XG4gIGlmICh2bm9kZS5jaGlsZHJlbikge1xuICAgIHZub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgZmluZEFsbEZ1bmN0aW9uYWxDb21wb25lbnRzRnJvbVZub2RlKGNoaWxkLCBjb21wb25lbnRzKVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIGNvbXBvbmVudHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZtQ3Rvck1hdGNoZXNOYW1lICh2bTogQ29tcG9uZW50LCBuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuICEhKFxuICAgIG5hbWUgJiYgKFxuICAgICAgKHZtLl92bm9kZSAmJlxuICAgICAgdm0uX3Zub2RlLmZ1bmN0aW9uYWxPcHRpb25zICYmXG4gICAgICB2bS5fdm5vZGUuZnVuY3Rpb25hbE9wdGlvbnMubmFtZSA9PT0gbmFtZSkgfHxcbiAgICAodm0uJG9wdGlvbnMgJiYgdm0uJG9wdGlvbnMubmFtZSA9PT0gbmFtZSkgfHxcbiAgICAodm0ub3B0aW9ucyAmJiB2bS5vcHRpb25zLm5hbWUgPT09IG5hbWUpXG4gICAgKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZtQ3Rvck1hdGNoZXNTZWxlY3RvciAoXG4gIGNvbXBvbmVudDogQ29tcG9uZW50LFxuICBzZWxlY3RvcjogT2JqZWN0XG4pOiBib29sZWFuIHtcbiAgY29uc3QgQ3RvciA9IHNlbGVjdG9yLl9DdG9yIHx8IChzZWxlY3Rvci5vcHRpb25zICYmIHNlbGVjdG9yLm9wdGlvbnMuX0N0b3IpXG4gIGlmICghQ3Rvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gY29tcG9uZW50Ll9fcHJvdG9fXy5jb25zdHJ1Y3RvclxuICByZXR1cm4gT2JqZWN0LmtleXMoQ3RvciB8fCB7fSkuc29tZShjID0+IHtcbiAgICByZXR1cm4gQ3RvcltjXSA9PT0gY29uc3RydWN0b3IgfHwgQ3RvcltjXSA9PT0gY29uc3RydWN0b3Iuc3VwZXJcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZtRnVuY3Rpb25hbEN0b3JNYXRjaGVzU2VsZWN0b3IgKFxuICBjb21wb25lbnQ6IFZOb2RlLFxuICBDdG9yOiBPYmplY3Rcbik6IGJvb2xlYW4ge1xuICBpZiAoVlVFX1ZFUlNJT04gPCAyLjMpIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZm9yIGZ1bmN0aW9uYWwgY29tcG9uZW50cyBpcyBub3Qgc3VwcG9ydCBpbiBgICsgYFZ1ZSA8IDIuM2BcbiAgICApXG4gIH1cblxuICBpZiAoIUN0b3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmICghY29tcG9uZW50W0ZVTkNUSU9OQUxfT1BUSU9OU10pIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCBDdG9ycyA9IE9iamVjdC5rZXlzKGNvbXBvbmVudFtGVU5DVElPTkFMX09QVElPTlNdLl9DdG9yKVxuICByZXR1cm4gQ3RvcnMuc29tZShjID0+IEN0b3JbY10gPT09IGNvbXBvbmVudFtGVU5DVElPTkFMX09QVElPTlNdLl9DdG9yW2NdKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaW5kVnVlQ29tcG9uZW50cyAoXG4gIHJvb3Q6IENvbXBvbmVudCxcbiAgc2VsZWN0b3JUeXBlOiA/c3RyaW5nLFxuICBzZWxlY3RvcjogT2JqZWN0XG4pOiBBcnJheTxDb21wb25lbnQ+IHtcbiAgaWYgKHNlbGVjdG9yLmZ1bmN0aW9uYWwpIHtcbiAgICBjb25zdCBub2RlcyA9IHJvb3QuX3Zub2RlXG4gICAgICA/IGZpbmRBbGxGdW5jdGlvbmFsQ29tcG9uZW50c0Zyb21Wbm9kZShyb290Ll92bm9kZSlcbiAgICAgIDogZmluZEFsbEZ1bmN0aW9uYWxDb21wb25lbnRzRnJvbVZub2RlKHJvb3QpXG4gICAgcmV0dXJuIG5vZGVzLmZpbHRlcihcbiAgICAgIG5vZGUgPT5cbiAgICAgICAgdm1GdW5jdGlvbmFsQ3Rvck1hdGNoZXNTZWxlY3Rvcihub2RlLCBzZWxlY3Rvci5fQ3RvcikgfHxcbiAgICAgICAgbm9kZVtGVU5DVElPTkFMX09QVElPTlNdLm5hbWUgPT09IHNlbGVjdG9yLm5hbWVcbiAgICApXG4gIH1cbiAgY29uc3QgbmFtZVNlbGVjdG9yID1cbiAgICB0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicgPyBzZWxlY3Rvci5leHRlbmRPcHRpb25zLm5hbWUgOiBzZWxlY3Rvci5uYW1lXG4gIGNvbnN0IGNvbXBvbmVudHMgPSByb290Ll9pc1Z1ZVxuICAgID8gZmluZEFsbFZ1ZUNvbXBvbmVudHNGcm9tVm0ocm9vdClcbiAgICA6IGZpbmRBbGxWdWVDb21wb25lbnRzRnJvbVZub2RlKHJvb3QpXG4gIHJldHVybiBjb21wb25lbnRzLmZpbHRlcihjb21wb25lbnQgPT4ge1xuICAgIGlmICghY29tcG9uZW50LiR2bm9kZSAmJiAhY29tcG9uZW50LiRvcHRpb25zLmV4dGVuZHMpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgdm1DdG9yTWF0Y2hlc1NlbGVjdG9yKGNvbXBvbmVudCwgc2VsZWN0b3IpIHx8XG4gICAgICB2bUN0b3JNYXRjaGVzTmFtZShjb21wb25lbnQsIG5hbWVTZWxlY3RvcilcbiAgICApXG4gIH0pXG59XG4iLCIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSBXcmFwcGVyIGZyb20gJy4vd3JhcHBlcidcbmltcG9ydCB0eXBlIFZ1ZVdyYXBwZXIgZnJvbSAnLi92dWUtd3JhcHBlcidcbmltcG9ydCB7IHRocm93RXJyb3IsIHdhcm4gfSBmcm9tICdzaGFyZWQvdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JhcHBlckFycmF5IGltcGxlbWVudHMgQmFzZVdyYXBwZXIge1xuICArd3JhcHBlcnM6IEFycmF5PFdyYXBwZXIgfCBWdWVXcmFwcGVyPjtcbiAgK2xlbmd0aDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yICh3cmFwcGVyczogQXJyYXk8V3JhcHBlciB8IFZ1ZVdyYXBwZXI+KSB7XG4gICAgY29uc3QgbGVuZ3RoID0gd3JhcHBlcnMubGVuZ3RoXG4gICAgLy8gJEZsb3dJZ25vcmVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3dyYXBwZXJzJywge1xuICAgICAgZ2V0OiAoKSA9PiB3cmFwcGVycyxcbiAgICAgIHNldDogKCkgPT4gdGhyb3dFcnJvcignd3JhcHBlckFycmF5LndyYXBwZXJzIGlzIHJlYWQtb25seScpXG4gICAgfSlcbiAgICAvLyAkRmxvd0lnbm9yZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbGVuZ3RoJywge1xuICAgICAgZ2V0OiAoKSA9PiBsZW5ndGgsXG4gICAgICBzZXQ6ICgpID0+IHRocm93RXJyb3IoJ3dyYXBwZXJBcnJheS5sZW5ndGggaXMgcmVhZC1vbmx5JylcbiAgICB9KVxuICB9XG5cbiAgYXQgKGluZGV4OiBudW1iZXIpOiBXcmFwcGVyIHwgVnVlV3JhcHBlciB7XG4gICAgaWYgKGluZGV4ID4gdGhpcy5sZW5ndGggLSAxKSB7XG4gICAgICB0aHJvd0Vycm9yKGBubyBpdGVtIGV4aXN0cyBhdCAke2luZGV4fWApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLndyYXBwZXJzW2luZGV4XVxuICB9XG5cbiAgYXR0cmlidXRlcyAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2F0dHJpYnV0ZXMnKVxuXG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBhdHRyaWJ1dGVzIG11c3QgYmUgY2FsbGVkIG9uIGEgc2luZ2xlIHdyYXBwZXIsIHVzZSBgICtcbiAgICAgICAgYGF0KGkpIHRvIGFjY2VzcyBhIHdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgY2xhc3NlcyAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2NsYXNzZXMnKVxuXG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBjbGFzc2VzIG11c3QgYmUgY2FsbGVkIG9uIGEgc2luZ2xlIHdyYXBwZXIsIHVzZSBgICtcbiAgICAgICAgYGF0KGkpIHRvIGFjY2VzcyBhIHdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgY29udGFpbnMgKHNlbGVjdG9yOiBTZWxlY3Rvcik6IGJvb2xlYW4ge1xuICAgIHRoaXMudGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5KCdjb250YWlucycpXG5cbiAgICByZXR1cm4gdGhpcy53cmFwcGVycy5ldmVyeSh3cmFwcGVyID0+IHdyYXBwZXIuY29udGFpbnMoc2VsZWN0b3IpKVxuICB9XG5cbiAgZXhpc3RzICgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPiAwICYmIHRoaXMud3JhcHBlcnMuZXZlcnkod3JhcHBlciA9PiB3cmFwcGVyLmV4aXN0cygpKVxuICB9XG5cbiAgZmlsdGVyIChwcmVkaWNhdGU6IEZ1bmN0aW9uKTogV3JhcHBlckFycmF5IHtcbiAgICByZXR1cm4gbmV3IFdyYXBwZXJBcnJheSh0aGlzLndyYXBwZXJzLmZpbHRlcihwcmVkaWNhdGUpKVxuICB9XG5cbiAgdmlzaWJsZSAoKTogYm9vbGVhbiB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ3Zpc2libGUnKVxuXG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoID4gMCAmJiB0aGlzLndyYXBwZXJzLmV2ZXJ5KHdyYXBwZXIgPT4gd3JhcHBlci52aXNpYmxlKCkpXG4gIH1cblxuICBlbWl0dGVkICgpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93RXJyb3JJZldyYXBwZXJzSXNFbXB0eSgnZW1pdHRlZCcpXG5cbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGVtaXR0ZWQgbXVzdCBiZSBjYWxsZWQgb24gYSBzaW5nbGUgd3JhcHBlciwgdXNlIGAgK1xuICAgICAgICBgYXQoaSkgdG8gYWNjZXNzIGEgd3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBlbWl0dGVkQnlPcmRlciAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2VtaXR0ZWRCeU9yZGVyJylcblxuICAgIHRocm93RXJyb3IoXG4gICAgICBgZW1pdHRlZEJ5T3JkZXIgbXVzdCBiZSBjYWxsZWQgb24gYSBzaW5nbGUgd3JhcHBlciwgYCArXG4gICAgICAgIGB1c2UgYXQoaSkgdG8gYWNjZXNzIGEgd3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBoYXNBdHRyaWJ1dGUgKGF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2hhc0F0dHJpYnV0ZScpXG5cbiAgICByZXR1cm4gdGhpcy53cmFwcGVycy5ldmVyeSh3cmFwcGVyID0+XG4gICAgICB3cmFwcGVyLmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKVxuICAgIClcbiAgfVxuXG4gIGhhc0NsYXNzIChjbGFzc05hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHRoaXMudGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5KCdoYXNDbGFzcycpXG5cbiAgICByZXR1cm4gdGhpcy53cmFwcGVycy5ldmVyeSh3cmFwcGVyID0+IHdyYXBwZXIuaGFzQ2xhc3MoY2xhc3NOYW1lKSlcbiAgfVxuXG4gIGhhc1Byb3AgKHByb3A6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHRoaXMudGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5KCdoYXNQcm9wJylcblxuICAgIHJldHVybiB0aGlzLndyYXBwZXJzLmV2ZXJ5KHdyYXBwZXIgPT4gd3JhcHBlci5oYXNQcm9wKHByb3AsIHZhbHVlKSlcbiAgfVxuXG4gIGhhc1N0eWxlIChzdHlsZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2hhc1N0eWxlJylcblxuICAgIHJldHVybiB0aGlzLndyYXBwZXJzLmV2ZXJ5KHdyYXBwZXIgPT4gd3JhcHBlci5oYXNTdHlsZShzdHlsZSwgdmFsdWUpKVxuICB9XG5cbiAgZmluZEFsbCAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2ZpbmRBbGwnKVxuXG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kQWxsIG11c3QgYmUgY2FsbGVkIG9uIGEgc2luZ2xlIHdyYXBwZXIsIHVzZSBgICtcbiAgICAgICAgYGF0KGkpIHRvIGFjY2VzcyBhIHdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgZmluZCAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2ZpbmQnKVxuXG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgc2luZ2xlIHdyYXBwZXIsIHVzZSBhdChpKSBgICtcbiAgICAgICAgYHRvIGFjY2VzcyBhIHdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgaHRtbCAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2h0bWwnKVxuXG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBodG1sIG11c3QgYmUgY2FsbGVkIG9uIGEgc2luZ2xlIHdyYXBwZXIsIHVzZSBhdChpKSBgICtcbiAgICAgICAgYHRvIGFjY2VzcyBhIHdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgaXMgKHNlbGVjdG9yOiBTZWxlY3Rvcik6IGJvb2xlYW4ge1xuICAgIHRoaXMudGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5KCdpcycpXG5cbiAgICByZXR1cm4gdGhpcy53cmFwcGVycy5ldmVyeSh3cmFwcGVyID0+IHdyYXBwZXIuaXMoc2VsZWN0b3IpKVxuICB9XG5cbiAgaXNFbXB0eSAoKTogYm9vbGVhbiB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2lzRW1wdHknKVxuXG4gICAgcmV0dXJuIHRoaXMud3JhcHBlcnMuZXZlcnkod3JhcHBlciA9PiB3cmFwcGVyLmlzRW1wdHkoKSlcbiAgfVxuXG4gIGlzVmlzaWJsZSAoKTogYm9vbGVhbiB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2lzVmlzaWJsZScpXG5cbiAgICByZXR1cm4gdGhpcy53cmFwcGVycy5ldmVyeSh3cmFwcGVyID0+IHdyYXBwZXIuaXNWaXNpYmxlKCkpXG4gIH1cblxuICBpc1Z1ZUluc3RhbmNlICgpOiBib29sZWFuIHtcbiAgICB0aGlzLnRocm93RXJyb3JJZldyYXBwZXJzSXNFbXB0eSgnaXNWdWVJbnN0YW5jZScpXG5cbiAgICByZXR1cm4gdGhpcy53cmFwcGVycy5ldmVyeSh3cmFwcGVyID0+IHdyYXBwZXIuaXNWdWVJbnN0YW5jZSgpKVxuICB9XG5cbiAgbmFtZSAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ25hbWUnKVxuXG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBuYW1lIG11c3QgYmUgY2FsbGVkIG9uIGEgc2luZ2xlIHdyYXBwZXIsIHVzZSBhdChpKSBgICtcbiAgICAgICAgYHRvIGFjY2VzcyBhIHdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgcHJvcHMgKCk6IHZvaWQge1xuICAgIHRoaXMudGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5KCdwcm9wcycpXG5cbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYHByb3BzIG11c3QgYmUgY2FsbGVkIG9uIGEgc2luZ2xlIHdyYXBwZXIsIHVzZSBgICtcbiAgICAgICAgYGF0KGkpIHRvIGFjY2VzcyBhIHdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgdGV4dCAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ3RleHQnKVxuXG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGB0ZXh0IG11c3QgYmUgY2FsbGVkIG9uIGEgc2luZ2xlIHdyYXBwZXIsIHVzZSBhdChpKSBgICtcbiAgICAgICAgYHRvIGFjY2VzcyBhIHdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgdGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5IChtZXRob2Q6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLndyYXBwZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3dFcnJvcihgJHttZXRob2R9IGNhbm5vdCBiZSBjYWxsZWQgb24gMCBpdGVtc2ApXG4gICAgfVxuICB9XG5cbiAgc2V0Q29tcHV0ZWQgKGNvbXB1dGVkOiBPYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93RXJyb3JJZldyYXBwZXJzSXNFbXB0eSgnc2V0Q29tcHV0ZWQnKVxuXG4gICAgdGhpcy53cmFwcGVycy5mb3JFYWNoKHdyYXBwZXIgPT4gd3JhcHBlci5zZXRDb21wdXRlZChjb21wdXRlZCkpXG4gIH1cblxuICBzZXREYXRhIChkYXRhOiBPYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93RXJyb3JJZldyYXBwZXJzSXNFbXB0eSgnc2V0RGF0YScpXG5cbiAgICB0aGlzLndyYXBwZXJzLmZvckVhY2god3JhcHBlciA9PiB3cmFwcGVyLnNldERhdGEoZGF0YSkpXG4gIH1cblxuICBzZXRNZXRob2RzIChwcm9wczogT2JqZWN0KTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ3NldE1ldGhvZHMnKVxuXG4gICAgdGhpcy53cmFwcGVycy5mb3JFYWNoKHdyYXBwZXIgPT4gd3JhcHBlci5zZXRNZXRob2RzKHByb3BzKSlcbiAgfVxuXG4gIHNldFByb3BzIChwcm9wczogT2JqZWN0KTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ3NldFByb3BzJylcblxuICAgIHRoaXMud3JhcHBlcnMuZm9yRWFjaCh3cmFwcGVyID0+IHdyYXBwZXIuc2V0UHJvcHMocHJvcHMpKVxuICB9XG5cbiAgc2V0VmFsdWUgKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93RXJyb3JJZldyYXBwZXJzSXNFbXB0eSgnc2V0VmFsdWUnKVxuXG4gICAgdGhpcy53cmFwcGVycy5mb3JFYWNoKHdyYXBwZXIgPT4gd3JhcHBlci5zZXRWYWx1ZSh2YWx1ZSkpXG4gIH1cblxuICBzZXRDaGVja2VkIChjaGVja2VkOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMudGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5KCdzZXRDaGVja2VkJylcblxuICAgIHRoaXMud3JhcHBlcnMuZm9yRWFjaCh3cmFwcGVyID0+IHdyYXBwZXIuc2V0Q2hlY2tlZChjaGVja2VkKSlcbiAgfVxuXG4gIHNldFNlbGVjdGVkICgpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93RXJyb3JJZldyYXBwZXJzSXNFbXB0eSgnc2V0U2VsZWN0ZWQnKVxuXG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBzZXRTZWxlY3RlZCBtdXN0IGJlIGNhbGxlZCBvbiBhIHNpbmdsZSB3cmFwcGVyLCBgICtcbiAgICAgICAgYHVzZSBhdChpKSB0byBhY2Nlc3MgYSB3cmFwcGVyYFxuICAgIClcbiAgfVxuXG4gIHRyaWdnZXIgKGV2ZW50OiBzdHJpbmcsIG9wdGlvbnM6IE9iamVjdCk6IHZvaWQge1xuICAgIHRoaXMudGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5KCd0cmlnZ2VyJylcblxuICAgIHRoaXMud3JhcHBlcnMuZm9yRWFjaCh3cmFwcGVyID0+IHdyYXBwZXIudHJpZ2dlcihldmVudCwgb3B0aW9ucykpXG4gIH1cblxuICB1cGRhdGUgKCk6IHZvaWQge1xuICAgIHRoaXMudGhyb3dFcnJvcklmV3JhcHBlcnNJc0VtcHR5KCd1cGRhdGUnKVxuICAgIHdhcm4oXG4gICAgICBgdXBkYXRlIGhhcyBiZWVuIHJlbW92ZWQuIEFsbCBjaGFuZ2VzIGFyZSBub3cgYCArXG4gICAgICAgIGBzeW5jaHJub3VzIHdpdGhvdXQgY2FsbGluZyB1cGRhdGVgXG4gICAgKVxuICB9XG5cbiAgZGVzdHJveSAoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0Vycm9ySWZXcmFwcGVyc0lzRW1wdHkoJ2Rlc3Ryb3knKVxuXG4gICAgdGhpcy53cmFwcGVycy5mb3JFYWNoKHdyYXBwZXIgPT4gd3JhcHBlci5kZXN0cm95KCkpXG4gIH1cbn1cbiIsIi8vIEBmbG93XG5cbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdzaGFyZWQvdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JXcmFwcGVyIGltcGxlbWVudHMgQmFzZVdyYXBwZXIge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yIChzZWxlY3Rvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yXG4gIH1cblxuICBhdCAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7dGhpcy5zZWxlY3Rvcn0sIGNhbm5vdCBjYWxsIGF0KCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBhdHRyaWJ1dGVzICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgYXR0cmlidXRlcygpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgY2xhc3NlcyAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIGNsYXNzZXMoKSBvbiBlbXB0eSBXcmFwcGVyYFxuICAgIClcbiAgfVxuXG4gIGNvbnRhaW5zICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgY29udGFpbnMoKSBvbiBlbXB0eSBXcmFwcGVyYFxuICAgIClcbiAgfVxuXG4gIGVtaXR0ZWQgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgZmluZCBkaWQgbm90IHJldHVybiAke1xuICAgICAgICB0aGlzLnNlbGVjdG9yXG4gICAgICB9LCBjYW5ub3QgY2FsbCBlbWl0dGVkKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBlbWl0dGVkQnlPcmRlciAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIGVtaXR0ZWRCeU9yZGVyKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBleGlzdHMgKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZmlsdGVyICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgZmlsdGVyKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICB2aXNpYmxlICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgdmlzaWJsZSgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgaGFzQXR0cmlidXRlICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgaGFzQXR0cmlidXRlKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBoYXNDbGFzcyAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIGhhc0NsYXNzKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBoYXNQcm9wICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgaGFzUHJvcCgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgaGFzU3R5bGUgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgZmluZCBkaWQgbm90IHJldHVybiAke1xuICAgICAgICB0aGlzLnNlbGVjdG9yXG4gICAgICB9LCBjYW5ub3QgY2FsbCBoYXNTdHlsZSgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgZmluZEFsbCAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIGZpbmRBbGwoKSBvbiBlbXB0eSBXcmFwcGVyYFxuICAgIClcbiAgfVxuXG4gIGZpbmQgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgZmluZCBkaWQgbm90IHJldHVybiAke1xuICAgICAgICB0aGlzLnNlbGVjdG9yXG4gICAgICB9LCBjYW5ub3QgY2FsbCBmaW5kKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBodG1sICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgaHRtbCgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgaXMgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgZmluZCBkaWQgbm90IHJldHVybiAke3RoaXMuc2VsZWN0b3J9LCBjYW5ub3QgY2FsbCBpcygpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgaXNFbXB0eSAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIGlzRW1wdHkoKSBvbiBlbXB0eSBXcmFwcGVyYFxuICAgIClcbiAgfVxuXG4gIGlzVmlzaWJsZSAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIGlzVmlzaWJsZSgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgaXNWdWVJbnN0YW5jZSAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIGlzVnVlSW5zdGFuY2UoKSBvbiBlbXB0eSBXcmFwcGVyYFxuICAgIClcbiAgfVxuXG4gIG5hbWUgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgZmluZCBkaWQgbm90IHJldHVybiAke1xuICAgICAgICB0aGlzLnNlbGVjdG9yXG4gICAgICB9LCBjYW5ub3QgY2FsbCBuYW1lKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBwcm9wcyAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIHByb3BzKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICB0ZXh0ICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgdGV4dCgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgc2V0Q29tcHV0ZWQgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgZmluZCBkaWQgbm90IHJldHVybiAke1xuICAgICAgICB0aGlzLnNlbGVjdG9yXG4gICAgICB9LCBjYW5ub3QgY2FsbCBzZXRDb21wdXRlZCgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgc2V0RGF0YSAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIHNldERhdGEoKSBvbiBlbXB0eSBXcmFwcGVyYFxuICAgIClcbiAgfVxuXG4gIHNldE1ldGhvZHMgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgZmluZCBkaWQgbm90IHJldHVybiAke1xuICAgICAgICB0aGlzLnNlbGVjdG9yXG4gICAgICB9LCBjYW5ub3QgY2FsbCBzZXRNZXRob2RzKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBzZXRQcm9wcyAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIHNldFByb3BzKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBzZXRWYWx1ZSAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIHNldFZhbHVlKCkgb24gZW1wdHkgV3JhcHBlcmBcbiAgICApXG4gIH1cblxuICBzZXRDaGVja2VkICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgc2V0Q2hlY2tlZCgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgc2V0U2VsZWN0ZWQgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgZmluZCBkaWQgbm90IHJldHVybiAke1xuICAgICAgICB0aGlzLnNlbGVjdG9yXG4gICAgICB9LCBjYW5ub3QgY2FsbCBzZXRTZWxlY3RlZCgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG5cbiAgdHJpZ2dlciAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGBmaW5kIGRpZCBub3QgcmV0dXJuICR7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JcbiAgICAgIH0sIGNhbm5vdCBjYWxsIHRyaWdnZXIoKSBvbiBlbXB0eSBXcmFwcGVyYFxuICAgIClcbiAgfVxuXG4gIHVwZGF0ZSAoKTogdm9pZCB7XG4gICAgdGhyb3dFcnJvcihcbiAgICAgIGB1cGRhdGUgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHZ1ZS10ZXN0LXV0aWxzLmAgK1xuICAgICAgYEFsbCB1cGRhdGVzIGFyZSBub3cgc3luY2hyb25vdXMgYnkgZGVmYXVsdGBcbiAgICApXG4gIH1cblxuICBkZXN0cm95ICgpOiB2b2lkIHtcbiAgICB0aHJvd0Vycm9yKFxuICAgICAgYGZpbmQgZGlkIG5vdCByZXR1cm4gJHtcbiAgICAgICAgdGhpcy5zZWxlY3RvclxuICAgICAgfSwgY2Fubm90IGNhbGwgZGVzdHJveSgpIG9uIGVtcHR5IFdyYXBwZXJgXG4gICAgKVxuICB9XG59XG4iLCIvLyBAZmxvd1xuXG5pbXBvcnQgeyBSRUZfU0VMRUNUT1IgfSBmcm9tICcuL2NvbnN0cydcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdzaGFyZWQvdXRpbCdcblxuZnVuY3Rpb24gZmluZEFsbFZOb2RlcyAodm5vZGU6IFZOb2RlLCBub2RlczogQXJyYXk8Vk5vZGU+ID0gW10pOiBBcnJheTxWTm9kZT4ge1xuICBub2Rlcy5wdXNoKHZub2RlKVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHZub2RlLmNoaWxkcmVuKSkge1xuICAgIHZub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGRWTm9kZSA9PiB7XG4gICAgICBmaW5kQWxsVk5vZGVzKGNoaWxkVk5vZGUsIG5vZGVzKVxuICAgIH0pXG4gIH1cblxuICBpZiAodm5vZGUuY2hpbGQpIHtcbiAgICBmaW5kQWxsVk5vZGVzKHZub2RlLmNoaWxkLl92bm9kZSwgbm9kZXMpXG4gIH1cblxuICByZXR1cm4gbm9kZXNcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRHVwbGljYXRlTm9kZXMgKHZOb2RlczogQXJyYXk8Vk5vZGU+KTogQXJyYXk8Vk5vZGU+IHtcbiAgY29uc3Qgdk5vZGVFbG1zID0gdk5vZGVzLm1hcCh2Tm9kZSA9PiB2Tm9kZS5lbG0pXG4gIHJldHVybiB2Tm9kZXMuZmlsdGVyKFxuICAgICh2Tm9kZSwgaW5kZXgpID0+IGluZGV4ID09PSB2Tm9kZUVsbXMuaW5kZXhPZih2Tm9kZS5lbG0pXG4gIClcbn1cblxuZnVuY3Rpb24gbm9kZU1hdGNoZXNSZWYgKG5vZGU6IFZOb2RlLCByZWZOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUuZGF0YSAmJiBub2RlLmRhdGEucmVmID09PSByZWZOYW1lXG59XG5cbmZ1bmN0aW9uIGZpbmRWTm9kZXNCeVJlZiAodk5vZGU6IFZOb2RlLCByZWZOYW1lOiBzdHJpbmcpOiBBcnJheTxWTm9kZT4ge1xuICBjb25zdCBub2RlcyA9IGZpbmRBbGxWTm9kZXModk5vZGUpXG4gIGNvbnN0IHJlZkZpbHRlcmVkTm9kZXMgPSBub2Rlcy5maWx0ZXIobm9kZSA9PiBub2RlTWF0Y2hlc1JlZihub2RlLCByZWZOYW1lKSlcbiAgLy8gT25seSByZXR1cm4gcmVmcyBkZWZpbmVkIG9uIHRvcC1sZXZlbCBWTm9kZSB0byBwcm92aWRlIHRoZSBzYW1lXG4gIC8vIGJlaGF2aW9yIGFzIHNlbGVjdGluZyB2aWEgdm0uJHJlZi57c29tZVJlZk5hbWV9XG4gIGNvbnN0IG1haW5WTm9kZUZpbHRlcmVkTm9kZXMgPSByZWZGaWx0ZXJlZE5vZGVzLmZpbHRlcihcbiAgICBub2RlID0+ICEhdk5vZGUuY29udGV4dC4kcmVmc1tub2RlLmRhdGEucmVmXVxuICApXG4gIHJldHVybiByZW1vdmVEdXBsaWNhdGVOb2RlcyhtYWluVk5vZGVGaWx0ZXJlZE5vZGVzKVxufVxuXG5mdW5jdGlvbiBub2RlTWF0Y2hlc1NlbGVjdG9yIChub2RlOiBWTm9kZSwgc2VsZWN0b3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbm9kZS5lbG0gJiYgbm9kZS5lbG0uZ2V0QXR0cmlidXRlICYmIG5vZGUuZWxtLm1hdGNoZXMoc2VsZWN0b3IpXG59XG5cbmZ1bmN0aW9uIGZpbmRWTm9kZXNCeVNlbGVjdG9yICh2Tm9kZTogVk5vZGUsIHNlbGVjdG9yOiBzdHJpbmcpOiBBcnJheTxWTm9kZT4ge1xuICBjb25zdCBub2RlcyA9IGZpbmRBbGxWTm9kZXModk5vZGUpXG4gIGNvbnN0IGZpbHRlcmVkTm9kZXMgPSBub2Rlcy5maWx0ZXIobm9kZSA9PlxuICAgIG5vZGVNYXRjaGVzU2VsZWN0b3Iobm9kZSwgc2VsZWN0b3IpXG4gIClcbiAgcmV0dXJuIHJlbW92ZUR1cGxpY2F0ZU5vZGVzKGZpbHRlcmVkTm9kZXMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbmRWbm9kZXMgKFxuICB2bm9kZTogVk5vZGUsXG4gIHZtOiBDb21wb25lbnQgfCB2b2lkLFxuICBzZWxlY3RvclR5cGU6ID9zdHJpbmcsXG4gIHNlbGVjdG9yOiBPYmplY3QgfCBzdHJpbmdcbik6IEFycmF5PFZOb2RlPiB7XG4gIGlmIChzZWxlY3RvclR5cGUgPT09IFJFRl9TRUxFQ1RPUikge1xuICAgIGlmICghdm0pIHtcbiAgICAgIHRocm93RXJyb3IoXG4gICAgICAgIGAkcmVmIHNlbGVjdG9ycyBjYW4gb25seSBiZSB1c2VkIG9uIFZ1ZSBjb21wb25lbnQgYCArIGB3cmFwcGVyc2BcbiAgICAgIClcbiAgICB9XG4gICAgLy8gJEZsb3dJZ25vcmVcbiAgICByZXR1cm4gZmluZFZOb2Rlc0J5UmVmKHZub2RlLCBzZWxlY3Rvci5yZWYpXG4gIH1cbiAgLy8gJEZsb3dJZ25vcmVcbiAgcmV0dXJuIGZpbmRWTm9kZXNCeVNlbGVjdG9yKHZub2RlLCBzZWxlY3Rvcilcbn1cbiIsIi8vIEBmbG93XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbmRET01Ob2RlcyAoXG4gIGVsZW1lbnQ6IEVsZW1lbnQgfCBudWxsLFxuICBzZWxlY3Rvcjogc3RyaW5nXG4pOiBBcnJheTxWTm9kZT4ge1xuICBjb25zdCBub2RlcyA9IFtdXG4gIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsIHx8ICFlbGVtZW50Lm1hdGNoZXMpIHtcbiAgICByZXR1cm4gbm9kZXNcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgbm9kZXMucHVzaChlbGVtZW50KVxuICB9XG4gIC8vICRGbG93SWdub3JlXG4gIHJldHVybiBub2Rlcy5jb25jYXQoW10uc2xpY2UuY2FsbChlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSlcbn1cbiIsIi8vIEBmbG93XG5cbmltcG9ydCBmaW5kVm5vZGVzIGZyb20gJy4vZmluZC12bm9kZXMnXG5pbXBvcnQgZmluZFZ1ZUNvbXBvbmVudHMgZnJvbSAnLi9maW5kLXZ1ZS1jb21wb25lbnRzJ1xuaW1wb3J0IGZpbmRET01Ob2RlcyBmcm9tICcuL2ZpbmQtZG9tLW5vZGVzJ1xuaW1wb3J0IHsgQ09NUE9ORU5UX1NFTEVDVE9SLCBOQU1FX1NFTEVDVE9SLCBET01fU0VMRUNUT1IgfSBmcm9tICcuL2NvbnN0cydcbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xuaW1wb3J0IGdldFNlbGVjdG9yVHlwZU9yVGhyb3cgZnJvbSAnLi9nZXQtc2VsZWN0b3ItdHlwZSdcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdzaGFyZWQvdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmluZCAoXG4gIHZtOiBDb21wb25lbnQgfCB2b2lkLFxuICB2bm9kZTogVk5vZGUgfCBudWxsLFxuICBlbGVtZW50OiBFbGVtZW50LFxuICBzZWxlY3RvcjogU2VsZWN0b3Jcbik6IEFycmF5PFZOb2RlIHwgQ29tcG9uZW50PiB7XG4gIGNvbnN0IHNlbGVjdG9yVHlwZSA9IGdldFNlbGVjdG9yVHlwZU9yVGhyb3coc2VsZWN0b3IsICdmaW5kJylcblxuICBpZiAoIXZub2RlICYmICF2bSAmJiBzZWxlY3RvclR5cGUgIT09IERPTV9TRUxFQ1RPUikge1xuICAgIHRocm93RXJyb3IoXG4gICAgICBgY2Fubm90IGZpbmQgYSBWdWUgaW5zdGFuY2Ugb24gYSBET00gbm9kZS4gVGhlIG5vZGUgYCArXG4gICAgICAgIGB5b3UgYXJlIGNhbGxpbmcgZmluZCBvbiBkb2VzIG5vdCBleGlzdCBpbiB0aGUgYCArXG4gICAgICAgIGBWRG9tLiBBcmUgeW91IGFkZGluZyB0aGUgbm9kZSBhcyBpbm5lckhUTUw/YFxuICAgIClcbiAgfVxuXG4gIGlmIChzZWxlY3RvclR5cGUgPT09IENPTVBPTkVOVF9TRUxFQ1RPUiB8fCBzZWxlY3RvclR5cGUgPT09IE5BTUVfU0VMRUNUT1IpIHtcbiAgICBjb25zdCByb290ID0gdm0gfHwgdm5vZGVcbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICByZXR1cm4gZmluZFZ1ZUNvbXBvbmVudHMocm9vdCwgc2VsZWN0b3JUeXBlLCBzZWxlY3RvcilcbiAgfVxuXG4gIGlmIChcbiAgICB2bSAmJlxuICAgIHZtLiRyZWZzICYmXG4gICAgc2VsZWN0b3IucmVmIGluIHZtLiRyZWZzICYmXG4gICAgdm0uJHJlZnNbc2VsZWN0b3IucmVmXSBpbnN0YW5jZW9mIFZ1ZVxuICApIHtcbiAgICByZXR1cm4gW3ZtLiRyZWZzW3NlbGVjdG9yLnJlZl1dXG4gIH1cblxuICBpZiAodm5vZGUpIHtcbiAgICBjb25zdCBub2RlcyA9IGZpbmRWbm9kZXModm5vZGUsIHZtLCBzZWxlY3RvclR5cGUsIHNlbGVjdG9yKVxuICAgIGlmIChzZWxlY3RvclR5cGUgIT09IERPTV9TRUxFQ1RPUikge1xuICAgICAgcmV0dXJuIG5vZGVzXG4gICAgfVxuICAgIHJldHVybiBub2Rlcy5sZW5ndGggPiAwID8gbm9kZXMgOiBmaW5kRE9NTm9kZXMoZWxlbWVudCwgc2VsZWN0b3IpXG4gIH1cblxuICByZXR1cm4gZmluZERPTU5vZGVzKGVsZW1lbnQsIHNlbGVjdG9yKVxufVxuIiwiLy8gQGZsb3dcblxuaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXG5pbXBvcnQgV3JhcHBlciBmcm9tICcuL3dyYXBwZXInXG5pbXBvcnQgVnVlV3JhcHBlciBmcm9tICcuL3Z1ZS13cmFwcGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVXcmFwcGVyIChcbiAgbm9kZTogVk5vZGUgfCBDb21wb25lbnQsXG4gIG9wdGlvbnM6IFdyYXBwZXJPcHRpb25zXG4pOiBWdWVXcmFwcGVyIHwgV3JhcHBlciB7XG4gIGNvbnN0IGNvbXBvbmVudEluc3RhbmNlID0gbm9kZS5jb21wb25lbnRJbnN0YW5jZSB8fCBub2RlLmNoaWxkXG4gIGlmIChjb21wb25lbnRJbnN0YW5jZSkge1xuICAgIHJldHVybiBuZXcgVnVlV3JhcHBlcihjb21wb25lbnRJbnN0YW5jZSwgb3B0aW9ucylcbiAgfVxuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIFZ1ZVxuICAgID8gbmV3IFZ1ZVdyYXBwZXIobm9kZSwgb3B0aW9ucylcbiAgICA6IG5ldyBXcmFwcGVyKG5vZGUsIG9wdGlvbnMpXG59XG4iLCIvLyBAZmxvd1xuXG5sZXQgaSA9IDBcblxuZnVuY3Rpb24gb3JkZXJEZXBzICh3YXRjaGVyKTogdm9pZCB7XG4gIHdhdGNoZXIuZGVwcy5mb3JFYWNoKGRlcCA9PiB7XG4gICAgaWYgKGRlcC5fc29ydGVkSWQgPT09IGkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBkZXAuX3NvcnRlZElkID0gaVxuICAgIGRlcC5zdWJzLmZvckVhY2gob3JkZXJEZXBzKVxuICAgIGRlcC5zdWJzID0gZGVwLnN1YnMuc29ydCgoYSwgYikgPT4gYS5pZCAtIGIuaWQpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG9yZGVyVm1XYXRjaGVycyAodm06IENvbXBvbmVudCk6IHZvaWQge1xuICBpZiAodm0uX3dhdGNoZXJzKSB7XG4gICAgdm0uX3dhdGNoZXJzLmZvckVhY2gob3JkZXJEZXBzKVxuICB9XG5cbiAgaWYgKHZtLl9jb21wdXRlZFdhdGNoZXJzKSB7XG4gICAgT2JqZWN0LmtleXModm0uX2NvbXB1dGVkV2F0Y2hlcnMpLmZvckVhY2goY29tcHV0ZWRXYXRjaGVyID0+IHtcbiAgICAgIG9yZGVyRGVwcyh2bS5fY29tcHV0ZWRXYXRjaGVyc1tjb21wdXRlZFdhdGNoZXJdKVxuICAgIH0pXG4gIH1cblxuICB2bS5fd2F0Y2hlciAmJiBvcmRlckRlcHModm0uX3dhdGNoZXIpXG5cbiAgdm0uJGNoaWxkcmVuLmZvckVhY2gob3JkZXJWbVdhdGNoZXJzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3JkZXJXYXRjaGVycyAodm06IENvbXBvbmVudCk6IHZvaWQge1xuICBvcmRlclZtV2F0Y2hlcnModm0pXG4gIGkrK1xufVxuIiwiLy8gQGZsb3dcblxuaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXG5pbXBvcnQgbWVyZ2VXaXRoIGZyb20gJ2xvZGFzaC9tZXJnZVdpdGgnXG5pbXBvcnQgZ2V0U2VsZWN0b3JUeXBlT3JUaHJvdyBmcm9tICcuL2dldC1zZWxlY3Rvci10eXBlJ1xuaW1wb3J0IHtcbiAgUkVGX1NFTEVDVE9SLFxuICBDT01QT05FTlRfU0VMRUNUT1IsXG4gIE5BTUVfU0VMRUNUT1IsXG4gIEZVTkNUSU9OQUxfT1BUSU9OU1xufSBmcm9tICcuL2NvbnN0cydcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnXG5pbXBvcnQge1xuICB2bUN0b3JNYXRjaGVzTmFtZSxcbiAgdm1DdG9yTWF0Y2hlc1NlbGVjdG9yLFxuICB2bUZ1bmN0aW9uYWxDdG9yTWF0Y2hlc1NlbGVjdG9yXG59IGZyb20gJy4vZmluZC12dWUtY29tcG9uZW50cydcbmltcG9ydCBXcmFwcGVyQXJyYXkgZnJvbSAnLi93cmFwcGVyLWFycmF5J1xuaW1wb3J0IEVycm9yV3JhcHBlciBmcm9tICcuL2Vycm9yLXdyYXBwZXInXG5pbXBvcnQgeyB0aHJvd0Vycm9yLCB3YXJuIH0gZnJvbSAnc2hhcmVkL3V0aWwnXG5pbXBvcnQgZmluZEFsbCBmcm9tICcuL2ZpbmQnXG5pbXBvcnQgY3JlYXRlV3JhcHBlciBmcm9tICcuL2NyZWF0ZS13cmFwcGVyJ1xuaW1wb3J0IHsgb3JkZXJXYXRjaGVycyB9IGZyb20gJy4vb3JkZXItd2F0Y2hlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdyYXBwZXIgaW1wbGVtZW50cyBCYXNlV3JhcHBlciB7XG4gICt2bm9kZTogVk5vZGUgfCBudWxsO1xuICArdm06IENvbXBvbmVudCB8IHZvaWQ7XG4gIF9lbWl0dGVkOiB7IFtuYW1lOiBzdHJpbmddOiBBcnJheTxBcnJheTxhbnk+PiB9O1xuICBfZW1pdHRlZEJ5T3JkZXI6IEFycmF5PHsgbmFtZTogc3RyaW5nLCBhcmdzOiBBcnJheTxhbnk+IH0+O1xuICArZWxlbWVudDogRWxlbWVudDtcbiAgdXBkYXRlOiBGdW5jdGlvbjtcbiAgK29wdGlvbnM6IFdyYXBwZXJPcHRpb25zO1xuICB2ZXJzaW9uOiBudW1iZXI7XG4gIGlzRnVuY3Rpb25hbENvbXBvbmVudDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvciAoXG4gICAgbm9kZTogVk5vZGUgfCBFbGVtZW50LFxuICAgIG9wdGlvbnM6IFdyYXBwZXJPcHRpb25zLFxuICAgIGlzVnVlV3JhcHBlcj86IGJvb2xlYW5cbiAgKSB7XG4gICAgY29uc3Qgdm5vZGUgPSBub2RlIGluc3RhbmNlb2YgRWxlbWVudCA/IG51bGwgOiBub2RlXG4gICAgY29uc3QgZWxlbWVudCA9IG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ID8gbm9kZSA6IG5vZGUuZWxtXG4gICAgLy8gUHJldmVudCByZWRlZmluZSBieSBWdWVXcmFwcGVyXG4gICAgaWYgKCFpc1Z1ZVdyYXBwZXIpIHtcbiAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Zub2RlJywge1xuICAgICAgICBnZXQ6ICgpID0+IHZub2RlLFxuICAgICAgICBzZXQ6ICgpID0+IHRocm93RXJyb3IoJ3dyYXBwZXIudm5vZGUgaXMgcmVhZC1vbmx5JylcbiAgICAgIH0pXG4gICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdlbGVtZW50Jywge1xuICAgICAgICBnZXQ6ICgpID0+IGVsZW1lbnQsXG4gICAgICAgIHNldDogKCkgPT4gdGhyb3dFcnJvcignd3JhcHBlci5lbGVtZW50IGlzIHJlYWQtb25seScpXG4gICAgICB9KVxuICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndm0nLCB7XG4gICAgICAgIGdldDogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBzZXQ6ICgpID0+IHRocm93RXJyb3IoJ3dyYXBwZXIudm0gaXMgcmVhZC1vbmx5JylcbiAgICAgIH0pXG4gICAgfVxuICAgIGNvbnN0IGZyb3plbk9wdGlvbnMgPSBPYmplY3QuZnJlZXplKG9wdGlvbnMpXG4gICAgLy8gJEZsb3dJZ25vcmVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29wdGlvbnMnLCB7XG4gICAgICBnZXQ6ICgpID0+IGZyb3plbk9wdGlvbnMsXG4gICAgICBzZXQ6ICgpID0+IHRocm93RXJyb3IoJ3dyYXBwZXIub3B0aW9ucyBpcyByZWFkLW9ubHknKVxuICAgIH0pXG4gICAgaWYgKFxuICAgICAgdGhpcy52bm9kZSAmJlxuICAgICAgKHRoaXMudm5vZGVbRlVOQ1RJT05BTF9PUFRJT05TXSB8fCB0aGlzLnZub2RlLmZ1bmN0aW9uYWxDb250ZXh0KVxuICAgICkge1xuICAgICAgdGhpcy5pc0Z1bmN0aW9uYWxDb21wb25lbnQgPSB0cnVlXG4gICAgfVxuICAgIHRoaXMudmVyc2lvbiA9IE51bWJlcihcbiAgICAgIGAke1Z1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF19LiR7VnVlLnZlcnNpb24uc3BsaXQoJy4nKVsxXX1gXG4gICAgKVxuICB9XG5cbiAgYXQgKCk6IHZvaWQge1xuICAgIHRocm93RXJyb3IoJ2F0KCkgbXVzdCBiZSBjYWxsZWQgb24gYSBXcmFwcGVyQXJyYXknKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gT2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBhdHRyaWJ1dGUvdmFsdWUgcGFpcnMgb24gdGhlIGVsZW1lbnQuXG4gICAqL1xuICBhdHRyaWJ1dGVzICgpOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgY29uc3QgYXR0cmlidXRlTWFwID0ge31cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dCA9IGF0dHJpYnV0ZXMuaXRlbShpKVxuICAgICAgYXR0cmlidXRlTWFwW2F0dC5sb2NhbE5hbWVdID0gYXR0LnZhbHVlXG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGVNYXBcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBjbGFzc2VzIG9uIHRoZSBlbGVtZW50XG4gICAqL1xuICBjbGFzc2VzICgpOiBBcnJheTxzdHJpbmc+IHtcbiAgICBjb25zdCBjbGFzc05hbWUgPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gICAgbGV0IGNsYXNzZXMgPSBjbGFzc05hbWUgPyBjbGFzc05hbWUuc3BsaXQoJyAnKSA6IFtdXG4gICAgLy8gSGFuZGxlIGNvbnZlcnRpbmcgY3NzbW9kdWxlcyBpZGVudGlmaWVycyBiYWNrIHRvIHRoZSBvcmlnaW5hbCBjbGFzcyBuYW1lXG4gICAgaWYgKHRoaXMudm0gJiYgdGhpcy52bS4kc3R5bGUpIHtcbiAgICAgIGNvbnN0IGNzc01vZHVsZUlkZW50aWZpZXJzID0ge31cbiAgICAgIGxldCBtb2R1bGVJZGVudFxuICAgICAgT2JqZWN0LmtleXModGhpcy52bS4kc3R5bGUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbW9kdWxlSWRlbnQgPSB0aGlzLnZtICYmIHRoaXMudm0uJHN0eWxlW2tleV1cbiAgICAgICAgLy8gQ1NTIE1vZHVsZXMgbWF5IGJlIG11bHRpLWNsYXNzIGlmIHRoZXkgZXh0ZW5kIG90aGVycy5cbiAgICAgICAgLy8gRXh0ZW5kZWQgY2xhc3NlcyBzaG91bGQgYmUgYWxyZWFkeSBwcmVzZW50IGluICRzdHlsZS5cbiAgICAgICAgaWYgKG1vZHVsZUlkZW50KSB7XG4gICAgICAgICAgbW9kdWxlSWRlbnQgPSBtb2R1bGVJZGVudC5zcGxpdCgnICcpWzBdXG4gICAgICAgICAgY3NzTW9kdWxlSWRlbnRpZmllcnNbbW9kdWxlSWRlbnRdID0ga2V5XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBjbGFzc2VzID0gY2xhc3Nlcy5tYXAoXG4gICAgICAgIGNsYXNzTmFtZSA9PiBjc3NNb2R1bGVJZGVudGlmaWVyc1tjbGFzc05hbWVdIHx8IGNsYXNzTmFtZVxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gY2xhc3Nlc1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB3cmFwcGVyIGNvbnRhaW5zIHByb3ZpZGVkIHNlbGVjdG9yLlxuICAgKi9cbiAgY29udGFpbnMgKHNlbGVjdG9yOiBTZWxlY3Rvcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHNlbGVjdG9yVHlwZSA9IGdldFNlbGVjdG9yVHlwZU9yVGhyb3coc2VsZWN0b3IsICdjb250YWlucycpXG4gICAgY29uc3Qgbm9kZXMgPSBmaW5kQWxsKHRoaXMudm0sIHRoaXMudm5vZGUsIHRoaXMuZWxlbWVudCwgc2VsZWN0b3IpXG4gICAgY29uc3QgaXMgPSBzZWxlY3RvclR5cGUgPT09IFJFRl9TRUxFQ1RPUiA/IGZhbHNlIDogdGhpcy5pcyhzZWxlY3RvcilcbiAgICByZXR1cm4gbm9kZXMubGVuZ3RoID4gMCB8fCBpc1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgY3VzdG9tIGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBXcmFwcGVyIHZtXG4gICAqL1xuICBlbWl0dGVkIChcbiAgICBldmVudD86IHN0cmluZ1xuICApOiBBcnJheTxBcnJheTxhbnk+PiB8IHsgW25hbWU6IHN0cmluZ106IEFycmF5PEFycmF5PGFueT4+IH0ge1xuICAgIGlmICghdGhpcy5fZW1pdHRlZCAmJiAhdGhpcy52bSkge1xuICAgICAgdGhyb3dFcnJvcihgd3JhcHBlci5lbWl0dGVkKCkgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIGEgVnVlIGluc3RhbmNlYClcbiAgICB9XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5fZW1pdHRlZFtldmVudF1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VtaXR0ZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEFycmF5IGNvbnRhaW5pbmcgY3VzdG9tIGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBXcmFwcGVyIHZtXG4gICAqL1xuICBlbWl0dGVkQnlPcmRlciAoKTogQXJyYXk8eyBuYW1lOiBzdHJpbmcsIGFyZ3M6IEFycmF5PGFueT4gfT4ge1xuICAgIGlmICghdGhpcy5fZW1pdHRlZEJ5T3JkZXIgJiYgIXRoaXMudm0pIHtcbiAgICAgIHRocm93RXJyb3IoXG4gICAgICAgIGB3cmFwcGVyLmVtaXR0ZWRCeU9yZGVyKCkgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIGEgVnVlIGluc3RhbmNlYFxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZW1pdHRlZEJ5T3JkZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGNoZWNrIHdyYXBwZXIgZXhpc3RzLiBSZXR1cm5zIHRydWUgYXMgV3JhcHBlciBhbHdheXMgZXhpc3RzXG4gICAqL1xuICBleGlzdHMgKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnZtKSB7XG4gICAgICByZXR1cm4gISF0aGlzLnZtICYmICF0aGlzLnZtLl9pc0Rlc3Ryb3llZFxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZmlsdGVyICgpIHtcbiAgICB0aHJvd0Vycm9yKCdmaWx0ZXIoKSBtdXN0IGJlIGNhbGxlZCBvbiBhIFdyYXBwZXJBcnJheScpXG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSB0byBjaGVjayB3cmFwcGVyIGlzIHZpc2libGUuIFJldHVybnMgZmFsc2UgaWYgYSBwYXJlbnRcbiAgICogZWxlbWVudCBoYXMgZGlzcGxheTogbm9uZSBvciB2aXNpYmlsaXR5OiBoaWRkZW4gc3R5bGUuXG4gICAqL1xuICB2aXNpYmxlICgpOiBib29sZWFuIHtcbiAgICB3YXJuKFxuICAgICAgYHZpc2libGUgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGAgK1xuICAgICAgICBgdmVyc2lvbiAxLCB1c2UgaXNWaXNpYmxlIGluc3RlYWRgXG4gICAgKVxuICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50XG4gICAgd2hpbGUgKGVsZW1lbnQpIHtcbiAgICAgIGlmIChcbiAgICAgICAgZWxlbWVudC5zdHlsZSAmJlxuICAgICAgICAoZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID09PSAnaGlkZGVuJyB8fFxuICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHdyYXBwZXIgaGFzIGFuIGF0dHJpYnV0ZSB3aXRoIG1hdGNoaW5nIHZhbHVlXG4gICAqL1xuICBoYXNBdHRyaWJ1dGUgKGF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgd2FybihcbiAgICAgIGBoYXNBdHRyaWJ1dGUoKSBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIGAgK1xuICAgICAgYHJlbW92ZWQgaW4gdmVyc2lvbiAxLjAuMC4gVXNlIGF0dHJpYnV0ZXMoKSBgICtcbiAgICAgIGBpbnN0ZWFk4oCUaHR0cHM6Ly92dWUtdGVzdC11dGlscy52dWVqcy5vcmcvYXBpL3dyYXBwZXIvI2F0dHJpYnV0ZXNgXG4gICAgKVxuXG4gICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvd0Vycm9yKFxuICAgICAgICBgd3JhcHBlci5oYXNBdHRyaWJ1dGUoKSBtdXN0IGJlIHBhc3NlZCBhdHRyaWJ1dGUgYXMgYSBzdHJpbmdgXG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93RXJyb3IoXG4gICAgICAgIGB3cmFwcGVyLmhhc0F0dHJpYnV0ZSgpIG11c3QgYmUgcGFzc2VkIHZhbHVlIGFzIGEgc3RyaW5nYFxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAhISh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgPT09IHZhbHVlKVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgd3JhcHBlciBoYXMgYSBjbGFzcyBuYW1lXG4gICAqL1xuICBoYXNDbGFzcyAoY2xhc3NOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB3YXJuKFxuICAgICAgYGhhc0NsYXNzKCkgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGAgK1xuICAgICAgYGluIHZlcnNpb24gMS4wLjAuIFVzZSBjbGFzc2VzKCkgYCArXG4gICAgICBgaW5zdGVhZOKAlGh0dHBzOi8vdnVlLXRlc3QtdXRpbHMudnVlanMub3JnL2FwaS93cmFwcGVyLyNjbGFzc2VzYFxuICAgIClcbiAgICBsZXQgdGFyZ2V0Q2xhc3MgPSBjbGFzc05hbWVcblxuICAgIGlmICh0eXBlb2YgdGFyZ2V0Q2xhc3MgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvd0Vycm9yKCd3cmFwcGVyLmhhc0NsYXNzKCkgbXVzdCBiZSBwYXNzZWQgYSBzdHJpbmcnKVxuICAgIH1cblxuICAgIC8vIGlmICRzdHlsZSBpcyBhdmFpbGFibGUgYW5kIGhhcyBhIG1hdGNoaW5nIHRhcmdldCwgdXNlIHRoYXQgaW5zdGVhZC5cbiAgICBpZiAodGhpcy52bSAmJiB0aGlzLnZtLiRzdHlsZSAmJiB0aGlzLnZtLiRzdHlsZVt0YXJnZXRDbGFzc10pIHtcbiAgICAgIHRhcmdldENsYXNzID0gdGhpcy52bS4kc3R5bGVbdGFyZ2V0Q2xhc3NdXG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbnNBbGxDbGFzc2VzID0gdGFyZ2V0Q2xhc3NcbiAgICAgIC5zcGxpdCgnICcpXG4gICAgICAuZXZlcnkodGFyZ2V0ID0+IHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnModGFyZ2V0KSlcblxuICAgIHJldHVybiAhISh0aGlzLmVsZW1lbnQgJiYgY29udGFpbnNBbGxDbGFzc2VzKVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgd3JhcHBlciBoYXMgYSBwcm9wIG5hbWVcbiAgICovXG4gIGhhc1Byb3AgKHByb3A6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHdhcm4oXG4gICAgICBgaGFzUHJvcCgpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBgICtcbiAgICAgIGBpbiB2ZXJzaW9uIDEuMC4wLiBVc2UgcHJvcHMoKSBgICtcbiAgICAgIGBpbnN0ZWFk4oCUaHR0cHM6Ly92dWUtdGVzdC11dGlscy52dWVqcy5vcmcvYXBpL3dyYXBwZXIvI3Byb3BzYFxuICAgIClcblxuICAgIGlmICghdGhpcy5pc1Z1ZUluc3RhbmNlKCkpIHtcbiAgICAgIHRocm93RXJyb3IoJ3dyYXBwZXIuaGFzUHJvcCgpIG11c3QgYmUgY2FsbGVkIG9uIGEgVnVlIGluc3RhbmNlJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcm9wICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3dFcnJvcignd3JhcHBlci5oYXNQcm9wKCkgbXVzdCBiZSBwYXNzZWQgcHJvcCBhcyBhIHN0cmluZycpXG4gICAgfVxuXG4gICAgLy8gJHByb3BzIG9iamVjdCBkb2VzIG5vdCBleGlzdCBpbiBWdWUgMi4xLngsIHNvIHVzZVxuICAgIC8vICRvcHRpb25zLnByb3BzRGF0YSBpbnN0ZWFkXG4gICAgaWYgKFxuICAgICAgdGhpcy52bSAmJlxuICAgICAgdGhpcy52bS4kb3B0aW9ucyAmJlxuICAgICAgdGhpcy52bS4kb3B0aW9ucy5wcm9wc0RhdGEgJiZcbiAgICAgIHRoaXMudm0uJG9wdGlvbnMucHJvcHNEYXRhW3Byb3BdID09PSB2YWx1ZVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gISF0aGlzLnZtICYmICEhdGhpcy52bS4kcHJvcHMgJiYgdGhpcy52bS4kcHJvcHNbcHJvcF0gPT09IHZhbHVlXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHdyYXBwZXIgaGFzIGEgc3R5bGUgd2l0aCB2YWx1ZVxuICAgKi9cbiAgaGFzU3R5bGUgKHN0eWxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB3YXJuKFxuICAgICAgYGhhc1N0eWxlKCkgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGAgK1xuICAgICAgYGluIHZlcnNpb24gMS4wLjAuIFVzZSB3cmFwcGVyLmVsZW1lbnQuc3R5bGUgYCArXG4gICAgICBgaW5zdGVhZGBcbiAgICApXG5cbiAgICBpZiAodHlwZW9mIHN0eWxlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3dFcnJvcihgd3JhcHBlci5oYXNTdHlsZSgpIG11c3QgYmUgcGFzc2VkIHN0eWxlIGFzIGEgc3RyaW5nYClcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3dFcnJvcignd3JhcHBlci5oYXNDbGFzcygpIG11c3QgYmUgcGFzc2VkIHZhbHVlIGFzIHN0cmluZycpXG4gICAgfVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoXG4gICAgICBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzICYmXG4gICAgICAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnbm9kZS5qcycpIHx8XG4gICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ2pzZG9tJykpXG4gICAgKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBgd3JhcHBlci5oYXNTdHlsZSBpcyBub3QgZnVsbHkgc3VwcG9ydGVkIHdoZW4gYCArXG4gICAgICAgIGBydW5uaW5nIGpzZG9tIC0gb25seSBpbmxpbmUgc3R5bGVzIGFyZSBzdXBwb3J0ZWRgXG4gICAgICApXG4gICAgfVxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JylcbiAgICBjb25zdCBtb2NrRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICBpZiAoIShib2R5IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBtb2NrTm9kZSA9IGJvZHkuaW5zZXJ0QmVmb3JlKG1vY2tFbGVtZW50LCBudWxsKVxuICAgIC8vICRGbG93SWdub3JlIDogRmxvdyB0aGlua3Mgc3R5bGVbc3R5bGVdIHJldHVybnMgYSBudW1iZXJcbiAgICBtb2NrRWxlbWVudC5zdHlsZVtzdHlsZV0gPSB2YWx1ZVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYXR0YWNoZWRUb0RvY3VtZW50ICYmICh0aGlzLnZtIHx8IHRoaXMudm5vZGUpKSB7XG4gICAgICAvLyAkRmxvd0lnbm9yZSA6IFBvc3NpYmxlIG51bGwgdmFsdWUsIHdpbGwgYmUgcmVtb3ZlZCBpbiAxLjAuMFxuICAgICAgY29uc3Qgdm0gPSB0aGlzLnZtIHx8IHRoaXMudm5vZGUuY29udGV4dC4kcm9vdFxuICAgICAgYm9keS5pbnNlcnRCZWZvcmUodm0uJHJvb3QuX3Zub2RlLmVsbSwgbnVsbClcbiAgICB9XG5cbiAgICBjb25zdCBlbFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50KVtzdHlsZV1cbiAgICBjb25zdCBtb2NrTm9kZVN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobW9ja05vZGUpW3N0eWxlXVxuICAgIHJldHVybiAhIShlbFN0eWxlICYmIG1vY2tOb2RlU3R5bGUgJiYgZWxTdHlsZSA9PT0gbW9ja05vZGVTdHlsZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBmaXJzdCBub2RlIGluIHRyZWUgb2YgdGhlIGN1cnJlbnQgd3JhcHBlciB0aGF0XG4gICAqIG1hdGNoZXMgdGhlIHByb3ZpZGVkIHNlbGVjdG9yLlxuICAgKi9cbiAgZmluZCAoc2VsZWN0b3I6IFNlbGVjdG9yKTogV3JhcHBlciB8IEVycm9yV3JhcHBlciB7XG4gICAgY29uc3Qgbm9kZXMgPSBmaW5kQWxsKHRoaXMudm0sIHRoaXMudm5vZGUsIHRoaXMuZWxlbWVudCwgc2VsZWN0b3IpXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHNlbGVjdG9yLnJlZikge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yV3JhcHBlcihgcmVmPVwiJHtzZWxlY3Rvci5yZWZ9XCJgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBFcnJvcldyYXBwZXIoXG4gICAgICAgIHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBzZWxlY3RvciA6ICdDb21wb25lbnQnXG4gICAgICApXG4gICAgfVxuICAgIC8vIFVzaW5nIENTUyBTZWxlY3RvciwgcmV0dXJucyBhIFZ1ZVdyYXBwZXIgaW5zdGFuY2UgaWYgdGhlIHJvb3QgZWxlbWVudFxuICAgIC8vIGJpbmRzIGEgVnVlIGluc3RhbmNlLlxuICAgIGlmIChub2Rlc1swXS5lbG0gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZVdyYXBwZXIobm9kZXNbMF0sIHRoaXMub3B0aW9ucylcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBub2RlIGluIHRyZWUgb2YgdGhlIGN1cnJlbnQgd3JhcHBlciB0aGF0IG1hdGNoZXNcbiAgICogdGhlIHByb3ZpZGVkIHNlbGVjdG9yLlxuICAgKi9cbiAgZmluZEFsbCAoc2VsZWN0b3I6IFNlbGVjdG9yKTogV3JhcHBlckFycmF5IHtcbiAgICBnZXRTZWxlY3RvclR5cGVPclRocm93KHNlbGVjdG9yLCAnZmluZEFsbCcpXG4gICAgY29uc3Qgbm9kZXMgPSBmaW5kQWxsKHRoaXMudm0sIHRoaXMudm5vZGUsIHRoaXMuZWxlbWVudCwgc2VsZWN0b3IpXG4gICAgY29uc3Qgd3JhcHBlcnMgPSBub2Rlcy5tYXAobm9kZSA9PiB7XG4gICAgICAvLyBVc2luZyBDU1MgU2VsZWN0b3IsIHJldHVybnMgYSBWdWVXcmFwcGVyIGluc3RhbmNlIGlmIHRoZSByb290IGVsZW1lbnRcbiAgICAgIC8vIGJpbmRzIGEgVnVlIGluc3RhbmNlLlxuICAgICAgcmV0dXJuIG5vZGUuZWxtID09PSB0aGlzLmVsZW1lbnRcbiAgICAgICAgPyB0aGlzXG4gICAgICAgIDogY3JlYXRlV3JhcHBlcihub2RlLCB0aGlzLm9wdGlvbnMpXG4gICAgfSlcbiAgICByZXR1cm4gbmV3IFdyYXBwZXJBcnJheSh3cmFwcGVycylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIEhUTUwgb2YgZWxlbWVudCBhcyBhIHN0cmluZ1xuICAgKi9cbiAgaHRtbCAoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm91dGVySFRNTFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBub2RlIG1hdGNoZXMgc2VsZWN0b3JcbiAgICovXG4gIGlzIChzZWxlY3RvcjogU2VsZWN0b3IpOiBib29sZWFuIHtcbiAgICBjb25zdCBzZWxlY3RvclR5cGUgPSBnZXRTZWxlY3RvclR5cGVPclRocm93KHNlbGVjdG9yLCAnaXMnKVxuXG4gICAgaWYgKHNlbGVjdG9yVHlwZSA9PT0gTkFNRV9TRUxFQ1RPUikge1xuICAgICAgaWYgKCF0aGlzLnZtKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZtQ3Rvck1hdGNoZXNOYW1lKHRoaXMudm0sIHNlbGVjdG9yLm5hbWUpXG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdG9yVHlwZSA9PT0gQ09NUE9ORU5UX1NFTEVDVE9SKSB7XG4gICAgICBpZiAoIXRoaXMudm0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBpZiAoc2VsZWN0b3IuZnVuY3Rpb25hbCkge1xuICAgICAgICByZXR1cm4gdm1GdW5jdGlvbmFsQ3Rvck1hdGNoZXNTZWxlY3Rvcih0aGlzLnZtLl92bm9kZSwgc2VsZWN0b3IuX0N0b3IpXG4gICAgICB9XG4gICAgICByZXR1cm4gdm1DdG9yTWF0Y2hlc1NlbGVjdG9yKHRoaXMudm0sIHNlbGVjdG9yKVxuICAgIH1cblxuICAgIGlmIChzZWxlY3RvclR5cGUgPT09IFJFRl9TRUxFQ1RPUikge1xuICAgICAgdGhyb3dFcnJvcignJHJlZiBzZWxlY3RvcnMgY2FuIG5vdCBiZSB1c2VkIHdpdGggd3JhcHBlci5pcygpJylcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuICEhKFxuICAgICAgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSAmJlxuICAgICAgdGhpcy5lbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBub2RlIGlzIGVtcHR5XG4gICAqL1xuICBpc0VtcHR5ICgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMudm5vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID09PSAnJ1xuICAgIH1cbiAgICBpZiAodGhpcy52bm9kZS5jaGlsZHJlbikge1xuICAgICAgcmV0dXJuIHRoaXMudm5vZGUuY2hpbGRyZW4uZXZlcnkodm5vZGUgPT4gdm5vZGUuaXNDb21tZW50KVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy52bm9kZS5jaGlsZHJlbiA9PT0gdW5kZWZpbmVkIHx8IHRoaXMudm5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAwXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBub2RlIGlzIHZpc2libGVcbiAgICovXG4gIGlzVmlzaWJsZSAoKTogYm9vbGVhbiB7XG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRcbiAgICB3aGlsZSAoZWxlbWVudCkge1xuICAgICAgaWYgKFxuICAgICAgICBlbGVtZW50LnN0eWxlICYmXG4gICAgICAgIChlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPT09ICdoaWRkZW4nIHx8XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgd3JhcHBlciBpcyBhIHZ1ZSBpbnN0YW5jZVxuICAgKi9cbiAgaXNWdWVJbnN0YW5jZSAoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy52bVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgbmFtZSBvZiBjb21wb25lbnQsIG9yIHRhZyBuYW1lIGlmIG5vZGUgaXMgbm90IGEgVnVlIGNvbXBvbmVudFxuICAgKi9cbiAgbmFtZSAoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy52bSkge1xuICAgICAgcmV0dXJuIHRoaXMudm0uJG9wdGlvbnMubmFtZVxuICAgIH1cblxuICAgIGlmICghdGhpcy52bm9kZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC50YWdOYW1lXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudm5vZGUudGFnXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYmplY3QgY29udGFpbmluZyB0aGUgcHJvcCBuYW1lL3ZhbHVlIHBhaXJzIG9uIHRoZSBlbGVtZW50XG4gICAqL1xuICBwcm9wcyAoKTogeyBbbmFtZTogc3RyaW5nXTogYW55IH0ge1xuICAgIGlmICh0aGlzLmlzRnVuY3Rpb25hbENvbXBvbmVudCkge1xuICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgYHdyYXBwZXIucHJvcHMoKSBjYW5ub3QgYmUgY2FsbGVkIG9uIGEgbW91bnRlZCBgICtcbiAgICAgICAgICBgZnVuY3Rpb25hbCBjb21wb25lbnQuYFxuICAgICAgKVxuICAgIH1cbiAgICBpZiAoIXRoaXMudm0pIHtcbiAgICAgIHRocm93RXJyb3IoJ3dyYXBwZXIucHJvcHMoKSBtdXN0IGJlIGNhbGxlZCBvbiBhIFZ1ZSBpbnN0YW5jZScpXG4gICAgfVxuXG4gICAgY29uc3QgcHJvcHMgPSB7fVxuICAgIGNvbnN0IGtleXMgPSB0aGlzLnZtICYmIHRoaXMudm0uJG9wdGlvbnMuX3Byb3BLZXlzXG5cbiAgICBpZiAoa2V5cykge1xuICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnZtKSB7XG4gICAgICAgICAgcHJvcHNba2V5XSA9IHRoaXMudm1ba2V5XVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcHJvcHNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHZtIGRhdGFcbiAgICovXG4gIHNldERhdGEgKGRhdGE6IE9iamVjdCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRnVuY3Rpb25hbENvbXBvbmVudCkge1xuICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgYHdyYXBwZXIuc2V0RGF0YSgpIGNhbm5vdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbmFsIGAgK1xuICAgICAgICBgY29tcG9uZW50YFxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy52bSkge1xuICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgYHdyYXBwZXIuc2V0RGF0YSgpIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiBhIFZ1ZSBgICtcbiAgICAgICAgYGluc3RhbmNlYFxuICAgICAgKVxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIGRhdGFba2V5XSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgZGF0YVtrZXldICE9PSBudWxsICYmXG4gICAgICAgICFBcnJheS5pc0FycmF5KGRhdGFba2V5XSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBuZXdPYmogPSBtZXJnZVdpdGgoXG4gICAgICAgICAgLy8gJEZsb3dJZ25vcmUgOiBQcm9ibGVtIHdpdGggcG9zc2libHkgbnVsbCB0aGlzLnZtXG4gICAgICAgICAgdGhpcy52bVtrZXldLFxuICAgICAgICAgIGRhdGFba2V5XSxcbiAgICAgICAgICAob2JqVmFsdWUsIHNyY1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShzcmNWYWx1ZSkgPyBzcmNWYWx1ZSA6IHVuZGVmaW5lZFxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICAvLyAkRmxvd0lnbm9yZSA6IFByb2JsZW0gd2l0aCBwb3NzaWJseSBudWxsIHRoaXMudm1cbiAgICAgICAgdGhpcy52bS4kc2V0KHRoaXMudm0sIFtrZXldLCBuZXdPYmopXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAkRmxvd0lnbm9yZSA6IFByb2JsZW0gd2l0aCBwb3NzaWJseSBudWxsIHRoaXMudm1cbiAgICAgICAgdGhpcy52bS4kc2V0KHRoaXMudm0sIFtrZXldLCBkYXRhW2tleV0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHZtIGNvbXB1dGVkXG4gICAqL1xuICBzZXRDb21wdXRlZCAoY29tcHV0ZWQ6IE9iamVjdCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1Z1ZUluc3RhbmNlKCkpIHtcbiAgICAgIHRocm93RXJyb3IoXG4gICAgICAgIGB3cmFwcGVyLnNldENvbXB1dGVkKCkgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIGEgVnVlIGAgK1xuICAgICAgICBgaW5zdGFuY2VgXG4gICAgICApXG4gICAgfVxuXG4gICAgd2FybihcbiAgICAgIGBzZXRDb21wdXRlZCgpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgYCArXG4gICAgICAgIGByZW1vdmVkIGluIHZlcnNpb24gMS4wLjAuIFlvdSBjYW4gb3ZlcndyaXRlIGAgK1xuICAgICAgICBgY29tcHV0ZWQgcHJvcGVydGllcyBieSBwYXNzaW5nIGEgY29tcHV0ZWQgb2JqZWN0IGAgK1xuICAgICAgICBgaW4gdGhlIG1vdW50aW5nIG9wdGlvbnNgXG4gICAgKVxuXG4gICAgT2JqZWN0LmtleXMoY29tcHV0ZWQpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmICh0aGlzLnZlcnNpb24gPiAyLjEpIHtcbiAgICAgICAgLy8gJEZsb3dJZ25vcmUgOiBQcm9ibGVtIHdpdGggcG9zc2libHkgbnVsbCB0aGlzLnZtXG4gICAgICAgIGlmICghdGhpcy52bS5fY29tcHV0ZWRXYXRjaGVyc1trZXldKSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgICAgIGB3cmFwcGVyLnNldENvbXB1dGVkKCkgd2FzIHBhc3NlZCBhIHZhbHVlIHRoYXQgYCArXG4gICAgICAgICAgICBgZG9lcyBub3QgZXhpc3QgYXMgYSBjb21wdXRlZCBwcm9wZXJ0eSBvbiB0aGUgYCArXG4gICAgICAgICAgICBgVnVlIGluc3RhbmNlLiBQcm9wZXJ0eSAke2tleX0gZG9lcyBub3QgZXhpc3QgYCArXG4gICAgICAgICAgICBgb24gdGhlIFZ1ZSBpbnN0YW5jZWBcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgLy8gJEZsb3dJZ25vcmUgOiBQcm9ibGVtIHdpdGggcG9zc2libHkgbnVsbCB0aGlzLnZtXG4gICAgICAgIHRoaXMudm0uX2NvbXB1dGVkV2F0Y2hlcnNba2V5XS52YWx1ZSA9IGNvbXB1dGVkW2tleV1cbiAgICAgICAgLy8gJEZsb3dJZ25vcmUgOiBQcm9ibGVtIHdpdGggcG9zc2libHkgbnVsbCB0aGlzLnZtXG4gICAgICAgIHRoaXMudm0uX2NvbXB1dGVkV2F0Y2hlcnNba2V5XS5nZXR0ZXIgPSAoKSA9PiBjb21wdXRlZFtrZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgaXNTdG9yZSA9IGZhbHNlXG4gICAgICAgIC8vICRGbG93SWdub3JlIDogUHJvYmxlbSB3aXRoIHBvc3NpYmx5IG51bGwgdGhpcy52bVxuICAgICAgICB0aGlzLnZtLl93YXRjaGVycy5mb3JFYWNoKHdhdGNoZXIgPT4ge1xuICAgICAgICAgIGlmICh3YXRjaGVyLmdldHRlci52dWV4ICYmIGtleSBpbiB3YXRjaGVyLnZtLiRvcHRpb25zLnN0b3JlLmdldHRlcnMpIHtcbiAgICAgICAgICAgIHdhdGNoZXIudm0uJG9wdGlvbnMuc3RvcmUuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgLi4ud2F0Y2hlci52bS4kb3B0aW9ucy5zdG9yZS5nZXR0ZXJzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2F0Y2hlci52bS4kb3B0aW9ucy5zdG9yZS5nZXR0ZXJzLCBrZXksIHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXB1dGVkW2tleV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlzU3RvcmUgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vICRGbG93SWdub3JlIDogUHJvYmxlbSB3aXRoIHBvc3NpYmx5IG51bGwgdGhpcy52bVxuICAgICAgICBpZiAoIWlzU3RvcmUgJiYgIXRoaXMudm0uX3dhdGNoZXJzLnNvbWUodyA9PiB3LmdldHRlci5uYW1lID09PSBrZXkpKSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgICAgIGB3cmFwcGVyLnNldENvbXB1dGVkKCkgd2FzIHBhc3NlZCBhIHZhbHVlIHRoYXQgZG9lcyBgICtcbiAgICAgICAgICAgIGBub3QgZXhpc3QgYXMgYSBjb21wdXRlZCBwcm9wZXJ0eSBvbiB0aGUgVnVlIGluc3RhbmNlLiBgICtcbiAgICAgICAgICAgIGBQcm9wZXJ0eSAke2tleX0gZG9lcyBub3QgZXhpc3Qgb24gdGhlIFZ1ZSBpbnN0YW5jZWBcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgLy8gJEZsb3dJZ25vcmUgOiBQcm9ibGVtIHdpdGggcG9zc2libHkgbnVsbCB0aGlzLnZtXG4gICAgICAgIHRoaXMudm0uX3dhdGNoZXJzLmZvckVhY2god2F0Y2hlciA9PiB7XG4gICAgICAgICAgaWYgKHdhdGNoZXIuZ2V0dGVyLm5hbWUgPT09IGtleSkge1xuICAgICAgICAgICAgd2F0Y2hlci52YWx1ZSA9IGNvbXB1dGVkW2tleV1cbiAgICAgICAgICAgIHdhdGNoZXIuZ2V0dGVyID0gKCkgPT4gY29tcHV0ZWRba2V5XVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIC8vICRGbG93SWdub3JlIDogUHJvYmxlbSB3aXRoIHBvc3NpYmx5IG51bGwgdGhpcy52bVxuICAgIHRoaXMudm0uX3dhdGNoZXJzLmZvckVhY2god2F0Y2hlciA9PiB7XG4gICAgICB3YXRjaGVyLnJ1bigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHZtIG1ldGhvZHNcbiAgICovXG4gIHNldE1ldGhvZHMgKG1ldGhvZHM6IE9iamVjdCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1Z1ZUluc3RhbmNlKCkpIHtcbiAgICAgIHRocm93RXJyb3IoXG4gICAgICAgIGB3cmFwcGVyLnNldE1ldGhvZHMoKSBjYW4gb25seSBiZSBjYWxsZWQgb24gYSBWdWUgYCArXG4gICAgICAgIGBpbnN0YW5jZWBcbiAgICAgIClcbiAgICB9XG4gICAgT2JqZWN0LmtleXMobWV0aG9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgLy8gJEZsb3dJZ25vcmUgOiBQcm9ibGVtIHdpdGggcG9zc2libHkgbnVsbCB0aGlzLnZtXG4gICAgICB0aGlzLnZtW2tleV0gPSBtZXRob2RzW2tleV1cbiAgICAgIC8vICRGbG93SWdub3JlIDogUHJvYmxlbSB3aXRoIHBvc3NpYmx5IG51bGwgdGhpcy52bVxuICAgICAgdGhpcy52bS4kb3B0aW9ucy5tZXRob2RzW2tleV0gPSBtZXRob2RzW2tleV1cbiAgICB9KVxuXG4gICAgaWYgKHRoaXMudm5vZGUpIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLnZub2RlLmNvbnRleHRcbiAgICAgIGlmIChjb250ZXh0LiRvcHRpb25zLnJlbmRlcikgY29udGV4dC5fdXBkYXRlKGNvbnRleHQuX3JlbmRlcigpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHZtIHByb3BzXG4gICAqL1xuICBzZXRQcm9wcyAoZGF0YTogT2JqZWN0KTogdm9pZCB7XG4gICAgY29uc3Qgb3JpZ2luYWxDb25maWcgPSBWdWUuY29uZmlnLnNpbGVudFxuICAgIFZ1ZS5jb25maWcuc2lsZW50ID0gY29uZmlnLnNpbGVudFxuICAgIGlmICh0aGlzLmlzRnVuY3Rpb25hbENvbXBvbmVudCkge1xuICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgYHdyYXBwZXIuc2V0UHJvcHMoKSBjYW5ub3QgYmUgY2FsbGVkIG9uIGEgYCArXG4gICAgICAgIGBmdW5jdGlvbmFsIGNvbXBvbmVudGBcbiAgICAgIClcbiAgICB9XG4gICAgaWYgKCF0aGlzLnZtKSB7XG4gICAgICB0aHJvd0Vycm9yKFxuICAgICAgICBgd3JhcHBlci5zZXRQcm9wcygpIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiBhIFZ1ZSBgICtcbiAgICAgICAgYGluc3RhbmNlYFxuICAgICAgKVxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMudm0gfHxcbiAgICAgICAgIXRoaXMudm0uJG9wdGlvbnMuX3Byb3BLZXlzIHx8XG4gICAgICAgICF0aGlzLnZtLiRvcHRpb25zLl9wcm9wS2V5cy5zb21lKHByb3AgPT4gcHJvcCA9PT0ga2V5KVxuICAgICAgKSB7XG4gICAgICAgIHRocm93RXJyb3IoXG4gICAgICAgICAgYHdyYXBwZXIuc2V0UHJvcHMoKSBjYWxsZWQgd2l0aCAke2tleX0gcHJvcGVydHkgd2hpY2ggYCArXG4gICAgICAgICAgYGlzIG5vdCBkZWZpbmVkIG9uIHRoZSBjb21wb25lbnRgXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIGRhdGFba2V5XSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgZGF0YVtrZXldICE9PSBudWxsICYmXG4gICAgICAgIC8vICRGbG93SWdub3JlIDogUHJvYmxlbSB3aXRoIHBvc3NpYmx5IG51bGwgdGhpcy52bVxuICAgICAgICBkYXRhW2tleV0gPT09IHRoaXMudm1ba2V5XVxuICAgICAgKSB7XG4gICAgICAgIHRocm93RXJyb3IoXG4gICAgICAgICAgYHdyYXBwZXIuc2V0UHJvcHMoKSBjYWxsZWQgd2l0aCB0aGUgc2FtZSBvYmplY3QgYCArXG4gICAgICAgICAgYG9mIHRoZSBleGlzdGluZyAke2tleX0gcHJvcGVydHkuIGAgK1xuICAgICAgICAgIGBZb3UgbXVzdCBjYWxsIHdyYXBwZXIuc2V0UHJvcHMoKSB3aXRoIGEgbmV3IG9iamVjdCBgICtcbiAgICAgICAgICBgdG8gdHJpZ2dlciByZWFjdGl2aXR5YFxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnZtICYmIHRoaXMudm0uX3Byb3BzKSB7XG4gICAgICAgIHRoaXMudm0uX3Byb3BzW2tleV0gPSBkYXRhW2tleV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICRGbG93SWdub3JlIDogUHJvYmxlbSB3aXRoIHBvc3NpYmx5IG51bGwgdGhpcy52bVxuICAgICAgICB0aGlzLnZtW2tleV0gPSBkYXRhW2tleV1cbiAgICAgICAgLy8gJEZsb3dJZ25vcmUgOiBQcm9ibGVtIHdpdGggcG9zc2libHkgbnVsbCB0aGlzLnZtLiRvcHRpb25zXG4gICAgICAgIHRoaXMudm0uJG9wdGlvbnMucHJvcHNEYXRhW2tleV0gPSBkYXRhW2tleV1cbiAgICAgIH1cbiAgICB9KVxuICAgIC8vICRGbG93SWdub3JlIDogUHJvYmxlbSB3aXRoIHBvc3NpYmx5IG51bGwgdGhpcy52bVxuICAgIHRoaXMudm0uJGZvcmNlVXBkYXRlKClcbiAgICAvLyAkRmxvd0lnbm9yZSA6IFByb2JsZW0gd2l0aCBwb3NzaWJseSBudWxsIHRoaXMudm1cbiAgICBvcmRlcldhdGNoZXJzKHRoaXMudm0gfHwgdGhpcy52bm9kZS5jb250ZXh0LiRyb290KVxuICAgIFZ1ZS5jb25maWcuc2lsZW50ID0gb3JpZ2luYWxDb25maWdcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGVsZW1lbnQgdmFsdWUgYW5kIHRyaWdnZXJzIGlucHV0IGV2ZW50XG4gICAqL1xuICBzZXRWYWx1ZSAodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRhZ05hbWUgPSB0aGlzLmVsZW1lbnQudGFnTmFtZVxuICAgIGNvbnN0IHR5cGUgPSB0aGlzLmF0dHJpYnV0ZXMoKS50eXBlXG5cbiAgICBpZiAodGFnTmFtZSA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgIHRocm93RXJyb3IoXG4gICAgICAgIGB3cmFwcGVyLnNldFZhbHVlKCkgY2Fubm90IGJlIGNhbGxlZCBvbiBhIDxzZWxlY3Q+IGAgK1xuICAgICAgICAgIGBlbGVtZW50LiBVc2Ugd3JhcHBlci5zZXRTZWxlY3RlZCgpIGluc3RlYWRgXG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0YWdOYW1lID09PSAnSU5QVVQnICYmIHR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgIHRocm93RXJyb3IoXG4gICAgICAgIGB3cmFwcGVyLnNldFZhbHVlKCkgY2Fubm90IGJlIGNhbGxlZCBvbiBhIDxpbnB1dCBgICtcbiAgICAgICAgICBgdHlwZT1cImNoZWNrYm94XCIgLz4gZWxlbWVudC4gVXNlIGAgK1xuICAgICAgICAgIGB3cmFwcGVyLnNldENoZWNrZWQoKSBpbnN0ZWFkYFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiB0eXBlID09PSAncmFkaW8nKSB7XG4gICAgICB0aHJvd0Vycm9yKFxuICAgICAgICBgd3JhcHBlci5zZXRWYWx1ZSgpIGNhbm5vdCBiZSBjYWxsZWQgb24gYSA8aW5wdXQgYCArXG4gICAgICAgICAgYHR5cGU9XCJyYWRpb1wiIC8+IGVsZW1lbnQuIFVzZSB3cmFwcGVyLnNldENoZWNrZWQoKSBgICtcbiAgICAgICAgICBgaW5zdGVhZGBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09ICdJTlBVVCcgfHwgdGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IHZhbHVlXG4gICAgICB0aGlzLnRyaWdnZXIoJ2lucHV0JylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3dFcnJvcihgd3JhcHBlci5zZXRWYWx1ZSgpIGNhbm5vdCBiZSBjYWxsZWQgb24gdGhpcyBlbGVtZW50YClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHJhZGlvIGJ1dHRvbiBvciBjaGVja2JveCBlbGVtZW50XG4gICAqL1xuICBzZXRDaGVja2VkIChjaGVja2VkOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgY2hlY2tlZCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aHJvd0Vycm9yKCd3cmFwcGVyLnNldENoZWNrZWQoKSBtdXN0IGJlIHBhc3NlZCBhIGJvb2xlYW4nKVxuICAgIH1cbiAgICBjb25zdCB0YWdOYW1lID0gdGhpcy5lbGVtZW50LnRhZ05hbWVcbiAgICBjb25zdCB0eXBlID0gdGhpcy5hdHRyaWJ1dGVzKCkudHlwZVxuXG4gICAgaWYgKHRhZ05hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICB0aHJvd0Vycm9yKFxuICAgICAgICBgd3JhcHBlci5zZXRDaGVja2VkKCkgY2Fubm90IGJlIGNhbGxlZCBvbiBhIGAgK1xuICAgICAgICAgIGA8c2VsZWN0PiBlbGVtZW50LiBVc2Ugd3JhcHBlci5zZXRTZWxlY3RlZCgpIGAgK1xuICAgICAgICAgIGBpbnN0ZWFkYFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiB0eXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5jaGVja2VkICE9PSBjaGVja2VkKSB7XG4gICAgICAgIGlmICghbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnanNkb20nKSkge1xuICAgICAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICAgICAgdGhpcy5lbGVtZW50LmNoZWNrZWQgPSBjaGVja2VkXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmlnZ2VyKCdjbGljaycpXG4gICAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJylcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09ICdJTlBVVCcgJiYgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgaWYgKCFjaGVja2VkKSB7XG4gICAgICAgIHRocm93RXJyb3IoXG4gICAgICAgICAgYHdyYXBwZXIuc2V0Q2hlY2tlZCgpIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBgICtcbiAgICAgICAgICAgIGBwYXJhbWV0ZXIgZmFsc2Ugb24gYSA8aW5wdXQgdHlwZT1cInJhZGlvXCIgLz4gYCArXG4gICAgICAgICAgICBgZWxlbWVudC5gXG4gICAgICAgIClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNoZWNrZWQpIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NsaWNrJylcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09ICdJTlBVVCcgfHwgdGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgYHdyYXBwZXIuc2V0Q2hlY2tlZCgpIGNhbm5vdCBiZSBjYWxsZWQgb24gXCJ0ZXh0XCIgYCArXG4gICAgICAgICAgYGlucHV0cy4gVXNlIHdyYXBwZXIuc2V0VmFsdWUoKSBpbnN0ZWFkYFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvd0Vycm9yKGB3cmFwcGVyLnNldENoZWNrZWQoKSBjYW5ub3QgYmUgY2FsbGVkIG9uIHRoaXMgZWxlbWVudGApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgPG9wdGlvbj48L29wdGlvbj4gZWxlbWVudFxuICAgKi9cbiAgc2V0U2VsZWN0ZWQgKCk6IHZvaWQge1xuICAgIGNvbnN0IHRhZ05hbWUgPSB0aGlzLmVsZW1lbnQudGFnTmFtZVxuICAgIGNvbnN0IHR5cGUgPSB0aGlzLmF0dHJpYnV0ZXMoKS50eXBlXG5cbiAgICBpZiAodGFnTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICB0aGlzLmVsZW1lbnQuc2VsZWN0ZWQgPSB0cnVlXG4gICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnRhZ05hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgICAgY3JlYXRlV3JhcHBlcih0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LCB0aGlzLm9wdGlvbnMpXG4gICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICBjcmVhdGVXcmFwcGVyKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LCB0aGlzLm9wdGlvbnMpXG4gICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0YWdOYW1lID09PSAnU0VMRUNUJykge1xuICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgYHdyYXBwZXIuc2V0U2VsZWN0ZWQoKSBjYW5ub3QgYmUgY2FsbGVkIG9uIHNlbGVjdC4gYCArXG4gICAgICAgICAgYENhbGwgaXQgb24gb25lIG9mIGl0cyBvcHRpb25zYFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiB0eXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICB0aHJvd0Vycm9yKFxuICAgICAgICBgd3JhcHBlci5zZXRTZWxlY3RlZCgpIGNhbm5vdCBiZSBjYWxsZWQgb24gYSA8aW5wdXQgYCArXG4gICAgICAgICAgYHR5cGU9XCJjaGVja2JveFwiIC8+IGVsZW1lbnQuIFVzZSBgICtcbiAgICAgICAgICBgd3JhcHBlci5zZXRDaGVja2VkKCkgaW5zdGVhZGBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09ICdJTlBVVCcgJiYgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgYHdyYXBwZXIuc2V0U2VsZWN0ZWQoKSBjYW5ub3QgYmUgY2FsbGVkIG9uIGEgPGlucHV0IGAgK1xuICAgICAgICAgIGB0eXBlPVwicmFkaW9cIiAvPiBlbGVtZW50LiBVc2Ugd3JhcHBlci5zZXRDaGVja2VkKCkgYCArXG4gICAgICAgICAgYGluc3RlYWRgXG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0YWdOYW1lID09PSAnSU5QVVQnIHx8IHRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcbiAgICAgIHRocm93RXJyb3IoXG4gICAgICAgIGB3cmFwcGVyLnNldFNlbGVjdGVkKCkgY2Fubm90IGJlIGNhbGxlZCBvbiBcInRleHRcIiBgICtcbiAgICAgICAgICBgaW5wdXRzLiBVc2Ugd3JhcHBlci5zZXRWYWx1ZSgpIGluc3RlYWRgXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93RXJyb3IoYHdyYXBwZXIuc2V0U2VsZWN0ZWQoKSBjYW5ub3QgYmUgY2FsbGVkIG9uIHRoaXMgZWxlbWVudGApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0ZXh0IG9mIHdyYXBwZXIgZWxlbWVudFxuICAgKi9cbiAgdGV4dCAoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnRleHRDb250ZW50LnRyaW0oKVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIGRlc3Ryb3kgb24gdm1cbiAgICovXG4gIGRlc3Ryb3kgKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1Z1ZUluc3RhbmNlKCkpIHtcbiAgICAgIHRocm93RXJyb3IoYHdyYXBwZXIuZGVzdHJveSgpIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiBhIFZ1ZSBpbnN0YW5jZWApXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgfVxuICAgIC8vICRGbG93SWdub3JlXG4gICAgdGhpcy52bS4kZGVzdHJveSgpXG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIERPTSBldmVudCBvbiB3cmFwcGVyXG4gICAqL1xuICB0cmlnZ2VyICh0eXBlOiBzdHJpbmcsIG9wdGlvbnM6IE9iamVjdCA9IHt9KSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3dFcnJvcignd3JhcHBlci50cmlnZ2VyKCkgbXVzdCBiZSBwYXNzZWQgYSBzdHJpbmcnKVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgdGhyb3dFcnJvcihcbiAgICAgICAgYHlvdSBjYW5ub3Qgc2V0IHRoZSB0YXJnZXQgdmFsdWUgb2YgYW4gZXZlbnQuIFNlZSBgICtcbiAgICAgICAgICBgdGhlIG5vdGVzIHNlY3Rpb24gb2YgdGhlIGRvY3MgZm9yIG1vcmUgYCArXG4gICAgICAgICAgYGRldGFpbHPigJRodHRwczovL3Z1ZS10ZXN0LXV0aWxzLnZ1ZWpzLm9yZy9hcGkvd3JhcHBlci90cmlnZ2VyLmh0bWxgXG4gICAgICApXG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgZmlyZSBldmVudCBvbiBhIGRpc2FibGVkIGVsZW1lbnRcbiAgICBpZiAodGhpcy5hdHRyaWJ1dGVzKCkuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG1vZGlmaWVycyA9IHtcbiAgICAgIGVudGVyOiAxMyxcbiAgICAgIHRhYjogOSxcbiAgICAgIGRlbGV0ZTogNDYsXG4gICAgICBlc2M6IDI3LFxuICAgICAgc3BhY2U6IDMyLFxuICAgICAgdXA6IDM4LFxuICAgICAgZG93bjogNDAsXG4gICAgICBsZWZ0OiAzNyxcbiAgICAgIHJpZ2h0OiAzOSxcbiAgICAgIGVuZDogMzUsXG4gICAgICBob21lOiAzNixcbiAgICAgIGJhY2tzcGFjZTogOCxcbiAgICAgIGluc2VydDogNDUsXG4gICAgICBwYWdldXA6IDMzLFxuICAgICAgcGFnZWRvd246IDM0XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnQgPSB0eXBlLnNwbGl0KCcuJylcblxuICAgIGxldCBldmVudE9iamVjdFxuXG4gICAgLy8gRmFsbGJhY2sgZm9yIElFMTAsMTEgLSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNjU5NjEyM1xuICAgIGlmICh0eXBlb2Ygd2luZG93LkV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBldmVudE9iamVjdCA9IG5ldyB3aW5kb3cuRXZlbnQoZXZlbnRbMF0sIHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnRPYmplY3QgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKVxuICAgICAgZXZlbnRPYmplY3QuaW5pdEV2ZW50KGV2ZW50WzBdLCB0cnVlLCB0cnVlKVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICAgIGV2ZW50T2JqZWN0W2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGV2ZW50Lmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgIGV2ZW50T2JqZWN0LmtleUNvZGUgPSBtb2RpZmllcnNbZXZlbnRbMV1dXG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPYmplY3QpXG4gICAgaWYgKHRoaXMudm5vZGUpIHtcbiAgICAgIG9yZGVyV2F0Y2hlcnModGhpcy52bSB8fCB0aGlzLnZub2RlLmNvbnRleHQuJHJvb3QpXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlICgpOiB2b2lkIHtcbiAgICB3YXJuKFxuICAgICAgYHVwZGF0ZSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdnVlLXRlc3QtdXRpbHMuIEFsbCBgICtcbiAgICAgICAgYHVwZGF0ZXMgYXJlIG5vdyBzeW5jaHJvbm91cyBieSBkZWZhdWx0YFxuICAgIClcbiAgfVxufVxuIiwiLy8gQGZsb3dcblxuaW1wb3J0IHsgVlVFX1ZFUlNJT04gfSBmcm9tICcuL2NvbnN0cydcblxuZnVuY3Rpb24gc2V0RGVwc1N5bmMgKGRlcCk6IHZvaWQge1xuICBkZXAuc3Vicy5mb3JFYWNoKHNldFdhdGNoZXJTeW5jKVxufVxuXG5mdW5jdGlvbiBzZXRXYXRjaGVyU3luYyAod2F0Y2hlcik6IHZvaWQge1xuICBpZiAod2F0Y2hlci5zeW5jID09PSB0cnVlKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgd2F0Y2hlci5zeW5jID0gdHJ1ZVxuICB3YXRjaGVyLmRlcHMuZm9yRWFjaChzZXREZXBzU3luYylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFdhdGNoZXJzVG9TeW5jICh2bTogQ29tcG9uZW50KTogdm9pZCB7XG4gIGlmICh2bS5fd2F0Y2hlcnMpIHtcbiAgICB2bS5fd2F0Y2hlcnMuZm9yRWFjaChzZXRXYXRjaGVyU3luYylcbiAgfVxuXG4gIGlmICh2bS5fY29tcHV0ZWRXYXRjaGVycykge1xuICAgIE9iamVjdC5rZXlzKHZtLl9jb21wdXRlZFdhdGNoZXJzKS5mb3JFYWNoKGNvbXB1dGVkV2F0Y2hlciA9PiB7XG4gICAgICBzZXRXYXRjaGVyU3luYyh2bS5fY29tcHV0ZWRXYXRjaGVyc1tjb21wdXRlZFdhdGNoZXJdKVxuICAgIH0pXG4gIH1cblxuICBzZXRXYXRjaGVyU3luYyh2bS5fd2F0Y2hlcilcblxuICB2bS4kY2hpbGRyZW4uZm9yRWFjaChzZXRXYXRjaGVyc1RvU3luYylcbiAgLy8gcHJldmVudGluZyBkb3VibGUgcmVnaXN0cmF0aW9uXG4gIGlmICghdm0uJF92dWVUZXN0VXRpbHNfdXBkYXRlSW5TZXRXYXRjaGVyU3luYykge1xuICAgIHZtLiRfdnVlVGVzdFV0aWxzX3VwZGF0ZUluU2V0V2F0Y2hlclN5bmMgPSB2bS5fdXBkYXRlXG4gICAgdm0uX3VwZGF0ZSA9IGZ1bmN0aW9uICh2bm9kZSwgaHlkcmF0aW5nKSB7XG4gICAgICB0aGlzLiRfdnVlVGVzdFV0aWxzX3VwZGF0ZUluU2V0V2F0Y2hlclN5bmModm5vZGUsIGh5ZHJhdGluZylcbiAgICAgIGlmIChWVUVfVkVSU0lPTiA+PSAyLjEgJiYgdGhpcy5faXNNb3VudGVkICYmIHRoaXMuJG9wdGlvbnMudXBkYXRlZCkge1xuICAgICAgICB0aGlzLiRvcHRpb25zLnVwZGF0ZWQuZm9yRWFjaChoYW5kbGVyID0+IHtcbiAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5cbmltcG9ydCBXcmFwcGVyIGZyb20gJy4vd3JhcHBlcidcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdzaGFyZWQvdXRpbCdcbmltcG9ydCB7IHNldFdhdGNoZXJzVG9TeW5jIH0gZnJvbSAnLi9zZXQtd2F0Y2hlcnMtdG8tc3luYydcbmltcG9ydCB7IG9yZGVyV2F0Y2hlcnMgfSBmcm9tICcuL29yZGVyLXdhdGNoZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWVXcmFwcGVyIGV4dGVuZHMgV3JhcHBlciBpbXBsZW1lbnRzIEJhc2VXcmFwcGVyIHtcbiAgY29uc3RydWN0b3IgKHZtOiBDb21wb25lbnQsIG9wdGlvbnM6IFdyYXBwZXJPcHRpb25zKSB7XG4gICAgc3VwZXIodm0uX3Zub2RlLCBvcHRpb25zLCB0cnVlKVxuXG4gICAgLy8gJEZsb3dJZ25vcmUgOiBpc3N1ZSB3aXRoIGRlZmluZVByb3BlcnR5XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd2bm9kZScsIHtcbiAgICAgIGdldDogKCkgPT4gdm0uX3Zub2RlLFxuICAgICAgc2V0OiAoKSA9PiB0aHJvd0Vycm9yKCd3cmFwcGVyLnZub2RlIGlzIHJlYWQtb25seScpXG4gICAgfSlcbiAgICAvLyAkRmxvd0lnbm9yZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZWxlbWVudCcsIHtcbiAgICAgIGdldDogKCkgPT4gdm0uJGVsLFxuICAgICAgc2V0OiAoKSA9PiB0aHJvd0Vycm9yKCd3cmFwcGVyLmVsZW1lbnQgaXMgcmVhZC1vbmx5JylcbiAgICB9KVxuICAgIC8vICRGbG93SWdub3JlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd2bScsIHtcbiAgICAgIGdldDogKCkgPT4gdm0sXG4gICAgICBzZXQ6ICgpID0+IHRocm93RXJyb3IoJ3dyYXBwZXIudm0gaXMgcmVhZC1vbmx5JylcbiAgICB9KVxuICAgIGlmIChvcHRpb25zLnN5bmMpIHtcbiAgICAgIHNldFdhdGNoZXJzVG9TeW5jKHZtKVxuICAgICAgb3JkZXJXYXRjaGVycyh2bSlcbiAgICB9XG4gICAgdGhpcy5pc0Z1bmN0aW9uYWxDb21wb25lbnQgPSB2bS4kb3B0aW9ucy5faXNGdW5jdGlvbmFsQ29udGFpbmVyXG4gICAgdGhpcy5fZW1pdHRlZCA9IHZtLl9fZW1pdHRlZFxuICAgIHRoaXMuX2VtaXR0ZWRCeU9yZGVyID0gdm0uX19lbWl0dGVkQnlPcmRlclxuICB9XG59XG4iLCIvLyBAZmxvd1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50ICgpOiBIVE1MRWxlbWVudCB8IHZvaWQge1xuICBpZiAoZG9jdW1lbnQpIHtcbiAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW0pXG4gICAgfVxuICAgIHJldHVybiBlbGVtXG4gIH1cbn1cbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduSW4ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbkluO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZmlsdGVyYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RmlsdGVyKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RmlsdGVyO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViQXJyYXk7XG4iLCJ2YXIgYXJyYXlGaWx0ZXIgPSByZXF1aXJlKCcuL19hcnJheUZpbHRlcicpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICByZXR1cm4gYXJyYXlGaWx0ZXIobmF0aXZlR2V0U3ltYm9scyhvYmplY3QpLCBmdW5jdGlvbihzeW1ib2wpIHtcbiAgICByZXR1cm4gcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsIHN5bWJvbCk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTeW1ib2xzO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzKHNvdXJjZSwgb2JqZWN0KSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHNvdXJjZSwgZ2V0U3ltYm9scyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzO1xuIiwiLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UHVzaDtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKG9iamVjdCkge1xuICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBhbmQgaW5oZXJpdGVkIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzSW4oc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9sc0luO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0luLCBnZXRTeW1ib2xzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXNJbjtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCJ2YXIgRGF0YVZpZXcgPSByZXF1aXJlKCcuL19EYXRhVmlldycpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIFByb21pc2UgPSByZXF1aXJlKCcuL19Qcm9taXNlJyksXG4gICAgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKSxcbiAgICBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIGFycmF5IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gbmV3IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgLy8gQWRkIHByb3BlcnRpZXMgYXNzaWduZWQgYnkgYFJlZ0V4cCNleGVjYC5cbiAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcbiAgICByZXN1bHQuaW5kZXggPSBhcnJheS5pbmRleDtcbiAgICByZXN1bHQuaW5wdXQgPSBhcnJheS5pbnB1dDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUFycmF5O1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBkYXRhVmlld2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhVmlldyBUaGUgZGF0YSB2aWV3IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBkYXRhIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcihkYXRhVmlldy5idWZmZXIpIDogZGF0YVZpZXcuYnVmZmVyO1xuICByZXR1cm4gbmV3IGRhdGFWaWV3LmNvbnN0cnVjdG9yKGJ1ZmZlciwgZGF0YVZpZXcuYnl0ZU9mZnNldCwgZGF0YVZpZXcuYnl0ZUxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEYXRhVmlldztcbiIsIi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgcmVnZXhwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHJlZ2V4cCBUaGUgcmVnZXhwIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHJlZ2V4cC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVSZWdFeHAocmVnZXhwKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgcmVnZXhwLmNvbnN0cnVjdG9yKHJlZ2V4cC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhyZWdleHApKTtcbiAgcmVzdWx0Lmxhc3RJbmRleCA9IHJlZ2V4cC5sYXN0SW5kZXg7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVSZWdFeHA7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYHN5bWJvbGAgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc3ltYm9sIFRoZSBzeW1ib2wgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHN5bWJvbCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU3ltYm9sKHN5bWJvbCkge1xuICByZXR1cm4gc3ltYm9sVmFsdWVPZiA/IE9iamVjdChzeW1ib2xWYWx1ZU9mLmNhbGwoc3ltYm9sKSkgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVN5bWJvbDtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVSZWdFeHAgPSByZXF1aXJlKCcuL19jbG9uZVJlZ0V4cCcpLFxuICAgIGNsb25lU3ltYm9sID0gcmVxdWlyZSgnLi9fY2xvbmVTeW1ib2wnKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE1hcGAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgYFNldGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBjbG9uZUFycmF5QnVmZmVyKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lVHlwZWRBcnJheShvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCJ2YXIgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWFwYCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG1hcCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNNYXAodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSBtYXBUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWFwO1xuIiwidmFyIGJhc2VJc01hcCA9IHJlcXVpcmUoJy4vX2Jhc2VJc01hcCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNNYXAgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc01hcDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE1hcGAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNNYXAobmV3IE1hcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc01hcChuZXcgV2Vha01hcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNNYXAgPSBub2RlSXNNYXAgPyBiYXNlVW5hcnkobm9kZUlzTWFwKSA6IGJhc2VJc01hcDtcblxubW9kdWxlLmV4cG9ydHMgPSBpc01hcDtcbiIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNTZXRgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc2V0LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1NldCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IHNldFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNTZXQ7XG4iLCJ2YXIgYmFzZUlzU2V0ID0gcmVxdWlyZSgnLi9fYmFzZUlzU2V0JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1NldCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzU2V0O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU2V0YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1NldChuZXcgU2V0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU2V0KG5ldyBXZWFrU2V0KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1NldCA9IG5vZGVJc1NldCA/IGJhc2VVbmFyeShub2RlSXNTZXQpIDogYmFzZUlzU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2V0O1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ24nKSxcbiAgICBiYXNlQXNzaWduSW4gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduSW4nKSxcbiAgICBjbG9uZUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQnVmZmVyJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgY29weVN5bWJvbHMgPSByZXF1aXJlKCcuL19jb3B5U3ltYm9scycpLFxuICAgIGNvcHlTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19jb3B5U3ltYm9sc0luJyksXG4gICAgZ2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXMnKSxcbiAgICBnZXRBbGxLZXlzSW4gPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzSW4nKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpbml0Q2xvbmVBcnJheSA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUFycmF5JyksXG4gICAgaW5pdENsb25lQnlUYWcgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVCeVRhZycpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZU9iamVjdCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc01hcCA9IHJlcXVpcmUoJy4vaXNNYXAnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1NldCA9IHJlcXVpcmUoJy4vaXNTZXQnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9GTEFUX0ZMQUcgPSAyLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBEZWVwIGNsb25lXG4gKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcbiAqICA0IC0gQ2xvbmUgc3ltYm9sc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGlzRGVlcCA9IGJpdG1hc2sgJiBDTE9ORV9ERUVQX0ZMQUcsXG4gICAgICBpc0ZsYXQgPSBiaXRtYXNrICYgQ0xPTkVfRkxBVF9GTEFHLFxuICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblxuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSAoaXNGbGF0IHx8IGlzRnVuYykgPyB7fSA6IGluaXRDbG9uZU9iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gaXNGbGF0XG4gICAgICAgICAgPyBjb3B5U3ltYm9sc0luKHZhbHVlLCBiYXNlQXNzaWduSW4ocmVzdWx0LCB2YWx1ZSkpXG4gICAgICAgICAgOiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoaXNTZXQodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSkge1xuICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoaXNNYXAodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBrZXlzRnVuYyA9IGlzRnVsbFxuICAgID8gKGlzRmxhdCA/IGdldEFsbEtleXNJbiA6IGdldEFsbEtleXMpXG4gICAgOiAoaXNGbGF0ID8ga2V5c0luIDoga2V5cyk7XG5cbiAgdmFyIHByb3BzID0gaXNBcnIgPyB1bmRlZmluZWQgOiBrZXlzRnVuYyh2YWx1ZSk7XG4gIGFycmF5RWFjaChwcm9wcyB8fCB2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3ViVmFsdWU7XG4gICAgICBzdWJWYWx1ZSA9IHZhbHVlW2tleV07XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgYXNzaWduVmFsdWUocmVzdWx0LCBrZXksIGJhc2VDbG9uZShzdWJWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2spKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNsb25lO1xuIiwidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX0RFRVBfRkxBRyA9IDEsXG4gICAgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmNsb25lYCBleGNlcHQgdGhhdCBpdCByZWN1cnNpdmVseSBjbG9uZXMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmVjdXJzaXZlbHkgY2xvbmUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZGVlcCBjbG9uZWQgdmFsdWUuXG4gKiBAc2VlIF8uY2xvbmVcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAnYSc6IDEgfSwgeyAnYic6IDIgfV07XG4gKlxuICogdmFyIGRlZXAgPSBfLmNsb25lRGVlcChvYmplY3RzKTtcbiAqIGNvbnNvbGUubG9nKGRlZXBbMF0gPT09IG9iamVjdHNbMF0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gY2xvbmVEZWVwKHZhbHVlKSB7XG4gIHJldHVybiBiYXNlQ2xvbmUodmFsdWUsIENMT05FX0RFRVBfRkxBRyB8IENMT05FX1NZTUJPTFNfRkxBRyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEZWVwO1xuIiwiLy8gQGZsb3dcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXJyb3JIYW5kbGVyIChcbiAgZXJyb3JPclN0cmluZzogYW55LFxuICB2bTogQ29tcG9uZW50XG4pOiB2b2lkIHtcbiAgY29uc3QgZXJyb3IgPVxuICAgIHR5cGVvZiBlcnJvck9yU3RyaW5nID09PSAnb2JqZWN0J1xuICAgICAgPyBlcnJvck9yU3RyaW5nXG4gICAgICA6IG5ldyBFcnJvcihlcnJvck9yU3RyaW5nKVxuXG4gIHZtLl9lcnJvciA9IGVycm9yXG5cbiAgdGhyb3cgZXJyb3Jcbn1cbiIsIi8vIEBmbG93XG5cbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xuaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2gvY2xvbmVEZWVwJ1xuaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICcuL2Vycm9yLWhhbmRsZXInXG5cbmZ1bmN0aW9uIGNyZWF0ZUxvY2FsVnVlIChfVnVlOiBDb21wb25lbnQgPSBWdWUpOiBDb21wb25lbnQge1xuICBjb25zdCBpbnN0YW5jZSA9IF9WdWUuZXh0ZW5kKClcblxuICAvLyBjbG9uZSBnbG9iYWwgQVBJc1xuICBPYmplY3Qua2V5cyhfVnVlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKCFpbnN0YW5jZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb25zdCBvcmlnaW5hbCA9IF9WdWVba2V5XVxuICAgICAgaW5zdGFuY2Vba2V5XSA9XG4gICAgICAgIHR5cGVvZiBvcmlnaW5hbCA9PT0gJ29iamVjdCcgPyBjbG9uZURlZXAob3JpZ2luYWwpIDogb3JpZ2luYWxcbiAgICB9XG4gIH0pXG5cbiAgLy8gY29uZmlnIGlzIG5vdCBlbnVtZXJhYmxlXG4gIGluc3RhbmNlLmNvbmZpZyA9IGNsb25lRGVlcChWdWUuY29uZmlnKVxuXG4gIGluc3RhbmNlLmNvbmZpZy5lcnJvckhhbmRsZXIgPSBlcnJvckhhbmRsZXJcblxuICAvLyBvcHRpb24gbWVyZ2Ugc3RyYXRlZ2llcyBuZWVkIHRvIGJlIGV4cG9zZWQgYnkgcmVmZXJlbmNlXG4gIC8vIHNvIHRoYXQgbWVyZ2Ugc3RyYXRzIHJlZ2lzdGVyZWQgYnkgcGx1Z2lucyBjYW4gd29yayBwcm9wZXJseVxuICBpbnN0YW5jZS5jb25maWcub3B0aW9uTWVyZ2VTdHJhdGVnaWVzID0gVnVlLmNvbmZpZy5vcHRpb25NZXJnZVN0cmF0ZWdpZXNcblxuICAvLyBtYWtlIHN1cmUgYWxsIGV4dGVuZHMgYXJlIGJhc2VkIG9uIHRoaXMgaW5zdGFuY2UuXG4gIC8vIHRoaXMgaXMgaW1wb3J0YW50IHNvIHRoYXQgZ2xvYmFsIGNvbXBvbmVudHMgcmVnaXN0ZXJlZCBieSBwbHVnaW5zLFxuICAvLyBlLmcuIHJvdXRlci1saW5rIGFyZSBjcmVhdGVkIHVzaW5nIHRoZSBjb3JyZWN0IGJhc2UgY29uc3RydWN0b3JcbiAgaW5zdGFuY2Uub3B0aW9ucy5fYmFzZSA9IGluc3RhbmNlXG5cbiAgLy8gY29tcGF0IGZvciB2dWUtcm91dGVyIDwgMi43LjEgd2hlcmUgaXQgZG9lcyBub3QgYWxsb3cgbXVsdGlwbGUgaW5zdGFsbHNcbiAgaWYgKGluc3RhbmNlLl9pbnN0YWxsZWRQbHVnaW5zICYmIGluc3RhbmNlLl9pbnN0YWxsZWRQbHVnaW5zLmxlbmd0aCkge1xuICAgIGluc3RhbmNlLl9pbnN0YWxsZWRQbHVnaW5zLmxlbmd0aCA9IDBcbiAgfVxuICBjb25zdCB1c2UgPSBpbnN0YW5jZS51c2VcbiAgaW5zdGFuY2UudXNlID0gKHBsdWdpbiwgLi4ucmVzdCkgPT4ge1xuICAgIGlmIChwbHVnaW4uaW5zdGFsbGVkID09PSB0cnVlKSB7XG4gICAgICBwbHVnaW4uaW5zdGFsbGVkID0gZmFsc2VcbiAgICB9XG4gICAgaWYgKHBsdWdpbi5pbnN0YWxsICYmIHBsdWdpbi5pbnN0YWxsLmluc3RhbGxlZCA9PT0gdHJ1ZSkge1xuICAgICAgcGx1Z2luLmluc3RhbGwuaW5zdGFsbGVkID0gZmFsc2VcbiAgICB9XG4gICAgdXNlLmNhbGwoaW5zdGFuY2UsIHBsdWdpbiwgLi4ucmVzdClcbiAgfVxuICByZXR1cm4gaW5zdGFuY2Vcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTG9jYWxWdWVcbiIsIi8vIEBmbG93XG5cbmltcG9ydCAnLi9tYXRjaGVzLXBvbHlmaWxsJ1xuaW1wb3J0ICcuL29iamVjdC1hc3NpZ24tcG9seWZpbGwnXG5pbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcbmltcG9ydCBWdWVXcmFwcGVyIGZyb20gJy4vdnVlLXdyYXBwZXInXG5pbXBvcnQgY3JlYXRlSW5zdGFuY2UgZnJvbSAnY3JlYXRlLWluc3RhbmNlJ1xuaW1wb3J0IGNyZWF0ZUVsZW1lbnQgZnJvbSAnLi9jcmVhdGUtZWxlbWVudCdcbmltcG9ydCBjcmVhdGVMb2NhbFZ1ZSBmcm9tICcuL2NyZWF0ZS1sb2NhbC12dWUnXG5pbXBvcnQgZXJyb3JIYW5kbGVyIGZyb20gJy4vZXJyb3ItaGFuZGxlcidcbmltcG9ydCB7IGZpbmRBbGxWdWVDb21wb25lbnRzRnJvbVZtIH0gZnJvbSAnLi9maW5kLXZ1ZS1jb21wb25lbnRzJ1xuaW1wb3J0IHsgbWVyZ2VPcHRpb25zIH0gZnJvbSAnc2hhcmVkL21lcmdlLW9wdGlvbnMnXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJ1xuaW1wb3J0IHdhcm5JZk5vV2luZG93IGZyb20gJy4vd2Fybi1pZi1uby13aW5kb3cnXG5cblZ1ZS5jb25maWcucHJvZHVjdGlvblRpcCA9IGZhbHNlXG5WdWUuY29uZmlnLmRldnRvb2xzID0gZmFsc2VcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW91bnQgKFxuICBjb21wb25lbnQ6IENvbXBvbmVudCxcbiAgb3B0aW9uczogT3B0aW9ucyA9IHt9XG4pOiBWdWVXcmFwcGVyIHtcbiAgY29uc3QgZXhpc3RpbmdFcnJvckhhbmRsZXIgPSBWdWUuY29uZmlnLmVycm9ySGFuZGxlclxuICBWdWUuY29uZmlnLmVycm9ySGFuZGxlciA9IGVycm9ySGFuZGxlclxuXG4gIHdhcm5JZk5vV2luZG93KClcblxuICAvLyBSZW1vdmUgY2FjaGVkIGNvbnN0cnVjdG9yXG4gIGRlbGV0ZSBjb21wb25lbnQuX0N0b3JcbiAgY29uc3QgdnVlQ29uc3RydWN0b3IgPSBjcmVhdGVMb2NhbFZ1ZShvcHRpb25zLmxvY2FsVnVlKVxuXG4gIGNvbnN0IGVsbSA9IG9wdGlvbnMuYXR0YWNoVG9Eb2N1bWVudCA/IGNyZWF0ZUVsZW1lbnQoKSA6IHVuZGVmaW5lZFxuXG4gIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSBtZXJnZU9wdGlvbnMob3B0aW9ucywgY29uZmlnKVxuXG4gIGNvbnN0IHBhcmVudFZtID0gY3JlYXRlSW5zdGFuY2UoXG4gICAgY29tcG9uZW50LFxuICAgIG1lcmdlZE9wdGlvbnMsXG4gICAgdnVlQ29uc3RydWN0b3IsXG4gICAgZWxtXG4gIClcblxuICBjb25zdCB2bSA9IHBhcmVudFZtLiRtb3VudChlbG0pLiRyZWZzLnZtXG5cbiAgLy8gV29ya2Fyb3VuZCBmb3IgVnVlIDwgMi41XG4gIHZtLl9zdGF0aWNUcmVlcyA9IFtdXG5cbiAgY29uc3QgY29tcG9uZW50c1dpdGhFcnJvciA9IGZpbmRBbGxWdWVDb21wb25lbnRzRnJvbVZtKHZtKS5maWx0ZXIoXG4gICAgYyA9PiBjLl9lcnJvclxuICApXG5cbiAgaWYgKGNvbXBvbmVudHNXaXRoRXJyb3IubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGNvbXBvbmVudHNXaXRoRXJyb3JbMF0uX2Vycm9yXG4gIH1cblxuICBWdWUuY29uZmlnLmVycm9ySGFuZGxlciA9IGV4aXN0aW5nRXJyb3JIYW5kbGVyXG5cbiAgY29uc3Qgd3JhcHBlck9wdGlvbnMgPSB7XG4gICAgYXR0YWNoZWRUb0RvY3VtZW50OiAhIW1lcmdlZE9wdGlvbnMuYXR0YWNoVG9Eb2N1bWVudCxcbiAgICBzeW5jOiBtZXJnZWRPcHRpb25zLnN5bmNcbiAgfVxuXG4gIHJldHVybiBuZXcgVnVlV3JhcHBlcih2bSwgd3JhcHBlck9wdGlvbnMpXG59XG4iLCIvLyBAZmxvd1xuXG5pbXBvcnQgJy4vd2Fybi1pZi1uby13aW5kb3cnXG5pbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcbmltcG9ydCBtb3VudCBmcm9tICcuL21vdW50J1xuaW1wb3J0IHR5cGUgVnVlV3JhcHBlciBmcm9tICcuL3Z1ZS13cmFwcGVyJ1xuaW1wb3J0IHtcbiAgY3JlYXRlQ29tcG9uZW50U3R1YnNGb3JBbGwsXG4gIGNyZWF0ZUNvbXBvbmVudFN0dWJzRm9yR2xvYmFsc1xufSBmcm9tICdzaGFyZWQvc3R1Yi1jb21wb25lbnRzJ1xuaW1wb3J0IHsgY2FtZWxpemUsIGNhcGl0YWxpemUsIGh5cGhlbmF0ZSB9IGZyb20gJ3NoYXJlZC91dGlsJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGFsbG93TW91bnQgKFxuICBjb21wb25lbnQ6IENvbXBvbmVudCxcbiAgb3B0aW9uczogT3B0aW9ucyA9IHt9XG4pOiBWdWVXcmFwcGVyIHtcbiAgY29uc3QgdnVlID0gb3B0aW9ucy5sb2NhbFZ1ZSB8fCBWdWVcblxuICAvLyByZW1vdmUgYW55IHJlY3Vyc2l2ZSBjb21wb25lbnRzIGFkZGVkIHRvIHRoZSBjb25zdHJ1Y3RvclxuICAvLyBpbiB2bS5faW5pdCBmcm9tIHByZXZpb3VzIHRlc3RzXG4gIGlmIChjb21wb25lbnQubmFtZSAmJiBjb21wb25lbnQuY29tcG9uZW50cykge1xuICAgIGRlbGV0ZSBjb21wb25lbnQuY29tcG9uZW50c1tjYXBpdGFsaXplKGNhbWVsaXplKGNvbXBvbmVudC5uYW1lKSldXG4gICAgZGVsZXRlIGNvbXBvbmVudC5jb21wb25lbnRzW2h5cGhlbmF0ZShjb21wb25lbnQubmFtZSldXG4gIH1cblxuICByZXR1cm4gbW91bnQoY29tcG9uZW50LCB7XG4gICAgLi4ub3B0aW9ucyxcbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAuLi5jcmVhdGVDb21wb25lbnRTdHVic0Zvckdsb2JhbHModnVlKSxcbiAgICAgIC4uLmNyZWF0ZUNvbXBvbmVudFN0dWJzRm9yQWxsKGNvbXBvbmVudClcbiAgICB9XG4gIH0pXG59XG4iLCIvLyBAZmxvd1xuY29uc3QgdG9UeXBlczogQXJyYXk8RnVuY3Rpb24+ID0gW1N0cmluZywgT2JqZWN0XVxuY29uc3QgZXZlbnRUeXBlczogQXJyYXk8RnVuY3Rpb24+ID0gW1N0cmluZywgQXJyYXldXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ1JvdXRlckxpbmtTdHViJyxcbiAgcHJvcHM6IHtcbiAgICB0bzoge1xuICAgICAgdHlwZTogdG9UeXBlcyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgfSxcbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdhJ1xuICAgIH0sXG4gICAgZXhhY3Q6IEJvb2xlYW4sXG4gICAgYXBwZW5kOiBCb29sZWFuLFxuICAgIHJlcGxhY2U6IEJvb2xlYW4sXG4gICAgYWN0aXZlQ2xhc3M6IFN0cmluZyxcbiAgICBleGFjdEFjdGl2ZUNsYXNzOiBTdHJpbmcsXG4gICAgZXZlbnQ6IHtcbiAgICAgIHR5cGU6IGV2ZW50VHlwZXMsXG4gICAgICBkZWZhdWx0OiAnY2xpY2snXG4gICAgfVxuICB9LFxuICByZW5kZXIgKGg6IEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGgodGhpcy50YWcsIHVuZGVmaW5lZCwgdGhpcy4kc2xvdHMuZGVmYXVsdClcbiAgfVxufVxuIiwiaW1wb3J0IHNoYWxsb3dNb3VudCBmcm9tICcuL3NoYWxsb3ctbW91bnQnXG5pbXBvcnQgbW91bnQgZnJvbSAnLi9tb3VudCdcbmltcG9ydCBjcmVhdGVMb2NhbFZ1ZSBmcm9tICcuL2NyZWF0ZS1sb2NhbC12dWUnXG5pbXBvcnQgVHJhbnNpdGlvblN0dWIgZnJvbSAnLi9jb21wb25lbnRzL1RyYW5zaXRpb25TdHViJ1xuaW1wb3J0IFRyYW5zaXRpb25Hcm91cFN0dWIgZnJvbSAnLi9jb21wb25lbnRzL1RyYW5zaXRpb25Hcm91cFN0dWInXG5pbXBvcnQgUm91dGVyTGlua1N0dWIgZnJvbSAnLi9jb21wb25lbnRzL1JvdXRlckxpbmtTdHViJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZydcbmltcG9ydCB7IHdhcm4gfSBmcm9tICdzaGFyZWQvdXRpbCdcblxuZnVuY3Rpb24gc2hhbGxvdyAoY29tcG9uZW50LCBvcHRpb25zKSB7XG4gIHdhcm4oXG4gICAgYHNoYWxsb3cgaGFzIGJlZW4gcmVuYW1lZCB0byBzaGFsbG93TW91bnQuIHNoYWxsb3cgYCArXG4gICAgICBgd2lsbCBiZSByZW1vdmVkIGluIDEuMC4wLCB1c2Ugc2hhbGxvd01vdW50IGluc3RlYWRgXG4gIClcbiAgcmV0dXJuIHNoYWxsb3dNb3VudChjb21wb25lbnQsIG9wdGlvbnMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY3JlYXRlTG9jYWxWdWUsXG4gIGNvbmZpZyxcbiAgbW91bnQsXG4gIHNoYWxsb3csXG4gIHNoYWxsb3dNb3VudCxcbiAgVHJhbnNpdGlvblN0dWIsXG4gIFRyYW5zaXRpb25Hcm91cFN0dWIsXG4gIFJvdXRlckxpbmtTdHViXG59XG4iXSwibmFtZXMiOlsidGhyb3dFcnJvciIsImNvbnN0IiwibGV0IiwiYXJndW1lbnRzIiwiZXEiLCJhc3NvY0luZGV4T2YiLCJ0aGlzIiwibGlzdENhY2hlQ2xlYXIiLCJsaXN0Q2FjaGVEZWxldGUiLCJsaXN0Q2FjaGVHZXQiLCJsaXN0Q2FjaGVIYXMiLCJsaXN0Q2FjaGVTZXQiLCJMaXN0Q2FjaGUiLCJnbG9iYWwiLCJmcmVlR2xvYmFsIiwicm9vdCIsIlN5bWJvbCIsIm9iamVjdFByb3RvIiwibmF0aXZlT2JqZWN0VG9TdHJpbmciLCJzeW1Ub1N0cmluZ1RhZyIsImdldFJhd1RhZyIsIm9iamVjdFRvU3RyaW5nIiwiaXNPYmplY3QiLCJiYXNlR2V0VGFnIiwiY29yZUpzRGF0YSIsImZ1bmNQcm90byIsImZ1bmNUb1N0cmluZyIsImhhc093blByb3BlcnR5IiwiaXNNYXNrZWQiLCJpc0Z1bmN0aW9uIiwidG9Tb3VyY2UiLCJnZXRWYWx1ZSIsImJhc2VJc05hdGl2ZSIsImdldE5hdGl2ZSIsIm5hdGl2ZUNyZWF0ZSIsIkhBU0hfVU5ERUZJTkVEIiwiaGFzaENsZWFyIiwiaGFzaERlbGV0ZSIsImhhc2hHZXQiLCJoYXNoSGFzIiwiaGFzaFNldCIsIkhhc2giLCJNYXAiLCJpc0tleWFibGUiLCJnZXRNYXBEYXRhIiwibWFwQ2FjaGVDbGVhciIsIm1hcENhY2hlRGVsZXRlIiwibWFwQ2FjaGVHZXQiLCJtYXBDYWNoZUhhcyIsIm1hcENhY2hlU2V0IiwiTWFwQ2FjaGUiLCJzdGFja0NsZWFyIiwic3RhY2tEZWxldGUiLCJzdGFja0dldCIsInN0YWNrSGFzIiwic3RhY2tTZXQiLCJkZWZpbmVQcm9wZXJ0eSIsImJhc2VBc3NpZ25WYWx1ZSIsImNyZWF0ZUJhc2VGb3IiLCJVaW50OEFycmF5IiwiY2xvbmVBcnJheUJ1ZmZlciIsIm92ZXJBcmciLCJpc1Byb3RvdHlwZSIsImJhc2VDcmVhdGUiLCJnZXRQcm90b3R5cGUiLCJpc09iamVjdExpa2UiLCJiYXNlSXNBcmd1bWVudHMiLCJpc0xlbmd0aCIsImlzQXJyYXlMaWtlIiwic3R1YkZhbHNlIiwiYXJnc1RhZyIsImZ1bmNUYWciLCJvYmplY3RUYWciLCJub2RlVXRpbCIsImJhc2VVbmFyeSIsImJhc2VJc1R5cGVkQXJyYXkiLCJhc3NpZ25WYWx1ZSIsIk1BWF9TQUZFX0lOVEVHRVIiLCJpc0FycmF5IiwiaXNBcmd1bWVudHMiLCJpc0J1ZmZlciIsImlzVHlwZWRBcnJheSIsImJhc2VUaW1lcyIsImlzSW5kZXgiLCJuYXRpdmVLZXlzSW4iLCJrZXlzSW4iLCJhcnJheUxpa2VLZXlzIiwiYmFzZUtleXNJbiIsImNvcHlPYmplY3QiLCJzYWZlR2V0IiwiYXNzaWduTWVyZ2VWYWx1ZSIsImlzQXJyYXlMaWtlT2JqZWN0IiwiY29weUFycmF5IiwiY2xvbmVCdWZmZXIiLCJjbG9uZVR5cGVkQXJyYXkiLCJpc1BsYWluT2JqZWN0IiwidG9QbGFpbk9iamVjdCIsImluaXRDbG9uZU9iamVjdCIsImJhc2VGb3IiLCJTdGFjayIsImJhc2VNZXJnZURlZXAiLCJhcHBseSIsImlkZW50aXR5IiwiY29uc3RhbnQiLCJzaG9ydE91dCIsImJhc2VTZXRUb1N0cmluZyIsInNldFRvU3RyaW5nIiwib3ZlclJlc3QiLCJiYXNlUmVzdCIsImlzSXRlcmF0ZWVDYWxsIiwiY3JlYXRlQXNzaWduZXIiLCJiYXNlTWVyZ2UiLCJpc0RvbVNlbGVjdG9yIiwiaXNOYW1lU2VsZWN0b3IiLCJpc1Z1ZUNvbXBvbmVudCIsImlzUmVmU2VsZWN0b3IiLCJ3YXJuIiwiZmluZEFsbCIsIm1lcmdlV2l0aCIsInN1cGVyIiwibmF0aXZlS2V5cyIsImJhc2VLZXlzIiwia2V5cyIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwic3R1YkFycmF5IiwiYXJyYXlGaWx0ZXIiLCJnZXRTeW1ib2xzIiwibmF0aXZlR2V0U3ltYm9scyIsImFycmF5UHVzaCIsImdldFN5bWJvbHNJbiIsImJhc2VHZXRBbGxLZXlzIiwibWFwVGFnIiwic2V0VGFnIiwid2Vha01hcFRhZyIsImRhdGFWaWV3VGFnIiwiRGF0YVZpZXciLCJQcm9taXNlIiwiU2V0IiwiV2Vha01hcCIsImJvb2xUYWciLCJkYXRlVGFnIiwibnVtYmVyVGFnIiwicmVnZXhwVGFnIiwic3RyaW5nVGFnIiwiYXJyYXlCdWZmZXJUYWciLCJmbG9hdDMyVGFnIiwiZmxvYXQ2NFRhZyIsImludDhUYWciLCJpbnQxNlRhZyIsImludDMyVGFnIiwidWludDhUYWciLCJ1aW50OENsYW1wZWRUYWciLCJ1aW50MTZUYWciLCJ1aW50MzJUYWciLCJjbG9uZURhdGFWaWV3IiwiY2xvbmVSZWdFeHAiLCJjbG9uZVN5bWJvbCIsImdldFRhZyIsImJhc2VJc01hcCIsImJhc2VJc1NldCIsImFycmF5VGFnIiwiZXJyb3JUYWciLCJnZW5UYWciLCJzeW1ib2xUYWciLCJpbml0Q2xvbmVBcnJheSIsImNvcHlTeW1ib2xzSW4iLCJiYXNlQXNzaWduSW4iLCJjb3B5U3ltYm9scyIsImJhc2VBc3NpZ24iLCJpbml0Q2xvbmVCeVRhZyIsImlzU2V0IiwiaXNNYXAiLCJnZXRBbGxLZXlzSW4iLCJnZXRBbGxLZXlzIiwiYXJyYXlFYWNoIiwiQ0xPTkVfREVFUF9GTEFHIiwiQ0xPTkVfU1lNQk9MU19GTEFHIiwiYmFzZUNsb25lIiwiY2xvbmVEZWVwIiwibWVyZ2VPcHRpb25zIiwiY2FwaXRhbGl6ZSIsImNhbWVsaXplIiwiaHlwaGVuYXRlIiwiY3JlYXRlQ29tcG9uZW50U3R1YnNGb3JHbG9iYWxzIiwiY3JlYXRlQ29tcG9uZW50U3R1YnNGb3JBbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBSUEsQUFBZSxTQUFTLGNBQWMsSUFBVTtFQUM5QyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtJQUNqQ0EsZUFBVTtNQUNSLGtEQUFrRDtRQUNoRCxpQ0FDUDtTQUNRLDhDQUE4QztVQUM3QyxpQkFDVCxDQUFDO1NBQ08sTUFBTTtVQUNMLDJEQUEyRDtVQUMzRCxtQkFBbUIsQ0FBQztNQUN6QjtHQUNGO0NBQ0Y7O0FDbEJELElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7RUFDaEUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPO0lBQ3ZCLE9BQU8sQ0FBQyxTQUFTLENBQUMsZUFBZTtJQUNqQyxPQUFPLENBQUMsU0FBUyxDQUFDLGtCQUFrQjtJQUNwQyxPQUFPLENBQUMsU0FBUyxDQUFDLGlCQUFpQjtJQUNuQyxPQUFPLENBQUMsU0FBUyxDQUFDLGdCQUFnQjtJQUNsQyxPQUFPLENB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
