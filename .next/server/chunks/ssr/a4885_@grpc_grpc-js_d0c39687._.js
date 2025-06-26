module.exports = {

"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = exports.DEFAULT_MAX_SEND_MESSAGE_LENGTH = exports.Propagate = exports.LogVerbosity = exports.Status = void 0;
var Status;
(function(Status) {
    Status[Status["OK"] = 0] = "OK";
    Status[Status["CANCELLED"] = 1] = "CANCELLED";
    Status[Status["UNKNOWN"] = 2] = "UNKNOWN";
    Status[Status["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
    Status[Status["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
    Status[Status["NOT_FOUND"] = 5] = "NOT_FOUND";
    Status[Status["ALREADY_EXISTS"] = 6] = "ALREADY_EXISTS";
    Status[Status["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
    Status[Status["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
    Status[Status["FAILED_PRECONDITION"] = 9] = "FAILED_PRECONDITION";
    Status[Status["ABORTED"] = 10] = "ABORTED";
    Status[Status["OUT_OF_RANGE"] = 11] = "OUT_OF_RANGE";
    Status[Status["UNIMPLEMENTED"] = 12] = "UNIMPLEMENTED";
    Status[Status["INTERNAL"] = 13] = "INTERNAL";
    Status[Status["UNAVAILABLE"] = 14] = "UNAVAILABLE";
    Status[Status["DATA_LOSS"] = 15] = "DATA_LOSS";
    Status[Status["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
})(Status = exports.Status || (exports.Status = {}));
var LogVerbosity;
(function(LogVerbosity) {
    LogVerbosity[LogVerbosity["DEBUG"] = 0] = "DEBUG";
    LogVerbosity[LogVerbosity["INFO"] = 1] = "INFO";
    LogVerbosity[LogVerbosity["ERROR"] = 2] = "ERROR";
    LogVerbosity[LogVerbosity["NONE"] = 3] = "NONE";
})(LogVerbosity = exports.LogVerbosity || (exports.LogVerbosity = {}));
/**
 * NOTE: This enum is not currently used in any implemented API in this
 * library. It is included only for type parity with the other implementation.
 */ var Propagate;
(function(Propagate) {
    Propagate[Propagate["DEADLINE"] = 1] = "DEADLINE";
    Propagate[Propagate["CENSUS_STATS_CONTEXT"] = 2] = "CENSUS_STATS_CONTEXT";
    Propagate[Propagate["CENSUS_TRACING_CONTEXT"] = 4] = "CENSUS_TRACING_CONTEXT";
    Propagate[Propagate["CANCELLATION"] = 8] = "CANCELLATION";
    // https://github.com/grpc/grpc/blob/master/include/grpc/impl/codegen/propagation_bits.h#L43
    Propagate[Propagate["DEFAULTS"] = 65535] = "DEFAULTS";
})(Propagate = exports.Propagate || (exports.Propagate = {}));
// -1 means unlimited
exports.DEFAULT_MAX_SEND_MESSAGE_LENGTH = -1;
// 4 MB default
exports.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = 4 * 1024 * 1024; //# sourceMappingURL=constants.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isTracerEnabled = exports.trace = exports.log = exports.setLoggerVerbosity = exports.setLogger = exports.getLogger = void 0;
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const DEFAULT_LOGGER = {
    error: (message, ...optionalParams)=>{
        console.error('E ' + message, ...optionalParams);
    },
    info: (message, ...optionalParams)=>{
        console.error('I ' + message, ...optionalParams);
    },
    debug: (message, ...optionalParams)=>{
        console.error('D ' + message, ...optionalParams);
    }
};
let _logger = DEFAULT_LOGGER;
let _logVerbosity = constants_1.LogVerbosity.ERROR;
const verbosityString = (_b = (_a = process.env.GRPC_NODE_VERBOSITY) !== null && _a !== void 0 ? _a : process.env.GRPC_VERBOSITY) !== null && _b !== void 0 ? _b : '';
switch(verbosityString.toUpperCase()){
    case 'DEBUG':
        _logVerbosity = constants_1.LogVerbosity.DEBUG;
        break;
    case 'INFO':
        _logVerbosity = constants_1.LogVerbosity.INFO;
        break;
    case 'ERROR':
        _logVerbosity = constants_1.LogVerbosity.ERROR;
        break;
    case 'NONE':
        _logVerbosity = constants_1.LogVerbosity.NONE;
        break;
    default:
}
exports.getLogger = ()=>{
    return _logger;
};
exports.setLogger = (logger)=>{
    _logger = logger;
};
exports.setLoggerVerbosity = (verbosity)=>{
    _logVerbosity = verbosity;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.log = (severity, ...args)=>{
    let logFunction;
    if (severity >= _logVerbosity) {
        switch(severity){
            case constants_1.LogVerbosity.DEBUG:
                logFunction = _logger.debug;
                break;
            case constants_1.LogVerbosity.INFO:
                logFunction = _logger.info;
                break;
            case constants_1.LogVerbosity.ERROR:
                logFunction = _logger.error;
                break;
        }
        /* Fall back to _logger.error when other methods are not available for
         * compatiblity with older behavior that always logged to _logger.error */ if (!logFunction) {
            logFunction = _logger.error;
        }
        if (logFunction) {
            logFunction.bind(_logger)(...args);
        }
    }
};
const tracersString = (_d = (_c = process.env.GRPC_NODE_TRACE) !== null && _c !== void 0 ? _c : process.env.GRPC_TRACE) !== null && _d !== void 0 ? _d : '';
const enabledTracers = new Set();
const disabledTracers = new Set();
for (const tracerName of tracersString.split(',')){
    if (tracerName.startsWith('-')) {
        disabledTracers.add(tracerName.substring(1));
    } else {
        enabledTracers.add(tracerName);
    }
}
const allEnabled = enabledTracers.has('all');
function trace(severity, tracer, text) {
    if (isTracerEnabled(tracer)) {
        exports.log(severity, new Date().toISOString() + ' | ' + tracer + ' | ' + text);
    }
}
exports.trace = trace;
function isTracerEnabled(tracer) {
    return !disabledTracers.has(tracer) && (allEnabled || enabledTracers.has(tracer));
}
exports.isTracerEnabled = isTracerEnabled; //# sourceMappingURL=logging.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Metadata = void 0;
const logging_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const LEGAL_KEY_REGEX = /^[0-9a-z_.-]+$/;
const LEGAL_NON_BINARY_VALUE_REGEX = /^[ -~]*$/;
function isLegalKey(key) {
    return LEGAL_KEY_REGEX.test(key);
}
function isLegalNonBinaryValue(value) {
    return LEGAL_NON_BINARY_VALUE_REGEX.test(value);
}
function isBinaryKey(key) {
    return key.endsWith('-bin');
}
function isCustomMetadata(key) {
    return !key.startsWith('grpc-');
}
function normalizeKey(key) {
    return key.toLowerCase();
}
function validate(key, value) {
    if (!isLegalKey(key)) {
        throw new Error('Metadata key "' + key + '" contains illegal characters');
    }
    if (value !== null && value !== undefined) {
        if (isBinaryKey(key)) {
            if (!Buffer.isBuffer(value)) {
                throw new Error("keys that end with '-bin' must have Buffer values");
            }
        } else {
            if (Buffer.isBuffer(value)) {
                throw new Error("keys that don't end with '-bin' must have String values");
            }
            if (!isLegalNonBinaryValue(value)) {
                throw new Error('Metadata string value "' + value + '" contains illegal characters');
            }
        }
    }
}
/**
 * A class for storing metadata. Keys are normalized to lowercase ASCII.
 */ class Metadata {
    constructor(options = {}){
        this.internalRepr = new Map();
        this.options = options;
    }
    /**
     * Sets the given value for the given key by replacing any other values
     * associated with that key. Normalizes the key.
     * @param key The key to whose value should be set.
     * @param value The value to set. Must be a buffer if and only
     *   if the normalized key ends with '-bin'.
     */ set(key, value) {
        key = normalizeKey(key);
        validate(key, value);
        this.internalRepr.set(key, [
            value
        ]);
    }
    /**
     * Adds the given value for the given key by appending to a list of previous
     * values associated with that key. Normalizes the key.
     * @param key The key for which a new value should be appended.
     * @param value The value to add. Must be a buffer if and only
     *   if the normalized key ends with '-bin'.
     */ add(key, value) {
        key = normalizeKey(key);
        validate(key, value);
        const existingValue = this.internalRepr.get(key);
        if (existingValue === undefined) {
            this.internalRepr.set(key, [
                value
            ]);
        } else {
            existingValue.push(value);
        }
    }
    /**
     * Removes the given key and any associated values. Normalizes the key.
     * @param key The key whose values should be removed.
     */ remove(key) {
        key = normalizeKey(key);
        // validate(key);
        this.internalRepr.delete(key);
    }
    /**
     * Gets a list of all values associated with the key. Normalizes the key.
     * @param key The key whose value should be retrieved.
     * @return A list of values associated with the given key.
     */ get(key) {
        key = normalizeKey(key);
        // validate(key);
        return this.internalRepr.get(key) || [];
    }
    /**
     * Gets a plain object mapping each key to the first value associated with it.
     * This reflects the most common way that people will want to see metadata.
     * @return A key/value mapping of the metadata.
     */ getMap() {
        const result = {};
        for (const [key, values] of this.internalRepr){
            if (values.length > 0) {
                const v = values[0];
                result[key] = Buffer.isBuffer(v) ? Buffer.from(v) : v;
            }
        }
        return result;
    }
    /**
     * Clones the metadata object.
     * @return The newly cloned object.
     */ clone() {
        const newMetadata = new Metadata(this.options);
        const newInternalRepr = newMetadata.internalRepr;
        for (const [key, value] of this.internalRepr){
            const clonedValue = value.map((v)=>{
                if (Buffer.isBuffer(v)) {
                    return Buffer.from(v);
                } else {
                    return v;
                }
            });
            newInternalRepr.set(key, clonedValue);
        }
        return newMetadata;
    }
    /**
     * Merges all key-value pairs from a given Metadata object into this one.
     * If both this object and the given object have values in the same key,
     * values from the other Metadata object will be appended to this object's
     * values.
     * @param other A Metadata object.
     */ merge(other) {
        for (const [key, values] of other.internalRepr){
            const mergedValue = (this.internalRepr.get(key) || []).concat(values);
            this.internalRepr.set(key, mergedValue);
        }
    }
    setOptions(options) {
        this.options = options;
    }
    getOptions() {
        return this.options;
    }
    /**
     * Creates an OutgoingHttpHeaders object that can be used with the http2 API.
     */ toHttp2Headers() {
        // NOTE: Node <8.9 formats http2 headers incorrectly.
        const result = {};
        for (const [key, values] of this.internalRepr){
            // We assume that the user's interaction with this object is limited to
            // through its public API (i.e. keys and values are already validated).
            result[key] = values.map(bufToString);
        }
        return result;
    }
    // For compatibility with the other Metadata implementation
    _getCoreRepresentation() {
        return this.internalRepr;
    }
    /**
     * This modifies the behavior of JSON.stringify to show an object
     * representation of the metadata map.
     */ toJSON() {
        const result = {};
        for (const [key, values] of this.internalRepr){
            result[key] = values;
        }
        return result;
    }
    /**
     * Returns a new Metadata object based fields in a given IncomingHttpHeaders
     * object.
     * @param headers An IncomingHttpHeaders object.
     */ static fromHttp2Headers(headers) {
        const result = new Metadata();
        for (const key of Object.keys(headers)){
            // Reserved headers (beginning with `:`) are not valid keys.
            if (key.charAt(0) === ':') {
                continue;
            }
            const values = headers[key];
            try {
                if (isBinaryKey(key)) {
                    if (Array.isArray(values)) {
                        values.forEach((value)=>{
                            result.add(key, Buffer.from(value, 'base64'));
                        });
                    } else if (values !== undefined) {
                        if (isCustomMetadata(key)) {
                            values.split(',').forEach((v)=>{
                                result.add(key, Buffer.from(v.trim(), 'base64'));
                            });
                        } else {
                            result.add(key, Buffer.from(values, 'base64'));
                        }
                    }
                } else {
                    if (Array.isArray(values)) {
                        values.forEach((value)=>{
                            result.add(key, value);
                        });
                    } else if (values !== undefined) {
                        result.add(key, values);
                    }
                }
            } catch (error) {
                const message = `Failed to add metadata entry ${key}: ${values}. ${error.message}. For more information see https://github.com/grpc/grpc-node/issues/1173`;
                logging_1.log(constants_1.LogVerbosity.ERROR, message);
            }
        }
        return result;
    }
}
exports.Metadata = Metadata;
const bufToString = (val)=>{
    return Buffer.isBuffer(val) ? val.toString('base64') : val;
}; //# sourceMappingURL=metadata.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call-credentials.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CallCredentials = void 0;
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
function isCurrentOauth2Client(client) {
    return 'getRequestHeaders' in client && typeof client.getRequestHeaders === 'function';
}
/**
 * A class that represents a generic method of adding authentication-related
 * metadata on a per-request basis.
 */ class CallCredentials {
    /**
     * Creates a new CallCredentials object from a given function that generates
     * Metadata objects.
     * @param metadataGenerator A function that accepts a set of options, and
     * generates a Metadata object based on these options, which is passed back
     * to the caller via a supplied (err, metadata) callback.
     */ static createFromMetadataGenerator(metadataGenerator) {
        return new SingleCallCredentials(metadataGenerator);
    }
    /**
     * Create a gRPC credential from a Google credential object.
     * @param googleCredentials The authentication client to use.
     * @return The resulting CallCredentials object.
     */ static createFromGoogleCredential(googleCredentials) {
        return CallCredentials.createFromMetadataGenerator((options, callback)=>{
            let getHeaders;
            if (isCurrentOauth2Client(googleCredentials)) {
                getHeaders = googleCredentials.getRequestHeaders(options.service_url);
            } else {
                getHeaders = new Promise((resolve, reject)=>{
                    googleCredentials.getRequestMetadata(options.service_url, (err, headers)=>{
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(headers);
                    });
                });
            }
            getHeaders.then((headers)=>{
                const metadata = new metadata_1.Metadata();
                for (const key of Object.keys(headers)){
                    metadata.add(key, headers[key]);
                }
                callback(null, metadata);
            }, (err)=>{
                callback(err);
            });
        });
    }
    static createEmpty() {
        return new EmptyCallCredentials();
    }
}
exports.CallCredentials = CallCredentials;
class ComposedCallCredentials extends CallCredentials {
    constructor(creds){
        super();
        this.creds = creds;
    }
    async generateMetadata(options) {
        const base = new metadata_1.Metadata();
        const generated = await Promise.all(this.creds.map((cred)=>cred.generateMetadata(options)));
        for (const gen of generated){
            base.merge(gen);
        }
        return base;
    }
    compose(other) {
        return new ComposedCallCredentials(this.creds.concat([
            other
        ]));
    }
    _equals(other) {
        if (this === other) {
            return true;
        }
        if (other instanceof ComposedCallCredentials) {
            return this.creds.every((value, index)=>value._equals(other.creds[index]));
        } else {
            return false;
        }
    }
}
class SingleCallCredentials extends CallCredentials {
    constructor(metadataGenerator){
        super();
        this.metadataGenerator = metadataGenerator;
    }
    generateMetadata(options) {
        return new Promise((resolve, reject)=>{
            this.metadataGenerator(options, (err, metadata)=>{
                if (metadata !== undefined) {
                    resolve(metadata);
                } else {
                    reject(err);
                }
            });
        });
    }
    compose(other) {
        return new ComposedCallCredentials([
            this,
            other
        ]);
    }
    _equals(other) {
        if (this === other) {
            return true;
        }
        if (other instanceof SingleCallCredentials) {
            return this.metadataGenerator === other.metadataGenerator;
        } else {
            return false;
        }
    }
}
class EmptyCallCredentials extends CallCredentials {
    generateMetadata(options) {
        return Promise.resolve(new metadata_1.Metadata());
    }
    compose(other) {
        return other;
    }
    _equals(other) {
        return other instanceof EmptyCallCredentials;
    }
} //# sourceMappingURL=call-credentials.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/stream-decoder.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StreamDecoder = void 0;
var ReadState;
(function(ReadState) {
    ReadState[ReadState["NO_DATA"] = 0] = "NO_DATA";
    ReadState[ReadState["READING_SIZE"] = 1] = "READING_SIZE";
    ReadState[ReadState["READING_MESSAGE"] = 2] = "READING_MESSAGE";
})(ReadState || (ReadState = {}));
class StreamDecoder {
    constructor(){
        this.readState = ReadState.NO_DATA;
        this.readCompressFlag = Buffer.alloc(1);
        this.readPartialSize = Buffer.alloc(4);
        this.readSizeRemaining = 4;
        this.readMessageSize = 0;
        this.readPartialMessage = [];
        this.readMessageRemaining = 0;
    }
    write(data) {
        let readHead = 0;
        let toRead;
        const result = [];
        while(readHead < data.length){
            switch(this.readState){
                case ReadState.NO_DATA:
                    this.readCompressFlag = data.slice(readHead, readHead + 1);
                    readHead += 1;
                    this.readState = ReadState.READING_SIZE;
                    this.readPartialSize.fill(0);
                    this.readSizeRemaining = 4;
                    this.readMessageSize = 0;
                    this.readMessageRemaining = 0;
                    this.readPartialMessage = [];
                    break;
                case ReadState.READING_SIZE:
                    toRead = Math.min(data.length - readHead, this.readSizeRemaining);
                    data.copy(this.readPartialSize, 4 - this.readSizeRemaining, readHead, readHead + toRead);
                    this.readSizeRemaining -= toRead;
                    readHead += toRead;
                    // readSizeRemaining >=0 here
                    if (this.readSizeRemaining === 0) {
                        this.readMessageSize = this.readPartialSize.readUInt32BE(0);
                        this.readMessageRemaining = this.readMessageSize;
                        if (this.readMessageRemaining > 0) {
                            this.readState = ReadState.READING_MESSAGE;
                        } else {
                            const message = Buffer.concat([
                                this.readCompressFlag,
                                this.readPartialSize
                            ], 5);
                            this.readState = ReadState.NO_DATA;
                            result.push(message);
                        }
                    }
                    break;
                case ReadState.READING_MESSAGE:
                    toRead = Math.min(data.length - readHead, this.readMessageRemaining);
                    this.readPartialMessage.push(data.slice(readHead, readHead + toRead));
                    this.readMessageRemaining -= toRead;
                    readHead += toRead;
                    // readMessageRemaining >=0 here
                    if (this.readMessageRemaining === 0) {
                        // At this point, we have read a full message
                        const framedMessageBuffers = [
                            this.readCompressFlag,
                            this.readPartialSize
                        ].concat(this.readPartialMessage);
                        const framedMessage = Buffer.concat(framedMessageBuffers, this.readMessageSize + 5);
                        this.readState = ReadState.NO_DATA;
                        result.push(framedMessage);
                    }
                    break;
                default:
                    throw new Error('Unexpected read state');
            }
        }
        return result;
    }
}
exports.StreamDecoder = StreamDecoder; //# sourceMappingURL=stream-decoder.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call-stream.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Http2CallStream = exports.InterceptingListenerImpl = exports.isInterceptingListener = void 0;
const http2 = __turbopack_context__.r("[externals]/http2 [external] (http2, cjs)");
const os = __turbopack_context__.r("[externals]/os [external] (os, cjs)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
const stream_decoder_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/stream-decoder.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const constants_2 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const TRACER_NAME = 'call_stream';
const { HTTP2_HEADER_STATUS, HTTP2_HEADER_CONTENT_TYPE, NGHTTP2_CANCEL } = http2.constants;
/**
 * Should do approximately the same thing as util.getSystemErrorName but the
 * TypeScript types don't have that function for some reason so I just made my
 * own.
 * @param errno
 */ function getSystemErrorName(errno) {
    for (const [name, num] of Object.entries(os.constants.errno)){
        if (num === errno) {
            return name;
        }
    }
    return 'Unknown system error ' + errno;
}
function getMinDeadline(deadlineList) {
    let minValue = Infinity;
    for (const deadline of deadlineList){
        const deadlineMsecs = deadline instanceof Date ? deadline.getTime() : deadline;
        if (deadlineMsecs < minValue) {
            minValue = deadlineMsecs;
        }
    }
    return minValue;
}
function isInterceptingListener(listener) {
    return listener.onReceiveMetadata !== undefined && listener.onReceiveMetadata.length === 1;
}
exports.isInterceptingListener = isInterceptingListener;
class InterceptingListenerImpl {
    constructor(listener, nextListener){
        this.listener = listener;
        this.nextListener = nextListener;
        this.processingMetadata = false;
        this.hasPendingMessage = false;
        this.processingMessage = false;
        this.pendingStatus = null;
    }
    processPendingMessage() {
        if (this.hasPendingMessage) {
            this.nextListener.onReceiveMessage(this.pendingMessage);
            this.pendingMessage = null;
            this.hasPendingMessage = false;
        }
    }
    processPendingStatus() {
        if (this.pendingStatus) {
            this.nextListener.onReceiveStatus(this.pendingStatus);
        }
    }
    onReceiveMetadata(metadata) {
        this.processingMetadata = true;
        this.listener.onReceiveMetadata(metadata, (metadata)=>{
            this.processingMetadata = false;
            this.nextListener.onReceiveMetadata(metadata);
            this.processPendingMessage();
            this.processPendingStatus();
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onReceiveMessage(message) {
        /* If this listener processes messages asynchronously, the last message may
         * be reordered with respect to the status */ this.processingMessage = true;
        this.listener.onReceiveMessage(message, (msg)=>{
            this.processingMessage = false;
            if (this.processingMetadata) {
                this.pendingMessage = msg;
                this.hasPendingMessage = true;
            } else {
                this.nextListener.onReceiveMessage(msg);
                this.processPendingStatus();
            }
        });
    }
    onReceiveStatus(status) {
        this.listener.onReceiveStatus(status, (processedStatus)=>{
            if (this.processingMetadata || this.processingMessage) {
                this.pendingStatus = processedStatus;
            } else {
                this.nextListener.onReceiveStatus(processedStatus);
            }
        });
    }
}
exports.InterceptingListenerImpl = InterceptingListenerImpl;
class Http2CallStream {
    constructor(methodName, channel, options, filterStackFactory, channelCallCredentials, callNumber){
        this.methodName = methodName;
        this.channel = channel;
        this.options = options;
        this.channelCallCredentials = channelCallCredentials;
        this.callNumber = callNumber;
        this.http2Stream = null;
        this.pendingRead = false;
        this.isWriteFilterPending = false;
        this.pendingWrite = null;
        this.pendingWriteCallback = null;
        this.writesClosed = false;
        this.decoder = new stream_decoder_1.StreamDecoder();
        this.isReadFilterPending = false;
        this.canPush = false;
        /**
         * Indicates that an 'end' event has come from the http2 stream, so there
         * will be no more data events.
         */ this.readsClosed = false;
        this.statusOutput = false;
        this.unpushedReadMessages = [];
        this.unfilteredReadMessages = [];
        // Status code mapped from :status. To be used if grpc-status is not received
        this.mappedStatusCode = constants_1.Status.UNKNOWN;
        // This is populated (non-null) if and only if the call has ended
        this.finalStatus = null;
        this.subchannel = null;
        this.listener = null;
        this.internalError = null;
        this.configDeadline = Infinity;
        this.statusWatchers = [];
        this.streamEndWatchers = [];
        this.callStatsTracker = null;
        this.filterStack = filterStackFactory.createFilter(this);
        this.credentials = channelCallCredentials;
        this.disconnectListener = ()=>{
            this.endCall({
                code: constants_1.Status.UNAVAILABLE,
                details: 'Connection dropped',
                metadata: new metadata_1.Metadata()
            });
        };
        if (this.options.parentCall && this.options.flags & constants_1.Propagate.CANCELLATION) {
            this.options.parentCall.on('cancelled', ()=>{
                this.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled by parent call');
            });
        }
    }
    outputStatus() {
        var _a;
        /* Precondition: this.finalStatus !== null */ if (this.listener && !this.statusOutput) {
            this.statusOutput = true;
            const filteredStatus = this.filterStack.receiveTrailers(this.finalStatus);
            this.trace('ended with status: code=' + filteredStatus.code + ' details="' + filteredStatus.details + '"');
            this.statusWatchers.forEach((watcher)=>watcher(filteredStatus));
            /* We delay the actual action of bubbling up the status to insulate the
             * cleanup code in this class from any errors that may be thrown in the
             * upper layers as a result of bubbling up the status. In particular,
             * if the status is not OK, the "error" event may be emitted
             * synchronously at the top level, which will result in a thrown error if
             * the user does not handle that event. */ process.nextTick(()=>{
                var _a;
                (_a = this.listener) === null || _a === void 0 ? void 0 : _a.onReceiveStatus(filteredStatus);
            });
            /* Leave the http2 stream in flowing state to drain incoming messages, to
             * ensure that the stream closure completes. The call stream already does
             * not push more messages after the status is output, so the messages go
             * nowhere either way. */ (_a = this.http2Stream) === null || _a === void 0 ? void 0 : _a.resume();
            if (this.subchannel) {
                this.subchannel.callUnref();
                this.subchannel.removeDisconnectListener(this.disconnectListener);
            }
        }
    }
    trace(text) {
        logging.trace(constants_2.LogVerbosity.DEBUG, TRACER_NAME, '[' + this.callNumber + '] ' + text);
    }
    /**
     * On first call, emits a 'status' event with the given StatusObject.
     * Subsequent calls are no-ops.
     * @param status The status of the call.
     */ endCall(status) {
        /* If the status is OK and a new status comes in (e.g. from a
         * deserialization failure), that new status takes priority */ if (this.finalStatus === null || this.finalStatus.code === constants_1.Status.OK) {
            this.finalStatus = status;
            this.maybeOutputStatus();
        }
        this.destroyHttp2Stream();
    }
    maybeOutputStatus() {
        if (this.finalStatus !== null) {
            /* The combination check of readsClosed and that the two message buffer
             * arrays are empty checks that there all incoming data has been fully
             * processed */ if (this.finalStatus.code !== constants_1.Status.OK || this.readsClosed && this.unpushedReadMessages.length === 0 && this.unfilteredReadMessages.length === 0 && !this.isReadFilterPending) {
                this.outputStatus();
            }
        }
    }
    push(message) {
        this.trace('pushing to reader message of length ' + (message instanceof Buffer ? message.length : null));
        this.canPush = false;
        process.nextTick(()=>{
            var _a;
            /* If we have already output the status any later messages should be
             * ignored, and can cause out-of-order operation errors higher up in the
             * stack. Checking as late as possible here to avoid any race conditions.
             */ if (this.statusOutput) {
                return;
            }
            (_a = this.listener) === null || _a === void 0 ? void 0 : _a.onReceiveMessage(message);
            this.maybeOutputStatus();
        });
    }
    handleFilterError(error) {
        this.cancelWithStatus(constants_1.Status.INTERNAL, error.message);
    }
    handleFilteredRead(message) {
        /* If we the call has already ended with an error, we don't want to do
         * anything with this message. Dropping it on the floor is correct
         * behavior */ if (this.finalStatus !== null && this.finalStatus.code !== constants_1.Status.OK) {
            this.maybeOutputStatus();
            return;
        }
        this.isReadFilterPending = false;
        if (this.canPush) {
            this.http2Stream.pause();
            this.push(message);
        } else {
            this.trace('unpushedReadMessages.push message of length ' + message.length);
            this.unpushedReadMessages.push(message);
        }
        if (this.unfilteredReadMessages.length > 0) {
            /* nextMessage is guaranteed not to be undefined because
               unfilteredReadMessages is non-empty */ const nextMessage = this.unfilteredReadMessages.shift();
            this.filterReceivedMessage(nextMessage);
        }
    }
    filterReceivedMessage(framedMessage) {
        /* If we the call has already ended with an error, we don't want to do
         * anything with this message. Dropping it on the floor is correct
         * behavior */ if (this.finalStatus !== null && this.finalStatus.code !== constants_1.Status.OK) {
            this.maybeOutputStatus();
            return;
        }
        this.trace('filterReceivedMessage of length ' + framedMessage.length);
        this.isReadFilterPending = true;
        this.filterStack.receiveMessage(Promise.resolve(framedMessage)).then(this.handleFilteredRead.bind(this), this.handleFilterError.bind(this));
    }
    tryPush(messageBytes) {
        if (this.isReadFilterPending) {
            this.trace('unfilteredReadMessages.push message of length ' + (messageBytes && messageBytes.length));
            this.unfilteredReadMessages.push(messageBytes);
        } else {
            this.filterReceivedMessage(messageBytes);
        }
    }
    handleTrailers(headers) {
        this.streamEndWatchers.forEach((watcher)=>watcher(true));
        let headersString = '';
        for (const header of Object.keys(headers)){
            headersString += '\t\t' + header + ': ' + headers[header] + '\n';
        }
        this.trace('Received server trailers:\n' + headersString);
        let metadata;
        try {
            metadata = metadata_1.Metadata.fromHttp2Headers(headers);
        } catch (e) {
            metadata = new metadata_1.Metadata();
        }
        const metadataMap = metadata.getMap();
        let code = this.mappedStatusCode;
        if (code === constants_1.Status.UNKNOWN && typeof metadataMap['grpc-status'] === 'string') {
            const receivedStatus = Number(metadataMap['grpc-status']);
            if (receivedStatus in constants_1.Status) {
                code = receivedStatus;
                this.trace('received status code ' + receivedStatus + ' from server');
            }
            metadata.remove('grpc-status');
        }
        let details = '';
        if (typeof metadataMap['grpc-message'] === 'string') {
            try {
                details = decodeURI(metadataMap['grpc-message']);
            } catch (e) {
                details = metadataMap['grpc-message'];
            }
            metadata.remove('grpc-message');
            this.trace('received status details string "' + details + '" from server');
        }
        const status = {
            code,
            details,
            metadata
        };
        // This is a no-op if the call was already ended when handling headers.
        this.endCall(status);
    }
    writeMessageToStream(message, callback) {
        var _a;
        (_a = this.callStatsTracker) === null || _a === void 0 ? void 0 : _a.addMessageSent();
        this.http2Stream.write(message, callback);
    }
    attachHttp2Stream(stream, subchannel, extraFilters, callStatsTracker) {
        this.filterStack.push(extraFilters);
        if (this.finalStatus !== null) {
            stream.close(NGHTTP2_CANCEL);
        } else {
            this.trace('attachHttp2Stream from subchannel ' + subchannel.getAddress());
            this.http2Stream = stream;
            this.subchannel = subchannel;
            this.callStatsTracker = callStatsTracker;
            subchannel.addDisconnectListener(this.disconnectListener);
            subchannel.callRef();
            stream.on('response', (headers, flags)=>{
                var _a;
                let headersString = '';
                for (const header of Object.keys(headers)){
                    headersString += '\t\t' + header + ': ' + headers[header] + '\n';
                }
                this.trace('Received server headers:\n' + headersString);
                switch(headers[':status']){
                    // TODO(murgatroid99): handle 100 and 101
                    case 400:
                        this.mappedStatusCode = constants_1.Status.INTERNAL;
                        break;
                    case 401:
                        this.mappedStatusCode = constants_1.Status.UNAUTHENTICATED;
                        break;
                    case 403:
                        this.mappedStatusCode = constants_1.Status.PERMISSION_DENIED;
                        break;
                    case 404:
                        this.mappedStatusCode = constants_1.Status.UNIMPLEMENTED;
                        break;
                    case 429:
                    case 502:
                    case 503:
                    case 504:
                        this.mappedStatusCode = constants_1.Status.UNAVAILABLE;
                        break;
                    default:
                        this.mappedStatusCode = constants_1.Status.UNKNOWN;
                }
                if (flags & http2.constants.NGHTTP2_FLAG_END_STREAM) {
                    this.handleTrailers(headers);
                } else {
                    let metadata;
                    try {
                        metadata = metadata_1.Metadata.fromHttp2Headers(headers);
                    } catch (error) {
                        this.endCall({
                            code: constants_1.Status.UNKNOWN,
                            details: error.message,
                            metadata: new metadata_1.Metadata()
                        });
                        return;
                    }
                    try {
                        const finalMetadata = this.filterStack.receiveMetadata(metadata);
                        (_a = this.listener) === null || _a === void 0 ? void 0 : _a.onReceiveMetadata(finalMetadata);
                    } catch (error) {
                        this.endCall({
                            code: constants_1.Status.UNKNOWN,
                            details: error.message,
                            metadata: new metadata_1.Metadata()
                        });
                    }
                }
            });
            stream.on('trailers', (headers)=>{
                this.handleTrailers(headers);
            });
            stream.on('data', (data)=>{
                /* If the status has already been output, allow the http2 stream to
                 * drain without processing the data. */ if (this.statusOutput) {
                    return;
                }
                this.trace('receive HTTP/2 data frame of length ' + data.length);
                const messages = this.decoder.write(data);
                for (const message of messages){
                    this.trace('parsed message of length ' + message.length);
                    this.callStatsTracker.addMessageReceived();
                    this.tryPush(message);
                }
            });
            stream.on('end', ()=>{
                this.readsClosed = true;
                this.maybeOutputStatus();
            });
            stream.on('close', ()=>{
                /* Use process.next tick to ensure that this code happens after any
                 * "error" event that may be emitted at about the same time, so that
                 * we can bubble up the error message from that event. */ process.nextTick(()=>{
                    var _a;
                    this.trace('HTTP/2 stream closed with code ' + stream.rstCode);
                    /* If we have a final status with an OK status code, that means that
                     * we have received all of the messages and we have processed the
                     * trailers and the call completed successfully, so it doesn't matter
                     * how the stream ends after that */ if (((_a = this.finalStatus) === null || _a === void 0 ? void 0 : _a.code) === constants_1.Status.OK) {
                        return;
                    }
                    let code;
                    let details = '';
                    switch(stream.rstCode){
                        case http2.constants.NGHTTP2_NO_ERROR:
                            /* If we get a NO_ERROR code and we already have a status, the
                             * stream completed properly and we just haven't fully processed
                             * it yet */ if (this.finalStatus !== null) {
                                return;
                            }
                            code = constants_1.Status.INTERNAL;
                            details = `Received RST_STREAM with code ${stream.rstCode}`;
                            break;
                        case http2.constants.NGHTTP2_REFUSED_STREAM:
                            code = constants_1.Status.UNAVAILABLE;
                            details = 'Stream refused by server';
                            break;
                        case http2.constants.NGHTTP2_CANCEL:
                            code = constants_1.Status.CANCELLED;
                            details = 'Call cancelled';
                            break;
                        case http2.constants.NGHTTP2_ENHANCE_YOUR_CALM:
                            code = constants_1.Status.RESOURCE_EXHAUSTED;
                            details = 'Bandwidth exhausted or memory limit exceeded';
                            break;
                        case http2.constants.NGHTTP2_INADEQUATE_SECURITY:
                            code = constants_1.Status.PERMISSION_DENIED;
                            details = 'Protocol not secure enough';
                            break;
                        case http2.constants.NGHTTP2_INTERNAL_ERROR:
                            code = constants_1.Status.INTERNAL;
                            if (this.internalError === null) {
                                /* This error code was previously handled in the default case, and
                                 * there are several instances of it online, so I wanted to
                                 * preserve the original error message so that people find existing
                                 * information in searches, but also include the more recognizable
                                 * "Internal server error" message. */ details = `Received RST_STREAM with code ${stream.rstCode} (Internal server error)`;
                            } else {
                                if (this.internalError.code === 'ECONNRESET' || this.internalError.code === 'ETIMEDOUT') {
                                    code = constants_1.Status.UNAVAILABLE;
                                    details = this.internalError.message;
                                } else {
                                    /* The "Received RST_STREAM with code ..." error is preserved
                                     * here for continuity with errors reported online, but the
                                     * error message at the end will probably be more relevant in
                                     * most cases. */ details = `Received RST_STREAM with code ${stream.rstCode} triggered by internal client error: ${this.internalError.message}`;
                                }
                            }
                            break;
                        default:
                            code = constants_1.Status.INTERNAL;
                            details = `Received RST_STREAM with code ${stream.rstCode}`;
                    }
                    // This is a no-op if trailers were received at all.
                    // This is OK, because status codes emitted here correspond to more
                    // catastrophic issues that prevent us from receiving trailers in the
                    // first place.
                    this.endCall({
                        code,
                        details,
                        metadata: new metadata_1.Metadata()
                    });
                });
            });
            stream.on('error', (err)=>{
                /* We need an error handler here to stop "Uncaught Error" exceptions
                 * from bubbling up. However, errors here should all correspond to
                 * "close" events, where we will handle the error more granularly */ /* Specifically looking for stream errors that were *not* constructed
                 * from a RST_STREAM response here:
                 * https://github.com/nodejs/node/blob/8b8620d580314050175983402dfddf2674e8e22a/lib/internal/http2/core.js#L2267
                 */ if (err.code !== 'ERR_HTTP2_STREAM_ERROR') {
                    this.trace('Node error event: message=' + err.message + ' code=' + err.code + ' errno=' + getSystemErrorName(err.errno) + ' syscall=' + err.syscall);
                    this.internalError = err;
                }
                this.streamEndWatchers.forEach((watcher)=>watcher(false));
            });
            if (this.pendingWrite) {
                if (!this.pendingWriteCallback) {
                    throw new Error('Invalid state in write handling code');
                }
                this.trace('sending data chunk of length ' + this.pendingWrite.length + ' (deferred)');
                try {
                    this.writeMessageToStream(this.pendingWrite, this.pendingWriteCallback);
                } catch (error) {
                    this.endCall({
                        code: constants_1.Status.UNAVAILABLE,
                        details: `Write failed with error ${error.message}`,
                        metadata: new metadata_1.Metadata()
                    });
                }
            }
            this.maybeCloseWrites();
        }
    }
    start(metadata, listener) {
        this.trace('Sending metadata');
        this.listener = listener;
        this.channel._startCallStream(this, metadata);
        this.maybeOutputStatus();
    }
    destroyHttp2Stream() {
        var _a;
        // The http2 stream could already have been destroyed if cancelWithStatus
        // is called in response to an internal http2 error.
        if (this.http2Stream !== null && !this.http2Stream.destroyed) {
            /* If the call has ended with an OK status, communicate that when closing
             * the stream, partly to avoid a situation in which we detect an error
             * RST_STREAM as a result after we have the status */ let code;
            if (((_a = this.finalStatus) === null || _a === void 0 ? void 0 : _a.code) === constants_1.Status.OK) {
                code = http2.constants.NGHTTP2_NO_ERROR;
            } else {
                code = http2.constants.NGHTTP2_CANCEL;
            }
            this.trace('close http2 stream with code ' + code);
            this.http2Stream.close(code);
        }
    }
    cancelWithStatus(status, details) {
        this.trace('cancelWithStatus code: ' + status + ' details: "' + details + '"');
        this.endCall({
            code: status,
            details,
            metadata: new metadata_1.Metadata()
        });
    }
    getDeadline() {
        const deadlineList = [
            this.options.deadline
        ];
        if (this.options.parentCall && this.options.flags & constants_1.Propagate.DEADLINE) {
            deadlineList.push(this.options.parentCall.getDeadline());
        }
        if (this.configDeadline) {
            deadlineList.push(this.configDeadline);
        }
        return getMinDeadline(deadlineList);
    }
    getCredentials() {
        return this.credentials;
    }
    setCredentials(credentials) {
        this.credentials = this.channelCallCredentials.compose(credentials);
    }
    getStatus() {
        return this.finalStatus;
    }
    getPeer() {
        var _a, _b;
        return (_b = (_a = this.subchannel) === null || _a === void 0 ? void 0 : _a.getAddress()) !== null && _b !== void 0 ? _b : this.channel.getTarget();
    }
    getMethod() {
        return this.methodName;
    }
    getHost() {
        return this.options.host;
    }
    setConfigDeadline(configDeadline) {
        this.configDeadline = configDeadline;
    }
    addStatusWatcher(watcher) {
        this.statusWatchers.push(watcher);
    }
    addStreamEndWatcher(watcher) {
        this.streamEndWatchers.push(watcher);
    }
    addFilters(extraFilters) {
        this.filterStack.push(extraFilters);
    }
    getCallNumber() {
        return this.callNumber;
    }
    startRead() {
        /* If the stream has ended with an error, we should not emit any more
         * messages and we should communicate that the stream has ended */ if (this.finalStatus !== null && this.finalStatus.code !== constants_1.Status.OK) {
            this.readsClosed = true;
            this.maybeOutputStatus();
            return;
        }
        this.canPush = true;
        if (this.http2Stream === null) {
            this.pendingRead = true;
        } else {
            if (this.unpushedReadMessages.length > 0) {
                const nextMessage = this.unpushedReadMessages.shift();
                this.push(nextMessage);
                return;
            }
            /* Only resume reading from the http2Stream if we don't have any pending
             * messages to emit */ this.http2Stream.resume();
        }
    }
    maybeCloseWrites() {
        if (this.writesClosed && !this.isWriteFilterPending && this.http2Stream !== null) {
            this.trace('calling end() on HTTP/2 stream');
            this.http2Stream.end();
        }
    }
    sendMessageWithContext(context, message) {
        this.trace('write() called with message of length ' + message.length);
        const writeObj = {
            message,
            flags: context.flags
        };
        const cb = (error)=>{
            var _a, _b;
            let code = constants_1.Status.UNAVAILABLE;
            if (((_a = error) === null || _a === void 0 ? void 0 : _a.code) === 'ERR_STREAM_WRITE_AFTER_END') {
                code = constants_1.Status.INTERNAL;
            }
            if (error) {
                this.cancelWithStatus(code, `Write error: ${error.message}`);
            }
            (_b = context.callback) === null || _b === void 0 ? void 0 : _b.call(context);
        };
        this.isWriteFilterPending = true;
        this.filterStack.sendMessage(Promise.resolve(writeObj)).then((message)=>{
            this.isWriteFilterPending = false;
            if (this.http2Stream === null) {
                this.trace('deferring writing data chunk of length ' + message.message.length);
                this.pendingWrite = message.message;
                this.pendingWriteCallback = cb;
            } else {
                this.trace('sending data chunk of length ' + message.message.length);
                try {
                    this.writeMessageToStream(message.message, cb);
                } catch (error) {
                    this.endCall({
                        code: constants_1.Status.UNAVAILABLE,
                        details: `Write failed with error ${error.message}`,
                        metadata: new metadata_1.Metadata()
                    });
                }
                this.maybeCloseWrites();
            }
        }, this.handleFilterError.bind(this));
    }
    halfClose() {
        this.trace('end() called');
        this.writesClosed = true;
        this.maybeCloseWrites();
    }
}
exports.Http2CallStream = Http2CallStream; //# sourceMappingURL=call-stream.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/tls-helpers.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDefaultRootsData = exports.CIPHER_SUITES = void 0;
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
exports.CIPHER_SUITES = process.env.GRPC_SSL_CIPHER_SUITES;
const DEFAULT_ROOTS_FILE_PATH = process.env.GRPC_DEFAULT_SSL_ROOTS_FILE_PATH;
let defaultRootsData = null;
function getDefaultRootsData() {
    if (DEFAULT_ROOTS_FILE_PATH) {
        if (defaultRootsData === null) {
            defaultRootsData = fs.readFileSync(DEFAULT_ROOTS_FILE_PATH);
        }
        return defaultRootsData;
    }
    return null;
}
exports.getDefaultRootsData = getDefaultRootsData; //# sourceMappingURL=tls-helpers.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channel-credentials.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChannelCredentials = void 0;
const tls_1 = __turbopack_context__.r("[externals]/tls [external] (tls, cjs)");
const call_credentials_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call-credentials.js [app-ssr] (ecmascript)");
const tls_helpers_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/tls-helpers.js [app-ssr] (ecmascript)");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function verifyIsBufferOrNull(obj, friendlyName) {
    if (obj && !(obj instanceof Buffer)) {
        throw new TypeError(`${friendlyName}, if provided, must be a Buffer.`);
    }
}
function bufferOrNullEqual(buf1, buf2) {
    if (buf1 === null && buf2 === null) {
        return true;
    } else {
        return buf1 !== null && buf2 !== null && buf1.equals(buf2);
    }
}
/**
 * A class that contains credentials for communicating over a channel, as well
 * as a set of per-call credentials, which are applied to every method call made
 * over a channel initialized with an instance of this class.
 */ class ChannelCredentials {
    constructor(callCredentials){
        this.callCredentials = callCredentials || call_credentials_1.CallCredentials.createEmpty();
    }
    /**
     * Gets the set of per-call credentials associated with this instance.
     */ _getCallCredentials() {
        return this.callCredentials;
    }
    /**
     * Return a new ChannelCredentials instance with a given set of credentials.
     * The resulting instance can be used to construct a Channel that communicates
     * over TLS.
     * @param rootCerts The root certificate data.
     * @param privateKey The client certificate private key, if available.
     * @param certChain The client certificate key chain, if available.
     * @param verifyOptions Additional options to modify certificate verification
     */ static createSsl(rootCerts, privateKey, certChain, verifyOptions) {
        var _a;
        verifyIsBufferOrNull(rootCerts, 'Root certificate');
        verifyIsBufferOrNull(privateKey, 'Private key');
        verifyIsBufferOrNull(certChain, 'Certificate chain');
        if (privateKey && !certChain) {
            throw new Error('Private key must be given with accompanying certificate chain');
        }
        if (!privateKey && certChain) {
            throw new Error('Certificate chain must be given with accompanying private key');
        }
        const secureContext = tls_1.createSecureContext({
            ca: (_a = rootCerts !== null && rootCerts !== void 0 ? rootCerts : tls_helpers_1.getDefaultRootsData()) !== null && _a !== void 0 ? _a : undefined,
            key: privateKey !== null && privateKey !== void 0 ? privateKey : undefined,
            cert: certChain !== null && certChain !== void 0 ? certChain : undefined,
            ciphers: tls_helpers_1.CIPHER_SUITES
        });
        return new SecureChannelCredentialsImpl(secureContext, verifyOptions !== null && verifyOptions !== void 0 ? verifyOptions : {});
    }
    /**
     * Return a new ChannelCredentials instance with credentials created using
     * the provided secureContext. The resulting instances can be used to
     * construct a Channel that communicates over TLS. gRPC will not override
     * anything in the provided secureContext, so the environment variables
     * GRPC_SSL_CIPHER_SUITES and GRPC_DEFAULT_SSL_ROOTS_FILE_PATH will
     * not be applied.
     * @param secureContext The return value of tls.createSecureContext()
     * @param verifyOptions Additional options to modify certificate verification
     */ static createFromSecureContext(secureContext, verifyOptions) {
        return new SecureChannelCredentialsImpl(secureContext, verifyOptions !== null && verifyOptions !== void 0 ? verifyOptions : {});
    }
    /**
     * Return a new ChannelCredentials instance with no credentials.
     */ static createInsecure() {
        return new InsecureChannelCredentialsImpl();
    }
}
exports.ChannelCredentials = ChannelCredentials;
class InsecureChannelCredentialsImpl extends ChannelCredentials {
    constructor(callCredentials){
        super(callCredentials);
    }
    compose(callCredentials) {
        throw new Error('Cannot compose insecure credentials');
    }
    _getConnectionOptions() {
        return null;
    }
    _isSecure() {
        return false;
    }
    _equals(other) {
        return other instanceof InsecureChannelCredentialsImpl;
    }
}
class SecureChannelCredentialsImpl extends ChannelCredentials {
    constructor(secureContext, verifyOptions){
        super();
        this.secureContext = secureContext;
        this.verifyOptions = verifyOptions;
        this.connectionOptions = {
            secureContext
        };
        // Node asserts that this option is a function, so we cannot pass undefined
        if (verifyOptions === null || verifyOptions === void 0 ? void 0 : verifyOptions.checkServerIdentity) {
            this.connectionOptions.checkServerIdentity = verifyOptions.checkServerIdentity;
        }
    }
    compose(callCredentials) {
        const combinedCallCredentials = this.callCredentials.compose(callCredentials);
        return new ComposedChannelCredentialsImpl(this, combinedCallCredentials);
    }
    _getConnectionOptions() {
        // Copy to prevent callers from mutating this.connectionOptions
        return Object.assign({}, this.connectionOptions);
    }
    _isSecure() {
        return true;
    }
    _equals(other) {
        if (this === other) {
            return true;
        }
        if (other instanceof SecureChannelCredentialsImpl) {
            return this.secureContext === other.secureContext && this.verifyOptions.checkServerIdentity === other.verifyOptions.checkServerIdentity;
        } else {
            return false;
        }
    }
}
class ComposedChannelCredentialsImpl extends ChannelCredentials {
    constructor(channelCredentials, callCreds){
        super(callCreds);
        this.channelCredentials = channelCredentials;
    }
    compose(callCredentials) {
        const combinedCallCredentials = this.callCredentials.compose(callCredentials);
        return new ComposedChannelCredentialsImpl(this.channelCredentials, combinedCallCredentials);
    }
    _getConnectionOptions() {
        return this.channelCredentials._getConnectionOptions();
    }
    _isSecure() {
        return true;
    }
    _equals(other) {
        if (this === other) {
            return true;
        }
        if (other instanceof ComposedChannelCredentialsImpl) {
            return this.channelCredentials._equals(other.channelCredentials) && this.callCredentials._equals(other.callCredentials);
        } else {
            return false;
        }
    }
} //# sourceMappingURL=channel-credentials.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateLoadBalancingConfig = exports.getFirstUsableConfig = exports.isLoadBalancerNameRegistered = exports.createLoadBalancer = exports.registerDefaultLoadBalancerType = exports.registerLoadBalancerType = exports.createChildChannelControlHelper = void 0;
/**
 * Create a child ChannelControlHelper that overrides some methods of the
 * parent while letting others pass through to the parent unmodified. This
 * allows other code to create these children without needing to know about
 * all of the methods to be passed through.
 * @param parent
 * @param overrides
 */ function createChildChannelControlHelper(parent, overrides) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return {
        createSubchannel: (_b = (_a = overrides.createSubchannel) === null || _a === void 0 ? void 0 : _a.bind(overrides)) !== null && _b !== void 0 ? _b : parent.createSubchannel.bind(parent),
        updateState: (_d = (_c = overrides.updateState) === null || _c === void 0 ? void 0 : _c.bind(overrides)) !== null && _d !== void 0 ? _d : parent.updateState.bind(parent),
        requestReresolution: (_f = (_e = overrides.requestReresolution) === null || _e === void 0 ? void 0 : _e.bind(overrides)) !== null && _f !== void 0 ? _f : parent.requestReresolution.bind(parent),
        addChannelzChild: (_h = (_g = overrides.addChannelzChild) === null || _g === void 0 ? void 0 : _g.bind(overrides)) !== null && _h !== void 0 ? _h : parent.addChannelzChild.bind(parent),
        removeChannelzChild: (_k = (_j = overrides.removeChannelzChild) === null || _j === void 0 ? void 0 : _j.bind(overrides)) !== null && _k !== void 0 ? _k : parent.removeChannelzChild.bind(parent)
    };
}
exports.createChildChannelControlHelper = createChildChannelControlHelper;
const registeredLoadBalancerTypes = {};
let defaultLoadBalancerType = null;
function registerLoadBalancerType(typeName, loadBalancerType, loadBalancingConfigType) {
    registeredLoadBalancerTypes[typeName] = {
        LoadBalancer: loadBalancerType,
        LoadBalancingConfig: loadBalancingConfigType
    };
}
exports.registerLoadBalancerType = registerLoadBalancerType;
function registerDefaultLoadBalancerType(typeName) {
    defaultLoadBalancerType = typeName;
}
exports.registerDefaultLoadBalancerType = registerDefaultLoadBalancerType;
function createLoadBalancer(config, channelControlHelper) {
    const typeName = config.getLoadBalancerName();
    if (typeName in registeredLoadBalancerTypes) {
        return new registeredLoadBalancerTypes[typeName].LoadBalancer(channelControlHelper);
    } else {
        return null;
    }
}
exports.createLoadBalancer = createLoadBalancer;
function isLoadBalancerNameRegistered(typeName) {
    return typeName in registeredLoadBalancerTypes;
}
exports.isLoadBalancerNameRegistered = isLoadBalancerNameRegistered;
function getFirstUsableConfig(configs, fallbackTodefault = false) {
    for (const config of configs){
        if (config.getLoadBalancerName() in registeredLoadBalancerTypes) {
            return config;
        }
    }
    if (fallbackTodefault) {
        if (defaultLoadBalancerType) {
            return new registeredLoadBalancerTypes[defaultLoadBalancerType].LoadBalancingConfig();
        } else {
            return null;
        }
    } else {
        return null;
    }
}
exports.getFirstUsableConfig = getFirstUsableConfig;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateLoadBalancingConfig(obj) {
    if (!(obj !== null && typeof obj === 'object')) {
        throw new Error('Load balancing config must be an object');
    }
    const keys = Object.keys(obj);
    if (keys.length !== 1) {
        throw new Error('Provided load balancing config has multiple conflicting entries');
    }
    const typeName = keys[0];
    if (typeName in registeredLoadBalancerTypes) {
        return registeredLoadBalancerTypes[typeName].LoadBalancingConfig.createFromJson(obj[typeName]);
    } else {
        throw new Error(`Unrecognized load balancing config name ${typeName}`);
    }
}
exports.validateLoadBalancingConfig = validateLoadBalancingConfig; //# sourceMappingURL=load-balancer.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/service-config.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extractAndSelectServiceConfig = exports.validateServiceConfig = void 0;
/* This file implements gRFC A2 and the service config spec:
 * https://github.com/grpc/proposal/blob/master/A2-service-configs-in-dns.md
 * https://github.com/grpc/grpc/blob/master/doc/service_config.md. Each
 * function here takes an object with unknown structure and returns its
 * specific object type if the input has the right structure, and throws an
 * error otherwise. */ /* The any type is purposely used here. All functions validate their input at
 * runtime */ /* eslint-disable @typescript-eslint/no-explicit-any */ const os = __turbopack_context__.r("[externals]/os [external] (os, cjs)");
const load_balancer_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer.js [app-ssr] (ecmascript)");
/**
 * Recognizes a number with up to 9 digits after the decimal point, followed by
 * an "s", representing a number of seconds.
 */ const TIMEOUT_REGEX = /^\d+(\.\d{1,9})?s$/;
/**
 * Client language name used for determining whether this client matches a
 * `ServiceConfigCanaryConfig`'s `clientLanguage` list.
 */ const CLIENT_LANGUAGE_STRING = 'node';
function validateName(obj) {
    if (!('service' in obj) || typeof obj.service !== 'string') {
        throw new Error('Invalid method config name: invalid service');
    }
    const result = {
        service: obj.service
    };
    if ('method' in obj) {
        if (typeof obj.method === 'string') {
            result.method = obj.method;
        } else {
            throw new Error('Invalid method config name: invalid method');
        }
    }
    return result;
}
function validateMethodConfig(obj) {
    var _a;
    const result = {
        name: []
    };
    if (!('name' in obj) || !Array.isArray(obj.name)) {
        throw new Error('Invalid method config: invalid name array');
    }
    for (const name of obj.name){
        result.name.push(validateName(name));
    }
    if ('waitForReady' in obj) {
        if (typeof obj.waitForReady !== 'boolean') {
            throw new Error('Invalid method config: invalid waitForReady');
        }
        result.waitForReady = obj.waitForReady;
    }
    if ('timeout' in obj) {
        if (typeof obj.timeout === 'object') {
            if (!('seconds' in obj.timeout) || !(typeof obj.timeout.seconds === 'number')) {
                throw new Error('Invalid method config: invalid timeout.seconds');
            }
            if (!('nanos' in obj.timeout) || !(typeof obj.timeout.nanos === 'number')) {
                throw new Error('Invalid method config: invalid timeout.nanos');
            }
            result.timeout = obj.timeout;
        } else if (typeof obj.timeout === 'string' && TIMEOUT_REGEX.test(obj.timeout)) {
            const timeoutParts = obj.timeout.substring(0, obj.timeout.length - 1).split('.');
            result.timeout = {
                seconds: timeoutParts[0] | 0,
                nanos: ((_a = timeoutParts[1]) !== null && _a !== void 0 ? _a : 0) | 0
            };
        } else {
            throw new Error('Invalid method config: invalid timeout');
        }
    }
    if ('maxRequestBytes' in obj) {
        if (typeof obj.maxRequestBytes !== 'number') {
            throw new Error('Invalid method config: invalid maxRequestBytes');
        }
        result.maxRequestBytes = obj.maxRequestBytes;
    }
    if ('maxResponseBytes' in obj) {
        if (typeof obj.maxResponseBytes !== 'number') {
            throw new Error('Invalid method config: invalid maxRequestBytes');
        }
        result.maxResponseBytes = obj.maxResponseBytes;
    }
    return result;
}
function validateServiceConfig(obj) {
    const result = {
        loadBalancingConfig: [],
        methodConfig: []
    };
    if ('loadBalancingPolicy' in obj) {
        if (typeof obj.loadBalancingPolicy === 'string') {
            result.loadBalancingPolicy = obj.loadBalancingPolicy;
        } else {
            throw new Error('Invalid service config: invalid loadBalancingPolicy');
        }
    }
    if ('loadBalancingConfig' in obj) {
        if (Array.isArray(obj.loadBalancingConfig)) {
            for (const config of obj.loadBalancingConfig){
                result.loadBalancingConfig.push(load_balancer_1.validateLoadBalancingConfig(config));
            }
        } else {
            throw new Error('Invalid service config: invalid loadBalancingConfig');
        }
    }
    if ('methodConfig' in obj) {
        if (Array.isArray(obj.methodConfig)) {
            for (const methodConfig of obj.methodConfig){
                result.methodConfig.push(validateMethodConfig(methodConfig));
            }
        }
    }
    // Validate method name uniqueness
    const seenMethodNames = [];
    for (const methodConfig of result.methodConfig){
        for (const name of methodConfig.name){
            for (const seenName of seenMethodNames){
                if (name.service === seenName.service && name.method === seenName.method) {
                    throw new Error(`Invalid service config: duplicate name ${name.service}/${name.method}`);
                }
            }
            seenMethodNames.push(name);
        }
    }
    return result;
}
exports.validateServiceConfig = validateServiceConfig;
function validateCanaryConfig(obj) {
    if (!('serviceConfig' in obj)) {
        throw new Error('Invalid service config choice: missing service config');
    }
    const result = {
        serviceConfig: validateServiceConfig(obj.serviceConfig)
    };
    if ('clientLanguage' in obj) {
        if (Array.isArray(obj.clientLanguage)) {
            result.clientLanguage = [];
            for (const lang of obj.clientLanguage){
                if (typeof lang === 'string') {
                    result.clientLanguage.push(lang);
                } else {
                    throw new Error('Invalid service config choice: invalid clientLanguage');
                }
            }
        } else {
            throw new Error('Invalid service config choice: invalid clientLanguage');
        }
    }
    if ('clientHostname' in obj) {
        if (Array.isArray(obj.clientHostname)) {
            result.clientHostname = [];
            for (const lang of obj.clientHostname){
                if (typeof lang === 'string') {
                    result.clientHostname.push(lang);
                } else {
                    throw new Error('Invalid service config choice: invalid clientHostname');
                }
            }
        } else {
            throw new Error('Invalid service config choice: invalid clientHostname');
        }
    }
    if ('percentage' in obj) {
        if (typeof obj.percentage === 'number' && 0 <= obj.percentage && obj.percentage <= 100) {
            result.percentage = obj.percentage;
        } else {
            throw new Error('Invalid service config choice: invalid percentage');
        }
    }
    // Validate that no unexpected fields are present
    const allowedFields = [
        'clientLanguage',
        'percentage',
        'clientHostname',
        'serviceConfig'
    ];
    for(const field in obj){
        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid service config choice: unexpected field ${field}`);
        }
    }
    return result;
}
function validateAndSelectCanaryConfig(obj, percentage) {
    if (!Array.isArray(obj)) {
        throw new Error('Invalid service config list');
    }
    for (const config of obj){
        const validatedConfig = validateCanaryConfig(config);
        /* For each field, we check if it is present, then only discard the
         * config if the field value does not match the current client */ if (typeof validatedConfig.percentage === 'number' && percentage > validatedConfig.percentage) {
            continue;
        }
        if (Array.isArray(validatedConfig.clientHostname)) {
            let hostnameMatched = false;
            for (const hostname of validatedConfig.clientHostname){
                if (hostname === os.hostname()) {
                    hostnameMatched = true;
                }
            }
            if (!hostnameMatched) {
                continue;
            }
        }
        if (Array.isArray(validatedConfig.clientLanguage)) {
            let languageMatched = false;
            for (const language of validatedConfig.clientLanguage){
                if (language === CLIENT_LANGUAGE_STRING) {
                    languageMatched = true;
                }
            }
            if (!languageMatched) {
                continue;
            }
        }
        return validatedConfig.serviceConfig;
    }
    throw new Error('No matching service config found');
}
/**
 * Find the "grpc_config" record among the TXT records, parse its value as JSON, validate its contents,
 * and select a service config with selection fields that all match this client. Most of these steps
 * can fail with an error; the caller must handle any errors thrown this way.
 * @param txtRecord The TXT record array that is output from a successful call to dns.resolveTxt
 * @param percentage A number chosen from the range [0, 100) that is used to select which config to use
 * @return The service configuration to use, given the percentage value, or null if the service config
 *     data has a valid format but none of the options match the current client.
 */ function extractAndSelectServiceConfig(txtRecord, percentage) {
    for (const record of txtRecord){
        if (record.length > 0 && record[0].startsWith('grpc_config=')) {
            /* Treat the list of strings in this record as a single string and remove
             * "grpc_config=" from the beginning. The rest should be a JSON string */ const recordString = record.join('').substring('grpc_config='.length);
            const recordJson = JSON.parse(recordString);
            return validateAndSelectCanaryConfig(recordJson, percentage);
        }
    }
    return null;
}
exports.extractAndSelectServiceConfig = extractAndSelectServiceConfig; //# sourceMappingURL=service-config.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2021 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConnectivityState = void 0;
var ConnectivityState;
(function(ConnectivityState) {
    ConnectivityState[ConnectivityState["IDLE"] = 0] = "IDLE";
    ConnectivityState[ConnectivityState["CONNECTING"] = 1] = "CONNECTING";
    ConnectivityState[ConnectivityState["READY"] = 2] = "READY";
    ConnectivityState[ConnectivityState["TRANSIENT_FAILURE"] = 3] = "TRANSIENT_FAILURE";
    ConnectivityState[ConnectivityState["SHUTDOWN"] = 4] = "SHUTDOWN";
})(ConnectivityState = exports.ConnectivityState || (exports.ConnectivityState = {})); //# sourceMappingURL=connectivity-state.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2020 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.uriToString = exports.splitHostPort = exports.parseUri = void 0;
/*
 * The groups correspond to URI parts as follows:
 * 1. scheme
 * 2. authority
 * 3. path
 */ const URI_REGEX = /^(?:([A-Za-z0-9+.-]+):)?(?:\/\/([^/]*)\/)?(.+)$/;
function parseUri(uriString) {
    const parsedUri = URI_REGEX.exec(uriString);
    if (parsedUri === null) {
        return null;
    }
    return {
        scheme: parsedUri[1],
        authority: parsedUri[2],
        path: parsedUri[3]
    };
}
exports.parseUri = parseUri;
const NUMBER_REGEX = /^\d+$/;
function splitHostPort(path) {
    if (path.startsWith('[')) {
        const hostEnd = path.indexOf(']');
        if (hostEnd === -1) {
            return null;
        }
        const host = path.substring(1, hostEnd);
        /* Only an IPv6 address should be in bracketed notation, and an IPv6
         * address should have at least one colon */ if (host.indexOf(':') === -1) {
            return null;
        }
        if (path.length > hostEnd + 1) {
            if (path[hostEnd + 1] === ':') {
                const portString = path.substring(hostEnd + 2);
                if (NUMBER_REGEX.test(portString)) {
                    return {
                        host: host,
                        port: +portString
                    };
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return {
                host
            };
        }
    } else {
        const splitPath = path.split(':');
        /* Exactly one colon means that this is host:port. Zero colons means that
         * there is no port. And multiple colons means that this is a bare IPv6
         * address with no port */ if (splitPath.length === 2) {
            if (NUMBER_REGEX.test(splitPath[1])) {
                return {
                    host: splitPath[0],
                    port: +splitPath[1]
                };
            } else {
                return null;
            }
        } else {
            return {
                host: path
            };
        }
    }
}
exports.splitHostPort = splitHostPort;
function uriToString(uri) {
    let result = '';
    if (uri.scheme !== undefined) {
        result += uri.scheme + ':';
    }
    if (uri.authority !== undefined) {
        result += '//' + uri.authority + '/';
    }
    result += uri.path;
    return result;
}
exports.uriToString = uriToString; //# sourceMappingURL=uri-parser.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapUriDefaultScheme = exports.getDefaultAuthority = exports.createResolver = exports.registerDefaultScheme = exports.registerResolver = void 0;
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
const registeredResolvers = {};
let defaultScheme = null;
/**
 * Register a resolver class to handle target names prefixed with the `prefix`
 * string. This prefix should correspond to a URI scheme name listed in the
 * [gRPC Name Resolution document](https://github.com/grpc/grpc/blob/master/doc/naming.md)
 * @param prefix
 * @param resolverClass
 */ function registerResolver(scheme, resolverClass) {
    registeredResolvers[scheme] = resolverClass;
}
exports.registerResolver = registerResolver;
/**
 * Register a default resolver to handle target names that do not start with
 * any registered prefix.
 * @param resolverClass
 */ function registerDefaultScheme(scheme) {
    defaultScheme = scheme;
}
exports.registerDefaultScheme = registerDefaultScheme;
/**
 * Create a name resolver for the specified target, if possible. Throws an
 * error if no such name resolver can be created.
 * @param target
 * @param listener
 */ function createResolver(target, listener, options) {
    if (target.scheme !== undefined && target.scheme in registeredResolvers) {
        return new registeredResolvers[target.scheme](target, listener, options);
    } else {
        throw new Error(`No resolver could be created for target ${uri_parser_1.uriToString(target)}`);
    }
}
exports.createResolver = createResolver;
/**
 * Get the default authority for the specified target, if possible. Throws an
 * error if no registered name resolver can parse that target string.
 * @param target
 */ function getDefaultAuthority(target) {
    if (target.scheme !== undefined && target.scheme in registeredResolvers) {
        return registeredResolvers[target.scheme].getDefaultAuthority(target);
    } else {
        throw new Error(`Invalid target ${uri_parser_1.uriToString(target)}`);
    }
}
exports.getDefaultAuthority = getDefaultAuthority;
function mapUriDefaultScheme(target) {
    if (target.scheme === undefined || !(target.scheme in registeredResolvers)) {
        if (defaultScheme !== null) {
            return {
                scheme: defaultScheme,
                authority: undefined,
                path: uri_parser_1.uriToString(target)
            };
        } else {
            return null;
        }
    }
    return target;
}
exports.mapUriDefaultScheme = mapUriDefaultScheme; //# sourceMappingURL=resolver.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/picker.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueuePicker = exports.UnavailablePicker = exports.PickResultType = void 0;
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
var PickResultType;
(function(PickResultType) {
    PickResultType[PickResultType["COMPLETE"] = 0] = "COMPLETE";
    PickResultType[PickResultType["QUEUE"] = 1] = "QUEUE";
    PickResultType[PickResultType["TRANSIENT_FAILURE"] = 2] = "TRANSIENT_FAILURE";
    PickResultType[PickResultType["DROP"] = 3] = "DROP";
})(PickResultType = exports.PickResultType || (exports.PickResultType = {}));
/**
 * A standard picker representing a load balancer in the TRANSIENT_FAILURE
 * state. Always responds to every pick request with an UNAVAILABLE status.
 */ class UnavailablePicker {
    constructor(status){
        if (status !== undefined) {
            this.status = status;
        } else {
            this.status = {
                code: constants_1.Status.UNAVAILABLE,
                details: 'No connection established',
                metadata: new metadata_1.Metadata()
            };
        }
    }
    pick(pickArgs) {
        return {
            pickResultType: PickResultType.TRANSIENT_FAILURE,
            subchannel: null,
            status: this.status,
            extraFilterFactories: [],
            onCallStarted: null
        };
    }
}
exports.UnavailablePicker = UnavailablePicker;
/**
 * A standard picker representing a load balancer in the IDLE or CONNECTING
 * state. Always responds to every pick request with a QUEUE pick result
 * indicating that the pick should be tried again with the next `Picker`. Also
 * reports back to the load balancer that a connection should be established
 * once any pick is attempted.
 */ class QueuePicker {
    // Constructed with a load balancer. Calls exitIdle on it the first time pick is called
    constructor(loadBalancer){
        this.loadBalancer = loadBalancer;
        this.calledExitIdle = false;
    }
    pick(pickArgs) {
        if (!this.calledExitIdle) {
            process.nextTick(()=>{
                this.loadBalancer.exitIdle();
            });
            this.calledExitIdle = true;
        }
        return {
            pickResultType: PickResultType.QUEUE,
            subchannel: null,
            status: null,
            extraFilterFactories: [],
            onCallStarted: null
        };
    }
}
exports.QueuePicker = QueuePicker; //# sourceMappingURL=picker.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/backoff-timeout.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BackoffTimeout = void 0;
const INITIAL_BACKOFF_MS = 1000;
const BACKOFF_MULTIPLIER = 1.6;
const MAX_BACKOFF_MS = 120000;
const BACKOFF_JITTER = 0.2;
/**
 * Get a number uniformly at random in the range [min, max)
 * @param min
 * @param max
 */ function uniformRandom(min, max) {
    return Math.random() * (max - min) + min;
}
class BackoffTimeout {
    constructor(callback, options){
        this.callback = callback;
        /**
         * The delay time at the start, and after each reset.
         */ this.initialDelay = INITIAL_BACKOFF_MS;
        /**
         * The exponential backoff multiplier.
         */ this.multiplier = BACKOFF_MULTIPLIER;
        /**
         * The maximum delay time
         */ this.maxDelay = MAX_BACKOFF_MS;
        /**
         * The maximum fraction by which the delay time can randomly vary after
         * applying the multiplier.
         */ this.jitter = BACKOFF_JITTER;
        /**
         * Indicates whether the timer is currently running.
         */ this.running = false;
        /**
         * Indicates whether the timer should keep the Node process running if no
         * other async operation is doing so.
         */ this.hasRef = true;
        /**
         * The time that the currently running timer was started. Only valid if
         * running is true.
         */ this.startTime = new Date();
        if (options) {
            if (options.initialDelay) {
                this.initialDelay = options.initialDelay;
            }
            if (options.multiplier) {
                this.multiplier = options.multiplier;
            }
            if (options.jitter) {
                this.jitter = options.jitter;
            }
            if (options.maxDelay) {
                this.maxDelay = options.maxDelay;
            }
        }
        this.nextDelay = this.initialDelay;
        this.timerId = setTimeout(()=>{}, 0);
        clearTimeout(this.timerId);
    }
    runTimer(delay) {
        var _a, _b;
        clearTimeout(this.timerId);
        this.timerId = setTimeout(()=>{
            this.callback();
            this.running = false;
        }, delay);
        if (!this.hasRef) {
            (_b = (_a = this.timerId).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    }
    /**
     * Call the callback after the current amount of delay time
     */ runOnce() {
        this.running = true;
        this.startTime = new Date();
        this.runTimer(this.nextDelay);
        const nextBackoff = Math.min(this.nextDelay * this.multiplier, this.maxDelay);
        const jitterMagnitude = nextBackoff * this.jitter;
        this.nextDelay = nextBackoff + uniformRandom(-jitterMagnitude, jitterMagnitude);
    }
    /**
     * Stop the timer. The callback will not be called until `runOnce` is called
     * again.
     */ stop() {
        clearTimeout(this.timerId);
        this.running = false;
    }
    /**
     * Reset the delay time to its initial value. If the timer is still running,
     * retroactively apply that reset to the current timer.
     */ reset() {
        this.nextDelay = this.initialDelay;
        if (this.running) {
            const now = new Date();
            const newEndTime = this.startTime;
            newEndTime.setMilliseconds(newEndTime.getMilliseconds() + this.nextDelay);
            clearTimeout(this.timerId);
            if (now < newEndTime) {
                this.runTimer(newEndTime.getTime() - now.getTime());
            } else {
                this.running = false;
            }
        }
    }
    /**
     * Check whether the timer is currently running.
     */ isRunning() {
        return this.running;
    }
    /**
     * Set that while the timer is running, it should keep the Node process
     * running.
     */ ref() {
        var _a, _b;
        this.hasRef = true;
        (_b = (_a = this.timerId).ref) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    /**
     * Set that while the timer is running, it should not keep the Node process
     * running.
     */ unref() {
        var _a, _b;
        this.hasRef = false;
        (_b = (_a = this.timerId).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
}
exports.BackoffTimeout = BackoffTimeout; //# sourceMappingURL=backoff-timeout.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-child-handler.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2020 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChildLoadBalancerHandler = void 0;
const load_balancer_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer.js [app-ssr] (ecmascript)");
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const TYPE_NAME = 'child_load_balancer_helper';
class ChildLoadBalancerHandler {
    constructor(channelControlHelper){
        this.channelControlHelper = channelControlHelper;
        this.currentChild = null;
        this.pendingChild = null;
        this.ChildPolicyHelper = class {
            constructor(parent){
                this.parent = parent;
                this.child = null;
            }
            createSubchannel(subchannelAddress, subchannelArgs) {
                return this.parent.channelControlHelper.createSubchannel(subchannelAddress, subchannelArgs);
            }
            updateState(connectivityState, picker) {
                var _a;
                if (this.calledByPendingChild()) {
                    if (connectivityState === connectivity_state_1.ConnectivityState.CONNECTING) {
                        return;
                    }
                    (_a = this.parent.currentChild) === null || _a === void 0 ? void 0 : _a.destroy();
                    this.parent.currentChild = this.parent.pendingChild;
                    this.parent.pendingChild = null;
                } else if (!this.calledByCurrentChild()) {
                    return;
                }
                this.parent.channelControlHelper.updateState(connectivityState, picker);
            }
            requestReresolution() {
                var _a;
                const latestChild = (_a = this.parent.pendingChild) !== null && _a !== void 0 ? _a : this.parent.currentChild;
                if (this.child === latestChild) {
                    this.parent.channelControlHelper.requestReresolution();
                }
            }
            setChild(newChild) {
                this.child = newChild;
            }
            addChannelzChild(child) {
                this.parent.channelControlHelper.addChannelzChild(child);
            }
            removeChannelzChild(child) {
                this.parent.channelControlHelper.removeChannelzChild(child);
            }
            calledByPendingChild() {
                return this.child === this.parent.pendingChild;
            }
            calledByCurrentChild() {
                return this.child === this.parent.currentChild;
            }
        };
    }
    /**
     * Prerequisites: lbConfig !== null and lbConfig.name is registered
     * @param addressList
     * @param lbConfig
     * @param attributes
     */ updateAddressList(addressList, lbConfig, attributes) {
        let childToUpdate;
        if (this.currentChild === null || this.currentChild.getTypeName() !== lbConfig.getLoadBalancerName()) {
            const newHelper = new this.ChildPolicyHelper(this);
            const newChild = load_balancer_1.createLoadBalancer(lbConfig, newHelper);
            newHelper.setChild(newChild);
            if (this.currentChild === null) {
                this.currentChild = newChild;
                childToUpdate = this.currentChild;
            } else {
                if (this.pendingChild) {
                    this.pendingChild.destroy();
                }
                this.pendingChild = newChild;
                childToUpdate = this.pendingChild;
            }
        } else {
            if (this.pendingChild === null) {
                childToUpdate = this.currentChild;
            } else {
                childToUpdate = this.pendingChild;
            }
        }
        childToUpdate.updateAddressList(addressList, lbConfig, attributes);
    }
    exitIdle() {
        if (this.currentChild) {
            this.currentChild.exitIdle();
            if (this.pendingChild) {
                this.pendingChild.exitIdle();
            }
        }
    }
    resetBackoff() {
        if (this.currentChild) {
            this.currentChild.resetBackoff();
            if (this.pendingChild) {
                this.pendingChild.resetBackoff();
            }
        }
    }
    destroy() {
        if (this.currentChild) {
            this.currentChild.destroy();
            this.currentChild = null;
        }
        if (this.pendingChild) {
            this.pendingChild.destroy();
            this.pendingChild = null;
        }
    }
    getTypeName() {
        return TYPE_NAME;
    }
}
exports.ChildLoadBalancerHandler = ChildLoadBalancerHandler; //# sourceMappingURL=load-balancer-child-handler.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolving-load-balancer.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResolvingLoadBalancer = void 0;
const load_balancer_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer.js [app-ssr] (ecmascript)");
const service_config_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/service-config.js [app-ssr] (ecmascript)");
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
const picker_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/picker.js [app-ssr] (ecmascript)");
const backoff_timeout_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/backoff-timeout.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const constants_2 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
const load_balancer_child_handler_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-child-handler.js [app-ssr] (ecmascript)");
const TRACER_NAME = 'resolving_load_balancer';
function trace(text) {
    logging.trace(constants_2.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const DEFAULT_LOAD_BALANCER_NAME = 'pick_first';
function getDefaultConfigSelector(serviceConfig) {
    return function defaultConfigSelector(methodName, metadata) {
        var _a, _b;
        const splitName = methodName.split('/').filter((x)=>x.length > 0);
        const service = (_a = splitName[0]) !== null && _a !== void 0 ? _a : '';
        const method = (_b = splitName[1]) !== null && _b !== void 0 ? _b : '';
        if (serviceConfig && serviceConfig.methodConfig) {
            for (const methodConfig of serviceConfig.methodConfig){
                for (const name of methodConfig.name){
                    if (name.service === service && (name.method === undefined || name.method === method)) {
                        return {
                            methodConfig: methodConfig,
                            pickInformation: {},
                            status: constants_1.Status.OK,
                            dynamicFilterFactories: []
                        };
                    }
                }
            }
        }
        return {
            methodConfig: {
                name: []
            },
            pickInformation: {},
            status: constants_1.Status.OK,
            dynamicFilterFactories: []
        };
    };
}
class ResolvingLoadBalancer {
    /**
     * Wrapper class that behaves like a `LoadBalancer` and also handles name
     * resolution internally.
     * @param target The address of the backend to connect to.
     * @param channelControlHelper `ChannelControlHelper` instance provided by
     *     this load balancer's owner.
     * @param defaultServiceConfig The default service configuration to be used
     *     if none is provided by the name resolver. A `null` value indicates
     *     that the default behavior should be the default unconfigured behavior.
     *     In practice, that means using the "pick first" load balancer
     *     implmentation
     */ constructor(target, channelControlHelper, channelOptions, onSuccessfulResolution, onFailedResolution){
        this.target = target;
        this.channelControlHelper = channelControlHelper;
        this.channelOptions = channelOptions;
        this.onSuccessfulResolution = onSuccessfulResolution;
        this.onFailedResolution = onFailedResolution;
        this.latestChildState = connectivity_state_1.ConnectivityState.IDLE;
        this.latestChildPicker = new picker_1.QueuePicker(this);
        /**
         * This resolving load balancer's current connectivity state.
         */ this.currentState = connectivity_state_1.ConnectivityState.IDLE;
        /**
         * The service config object from the last successful resolution, if
         * available. A value of null indicates that we have not yet received a valid
         * service config from the resolver.
         */ this.previousServiceConfig = null;
        /**
         * Indicates whether we should attempt to resolve again after the backoff
         * timer runs out.
         */ this.continueResolving = false;
        if (channelOptions['grpc.service_config']) {
            this.defaultServiceConfig = service_config_1.validateServiceConfig(JSON.parse(channelOptions['grpc.service_config']));
        } else {
            this.defaultServiceConfig = {
                loadBalancingConfig: [],
                methodConfig: []
            };
        }
        this.updateState(connectivity_state_1.ConnectivityState.IDLE, new picker_1.QueuePicker(this));
        this.childLoadBalancer = new load_balancer_child_handler_1.ChildLoadBalancerHandler({
            createSubchannel: channelControlHelper.createSubchannel.bind(channelControlHelper),
            requestReresolution: ()=>{
                /* If the backoffTimeout is running, we're still backing off from
                 * making resolve requests, so we shouldn't make another one here.
                 * In that case, the backoff timer callback will call
                 * updateResolution */ if (this.backoffTimeout.isRunning()) {
                    this.continueResolving = true;
                } else {
                    this.updateResolution();
                }
            },
            updateState: (newState, picker)=>{
                this.latestChildState = newState;
                this.latestChildPicker = picker;
                this.updateState(newState, picker);
            },
            addChannelzChild: channelControlHelper.addChannelzChild.bind(channelControlHelper),
            removeChannelzChild: channelControlHelper.removeChannelzChild.bind(channelControlHelper)
        });
        this.innerResolver = resolver_1.createResolver(target, {
            onSuccessfulResolution: (addressList, serviceConfig, serviceConfigError, configSelector, attributes)=>{
                var _a;
                let workingServiceConfig = null;
                /* This first group of conditionals implements the algorithm described
                 * in https://github.com/grpc/proposal/blob/master/A21-service-config-error-handling.md
                 * in the section called "Behavior on receiving a new gRPC Config".
                 */ if (serviceConfig === null) {
                    // Step 4 and 5
                    if (serviceConfigError === null) {
                        // Step 5
                        this.previousServiceConfig = null;
                        workingServiceConfig = this.defaultServiceConfig;
                    } else {
                        // Step 4
                        if (this.previousServiceConfig === null) {
                            // Step 4.ii
                            this.handleResolutionFailure(serviceConfigError);
                        } else {
                            // Step 4.i
                            workingServiceConfig = this.previousServiceConfig;
                        }
                    }
                } else {
                    // Step 3
                    workingServiceConfig = serviceConfig;
                    this.previousServiceConfig = serviceConfig;
                }
                const workingConfigList = (_a = workingServiceConfig === null || workingServiceConfig === void 0 ? void 0 : workingServiceConfig.loadBalancingConfig) !== null && _a !== void 0 ? _a : [];
                const loadBalancingConfig = load_balancer_1.getFirstUsableConfig(workingConfigList, true);
                if (loadBalancingConfig === null) {
                    // There were load balancing configs but none are supported. This counts as a resolution failure
                    this.handleResolutionFailure({
                        code: constants_1.Status.UNAVAILABLE,
                        details: 'All load balancer options in service config are not compatible',
                        metadata: new metadata_1.Metadata()
                    });
                    return;
                }
                this.childLoadBalancer.updateAddressList(addressList, loadBalancingConfig, attributes);
                const finalServiceConfig = workingServiceConfig !== null && workingServiceConfig !== void 0 ? workingServiceConfig : this.defaultServiceConfig;
                this.onSuccessfulResolution(configSelector !== null && configSelector !== void 0 ? configSelector : getDefaultConfigSelector(finalServiceConfig));
            },
            onError: (error)=>{
                this.handleResolutionFailure(error);
            }
        }, channelOptions);
        const backoffOptions = {
            initialDelay: channelOptions['grpc.initial_reconnect_backoff_ms'],
            maxDelay: channelOptions['grpc.max_reconnect_backoff_ms']
        };
        this.backoffTimeout = new backoff_timeout_1.BackoffTimeout(()=>{
            if (this.continueResolving) {
                this.updateResolution();
                this.continueResolving = false;
            } else {
                this.updateState(this.latestChildState, this.latestChildPicker);
            }
        }, backoffOptions);
        this.backoffTimeout.unref();
    }
    updateResolution() {
        this.innerResolver.updateResolution();
        if (this.currentState === connectivity_state_1.ConnectivityState.IDLE) {
            this.updateState(connectivity_state_1.ConnectivityState.CONNECTING, new picker_1.QueuePicker(this));
        }
        this.backoffTimeout.runOnce();
    }
    updateState(connectivityState, picker) {
        trace(uri_parser_1.uriToString(this.target) + ' ' + connectivity_state_1.ConnectivityState[this.currentState] + ' -> ' + connectivity_state_1.ConnectivityState[connectivityState]);
        // Ensure that this.exitIdle() is called by the picker
        if (connectivityState === connectivity_state_1.ConnectivityState.IDLE) {
            picker = new picker_1.QueuePicker(this);
        }
        this.currentState = connectivityState;
        this.channelControlHelper.updateState(connectivityState, picker);
    }
    handleResolutionFailure(error) {
        if (this.latestChildState === connectivity_state_1.ConnectivityState.IDLE) {
            this.updateState(connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE, new picker_1.UnavailablePicker(error));
            this.onFailedResolution(error);
        }
    }
    exitIdle() {
        if (this.currentState === connectivity_state_1.ConnectivityState.IDLE || this.currentState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
            if (this.backoffTimeout.isRunning()) {
                this.continueResolving = true;
            } else {
                this.updateResolution();
            }
        }
        this.childLoadBalancer.exitIdle();
    }
    updateAddressList(addressList, lbConfig) {
        throw new Error('updateAddressList not supported on ResolvingLoadBalancer');
    }
    resetBackoff() {
        this.backoffTimeout.reset();
        this.childLoadBalancer.resetBackoff();
    }
    destroy() {
        this.childLoadBalancer.destroy();
        this.innerResolver.destroy();
        this.updateState(connectivity_state_1.ConnectivityState.SHUTDOWN, new picker_1.UnavailablePicker());
    }
    getTypeName() {
        return 'resolving_load_balancer';
    }
}
exports.ResolvingLoadBalancer = ResolvingLoadBalancer; //# sourceMappingURL=resolving-load-balancer.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channel-options.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.channelOptionsEqual = exports.recognizedOptions = void 0;
/**
 * This is for checking provided options at runtime. This is an object for
 * easier membership checking.
 */ exports.recognizedOptions = {
    'grpc.ssl_target_name_override': true,
    'grpc.primary_user_agent': true,
    'grpc.secondary_user_agent': true,
    'grpc.default_authority': true,
    'grpc.keepalive_time_ms': true,
    'grpc.keepalive_timeout_ms': true,
    'grpc.keepalive_permit_without_calls': true,
    'grpc.service_config': true,
    'grpc.max_concurrent_streams': true,
    'grpc.initial_reconnect_backoff_ms': true,
    'grpc.max_reconnect_backoff_ms': true,
    'grpc.use_local_subchannel_pool': true,
    'grpc.max_send_message_length': true,
    'grpc.max_receive_message_length': true,
    'grpc.enable_http_proxy': true,
    'grpc.enable_channelz': true,
    'grpc.dns_min_time_between_resolutions_ms': true,
    'grpc-node.max_session_memory': true
};
function channelOptionsEqual(options1, options2) {
    const keys1 = Object.keys(options1).sort();
    const keys2 = Object.keys(options2).sort();
    if (keys1.length !== keys2.length) {
        return false;
    }
    for(let i = 0; i < keys1.length; i += 1){
        if (keys1[i] !== keys2[i]) {
            return false;
        }
        if (options1[keys1[i]] !== options2[keys2[i]]) {
            return false;
        }
    }
    return true;
}
exports.channelOptionsEqual = channelOptionsEqual; //# sourceMappingURL=channel-options.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2021 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stringToSubchannelAddress = exports.subchannelAddressToString = exports.subchannelAddressEqual = exports.isTcpSubchannelAddress = void 0;
const net_1 = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
function isTcpSubchannelAddress(address) {
    return 'port' in address;
}
exports.isTcpSubchannelAddress = isTcpSubchannelAddress;
function subchannelAddressEqual(address1, address2) {
    if (isTcpSubchannelAddress(address1)) {
        return isTcpSubchannelAddress(address2) && address1.host === address2.host && address1.port === address2.port;
    } else {
        return !isTcpSubchannelAddress(address2) && address1.path === address2.path;
    }
}
exports.subchannelAddressEqual = subchannelAddressEqual;
function subchannelAddressToString(address) {
    if (isTcpSubchannelAddress(address)) {
        return address.host + ':' + address.port;
    } else {
        return address.path;
    }
}
exports.subchannelAddressToString = subchannelAddressToString;
const DEFAULT_PORT = 443;
function stringToSubchannelAddress(addressString, port) {
    if (net_1.isIP(addressString)) {
        return {
            host: addressString,
            port: port !== null && port !== void 0 ? port : DEFAULT_PORT
        };
    } else {
        return {
            path: addressString
        };
    }
}
exports.stringToSubchannelAddress = stringToSubchannelAddress; //# sourceMappingURL=subchannel-address.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/http_proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProxiedConnection = exports.mapProxyName = void 0;
const logging_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
const http = __turbopack_context__.r("[externals]/http [external] (http, cjs)");
const tls = __turbopack_context__.r("[externals]/tls [external] (tls, cjs)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
const url_1 = __turbopack_context__.r("[externals]/url [external] (url, cjs)");
const TRACER_NAME = 'proxy';
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
function getProxyInfo() {
    let proxyEnv = '';
    let envVar = '';
    /* Prefer using 'grpc_proxy'. Fallback on 'http_proxy' if it is not set.
     * Also prefer using 'https_proxy' with fallback on 'http_proxy'. The
     * fallback behavior can be removed if there's a demand for it.
     */ if (process.env.grpc_proxy) {
        envVar = 'grpc_proxy';
        proxyEnv = process.env.grpc_proxy;
    } else if (process.env.https_proxy) {
        envVar = 'https_proxy';
        proxyEnv = process.env.https_proxy;
    } else if (process.env.http_proxy) {
        envVar = 'http_proxy';
        proxyEnv = process.env.http_proxy;
    } else {
        return {};
    }
    let proxyUrl;
    try {
        proxyUrl = new url_1.URL(proxyEnv);
    } catch (e) {
        logging_1.log(constants_1.LogVerbosity.ERROR, `cannot parse value of "${envVar}" env var`);
        return {};
    }
    if (proxyUrl.protocol !== 'http:') {
        logging_1.log(constants_1.LogVerbosity.ERROR, `"${proxyUrl.protocol}" scheme not supported in proxy URI`);
        return {};
    }
    let userCred = null;
    if (proxyUrl.username) {
        if (proxyUrl.password) {
            logging_1.log(constants_1.LogVerbosity.INFO, 'userinfo found in proxy URI');
            userCred = `${proxyUrl.username}:${proxyUrl.password}`;
        } else {
            userCred = proxyUrl.username;
        }
    }
    const hostname = proxyUrl.hostname;
    let port = proxyUrl.port;
    /* The proxy URL uses the scheme "http:", which has a default port number of
     * 80. We need to set that explicitly here if it is omitted because otherwise
     * it will use gRPC's default port 443. */ if (port === '') {
        port = '80';
    }
    const result = {
        address: `${hostname}:${port}`
    };
    if (userCred) {
        result.creds = userCred;
    }
    trace('Proxy server ' + result.address + ' set by environment variable ' + envVar);
    return result;
}
function getNoProxyHostList() {
    /* Prefer using 'no_grpc_proxy'. Fallback on 'no_proxy' if it is not set. */ let noProxyStr = process.env.no_grpc_proxy;
    let envVar = 'no_grpc_proxy';
    if (!noProxyStr) {
        noProxyStr = process.env.no_proxy;
        envVar = 'no_proxy';
    }
    if (noProxyStr) {
        trace('No proxy server list set by environment variable ' + envVar);
        return noProxyStr.split(',');
    } else {
        return [];
    }
}
function mapProxyName(target, options) {
    var _a;
    const noProxyResult = {
        target: target,
        extraOptions: {}
    };
    if (((_a = options['grpc.enable_http_proxy']) !== null && _a !== void 0 ? _a : 1) === 0) {
        return noProxyResult;
    }
    if (target.scheme === 'unix') {
        return noProxyResult;
    }
    const proxyInfo = getProxyInfo();
    if (!proxyInfo.address) {
        return noProxyResult;
    }
    const hostPort = uri_parser_1.splitHostPort(target.path);
    if (!hostPort) {
        return noProxyResult;
    }
    const serverHost = hostPort.host;
    for (const host of getNoProxyHostList()){
        if (host === serverHost) {
            trace('Not using proxy for target in no_proxy list: ' + uri_parser_1.uriToString(target));
            return noProxyResult;
        }
    }
    const extraOptions = {
        'grpc.http_connect_target': uri_parser_1.uriToString(target)
    };
    if (proxyInfo.creds) {
        extraOptions['grpc.http_connect_creds'] = proxyInfo.creds;
    }
    return {
        target: {
            scheme: 'dns',
            path: proxyInfo.address
        },
        extraOptions: extraOptions
    };
}
exports.mapProxyName = mapProxyName;
function getProxiedConnection(address, channelOptions, connectionOptions) {
    if (!('grpc.http_connect_target' in channelOptions)) {
        return Promise.resolve({});
    }
    const realTarget = channelOptions['grpc.http_connect_target'];
    const parsedTarget = uri_parser_1.parseUri(realTarget);
    if (parsedTarget === null) {
        return Promise.resolve({});
    }
    const options = {
        method: 'CONNECT',
        path: parsedTarget.path
    };
    const headers = {
        Host: parsedTarget.path
    };
    // Connect to the subchannel address as a proxy
    if (subchannel_address_1.isTcpSubchannelAddress(address)) {
        options.host = address.host;
        options.port = address.port;
    } else {
        options.socketPath = address.path;
    }
    if ('grpc.http_connect_creds' in channelOptions) {
        headers['Proxy-Authorization'] = 'Basic ' + Buffer.from(channelOptions['grpc.http_connect_creds']).toString('base64');
    }
    options.headers = headers;
    const proxyAddressString = subchannel_address_1.subchannelAddressToString(address);
    trace('Using proxy ' + proxyAddressString + ' to connect to ' + options.path);
    return new Promise((resolve, reject)=>{
        const request = http.request(options);
        request.once('connect', (res, socket, head)=>{
            var _a;
            request.removeAllListeners();
            socket.removeAllListeners();
            if (res.statusCode === 200) {
                trace('Successfully connected to ' + options.path + ' through proxy ' + proxyAddressString);
                if ('secureContext' in connectionOptions) {
                    /* The proxy is connecting to a TLS server, so upgrade this socket
                     * connection to a TLS connection.
                     * This is a workaround for https://github.com/nodejs/node/issues/32922
                     * See https://github.com/grpc/grpc-node/pull/1369 for more info. */ const targetPath = resolver_1.getDefaultAuthority(parsedTarget);
                    const hostPort = uri_parser_1.splitHostPort(targetPath);
                    const remoteHost = (_a = hostPort === null || hostPort === void 0 ? void 0 : hostPort.host) !== null && _a !== void 0 ? _a : targetPath;
                    const cts = tls.connect(Object.assign({
                        host: remoteHost,
                        servername: remoteHost,
                        socket: socket
                    }, connectionOptions), ()=>{
                        trace('Successfully established a TLS connection to ' + options.path + ' through proxy ' + proxyAddressString);
                        resolve({
                            socket: cts,
                            realTarget: parsedTarget
                        });
                    });
                    cts.on('error', (error)=>{
                        trace('Failed to establish a TLS connection to ' + options.path + ' through proxy ' + proxyAddressString + ' with error ' + error.message);
                        reject();
                    });
                } else {
                    trace('Successfully established a plaintext connection to ' + options.path + ' through proxy ' + proxyAddressString);
                    resolve({
                        socket,
                        realTarget: parsedTarget
                    });
                }
            } else {
                logging_1.log(constants_1.LogVerbosity.ERROR, 'Failed to connect to ' + options.path + ' through proxy ' + proxyAddressString + ' with status ' + res.statusCode);
                reject();
            }
        });
        request.once('error', (err)=>{
            request.removeAllListeners();
            logging_1.log(constants_1.LogVerbosity.ERROR, 'Failed to connect to proxy ' + proxyAddressString + ' with error ' + err.message);
            reject();
        });
        request.end();
    });
}
exports.getProxiedConnection = getProxiedConnection; //# sourceMappingURL=http_proxy.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/admin.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2021 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addAdminServicesToServer = exports.registerAdminService = void 0;
const registeredAdminServices = [];
function registerAdminService(getServiceDefinition, getHandlers) {
    registeredAdminServices.push({
        getServiceDefinition,
        getHandlers
    });
}
exports.registerAdminService = registerAdminService;
function addAdminServicesToServer(server) {
    for (const { getServiceDefinition, getHandlers } of registeredAdminServices){
        server.addService(getServiceDefinition(), getHandlers());
    }
}
exports.addAdminServicesToServer = addAdminServicesToServer; //# sourceMappingURL=admin.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ClientDuplexStreamImpl = exports.ClientWritableStreamImpl = exports.ClientReadableStreamImpl = exports.ClientUnaryCallImpl = exports.callErrorFromStatus = void 0;
const events_1 = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const stream_1 = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
/**
 * Construct a ServiceError from a StatusObject. This function exists primarily
 * as an attempt to make the error stack trace clearly communicate that the
 * error is not necessarily a problem in gRPC itself.
 * @param status
 */ function callErrorFromStatus(status, callerStack) {
    const message = `${status.code} ${constants_1.Status[status.code]}: ${status.details}`;
    const error = new Error(message);
    const stack = `${error.stack}\nfor call at\n${callerStack}`;
    return Object.assign(new Error(message), status, {
        stack
    });
}
exports.callErrorFromStatus = callErrorFromStatus;
class ClientUnaryCallImpl extends events_1.EventEmitter {
    constructor(){
        super();
    }
    cancel() {
        var _a;
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled on client');
    }
    getPeer() {
        var _a, _b;
        return (_b = (_a = this.call) === null || _a === void 0 ? void 0 : _a.getPeer()) !== null && _b !== void 0 ? _b : 'unknown';
    }
}
exports.ClientUnaryCallImpl = ClientUnaryCallImpl;
class ClientReadableStreamImpl extends stream_1.Readable {
    constructor(deserialize){
        super({
            objectMode: true
        });
        this.deserialize = deserialize;
    }
    cancel() {
        var _a;
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled on client');
    }
    getPeer() {
        var _a, _b;
        return (_b = (_a = this.call) === null || _a === void 0 ? void 0 : _a.getPeer()) !== null && _b !== void 0 ? _b : 'unknown';
    }
    _read(_size) {
        var _a;
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.startRead();
    }
}
exports.ClientReadableStreamImpl = ClientReadableStreamImpl;
class ClientWritableStreamImpl extends stream_1.Writable {
    constructor(serialize){
        super({
            objectMode: true
        });
        this.serialize = serialize;
    }
    cancel() {
        var _a;
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled on client');
    }
    getPeer() {
        var _a, _b;
        return (_b = (_a = this.call) === null || _a === void 0 ? void 0 : _a.getPeer()) !== null && _b !== void 0 ? _b : 'unknown';
    }
    _write(chunk, encoding, cb) {
        var _a;
        const context = {
            callback: cb
        };
        const flags = Number(encoding);
        if (!Number.isNaN(flags)) {
            context.flags = flags;
        }
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.sendMessageWithContext(context, chunk);
    }
    _final(cb) {
        var _a;
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.halfClose();
        cb();
    }
}
exports.ClientWritableStreamImpl = ClientWritableStreamImpl;
class ClientDuplexStreamImpl extends stream_1.Duplex {
    constructor(serialize, deserialize){
        super({
            objectMode: true
        });
        this.serialize = serialize;
        this.deserialize = deserialize;
    }
    cancel() {
        var _a;
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled on client');
    }
    getPeer() {
        var _a, _b;
        return (_b = (_a = this.call) === null || _a === void 0 ? void 0 : _a.getPeer()) !== null && _b !== void 0 ? _b : 'unknown';
    }
    _read(_size) {
        var _a;
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.startRead();
    }
    _write(chunk, encoding, cb) {
        var _a;
        const context = {
            callback: cb
        };
        const flags = Number(encoding);
        if (!Number.isNaN(flags)) {
            context.flags = flags;
        }
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.sendMessageWithContext(context, chunk);
    }
    _final(cb) {
        var _a;
        (_a = this.call) === null || _a === void 0 ? void 0 : _a.halfClose();
        cb();
    }
}
exports.ClientDuplexStreamImpl = ClientDuplexStreamImpl; //# sourceMappingURL=call.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/client-interceptors.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getInterceptingCall = exports.InterceptingCall = exports.RequesterBuilder = exports.ListenerBuilder = exports.InterceptorConfigurationError = void 0;
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
const call_stream_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call-stream.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
/**
 * Error class associated with passing both interceptors and interceptor
 * providers to a client constructor or as call options.
 */ class InterceptorConfigurationError extends Error {
    constructor(message){
        super(message);
        this.name = 'InterceptorConfigurationError';
        Error.captureStackTrace(this, InterceptorConfigurationError);
    }
}
exports.InterceptorConfigurationError = InterceptorConfigurationError;
class ListenerBuilder {
    constructor(){
        this.metadata = undefined;
        this.message = undefined;
        this.status = undefined;
    }
    withOnReceiveMetadata(onReceiveMetadata) {
        this.metadata = onReceiveMetadata;
        return this;
    }
    withOnReceiveMessage(onReceiveMessage) {
        this.message = onReceiveMessage;
        return this;
    }
    withOnReceiveStatus(onReceiveStatus) {
        this.status = onReceiveStatus;
        return this;
    }
    build() {
        return {
            onReceiveMetadata: this.metadata,
            onReceiveMessage: this.message,
            onReceiveStatus: this.status
        };
    }
}
exports.ListenerBuilder = ListenerBuilder;
class RequesterBuilder {
    constructor(){
        this.start = undefined;
        this.message = undefined;
        this.halfClose = undefined;
        this.cancel = undefined;
    }
    withStart(start) {
        this.start = start;
        return this;
    }
    withSendMessage(sendMessage) {
        this.message = sendMessage;
        return this;
    }
    withHalfClose(halfClose) {
        this.halfClose = halfClose;
        return this;
    }
    withCancel(cancel) {
        this.cancel = cancel;
        return this;
    }
    build() {
        return {
            start: this.start,
            sendMessage: this.message,
            halfClose: this.halfClose,
            cancel: this.cancel
        };
    }
}
exports.RequesterBuilder = RequesterBuilder;
/**
 * A Listener with a default pass-through implementation of each method. Used
 * for filling out Listeners with some methods omitted.
 */ const defaultListener = {
    onReceiveMetadata: (metadata, next)=>{
        next(metadata);
    },
    onReceiveMessage: (message, next)=>{
        next(message);
    },
    onReceiveStatus: (status, next)=>{
        next(status);
    }
};
/**
 * A Requester with a default pass-through implementation of each method. Used
 * for filling out Requesters with some methods omitted.
 */ const defaultRequester = {
    start: (metadata, listener, next)=>{
        next(metadata, listener);
    },
    sendMessage: (message, next)=>{
        next(message);
    },
    halfClose: (next)=>{
        next();
    },
    cancel: (next)=>{
        next();
    }
};
class InterceptingCall {
    constructor(nextCall, requester){
        var _a, _b, _c, _d;
        this.nextCall = nextCall;
        /**
         * Indicates that metadata has been passed to the requester's start
         * method but it has not been passed to the corresponding next callback
         */ this.processingMetadata = false;
        /**
         * Message context for a pending message that is waiting for
         */ this.pendingMessageContext = null;
        /**
         * Indicates that a message has been passed to the requester's sendMessage
         * method but it has not been passed to the corresponding next callback
         */ this.processingMessage = false;
        /**
         * Indicates that a status was received but could not be propagated because
         * a message was still being processed.
         */ this.pendingHalfClose = false;
        if (requester) {
            this.requester = {
                start: (_a = requester.start) !== null && _a !== void 0 ? _a : defaultRequester.start,
                sendMessage: (_b = requester.sendMessage) !== null && _b !== void 0 ? _b : defaultRequester.sendMessage,
                halfClose: (_c = requester.halfClose) !== null && _c !== void 0 ? _c : defaultRequester.halfClose,
                cancel: (_d = requester.cancel) !== null && _d !== void 0 ? _d : defaultRequester.cancel
            };
        } else {
            this.requester = defaultRequester;
        }
    }
    cancelWithStatus(status, details) {
        this.requester.cancel(()=>{
            this.nextCall.cancelWithStatus(status, details);
        });
    }
    getPeer() {
        return this.nextCall.getPeer();
    }
    processPendingMessage() {
        if (this.pendingMessageContext) {
            this.nextCall.sendMessageWithContext(this.pendingMessageContext, this.pendingMessage);
            this.pendingMessageContext = null;
            this.pendingMessage = null;
        }
    }
    processPendingHalfClose() {
        if (this.pendingHalfClose) {
            this.nextCall.halfClose();
        }
    }
    start(metadata, interceptingListener) {
        var _a, _b, _c, _d, _e, _f;
        const fullInterceptingListener = {
            onReceiveMetadata: (_b = (_a = interceptingListener === null || interceptingListener === void 0 ? void 0 : interceptingListener.onReceiveMetadata) === null || _a === void 0 ? void 0 : _a.bind(interceptingListener)) !== null && _b !== void 0 ? _b : (metadata)=>{},
            onReceiveMessage: (_d = (_c = interceptingListener === null || interceptingListener === void 0 ? void 0 : interceptingListener.onReceiveMessage) === null || _c === void 0 ? void 0 : _c.bind(interceptingListener)) !== null && _d !== void 0 ? _d : (message)=>{},
            onReceiveStatus: (_f = (_e = interceptingListener === null || interceptingListener === void 0 ? void 0 : interceptingListener.onReceiveStatus) === null || _e === void 0 ? void 0 : _e.bind(interceptingListener)) !== null && _f !== void 0 ? _f : (status)=>{}
        };
        this.processingMetadata = true;
        this.requester.start(metadata, fullInterceptingListener, (md, listener)=>{
            var _a, _b, _c;
            this.processingMetadata = false;
            let finalInterceptingListener;
            if (call_stream_1.isInterceptingListener(listener)) {
                finalInterceptingListener = listener;
            } else {
                const fullListener = {
                    onReceiveMetadata: (_a = listener.onReceiveMetadata) !== null && _a !== void 0 ? _a : defaultListener.onReceiveMetadata,
                    onReceiveMessage: (_b = listener.onReceiveMessage) !== null && _b !== void 0 ? _b : defaultListener.onReceiveMessage,
                    onReceiveStatus: (_c = listener.onReceiveStatus) !== null && _c !== void 0 ? _c : defaultListener.onReceiveStatus
                };
                finalInterceptingListener = new call_stream_1.InterceptingListenerImpl(fullListener, fullInterceptingListener);
            }
            this.nextCall.start(md, finalInterceptingListener);
            this.processPendingMessage();
            this.processPendingHalfClose();
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessageWithContext(context, message) {
        this.processingMessage = true;
        this.requester.sendMessage(message, (finalMessage)=>{
            this.processingMessage = false;
            if (this.processingMetadata) {
                this.pendingMessageContext = context;
                this.pendingMessage = message;
            } else {
                this.nextCall.sendMessageWithContext(context, finalMessage);
                this.processPendingHalfClose();
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage(message) {
        this.sendMessageWithContext({}, message);
    }
    startRead() {
        this.nextCall.startRead();
    }
    halfClose() {
        this.requester.halfClose(()=>{
            if (this.processingMetadata || this.processingMessage) {
                this.pendingHalfClose = true;
            } else {
                this.nextCall.halfClose();
            }
        });
    }
    setCredentials(credentials) {
        this.nextCall.setCredentials(credentials);
    }
}
exports.InterceptingCall = InterceptingCall;
function getCall(channel, path, options) {
    var _a, _b;
    const deadline = (_a = options.deadline) !== null && _a !== void 0 ? _a : Infinity;
    const host = options.host;
    const parent = (_b = options.parent) !== null && _b !== void 0 ? _b : null;
    const propagateFlags = options.propagate_flags;
    const credentials = options.credentials;
    const call = channel.createCall(path, deadline, host, parent, propagateFlags);
    if (credentials) {
        call.setCredentials(credentials);
    }
    return call;
}
/**
 * InterceptingCall implementation that directly owns the underlying Call
 * object and handles serialization and deseraizliation.
 */ class BaseInterceptingCall {
    constructor(call, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methodDefinition){
        this.call = call;
        this.methodDefinition = methodDefinition;
    }
    cancelWithStatus(status, details) {
        this.call.cancelWithStatus(status, details);
    }
    getPeer() {
        return this.call.getPeer();
    }
    setCredentials(credentials) {
        this.call.setCredentials(credentials);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessageWithContext(context, message) {
        let serialized;
        try {
            serialized = this.methodDefinition.requestSerialize(message);
        } catch (e) {
            this.call.cancelWithStatus(constants_1.Status.INTERNAL, `Request message serialization failure: ${e.message}`);
            return;
        }
        this.call.sendMessageWithContext(context, serialized);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage(message) {
        this.sendMessageWithContext({}, message);
    }
    start(metadata, interceptingListener) {
        let readError = null;
        this.call.start(metadata, {
            onReceiveMetadata: (metadata)=>{
                var _a;
                (_a = interceptingListener === null || interceptingListener === void 0 ? void 0 : interceptingListener.onReceiveMetadata) === null || _a === void 0 ? void 0 : _a.call(interceptingListener, metadata);
            },
            onReceiveMessage: (message)=>{
                var _a;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let deserialized;
                try {
                    deserialized = this.methodDefinition.responseDeserialize(message);
                } catch (e) {
                    readError = {
                        code: constants_1.Status.INTERNAL,
                        details: `Response message parsing error: ${e.message}`,
                        metadata: new metadata_1.Metadata()
                    };
                    this.call.cancelWithStatus(readError.code, readError.details);
                    return;
                }
                (_a = interceptingListener === null || interceptingListener === void 0 ? void 0 : interceptingListener.onReceiveMessage) === null || _a === void 0 ? void 0 : _a.call(interceptingListener, deserialized);
            },
            onReceiveStatus: (status)=>{
                var _a, _b;
                if (readError) {
                    (_a = interceptingListener === null || interceptingListener === void 0 ? void 0 : interceptingListener.onReceiveStatus) === null || _a === void 0 ? void 0 : _a.call(interceptingListener, readError);
                } else {
                    (_b = interceptingListener === null || interceptingListener === void 0 ? void 0 : interceptingListener.onReceiveStatus) === null || _b === void 0 ? void 0 : _b.call(interceptingListener, status);
                }
            }
        });
    }
    startRead() {
        this.call.startRead();
    }
    halfClose() {
        this.call.halfClose();
    }
}
/**
 * BaseInterceptingCall with special-cased behavior for methods with unary
 * responses.
 */ class BaseUnaryInterceptingCall extends BaseInterceptingCall {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(call, methodDefinition){
        super(call, methodDefinition);
    }
    start(metadata, listener) {
        var _a, _b;
        let receivedMessage = false;
        const wrapperListener = {
            onReceiveMetadata: (_b = (_a = listener === null || listener === void 0 ? void 0 : listener.onReceiveMetadata) === null || _a === void 0 ? void 0 : _a.bind(listener)) !== null && _b !== void 0 ? _b : (metadata)=>{},
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onReceiveMessage: (message)=>{
                var _a;
                receivedMessage = true;
                (_a = listener === null || listener === void 0 ? void 0 : listener.onReceiveMessage) === null || _a === void 0 ? void 0 : _a.call(listener, message);
            },
            onReceiveStatus: (status)=>{
                var _a, _b;
                if (!receivedMessage) {
                    (_a = listener === null || listener === void 0 ? void 0 : listener.onReceiveMessage) === null || _a === void 0 ? void 0 : _a.call(listener, null);
                }
                (_b = listener === null || listener === void 0 ? void 0 : listener.onReceiveStatus) === null || _b === void 0 ? void 0 : _b.call(listener, status);
            }
        };
        super.start(metadata, wrapperListener);
        this.call.startRead();
    }
}
/**
 * BaseInterceptingCall with special-cased behavior for methods with streaming
 * responses.
 */ class BaseStreamingInterceptingCall extends BaseInterceptingCall {
}
function getBottomInterceptingCall(channel, options, // eslint-disable-next-line @typescript-eslint/no-explicit-any
methodDefinition) {
    const call = getCall(channel, methodDefinition.path, options);
    if (methodDefinition.responseStream) {
        return new BaseStreamingInterceptingCall(call, methodDefinition);
    } else {
        return new BaseUnaryInterceptingCall(call, methodDefinition);
    }
}
function getInterceptingCall(interceptorArgs, // eslint-disable-next-line @typescript-eslint/no-explicit-any
methodDefinition, options, channel) {
    if (interceptorArgs.clientInterceptors.length > 0 && interceptorArgs.clientInterceptorProviders.length > 0) {
        throw new InterceptorConfigurationError('Both interceptors and interceptor_providers were passed as options ' + 'to the client constructor. Only one of these is allowed.');
    }
    if (interceptorArgs.callInterceptors.length > 0 && interceptorArgs.callInterceptorProviders.length > 0) {
        throw new InterceptorConfigurationError('Both interceptors and interceptor_providers were passed as call ' + 'options. Only one of these is allowed.');
    }
    let interceptors = [];
    // Interceptors passed to the call override interceptors passed to the client constructor
    if (interceptorArgs.callInterceptors.length > 0 || interceptorArgs.callInterceptorProviders.length > 0) {
        interceptors = [].concat(interceptorArgs.callInterceptors, interceptorArgs.callInterceptorProviders.map((provider)=>provider(methodDefinition))).filter((interceptor)=>interceptor);
    // Filter out falsy values when providers return nothing
    } else {
        interceptors = [].concat(interceptorArgs.clientInterceptors, interceptorArgs.clientInterceptorProviders.map((provider)=>provider(methodDefinition))).filter((interceptor)=>interceptor);
    // Filter out falsy values when providers return nothing
    }
    const interceptorOptions = Object.assign({}, options, {
        method_definition: methodDefinition
    });
    /* For each interceptor in the list, the nextCall function passed to it is
     * based on the next interceptor in the list, using a nextCall function
     * constructed with the following interceptor in the list, and so on. The
     * initialValue, which is effectively at the end of the list, is a nextCall
     * function that invokes getBottomInterceptingCall, the result of which
     * handles (de)serialization and also gets the underlying call from the
     * channel. */ const getCall = interceptors.reduceRight((nextCall, nextInterceptor)=>{
        return (currentOptions)=>nextInterceptor(currentOptions, nextCall);
    }, (finalOptions)=>getBottomInterceptingCall(channel, finalOptions, methodDefinition));
    return getCall(interceptorOptions);
}
exports.getInterceptingCall = getInterceptingCall; //# sourceMappingURL=client-interceptors.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/client.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = void 0;
const call_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call.js [app-ssr] (ecmascript)");
const channel_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channel.js [app-ssr] (ecmascript)");
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
const client_interceptors_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/client-interceptors.js [app-ssr] (ecmascript)");
const CHANNEL_SYMBOL = Symbol();
const INTERCEPTOR_SYMBOL = Symbol();
const INTERCEPTOR_PROVIDER_SYMBOL = Symbol();
const CALL_INVOCATION_TRANSFORMER_SYMBOL = Symbol();
function isFunction(arg) {
    return typeof arg === 'function';
}
function getErrorStackString(error) {
    return error.stack.split('\n').slice(1).join('\n');
}
/**
 * A generic gRPC client. Primarily useful as a base class for all generated
 * clients.
 */ class Client {
    constructor(address, credentials, options = {}){
        var _a, _b;
        options = Object.assign({}, options);
        this[INTERCEPTOR_SYMBOL] = (_a = options.interceptors) !== null && _a !== void 0 ? _a : [];
        delete options.interceptors;
        this[INTERCEPTOR_PROVIDER_SYMBOL] = (_b = options.interceptor_providers) !== null && _b !== void 0 ? _b : [];
        delete options.interceptor_providers;
        if (this[INTERCEPTOR_SYMBOL].length > 0 && this[INTERCEPTOR_PROVIDER_SYMBOL].length > 0) {
            throw new Error('Both interceptors and interceptor_providers were passed as options ' + 'to the client constructor. Only one of these is allowed.');
        }
        this[CALL_INVOCATION_TRANSFORMER_SYMBOL] = options.callInvocationTransformer;
        delete options.callInvocationTransformer;
        if (options.channelOverride) {
            this[CHANNEL_SYMBOL] = options.channelOverride;
        } else if (options.channelFactoryOverride) {
            const channelFactoryOverride = options.channelFactoryOverride;
            delete options.channelFactoryOverride;
            this[CHANNEL_SYMBOL] = channelFactoryOverride(address, credentials, options);
        } else {
            this[CHANNEL_SYMBOL] = new channel_1.ChannelImplementation(address, credentials, options);
        }
    }
    close() {
        this[CHANNEL_SYMBOL].close();
    }
    getChannel() {
        return this[CHANNEL_SYMBOL];
    }
    waitForReady(deadline, callback) {
        const checkState = (err)=>{
            if (err) {
                callback(new Error('Failed to connect before the deadline'));
                return;
            }
            let newState;
            try {
                newState = this[CHANNEL_SYMBOL].getConnectivityState(true);
            } catch (e) {
                callback(new Error('The channel has been closed'));
                return;
            }
            if (newState === connectivity_state_1.ConnectivityState.READY) {
                callback();
            } else {
                try {
                    this[CHANNEL_SYMBOL].watchConnectivityState(newState, deadline, checkState);
                } catch (e) {
                    callback(new Error('The channel has been closed'));
                }
            }
        };
        setImmediate(checkState);
    }
    checkOptionalUnaryResponseArguments(arg1, arg2, arg3) {
        if (isFunction(arg1)) {
            return {
                metadata: new metadata_1.Metadata(),
                options: {},
                callback: arg1
            };
        } else if (isFunction(arg2)) {
            if (arg1 instanceof metadata_1.Metadata) {
                return {
                    metadata: arg1,
                    options: {},
                    callback: arg2
                };
            } else {
                return {
                    metadata: new metadata_1.Metadata(),
                    options: arg1,
                    callback: arg2
                };
            }
        } else {
            if (!(arg1 instanceof metadata_1.Metadata && arg2 instanceof Object && isFunction(arg3))) {
                throw new Error('Incorrect arguments passed');
            }
            return {
                metadata: arg1,
                options: arg2,
                callback: arg3
            };
        }
    }
    makeUnaryRequest(method, serialize, deserialize, argument, metadata, options, callback) {
        var _a, _b;
        const checkedArguments = this.checkOptionalUnaryResponseArguments(metadata, options, callback);
        const methodDefinition = {
            path: method,
            requestStream: false,
            responseStream: false,
            requestSerialize: serialize,
            responseDeserialize: deserialize
        };
        let callProperties = {
            argument: argument,
            metadata: checkedArguments.metadata,
            call: new call_1.ClientUnaryCallImpl(),
            channel: this[CHANNEL_SYMBOL],
            methodDefinition: methodDefinition,
            callOptions: checkedArguments.options,
            callback: checkedArguments.callback
        };
        if (this[CALL_INVOCATION_TRANSFORMER_SYMBOL]) {
            callProperties = this[CALL_INVOCATION_TRANSFORMER_SYMBOL](callProperties);
        }
        const emitter = callProperties.call;
        const interceptorArgs = {
            clientInterceptors: this[INTERCEPTOR_SYMBOL],
            clientInterceptorProviders: this[INTERCEPTOR_PROVIDER_SYMBOL],
            callInterceptors: (_a = callProperties.callOptions.interceptors) !== null && _a !== void 0 ? _a : [],
            callInterceptorProviders: (_b = callProperties.callOptions.interceptor_providers) !== null && _b !== void 0 ? _b : []
        };
        const call = client_interceptors_1.getInterceptingCall(interceptorArgs, callProperties.methodDefinition, callProperties.callOptions, callProperties.channel);
        /* This needs to happen before the emitter is used. Unfortunately we can't
         * enforce this with the type system. We need to construct this emitter
         * before calling the CallInvocationTransformer, and we need to create the
         * call after that. */ emitter.call = call;
        if (callProperties.callOptions.credentials) {
            call.setCredentials(callProperties.callOptions.credentials);
        }
        let responseMessage = null;
        let receivedStatus = false;
        const callerStackError = new Error();
        call.start(callProperties.metadata, {
            onReceiveMetadata: (metadata)=>{
                emitter.emit('metadata', metadata);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onReceiveMessage (message) {
                if (responseMessage !== null) {
                    call.cancelWithStatus(constants_1.Status.INTERNAL, 'Too many responses received');
                }
                responseMessage = message;
            },
            onReceiveStatus (status) {
                if (receivedStatus) {
                    return;
                }
                receivedStatus = true;
                if (status.code === constants_1.Status.OK) {
                    if (responseMessage === null) {
                        const callerStack = getErrorStackString(callerStackError);
                        callProperties.callback(call_1.callErrorFromStatus({
                            code: constants_1.Status.INTERNAL,
                            details: 'No message received',
                            metadata: status.metadata
                        }, callerStack));
                    } else {
                        callProperties.callback(null, responseMessage);
                    }
                } else {
                    const callerStack = getErrorStackString(callerStackError);
                    callProperties.callback(call_1.callErrorFromStatus(status, callerStack));
                }
                emitter.emit('status', status);
            }
        });
        call.sendMessage(argument);
        call.halfClose();
        return emitter;
    }
    makeClientStreamRequest(method, serialize, deserialize, metadata, options, callback) {
        var _a, _b;
        const checkedArguments = this.checkOptionalUnaryResponseArguments(metadata, options, callback);
        const methodDefinition = {
            path: method,
            requestStream: true,
            responseStream: false,
            requestSerialize: serialize,
            responseDeserialize: deserialize
        };
        let callProperties = {
            metadata: checkedArguments.metadata,
            call: new call_1.ClientWritableStreamImpl(serialize),
            channel: this[CHANNEL_SYMBOL],
            methodDefinition: methodDefinition,
            callOptions: checkedArguments.options,
            callback: checkedArguments.callback
        };
        if (this[CALL_INVOCATION_TRANSFORMER_SYMBOL]) {
            callProperties = this[CALL_INVOCATION_TRANSFORMER_SYMBOL](callProperties);
        }
        const emitter = callProperties.call;
        const interceptorArgs = {
            clientInterceptors: this[INTERCEPTOR_SYMBOL],
            clientInterceptorProviders: this[INTERCEPTOR_PROVIDER_SYMBOL],
            callInterceptors: (_a = callProperties.callOptions.interceptors) !== null && _a !== void 0 ? _a : [],
            callInterceptorProviders: (_b = callProperties.callOptions.interceptor_providers) !== null && _b !== void 0 ? _b : []
        };
        const call = client_interceptors_1.getInterceptingCall(interceptorArgs, callProperties.methodDefinition, callProperties.callOptions, callProperties.channel);
        /* This needs to happen before the emitter is used. Unfortunately we can't
         * enforce this with the type system. We need to construct this emitter
         * before calling the CallInvocationTransformer, and we need to create the
         * call after that. */ emitter.call = call;
        if (callProperties.callOptions.credentials) {
            call.setCredentials(callProperties.callOptions.credentials);
        }
        let responseMessage = null;
        let receivedStatus = false;
        const callerStackError = new Error();
        call.start(callProperties.metadata, {
            onReceiveMetadata: (metadata)=>{
                emitter.emit('metadata', metadata);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onReceiveMessage (message) {
                if (responseMessage !== null) {
                    call.cancelWithStatus(constants_1.Status.INTERNAL, 'Too many responses received');
                }
                responseMessage = message;
            },
            onReceiveStatus (status) {
                if (receivedStatus) {
                    return;
                }
                receivedStatus = true;
                if (status.code === constants_1.Status.OK) {
                    if (responseMessage === null) {
                        const callerStack = getErrorStackString(callerStackError);
                        callProperties.callback(call_1.callErrorFromStatus({
                            code: constants_1.Status.INTERNAL,
                            details: 'No message received',
                            metadata: status.metadata
                        }, callerStack));
                    } else {
                        callProperties.callback(null, responseMessage);
                    }
                } else {
                    const callerStack = getErrorStackString(callerStackError);
                    callProperties.callback(call_1.callErrorFromStatus(status, callerStack));
                }
                emitter.emit('status', status);
            }
        });
        return emitter;
    }
    checkMetadataAndOptions(arg1, arg2) {
        let metadata;
        let options;
        if (arg1 instanceof metadata_1.Metadata) {
            metadata = arg1;
            if (arg2) {
                options = arg2;
            } else {
                options = {};
            }
        } else {
            if (arg1) {
                options = arg1;
            } else {
                options = {};
            }
            metadata = new metadata_1.Metadata();
        }
        return {
            metadata,
            options
        };
    }
    makeServerStreamRequest(method, serialize, deserialize, argument, metadata, options) {
        var _a, _b;
        const checkedArguments = this.checkMetadataAndOptions(metadata, options);
        const methodDefinition = {
            path: method,
            requestStream: false,
            responseStream: true,
            requestSerialize: serialize,
            responseDeserialize: deserialize
        };
        let callProperties = {
            argument: argument,
            metadata: checkedArguments.metadata,
            call: new call_1.ClientReadableStreamImpl(deserialize),
            channel: this[CHANNEL_SYMBOL],
            methodDefinition: methodDefinition,
            callOptions: checkedArguments.options
        };
        if (this[CALL_INVOCATION_TRANSFORMER_SYMBOL]) {
            callProperties = this[CALL_INVOCATION_TRANSFORMER_SYMBOL](callProperties);
        }
        const stream = callProperties.call;
        const interceptorArgs = {
            clientInterceptors: this[INTERCEPTOR_SYMBOL],
            clientInterceptorProviders: this[INTERCEPTOR_PROVIDER_SYMBOL],
            callInterceptors: (_a = callProperties.callOptions.interceptors) !== null && _a !== void 0 ? _a : [],
            callInterceptorProviders: (_b = callProperties.callOptions.interceptor_providers) !== null && _b !== void 0 ? _b : []
        };
        const call = client_interceptors_1.getInterceptingCall(interceptorArgs, callProperties.methodDefinition, callProperties.callOptions, callProperties.channel);
        /* This needs to happen before the emitter is used. Unfortunately we can't
         * enforce this with the type system. We need to construct this emitter
         * before calling the CallInvocationTransformer, and we need to create the
         * call after that. */ stream.call = call;
        if (callProperties.callOptions.credentials) {
            call.setCredentials(callProperties.callOptions.credentials);
        }
        let receivedStatus = false;
        const callerStackError = new Error();
        call.start(callProperties.metadata, {
            onReceiveMetadata (metadata) {
                stream.emit('metadata', metadata);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onReceiveMessage (message) {
                stream.push(message);
            },
            onReceiveStatus (status) {
                if (receivedStatus) {
                    return;
                }
                receivedStatus = true;
                stream.push(null);
                if (status.code !== constants_1.Status.OK) {
                    const callerStack = getErrorStackString(callerStackError);
                    stream.emit('error', call_1.callErrorFromStatus(status, callerStack));
                }
                stream.emit('status', status);
            }
        });
        call.sendMessage(argument);
        call.halfClose();
        return stream;
    }
    makeBidiStreamRequest(method, serialize, deserialize, metadata, options) {
        var _a, _b;
        const checkedArguments = this.checkMetadataAndOptions(metadata, options);
        const methodDefinition = {
            path: method,
            requestStream: true,
            responseStream: true,
            requestSerialize: serialize,
            responseDeserialize: deserialize
        };
        let callProperties = {
            metadata: checkedArguments.metadata,
            call: new call_1.ClientDuplexStreamImpl(serialize, deserialize),
            channel: this[CHANNEL_SYMBOL],
            methodDefinition: methodDefinition,
            callOptions: checkedArguments.options
        };
        if (this[CALL_INVOCATION_TRANSFORMER_SYMBOL]) {
            callProperties = this[CALL_INVOCATION_TRANSFORMER_SYMBOL](callProperties);
        }
        const stream = callProperties.call;
        const interceptorArgs = {
            clientInterceptors: this[INTERCEPTOR_SYMBOL],
            clientInterceptorProviders: this[INTERCEPTOR_PROVIDER_SYMBOL],
            callInterceptors: (_a = callProperties.callOptions.interceptors) !== null && _a !== void 0 ? _a : [],
            callInterceptorProviders: (_b = callProperties.callOptions.interceptor_providers) !== null && _b !== void 0 ? _b : []
        };
        const call = client_interceptors_1.getInterceptingCall(interceptorArgs, callProperties.methodDefinition, callProperties.callOptions, callProperties.channel);
        /* This needs to happen before the emitter is used. Unfortunately we can't
         * enforce this with the type system. We need to construct this emitter
         * before calling the CallInvocationTransformer, and we need to create the
         * call after that. */ stream.call = call;
        if (callProperties.callOptions.credentials) {
            call.setCredentials(callProperties.callOptions.credentials);
        }
        let receivedStatus = false;
        const callerStackError = new Error();
        call.start(callProperties.metadata, {
            onReceiveMetadata (metadata) {
                stream.emit('metadata', metadata);
            },
            onReceiveMessage (message) {
                stream.push(message);
            },
            onReceiveStatus (status) {
                if (receivedStatus) {
                    return;
                }
                receivedStatus = true;
                stream.push(null);
                if (status.code !== constants_1.Status.OK) {
                    const callerStack = getErrorStackString(callerStackError);
                    stream.emit('error', call_1.callErrorFromStatus(status, callerStack));
                }
                stream.emit('status', status);
            }
        });
        return stream;
    }
}
exports.Client = Client; //# sourceMappingURL=client.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/make-client.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadPackageDefinition = exports.makeClientConstructor = void 0;
const client_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/client.js [app-ssr] (ecmascript)");
/**
 * Map with short names for each of the requester maker functions. Used in
 * makeClientConstructor
 * @private
 */ const requesterFuncs = {
    unary: client_1.Client.prototype.makeUnaryRequest,
    server_stream: client_1.Client.prototype.makeServerStreamRequest,
    client_stream: client_1.Client.prototype.makeClientStreamRequest,
    bidi: client_1.Client.prototype.makeBidiStreamRequest
};
/**
 * Returns true, if given key is included in the blacklisted
 * keys.
 * @param key key for check, string.
 */ function isPrototypePolluted(key) {
    return [
        '__proto__',
        'prototype',
        'constructor'
    ].includes(key);
}
/**
 * Creates a constructor for a client with the given methods, as specified in
 * the methods argument. The resulting class will have an instance method for
 * each method in the service, which is a partial application of one of the
 * [Client]{@link grpc.Client} request methods, depending on `requestSerialize`
 * and `responseSerialize`, with the `method`, `serialize`, and `deserialize`
 * arguments predefined.
 * @param methods An object mapping method names to
 *     method attributes
 * @param serviceName The fully qualified name of the service
 * @param classOptions An options object.
 * @return New client constructor, which is a subclass of
 *     {@link grpc.Client}, and has the same arguments as that constructor.
 */ function makeClientConstructor(methods, serviceName, classOptions) {
    if (!classOptions) {
        classOptions = {};
    }
    class ServiceClientImpl extends client_1.Client {
    }
    Object.keys(methods).forEach((name)=>{
        if (isPrototypePolluted(name)) {
            return;
        }
        const attrs = methods[name];
        let methodType;
        // TODO(murgatroid99): Verify that we don't need this anymore
        if (typeof name === 'string' && name.charAt(0) === '$') {
            throw new Error('Method names cannot start with $');
        }
        if (attrs.requestStream) {
            if (attrs.responseStream) {
                methodType = 'bidi';
            } else {
                methodType = 'client_stream';
            }
        } else {
            if (attrs.responseStream) {
                methodType = 'server_stream';
            } else {
                methodType = 'unary';
            }
        }
        const serialize = attrs.requestSerialize;
        const deserialize = attrs.responseDeserialize;
        const methodFunc = partial(requesterFuncs[methodType], attrs.path, serialize, deserialize);
        ServiceClientImpl.prototype[name] = methodFunc;
        // Associate all provided attributes with the method
        Object.assign(ServiceClientImpl.prototype[name], attrs);
        if (attrs.originalName && !isPrototypePolluted(attrs.originalName)) {
            ServiceClientImpl.prototype[attrs.originalName] = ServiceClientImpl.prototype[name];
        }
    });
    ServiceClientImpl.service = methods;
    ServiceClientImpl.serviceName = serviceName;
    return ServiceClientImpl;
}
exports.makeClientConstructor = makeClientConstructor;
function partial(fn, path, serialize, deserialize) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(...args) {
        return fn.call(this, path, serialize, deserialize, ...args);
    };
}
function isProtobufTypeDefinition(obj) {
    return 'format' in obj;
}
/**
 * Load a gRPC package definition as a gRPC object hierarchy.
 * @param packageDef The package definition object.
 * @return The resulting gRPC object.
 */ function loadPackageDefinition(packageDef) {
    const result = {};
    for(const serviceFqn in packageDef){
        if (Object.prototype.hasOwnProperty.call(packageDef, serviceFqn)) {
            const service = packageDef[serviceFqn];
            const nameComponents = serviceFqn.split('.');
            if (nameComponents.some((comp)=>isPrototypePolluted(comp))) {
                continue;
            }
            const serviceName = nameComponents[nameComponents.length - 1];
            let current = result;
            for (const packageName of nameComponents.slice(0, -1)){
                if (!current[packageName]) {
                    current[packageName] = {};
                }
                current = current[packageName];
            }
            if (isProtobufTypeDefinition(service)) {
                current[serviceName] = service;
            } else {
                current[serviceName] = makeClientConstructor(service, serviceName, {});
            }
        }
    }
    return result;
}
exports.loadPackageDefinition = loadPackageDefinition; //# sourceMappingURL=make-client.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channelz.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2021 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setup = exports.getChannelzServiceDefinition = exports.getChannelzHandlers = exports.unregisterChannelzRef = exports.registerChannelzSocket = exports.registerChannelzServer = exports.registerChannelzSubchannel = exports.registerChannelzChannel = exports.ChannelzCallTracker = exports.ChannelzChildrenTracker = exports.ChannelzTrace = void 0;
const net_1 = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
const admin_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/admin.js [app-ssr] (ecmascript)");
const make_client_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/make-client.js [app-ssr] (ecmascript)");
function channelRefToMessage(ref) {
    return {
        channel_id: ref.id,
        name: ref.name
    };
}
function subchannelRefToMessage(ref) {
    return {
        subchannel_id: ref.id,
        name: ref.name
    };
}
function serverRefToMessage(ref) {
    return {
        server_id: ref.id
    };
}
function socketRefToMessage(ref) {
    return {
        socket_id: ref.id,
        name: ref.name
    };
}
/**
 * The loose upper bound on the number of events that should be retained in a
 * trace. This may be exceeded by up to a factor of 2. Arbitrarily chosen as a
 * number that should be large enough to contain the recent relevant
 * information, but small enough to not use excessive memory.
 */ const TARGET_RETAINED_TRACES = 32;
class ChannelzTrace {
    constructor(){
        this.events = [];
        this.eventsLogged = 0;
        this.creationTimestamp = new Date();
    }
    addTrace(severity, description, child) {
        const timestamp = new Date();
        this.events.push({
            description: description,
            severity: severity,
            timestamp: timestamp,
            childChannel: (child === null || child === void 0 ? void 0 : child.kind) === 'channel' ? child : undefined,
            childSubchannel: (child === null || child === void 0 ? void 0 : child.kind) === 'subchannel' ? child : undefined
        });
        // Whenever the trace array gets too large, discard the first half
        if (this.events.length >= TARGET_RETAINED_TRACES * 2) {
            this.events = this.events.slice(TARGET_RETAINED_TRACES);
        }
        this.eventsLogged += 1;
    }
    getTraceMessage() {
        return {
            creation_timestamp: dateToProtoTimestamp(this.creationTimestamp),
            num_events_logged: this.eventsLogged,
            events: this.events.map((event)=>{
                return {
                    description: event.description,
                    severity: event.severity,
                    timestamp: dateToProtoTimestamp(event.timestamp),
                    channel_ref: event.childChannel ? channelRefToMessage(event.childChannel) : null,
                    subchannel_ref: event.childSubchannel ? subchannelRefToMessage(event.childSubchannel) : null
                };
            })
        };
    }
}
exports.ChannelzTrace = ChannelzTrace;
class ChannelzChildrenTracker {
    constructor(){
        this.channelChildren = new Map();
        this.subchannelChildren = new Map();
        this.socketChildren = new Map();
    }
    refChild(child) {
        var _a, _b, _c;
        switch(child.kind){
            case 'channel':
                {
                    let trackedChild = (_a = this.channelChildren.get(child.id)) !== null && _a !== void 0 ? _a : {
                        ref: child,
                        count: 0
                    };
                    trackedChild.count += 1;
                    this.channelChildren.set(child.id, trackedChild);
                    break;
                }
            case 'subchannel':
                {
                    let trackedChild = (_b = this.subchannelChildren.get(child.id)) !== null && _b !== void 0 ? _b : {
                        ref: child,
                        count: 0
                    };
                    trackedChild.count += 1;
                    this.subchannelChildren.set(child.id, trackedChild);
                    break;
                }
            case 'socket':
                {
                    let trackedChild = (_c = this.socketChildren.get(child.id)) !== null && _c !== void 0 ? _c : {
                        ref: child,
                        count: 0
                    };
                    trackedChild.count += 1;
                    this.socketChildren.set(child.id, trackedChild);
                    break;
                }
        }
    }
    unrefChild(child) {
        switch(child.kind){
            case 'channel':
                {
                    let trackedChild = this.channelChildren.get(child.id);
                    if (trackedChild !== undefined) {
                        trackedChild.count -= 1;
                        if (trackedChild.count === 0) {
                            this.channelChildren.delete(child.id);
                        } else {
                            this.channelChildren.set(child.id, trackedChild);
                        }
                    }
                    break;
                }
            case 'subchannel':
                {
                    let trackedChild = this.subchannelChildren.get(child.id);
                    if (trackedChild !== undefined) {
                        trackedChild.count -= 1;
                        if (trackedChild.count === 0) {
                            this.subchannelChildren.delete(child.id);
                        } else {
                            this.subchannelChildren.set(child.id, trackedChild);
                        }
                    }
                    break;
                }
            case 'socket':
                {
                    let trackedChild = this.socketChildren.get(child.id);
                    if (trackedChild !== undefined) {
                        trackedChild.count -= 1;
                        if (trackedChild.count === 0) {
                            this.socketChildren.delete(child.id);
                        } else {
                            this.socketChildren.set(child.id, trackedChild);
                        }
                    }
                    break;
                }
        }
    }
    getChildLists() {
        const channels = [];
        for (const { ref } of this.channelChildren.values()){
            channels.push(ref);
        }
        const subchannels = [];
        for (const { ref } of this.subchannelChildren.values()){
            subchannels.push(ref);
        }
        const sockets = [];
        for (const { ref } of this.socketChildren.values()){
            sockets.push(ref);
        }
        return {
            channels,
            subchannels,
            sockets
        };
    }
}
exports.ChannelzChildrenTracker = ChannelzChildrenTracker;
class ChannelzCallTracker {
    constructor(){
        this.callsStarted = 0;
        this.callsSucceeded = 0;
        this.callsFailed = 0;
        this.lastCallStartedTimestamp = null;
    }
    addCallStarted() {
        this.callsStarted += 1;
        this.lastCallStartedTimestamp = new Date();
    }
    addCallSucceeded() {
        this.callsSucceeded += 1;
    }
    addCallFailed() {
        this.callsFailed += 1;
    }
}
exports.ChannelzCallTracker = ChannelzCallTracker;
let nextId = 1;
function getNextId() {
    return nextId++;
}
const channels = [];
const subchannels = [];
const servers = [];
const sockets = [];
function registerChannelzChannel(name, getInfo, channelzEnabled) {
    const id = getNextId();
    const ref = {
        id,
        name,
        kind: 'channel'
    };
    if (channelzEnabled) {
        channels[id] = {
            ref,
            getInfo
        };
    }
    return ref;
}
exports.registerChannelzChannel = registerChannelzChannel;
function registerChannelzSubchannel(name, getInfo, channelzEnabled) {
    const id = getNextId();
    const ref = {
        id,
        name,
        kind: 'subchannel'
    };
    if (channelzEnabled) {
        subchannels[id] = {
            ref,
            getInfo
        };
    }
    return ref;
}
exports.registerChannelzSubchannel = registerChannelzSubchannel;
function registerChannelzServer(getInfo, channelzEnabled) {
    const id = getNextId();
    const ref = {
        id,
        kind: 'server'
    };
    if (channelzEnabled) {
        servers[id] = {
            ref,
            getInfo
        };
    }
    return ref;
}
exports.registerChannelzServer = registerChannelzServer;
function registerChannelzSocket(name, getInfo, channelzEnabled) {
    const id = getNextId();
    const ref = {
        id,
        name,
        kind: 'socket'
    };
    if (channelzEnabled) {
        sockets[id] = {
            ref,
            getInfo
        };
    }
    return ref;
}
exports.registerChannelzSocket = registerChannelzSocket;
function unregisterChannelzRef(ref) {
    switch(ref.kind){
        case 'channel':
            delete channels[ref.id];
            return;
        case 'subchannel':
            delete subchannels[ref.id];
            return;
        case 'server':
            delete servers[ref.id];
            return;
        case 'socket':
            delete sockets[ref.id];
            return;
    }
}
exports.unregisterChannelzRef = unregisterChannelzRef;
/**
 * Parse a single section of an IPv6 address as two bytes
 * @param addressSection A hexadecimal string of length up to 4
 * @returns The pair of bytes representing this address section
 */ function parseIPv6Section(addressSection) {
    const numberValue = Number.parseInt(addressSection, 16);
    return [
        numberValue / 256 | 0,
        numberValue % 256
    ];
}
/**
 * Parse a chunk of an IPv6 address string to some number of bytes
 * @param addressChunk Some number of segments of up to 4 hexadecimal
 *   characters each, joined by colons.
 * @returns The list of bytes representing this address chunk
 */ function parseIPv6Chunk(addressChunk) {
    if (addressChunk === '') {
        return [];
    }
    const bytePairs = addressChunk.split(':').map((section)=>parseIPv6Section(section));
    const result = [];
    return result.concat(...bytePairs);
}
/**
 * Converts an IPv4 or IPv6 address from string representation to binary
 * representation
 * @param ipAddress an IP address in standard IPv4 or IPv6 text format
 * @returns
 */ function ipAddressStringToBuffer(ipAddress) {
    if (net_1.isIPv4(ipAddress)) {
        return Buffer.from(Uint8Array.from(ipAddress.split('.').map((segment)=>Number.parseInt(segment))));
    } else if (net_1.isIPv6(ipAddress)) {
        let leftSection;
        let rightSection;
        const doubleColonIndex = ipAddress.indexOf('::');
        if (doubleColonIndex === -1) {
            leftSection = ipAddress;
            rightSection = '';
        } else {
            leftSection = ipAddress.substring(0, doubleColonIndex);
            rightSection = ipAddress.substring(doubleColonIndex + 2);
        }
        const leftBuffer = Buffer.from(parseIPv6Chunk(leftSection));
        const rightBuffer = Buffer.from(parseIPv6Chunk(rightSection));
        const middleBuffer = Buffer.alloc(16 - leftBuffer.length - rightBuffer.length, 0);
        return Buffer.concat([
            leftBuffer,
            middleBuffer,
            rightBuffer
        ]);
    } else {
        return null;
    }
}
function connectivityStateToMessage(state) {
    switch(state){
        case connectivity_state_1.ConnectivityState.CONNECTING:
            return {
                state: 'CONNECTING'
            };
        case connectivity_state_1.ConnectivityState.IDLE:
            return {
                state: 'IDLE'
            };
        case connectivity_state_1.ConnectivityState.READY:
            return {
                state: 'READY'
            };
        case connectivity_state_1.ConnectivityState.SHUTDOWN:
            return {
                state: 'SHUTDOWN'
            };
        case connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE:
            return {
                state: 'TRANSIENT_FAILURE'
            };
        default:
            return {
                state: 'UNKNOWN'
            };
    }
}
function dateToProtoTimestamp(date) {
    if (!date) {
        return null;
    }
    const millisSinceEpoch = date.getTime();
    return {
        seconds: millisSinceEpoch / 1000 | 0,
        nanos: millisSinceEpoch % 1000 * 1000000
    };
}
function getChannelMessage(channelEntry) {
    const resolvedInfo = channelEntry.getInfo();
    return {
        ref: channelRefToMessage(channelEntry.ref),
        data: {
            target: resolvedInfo.target,
            state: connectivityStateToMessage(resolvedInfo.state),
            calls_started: resolvedInfo.callTracker.callsStarted,
            calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
            calls_failed: resolvedInfo.callTracker.callsFailed,
            last_call_started_timestamp: dateToProtoTimestamp(resolvedInfo.callTracker.lastCallStartedTimestamp),
            trace: resolvedInfo.trace.getTraceMessage()
        },
        channel_ref: resolvedInfo.children.channels.map((ref)=>channelRefToMessage(ref)),
        subchannel_ref: resolvedInfo.children.subchannels.map((ref)=>subchannelRefToMessage(ref))
    };
}
function GetChannel(call, callback) {
    const channelId = Number.parseInt(call.request.channel_id);
    const channelEntry = channels[channelId];
    if (channelEntry === undefined) {
        callback({
            'code': constants_1.Status.NOT_FOUND,
            'details': 'No channel data found for id ' + channelId
        });
        return;
    }
    callback(null, {
        channel: getChannelMessage(channelEntry)
    });
}
function GetTopChannels(call, callback) {
    const maxResults = Number.parseInt(call.request.max_results);
    const resultList = [];
    let i = Number.parseInt(call.request.start_channel_id);
    for(; i < channels.length; i++){
        const channelEntry = channels[i];
        if (channelEntry === undefined) {
            continue;
        }
        resultList.push(getChannelMessage(channelEntry));
        if (resultList.length >= maxResults) {
            break;
        }
    }
    callback(null, {
        channel: resultList,
        end: i >= servers.length
    });
}
function getServerMessage(serverEntry) {
    const resolvedInfo = serverEntry.getInfo();
    return {
        ref: serverRefToMessage(serverEntry.ref),
        data: {
            calls_started: resolvedInfo.callTracker.callsStarted,
            calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
            calls_failed: resolvedInfo.callTracker.callsFailed,
            last_call_started_timestamp: dateToProtoTimestamp(resolvedInfo.callTracker.lastCallStartedTimestamp),
            trace: resolvedInfo.trace.getTraceMessage()
        },
        listen_socket: resolvedInfo.listenerChildren.sockets.map((ref)=>socketRefToMessage(ref))
    };
}
function GetServer(call, callback) {
    const serverId = Number.parseInt(call.request.server_id);
    const serverEntry = servers[serverId];
    if (serverEntry === undefined) {
        callback({
            'code': constants_1.Status.NOT_FOUND,
            'details': 'No server data found for id ' + serverId
        });
        return;
    }
    callback(null, {
        server: getServerMessage(serverEntry)
    });
}
function GetServers(call, callback) {
    const maxResults = Number.parseInt(call.request.max_results);
    const resultList = [];
    let i = Number.parseInt(call.request.start_server_id);
    for(; i < servers.length; i++){
        const serverEntry = servers[i];
        if (serverEntry === undefined) {
            continue;
        }
        resultList.push(getServerMessage(serverEntry));
        if (resultList.length >= maxResults) {
            break;
        }
    }
    callback(null, {
        server: resultList,
        end: i >= servers.length
    });
}
function GetSubchannel(call, callback) {
    const subchannelId = Number.parseInt(call.request.subchannel_id);
    const subchannelEntry = subchannels[subchannelId];
    if (subchannelEntry === undefined) {
        callback({
            'code': constants_1.Status.NOT_FOUND,
            'details': 'No subchannel data found for id ' + subchannelId
        });
        return;
    }
    const resolvedInfo = subchannelEntry.getInfo();
    const subchannelMessage = {
        ref: subchannelRefToMessage(subchannelEntry.ref),
        data: {
            target: resolvedInfo.target,
            state: connectivityStateToMessage(resolvedInfo.state),
            calls_started: resolvedInfo.callTracker.callsStarted,
            calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
            calls_failed: resolvedInfo.callTracker.callsFailed,
            last_call_started_timestamp: dateToProtoTimestamp(resolvedInfo.callTracker.lastCallStartedTimestamp),
            trace: resolvedInfo.trace.getTraceMessage()
        },
        socket_ref: resolvedInfo.children.sockets.map((ref)=>socketRefToMessage(ref))
    };
    callback(null, {
        subchannel: subchannelMessage
    });
}
function subchannelAddressToAddressMessage(subchannelAddress) {
    var _a;
    if (subchannel_address_1.isTcpSubchannelAddress(subchannelAddress)) {
        return {
            address: 'tcpip_address',
            tcpip_address: {
                ip_address: (_a = ipAddressStringToBuffer(subchannelAddress.host)) !== null && _a !== void 0 ? _a : undefined,
                port: subchannelAddress.port
            }
        };
    } else {
        return {
            address: 'uds_address',
            uds_address: {
                filename: subchannelAddress.path
            }
        };
    }
}
function GetSocket(call, callback) {
    var _a, _b, _c, _d, _e;
    const socketId = Number.parseInt(call.request.socket_id);
    const socketEntry = sockets[socketId];
    if (socketEntry === undefined) {
        callback({
            'code': constants_1.Status.NOT_FOUND,
            'details': 'No socket data found for id ' + socketId
        });
        return;
    }
    const resolvedInfo = socketEntry.getInfo();
    const securityMessage = resolvedInfo.security ? {
        model: 'tls',
        tls: {
            cipher_suite: resolvedInfo.security.cipherSuiteStandardName ? 'standard_name' : 'other_name',
            standard_name: (_a = resolvedInfo.security.cipherSuiteStandardName) !== null && _a !== void 0 ? _a : undefined,
            other_name: (_b = resolvedInfo.security.cipherSuiteOtherName) !== null && _b !== void 0 ? _b : undefined,
            local_certificate: (_c = resolvedInfo.security.localCertificate) !== null && _c !== void 0 ? _c : undefined,
            remote_certificate: (_d = resolvedInfo.security.remoteCertificate) !== null && _d !== void 0 ? _d : undefined
        }
    } : null;
    const socketMessage = {
        ref: socketRefToMessage(socketEntry.ref),
        local: resolvedInfo.localAddress ? subchannelAddressToAddressMessage(resolvedInfo.localAddress) : null,
        remote: resolvedInfo.remoteAddress ? subchannelAddressToAddressMessage(resolvedInfo.remoteAddress) : null,
        remote_name: (_e = resolvedInfo.remoteName) !== null && _e !== void 0 ? _e : undefined,
        security: securityMessage,
        data: {
            keep_alives_sent: resolvedInfo.keepAlivesSent,
            streams_started: resolvedInfo.streamsStarted,
            streams_succeeded: resolvedInfo.streamsSucceeded,
            streams_failed: resolvedInfo.streamsFailed,
            last_local_stream_created_timestamp: dateToProtoTimestamp(resolvedInfo.lastLocalStreamCreatedTimestamp),
            last_remote_stream_created_timestamp: dateToProtoTimestamp(resolvedInfo.lastRemoteStreamCreatedTimestamp),
            messages_received: resolvedInfo.messagesReceived,
            messages_sent: resolvedInfo.messagesSent,
            last_message_received_timestamp: dateToProtoTimestamp(resolvedInfo.lastMessageReceivedTimestamp),
            last_message_sent_timestamp: dateToProtoTimestamp(resolvedInfo.lastMessageSentTimestamp),
            local_flow_control_window: resolvedInfo.localFlowControlWindow ? {
                value: resolvedInfo.localFlowControlWindow
            } : null,
            remote_flow_control_window: resolvedInfo.remoteFlowControlWindow ? {
                value: resolvedInfo.remoteFlowControlWindow
            } : null
        }
    };
    callback(null, {
        socket: socketMessage
    });
}
function GetServerSockets(call, callback) {
    const serverId = Number.parseInt(call.request.server_id);
    const serverEntry = servers[serverId];
    if (serverEntry === undefined) {
        callback({
            'code': constants_1.Status.NOT_FOUND,
            'details': 'No server data found for id ' + serverId
        });
        return;
    }
    const startId = Number.parseInt(call.request.start_socket_id);
    const maxResults = Number.parseInt(call.request.max_results);
    const resolvedInfo = serverEntry.getInfo();
    // If we wanted to include listener sockets in the result, this line would
    // instead say
    // const allSockets = resolvedInfo.listenerChildren.sockets.concat(resolvedInfo.sessionChildren.sockets).sort((ref1, ref2) => ref1.id - ref2.id);
    const allSockets = resolvedInfo.sessionChildren.sockets.sort((ref1, ref2)=>ref1.id - ref2.id);
    const resultList = [];
    let i = 0;
    for(; i < allSockets.length; i++){
        if (allSockets[i].id >= startId) {
            resultList.push(socketRefToMessage(allSockets[i]));
            if (resultList.length >= maxResults) {
                break;
            }
        }
    }
    callback(null, {
        socket_ref: resultList,
        end: i >= allSockets.length
    });
}
function getChannelzHandlers() {
    return {
        GetChannel,
        GetTopChannels,
        GetServer,
        GetServers,
        GetSubchannel,
        GetSocket,
        GetServerSockets
    };
}
exports.getChannelzHandlers = getChannelzHandlers;
let loadedChannelzDefinition = null;
function getChannelzServiceDefinition() {
    if (loadedChannelzDefinition) {
        return loadedChannelzDefinition;
    }
    /* The purpose of this complexity is to avoid loading @grpc/proto-loader at
     * runtime for users who will not use/enable channelz. */ const loaderLoadSync = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/node_modules/@grpc/proto-loader/build/src/index.js [app-ssr] (ecmascript)").loadSync;
    const loadedProto = loaderLoadSync('channelz.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [
            `${__dirname}/../../proto`
        ]
    });
    const channelzGrpcObject = make_client_1.loadPackageDefinition(loadedProto);
    loadedChannelzDefinition = channelzGrpcObject.grpc.channelz.v1.Channelz.service;
    return loadedChannelzDefinition;
}
exports.getChannelzServiceDefinition = getChannelzServiceDefinition;
function setup() {
    admin_1.registerAdminService(getChannelzServiceDefinition, getChannelzHandlers);
}
exports.setup = setup; //# sourceMappingURL=channelz.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/package.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"name\":\"@grpc/grpc-js\",\"version\":\"1.7.3\",\"description\":\"gRPC Library for Node - pure JS implementation\",\"homepage\":\"https://grpc.io/\",\"repository\":\"https://github.com/grpc/grpc-node/tree/master/packages/grpc-js\",\"main\":\"build/src/index.js\",\"engines\":{\"node\":\"^8.13.0 || >=10.10.0\"},\"keywords\":[],\"author\":{\"name\":\"Google Inc.\"},\"types\":\"build/src/index.d.ts\",\"license\":\"Apache-2.0\",\"devDependencies\":{\"@types/gulp\":\"^4.0.6\",\"@types/gulp-mocha\":\"0.0.32\",\"@types/lodash\":\"^4.14.108\",\"@types/mocha\":\"^5.2.6\",\"@types/ncp\":\"^2.0.1\",\"@types/pify\":\"^3.0.2\",\"@types/semver\":\"^7.3.9\",\"clang-format\":\"^1.0.55\",\"execa\":\"^2.0.3\",\"gts\":\"^2.0.0\",\"gulp\":\"^4.0.2\",\"gulp-mocha\":\"^6.0.0\",\"lodash\":\"^4.17.4\",\"madge\":\"^5.0.1\",\"mocha-jenkins-reporter\":\"^0.4.1\",\"ncp\":\"^2.0.0\",\"pify\":\"^4.0.1\",\"rimraf\":\"^3.0.2\",\"semver\":\"^7.3.5\",\"ts-node\":\"^8.3.0\",\"typescript\":\"^3.7.2\"},\"contributors\":[{\"name\":\"Google Inc.\"}],\"scripts\":{\"build\":\"npm run compile\",\"clean\":\"rimraf ./build\",\"compile\":\"tsc -p .\",\"format\":\"clang-format -i -style=\\\"{Language: JavaScript, BasedOnStyle: Google, ColumnLimit: 80}\\\" src/*.ts test/*.ts\",\"lint\":\"npm run check\",\"prepare\":\"npm run generate-types && npm run compile\",\"test\":\"gulp test\",\"check\":\"gts check src/**/*.ts\",\"fix\":\"gts fix src/*.ts\",\"pretest\":\"npm run generate-types && npm run generate-test-types && npm run compile\",\"posttest\":\"npm run check && madge -c ./build/src\",\"generate-types\":\"proto-loader-gen-types --keepCase --longs String --enums String --defaults --oneofs --includeComments --includeDirs proto/ --include-dirs test/fixtures/ -O src/generated/ --grpcLib ../index channelz.proto\",\"generate-test-types\":\"proto-loader-gen-types --keepCase --longs String --enums String --defaults --oneofs --includeComments --include-dirs test/fixtures/ -O test/generated/ --grpcLib ../../src/index test_service.proto\"},\"dependencies\":{\"@grpc/proto-loader\":\"^0.7.0\",\"@types/node\":\">=12.12.47\"},\"files\":[\"src/**/*.ts\",\"build/src/**/*.{js,d.ts,js.map}\",\"proto/*.proto\",\"LICENSE\",\"deps/envoy-api/envoy/api/v2/**/*.proto\",\"deps/envoy-api/envoy/config/**/*.proto\",\"deps/envoy-api/envoy/service/**/*.proto\",\"deps/envoy-api/envoy/type/**/*.proto\",\"deps/udpa/udpa/**/*.proto\",\"deps/googleapis/google/api/*.proto\",\"deps/googleapis/google/rpc/*.proto\",\"deps/protoc-gen-validate/validate/**/*.proto\"]}"));}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Subchannel = void 0;
const http2 = __turbopack_context__.r("[externals]/http2 [external] (http2, cjs)");
const tls_1 = __turbopack_context__.r("[externals]/tls [external] (tls, cjs)");
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const backoff_timeout_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/backoff-timeout.js [app-ssr] (ecmascript)");
const resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const http_proxy_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/http_proxy.js [app-ssr] (ecmascript)");
const net = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
const subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
const channelz_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channelz.js [app-ssr] (ecmascript)");
const clientVersion = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/package.json (json)").version;
const TRACER_NAME = 'subchannel';
const FLOW_CONTROL_TRACER_NAME = 'subchannel_flowctrl';
const MIN_CONNECT_TIMEOUT_MS = 20000;
const INITIAL_BACKOFF_MS = 1000;
const BACKOFF_MULTIPLIER = 1.6;
const MAX_BACKOFF_MS = 120000;
const BACKOFF_JITTER = 0.2;
/* setInterval and setTimeout only accept signed 32 bit integers. JS doesn't
 * have a constant for the max signed 32 bit integer, so this is a simple way
 * to calculate it */ const KEEPALIVE_MAX_TIME_MS = ~(1 << 31);
const KEEPALIVE_TIMEOUT_MS = 20000;
const { HTTP2_HEADER_AUTHORITY, HTTP2_HEADER_CONTENT_TYPE, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_TE, HTTP2_HEADER_USER_AGENT } = http2.constants;
/**
 * Get a number uniformly at random in the range [min, max)
 * @param min
 * @param max
 */ function uniformRandom(min, max) {
    return Math.random() * (max - min) + min;
}
const tooManyPingsData = Buffer.from('too_many_pings', 'ascii');
class Subchannel {
    /**
     * A class representing a connection to a single backend.
     * @param channelTarget The target string for the channel as a whole
     * @param subchannelAddress The address for the backend that this subchannel
     *     will connect to
     * @param options The channel options, plus any specific subchannel options
     *     for this subchannel
     * @param credentials The channel credentials used to establish this
     *     connection
     */ constructor(channelTarget, subchannelAddress, options, credentials){
        this.channelTarget = channelTarget;
        this.subchannelAddress = subchannelAddress;
        this.options = options;
        this.credentials = credentials;
        /**
         * The subchannel's current connectivity state. Invariant: `session` === `null`
         * if and only if `connectivityState` is IDLE or TRANSIENT_FAILURE.
         */ this.connectivityState = connectivity_state_1.ConnectivityState.IDLE;
        /**
         * The underlying http2 session used to make requests.
         */ this.session = null;
        /**
         * Indicates that the subchannel should transition from TRANSIENT_FAILURE to
         * CONNECTING instead of IDLE when the backoff timeout ends.
         */ this.continueConnecting = false;
        /**
         * A list of listener functions that will be called whenever the connectivity
         * state changes. Will be modified by `addConnectivityStateListener` and
         * `removeConnectivityStateListener`
         */ this.stateListeners = [];
        /**
         * A list of listener functions that will be called when the underlying
         * socket disconnects. Used for ending active calls with an UNAVAILABLE
         * status.
         */ this.disconnectListeners = new Set();
        /**
         * The amount of time in between sending pings
         */ this.keepaliveTimeMs = KEEPALIVE_MAX_TIME_MS;
        /**
         * The amount of time to wait for an acknowledgement after sending a ping
         */ this.keepaliveTimeoutMs = KEEPALIVE_TIMEOUT_MS;
        /**
         * Indicates whether keepalive pings should be sent without any active calls
         */ this.keepaliveWithoutCalls = false;
        /**
         * Tracks calls with references to this subchannel
         */ this.callRefcount = 0;
        /**
         * Tracks channels and subchannel pools with references to this subchannel
         */ this.refcount = 0;
        // Channelz info
        this.channelzEnabled = true;
        this.callTracker = new channelz_1.ChannelzCallTracker();
        this.childrenTracker = new channelz_1.ChannelzChildrenTracker();
        // Channelz socket info
        this.channelzSocketRef = null;
        /**
         * Name of the remote server, if it is not the same as the subchannel
         * address, i.e. if connecting through an HTTP CONNECT proxy.
         */ this.remoteName = null;
        this.streamTracker = new channelz_1.ChannelzCallTracker();
        this.keepalivesSent = 0;
        this.messagesSent = 0;
        this.messagesReceived = 0;
        this.lastMessageSentTimestamp = null;
        this.lastMessageReceivedTimestamp = null;
        // Build user-agent string.
        this.userAgent = [
            options['grpc.primary_user_agent'],
            `grpc-node-js/${clientVersion}`,
            options['grpc.secondary_user_agent']
        ].filter((e)=>e).join(' '); // remove falsey values first
        if ('grpc.keepalive_time_ms' in options) {
            this.keepaliveTimeMs = options['grpc.keepalive_time_ms'];
        }
        if ('grpc.keepalive_timeout_ms' in options) {
            this.keepaliveTimeoutMs = options['grpc.keepalive_timeout_ms'];
        }
        if ('grpc.keepalive_permit_without_calls' in options) {
            this.keepaliveWithoutCalls = options['grpc.keepalive_permit_without_calls'] === 1;
        } else {
            this.keepaliveWithoutCalls = false;
        }
        this.keepaliveIntervalId = setTimeout(()=>{}, 0);
        clearTimeout(this.keepaliveIntervalId);
        this.keepaliveTimeoutId = setTimeout(()=>{}, 0);
        clearTimeout(this.keepaliveTimeoutId);
        const backoffOptions = {
            initialDelay: options['grpc.initial_reconnect_backoff_ms'],
            maxDelay: options['grpc.max_reconnect_backoff_ms']
        };
        this.backoffTimeout = new backoff_timeout_1.BackoffTimeout(()=>{
            this.handleBackoffTimer();
        }, backoffOptions);
        this.subchannelAddressString = subchannel_address_1.subchannelAddressToString(subchannelAddress);
        if (options['grpc.enable_channelz'] === 0) {
            this.channelzEnabled = false;
        }
        this.channelzTrace = new channelz_1.ChannelzTrace();
        this.channelzRef = channelz_1.registerChannelzSubchannel(this.subchannelAddressString, ()=>this.getChannelzInfo(), this.channelzEnabled);
        if (this.channelzEnabled) {
            this.channelzTrace.addTrace('CT_INFO', 'Subchannel created');
        }
        this.trace('Subchannel constructed with options ' + JSON.stringify(options, undefined, 2));
    }
    getChannelzInfo() {
        return {
            state: this.connectivityState,
            trace: this.channelzTrace,
            callTracker: this.callTracker,
            children: this.childrenTracker.getChildLists(),
            target: this.subchannelAddressString
        };
    }
    getChannelzSocketInfo() {
        var _a, _b, _c;
        if (this.session === null) {
            return null;
        }
        const sessionSocket = this.session.socket;
        const remoteAddress = sessionSocket.remoteAddress ? subchannel_address_1.stringToSubchannelAddress(sessionSocket.remoteAddress, sessionSocket.remotePort) : null;
        const localAddress = sessionSocket.localAddress ? subchannel_address_1.stringToSubchannelAddress(sessionSocket.localAddress, sessionSocket.localPort) : null;
        let tlsInfo;
        if (this.session.encrypted) {
            const tlsSocket = sessionSocket;
            const cipherInfo = tlsSocket.getCipher();
            const certificate = tlsSocket.getCertificate();
            const peerCertificate = tlsSocket.getPeerCertificate();
            tlsInfo = {
                cipherSuiteStandardName: (_a = cipherInfo.standardName) !== null && _a !== void 0 ? _a : null,
                cipherSuiteOtherName: cipherInfo.standardName ? null : cipherInfo.name,
                localCertificate: certificate && 'raw' in certificate ? certificate.raw : null,
                remoteCertificate: peerCertificate && 'raw' in peerCertificate ? peerCertificate.raw : null
            };
        } else {
            tlsInfo = null;
        }
        const socketInfo = {
            remoteAddress: remoteAddress,
            localAddress: localAddress,
            security: tlsInfo,
            remoteName: this.remoteName,
            streamsStarted: this.streamTracker.callsStarted,
            streamsSucceeded: this.streamTracker.callsSucceeded,
            streamsFailed: this.streamTracker.callsFailed,
            messagesSent: this.messagesSent,
            messagesReceived: this.messagesReceived,
            keepAlivesSent: this.keepalivesSent,
            lastLocalStreamCreatedTimestamp: this.streamTracker.lastCallStartedTimestamp,
            lastRemoteStreamCreatedTimestamp: null,
            lastMessageSentTimestamp: this.lastMessageSentTimestamp,
            lastMessageReceivedTimestamp: this.lastMessageReceivedTimestamp,
            localFlowControlWindow: (_b = this.session.state.localWindowSize) !== null && _b !== void 0 ? _b : null,
            remoteFlowControlWindow: (_c = this.session.state.remoteWindowSize) !== null && _c !== void 0 ? _c : null
        };
        return socketInfo;
    }
    resetChannelzSocketInfo() {
        if (!this.channelzEnabled) {
            return;
        }
        if (this.channelzSocketRef) {
            channelz_1.unregisterChannelzRef(this.channelzSocketRef);
            this.childrenTracker.unrefChild(this.channelzSocketRef);
            this.channelzSocketRef = null;
        }
        this.remoteName = null;
        this.streamTracker = new channelz_1.ChannelzCallTracker();
        this.keepalivesSent = 0;
        this.messagesSent = 0;
        this.messagesReceived = 0;
        this.lastMessageSentTimestamp = null;
        this.lastMessageReceivedTimestamp = null;
    }
    trace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, '(' + this.channelzRef.id + ') ' + this.subchannelAddressString + ' ' + text);
    }
    refTrace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, 'subchannel_refcount', '(' + this.channelzRef.id + ') ' + this.subchannelAddressString + ' ' + text);
    }
    flowControlTrace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, FLOW_CONTROL_TRACER_NAME, '(' + this.channelzRef.id + ') ' + this.subchannelAddressString + ' ' + text);
    }
    internalsTrace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, 'subchannel_internals', '(' + this.channelzRef.id + ') ' + this.subchannelAddressString + ' ' + text);
    }
    keepaliveTrace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, 'keepalive', '(' + this.channelzRef.id + ') ' + this.subchannelAddressString + ' ' + text);
    }
    handleBackoffTimer() {
        if (this.continueConnecting) {
            this.transitionToState([
                connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE
            ], connectivity_state_1.ConnectivityState.CONNECTING);
        } else {
            this.transitionToState([
                connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE
            ], connectivity_state_1.ConnectivityState.IDLE);
        }
    }
    /**
     * Start a backoff timer with the current nextBackoff timeout
     */ startBackoff() {
        this.backoffTimeout.runOnce();
    }
    stopBackoff() {
        this.backoffTimeout.stop();
        this.backoffTimeout.reset();
    }
    sendPing() {
        var _a, _b;
        if (this.channelzEnabled) {
            this.keepalivesSent += 1;
        }
        this.keepaliveTrace('Sending ping with timeout ' + this.keepaliveTimeoutMs + 'ms');
        this.keepaliveTimeoutId = setTimeout(()=>{
            this.keepaliveTrace('Ping timeout passed without response');
            this.handleDisconnect();
        }, this.keepaliveTimeoutMs);
        (_b = (_a = this.keepaliveTimeoutId).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        try {
            this.session.ping((err, duration, payload)=>{
                this.keepaliveTrace('Received ping response');
                clearTimeout(this.keepaliveTimeoutId);
            });
        } catch (e) {
            /* If we fail to send a ping, the connection is no longer functional, so
             * we should discard it. */ this.transitionToState([
                connectivity_state_1.ConnectivityState.READY
            ], connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE);
        }
    }
    startKeepalivePings() {
        var _a, _b;
        this.keepaliveIntervalId = setInterval(()=>{
            this.sendPing();
        }, this.keepaliveTimeMs);
        (_b = (_a = this.keepaliveIntervalId).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
    /* Don't send a ping immediately because whatever caused us to start
         * sending pings should also involve some network activity. */ }
    /**
     * Stop keepalive pings when terminating a connection. This discards the
     * outstanding ping timeout, so it should not be called if the same
     * connection will still be used.
     */ stopKeepalivePings() {
        clearInterval(this.keepaliveIntervalId);
        clearTimeout(this.keepaliveTimeoutId);
    }
    createSession(proxyConnectionResult) {
        var _a, _b, _c;
        if (proxyConnectionResult.realTarget) {
            this.remoteName = uri_parser_1.uriToString(proxyConnectionResult.realTarget);
            this.trace('creating HTTP/2 session through proxy to ' + proxyConnectionResult.realTarget);
        } else {
            this.remoteName = null;
            this.trace('creating HTTP/2 session');
        }
        const targetAuthority = resolver_1.getDefaultAuthority((_a = proxyConnectionResult.realTarget) !== null && _a !== void 0 ? _a : this.channelTarget);
        let connectionOptions = this.credentials._getConnectionOptions() || {};
        connectionOptions.maxSendHeaderBlockLength = Number.MAX_SAFE_INTEGER;
        if ('grpc-node.max_session_memory' in this.options) {
            connectionOptions.maxSessionMemory = this.options['grpc-node.max_session_memory'];
        } else {
            /* By default, set a very large max session memory limit, to effectively
             * disable enforcement of the limit. Some testing indicates that Node's
             * behavior degrades badly when this limit is reached, so we solve that
             * by disabling the check entirely. */ connectionOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
        }
        let addressScheme = 'http://';
        if ('secureContext' in connectionOptions) {
            addressScheme = 'https://';
            // If provided, the value of grpc.ssl_target_name_override should be used
            // to override the target hostname when checking server identity.
            // This option is used for testing only.
            if (this.options['grpc.ssl_target_name_override']) {
                const sslTargetNameOverride = this.options['grpc.ssl_target_name_override'];
                connectionOptions.checkServerIdentity = (host, cert)=>{
                    return tls_1.checkServerIdentity(sslTargetNameOverride, cert);
                };
                connectionOptions.servername = sslTargetNameOverride;
            } else {
                const authorityHostname = (_c = (_b = uri_parser_1.splitHostPort(targetAuthority)) === null || _b === void 0 ? void 0 : _b.host) !== null && _c !== void 0 ? _c : 'localhost';
                // We want to always set servername to support SNI
                connectionOptions.servername = authorityHostname;
            }
            if (proxyConnectionResult.socket) {
                /* This is part of the workaround for
                 * https://github.com/nodejs/node/issues/32922. Without that bug,
                 * proxyConnectionResult.socket would always be a plaintext socket and
                 * this would say
                 * connectionOptions.socket = proxyConnectionResult.socket; */ connectionOptions.createConnection = (authority, option)=>{
                    return proxyConnectionResult.socket;
                };
            }
        } else {
            /* In all but the most recent versions of Node, http2.connect does not use
             * the options when establishing plaintext connections, so we need to
             * establish that connection explicitly. */ connectionOptions.createConnection = (authority, option)=>{
                if (proxyConnectionResult.socket) {
                    return proxyConnectionResult.socket;
                } else {
                    /* net.NetConnectOpts is declared in a way that is more restrictive
                     * than what net.connect will actually accept, so we use the type
                     * assertion to work around that. */ return net.connect(this.subchannelAddress);
                }
            };
        }
        connectionOptions = Object.assign(Object.assign({}, connectionOptions), this.subchannelAddress);
        /* http2.connect uses the options here:
         * https://github.com/nodejs/node/blob/70c32a6d190e2b5d7b9ff9d5b6a459d14e8b7d59/lib/internal/http2/core.js#L3028-L3036
         * The spread operator overides earlier values with later ones, so any port
         * or host values in the options will be used rather than any values extracted
         * from the first argument. In addition, the path overrides the host and port,
         * as documented for plaintext connections here:
         * https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener
         * and for TLS connections here:
         * https://nodejs.org/api/tls.html#tls_tls_connect_options_callback. In
         * earlier versions of Node, http2.connect passes these options to
         * tls.connect but not net.connect, so in the insecure case we still need
         * to set the createConnection option above to create the connection
         * explicitly. We cannot do that in the TLS case because http2.connect
         * passes necessary additional options to tls.connect.
         * The first argument just needs to be parseable as a URL and the scheme
         * determines whether the connection will be established over TLS or not.
         */ const session = http2.connect(addressScheme + targetAuthority, connectionOptions);
        this.session = session;
        this.channelzSocketRef = channelz_1.registerChannelzSocket(this.subchannelAddressString, ()=>this.getChannelzSocketInfo(), this.channelzEnabled);
        if (this.channelzEnabled) {
            this.childrenTracker.refChild(this.channelzSocketRef);
        }
        session.unref();
        /* For all of these events, check if the session at the time of the event
         * is the same one currently attached to this subchannel, to ensure that
         * old events from previous connection attempts cannot cause invalid state
         * transitions. */ session.once('connect', ()=>{
            if (this.session === session) {
                this.transitionToState([
                    connectivity_state_1.ConnectivityState.CONNECTING
                ], connectivity_state_1.ConnectivityState.READY);
            }
        });
        session.once('close', ()=>{
            if (this.session === session) {
                this.trace('connection closed');
                this.transitionToState([
                    connectivity_state_1.ConnectivityState.CONNECTING
                ], connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE);
                /* Transitioning directly to IDLE here should be OK because we are not
                 * doing any backoff, because a connection was established at some
                 * point */ this.transitionToState([
                    connectivity_state_1.ConnectivityState.READY
                ], connectivity_state_1.ConnectivityState.IDLE);
            }
        });
        session.once('goaway', (errorCode, lastStreamID, opaqueData)=>{
            if (this.session === session) {
                /* See the last paragraph of
                 * https://github.com/grpc/proposal/blob/master/A8-client-side-keepalive.md#basic-keepalive */ if (errorCode === http2.constants.NGHTTP2_ENHANCE_YOUR_CALM && opaqueData.equals(tooManyPingsData)) {
                    this.keepaliveTimeMs = Math.min(2 * this.keepaliveTimeMs, KEEPALIVE_MAX_TIME_MS);
                    logging.log(constants_1.LogVerbosity.ERROR, `Connection to ${uri_parser_1.uriToString(this.channelTarget)} at ${this.subchannelAddressString} rejected by server because of excess pings. Increasing ping interval to ${this.keepaliveTimeMs} ms`);
                }
                this.trace('connection closed by GOAWAY with code ' + errorCode);
                this.transitionToState([
                    connectivity_state_1.ConnectivityState.CONNECTING,
                    connectivity_state_1.ConnectivityState.READY
                ], connectivity_state_1.ConnectivityState.IDLE);
            }
        });
        session.once('error', (error)=>{
            /* Do nothing here. Any error should also trigger a close event, which is
             * where we want to handle that.  */ this.trace('connection closed with error ' + error.message);
        });
        if (logging.isTracerEnabled(TRACER_NAME)) {
            session.on('remoteSettings', (settings)=>{
                this.trace('new settings received' + (this.session !== session ? ' on the old connection' : '') + ': ' + JSON.stringify(settings));
            });
            session.on('localSettings', (settings)=>{
                this.trace('local settings acknowledged by remote' + (this.session !== session ? ' on the old connection' : '') + ': ' + JSON.stringify(settings));
            });
        }
    }
    startConnectingInternal() {
        var _a, _b;
        /* Pass connection options through to the proxy so that it's able to
         * upgrade it's connection to support tls if needed.
         * This is a workaround for https://github.com/nodejs/node/issues/32922
         * See https://github.com/grpc/grpc-node/pull/1369 for more info. */ const connectionOptions = this.credentials._getConnectionOptions() || {};
        if ('secureContext' in connectionOptions) {
            connectionOptions.ALPNProtocols = [
                'h2'
            ];
            // If provided, the value of grpc.ssl_target_name_override should be used
            // to override the target hostname when checking server identity.
            // This option is used for testing only.
            if (this.options['grpc.ssl_target_name_override']) {
                const sslTargetNameOverride = this.options['grpc.ssl_target_name_override'];
                connectionOptions.checkServerIdentity = (host, cert)=>{
                    return tls_1.checkServerIdentity(sslTargetNameOverride, cert);
                };
                connectionOptions.servername = sslTargetNameOverride;
            } else {
                if ('grpc.http_connect_target' in this.options) {
                    /* This is more or less how servername will be set in createSession
                     * if a connection is successfully established through the proxy.
                     * If the proxy is not used, these connectionOptions are discarded
                     * anyway */ const targetPath = resolver_1.getDefaultAuthority((_a = uri_parser_1.parseUri(this.options['grpc.http_connect_target'])) !== null && _a !== void 0 ? _a : {
                        path: 'localhost'
                    });
                    const hostPort = uri_parser_1.splitHostPort(targetPath);
                    connectionOptions.servername = (_b = hostPort === null || hostPort === void 0 ? void 0 : hostPort.host) !== null && _b !== void 0 ? _b : targetPath;
                }
            }
        }
        http_proxy_1.getProxiedConnection(this.subchannelAddress, this.options, connectionOptions).then((result)=>{
            this.createSession(result);
        }, (reason)=>{
            this.transitionToState([
                connectivity_state_1.ConnectivityState.CONNECTING
            ], connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE);
        });
    }
    handleDisconnect() {
        this.transitionToState([
            connectivity_state_1.ConnectivityState.READY
        ], connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE);
        for (const listener of this.disconnectListeners.values()){
            listener();
        }
    }
    /**
     * Initiate a state transition from any element of oldStates to the new
     * state. If the current connectivityState is not in oldStates, do nothing.
     * @param oldStates The set of states to transition from
     * @param newState The state to transition to
     * @returns True if the state changed, false otherwise
     */ transitionToState(oldStates, newState) {
        if (oldStates.indexOf(this.connectivityState) === -1) {
            return false;
        }
        this.trace(connectivity_state_1.ConnectivityState[this.connectivityState] + ' -> ' + connectivity_state_1.ConnectivityState[newState]);
        if (this.channelzEnabled) {
            this.channelzTrace.addTrace('CT_INFO', connectivity_state_1.ConnectivityState[this.connectivityState] + ' -> ' + connectivity_state_1.ConnectivityState[newState]);
        }
        const previousState = this.connectivityState;
        this.connectivityState = newState;
        switch(newState){
            case connectivity_state_1.ConnectivityState.READY:
                this.stopBackoff();
                const session = this.session;
                session.socket.once('close', ()=>{
                    if (this.session === session) {
                        this.handleDisconnect();
                    }
                });
                if (this.keepaliveWithoutCalls) {
                    this.startKeepalivePings();
                }
                break;
            case connectivity_state_1.ConnectivityState.CONNECTING:
                this.startBackoff();
                this.startConnectingInternal();
                this.continueConnecting = false;
                break;
            case connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE:
                if (this.session) {
                    this.session.close();
                }
                this.session = null;
                this.resetChannelzSocketInfo();
                this.stopKeepalivePings();
                /* If the backoff timer has already ended by the time we get to the
                 * TRANSIENT_FAILURE state, we want to immediately transition out of
                 * TRANSIENT_FAILURE as though the backoff timer is ending right now */ if (!this.backoffTimeout.isRunning()) {
                    process.nextTick(()=>{
                        this.handleBackoffTimer();
                    });
                }
                break;
            case connectivity_state_1.ConnectivityState.IDLE:
                if (this.session) {
                    this.session.close();
                }
                this.session = null;
                this.resetChannelzSocketInfo();
                this.stopKeepalivePings();
                break;
            default:
                throw new Error(`Invalid state: unknown ConnectivityState ${newState}`);
        }
        /* We use a shallow copy of the stateListeners array in case a listener
         * is removed during this iteration */ for (const listener of [
            ...this.stateListeners
        ]){
            listener(this, previousState, newState);
        }
        return true;
    }
    /**
     * Check if the subchannel associated with zero calls and with zero channels.
     * If so, shut it down.
     */ checkBothRefcounts() {
        /* If no calls, channels, or subchannel pools have any more references to
         * this subchannel, we can be sure it will never be used again. */ if (this.callRefcount === 0 && this.refcount === 0) {
            if (this.channelzEnabled) {
                this.channelzTrace.addTrace('CT_INFO', 'Shutting down');
            }
            this.transitionToState([
                connectivity_state_1.ConnectivityState.CONNECTING,
                connectivity_state_1.ConnectivityState.READY
            ], connectivity_state_1.ConnectivityState.IDLE);
            if (this.channelzEnabled) {
                channelz_1.unregisterChannelzRef(this.channelzRef);
            }
        }
    }
    callRef() {
        this.refTrace('callRefcount ' + this.callRefcount + ' -> ' + (this.callRefcount + 1));
        if (this.callRefcount === 0) {
            if (this.session) {
                this.session.ref();
            }
            this.backoffTimeout.ref();
            if (!this.keepaliveWithoutCalls) {
                this.startKeepalivePings();
            }
        }
        this.callRefcount += 1;
    }
    callUnref() {
        this.refTrace('callRefcount ' + this.callRefcount + ' -> ' + (this.callRefcount - 1));
        this.callRefcount -= 1;
        if (this.callRefcount === 0) {
            if (this.session) {
                this.session.unref();
            }
            this.backoffTimeout.unref();
            if (!this.keepaliveWithoutCalls) {
                clearInterval(this.keepaliveIntervalId);
            }
            this.checkBothRefcounts();
        }
    }
    ref() {
        this.refTrace('refcount ' + this.refcount + ' -> ' + (this.refcount + 1));
        this.refcount += 1;
    }
    unref() {
        this.refTrace('refcount ' + this.refcount + ' -> ' + (this.refcount - 1));
        this.refcount -= 1;
        this.checkBothRefcounts();
    }
    unrefIfOneRef() {
        if (this.refcount === 1) {
            this.unref();
            return true;
        }
        return false;
    }
    /**
     * Start a stream on the current session with the given `metadata` as headers
     * and then attach it to the `callStream`. Must only be called if the
     * subchannel's current connectivity state is READY.
     * @param metadata
     * @param callStream
     */ startCallStream(metadata, callStream, extraFilters) {
        const headers = metadata.toHttp2Headers();
        headers[HTTP2_HEADER_AUTHORITY] = callStream.getHost();
        headers[HTTP2_HEADER_USER_AGENT] = this.userAgent;
        headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/grpc';
        headers[HTTP2_HEADER_METHOD] = 'POST';
        headers[HTTP2_HEADER_PATH] = callStream.getMethod();
        headers[HTTP2_HEADER_TE] = 'trailers';
        let http2Stream;
        /* In theory, if an error is thrown by session.request because session has
         * become unusable (e.g. because it has received a goaway), this subchannel
         * should soon see the corresponding close or goaway event anyway and leave
         * READY. But we have seen reports that this does not happen
         * (https://github.com/googleapis/nodejs-firestore/issues/1023#issuecomment-653204096)
         * so for defense in depth, we just discard the session when we see an
         * error here.
         */ try {
            http2Stream = this.session.request(headers);
        } catch (e) {
            this.transitionToState([
                connectivity_state_1.ConnectivityState.READY
            ], connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE);
            throw e;
        }
        let headersString = '';
        for (const header of Object.keys(headers)){
            headersString += '\t\t' + header + ': ' + headers[header] + '\n';
        }
        logging.trace(constants_1.LogVerbosity.DEBUG, 'call_stream', 'Starting stream [' + callStream.getCallNumber() + '] on subchannel ' + '(' + this.channelzRef.id + ') ' + this.subchannelAddressString + ' with headers\n' + headersString);
        this.flowControlTrace('local window size: ' + this.session.state.localWindowSize + ' remote window size: ' + this.session.state.remoteWindowSize);
        const streamSession = this.session;
        this.internalsTrace('session.closed=' + streamSession.closed + ' session.destroyed=' + streamSession.destroyed + ' session.socket.destroyed=' + streamSession.socket.destroyed);
        let statsTracker;
        if (this.channelzEnabled) {
            this.callTracker.addCallStarted();
            callStream.addStatusWatcher((status)=>{
                if (status.code === constants_1.Status.OK) {
                    this.callTracker.addCallSucceeded();
                } else {
                    this.callTracker.addCallFailed();
                }
            });
            this.streamTracker.addCallStarted();
            callStream.addStreamEndWatcher((success)=>{
                if (streamSession === this.session) {
                    if (success) {
                        this.streamTracker.addCallSucceeded();
                    } else {
                        this.streamTracker.addCallFailed();
                    }
                }
            });
            statsTracker = {
                addMessageSent: ()=>{
                    this.messagesSent += 1;
                    this.lastMessageSentTimestamp = new Date();
                },
                addMessageReceived: ()=>{
                    this.messagesReceived += 1;
                }
            };
        } else {
            statsTracker = {
                addMessageSent: ()=>{},
                addMessageReceived: ()=>{}
            };
        }
        callStream.attachHttp2Stream(http2Stream, this, extraFilters, statsTracker);
    }
    /**
     * If the subchannel is currently IDLE, start connecting and switch to the
     * CONNECTING state. If the subchannel is current in TRANSIENT_FAILURE,
     * the next time it would transition to IDLE, start connecting again instead.
     * Otherwise, do nothing.
     */ startConnecting() {
        /* First, try to transition from IDLE to connecting. If that doesn't happen
         * because the state is not currently IDLE, check if it is
         * TRANSIENT_FAILURE, and if so indicate that it should go back to
         * connecting after the backoff timer ends. Otherwise do nothing */ if (!this.transitionToState([
            connectivity_state_1.ConnectivityState.IDLE
        ], connectivity_state_1.ConnectivityState.CONNECTING)) {
            if (this.connectivityState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
                this.continueConnecting = true;
            }
        }
    }
    /**
     * Get the subchannel's current connectivity state.
     */ getConnectivityState() {
        return this.connectivityState;
    }
    /**
     * Add a listener function to be called whenever the subchannel's
     * connectivity state changes.
     * @param listener
     */ addConnectivityStateListener(listener) {
        this.stateListeners.push(listener);
    }
    /**
     * Remove a listener previously added with `addConnectivityStateListener`
     * @param listener A reference to a function previously passed to
     *     `addConnectivityStateListener`
     */ removeConnectivityStateListener(listener) {
        const listenerIndex = this.stateListeners.indexOf(listener);
        if (listenerIndex > -1) {
            this.stateListeners.splice(listenerIndex, 1);
        }
    }
    addDisconnectListener(listener) {
        this.disconnectListeners.add(listener);
    }
    removeDisconnectListener(listener) {
        this.disconnectListeners.delete(listener);
    }
    /**
     * Reset the backoff timeout, and immediately start connecting if in backoff.
     */ resetBackoff() {
        this.backoffTimeout.reset();
        this.transitionToState([
            connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE
        ], connectivity_state_1.ConnectivityState.CONNECTING);
    }
    getAddress() {
        return this.subchannelAddressString;
    }
    getChannelzRef() {
        return this.channelzRef;
    }
    getRealSubchannel() {
        return this;
    }
}
exports.Subchannel = Subchannel; //# sourceMappingURL=subchannel.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-pool.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSubchannelPool = exports.SubchannelPool = void 0;
const channel_options_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channel-options.js [app-ssr] (ecmascript)");
const subchannel_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel.js [app-ssr] (ecmascript)");
const subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
// 10 seconds in milliseconds. This value is arbitrary.
/**
 * The amount of time in between checks for dropping subchannels that have no
 * other references
 */ const REF_CHECK_INTERVAL = 10000;
class SubchannelPool {
    /**
     * A pool of subchannels use for making connections. Subchannels with the
     * exact same parameters will be reused.
     */ constructor(){
        this.pool = Object.create(null);
        /**
         * A timer of a task performing a periodic subchannel cleanup.
         */ this.cleanupTimer = null;
    }
    /**
     * Unrefs all unused subchannels and cancels the cleanup task if all
     * subchannels have been unrefed.
     */ unrefUnusedSubchannels() {
        let allSubchannelsUnrefed = true;
        /* These objects are created with Object.create(null), so they do not
         * have a prototype, which means that for (... in ...) loops over them
         * do not need to be filtered */ // eslint-disable-disable-next-line:forin
        for(const channelTarget in this.pool){
            const subchannelObjArray = this.pool[channelTarget];
            const refedSubchannels = subchannelObjArray.filter((value)=>!value.subchannel.unrefIfOneRef());
            if (refedSubchannels.length > 0) {
                allSubchannelsUnrefed = false;
            }
            /* For each subchannel in the pool, try to unref it if it has
             * exactly one ref (which is the ref from the pool itself). If that
             * does happen, remove the subchannel from the pool */ this.pool[channelTarget] = refedSubchannels;
        }
        /* Currently we do not delete keys with empty values. If that results
         * in significant memory usage we should change it. */ // Cancel the cleanup task if all subchannels have been unrefed.
        if (allSubchannelsUnrefed && this.cleanupTimer !== null) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }
    /**
     * Ensures that the cleanup task is spawned.
     */ ensureCleanupTask() {
        var _a, _b;
        if (this.cleanupTimer === null) {
            this.cleanupTimer = setInterval(()=>{
                this.unrefUnusedSubchannels();
            }, REF_CHECK_INTERVAL);
            // Unref because this timer should not keep the event loop running.
            // Call unref only if it exists to address electron/electron#21162
            (_b = (_a = this.cleanupTimer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    }
    /**
     * Get a subchannel if one already exists with exactly matching parameters.
     * Otherwise, create and save a subchannel with those parameters.
     * @param channelTarget
     * @param subchannelTarget
     * @param channelArguments
     * @param channelCredentials
     */ getOrCreateSubchannel(channelTargetUri, subchannelTarget, channelArguments, channelCredentials) {
        this.ensureCleanupTask();
        const channelTarget = uri_parser_1.uriToString(channelTargetUri);
        if (channelTarget in this.pool) {
            const subchannelObjArray = this.pool[channelTarget];
            for (const subchannelObj of subchannelObjArray){
                if (subchannel_address_1.subchannelAddressEqual(subchannelTarget, subchannelObj.subchannelAddress) && channel_options_1.channelOptionsEqual(channelArguments, subchannelObj.channelArguments) && channelCredentials._equals(subchannelObj.channelCredentials)) {
                    return subchannelObj.subchannel;
                }
            }
        }
        // If we get here, no matching subchannel was found
        const subchannel = new subchannel_1.Subchannel(channelTargetUri, subchannelTarget, channelArguments, channelCredentials);
        if (!(channelTarget in this.pool)) {
            this.pool[channelTarget] = [];
        }
        this.pool[channelTarget].push({
            subchannelAddress: subchannelTarget,
            channelArguments,
            channelCredentials,
            subchannel
        });
        subchannel.ref();
        return subchannel;
    }
}
exports.SubchannelPool = SubchannelPool;
const globalSubchannelPool = new SubchannelPool();
/**
 * Get either the global subchannel pool, or a new subchannel pool.
 * @param global
 */ function getSubchannelPool(global) {
    if (global) {
        return globalSubchannelPool;
    } else {
        return new SubchannelPool();
    }
}
exports.getSubchannelPool = getSubchannelPool; //# sourceMappingURL=subchannel-pool.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter-stack.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FilterStackFactory = exports.FilterStack = void 0;
class FilterStack {
    constructor(filters){
        this.filters = filters;
    }
    sendMetadata(metadata) {
        let result = metadata;
        for(let i = 0; i < this.filters.length; i++){
            result = this.filters[i].sendMetadata(result);
        }
        return result;
    }
    receiveMetadata(metadata) {
        let result = metadata;
        for(let i = this.filters.length - 1; i >= 0; i--){
            result = this.filters[i].receiveMetadata(result);
        }
        return result;
    }
    sendMessage(message) {
        let result = message;
        for(let i = 0; i < this.filters.length; i++){
            result = this.filters[i].sendMessage(result);
        }
        return result;
    }
    receiveMessage(message) {
        let result = message;
        for(let i = this.filters.length - 1; i >= 0; i--){
            result = this.filters[i].receiveMessage(result);
        }
        return result;
    }
    receiveTrailers(status) {
        let result = status;
        for(let i = this.filters.length - 1; i >= 0; i--){
            result = this.filters[i].receiveTrailers(result);
        }
        return result;
    }
    refresh() {
        for (const filter of this.filters){
            filter.refresh();
        }
    }
    push(filters) {
        this.filters.unshift(...filters);
    }
    getFilters() {
        return this.filters;
    }
}
exports.FilterStack = FilterStack;
class FilterStackFactory {
    constructor(factories){
        this.factories = factories;
    }
    push(filterFactories) {
        this.factories.unshift(...filterFactories);
    }
    createFilter(callStream) {
        return new FilterStack(this.factories.map((factory)=>factory.createFilter(callStream)));
    }
}
exports.FilterStackFactory = FilterStackFactory; //# sourceMappingURL=filter-stack.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseFilter = void 0;
class BaseFilter {
    async sendMetadata(metadata) {
        return metadata;
    }
    receiveMetadata(metadata) {
        return metadata;
    }
    async sendMessage(message) {
        return message;
    }
    async receiveMessage(message) {
        return message;
    }
    receiveTrailers(status) {
        return status;
    }
    refresh() {}
}
exports.BaseFilter = BaseFilter; //# sourceMappingURL=filter.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call-credentials-filter.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CallCredentialsFilterFactory = exports.CallCredentialsFilter = void 0;
const filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
class CallCredentialsFilter extends filter_1.BaseFilter {
    constructor(channel, stream){
        var _a, _b;
        super();
        this.channel = channel;
        this.stream = stream;
        this.channel = channel;
        this.stream = stream;
        const splitPath = stream.getMethod().split('/');
        let serviceName = '';
        /* The standard path format is "/{serviceName}/{methodName}", so if we split
         * by '/', the first item should be empty and the second should be the
         * service name */ if (splitPath.length >= 2) {
            serviceName = splitPath[1];
        }
        const hostname = (_b = (_a = uri_parser_1.splitHostPort(stream.getHost())) === null || _a === void 0 ? void 0 : _a.host) !== null && _b !== void 0 ? _b : 'localhost';
        /* Currently, call credentials are only allowed on HTTPS connections, so we
         * can assume that the scheme is "https" */ this.serviceUrl = `https://${hostname}/${serviceName}`;
    }
    async sendMetadata(metadata) {
        const credentials = this.stream.getCredentials();
        const credsMetadata = credentials.generateMetadata({
            service_url: this.serviceUrl
        });
        const resultMetadata = await metadata;
        try {
            resultMetadata.merge(await credsMetadata);
        } catch (error) {
            this.stream.cancelWithStatus(constants_1.Status.UNAUTHENTICATED, `Failed to retrieve auth metadata with error: ${error.message}`);
            return Promise.reject('Failed to retrieve auth metadata');
        }
        if (resultMetadata.get('authorization').length > 1) {
            this.stream.cancelWithStatus(constants_1.Status.INTERNAL, '"authorization" metadata cannot have multiple values');
            return Promise.reject('"authorization" metadata cannot have multiple values');
        }
        return resultMetadata;
    }
}
exports.CallCredentialsFilter = CallCredentialsFilter;
class CallCredentialsFilterFactory {
    constructor(channel){
        this.channel = channel;
        this.channel = channel;
    }
    createFilter(callStream) {
        return new CallCredentialsFilter(this.channel, callStream);
    }
}
exports.CallCredentialsFilterFactory = CallCredentialsFilterFactory; //# sourceMappingURL=call-credentials-filter.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/deadline-filter.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DeadlineFilterFactory = exports.DeadlineFilter = void 0;
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter.js [app-ssr] (ecmascript)");
const units = [
    [
        'm',
        1
    ],
    [
        'S',
        1000
    ],
    [
        'M',
        60 * 1000
    ],
    [
        'H',
        60 * 60 * 1000
    ]
];
function getDeadline(deadline) {
    const now = new Date().getTime();
    const timeoutMs = Math.max(deadline - now, 0);
    for (const [unit, factor] of units){
        const amount = timeoutMs / factor;
        if (amount < 1e8) {
            return String(Math.ceil(amount)) + unit;
        }
    }
    throw new Error('Deadline is too far in the future');
}
class DeadlineFilter extends filter_1.BaseFilter {
    constructor(channel, callStream){
        super();
        this.channel = channel;
        this.callStream = callStream;
        this.timer = null;
        this.deadline = Infinity;
        this.retreiveDeadline();
        this.runTimer();
    }
    retreiveDeadline() {
        const callDeadline = this.callStream.getDeadline();
        if (callDeadline instanceof Date) {
            this.deadline = callDeadline.getTime();
        } else {
            this.deadline = callDeadline;
        }
    }
    runTimer() {
        var _a, _b;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        const now = new Date().getTime();
        const timeout = this.deadline - now;
        if (timeout <= 0) {
            process.nextTick(()=>{
                this.callStream.cancelWithStatus(constants_1.Status.DEADLINE_EXCEEDED, 'Deadline exceeded');
            });
        } else if (this.deadline !== Infinity) {
            this.timer = setTimeout(()=>{
                this.callStream.cancelWithStatus(constants_1.Status.DEADLINE_EXCEEDED, 'Deadline exceeded');
            }, timeout);
            (_b = (_a = this.timer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    }
    refresh() {
        this.retreiveDeadline();
        this.runTimer();
    }
    async sendMetadata(metadata) {
        if (this.deadline === Infinity) {
            return metadata;
        }
        /* The input metadata promise depends on the original channel.connect()
         * promise, so when it is complete that implies that the channel is
         * connected */ const finalMetadata = await metadata;
        const timeoutString = getDeadline(this.deadline);
        finalMetadata.set('grpc-timeout', timeoutString);
        return finalMetadata;
    }
    receiveTrailers(status) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        return status;
    }
}
exports.DeadlineFilter = DeadlineFilter;
class DeadlineFilterFactory {
    constructor(channel){
        this.channel = channel;
    }
    createFilter(callStream) {
        return new DeadlineFilter(this.channel, callStream);
    }
}
exports.DeadlineFilterFactory = DeadlineFilterFactory; //# sourceMappingURL=deadline-filter.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/compression-algorithms.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2021 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CompressionAlgorithms = void 0;
var CompressionAlgorithms;
(function(CompressionAlgorithms) {
    CompressionAlgorithms[CompressionAlgorithms["identity"] = 0] = "identity";
    CompressionAlgorithms[CompressionAlgorithms["deflate"] = 1] = "deflate";
    CompressionAlgorithms[CompressionAlgorithms["gzip"] = 2] = "gzip";
})(CompressionAlgorithms = exports.CompressionAlgorithms || (exports.CompressionAlgorithms = {}));
; //# sourceMappingURL=compression-algorithms.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/compression-filter.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CompressionFilterFactory = exports.CompressionFilter = void 0;
const zlib = __turbopack_context__.r("[externals]/zlib [external] (zlib, cjs)");
const compression_algorithms_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/compression-algorithms.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const isCompressionAlgorithmKey = (key)=>{
    return typeof key === 'number' && typeof compression_algorithms_1.CompressionAlgorithms[key] === 'string';
};
class CompressionHandler {
    /**
     * @param message Raw uncompressed message bytes
     * @param compress Indicates whether the message should be compressed
     * @return Framed message, compressed if applicable
     */ async writeMessage(message, compress) {
        let messageBuffer = message;
        if (compress) {
            messageBuffer = await this.compressMessage(messageBuffer);
        }
        const output = Buffer.allocUnsafe(messageBuffer.length + 5);
        output.writeUInt8(compress ? 1 : 0, 0);
        output.writeUInt32BE(messageBuffer.length, 1);
        messageBuffer.copy(output, 5);
        return output;
    }
    /**
     * @param data Framed message, possibly compressed
     * @return Uncompressed message
     */ async readMessage(data) {
        const compressed = data.readUInt8(0) === 1;
        let messageBuffer = data.slice(5);
        if (compressed) {
            messageBuffer = await this.decompressMessage(messageBuffer);
        }
        return messageBuffer;
    }
}
class IdentityHandler extends CompressionHandler {
    async compressMessage(message) {
        return message;
    }
    async writeMessage(message, compress) {
        const output = Buffer.allocUnsafe(message.length + 5);
        /* With "identity" compression, messages should always be marked as
         * uncompressed */ output.writeUInt8(0, 0);
        output.writeUInt32BE(message.length, 1);
        message.copy(output, 5);
        return output;
    }
    decompressMessage(message) {
        return Promise.reject(new Error('Received compressed message but "grpc-encoding" header was identity'));
    }
}
class DeflateHandler extends CompressionHandler {
    compressMessage(message) {
        return new Promise((resolve, reject)=>{
            zlib.deflate(message, (err, output)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });
    }
    decompressMessage(message) {
        return new Promise((resolve, reject)=>{
            zlib.inflate(message, (err, output)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });
    }
}
class GzipHandler extends CompressionHandler {
    compressMessage(message) {
        return new Promise((resolve, reject)=>{
            zlib.gzip(message, (err, output)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });
    }
    decompressMessage(message) {
        return new Promise((resolve, reject)=>{
            zlib.unzip(message, (err, output)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });
    }
}
class UnknownHandler extends CompressionHandler {
    constructor(compressionName){
        super();
        this.compressionName = compressionName;
    }
    compressMessage(message) {
        return Promise.reject(new Error(`Received message compressed with unsupported compression method ${this.compressionName}`));
    }
    decompressMessage(message) {
        // This should be unreachable
        return Promise.reject(new Error(`Compression method not supported: ${this.compressionName}`));
    }
}
function getCompressionHandler(compressionName) {
    switch(compressionName){
        case 'identity':
            return new IdentityHandler();
        case 'deflate':
            return new DeflateHandler();
        case 'gzip':
            return new GzipHandler();
        default:
            return new UnknownHandler(compressionName);
    }
}
class CompressionFilter extends filter_1.BaseFilter {
    constructor(channelOptions, sharedFilterConfig){
        var _a;
        super();
        this.sharedFilterConfig = sharedFilterConfig;
        this.sendCompression = new IdentityHandler();
        this.receiveCompression = new IdentityHandler();
        this.currentCompressionAlgorithm = 'identity';
        const compressionAlgorithmKey = channelOptions['grpc.default_compression_algorithm'];
        if (compressionAlgorithmKey !== undefined) {
            if (isCompressionAlgorithmKey(compressionAlgorithmKey)) {
                const clientSelectedEncoding = compression_algorithms_1.CompressionAlgorithms[compressionAlgorithmKey];
                const serverSupportedEncodings = (_a = sharedFilterConfig.serverSupportedEncodingHeader) === null || _a === void 0 ? void 0 : _a.split(',');
                /**
                 * There are two possible situations here:
                 * 1) We don't have any info yet from the server about what compression it supports
                 *    In that case we should just use what the client tells us to use
                 * 2) We've previously received a response from the server including a grpc-accept-encoding header
                 *    In that case we only want to use the encoding chosen by the client if the server supports it
                 */ if (!serverSupportedEncodings || serverSupportedEncodings.includes(clientSelectedEncoding)) {
                    this.currentCompressionAlgorithm = clientSelectedEncoding;
                    this.sendCompression = getCompressionHandler(this.currentCompressionAlgorithm);
                }
            } else {
                logging.log(constants_1.LogVerbosity.ERROR, `Invalid value provided for grpc.default_compression_algorithm option: ${compressionAlgorithmKey}`);
            }
        }
    }
    async sendMetadata(metadata) {
        const headers = await metadata;
        headers.set('grpc-accept-encoding', 'identity,deflate,gzip');
        headers.set('accept-encoding', 'identity');
        // No need to send the header if it's "identity" -  behavior is identical; save the bandwidth
        if (this.currentCompressionAlgorithm === 'identity') {
            headers.remove('grpc-encoding');
        } else {
            headers.set('grpc-encoding', this.currentCompressionAlgorithm);
        }
        return headers;
    }
    receiveMetadata(metadata) {
        const receiveEncoding = metadata.get('grpc-encoding');
        if (receiveEncoding.length > 0) {
            const encoding = receiveEncoding[0];
            if (typeof encoding === 'string') {
                this.receiveCompression = getCompressionHandler(encoding);
            }
        }
        metadata.remove('grpc-encoding');
        /* Check to see if the compression we're using to send messages is supported by the server
         * If not, reset the sendCompression filter and have it use the default IdentityHandler */ const serverSupportedEncodingsHeader = metadata.get('grpc-accept-encoding')[0];
        if (serverSupportedEncodingsHeader) {
            this.sharedFilterConfig.serverSupportedEncodingHeader = serverSupportedEncodingsHeader;
            const serverSupportedEncodings = serverSupportedEncodingsHeader.split(',');
            if (!serverSupportedEncodings.includes(this.currentCompressionAlgorithm)) {
                this.sendCompression = new IdentityHandler();
                this.currentCompressionAlgorithm = 'identity';
            }
        }
        metadata.remove('grpc-accept-encoding');
        return metadata;
    }
    async sendMessage(message) {
        var _a;
        /* This filter is special. The input message is the bare message bytes,
         * and the output is a framed and possibly compressed message. For this
         * reason, this filter should be at the bottom of the filter stack */ const resolvedMessage = await message;
        let compress;
        if (this.sendCompression instanceof IdentityHandler) {
            compress = false;
        } else {
            compress = (((_a = resolvedMessage.flags) !== null && _a !== void 0 ? _a : 0) & 2 /* NoCompress */ ) === 0;
        }
        return {
            message: await this.sendCompression.writeMessage(resolvedMessage.message, compress),
            flags: resolvedMessage.flags
        };
    }
    async receiveMessage(message) {
        /* This filter is also special. The input message is framed and possibly
         * compressed, and the output message is deframed and uncompressed. So
         * this is another reason that this filter should be at the bottom of the
         * filter stack. */ return this.receiveCompression.readMessage(await message);
    }
}
exports.CompressionFilter = CompressionFilter;
class CompressionFilterFactory {
    constructor(channel, options){
        this.channel = channel;
        this.options = options;
        this.sharedFilterConfig = {};
    }
    createFilter(callStream) {
        return new CompressionFilter(this.options, this.sharedFilterConfig);
    }
}
exports.CompressionFilterFactory = CompressionFilterFactory; //# sourceMappingURL=compression-filter.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/max-message-size-filter.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2020 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MaxMessageSizeFilterFactory = exports.MaxMessageSizeFilter = void 0;
const filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
class MaxMessageSizeFilter extends filter_1.BaseFilter {
    constructor(options, callStream){
        super();
        this.options = options;
        this.callStream = callStream;
        this.maxSendMessageSize = constants_1.DEFAULT_MAX_SEND_MESSAGE_LENGTH;
        this.maxReceiveMessageSize = constants_1.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
        if ('grpc.max_send_message_length' in options) {
            this.maxSendMessageSize = options['grpc.max_send_message_length'];
        }
        if ('grpc.max_receive_message_length' in options) {
            this.maxReceiveMessageSize = options['grpc.max_receive_message_length'];
        }
    }
    async sendMessage(message) {
        /* A configured size of -1 means that there is no limit, so skip the check
         * entirely */ if (this.maxSendMessageSize === -1) {
            return message;
        } else {
            const concreteMessage = await message;
            if (concreteMessage.message.length > this.maxSendMessageSize) {
                this.callStream.cancelWithStatus(constants_1.Status.RESOURCE_EXHAUSTED, `Sent message larger than max (${concreteMessage.message.length} vs. ${this.maxSendMessageSize})`);
                return Promise.reject('Message too large');
            } else {
                return concreteMessage;
            }
        }
    }
    async receiveMessage(message) {
        /* A configured size of -1 means that there is no limit, so skip the check
         * entirely */ if (this.maxReceiveMessageSize === -1) {
            return message;
        } else {
            const concreteMessage = await message;
            if (concreteMessage.length > this.maxReceiveMessageSize) {
                this.callStream.cancelWithStatus(constants_1.Status.RESOURCE_EXHAUSTED, `Received message larger than max (${concreteMessage.length} vs. ${this.maxReceiveMessageSize})`);
                return Promise.reject('Message too large');
            } else {
                return concreteMessage;
            }
        }
    }
}
exports.MaxMessageSizeFilter = MaxMessageSizeFilter;
class MaxMessageSizeFilterFactory {
    constructor(options){
        this.options = options;
    }
    createFilter(callStream) {
        return new MaxMessageSizeFilter(this.options, callStream);
    }
}
exports.MaxMessageSizeFilterFactory = MaxMessageSizeFilterFactory; //# sourceMappingURL=max-message-size-filter.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channel.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChannelImplementation = void 0;
const call_stream_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call-stream.js [app-ssr] (ecmascript)");
const channel_credentials_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channel-credentials.js [app-ssr] (ecmascript)");
const resolving_load_balancer_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolving-load-balancer.js [app-ssr] (ecmascript)");
const subchannel_pool_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-pool.js [app-ssr] (ecmascript)");
const picker_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/picker.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const filter_stack_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter-stack.js [app-ssr] (ecmascript)");
const call_credentials_filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call-credentials-filter.js [app-ssr] (ecmascript)");
const deadline_filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/deadline-filter.js [app-ssr] (ecmascript)");
const compression_filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/compression-filter.js [app-ssr] (ecmascript)");
const resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
const logging_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const max_message_size_filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/max-message-size-filter.js [app-ssr] (ecmascript)");
const http_proxy_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/http_proxy.js [app-ssr] (ecmascript)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const channelz_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channelz.js [app-ssr] (ecmascript)");
/**
 * See https://nodejs.org/api/timers.html#timers_setinterval_callback_delay_args
 */ const MAX_TIMEOUT_TIME = 2147483647;
let nextCallNumber = 0;
function getNewCallNumber() {
    const callNumber = nextCallNumber;
    nextCallNumber += 1;
    if (nextCallNumber >= Number.MAX_SAFE_INTEGER) {
        nextCallNumber = 0;
    }
    return callNumber;
}
const INAPPROPRIATE_CONTROL_PLANE_CODES = [
    constants_1.Status.OK,
    constants_1.Status.INVALID_ARGUMENT,
    constants_1.Status.NOT_FOUND,
    constants_1.Status.ALREADY_EXISTS,
    constants_1.Status.FAILED_PRECONDITION,
    constants_1.Status.ABORTED,
    constants_1.Status.OUT_OF_RANGE,
    constants_1.Status.DATA_LOSS
];
function restrictControlPlaneStatusCode(code, details) {
    if (INAPPROPRIATE_CONTROL_PLANE_CODES.includes(code)) {
        return {
            code: constants_1.Status.INTERNAL,
            details: `Invalid status from control plane: ${code} ${constants_1.Status[code]} ${details}`
        };
    } else {
        return {
            code,
            details
        };
    }
}
class ChannelImplementation {
    constructor(target, credentials, options){
        var _a, _b, _c, _d;
        this.credentials = credentials;
        this.options = options;
        this.connectivityState = connectivity_state_1.ConnectivityState.IDLE;
        this.currentPicker = new picker_1.UnavailablePicker();
        /**
         * Calls queued up to get a call config. Should only be populated before the
         * first time the resolver returns a result, which includes the ConfigSelector.
         */ this.configSelectionQueue = [];
        this.pickQueue = [];
        this.connectivityStateWatchers = [];
        this.configSelector = null;
        /**
         * This is the error from the name resolver if it failed most recently. It
         * is only used to end calls that start while there is no config selector
         * and the name resolver is in backoff, so it should be nulled if
         * configSelector becomes set or the channel state becomes anything other
         * than TRANSIENT_FAILURE.
         */ this.currentResolutionError = null;
        // Channelz info
        this.channelzEnabled = true;
        this.callTracker = new channelz_1.ChannelzCallTracker();
        this.childrenTracker = new channelz_1.ChannelzChildrenTracker();
        if (typeof target !== 'string') {
            throw new TypeError('Channel target must be a string');
        }
        if (!(credentials instanceof channel_credentials_1.ChannelCredentials)) {
            throw new TypeError('Channel credentials must be a ChannelCredentials object');
        }
        if (options) {
            if (typeof options !== 'object') {
                throw new TypeError('Channel options must be an object');
            }
        }
        this.originalTarget = target;
        const originalTargetUri = uri_parser_1.parseUri(target);
        if (originalTargetUri === null) {
            throw new Error(`Could not parse target name "${target}"`);
        }
        /* This ensures that the target has a scheme that is registered with the
         * resolver */ const defaultSchemeMapResult = resolver_1.mapUriDefaultScheme(originalTargetUri);
        if (defaultSchemeMapResult === null) {
            throw new Error(`Could not find a default scheme for target name "${target}"`);
        }
        this.callRefTimer = setInterval(()=>{}, MAX_TIMEOUT_TIME);
        (_b = (_a = this.callRefTimer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (this.options['grpc.enable_channelz'] === 0) {
            this.channelzEnabled = false;
        }
        this.channelzTrace = new channelz_1.ChannelzTrace();
        this.channelzRef = channelz_1.registerChannelzChannel(target, ()=>this.getChannelzInfo(), this.channelzEnabled);
        if (this.channelzEnabled) {
            this.channelzTrace.addTrace('CT_INFO', 'Channel created');
        }
        if (this.options['grpc.default_authority']) {
            this.defaultAuthority = this.options['grpc.default_authority'];
        } else {
            this.defaultAuthority = resolver_1.getDefaultAuthority(defaultSchemeMapResult);
        }
        const proxyMapResult = http_proxy_1.mapProxyName(defaultSchemeMapResult, options);
        this.target = proxyMapResult.target;
        this.options = Object.assign({}, this.options, proxyMapResult.extraOptions);
        /* The global boolean parameter to getSubchannelPool has the inverse meaning to what
         * the grpc.use_local_subchannel_pool channel option means. */ this.subchannelPool = subchannel_pool_1.getSubchannelPool(((_c = options['grpc.use_local_subchannel_pool']) !== null && _c !== void 0 ? _c : 0) === 0);
        const channelControlHelper = {
            createSubchannel: (subchannelAddress, subchannelArgs)=>{
                const subchannel = this.subchannelPool.getOrCreateSubchannel(this.target, subchannelAddress, Object.assign({}, this.options, subchannelArgs), this.credentials);
                if (this.channelzEnabled) {
                    this.channelzTrace.addTrace('CT_INFO', 'Created subchannel or used existing subchannel', subchannel.getChannelzRef());
                }
                return subchannel;
            },
            updateState: (connectivityState, picker)=>{
                this.currentPicker = picker;
                const queueCopy = this.pickQueue.slice();
                this.pickQueue = [];
                this.callRefTimerUnref();
                for (const { callStream, callMetadata, callConfig, dynamicFilters } of queueCopy){
                    this.tryPick(callStream, callMetadata, callConfig, dynamicFilters);
                }
                this.updateState(connectivityState);
            },
            requestReresolution: ()=>{
                // This should never be called.
                throw new Error('Resolving load balancer should never call requestReresolution');
            },
            addChannelzChild: (child)=>{
                if (this.channelzEnabled) {
                    this.childrenTracker.refChild(child);
                }
            },
            removeChannelzChild: (child)=>{
                if (this.channelzEnabled) {
                    this.childrenTracker.unrefChild(child);
                }
            }
        };
        this.resolvingLoadBalancer = new resolving_load_balancer_1.ResolvingLoadBalancer(this.target, channelControlHelper, options, (configSelector)=>{
            if (this.channelzEnabled) {
                this.channelzTrace.addTrace('CT_INFO', 'Address resolution succeeded');
            }
            this.configSelector = configSelector;
            this.currentResolutionError = null;
            /* We process the queue asynchronously to ensure that the corresponding
             * load balancer update has completed. */ process.nextTick(()=>{
                const localQueue = this.configSelectionQueue;
                this.configSelectionQueue = [];
                this.callRefTimerUnref();
                for (const { callStream, callMetadata } of localQueue){
                    this.tryGetConfig(callStream, callMetadata);
                }
                this.configSelectionQueue = [];
            });
        }, (status)=>{
            if (this.channelzEnabled) {
                this.channelzTrace.addTrace('CT_WARNING', 'Address resolution failed with code ' + status.code + ' and details "' + status.details + '"');
            }
            if (this.configSelectionQueue.length > 0) {
                this.trace('Name resolution failed with calls queued for config selection');
            }
            if (this.configSelector === null) {
                this.currentResolutionError = Object.assign(Object.assign({}, restrictControlPlaneStatusCode(status.code, status.details)), {
                    metadata: status.metadata
                });
            }
            const localQueue = this.configSelectionQueue;
            this.configSelectionQueue = [];
            this.callRefTimerUnref();
            for (const { callStream, callMetadata } of localQueue){
                if (callMetadata.getOptions().waitForReady) {
                    this.callRefTimerRef();
                    this.configSelectionQueue.push({
                        callStream,
                        callMetadata
                    });
                } else {
                    callStream.cancelWithStatus(status.code, status.details);
                }
            }
        });
        this.filterStackFactory = new filter_stack_1.FilterStackFactory([
            new call_credentials_filter_1.CallCredentialsFilterFactory(this),
            new deadline_filter_1.DeadlineFilterFactory(this),
            new max_message_size_filter_1.MaxMessageSizeFilterFactory(this.options),
            new compression_filter_1.CompressionFilterFactory(this, this.options)
        ]);
        this.trace('Channel constructed with options ' + JSON.stringify(options, undefined, 2));
        const error = new Error();
        logging_1.trace(constants_1.LogVerbosity.DEBUG, 'channel_stacktrace', '(' + this.channelzRef.id + ') ' + 'Channel constructed \n' + ((_d = error.stack) === null || _d === void 0 ? void 0 : _d.substring(error.stack.indexOf('\n') + 1)));
    }
    getChannelzInfo() {
        return {
            target: this.originalTarget,
            state: this.connectivityState,
            trace: this.channelzTrace,
            callTracker: this.callTracker,
            children: this.childrenTracker.getChildLists()
        };
    }
    trace(text, verbosityOverride) {
        logging_1.trace(verbosityOverride !== null && verbosityOverride !== void 0 ? verbosityOverride : constants_1.LogVerbosity.DEBUG, 'channel', '(' + this.channelzRef.id + ') ' + uri_parser_1.uriToString(this.target) + ' ' + text);
    }
    callRefTimerRef() {
        var _a, _b, _c, _d;
        // If the hasRef function does not exist, always run the code
        if (!((_b = (_a = this.callRefTimer).hasRef) === null || _b === void 0 ? void 0 : _b.call(_a))) {
            this.trace('callRefTimer.ref | configSelectionQueue.length=' + this.configSelectionQueue.length + ' pickQueue.length=' + this.pickQueue.length);
            (_d = (_c = this.callRefTimer).ref) === null || _d === void 0 ? void 0 : _d.call(_c);
        }
    }
    callRefTimerUnref() {
        var _a, _b;
        // If the hasRef function does not exist, always run the code
        if (!this.callRefTimer.hasRef || this.callRefTimer.hasRef()) {
            this.trace('callRefTimer.unref | configSelectionQueue.length=' + this.configSelectionQueue.length + ' pickQueue.length=' + this.pickQueue.length);
            (_b = (_a = this.callRefTimer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    }
    pushPick(callStream, callMetadata, callConfig, dynamicFilters) {
        this.pickQueue.push({
            callStream,
            callMetadata,
            callConfig,
            dynamicFilters
        });
        this.callRefTimerRef();
    }
    /**
     * Check the picker output for the given call and corresponding metadata,
     * and take any relevant actions. Should not be called while iterating
     * over pickQueue.
     * @param callStream
     * @param callMetadata
     */ tryPick(callStream, callMetadata, callConfig, dynamicFilters) {
        var _a, _b;
        const pickResult = this.currentPicker.pick({
            metadata: callMetadata,
            extraPickInfo: callConfig.pickInformation
        });
        const subchannelString = pickResult.subchannel ? '(' + pickResult.subchannel.getChannelzRef().id + ') ' + pickResult.subchannel.getAddress() : '' + pickResult.subchannel;
        this.trace('Pick result for call [' + callStream.getCallNumber() + ']: ' + picker_1.PickResultType[pickResult.pickResultType] + ' subchannel: ' + subchannelString + ' status: ' + ((_a = pickResult.status) === null || _a === void 0 ? void 0 : _a.code) + ' ' + ((_b = pickResult.status) === null || _b === void 0 ? void 0 : _b.details));
        switch(pickResult.pickResultType){
            case picker_1.PickResultType.COMPLETE:
                if (pickResult.subchannel === null) {
                    callStream.cancelWithStatus(constants_1.Status.UNAVAILABLE, 'Request dropped by load balancing policy');
                // End the call with an error
                } else {
                    /* If the subchannel is not in the READY state, that indicates a bug
                     * somewhere in the load balancer or picker. So, we log an error and
                     * queue the pick to be tried again later. */ if (pickResult.subchannel.getConnectivityState() !== connectivity_state_1.ConnectivityState.READY) {
                        logging_1.log(constants_1.LogVerbosity.ERROR, 'Error: COMPLETE pick result subchannel ' + subchannelString + ' has state ' + connectivity_state_1.ConnectivityState[pickResult.subchannel.getConnectivityState()]);
                        this.pushPick(callStream, callMetadata, callConfig, dynamicFilters);
                        break;
                    }
                    /* We need to clone the callMetadata here because the transparent
                     * retry code in the promise resolution handler use the same
                     * callMetadata object, so it needs to stay unmodified */ callStream.filterStack.sendMetadata(Promise.resolve(callMetadata.clone())).then((finalMetadata)=>{
                        var _a, _b, _c;
                        const subchannelState = pickResult.subchannel.getConnectivityState();
                        if (subchannelState === connectivity_state_1.ConnectivityState.READY) {
                            try {
                                const pickExtraFilters = pickResult.extraFilterFactories.map((factory)=>factory.createFilter(callStream));
                                (_a = pickResult.subchannel) === null || _a === void 0 ? void 0 : _a.getRealSubchannel().startCallStream(finalMetadata, callStream, [
                                    ...dynamicFilters,
                                    ...pickExtraFilters
                                ]);
                                /* If we reach this point, the call stream has started
                                 * successfully */ (_b = callConfig.onCommitted) === null || _b === void 0 ? void 0 : _b.call(callConfig);
                                (_c = pickResult.onCallStarted) === null || _c === void 0 ? void 0 : _c.call(pickResult);
                            } catch (error) {
                                const errorCode = error.code;
                                if (errorCode === 'ERR_HTTP2_GOAWAY_SESSION' || errorCode === 'ERR_HTTP2_INVALID_SESSION') {
                                    /* An error here indicates that something went wrong with
                                     * the picked subchannel's http2 stream right before we
                                     * tried to start the stream. We are handling a promise
                                     * result here, so this is asynchronous with respect to the
                                     * original tryPick call, so calling it again is not
                                     * recursive. We call tryPick immediately instead of
                                     * queueing this pick again because handling the queue is
                                     * triggered by state changes, and we want to immediately
                                     * check if the state has already changed since the
                                     * previous tryPick call. We do this instead of cancelling
                                     * the stream because the correct behavior may be
                                     * re-queueing instead, based on the logic in the rest of
                                     * tryPick */ this.trace('Failed to start call on picked subchannel ' + subchannelString + ' with error ' + error.message + '. Retrying pick', constants_1.LogVerbosity.INFO);
                                    this.tryPick(callStream, callMetadata, callConfig, dynamicFilters);
                                } else {
                                    this.trace('Failed to start call on picked subchanel ' + subchannelString + ' with error ' + error.message + '. Ending call', constants_1.LogVerbosity.INFO);
                                    callStream.cancelWithStatus(constants_1.Status.INTERNAL, `Failed to start HTTP/2 stream with error: ${error.message}`);
                                }
                            }
                        } else {
                            /* The logic for doing this here is the same as in the catch
                             * block above */ this.trace('Picked subchannel ' + subchannelString + ' has state ' + connectivity_state_1.ConnectivityState[subchannelState] + ' after metadata filters. Retrying pick', constants_1.LogVerbosity.INFO);
                            this.tryPick(callStream, callMetadata, callConfig, dynamicFilters);
                        }
                    }, (error)=>{
                        // We assume the error code isn't 0 (Status.OK)
                        const { code, details } = restrictControlPlaneStatusCode(typeof error.code === 'number' ? error.code : constants_1.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${error.message}`);
                        callStream.cancelWithStatus(code, details);
                    });
                }
                break;
            case picker_1.PickResultType.QUEUE:
                this.pushPick(callStream, callMetadata, callConfig, dynamicFilters);
                break;
            case picker_1.PickResultType.TRANSIENT_FAILURE:
                if (callMetadata.getOptions().waitForReady) {
                    this.pushPick(callStream, callMetadata, callConfig, dynamicFilters);
                } else {
                    const { code, details } = restrictControlPlaneStatusCode(pickResult.status.code, pickResult.status.details);
                    callStream.cancelWithStatus(code, details);
                }
                break;
            case picker_1.PickResultType.DROP:
                const { code, details } = restrictControlPlaneStatusCode(pickResult.status.code, pickResult.status.details);
                callStream.cancelWithStatus(code, details);
                break;
            default:
                throw new Error(`Invalid state: unknown pickResultType ${pickResult.pickResultType}`);
        }
    }
    removeConnectivityStateWatcher(watcherObject) {
        const watcherIndex = this.connectivityStateWatchers.findIndex((value)=>value === watcherObject);
        if (watcherIndex >= 0) {
            this.connectivityStateWatchers.splice(watcherIndex, 1);
        }
    }
    updateState(newState) {
        logging_1.trace(constants_1.LogVerbosity.DEBUG, 'connectivity_state', '(' + this.channelzRef.id + ') ' + uri_parser_1.uriToString(this.target) + ' ' + connectivity_state_1.ConnectivityState[this.connectivityState] + ' -> ' + connectivity_state_1.ConnectivityState[newState]);
        if (this.channelzEnabled) {
            this.channelzTrace.addTrace('CT_INFO', connectivity_state_1.ConnectivityState[this.connectivityState] + ' -> ' + connectivity_state_1.ConnectivityState[newState]);
        }
        this.connectivityState = newState;
        const watchersCopy = this.connectivityStateWatchers.slice();
        for (const watcherObject of watchersCopy){
            if (newState !== watcherObject.currentState) {
                if (watcherObject.timer) {
                    clearTimeout(watcherObject.timer);
                }
                this.removeConnectivityStateWatcher(watcherObject);
                watcherObject.callback();
            }
        }
        if (newState !== connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
            this.currentResolutionError = null;
        }
    }
    tryGetConfig(stream, metadata) {
        if (stream.getStatus() !== null) {
            /* If the stream has a status, it has already finished and we don't need
             * to take any more actions on it. */ return;
        }
        if (this.configSelector === null) {
            /* This branch will only be taken at the beginning of the channel's life,
             * before the resolver ever returns a result. So, the
             * ResolvingLoadBalancer may be idle and if so it needs to be kicked
             * because it now has a pending request. */ this.resolvingLoadBalancer.exitIdle();
            if (this.currentResolutionError && !metadata.getOptions().waitForReady) {
                stream.cancelWithStatus(this.currentResolutionError.code, this.currentResolutionError.details);
            } else {
                this.configSelectionQueue.push({
                    callStream: stream,
                    callMetadata: metadata
                });
                this.callRefTimerRef();
            }
        } else {
            const callConfig = this.configSelector(stream.getMethod(), metadata);
            if (callConfig.status === constants_1.Status.OK) {
                if (callConfig.methodConfig.timeout) {
                    const deadline = new Date();
                    deadline.setSeconds(deadline.getSeconds() + callConfig.methodConfig.timeout.seconds);
                    deadline.setMilliseconds(deadline.getMilliseconds() + callConfig.methodConfig.timeout.nanos / 1000000);
                    stream.setConfigDeadline(deadline);
                    // Refreshing the filters makes the deadline filter pick up the new deadline
                    stream.filterStack.refresh();
                }
                if (callConfig.dynamicFilterFactories.length > 0) {
                    /* These dynamicFilters are the mechanism for implementing gRFC A39:
                     * https://github.com/grpc/proposal/blob/master/A39-xds-http-filters.md
                     * We run them here instead of with the rest of the filters because
                     * that spec says "the xDS HTTP filters will run in between name
                     * resolution and load balancing".
                     *
                     * We use the filter stack here to simplify the multi-filter async
                     * waterfall logic, but we pass along the underlying list of filters
                     * to avoid having nested filter stacks when combining it with the
                     * original filter stack. We do not pass along the original filter
                     * factory list because these filters may need to persist data
                     * between sending headers and other operations. */ const dynamicFilterStackFactory = new filter_stack_1.FilterStackFactory(callConfig.dynamicFilterFactories);
                    const dynamicFilterStack = dynamicFilterStackFactory.createFilter(stream);
                    dynamicFilterStack.sendMetadata(Promise.resolve(metadata)).then((filteredMetadata)=>{
                        this.tryPick(stream, filteredMetadata, callConfig, dynamicFilterStack.getFilters());
                    });
                } else {
                    this.tryPick(stream, metadata, callConfig, []);
                }
            } else {
                const { code, details } = restrictControlPlaneStatusCode(callConfig.status, 'Failed to route call to method ' + stream.getMethod());
                stream.cancelWithStatus(code, details);
            }
        }
    }
    _startCallStream(stream, metadata) {
        this.tryGetConfig(stream, metadata.clone());
    }
    close() {
        this.resolvingLoadBalancer.destroy();
        this.updateState(connectivity_state_1.ConnectivityState.SHUTDOWN);
        clearInterval(this.callRefTimer);
        if (this.channelzEnabled) {
            channelz_1.unregisterChannelzRef(this.channelzRef);
        }
        this.subchannelPool.unrefUnusedSubchannels();
    }
    getTarget() {
        return uri_parser_1.uriToString(this.target);
    }
    getConnectivityState(tryToConnect) {
        const connectivityState = this.connectivityState;
        if (tryToConnect) {
            this.resolvingLoadBalancer.exitIdle();
        }
        return connectivityState;
    }
    watchConnectivityState(currentState, deadline, callback) {
        if (this.connectivityState === connectivity_state_1.ConnectivityState.SHUTDOWN) {
            throw new Error('Channel has been shut down');
        }
        let timer = null;
        if (deadline !== Infinity) {
            const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline);
            const now = new Date();
            if (deadline === -Infinity || deadlineDate <= now) {
                process.nextTick(callback, new Error('Deadline passed without connectivity state change'));
                return;
            }
            timer = setTimeout(()=>{
                this.removeConnectivityStateWatcher(watcherObject);
                callback(new Error('Deadline passed without connectivity state change'));
            }, deadlineDate.getTime() - now.getTime());
        }
        const watcherObject = {
            currentState,
            callback,
            timer
        };
        this.connectivityStateWatchers.push(watcherObject);
    }
    /**
     * Get the channelz reference object for this channel. The returned value is
     * garbage if channelz is disabled for this channel.
     * @returns
     */ getChannelzRef() {
        return this.channelzRef;
    }
    createCall(method, deadline, host, parentCall, propagateFlags) {
        if (typeof method !== 'string') {
            throw new TypeError('Channel#createCall: method must be a string');
        }
        if (!(typeof deadline === 'number' || deadline instanceof Date)) {
            throw new TypeError('Channel#createCall: deadline must be a number or Date');
        }
        if (this.connectivityState === connectivity_state_1.ConnectivityState.SHUTDOWN) {
            throw new Error('Channel has been shut down');
        }
        const callNumber = getNewCallNumber();
        this.trace('createCall [' + callNumber + '] method="' + method + '", deadline=' + deadline);
        const finalOptions = {
            deadline: deadline,
            flags: propagateFlags !== null && propagateFlags !== void 0 ? propagateFlags : constants_1.Propagate.DEFAULTS,
            host: host !== null && host !== void 0 ? host : this.defaultAuthority,
            parentCall: parentCall
        };
        const stream = new call_stream_1.Http2CallStream(method, this, finalOptions, this.filterStackFactory, this.credentials._getCallCredentials(), callNumber);
        if (this.channelzEnabled) {
            this.callTracker.addCallStarted();
            stream.addStatusWatcher((status)=>{
                if (status.code === constants_1.Status.OK) {
                    this.callTracker.addCallSucceeded();
                } else {
                    this.callTracker.addCallFailed();
                }
            });
        }
        return stream;
    }
}
exports.ChannelImplementation = ChannelImplementation; //# sourceMappingURL=channel.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/server-call.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Http2ServerCallStream = exports.ServerDuplexStreamImpl = exports.ServerWritableStreamImpl = exports.ServerReadableStreamImpl = exports.ServerUnaryCallImpl = void 0;
const events_1 = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const http2 = __turbopack_context__.r("[externals]/http2 [external] (http2, cjs)");
const stream_1 = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
const zlib = __turbopack_context__.r("[externals]/zlib [external] (zlib, cjs)");
const util_1 = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
const stream_decoder_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/stream-decoder.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const TRACER_NAME = 'server_call';
const unzip = util_1.promisify(zlib.unzip);
const inflate = util_1.promisify(zlib.inflate);
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const GRPC_ACCEPT_ENCODING_HEADER = 'grpc-accept-encoding';
const GRPC_ENCODING_HEADER = 'grpc-encoding';
const GRPC_MESSAGE_HEADER = 'grpc-message';
const GRPC_STATUS_HEADER = 'grpc-status';
const GRPC_TIMEOUT_HEADER = 'grpc-timeout';
const DEADLINE_REGEX = /(\d{1,8})\s*([HMSmun])/;
const deadlineUnitsToMs = {
    H: 3600000,
    M: 60000,
    S: 1000,
    m: 1,
    u: 0.001,
    n: 0.000001
};
const defaultResponseHeaders = {
    // TODO(cjihrig): Remove these encoding headers from the default response
    // once compression is integrated.
    [GRPC_ACCEPT_ENCODING_HEADER]: 'identity,deflate,gzip',
    [GRPC_ENCODING_HEADER]: 'identity',
    [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_OK,
    [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/grpc+proto'
};
const defaultResponseOptions = {
    waitForTrailers: true
};
class ServerUnaryCallImpl extends events_1.EventEmitter {
    constructor(call, metadata, request){
        super();
        this.call = call;
        this.metadata = metadata;
        this.request = request;
        this.cancelled = false;
        this.call.setupSurfaceCall(this);
    }
    getPeer() {
        return this.call.getPeer();
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    getDeadline() {
        return this.call.getDeadline();
    }
    getPath() {
        return this.call.getPath();
    }
}
exports.ServerUnaryCallImpl = ServerUnaryCallImpl;
class ServerReadableStreamImpl extends stream_1.Readable {
    constructor(call, metadata, deserialize, encoding){
        super({
            objectMode: true
        });
        this.call = call;
        this.metadata = metadata;
        this.deserialize = deserialize;
        this.cancelled = false;
        this.call.setupSurfaceCall(this);
        this.call.setupReadable(this, encoding);
    }
    _read(size) {
        if (!this.call.consumeUnpushedMessages(this)) {
            return;
        }
        this.call.resume();
    }
    getPeer() {
        return this.call.getPeer();
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    getDeadline() {
        return this.call.getDeadline();
    }
    getPath() {
        return this.call.getPath();
    }
}
exports.ServerReadableStreamImpl = ServerReadableStreamImpl;
class ServerWritableStreamImpl extends stream_1.Writable {
    constructor(call, metadata, serialize, request){
        super({
            objectMode: true
        });
        this.call = call;
        this.metadata = metadata;
        this.serialize = serialize;
        this.request = request;
        this.cancelled = false;
        this.trailingMetadata = new metadata_1.Metadata();
        this.call.setupSurfaceCall(this);
        this.on('error', (err)=>{
            this.call.sendError(err);
            this.end();
        });
    }
    getPeer() {
        return this.call.getPeer();
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    getDeadline() {
        return this.call.getDeadline();
    }
    getPath() {
        return this.call.getPath();
    }
    _write(chunk, encoding, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback) {
        try {
            const response = this.call.serializeMessage(chunk);
            if (!this.call.write(response)) {
                this.call.once('drain', callback);
                return;
            }
        } catch (err) {
            err.code = constants_1.Status.INTERNAL;
            this.emit('error', err);
        }
        callback();
    }
    _final(callback) {
        this.call.sendStatus({
            code: constants_1.Status.OK,
            details: 'OK',
            metadata: this.trailingMetadata
        });
        callback(null);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    end(metadata) {
        if (metadata) {
            this.trailingMetadata = metadata;
        }
        return super.end();
    }
}
exports.ServerWritableStreamImpl = ServerWritableStreamImpl;
class ServerDuplexStreamImpl extends stream_1.Duplex {
    constructor(call, metadata, serialize, deserialize, encoding){
        super({
            objectMode: true
        });
        this.call = call;
        this.metadata = metadata;
        this.serialize = serialize;
        this.deserialize = deserialize;
        this.cancelled = false;
        this.trailingMetadata = new metadata_1.Metadata();
        this.call.setupSurfaceCall(this);
        this.call.setupReadable(this, encoding);
        this.on('error', (err)=>{
            this.call.sendError(err);
            this.end();
        });
    }
    getPeer() {
        return this.call.getPeer();
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    getDeadline() {
        return this.call.getDeadline();
    }
    getPath() {
        return this.call.getPath();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    end(metadata) {
        if (metadata) {
            this.trailingMetadata = metadata;
        }
        return super.end();
    }
}
exports.ServerDuplexStreamImpl = ServerDuplexStreamImpl;
ServerDuplexStreamImpl.prototype._read = ServerReadableStreamImpl.prototype._read;
ServerDuplexStreamImpl.prototype._write = ServerWritableStreamImpl.prototype._write;
ServerDuplexStreamImpl.prototype._final = ServerWritableStreamImpl.prototype._final;
// Internal class that wraps the HTTP2 request.
class Http2ServerCallStream extends events_1.EventEmitter {
    constructor(stream, handler, options){
        super();
        this.stream = stream;
        this.handler = handler;
        this.options = options;
        this.cancelled = false;
        this.deadlineTimer = null;
        this.statusSent = false;
        this.deadline = Infinity;
        this.wantTrailers = false;
        this.metadataSent = false;
        this.canPush = false;
        this.isPushPending = false;
        this.bufferedMessages = [];
        this.messagesToPush = [];
        this.maxSendMessageSize = constants_1.DEFAULT_MAX_SEND_MESSAGE_LENGTH;
        this.maxReceiveMessageSize = constants_1.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
        this.stream.once('error', (err)=>{
        /* We need an error handler to avoid uncaught error event exceptions, but
             * there is nothing we can reasonably do here. Any error event should
             * have a corresponding close event, which handles emitting the cancelled
             * event. And the stream is now in a bad state, so we can't reasonably
             * expect to be able to send an error over it. */ });
        this.stream.once('close', ()=>{
            var _a;
            trace('Request to method ' + ((_a = this.handler) === null || _a === void 0 ? void 0 : _a.path) + ' stream closed with rstCode ' + this.stream.rstCode);
            if (!this.statusSent) {
                this.cancelled = true;
                this.emit('cancelled', 'cancelled');
                this.emit('streamEnd', false);
                this.sendStatus({
                    code: constants_1.Status.CANCELLED,
                    details: 'Cancelled by client',
                    metadata: null
                });
            }
        });
        this.stream.on('drain', ()=>{
            this.emit('drain');
        });
        if ('grpc.max_send_message_length' in options) {
            this.maxSendMessageSize = options['grpc.max_send_message_length'];
        }
        if ('grpc.max_receive_message_length' in options) {
            this.maxReceiveMessageSize = options['grpc.max_receive_message_length'];
        }
    }
    checkCancelled() {
        /* In some cases the stream can become destroyed before the close event
         * fires. That creates a race condition that this check works around */ if (this.stream.destroyed || this.stream.closed) {
            this.cancelled = true;
        }
        return this.cancelled;
    }
    getDecompressedMessage(message, encoding) {
        if (encoding === 'deflate') {
            return inflate(message.subarray(5));
        } else if (encoding === 'gzip') {
            return unzip(message.subarray(5));
        } else if (encoding === 'identity') {
            return message.subarray(5);
        }
        return Promise.reject({
            code: constants_1.Status.UNIMPLEMENTED,
            details: `Received message compressed with unsupported encoding "${encoding}"`
        });
    }
    sendMetadata(customMetadata) {
        if (this.checkCancelled()) {
            return;
        }
        if (this.metadataSent) {
            return;
        }
        this.metadataSent = true;
        const custom = customMetadata ? customMetadata.toHttp2Headers() : null;
        // TODO(cjihrig): Include compression headers.
        const headers = Object.assign(Object.assign({}, defaultResponseHeaders), custom);
        this.stream.respond(headers, defaultResponseOptions);
    }
    receiveMetadata(headers) {
        const metadata = metadata_1.Metadata.fromHttp2Headers(headers);
        if (logging.isTracerEnabled(TRACER_NAME)) {
            trace('Request to ' + this.handler.path + ' received headers ' + JSON.stringify(metadata.toJSON()));
        }
        // TODO(cjihrig): Receive compression metadata.
        const timeoutHeader = metadata.get(GRPC_TIMEOUT_HEADER);
        if (timeoutHeader.length > 0) {
            const match = timeoutHeader[0].toString().match(DEADLINE_REGEX);
            if (match === null) {
                const err = new Error('Invalid deadline');
                err.code = constants_1.Status.OUT_OF_RANGE;
                this.sendError(err);
                return metadata;
            }
            const timeout = +match[1] * deadlineUnitsToMs[match[2]] | 0;
            const now = new Date();
            this.deadline = now.setMilliseconds(now.getMilliseconds() + timeout);
            this.deadlineTimer = setTimeout(handleExpiredDeadline, timeout, this);
            metadata.remove(GRPC_TIMEOUT_HEADER);
        }
        // Remove several headers that should not be propagated to the application
        metadata.remove(http2.constants.HTTP2_HEADER_ACCEPT_ENCODING);
        metadata.remove(http2.constants.HTTP2_HEADER_TE);
        metadata.remove(http2.constants.HTTP2_HEADER_CONTENT_TYPE);
        metadata.remove('grpc-accept-encoding');
        return metadata;
    }
    receiveUnaryMessage(encoding, next) {
        const { stream } = this;
        let receivedLength = 0;
        const call = this;
        const body = [];
        const limit = this.maxReceiveMessageSize;
        stream.on('data', onData);
        stream.on('end', onEnd);
        stream.on('error', onEnd);
        function onData(chunk) {
            receivedLength += chunk.byteLength;
            if (limit !== -1 && receivedLength > limit) {
                stream.removeListener('data', onData);
                stream.removeListener('end', onEnd);
                stream.removeListener('error', onEnd);
                next({
                    code: constants_1.Status.RESOURCE_EXHAUSTED,
                    details: `Received message larger than max (${receivedLength} vs. ${limit})`
                });
                return;
            }
            body.push(chunk);
        }
        function onEnd(err) {
            stream.removeListener('data', onData);
            stream.removeListener('end', onEnd);
            stream.removeListener('error', onEnd);
            if (err !== undefined) {
                next({
                    code: constants_1.Status.INTERNAL,
                    details: err.message
                });
                return;
            }
            if (receivedLength === 0) {
                next({
                    code: constants_1.Status.INTERNAL,
                    details: 'received empty unary message'
                });
                return;
            }
            call.emit('receiveMessage');
            const requestBytes = Buffer.concat(body, receivedLength);
            const compressed = requestBytes.readUInt8(0) === 1;
            const compressedMessageEncoding = compressed ? encoding : 'identity';
            const decompressedMessage = call.getDecompressedMessage(requestBytes, compressedMessageEncoding);
            if (Buffer.isBuffer(decompressedMessage)) {
                call.safeDeserializeMessage(decompressedMessage, next);
                return;
            }
            decompressedMessage.then((decompressed)=>call.safeDeserializeMessage(decompressed, next), (err)=>next(err.code ? err : {
                    code: constants_1.Status.INTERNAL,
                    details: `Received "grpc-encoding" header "${encoding}" but ${encoding} decompression failed`
                }));
        }
    }
    safeDeserializeMessage(buffer, next) {
        try {
            next(null, this.deserializeMessage(buffer));
        } catch (err) {
            err.code = constants_1.Status.INTERNAL;
            next(err);
        }
    }
    serializeMessage(value) {
        const messageBuffer = this.handler.serialize(value);
        // TODO(cjihrig): Call compression aware serializeMessage().
        const byteLength = messageBuffer.byteLength;
        const output = Buffer.allocUnsafe(byteLength + 5);
        output.writeUInt8(0, 0);
        output.writeUInt32BE(byteLength, 1);
        messageBuffer.copy(output, 5);
        return output;
    }
    deserializeMessage(bytes) {
        return this.handler.deserialize(bytes);
    }
    async sendUnaryMessage(err, value, metadata, flags) {
        if (this.checkCancelled()) {
            return;
        }
        if (metadata === undefined) {
            metadata = null;
        }
        if (err) {
            if (!Object.prototype.hasOwnProperty.call(err, 'metadata') && metadata) {
                err.metadata = metadata;
            }
            this.sendError(err);
            return;
        }
        try {
            const response = this.serializeMessage(value);
            this.write(response);
            this.sendStatus({
                code: constants_1.Status.OK,
                details: 'OK',
                metadata
            });
        } catch (err) {
            err.code = constants_1.Status.INTERNAL;
            this.sendError(err);
        }
    }
    sendStatus(statusObj) {
        var _a;
        this.emit('callEnd', statusObj.code);
        this.emit('streamEnd', statusObj.code === constants_1.Status.OK);
        if (this.checkCancelled()) {
            return;
        }
        trace('Request to method ' + ((_a = this.handler) === null || _a === void 0 ? void 0 : _a.path) + ' ended with status code: ' + constants_1.Status[statusObj.code] + ' details: ' + statusObj.details);
        if (this.deadlineTimer) clearTimeout(this.deadlineTimer);
        if (!this.wantTrailers) {
            this.wantTrailers = true;
            this.stream.once('wantTrailers', ()=>{
                var _a;
                const trailersToSend = Object.assign({
                    [GRPC_STATUS_HEADER]: statusObj.code,
                    [GRPC_MESSAGE_HEADER]: encodeURI(statusObj.details)
                }, (_a = statusObj.metadata) === null || _a === void 0 ? void 0 : _a.toHttp2Headers());
                this.stream.sendTrailers(trailersToSend);
                this.statusSent = true;
            });
            this.sendMetadata();
            this.stream.end();
        }
    }
    sendError(error) {
        const status = {
            code: constants_1.Status.UNKNOWN,
            details: 'message' in error ? error.message : 'Unknown Error',
            metadata: 'metadata' in error && error.metadata !== undefined ? error.metadata : null
        };
        if ('code' in error && typeof error.code === 'number' && Number.isInteger(error.code)) {
            status.code = error.code;
            if ('details' in error && typeof error.details === 'string') {
                status.details = error.details;
            }
        }
        this.sendStatus(status);
    }
    write(chunk) {
        if (this.checkCancelled()) {
            return;
        }
        if (this.maxSendMessageSize !== -1 && chunk.length > this.maxSendMessageSize) {
            this.sendError({
                code: constants_1.Status.RESOURCE_EXHAUSTED,
                details: `Sent message larger than max (${chunk.length} vs. ${this.maxSendMessageSize})`
            });
            return;
        }
        this.sendMetadata();
        this.emit('sendMessage');
        return this.stream.write(chunk);
    }
    resume() {
        this.stream.resume();
    }
    setupSurfaceCall(call) {
        this.once('cancelled', (reason)=>{
            call.cancelled = true;
            call.emit('cancelled', reason);
        });
        this.once('callEnd', (status)=>call.emit('callEnd', status));
    }
    setupReadable(readable, encoding) {
        const decoder = new stream_decoder_1.StreamDecoder();
        let readsDone = false;
        let pendingMessageProcessing = false;
        let pushedEnd = false;
        const maybePushEnd = ()=>{
            if (!pushedEnd && readsDone && !pendingMessageProcessing) {
                pushedEnd = true;
                this.pushOrBufferMessage(readable, null);
            }
        };
        this.stream.on('data', async (data)=>{
            const messages = decoder.write(data);
            pendingMessageProcessing = true;
            this.stream.pause();
            for (const message of messages){
                if (this.maxReceiveMessageSize !== -1 && message.length > this.maxReceiveMessageSize) {
                    this.sendError({
                        code: constants_1.Status.RESOURCE_EXHAUSTED,
                        details: `Received message larger than max (${message.length} vs. ${this.maxReceiveMessageSize})`
                    });
                    return;
                }
                this.emit('receiveMessage');
                const compressed = message.readUInt8(0) === 1;
                const compressedMessageEncoding = compressed ? encoding : 'identity';
                const decompressedMessage = await this.getDecompressedMessage(message, compressedMessageEncoding);
                // Encountered an error with decompression; it'll already have been propogated back
                // Just return early
                if (!decompressedMessage) return;
                this.pushOrBufferMessage(readable, decompressedMessage);
            }
            pendingMessageProcessing = false;
            this.stream.resume();
            maybePushEnd();
        });
        this.stream.once('end', ()=>{
            readsDone = true;
            maybePushEnd();
        });
    }
    consumeUnpushedMessages(readable) {
        this.canPush = true;
        while(this.messagesToPush.length > 0){
            const nextMessage = this.messagesToPush.shift();
            const canPush = readable.push(nextMessage);
            if (nextMessage === null || canPush === false) {
                this.canPush = false;
                break;
            }
        }
        return this.canPush;
    }
    pushOrBufferMessage(readable, messageBytes) {
        if (this.isPushPending) {
            this.bufferedMessages.push(messageBytes);
        } else {
            this.pushMessage(readable, messageBytes);
        }
    }
    async pushMessage(readable, messageBytes) {
        if (messageBytes === null) {
            trace('Received end of stream');
            if (this.canPush) {
                readable.push(null);
            } else {
                this.messagesToPush.push(null);
            }
            return;
        }
        trace('Received message of length ' + messageBytes.length);
        this.isPushPending = true;
        try {
            const deserialized = await this.deserializeMessage(messageBytes);
            if (this.canPush) {
                if (!readable.push(deserialized)) {
                    this.canPush = false;
                    this.stream.pause();
                }
            } else {
                this.messagesToPush.push(deserialized);
            }
        } catch (error) {
            // Ignore any remaining messages when errors occur.
            this.bufferedMessages.length = 0;
            if (!('code' in error && typeof error.code === 'number' && Number.isInteger(error.code) && error.code >= constants_1.Status.OK && error.code <= constants_1.Status.UNAUTHENTICATED)) {
                // The error code is not a valid gRPC code so its being overwritten.
                error.code = constants_1.Status.INTERNAL;
            }
            readable.emit('error', error);
        }
        this.isPushPending = false;
        if (this.bufferedMessages.length > 0) {
            this.pushMessage(readable, this.bufferedMessages.shift());
        }
    }
    getPeer() {
        const socket = this.stream.session.socket;
        if (socket.remoteAddress) {
            if (socket.remotePort) {
                return `${socket.remoteAddress}:${socket.remotePort}`;
            } else {
                return socket.remoteAddress;
            }
        } else {
            return 'unknown';
        }
    }
    getDeadline() {
        return this.deadline;
    }
    getPath() {
        return this.handler.path;
    }
}
exports.Http2ServerCallStream = Http2ServerCallStream;
function handleExpiredDeadline(call) {
    const err = new Error('Deadline exceeded');
    err.code = constants_1.Status.DEADLINE_EXCEEDED;
    call.sendError(err);
    call.cancelled = true;
    call.emit('cancelled', 'deadline');
} //# sourceMappingURL=server-call.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/server-credentials.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ServerCredentials = void 0;
const tls_helpers_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/tls-helpers.js [app-ssr] (ecmascript)");
class ServerCredentials {
    static createInsecure() {
        return new InsecureServerCredentials();
    }
    static createSsl(rootCerts, keyCertPairs, checkClientCertificate = false) {
        if (rootCerts !== null && !Buffer.isBuffer(rootCerts)) {
            throw new TypeError('rootCerts must be null or a Buffer');
        }
        if (!Array.isArray(keyCertPairs)) {
            throw new TypeError('keyCertPairs must be an array');
        }
        if (typeof checkClientCertificate !== 'boolean') {
            throw new TypeError('checkClientCertificate must be a boolean');
        }
        const cert = [];
        const key = [];
        for(let i = 0; i < keyCertPairs.length; i++){
            const pair = keyCertPairs[i];
            if (pair === null || typeof pair !== 'object') {
                throw new TypeError(`keyCertPair[${i}] must be an object`);
            }
            if (!Buffer.isBuffer(pair.private_key)) {
                throw new TypeError(`keyCertPair[${i}].private_key must be a Buffer`);
            }
            if (!Buffer.isBuffer(pair.cert_chain)) {
                throw new TypeError(`keyCertPair[${i}].cert_chain must be a Buffer`);
            }
            cert.push(pair.cert_chain);
            key.push(pair.private_key);
        }
        return new SecureServerCredentials({
            ca: rootCerts || tls_helpers_1.getDefaultRootsData() || undefined,
            cert,
            key,
            requestCert: checkClientCertificate,
            ciphers: tls_helpers_1.CIPHER_SUITES
        });
    }
}
exports.ServerCredentials = ServerCredentials;
class InsecureServerCredentials extends ServerCredentials {
    _isSecure() {
        return false;
    }
    _getSettings() {
        return null;
    }
}
class SecureServerCredentials extends ServerCredentials {
    constructor(options){
        super();
        this.options = options;
    }
    _isSecure() {
        return true;
    }
    _getSettings() {
        return this.options;
    }
} //# sourceMappingURL=server-credentials.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/server.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Server = void 0;
const http2 = __turbopack_context__.r("[externals]/http2 [external] (http2, cjs)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const server_call_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/server-call.js [app-ssr] (ecmascript)");
const server_credentials_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/server-credentials.js [app-ssr] (ecmascript)");
const resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
const channelz_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channelz.js [app-ssr] (ecmascript)");
const { HTTP2_HEADER_PATH } = http2.constants;
const TRACER_NAME = 'server';
function noop() {}
function getUnimplementedStatusResponse(methodName) {
    return {
        code: constants_1.Status.UNIMPLEMENTED,
        details: `The server does not implement the method ${methodName}`
    };
}
function getDefaultHandler(handlerType, methodName) {
    const unimplementedStatusResponse = getUnimplementedStatusResponse(methodName);
    switch(handlerType){
        case 'unary':
            return (call, callback)=>{
                callback(unimplementedStatusResponse, null);
            };
        case 'clientStream':
            return (call, callback)=>{
                callback(unimplementedStatusResponse, null);
            };
        case 'serverStream':
            return (call)=>{
                call.emit('error', unimplementedStatusResponse);
            };
        case 'bidi':
            return (call)=>{
                call.emit('error', unimplementedStatusResponse);
            };
        default:
            throw new Error(`Invalid handlerType ${handlerType}`);
    }
}
class Server {
    constructor(options){
        this.http2ServerList = [];
        this.handlers = new Map();
        this.sessions = new Map();
        this.started = false;
        this.serverAddressString = 'null';
        // Channelz Info
        this.channelzEnabled = true;
        this.channelzTrace = new channelz_1.ChannelzTrace();
        this.callTracker = new channelz_1.ChannelzCallTracker();
        this.listenerChildrenTracker = new channelz_1.ChannelzChildrenTracker();
        this.sessionChildrenTracker = new channelz_1.ChannelzChildrenTracker();
        this.options = options !== null && options !== void 0 ? options : {};
        if (this.options['grpc.enable_channelz'] === 0) {
            this.channelzEnabled = false;
        }
        this.channelzRef = channelz_1.registerChannelzServer(()=>this.getChannelzInfo(), this.channelzEnabled);
        if (this.channelzEnabled) {
            this.channelzTrace.addTrace('CT_INFO', 'Server created');
        }
        this.trace('Server constructed');
    }
    getChannelzInfo() {
        return {
            trace: this.channelzTrace,
            callTracker: this.callTracker,
            listenerChildren: this.listenerChildrenTracker.getChildLists(),
            sessionChildren: this.sessionChildrenTracker.getChildLists()
        };
    }
    getChannelzSessionInfoGetter(session) {
        return ()=>{
            var _a, _b, _c;
            const sessionInfo = this.sessions.get(session);
            const sessionSocket = session.socket;
            const remoteAddress = sessionSocket.remoteAddress ? subchannel_address_1.stringToSubchannelAddress(sessionSocket.remoteAddress, sessionSocket.remotePort) : null;
            const localAddress = sessionSocket.localAddress ? subchannel_address_1.stringToSubchannelAddress(sessionSocket.localAddress, sessionSocket.localPort) : null;
            let tlsInfo;
            if (session.encrypted) {
                const tlsSocket = sessionSocket;
                const cipherInfo = tlsSocket.getCipher();
                const certificate = tlsSocket.getCertificate();
                const peerCertificate = tlsSocket.getPeerCertificate();
                tlsInfo = {
                    cipherSuiteStandardName: (_a = cipherInfo.standardName) !== null && _a !== void 0 ? _a : null,
                    cipherSuiteOtherName: cipherInfo.standardName ? null : cipherInfo.name,
                    localCertificate: certificate && 'raw' in certificate ? certificate.raw : null,
                    remoteCertificate: peerCertificate && 'raw' in peerCertificate ? peerCertificate.raw : null
                };
            } else {
                tlsInfo = null;
            }
            const socketInfo = {
                remoteAddress: remoteAddress,
                localAddress: localAddress,
                security: tlsInfo,
                remoteName: null,
                streamsStarted: sessionInfo.streamTracker.callsStarted,
                streamsSucceeded: sessionInfo.streamTracker.callsSucceeded,
                streamsFailed: sessionInfo.streamTracker.callsFailed,
                messagesSent: sessionInfo.messagesSent,
                messagesReceived: sessionInfo.messagesReceived,
                keepAlivesSent: 0,
                lastLocalStreamCreatedTimestamp: null,
                lastRemoteStreamCreatedTimestamp: sessionInfo.streamTracker.lastCallStartedTimestamp,
                lastMessageSentTimestamp: sessionInfo.lastMessageSentTimestamp,
                lastMessageReceivedTimestamp: sessionInfo.lastMessageReceivedTimestamp,
                localFlowControlWindow: (_b = session.state.localWindowSize) !== null && _b !== void 0 ? _b : null,
                remoteFlowControlWindow: (_c = session.state.remoteWindowSize) !== null && _c !== void 0 ? _c : null
            };
            return socketInfo;
        };
    }
    trace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, '(' + this.channelzRef.id + ') ' + text);
    }
    addProtoService() {
        throw new Error('Not implemented. Use addService() instead');
    }
    addService(service, implementation) {
        if (service === null || typeof service !== 'object' || implementation === null || typeof implementation !== 'object') {
            throw new Error('addService() requires two objects as arguments');
        }
        const serviceKeys = Object.keys(service);
        if (serviceKeys.length === 0) {
            throw new Error('Cannot add an empty service to a server');
        }
        serviceKeys.forEach((name)=>{
            const attrs = service[name];
            let methodType;
            if (attrs.requestStream) {
                if (attrs.responseStream) {
                    methodType = 'bidi';
                } else {
                    methodType = 'clientStream';
                }
            } else {
                if (attrs.responseStream) {
                    methodType = 'serverStream';
                } else {
                    methodType = 'unary';
                }
            }
            let implFn = implementation[name];
            let impl;
            if (implFn === undefined && typeof attrs.originalName === 'string') {
                implFn = implementation[attrs.originalName];
            }
            if (implFn !== undefined) {
                impl = implFn.bind(implementation);
            } else {
                impl = getDefaultHandler(methodType, name);
            }
            const success = this.register(attrs.path, impl, attrs.responseSerialize, attrs.requestDeserialize, methodType);
            if (success === false) {
                throw new Error(`Method handler for ${attrs.path} already provided.`);
            }
        });
    }
    removeService(service) {
        if (service === null || typeof service !== 'object') {
            throw new Error('removeService() requires object as argument');
        }
        const serviceKeys = Object.keys(service);
        serviceKeys.forEach((name)=>{
            const attrs = service[name];
            this.unregister(attrs.path);
        });
    }
    bind(port, creds) {
        throw new Error('Not implemented. Use bindAsync() instead');
    }
    bindAsync(port, creds, callback) {
        if (this.started === true) {
            throw new Error('server is already started');
        }
        if (typeof port !== 'string') {
            throw new TypeError('port must be a string');
        }
        if (creds === null || !(creds instanceof server_credentials_1.ServerCredentials)) {
            throw new TypeError('creds must be a ServerCredentials object');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        const initialPortUri = uri_parser_1.parseUri(port);
        if (initialPortUri === null) {
            throw new Error(`Could not parse port "${port}"`);
        }
        const portUri = resolver_1.mapUriDefaultScheme(initialPortUri);
        if (portUri === null) {
            throw new Error(`Could not get a default scheme for port "${port}"`);
        }
        const serverOptions = {
            maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER
        };
        if ('grpc-node.max_session_memory' in this.options) {
            serverOptions.maxSessionMemory = this.options['grpc-node.max_session_memory'];
        } else {
            /* By default, set a very large max session memory limit, to effectively
             * disable enforcement of the limit. Some testing indicates that Node's
             * behavior degrades badly when this limit is reached, so we solve that
             * by disabling the check entirely. */ serverOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
        }
        if ('grpc.max_concurrent_streams' in this.options) {
            serverOptions.settings = {
                maxConcurrentStreams: this.options['grpc.max_concurrent_streams']
            };
        }
        const deferredCallback = (error, port)=>{
            process.nextTick(()=>callback(error, port));
        };
        const setupServer = ()=>{
            let http2Server;
            if (creds._isSecure()) {
                const secureServerOptions = Object.assign(serverOptions, creds._getSettings());
                http2Server = http2.createSecureServer(secureServerOptions);
                http2Server.on('secureConnection', (socket)=>{
                    /* These errors need to be handled by the user of Http2SecureServer,
                     * according to https://github.com/nodejs/node/issues/35824 */ socket.on('error', (e)=>{
                        this.trace('An incoming TLS connection closed with error: ' + e.message);
                    });
                });
            } else {
                http2Server = http2.createServer(serverOptions);
            }
            http2Server.setTimeout(0, noop);
            this._setupHandlers(http2Server);
            return http2Server;
        };
        const bindSpecificPort = (addressList, portNum, previousCount)=>{
            if (addressList.length === 0) {
                return Promise.resolve({
                    port: portNum,
                    count: previousCount
                });
            }
            return Promise.all(addressList.map((address)=>{
                this.trace('Attempting to bind ' + subchannel_address_1.subchannelAddressToString(address));
                let addr;
                if (subchannel_address_1.isTcpSubchannelAddress(address)) {
                    addr = {
                        host: address.host,
                        port: portNum
                    };
                } else {
                    addr = address;
                }
                const http2Server = setupServer();
                return new Promise((resolve, reject)=>{
                    const onError = (err)=>{
                        this.trace('Failed to bind ' + subchannel_address_1.subchannelAddressToString(address) + ' with error ' + err.message);
                        resolve(err);
                    };
                    http2Server.once('error', onError);
                    http2Server.listen(addr, ()=>{
                        const boundAddress = http2Server.address();
                        let boundSubchannelAddress;
                        if (typeof boundAddress === 'string') {
                            boundSubchannelAddress = {
                                path: boundAddress
                            };
                        } else {
                            boundSubchannelAddress = {
                                host: boundAddress.address,
                                port: boundAddress.port
                            };
                        }
                        let channelzRef;
                        channelzRef = channelz_1.registerChannelzSocket(subchannel_address_1.subchannelAddressToString(boundSubchannelAddress), ()=>{
                            return {
                                localAddress: boundSubchannelAddress,
                                remoteAddress: null,
                                security: null,
                                remoteName: null,
                                streamsStarted: 0,
                                streamsSucceeded: 0,
                                streamsFailed: 0,
                                messagesSent: 0,
                                messagesReceived: 0,
                                keepAlivesSent: 0,
                                lastLocalStreamCreatedTimestamp: null,
                                lastRemoteStreamCreatedTimestamp: null,
                                lastMessageSentTimestamp: null,
                                lastMessageReceivedTimestamp: null,
                                localFlowControlWindow: null,
                                remoteFlowControlWindow: null
                            };
                        }, this.channelzEnabled);
                        if (this.channelzEnabled) {
                            this.listenerChildrenTracker.refChild(channelzRef);
                        }
                        this.http2ServerList.push({
                            server: http2Server,
                            channelzRef: channelzRef
                        });
                        this.trace('Successfully bound ' + subchannel_address_1.subchannelAddressToString(boundSubchannelAddress));
                        resolve('port' in boundSubchannelAddress ? boundSubchannelAddress.port : portNum);
                        http2Server.removeListener('error', onError);
                    });
                });
            })).then((results)=>{
                let count = 0;
                for (const result of results){
                    if (typeof result === 'number') {
                        count += 1;
                        if (result !== portNum) {
                            throw new Error('Invalid state: multiple port numbers added from single address');
                        }
                    }
                }
                return {
                    port: portNum,
                    count: count + previousCount
                };
            });
        };
        const bindWildcardPort = (addressList)=>{
            if (addressList.length === 0) {
                return Promise.resolve({
                    port: 0,
                    count: 0
                });
            }
            const address = addressList[0];
            const http2Server = setupServer();
            return new Promise((resolve, reject)=>{
                const onError = (err)=>{
                    this.trace('Failed to bind ' + subchannel_address_1.subchannelAddressToString(address) + ' with error ' + err.message);
                    resolve(bindWildcardPort(addressList.slice(1)));
                };
                http2Server.once('error', onError);
                http2Server.listen(address, ()=>{
                    const boundAddress = http2Server.address();
                    const boundSubchannelAddress = {
                        host: boundAddress.address,
                        port: boundAddress.port
                    };
                    let channelzRef;
                    channelzRef = channelz_1.registerChannelzSocket(subchannel_address_1.subchannelAddressToString(boundSubchannelAddress), ()=>{
                        return {
                            localAddress: boundSubchannelAddress,
                            remoteAddress: null,
                            security: null,
                            remoteName: null,
                            streamsStarted: 0,
                            streamsSucceeded: 0,
                            streamsFailed: 0,
                            messagesSent: 0,
                            messagesReceived: 0,
                            keepAlivesSent: 0,
                            lastLocalStreamCreatedTimestamp: null,
                            lastRemoteStreamCreatedTimestamp: null,
                            lastMessageSentTimestamp: null,
                            lastMessageReceivedTimestamp: null,
                            localFlowControlWindow: null,
                            remoteFlowControlWindow: null
                        };
                    }, this.channelzEnabled);
                    if (this.channelzEnabled) {
                        this.listenerChildrenTracker.refChild(channelzRef);
                    }
                    this.http2ServerList.push({
                        server: http2Server,
                        channelzRef: channelzRef
                    });
                    this.trace('Successfully bound ' + subchannel_address_1.subchannelAddressToString(boundSubchannelAddress));
                    resolve(bindSpecificPort(addressList.slice(1), boundAddress.port, 1));
                    http2Server.removeListener('error', onError);
                });
            });
        };
        const resolverListener = {
            onSuccessfulResolution: (addressList, serviceConfig, serviceConfigError)=>{
                // We only want one resolution result. Discard all future results
                resolverListener.onSuccessfulResolution = ()=>{};
                if (addressList.length === 0) {
                    deferredCallback(new Error(`No addresses resolved for port ${port}`), 0);
                    return;
                }
                let bindResultPromise;
                if (subchannel_address_1.isTcpSubchannelAddress(addressList[0])) {
                    if (addressList[0].port === 0) {
                        bindResultPromise = bindWildcardPort(addressList);
                    } else {
                        bindResultPromise = bindSpecificPort(addressList, addressList[0].port, 0);
                    }
                } else {
                    // Use an arbitrary non-zero port for non-TCP addresses
                    bindResultPromise = bindSpecificPort(addressList, 1, 0);
                }
                bindResultPromise.then((bindResult)=>{
                    if (bindResult.count === 0) {
                        const errorString = `No address added out of total ${addressList.length} resolved`;
                        logging.log(constants_1.LogVerbosity.ERROR, errorString);
                        deferredCallback(new Error(errorString), 0);
                    } else {
                        if (bindResult.count < addressList.length) {
                            logging.log(constants_1.LogVerbosity.INFO, `WARNING Only ${bindResult.count} addresses added out of total ${addressList.length} resolved`);
                        }
                        deferredCallback(null, bindResult.port);
                    }
                }, (error)=>{
                    const errorString = `No address added out of total ${addressList.length} resolved`;
                    logging.log(constants_1.LogVerbosity.ERROR, errorString);
                    deferredCallback(new Error(errorString), 0);
                });
            },
            onError: (error)=>{
                deferredCallback(new Error(error.details), 0);
            }
        };
        const resolver = resolver_1.createResolver(portUri, resolverListener, this.options);
        resolver.updateResolution();
    }
    forceShutdown() {
        // Close the server if it is still running.
        for (const { server: http2Server, channelzRef: ref } of this.http2ServerList){
            if (http2Server.listening) {
                http2Server.close(()=>{
                    if (this.channelzEnabled) {
                        this.listenerChildrenTracker.unrefChild(ref);
                        channelz_1.unregisterChannelzRef(ref);
                    }
                });
            }
        }
        this.started = false;
        // Always destroy any available sessions. It's possible that one or more
        // tryShutdown() calls are in progress. Don't wait on them to finish.
        this.sessions.forEach((channelzInfo, session)=>{
            // Cast NGHTTP2_CANCEL to any because TypeScript doesn't seem to
            // recognize destroy(code) as a valid signature.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session.destroy(http2.constants.NGHTTP2_CANCEL);
        });
        this.sessions.clear();
        if (this.channelzEnabled) {
            channelz_1.unregisterChannelzRef(this.channelzRef);
        }
    }
    register(name, handler, serialize, deserialize, type) {
        if (this.handlers.has(name)) {
            return false;
        }
        this.handlers.set(name, {
            func: handler,
            serialize,
            deserialize,
            type,
            path: name
        });
        return true;
    }
    unregister(name) {
        return this.handlers.delete(name);
    }
    start() {
        if (this.http2ServerList.length === 0 || this.http2ServerList.every(({ server: http2Server })=>http2Server.listening !== true)) {
            throw new Error('server must be bound in order to start');
        }
        if (this.started === true) {
            throw new Error('server is already started');
        }
        if (this.channelzEnabled) {
            this.channelzTrace.addTrace('CT_INFO', 'Starting');
        }
        this.started = true;
    }
    tryShutdown(callback) {
        const wrappedCallback = (error)=>{
            if (this.channelzEnabled) {
                channelz_1.unregisterChannelzRef(this.channelzRef);
            }
            callback(error);
        };
        let pendingChecks = 0;
        function maybeCallback() {
            pendingChecks--;
            if (pendingChecks === 0) {
                wrappedCallback();
            }
        }
        // Close the server if necessary.
        this.started = false;
        for (const { server: http2Server, channelzRef: ref } of this.http2ServerList){
            if (http2Server.listening) {
                pendingChecks++;
                http2Server.close(()=>{
                    if (this.channelzEnabled) {
                        this.listenerChildrenTracker.unrefChild(ref);
                        channelz_1.unregisterChannelzRef(ref);
                    }
                    maybeCallback();
                });
            }
        }
        this.sessions.forEach((channelzInfo, session)=>{
            if (!session.closed) {
                pendingChecks += 1;
                session.close(maybeCallback);
            }
        });
        if (pendingChecks === 0) {
            wrappedCallback();
        }
    }
    addHttp2Port() {
        throw new Error('Not yet implemented');
    }
    /**
     * Get the channelz reference object for this server. The returned value is
     * garbage if channelz is disabled for this server.
     * @returns
     */ getChannelzRef() {
        return this.channelzRef;
    }
    _verifyContentType(stream, headers) {
        const contentType = headers[http2.constants.HTTP2_HEADER_CONTENT_TYPE];
        if (typeof contentType !== 'string' || !contentType.startsWith('application/grpc')) {
            stream.respond({
                [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE
            }, {
                endStream: true
            });
            return false;
        }
        return true;
    }
    _retrieveHandler(headers) {
        const path = headers[HTTP2_HEADER_PATH];
        this.trace('Received call to method ' + path + ' at address ' + this.serverAddressString);
        const handler = this.handlers.get(path);
        if (handler === undefined) {
            this.trace('No handler registered for method ' + path + '. Sending UNIMPLEMENTED status.');
            throw getUnimplementedStatusResponse(path);
        }
        return handler;
    }
    _respondWithError(err, stream, channelzSessionInfo = null) {
        const call = new server_call_1.Http2ServerCallStream(stream, null, this.options);
        if (err.code === undefined) {
            err.code = constants_1.Status.INTERNAL;
        }
        if (this.channelzEnabled) {
            this.callTracker.addCallFailed();
            channelzSessionInfo === null || channelzSessionInfo === void 0 ? void 0 : channelzSessionInfo.streamTracker.addCallFailed();
        }
        call.sendError(err);
    }
    _channelzHandler(stream, headers) {
        const channelzSessionInfo = this.sessions.get(stream.session);
        this.callTracker.addCallStarted();
        channelzSessionInfo === null || channelzSessionInfo === void 0 ? void 0 : channelzSessionInfo.streamTracker.addCallStarted();
        if (!this._verifyContentType(stream, headers)) {
            this.callTracker.addCallFailed();
            channelzSessionInfo === null || channelzSessionInfo === void 0 ? void 0 : channelzSessionInfo.streamTracker.addCallFailed();
            return;
        }
        let handler;
        try {
            handler = this._retrieveHandler(headers);
        } catch (err) {
            this._respondWithError(err, stream, channelzSessionInfo);
            return;
        }
        const call = new server_call_1.Http2ServerCallStream(stream, handler, this.options);
        call.once('callEnd', (code)=>{
            if (code === constants_1.Status.OK) {
                this.callTracker.addCallSucceeded();
            } else {
                this.callTracker.addCallFailed();
            }
        });
        if (channelzSessionInfo) {
            call.once('streamEnd', (success)=>{
                if (success) {
                    channelzSessionInfo.streamTracker.addCallSucceeded();
                } else {
                    channelzSessionInfo.streamTracker.addCallFailed();
                }
            });
            call.on('sendMessage', ()=>{
                channelzSessionInfo.messagesSent += 1;
                channelzSessionInfo.lastMessageSentTimestamp = new Date();
            });
            call.on('receiveMessage', ()=>{
                channelzSessionInfo.messagesReceived += 1;
                channelzSessionInfo.lastMessageReceivedTimestamp = new Date();
            });
        }
        if (!this._runHandlerForCall(call, handler, headers)) {
            this.callTracker.addCallFailed();
            channelzSessionInfo === null || channelzSessionInfo === void 0 ? void 0 : channelzSessionInfo.streamTracker.addCallFailed();
            call.sendError({
                code: constants_1.Status.INTERNAL,
                details: `Unknown handler type: ${handler.type}`
            });
        }
    }
    _streamHandler(stream, headers) {
        if (this._verifyContentType(stream, headers) !== true) {
            return;
        }
        let handler;
        try {
            handler = this._retrieveHandler(headers);
        } catch (err) {
            this._respondWithError(err, stream, null);
            return;
        }
        const call = new server_call_1.Http2ServerCallStream(stream, handler, this.options);
        if (!this._runHandlerForCall(call, handler, headers)) {
            call.sendError({
                code: constants_1.Status.INTERNAL,
                details: `Unknown handler type: ${handler.type}`
            });
        }
    }
    _runHandlerForCall(call, handler, headers) {
        var _a;
        const metadata = call.receiveMetadata(headers);
        const encoding = (_a = metadata.get('grpc-encoding')[0]) !== null && _a !== void 0 ? _a : 'identity';
        metadata.remove('grpc-encoding');
        const { type } = handler;
        if (type === 'unary') {
            handleUnary(call, handler, metadata, encoding);
        } else if (type === 'clientStream') {
            handleClientStreaming(call, handler, metadata, encoding);
        } else if (type === 'serverStream') {
            handleServerStreaming(call, handler, metadata, encoding);
        } else if (type === 'bidi') {
            handleBidiStreaming(call, handler, metadata, encoding);
        } else {
            return false;
        }
        return true;
    }
    _setupHandlers(http2Server) {
        if (http2Server === null) {
            return;
        }
        const serverAddress = http2Server.address();
        let serverAddressString = 'null';
        if (serverAddress) {
            if (typeof serverAddress === 'string') {
                serverAddressString = serverAddress;
            } else {
                serverAddressString = serverAddress.address + ':' + serverAddress.port;
            }
        }
        this.serverAddressString = serverAddressString;
        const handler = this.channelzEnabled ? this._channelzHandler : this._streamHandler;
        http2Server.on('stream', handler.bind(this));
        http2Server.on('session', (session)=>{
            var _a;
            if (!this.started) {
                session.destroy();
                return;
            }
            let channelzRef;
            channelzRef = channelz_1.registerChannelzSocket((_a = session.socket.remoteAddress) !== null && _a !== void 0 ? _a : 'unknown', this.getChannelzSessionInfoGetter(session), this.channelzEnabled);
            const channelzSessionInfo = {
                ref: channelzRef,
                streamTracker: new channelz_1.ChannelzCallTracker(),
                messagesSent: 0,
                messagesReceived: 0,
                lastMessageSentTimestamp: null,
                lastMessageReceivedTimestamp: null
            };
            this.sessions.set(session, channelzSessionInfo);
            const clientAddress = session.socket.remoteAddress;
            if (this.channelzEnabled) {
                this.channelzTrace.addTrace('CT_INFO', 'Connection established by client ' + clientAddress);
                this.sessionChildrenTracker.refChild(channelzRef);
            }
            session.on('close', ()=>{
                if (this.channelzEnabled) {
                    this.channelzTrace.addTrace('CT_INFO', 'Connection dropped by client ' + clientAddress);
                    this.sessionChildrenTracker.unrefChild(channelzRef);
                    channelz_1.unregisterChannelzRef(channelzRef);
                }
                this.sessions.delete(session);
            });
        });
    }
}
exports.Server = Server;
function handleUnary(call, handler, metadata, encoding) {
    call.receiveUnaryMessage(encoding, (err, request)=>{
        if (err) {
            call.sendError(err);
            return;
        }
        if (request === undefined || call.cancelled) {
            return;
        }
        const emitter = new server_call_1.ServerUnaryCallImpl(call, metadata, request);
        handler.func(emitter, (err, value, trailer, flags)=>{
            call.sendUnaryMessage(err, value, trailer, flags);
        });
    });
}
function handleClientStreaming(call, handler, metadata, encoding) {
    const stream = new server_call_1.ServerReadableStreamImpl(call, metadata, handler.deserialize, encoding);
    function respond(err, value, trailer, flags) {
        stream.destroy();
        call.sendUnaryMessage(err, value, trailer, flags);
    }
    if (call.cancelled) {
        return;
    }
    stream.on('error', respond);
    handler.func(stream, respond);
}
function handleServerStreaming(call, handler, metadata, encoding) {
    call.receiveUnaryMessage(encoding, (err, request)=>{
        if (err) {
            call.sendError(err);
            return;
        }
        if (request === undefined || call.cancelled) {
            return;
        }
        const stream = new server_call_1.ServerWritableStreamImpl(call, metadata, handler.serialize, request);
        handler.func(stream);
    });
}
function handleBidiStreaming(call, handler, metadata, encoding) {
    const stream = new server_call_1.ServerDuplexStreamImpl(call, metadata, handler.serialize, handler.deserialize, encoding);
    if (call.cancelled) {
        return;
    }
    handler.func(stream);
} //# sourceMappingURL=server.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/status-builder.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StatusBuilder = void 0;
/**
 * A builder for gRPC status objects.
 */ class StatusBuilder {
    constructor(){
        this.code = null;
        this.details = null;
        this.metadata = null;
    }
    /**
     * Adds a status code to the builder.
     */ withCode(code) {
        this.code = code;
        return this;
    }
    /**
     * Adds details to the builder.
     */ withDetails(details) {
        this.details = details;
        return this;
    }
    /**
     * Adds metadata to the builder.
     */ withMetadata(metadata) {
        this.metadata = metadata;
        return this;
    }
    /**
     * Builds the status object.
     */ build() {
        const status = {};
        if (this.code !== null) {
            status.code = this.code;
        }
        if (this.details !== null) {
            status.details = this.details;
        }
        if (this.metadata !== null) {
            status.metadata = this.metadata;
        }
        return status;
    }
}
exports.StatusBuilder = StatusBuilder; //# sourceMappingURL=status-builder.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/duration.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2022 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isDuration = exports.durationToMs = exports.msToDuration = void 0;
function msToDuration(millis) {
    return {
        seconds: millis / 1000 | 0,
        nanos: millis % 1000 * 1000000 | 0
    };
}
exports.msToDuration = msToDuration;
function durationToMs(duration) {
    return duration.seconds * 1000 + duration.nanos / 1000000 | 0;
}
exports.durationToMs = durationToMs;
function isDuration(value) {
    return typeof value.seconds === 'number' && typeof value.nanos === 'number';
}
exports.isDuration = isDuration; //# sourceMappingURL=duration.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-interface.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2022 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseSubchannelWrapper = void 0;
class BaseSubchannelWrapper {
    constructor(child){
        this.child = child;
    }
    getConnectivityState() {
        return this.child.getConnectivityState();
    }
    addConnectivityStateListener(listener) {
        this.child.addConnectivityStateListener(listener);
    }
    removeConnectivityStateListener(listener) {
        this.child.removeConnectivityStateListener(listener);
    }
    startConnecting() {
        this.child.startConnecting();
    }
    getAddress() {
        return this.child.getAddress();
    }
    ref() {
        this.child.ref();
    }
    unref() {
        this.child.unref();
    }
    getChannelzRef() {
        return this.child.getChannelzRef();
    }
    getRealSubchannel() {
        return this.child.getRealSubchannel();
    }
}
exports.BaseSubchannelWrapper = BaseSubchannelWrapper; //# sourceMappingURL=subchannel-interface.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-outlier-detection.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2022 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setup = exports.OutlierDetectionLoadBalancer = exports.OutlierDetectionLoadBalancingConfig = void 0;
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const duration_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/duration.js [app-ssr] (ecmascript)");
const experimental_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/experimental.js [app-ssr] (ecmascript)");
const filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter.js [app-ssr] (ecmascript)");
const load_balancer_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer.js [app-ssr] (ecmascript)");
const load_balancer_child_handler_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-child-handler.js [app-ssr] (ecmascript)");
const picker_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/picker.js [app-ssr] (ecmascript)");
const subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
const subchannel_interface_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-interface.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const TRACER_NAME = 'outlier_detection';
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const TYPE_NAME = 'outlier_detection';
const OUTLIER_DETECTION_ENABLED = ((_a = process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION) !== null && _a !== void 0 ? _a : 'true') === 'true';
const defaultSuccessRateEjectionConfig = {
    stdev_factor: 1900,
    enforcement_percentage: 100,
    minimum_hosts: 5,
    request_volume: 100
};
const defaultFailurePercentageEjectionConfig = {
    threshold: 85,
    enforcement_percentage: 100,
    minimum_hosts: 5,
    request_volume: 50
};
function validateFieldType(obj, fieldName, expectedType, objectName) {
    if (fieldName in obj && typeof obj[fieldName] !== expectedType) {
        const fullFieldName = objectName ? `${objectName}.${fieldName}` : fieldName;
        throw new Error(`outlier detection config ${fullFieldName} parse error: expected ${expectedType}, got ${typeof obj[fieldName]}`);
    }
}
function validatePositiveDuration(obj, fieldName, objectName) {
    const fullFieldName = objectName ? `${objectName}.${fieldName}` : fieldName;
    if (fieldName in obj) {
        if (!duration_1.isDuration(obj[fieldName])) {
            throw new Error(`outlier detection config ${fullFieldName} parse error: expected Duration, got ${typeof obj[fieldName]}`);
        }
        if (!(obj[fieldName].seconds >= 0 && obj[fieldName].seconds <= 315576000000 && obj[fieldName].nanos >= 0 && obj[fieldName].nanos <= 999999999)) {
            throw new Error(`outlier detection config ${fullFieldName} parse error: values out of range for non-negative Duaration`);
        }
    }
}
function validatePercentage(obj, fieldName, objectName) {
    const fullFieldName = objectName ? `${objectName}.${fieldName}` : fieldName;
    validateFieldType(obj, fieldName, 'number', objectName);
    if (fieldName in obj && !(obj[fieldName] >= 0 && obj[fieldName] <= 100)) {
        throw new Error(`outlier detection config ${fullFieldName} parse error: value out of range for percentage (0-100)`);
    }
}
class OutlierDetectionLoadBalancingConfig {
    constructor(intervalMs, baseEjectionTimeMs, maxEjectionTimeMs, maxEjectionPercent, successRateEjection, failurePercentageEjection, childPolicy){
        this.childPolicy = childPolicy;
        this.intervalMs = intervalMs !== null && intervalMs !== void 0 ? intervalMs : 10000;
        this.baseEjectionTimeMs = baseEjectionTimeMs !== null && baseEjectionTimeMs !== void 0 ? baseEjectionTimeMs : 30000;
        this.maxEjectionTimeMs = maxEjectionTimeMs !== null && maxEjectionTimeMs !== void 0 ? maxEjectionTimeMs : 300000;
        this.maxEjectionPercent = maxEjectionPercent !== null && maxEjectionPercent !== void 0 ? maxEjectionPercent : 10;
        this.successRateEjection = successRateEjection ? Object.assign(Object.assign({}, defaultSuccessRateEjectionConfig), successRateEjection) : null;
        this.failurePercentageEjection = failurePercentageEjection ? Object.assign(Object.assign({}, defaultFailurePercentageEjectionConfig), failurePercentageEjection) : null;
    }
    getLoadBalancerName() {
        return TYPE_NAME;
    }
    toJsonObject() {
        return {
            interval: duration_1.msToDuration(this.intervalMs),
            base_ejection_time: duration_1.msToDuration(this.baseEjectionTimeMs),
            max_ejection_time: duration_1.msToDuration(this.maxEjectionTimeMs),
            max_ejection_percent: this.maxEjectionPercent,
            success_rate_ejection: this.successRateEjection,
            failure_percentage_ejection: this.failurePercentageEjection,
            child_policy: this.childPolicy.map((policy)=>policy.toJsonObject())
        };
    }
    getIntervalMs() {
        return this.intervalMs;
    }
    getBaseEjectionTimeMs() {
        return this.baseEjectionTimeMs;
    }
    getMaxEjectionTimeMs() {
        return this.maxEjectionTimeMs;
    }
    getMaxEjectionPercent() {
        return this.maxEjectionPercent;
    }
    getSuccessRateEjectionConfig() {
        return this.successRateEjection;
    }
    getFailurePercentageEjectionConfig() {
        return this.failurePercentageEjection;
    }
    getChildPolicy() {
        return this.childPolicy;
    }
    copyWithChildPolicy(childPolicy) {
        return new OutlierDetectionLoadBalancingConfig(this.intervalMs, this.baseEjectionTimeMs, this.maxEjectionTimeMs, this.maxEjectionPercent, this.successRateEjection, this.failurePercentageEjection, childPolicy);
    }
    static createFromJson(obj) {
        var _a;
        validatePositiveDuration(obj, 'interval');
        validatePositiveDuration(obj, 'base_ejection_time');
        validatePositiveDuration(obj, 'max_ejection_time');
        validatePercentage(obj, 'max_ejection_percent');
        if ('success_rate_ejection' in obj) {
            if (typeof obj.success_rate_ejection !== 'object') {
                throw new Error('outlier detection config success_rate_ejection must be an object');
            }
            validateFieldType(obj.success_rate_ejection, 'stdev_factor', 'number', 'success_rate_ejection');
            validatePercentage(obj.success_rate_ejection, 'enforcement_percentage', 'success_rate_ejection');
            validateFieldType(obj.success_rate_ejection, 'minimum_hosts', 'number', 'success_rate_ejection');
            validateFieldType(obj.success_rate_ejection, 'request_volume', 'number', 'success_rate_ejection');
        }
        if ('failure_percentage_ejection' in obj) {
            if (typeof obj.failure_percentage_ejection !== 'object') {
                throw new Error('outlier detection config failure_percentage_ejection must be an object');
            }
            validatePercentage(obj.failure_percentage_ejection, 'threshold', 'failure_percentage_ejection');
            validatePercentage(obj.failure_percentage_ejection, 'enforcement_percentage', 'failure_percentage_ejection');
            validateFieldType(obj.failure_percentage_ejection, 'minimum_hosts', 'number', 'failure_percentage_ejection');
            validateFieldType(obj.failure_percentage_ejection, 'request_volume', 'number', 'failure_percentage_ejection');
        }
        return new OutlierDetectionLoadBalancingConfig(obj.interval ? duration_1.durationToMs(obj.interval) : null, obj.base_ejection_time ? duration_1.durationToMs(obj.base_ejection_time) : null, obj.max_ejection_time ? duration_1.durationToMs(obj.max_ejection_time) : null, (_a = obj.max_ejection_percent) !== null && _a !== void 0 ? _a : null, obj.success_rate_ejection, obj.failure_percentage_ejection, obj.child_policy.map(load_balancer_1.validateLoadBalancingConfig));
    }
}
exports.OutlierDetectionLoadBalancingConfig = OutlierDetectionLoadBalancingConfig;
class OutlierDetectionSubchannelWrapper extends subchannel_interface_1.BaseSubchannelWrapper {
    constructor(childSubchannel, mapEntry){
        super(childSubchannel);
        this.mapEntry = mapEntry;
        this.stateListeners = [];
        this.ejected = false;
        this.refCount = 0;
        this.childSubchannelState = childSubchannel.getConnectivityState();
        childSubchannel.addConnectivityStateListener((subchannel, previousState, newState)=>{
            this.childSubchannelState = newState;
            if (!this.ejected) {
                for (const listener of this.stateListeners){
                    listener(this, previousState, newState);
                }
            }
        });
    }
    getConnectivityState() {
        if (this.ejected) {
            return connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE;
        } else {
            return this.childSubchannelState;
        }
    }
    /**
     * Add a listener function to be called whenever the wrapper's
     * connectivity state changes.
     * @param listener
     */ addConnectivityStateListener(listener) {
        this.stateListeners.push(listener);
    }
    /**
     * Remove a listener previously added with `addConnectivityStateListener`
     * @param listener A reference to a function previously passed to
     *     `addConnectivityStateListener`
     */ removeConnectivityStateListener(listener) {
        const listenerIndex = this.stateListeners.indexOf(listener);
        if (listenerIndex > -1) {
            this.stateListeners.splice(listenerIndex, 1);
        }
    }
    ref() {
        this.child.ref();
        this.refCount += 1;
    }
    unref() {
        this.child.unref();
        this.refCount -= 1;
        if (this.refCount <= 0) {
            if (this.mapEntry) {
                const index = this.mapEntry.subchannelWrappers.indexOf(this);
                if (index >= 0) {
                    this.mapEntry.subchannelWrappers.splice(index, 1);
                }
            }
        }
    }
    eject() {
        this.ejected = true;
        for (const listener of this.stateListeners){
            listener(this, this.childSubchannelState, connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE);
        }
    }
    uneject() {
        this.ejected = false;
        for (const listener of this.stateListeners){
            listener(this, connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE, this.childSubchannelState);
        }
    }
    getMapEntry() {
        return this.mapEntry;
    }
    getWrappedSubchannel() {
        return this.child;
    }
}
function createEmptyBucket() {
    return {
        success: 0,
        failure: 0
    };
}
class CallCounter {
    constructor(){
        this.activeBucket = createEmptyBucket();
        this.inactiveBucket = createEmptyBucket();
    }
    addSuccess() {
        this.activeBucket.success += 1;
    }
    addFailure() {
        this.activeBucket.failure += 1;
    }
    switchBuckets() {
        this.inactiveBucket = this.activeBucket;
        this.activeBucket = createEmptyBucket();
    }
    getLastSuccesses() {
        return this.inactiveBucket.success;
    }
    getLastFailures() {
        return this.inactiveBucket.failure;
    }
}
class OutlierDetectionCounterFilter extends filter_1.BaseFilter {
    constructor(callCounter){
        super();
        this.callCounter = callCounter;
    }
    receiveTrailers(status) {
        if (status.code === constants_1.Status.OK) {
            this.callCounter.addSuccess();
        } else {
            this.callCounter.addFailure();
        }
        return status;
    }
}
class OutlierDetectionCounterFilterFactory {
    constructor(callCounter){
        this.callCounter = callCounter;
    }
    createFilter(callStream) {
        return new OutlierDetectionCounterFilter(this.callCounter);
    }
}
class OutlierDetectionPicker {
    constructor(wrappedPicker, countCalls){
        this.wrappedPicker = wrappedPicker;
        this.countCalls = countCalls;
    }
    pick(pickArgs) {
        const wrappedPick = this.wrappedPicker.pick(pickArgs);
        if (wrappedPick.pickResultType === picker_1.PickResultType.COMPLETE) {
            const subchannelWrapper = wrappedPick.subchannel;
            const mapEntry = subchannelWrapper.getMapEntry();
            if (mapEntry) {
                const extraFilterFactories = [
                    ...wrappedPick.extraFilterFactories
                ];
                if (this.countCalls) {
                    extraFilterFactories.push(new OutlierDetectionCounterFilterFactory(mapEntry.counter));
                }
                return Object.assign(Object.assign({}, wrappedPick), {
                    subchannel: subchannelWrapper.getWrappedSubchannel(),
                    extraFilterFactories: extraFilterFactories
                });
            } else {
                return Object.assign(Object.assign({}, wrappedPick), {
                    subchannel: subchannelWrapper.getWrappedSubchannel()
                });
            }
        } else {
            return wrappedPick;
        }
    }
}
class OutlierDetectionLoadBalancer {
    constructor(channelControlHelper){
        this.addressMap = new Map();
        this.latestConfig = null;
        this.timerStartTime = null;
        this.childBalancer = new load_balancer_child_handler_1.ChildLoadBalancerHandler(experimental_1.createChildChannelControlHelper(channelControlHelper, {
            createSubchannel: (subchannelAddress, subchannelArgs)=>{
                const originalSubchannel = channelControlHelper.createSubchannel(subchannelAddress, subchannelArgs);
                const mapEntry = this.addressMap.get(subchannel_address_1.subchannelAddressToString(subchannelAddress));
                const subchannelWrapper = new OutlierDetectionSubchannelWrapper(originalSubchannel, mapEntry);
                if ((mapEntry === null || mapEntry === void 0 ? void 0 : mapEntry.currentEjectionTimestamp) !== null) {
                    // If the address is ejected, propagate that to the new subchannel wrapper
                    subchannelWrapper.eject();
                }
                mapEntry === null || mapEntry === void 0 ? void 0 : mapEntry.subchannelWrappers.push(subchannelWrapper);
                return subchannelWrapper;
            },
            updateState: (connectivityState, picker)=>{
                if (connectivityState === connectivity_state_1.ConnectivityState.READY) {
                    channelControlHelper.updateState(connectivityState, new OutlierDetectionPicker(picker, this.isCountingEnabled()));
                } else {
                    channelControlHelper.updateState(connectivityState, picker);
                }
            }
        }));
        this.ejectionTimer = setInterval(()=>{}, 0);
        clearInterval(this.ejectionTimer);
    }
    isCountingEnabled() {
        return this.latestConfig !== null && (this.latestConfig.getSuccessRateEjectionConfig() !== null || this.latestConfig.getFailurePercentageEjectionConfig() !== null);
    }
    getCurrentEjectionPercent() {
        let ejectionCount = 0;
        for (const mapEntry of this.addressMap.values()){
            if (mapEntry.currentEjectionTimestamp !== null) {
                ejectionCount += 1;
            }
        }
        return ejectionCount * 100 / this.addressMap.size;
    }
    runSuccessRateCheck(ejectionTimestamp) {
        if (!this.latestConfig) {
            return;
        }
        const successRateConfig = this.latestConfig.getSuccessRateEjectionConfig();
        if (!successRateConfig) {
            return;
        }
        trace('Running success rate check');
        // Step 1
        const targetRequestVolume = successRateConfig.request_volume;
        let addresesWithTargetVolume = 0;
        const successRates = [];
        for (const mapEntry of this.addressMap.values()){
            const successes = mapEntry.counter.getLastSuccesses();
            const failures = mapEntry.counter.getLastFailures();
            if (successes + failures >= targetRequestVolume) {
                addresesWithTargetVolume += 1;
                successRates.push(successes / (successes + failures));
            }
        }
        trace('Found ' + addresesWithTargetVolume + ' success rate candidates; currentEjectionPercent=' + this.getCurrentEjectionPercent() + ' successRates=[' + successRates + ']');
        if (addresesWithTargetVolume < successRateConfig.minimum_hosts) {
            return;
        }
        // Step 2
        const successRateMean = successRates.reduce((a, b)=>a + b) / successRates.length;
        let successRateDeviationSum = 0;
        for (const rate of successRates){
            const deviation = rate - successRateMean;
            successRateDeviationSum += deviation * deviation;
        }
        const successRateVariance = successRateDeviationSum / successRates.length;
        const successRateStdev = Math.sqrt(successRateVariance);
        const ejectionThreshold = successRateMean - successRateStdev * (successRateConfig.stdev_factor / 1000);
        trace('stdev=' + successRateStdev + ' ejectionThreshold=' + ejectionThreshold);
        // Step 3
        for (const [address, mapEntry] of this.addressMap.entries()){
            // Step 3.i
            if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) {
                break;
            }
            // Step 3.ii
            const successes = mapEntry.counter.getLastSuccesses();
            const failures = mapEntry.counter.getLastFailures();
            if (successes + failures < targetRequestVolume) {
                continue;
            }
            // Step 3.iii
            const successRate = successes / (successes + failures);
            trace('Checking candidate ' + address + ' successRate=' + successRate);
            if (successRate < ejectionThreshold) {
                const randomNumber = Math.random() * 100;
                trace('Candidate ' + address + ' randomNumber=' + randomNumber + ' enforcement_percentage=' + successRateConfig.enforcement_percentage);
                if (randomNumber < successRateConfig.enforcement_percentage) {
                    trace('Ejecting candidate ' + address);
                    this.eject(mapEntry, ejectionTimestamp);
                }
            }
        }
    }
    runFailurePercentageCheck(ejectionTimestamp) {
        if (!this.latestConfig) {
            return;
        }
        const failurePercentageConfig = this.latestConfig.getFailurePercentageEjectionConfig();
        if (!failurePercentageConfig) {
            return;
        }
        trace('Running failure percentage check. threshold=' + failurePercentageConfig.threshold + ' request volume threshold=' + failurePercentageConfig.request_volume);
        // Step 1
        let addressesWithTargetVolume = 0;
        for (const mapEntry of this.addressMap.values()){
            const successes = mapEntry.counter.getLastSuccesses();
            const failures = mapEntry.counter.getLastFailures();
            if (successes + failures >= failurePercentageConfig.request_volume) {
                addressesWithTargetVolume += 1;
            }
        }
        if (addressesWithTargetVolume < failurePercentageConfig.minimum_hosts) {
            return;
        }
        // Step 2
        for (const [address, mapEntry] of this.addressMap.entries()){
            // Step 2.i
            if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) {
                break;
            }
            // Step 2.ii
            const successes = mapEntry.counter.getLastSuccesses();
            const failures = mapEntry.counter.getLastFailures();
            trace('Candidate successes=' + successes + ' failures=' + failures);
            if (successes + failures < failurePercentageConfig.request_volume) {
                continue;
            }
            // Step 2.iii
            const failurePercentage = failures * 100 / (failures + successes);
            if (failurePercentage > failurePercentageConfig.threshold) {
                const randomNumber = Math.random() * 100;
                trace('Candidate ' + address + ' randomNumber=' + randomNumber + ' enforcement_percentage=' + failurePercentageConfig.enforcement_percentage);
                if (randomNumber < failurePercentageConfig.enforcement_percentage) {
                    trace('Ejecting candidate ' + address);
                    this.eject(mapEntry, ejectionTimestamp);
                }
            }
        }
    }
    eject(mapEntry, ejectionTimestamp) {
        mapEntry.currentEjectionTimestamp = new Date();
        mapEntry.ejectionTimeMultiplier += 1;
        for (const subchannelWrapper of mapEntry.subchannelWrappers){
            subchannelWrapper.eject();
        }
    }
    uneject(mapEntry) {
        mapEntry.currentEjectionTimestamp = null;
        for (const subchannelWrapper of mapEntry.subchannelWrappers){
            subchannelWrapper.uneject();
        }
    }
    switchAllBuckets() {
        for (const mapEntry of this.addressMap.values()){
            mapEntry.counter.switchBuckets();
        }
    }
    startTimer(delayMs) {
        this.ejectionTimer = setTimeout(()=>this.runChecks(), delayMs);
    }
    runChecks() {
        const ejectionTimestamp = new Date();
        trace('Ejection timer running');
        this.switchAllBuckets();
        if (!this.latestConfig) {
            return;
        }
        this.timerStartTime = ejectionTimestamp;
        this.startTimer(this.latestConfig.getIntervalMs());
        this.runSuccessRateCheck(ejectionTimestamp);
        this.runFailurePercentageCheck(ejectionTimestamp);
        for (const [address, mapEntry] of this.addressMap.entries()){
            if (mapEntry.currentEjectionTimestamp === null) {
                if (mapEntry.ejectionTimeMultiplier > 0) {
                    mapEntry.ejectionTimeMultiplier -= 1;
                }
            } else {
                const baseEjectionTimeMs = this.latestConfig.getBaseEjectionTimeMs();
                const maxEjectionTimeMs = this.latestConfig.getMaxEjectionTimeMs();
                const returnTime = new Date(mapEntry.currentEjectionTimestamp.getTime());
                returnTime.setMilliseconds(returnTime.getMilliseconds() + Math.min(baseEjectionTimeMs * mapEntry.ejectionTimeMultiplier, Math.max(baseEjectionTimeMs, maxEjectionTimeMs)));
                if (returnTime < new Date()) {
                    trace('Unejecting ' + address);
                    this.uneject(mapEntry);
                }
            }
        }
    }
    updateAddressList(addressList, lbConfig, attributes) {
        if (!(lbConfig instanceof OutlierDetectionLoadBalancingConfig)) {
            return;
        }
        const subchannelAddresses = new Set();
        for (const address of addressList){
            subchannelAddresses.add(subchannel_address_1.subchannelAddressToString(address));
        }
        for (const address of subchannelAddresses){
            if (!this.addressMap.has(address)) {
                trace('Adding map entry for ' + address);
                this.addressMap.set(address, {
                    counter: new CallCounter(),
                    currentEjectionTimestamp: null,
                    ejectionTimeMultiplier: 0,
                    subchannelWrappers: []
                });
            }
        }
        for (const key of this.addressMap.keys()){
            if (!subchannelAddresses.has(key)) {
                trace('Removing map entry for ' + key);
                this.addressMap.delete(key);
            }
        }
        const childPolicy = load_balancer_1.getFirstUsableConfig(lbConfig.getChildPolicy(), true);
        this.childBalancer.updateAddressList(addressList, childPolicy, attributes);
        if (lbConfig.getSuccessRateEjectionConfig() || lbConfig.getFailurePercentageEjectionConfig()) {
            if (this.timerStartTime) {
                trace('Previous timer existed. Replacing timer');
                clearTimeout(this.ejectionTimer);
                const remainingDelay = lbConfig.getIntervalMs() - (new Date().getTime() - this.timerStartTime.getTime());
                this.startTimer(remainingDelay);
            } else {
                trace('Starting new timer');
                this.timerStartTime = new Date();
                this.startTimer(lbConfig.getIntervalMs());
                this.switchAllBuckets();
            }
        } else {
            trace('Counting disabled. Cancelling timer.');
            this.timerStartTime = null;
            clearTimeout(this.ejectionTimer);
            for (const mapEntry of this.addressMap.values()){
                this.uneject(mapEntry);
                mapEntry.ejectionTimeMultiplier = 0;
            }
        }
        this.latestConfig = lbConfig;
    }
    exitIdle() {
        this.childBalancer.exitIdle();
    }
    resetBackoff() {
        this.childBalancer.resetBackoff();
    }
    destroy() {
        clearTimeout(this.ejectionTimer);
        this.childBalancer.destroy();
    }
    getTypeName() {
        return TYPE_NAME;
    }
}
exports.OutlierDetectionLoadBalancer = OutlierDetectionLoadBalancer;
function setup() {
    if (OUTLIER_DETECTION_ENABLED) {
        experimental_1.registerLoadBalancerType(TYPE_NAME, OutlierDetectionLoadBalancer, OutlierDetectionLoadBalancingConfig);
    }
}
exports.setup = setup; //# sourceMappingURL=load-balancer-outlier-detection.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/experimental.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var logging_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "trace", {
    enumerable: true,
    get: function() {
        return logging_1.trace;
    }
});
Object.defineProperty(exports, "log", {
    enumerable: true,
    get: function() {
        return logging_1.log;
    }
});
var resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "registerResolver", {
    enumerable: true,
    get: function() {
        return resolver_1.registerResolver;
    }
});
var uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "uriToString", {
    enumerable: true,
    get: function() {
        return uri_parser_1.uriToString;
    }
});
var duration_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/duration.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "durationToMs", {
    enumerable: true,
    get: function() {
        return duration_1.durationToMs;
    }
});
var backoff_timeout_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/backoff-timeout.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "BackoffTimeout", {
    enumerable: true,
    get: function() {
        return backoff_timeout_1.BackoffTimeout;
    }
});
var load_balancer_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "createChildChannelControlHelper", {
    enumerable: true,
    get: function() {
        return load_balancer_1.createChildChannelControlHelper;
    }
});
Object.defineProperty(exports, "registerLoadBalancerType", {
    enumerable: true,
    get: function() {
        return load_balancer_1.registerLoadBalancerType;
    }
});
Object.defineProperty(exports, "getFirstUsableConfig", {
    enumerable: true,
    get: function() {
        return load_balancer_1.getFirstUsableConfig;
    }
});
Object.defineProperty(exports, "validateLoadBalancingConfig", {
    enumerable: true,
    get: function() {
        return load_balancer_1.validateLoadBalancingConfig;
    }
});
var subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "subchannelAddressToString", {
    enumerable: true,
    get: function() {
        return subchannel_address_1.subchannelAddressToString;
    }
});
var load_balancer_child_handler_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-child-handler.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "ChildLoadBalancerHandler", {
    enumerable: true,
    get: function() {
        return load_balancer_child_handler_1.ChildLoadBalancerHandler;
    }
});
var picker_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/picker.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "UnavailablePicker", {
    enumerable: true,
    get: function() {
        return picker_1.UnavailablePicker;
    }
});
Object.defineProperty(exports, "QueuePicker", {
    enumerable: true,
    get: function() {
        return picker_1.QueuePicker;
    }
});
Object.defineProperty(exports, "PickResultType", {
    enumerable: true,
    get: function() {
        return picker_1.PickResultType;
    }
});
var filter_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "BaseFilter", {
    enumerable: true,
    get: function() {
        return filter_1.BaseFilter;
    }
});
var filter_stack_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/filter-stack.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "FilterStackFactory", {
    enumerable: true,
    get: function() {
        return filter_stack_1.FilterStackFactory;
    }
});
var admin_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/admin.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "registerAdminService", {
    enumerable: true,
    get: function() {
        return admin_1.registerAdminService;
    }
});
var subchannel_interface_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-interface.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "BaseSubchannelWrapper", {
    enumerable: true,
    get: function() {
        return subchannel_interface_1.BaseSubchannelWrapper;
    }
});
var load_balancer_outlier_detection_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-outlier-detection.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "OutlierDetectionLoadBalancingConfig", {
    enumerable: true,
    get: function() {
        return load_balancer_outlier_detection_1.OutlierDetectionLoadBalancingConfig;
    }
}); //# sourceMappingURL=experimental.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver-dns.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setup = void 0;
const resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
const dns = __turbopack_context__.r("[externals]/dns [external] (dns, cjs)");
const util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
const service_config_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/service-config.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const constants_2 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
const net_1 = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const backoff_timeout_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/backoff-timeout.js [app-ssr] (ecmascript)");
const TRACER_NAME = 'dns_resolver';
function trace(text) {
    logging.trace(constants_2.LogVerbosity.DEBUG, TRACER_NAME, text);
}
/**
 * The default TCP port to connect to if not explicitly specified in the target.
 */ const DEFAULT_PORT = 443;
const DEFAULT_MIN_TIME_BETWEEN_RESOLUTIONS_MS = 30000;
const resolveTxtPromise = util.promisify(dns.resolveTxt);
const dnsLookupPromise = util.promisify(dns.lookup);
/**
 * Merge any number of arrays into a single alternating array
 * @param arrays
 */ function mergeArrays(...arrays) {
    const result = [];
    for(let i = 0; i < Math.max.apply(null, arrays.map((array)=>array.length)); i++){
        for (const array of arrays){
            if (i < array.length) {
                result.push(array[i]);
            }
        }
    }
    return result;
}
/**
 * Resolver implementation that handles DNS names and IP addresses.
 */ class DnsResolver {
    constructor(target, listener, channelOptions){
        var _a, _b, _c;
        this.target = target;
        this.listener = listener;
        this.pendingLookupPromise = null;
        this.pendingTxtPromise = null;
        this.latestLookupResult = null;
        this.latestServiceConfig = null;
        this.latestServiceConfigError = null;
        this.continueResolving = false;
        this.isNextResolutionTimerRunning = false;
        trace('Resolver constructed for target ' + uri_parser_1.uriToString(target));
        const hostPort = uri_parser_1.splitHostPort(target.path);
        if (hostPort === null) {
            this.ipResult = null;
            this.dnsHostname = null;
            this.port = null;
        } else {
            if (net_1.isIPv4(hostPort.host) || net_1.isIPv6(hostPort.host)) {
                this.ipResult = [
                    {
                        host: hostPort.host,
                        port: (_a = hostPort.port) !== null && _a !== void 0 ? _a : DEFAULT_PORT
                    }
                ];
                this.dnsHostname = null;
                this.port = null;
            } else {
                this.ipResult = null;
                this.dnsHostname = hostPort.host;
                this.port = (_b = hostPort.port) !== null && _b !== void 0 ? _b : DEFAULT_PORT;
            }
        }
        this.percentage = Math.random() * 100;
        this.defaultResolutionError = {
            code: constants_1.Status.UNAVAILABLE,
            details: `Name resolution failed for target ${uri_parser_1.uriToString(this.target)}`,
            metadata: new metadata_1.Metadata()
        };
        const backoffOptions = {
            initialDelay: channelOptions['grpc.initial_reconnect_backoff_ms'],
            maxDelay: channelOptions['grpc.max_reconnect_backoff_ms']
        };
        this.backoff = new backoff_timeout_1.BackoffTimeout(()=>{
            if (this.continueResolving) {
                this.startResolutionWithBackoff();
            }
        }, backoffOptions);
        this.backoff.unref();
        this.minTimeBetweenResolutionsMs = (_c = channelOptions['grpc.dns_min_time_between_resolutions_ms']) !== null && _c !== void 0 ? _c : DEFAULT_MIN_TIME_BETWEEN_RESOLUTIONS_MS;
        this.nextResolutionTimer = setTimeout(()=>{}, 0);
        clearTimeout(this.nextResolutionTimer);
    }
    /**
     * If the target is an IP address, just provide that address as a result.
     * Otherwise, initiate A, AAAA, and TXT lookups
     */ startResolution() {
        if (this.ipResult !== null) {
            trace('Returning IP address for target ' + uri_parser_1.uriToString(this.target));
            setImmediate(()=>{
                this.listener.onSuccessfulResolution(this.ipResult, null, null, null, {});
            });
            this.backoff.stop();
            this.backoff.reset();
            return;
        }
        if (this.dnsHostname === null) {
            trace('Failed to parse DNS address ' + uri_parser_1.uriToString(this.target));
            setImmediate(()=>{
                this.listener.onError({
                    code: constants_1.Status.UNAVAILABLE,
                    details: `Failed to parse DNS address ${uri_parser_1.uriToString(this.target)}`,
                    metadata: new metadata_1.Metadata()
                });
            });
            this.stopNextResolutionTimer();
        } else {
            if (this.pendingLookupPromise !== null) {
                return;
            }
            trace('Looking up DNS hostname ' + this.dnsHostname);
            /* We clear out latestLookupResult here to ensure that it contains the
             * latest result since the last time we started resolving. That way, the
             * TXT resolution handler can use it, but only if it finishes second. We
             * don't clear out any previous service config results because it's
             * better to use a service config that's slightly out of date than to
             * revert to an effectively blank one. */ this.latestLookupResult = null;
            const hostname = this.dnsHostname;
            /* We lookup both address families here and then split them up later
             * because when looking up a single family, dns.lookup outputs an error
             * if the name exists but there are no records for that family, and that
             * error is indistinguishable from other kinds of errors */ this.pendingLookupPromise = dnsLookupPromise(hostname, {
                all: true
            });
            this.pendingLookupPromise.then((addressList)=>{
                this.pendingLookupPromise = null;
                this.backoff.reset();
                this.backoff.stop();
                const ip4Addresses = addressList.filter((addr)=>addr.family === 4);
                const ip6Addresses = addressList.filter((addr)=>addr.family === 6);
                this.latestLookupResult = mergeArrays(ip6Addresses, ip4Addresses).map((addr)=>({
                        host: addr.address,
                        port: +this.port
                    }));
                const allAddressesString = '[' + this.latestLookupResult.map((addr)=>addr.host + ':' + addr.port).join(',') + ']';
                trace('Resolved addresses for target ' + uri_parser_1.uriToString(this.target) + ': ' + allAddressesString);
                if (this.latestLookupResult.length === 0) {
                    this.listener.onError(this.defaultResolutionError);
                    return;
                }
                /* If the TXT lookup has not yet finished, both of the last two
                 * arguments will be null, which is the equivalent of getting an
                 * empty TXT response. When the TXT lookup does finish, its handler
                 * can update the service config by using the same address list */ this.listener.onSuccessfulResolution(this.latestLookupResult, this.latestServiceConfig, this.latestServiceConfigError, null, {});
            }, (err)=>{
                trace('Resolution error for target ' + uri_parser_1.uriToString(this.target) + ': ' + err.message);
                this.pendingLookupPromise = null;
                this.stopNextResolutionTimer();
                this.listener.onError(this.defaultResolutionError);
            });
            /* If there already is a still-pending TXT resolution, we can just use
             * that result when it comes in */ if (this.pendingTxtPromise === null) {
                /* We handle the TXT query promise differently than the others because
                 * the name resolution attempt as a whole is a success even if the TXT
                 * lookup fails */ this.pendingTxtPromise = resolveTxtPromise(hostname);
                this.pendingTxtPromise.then((txtRecord)=>{
                    this.pendingTxtPromise = null;
                    try {
                        this.latestServiceConfig = service_config_1.extractAndSelectServiceConfig(txtRecord, this.percentage);
                    } catch (err) {
                        this.latestServiceConfigError = {
                            code: constants_1.Status.UNAVAILABLE,
                            details: 'Parsing service config failed',
                            metadata: new metadata_1.Metadata()
                        };
                    }
                    if (this.latestLookupResult !== null) {
                        /* We rely here on the assumption that calling this function with
                         * identical parameters will be essentialy idempotent, and calling
                         * it with the same address list and a different service config
                         * should result in a fast and seamless switchover. */ this.listener.onSuccessfulResolution(this.latestLookupResult, this.latestServiceConfig, this.latestServiceConfigError, null, {});
                    }
                }, (err)=>{
                /* If TXT lookup fails we should do nothing, which means that we
                     * continue to use the result of the most recent successful lookup,
                     * or the default null config object if there has never been a
                     * successful lookup. We do not set the latestServiceConfigError
                     * here because that is specifically used for response validation
                     * errors. We still need to handle this error so that it does not
                     * bubble up as an unhandled promise rejection. */ });
            }
        }
    }
    startNextResolutionTimer() {
        var _a, _b;
        clearTimeout(this.nextResolutionTimer);
        this.nextResolutionTimer = (_b = (_a = setTimeout(()=>{
            this.stopNextResolutionTimer();
            if (this.continueResolving) {
                this.startResolutionWithBackoff();
            }
        }, this.minTimeBetweenResolutionsMs)).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.isNextResolutionTimerRunning = true;
    }
    stopNextResolutionTimer() {
        clearTimeout(this.nextResolutionTimer);
        this.isNextResolutionTimerRunning = false;
    }
    startResolutionWithBackoff() {
        if (this.pendingLookupPromise === null) {
            this.continueResolving = false;
            this.startResolution();
            this.backoff.runOnce();
            this.startNextResolutionTimer();
        }
    }
    updateResolution() {
        /* If there is a pending lookup, just let it finish. Otherwise, if the
         * nextResolutionTimer or backoff timer is running, set the
         * continueResolving flag to resolve when whichever of those timers
         * fires. Otherwise, start resolving immediately. */ if (this.pendingLookupPromise === null) {
            if (this.isNextResolutionTimerRunning || this.backoff.isRunning()) {
                this.continueResolving = true;
            } else {
                this.startResolutionWithBackoff();
            }
        }
    }
    destroy() {
        this.continueResolving = false;
        this.backoff.stop();
        this.stopNextResolutionTimer();
    }
    /**
     * Get the default authority for the given target. For IP targets, that is
     * the IP address. For DNS targets, it is the hostname.
     * @param target
     */ static getDefaultAuthority(target) {
        return target.path;
    }
}
/**
 * Set up the DNS resolver class by registering it as the handler for the
 * "dns:" prefix and as the default resolver.
 */ function setup() {
    resolver_1.registerResolver('dns', DnsResolver);
    resolver_1.registerDefaultScheme('dns');
}
exports.setup = setup; //# sourceMappingURL=resolver-dns.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver-uds.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setup = void 0;
const resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
class UdsResolver {
    constructor(target, listener, channelOptions){
        this.listener = listener;
        this.addresses = [];
        let path;
        if (target.authority === '') {
            path = '/' + target.path;
        } else {
            path = target.path;
        }
        this.addresses = [
            {
                path
            }
        ];
    }
    updateResolution() {
        process.nextTick(this.listener.onSuccessfulResolution, this.addresses, null, null, null, {});
    }
    destroy() {
    // This resolver owns no resources, so we do nothing here.
    }
    static getDefaultAuthority(target) {
        return 'localhost';
    }
}
function setup() {
    resolver_1.registerResolver('unix', UdsResolver);
}
exports.setup = setup; //# sourceMappingURL=resolver-uds.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver-ip.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2021 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setup = void 0;
const net_1 = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
const resolver_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver.js [app-ssr] (ecmascript)");
const uri_parser_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/uri-parser.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const TRACER_NAME = 'ip_resolver';
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const IPV4_SCHEME = 'ipv4';
const IPV6_SCHEME = 'ipv6';
/**
 * The default TCP port to connect to if not explicitly specified in the target.
 */ const DEFAULT_PORT = 443;
class IpResolver {
    constructor(target, listener, channelOptions){
        var _a;
        this.target = target;
        this.listener = listener;
        this.addresses = [];
        this.error = null;
        trace('Resolver constructed for target ' + uri_parser_1.uriToString(target));
        const addresses = [];
        if (!(target.scheme === IPV4_SCHEME || target.scheme === IPV6_SCHEME)) {
            this.error = {
                code: constants_1.Status.UNAVAILABLE,
                details: `Unrecognized scheme ${target.scheme} in IP resolver`,
                metadata: new metadata_1.Metadata()
            };
            return;
        }
        const pathList = target.path.split(',');
        for (const path of pathList){
            const hostPort = uri_parser_1.splitHostPort(path);
            if (hostPort === null) {
                this.error = {
                    code: constants_1.Status.UNAVAILABLE,
                    details: `Failed to parse ${target.scheme} address ${path}`,
                    metadata: new metadata_1.Metadata()
                };
                return;
            }
            if (target.scheme === IPV4_SCHEME && !net_1.isIPv4(hostPort.host) || target.scheme === IPV6_SCHEME && !net_1.isIPv6(hostPort.host)) {
                this.error = {
                    code: constants_1.Status.UNAVAILABLE,
                    details: `Failed to parse ${target.scheme} address ${path}`,
                    metadata: new metadata_1.Metadata()
                };
                return;
            }
            addresses.push({
                host: hostPort.host,
                port: (_a = hostPort.port) !== null && _a !== void 0 ? _a : DEFAULT_PORT
            });
        }
        this.addresses = addresses;
        trace('Parsed ' + target.scheme + ' address list ' + this.addresses);
    }
    updateResolution() {
        process.nextTick(()=>{
            if (this.error) {
                this.listener.onError(this.error);
            } else {
                this.listener.onSuccessfulResolution(this.addresses, null, null, null, {});
            }
        });
    }
    destroy() {
    // This resolver owns no resources, so we do nothing here.
    }
    static getDefaultAuthority(target) {
        return target.path.split(',')[0];
    }
}
function setup() {
    resolver_1.registerResolver(IPV4_SCHEME, IpResolver);
    resolver_1.registerResolver(IPV6_SCHEME, IpResolver);
}
exports.setup = setup; //# sourceMappingURL=resolver-ip.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-pick-first.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setup = exports.PickFirstLoadBalancer = exports.PickFirstLoadBalancingConfig = void 0;
const load_balancer_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer.js [app-ssr] (ecmascript)");
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const picker_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/picker.js [app-ssr] (ecmascript)");
const subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const TRACER_NAME = 'pick_first';
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const TYPE_NAME = 'pick_first';
/**
 * Delay after starting a connection on a subchannel before starting a
 * connection on the next subchannel in the list, for Happy Eyeballs algorithm.
 */ const CONNECTION_DELAY_INTERVAL_MS = 250;
class PickFirstLoadBalancingConfig {
    getLoadBalancerName() {
        return TYPE_NAME;
    }
    constructor(){}
    toJsonObject() {
        return {
            [TYPE_NAME]: {}
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static createFromJson(obj) {
        return new PickFirstLoadBalancingConfig();
    }
}
exports.PickFirstLoadBalancingConfig = PickFirstLoadBalancingConfig;
/**
 * Picker for a `PickFirstLoadBalancer` in the READY state. Always returns the
 * picked subchannel.
 */ class PickFirstPicker {
    constructor(subchannel){
        this.subchannel = subchannel;
    }
    pick(pickArgs) {
        return {
            pickResultType: picker_1.PickResultType.COMPLETE,
            subchannel: this.subchannel,
            status: null,
            extraFilterFactories: [],
            onCallStarted: null
        };
    }
}
class PickFirstLoadBalancer {
    /**
     * Load balancer that attempts to connect to each backend in the address list
     * in order, and picks the first one that connects, using it for every
     * request.
     * @param channelControlHelper `ChannelControlHelper` instance provided by
     *     this load balancer's owner.
     */ constructor(channelControlHelper){
        this.channelControlHelper = channelControlHelper;
        /**
         * The list of backend addresses most recently passed to `updateAddressList`.
         */ this.latestAddressList = [];
        /**
         * The list of subchannels this load balancer is currently attempting to
         * connect to.
         */ this.subchannels = [];
        /**
         * The current connectivity state of the load balancer.
         */ this.currentState = connectivity_state_1.ConnectivityState.IDLE;
        /**
         * The index within the `subchannels` array of the subchannel with the most
         * recently started connection attempt.
         */ this.currentSubchannelIndex = 0;
        /**
         * The currently picked subchannel used for making calls. Populated if
         * and only if the load balancer's current state is READY. In that case,
         * the subchannel's current state is also READY.
         */ this.currentPick = null;
        this.triedAllSubchannels = false;
        this.subchannelStateCounts = {
            [connectivity_state_1.ConnectivityState.CONNECTING]: 0,
            [connectivity_state_1.ConnectivityState.IDLE]: 0,
            [connectivity_state_1.ConnectivityState.READY]: 0,
            [connectivity_state_1.ConnectivityState.SHUTDOWN]: 0,
            [connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE]: 0
        };
        this.subchannelStateListener = (subchannel, previousState, newState)=>{
            this.subchannelStateCounts[previousState] -= 1;
            this.subchannelStateCounts[newState] += 1;
            /* If the subchannel we most recently attempted to start connecting
             * to goes into TRANSIENT_FAILURE, immediately try to start
             * connecting to the next one instead of waiting for the connection
             * delay timer. */ if (subchannel === this.subchannels[this.currentSubchannelIndex] && newState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
                this.startNextSubchannelConnecting();
            }
            if (newState === connectivity_state_1.ConnectivityState.READY) {
                this.pickSubchannel(subchannel);
                return;
            } else {
                if (this.triedAllSubchannels && this.subchannelStateCounts[connectivity_state_1.ConnectivityState.IDLE] === this.subchannels.length) {
                    /* If all of the subchannels are IDLE we should go back to a
                     * basic IDLE state where there is no subchannel list to avoid
                     * holding unused resources. We do not reset triedAllSubchannels
                     * because that is a reminder to request reresolution the next time
                     * this LB policy needs to connect. */ this.resetSubchannelList(false);
                    this.updateState(connectivity_state_1.ConnectivityState.IDLE, new picker_1.QueuePicker(this));
                    return;
                }
                if (this.currentPick === null) {
                    if (this.triedAllSubchannels) {
                        let newLBState;
                        if (this.subchannelStateCounts[connectivity_state_1.ConnectivityState.CONNECTING] > 0) {
                            newLBState = connectivity_state_1.ConnectivityState.CONNECTING;
                        } else if (this.subchannelStateCounts[connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE] > 0) {
                            newLBState = connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE;
                        } else {
                            newLBState = connectivity_state_1.ConnectivityState.IDLE;
                        }
                        if (newLBState !== this.currentState) {
                            if (newLBState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
                                this.updateState(newLBState, new picker_1.UnavailablePicker());
                            } else {
                                this.updateState(newLBState, new picker_1.QueuePicker(this));
                            }
                        }
                    } else {
                        this.updateState(connectivity_state_1.ConnectivityState.CONNECTING, new picker_1.QueuePicker(this));
                    }
                }
            }
        };
        this.pickedSubchannelStateListener = (subchannel, previousState, newState)=>{
            if (newState !== connectivity_state_1.ConnectivityState.READY) {
                this.currentPick = null;
                subchannel.unref();
                subchannel.removeConnectivityStateListener(this.pickedSubchannelStateListener);
                this.channelControlHelper.removeChannelzChild(subchannel.getChannelzRef());
                if (this.subchannels.length > 0) {
                    if (this.triedAllSubchannels) {
                        let newLBState;
                        if (this.subchannelStateCounts[connectivity_state_1.ConnectivityState.CONNECTING] > 0) {
                            newLBState = connectivity_state_1.ConnectivityState.CONNECTING;
                        } else if (this.subchannelStateCounts[connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE] > 0) {
                            newLBState = connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE;
                        } else {
                            newLBState = connectivity_state_1.ConnectivityState.IDLE;
                        }
                        if (newLBState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
                            this.updateState(newLBState, new picker_1.UnavailablePicker());
                        } else {
                            this.updateState(newLBState, new picker_1.QueuePicker(this));
                        }
                    } else {
                        this.updateState(connectivity_state_1.ConnectivityState.CONNECTING, new picker_1.QueuePicker(this));
                    }
                } else {
                    /* We don't need to backoff here because this only happens if a
                     * subchannel successfully connects then disconnects, so it will not
                     * create a loop of attempting to connect to an unreachable backend
                     */ this.updateState(connectivity_state_1.ConnectivityState.IDLE, new picker_1.QueuePicker(this));
                }
            }
        };
        this.connectionDelayTimeout = setTimeout(()=>{}, 0);
        clearTimeout(this.connectionDelayTimeout);
    }
    startNextSubchannelConnecting() {
        if (this.triedAllSubchannels) {
            return;
        }
        for (const [index, subchannel] of this.subchannels.entries()){
            if (index > this.currentSubchannelIndex) {
                const subchannelState = subchannel.getConnectivityState();
                if (subchannelState === connectivity_state_1.ConnectivityState.IDLE || subchannelState === connectivity_state_1.ConnectivityState.CONNECTING) {
                    this.startConnecting(index);
                    return;
                }
            }
        }
        this.triedAllSubchannels = true;
    }
    /**
     * Have a single subchannel in the `subchannels` list start connecting.
     * @param subchannelIndex The index into the `subchannels` list.
     */ startConnecting(subchannelIndex) {
        clearTimeout(this.connectionDelayTimeout);
        this.currentSubchannelIndex = subchannelIndex;
        if (this.subchannels[subchannelIndex].getConnectivityState() === connectivity_state_1.ConnectivityState.IDLE) {
            trace('Start connecting to subchannel with address ' + this.subchannels[subchannelIndex].getAddress());
            process.nextTick(()=>{
                this.subchannels[subchannelIndex].startConnecting();
            });
        }
        this.connectionDelayTimeout = setTimeout(()=>{
            this.startNextSubchannelConnecting();
        }, CONNECTION_DELAY_INTERVAL_MS);
    }
    pickSubchannel(subchannel) {
        trace('Pick subchannel with address ' + subchannel.getAddress());
        if (this.currentPick !== null) {
            this.currentPick.unref();
            this.currentPick.removeConnectivityStateListener(this.pickedSubchannelStateListener);
        }
        this.currentPick = subchannel;
        this.updateState(connectivity_state_1.ConnectivityState.READY, new PickFirstPicker(subchannel));
        subchannel.addConnectivityStateListener(this.pickedSubchannelStateListener);
        subchannel.ref();
        this.channelControlHelper.addChannelzChild(subchannel.getChannelzRef());
        this.resetSubchannelList();
        clearTimeout(this.connectionDelayTimeout);
    }
    updateState(newState, picker) {
        trace(connectivity_state_1.ConnectivityState[this.currentState] + ' -> ' + connectivity_state_1.ConnectivityState[newState]);
        this.currentState = newState;
        this.channelControlHelper.updateState(newState, picker);
    }
    resetSubchannelList(resetTriedAllSubchannels = true) {
        for (const subchannel of this.subchannels){
            subchannel.removeConnectivityStateListener(this.subchannelStateListener);
            subchannel.unref();
            this.channelControlHelper.removeChannelzChild(subchannel.getChannelzRef());
        }
        this.currentSubchannelIndex = 0;
        this.subchannelStateCounts = {
            [connectivity_state_1.ConnectivityState.CONNECTING]: 0,
            [connectivity_state_1.ConnectivityState.IDLE]: 0,
            [connectivity_state_1.ConnectivityState.READY]: 0,
            [connectivity_state_1.ConnectivityState.SHUTDOWN]: 0,
            [connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE]: 0
        };
        this.subchannels = [];
        if (resetTriedAllSubchannels) {
            this.triedAllSubchannels = false;
        }
    }
    /**
     * Start connecting to the address list most recently passed to
     * `updateAddressList`.
     */ connectToAddressList() {
        this.resetSubchannelList();
        trace('Connect to address list ' + this.latestAddressList.map((address)=>subchannel_address_1.subchannelAddressToString(address)));
        this.subchannels = this.latestAddressList.map((address)=>this.channelControlHelper.createSubchannel(address, {}));
        for (const subchannel of this.subchannels){
            subchannel.ref();
            this.channelControlHelper.addChannelzChild(subchannel.getChannelzRef());
        }
        for (const subchannel of this.subchannels){
            subchannel.addConnectivityStateListener(this.subchannelStateListener);
            this.subchannelStateCounts[subchannel.getConnectivityState()] += 1;
            if (subchannel.getConnectivityState() === connectivity_state_1.ConnectivityState.READY) {
                this.pickSubchannel(subchannel);
                this.resetSubchannelList();
                return;
            }
        }
        for (const [index, subchannel] of this.subchannels.entries()){
            const subchannelState = subchannel.getConnectivityState();
            if (subchannelState === connectivity_state_1.ConnectivityState.IDLE || subchannelState === connectivity_state_1.ConnectivityState.CONNECTING) {
                this.startConnecting(index);
                if (this.currentPick === null) {
                    this.updateState(connectivity_state_1.ConnectivityState.CONNECTING, new picker_1.QueuePicker(this));
                }
                return;
            }
        }
        // If the code reaches this point, every subchannel must be in TRANSIENT_FAILURE
        if (this.currentPick === null) {
            this.updateState(connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE, new picker_1.UnavailablePicker());
        }
    }
    updateAddressList(addressList, lbConfig) {
        // lbConfig has no useful information for pick first load balancing
        /* To avoid unnecessary churn, we only do something with this address list
         * if we're not currently trying to establish a connection, or if the new
         * address list is different from the existing one */ if (this.subchannels.length === 0 || !this.latestAddressList.every((value, index)=>addressList[index] === value)) {
            this.latestAddressList = addressList;
            this.connectToAddressList();
        }
    }
    exitIdle() {
        if (this.currentState === connectivity_state_1.ConnectivityState.IDLE || this.triedAllSubchannels) {
            this.channelControlHelper.requestReresolution();
        }
        for (const subchannel of this.subchannels){
            subchannel.startConnecting();
        }
        if (this.currentState === connectivity_state_1.ConnectivityState.IDLE) {
            if (this.latestAddressList.length > 0) {
                this.connectToAddressList();
            }
        }
    }
    resetBackoff() {
    /* The pick first load balancer does not have a connection backoff, so this
         * does nothing */ }
    destroy() {
        this.resetSubchannelList();
        if (this.currentPick !== null) {
            /* Unref can cause a state change, which can cause a change in the value
             * of this.currentPick, so we hold a local reference to make sure that
             * does not impact this function. */ const currentPick = this.currentPick;
            currentPick.unref();
            currentPick.removeConnectivityStateListener(this.pickedSubchannelStateListener);
            this.channelControlHelper.removeChannelzChild(currentPick.getChannelzRef());
        }
    }
    getTypeName() {
        return TYPE_NAME;
    }
}
exports.PickFirstLoadBalancer = PickFirstLoadBalancer;
function setup() {
    load_balancer_1.registerLoadBalancerType(TYPE_NAME, PickFirstLoadBalancer, PickFirstLoadBalancingConfig);
    load_balancer_1.registerDefaultLoadBalancerType(TYPE_NAME);
}
exports.setup = setup; //# sourceMappingURL=load-balancer-pick-first.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-round-robin.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setup = exports.RoundRobinLoadBalancer = void 0;
const load_balancer_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer.js [app-ssr] (ecmascript)");
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
const picker_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/picker.js [app-ssr] (ecmascript)");
const subchannel_address_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/subchannel-address.js [app-ssr] (ecmascript)");
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
const TRACER_NAME = 'round_robin';
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const TYPE_NAME = 'round_robin';
class RoundRobinLoadBalancingConfig {
    getLoadBalancerName() {
        return TYPE_NAME;
    }
    constructor(){}
    toJsonObject() {
        return {
            [TYPE_NAME]: {}
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static createFromJson(obj) {
        return new RoundRobinLoadBalancingConfig();
    }
}
class RoundRobinPicker {
    constructor(subchannelList, nextIndex = 0){
        this.subchannelList = subchannelList;
        this.nextIndex = nextIndex;
    }
    pick(pickArgs) {
        const pickedSubchannel = this.subchannelList[this.nextIndex];
        this.nextIndex = (this.nextIndex + 1) % this.subchannelList.length;
        return {
            pickResultType: picker_1.PickResultType.COMPLETE,
            subchannel: pickedSubchannel,
            status: null,
            extraFilterFactories: [],
            onCallStarted: null
        };
    }
    /**
     * Check what the next subchannel returned would be. Used by the load
     * balancer implementation to preserve this part of the picker state if
     * possible when a subchannel connects or disconnects.
     */ peekNextSubchannel() {
        return this.subchannelList[this.nextIndex];
    }
}
class RoundRobinLoadBalancer {
    constructor(channelControlHelper){
        this.channelControlHelper = channelControlHelper;
        this.subchannels = [];
        this.currentState = connectivity_state_1.ConnectivityState.IDLE;
        this.currentReadyPicker = null;
        this.subchannelStateCounts = {
            [connectivity_state_1.ConnectivityState.CONNECTING]: 0,
            [connectivity_state_1.ConnectivityState.IDLE]: 0,
            [connectivity_state_1.ConnectivityState.READY]: 0,
            [connectivity_state_1.ConnectivityState.SHUTDOWN]: 0,
            [connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE]: 0
        };
        this.subchannelStateListener = (subchannel, previousState, newState)=>{
            this.subchannelStateCounts[previousState] -= 1;
            this.subchannelStateCounts[newState] += 1;
            this.calculateAndUpdateState();
            if (newState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE || newState === connectivity_state_1.ConnectivityState.IDLE) {
                this.channelControlHelper.requestReresolution();
                subchannel.startConnecting();
            }
        };
    }
    calculateAndUpdateState() {
        if (this.subchannelStateCounts[connectivity_state_1.ConnectivityState.READY] > 0) {
            const readySubchannels = this.subchannels.filter((subchannel)=>subchannel.getConnectivityState() === connectivity_state_1.ConnectivityState.READY);
            let index = 0;
            if (this.currentReadyPicker !== null) {
                index = readySubchannels.indexOf(this.currentReadyPicker.peekNextSubchannel());
                if (index < 0) {
                    index = 0;
                }
            }
            this.updateState(connectivity_state_1.ConnectivityState.READY, new RoundRobinPicker(readySubchannels, index));
        } else if (this.subchannelStateCounts[connectivity_state_1.ConnectivityState.CONNECTING] > 0) {
            this.updateState(connectivity_state_1.ConnectivityState.CONNECTING, new picker_1.QueuePicker(this));
        } else if (this.subchannelStateCounts[connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE] > 0) {
            this.updateState(connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE, new picker_1.UnavailablePicker());
        } else {
            this.updateState(connectivity_state_1.ConnectivityState.IDLE, new picker_1.QueuePicker(this));
        }
    }
    updateState(newState, picker) {
        trace(connectivity_state_1.ConnectivityState[this.currentState] + ' -> ' + connectivity_state_1.ConnectivityState[newState]);
        if (newState === connectivity_state_1.ConnectivityState.READY) {
            this.currentReadyPicker = picker;
        } else {
            this.currentReadyPicker = null;
        }
        this.currentState = newState;
        this.channelControlHelper.updateState(newState, picker);
    }
    resetSubchannelList() {
        for (const subchannel of this.subchannels){
            subchannel.removeConnectivityStateListener(this.subchannelStateListener);
            subchannel.unref();
            this.channelControlHelper.removeChannelzChild(subchannel.getChannelzRef());
        }
        this.subchannelStateCounts = {
            [connectivity_state_1.ConnectivityState.CONNECTING]: 0,
            [connectivity_state_1.ConnectivityState.IDLE]: 0,
            [connectivity_state_1.ConnectivityState.READY]: 0,
            [connectivity_state_1.ConnectivityState.SHUTDOWN]: 0,
            [connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE]: 0
        };
        this.subchannels = [];
    }
    updateAddressList(addressList, lbConfig) {
        this.resetSubchannelList();
        trace('Connect to address list ' + addressList.map((address)=>subchannel_address_1.subchannelAddressToString(address)));
        this.subchannels = addressList.map((address)=>this.channelControlHelper.createSubchannel(address, {}));
        for (const subchannel of this.subchannels){
            subchannel.ref();
            subchannel.addConnectivityStateListener(this.subchannelStateListener);
            this.channelControlHelper.addChannelzChild(subchannel.getChannelzRef());
            const subchannelState = subchannel.getConnectivityState();
            this.subchannelStateCounts[subchannelState] += 1;
            if (subchannelState === connectivity_state_1.ConnectivityState.IDLE || subchannelState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
                subchannel.startConnecting();
            }
        }
        this.calculateAndUpdateState();
    }
    exitIdle() {
        for (const subchannel of this.subchannels){
            subchannel.startConnecting();
        }
    }
    resetBackoff() {
    /* The pick first load balancer does not have a connection backoff, so this
         * does nothing */ }
    destroy() {
        this.resetSubchannelList();
    }
    getTypeName() {
        return TYPE_NAME;
    }
}
exports.RoundRobinLoadBalancer = RoundRobinLoadBalancer;
function setup() {
    load_balancer_1.registerLoadBalancerType(TYPE_NAME, RoundRobinLoadBalancer, RoundRobinLoadBalancingConfig);
}
exports.setup = setup; //# sourceMappingURL=load-balancer-round-robin.js.map
}}),
"[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/index.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.experimental = exports.StatusBuilder = exports.getClientChannel = exports.ServerCredentials = exports.Server = exports.setLogVerbosity = exports.setLogger = exports.load = exports.loadObject = exports.CallCredentials = exports.ChannelCredentials = exports.waitForClientReady = exports.closeClient = exports.Channel = exports.makeGenericClientConstructor = exports.makeClientConstructor = exports.loadPackageDefinition = exports.Client = exports.compressionAlgorithms = exports.propagate = exports.connectivityState = exports.status = exports.logVerbosity = exports.Metadata = exports.credentials = void 0;
const call_credentials_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/call-credentials.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "CallCredentials", {
    enumerable: true,
    get: function() {
        return call_credentials_1.CallCredentials;
    }
});
const channel_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channel.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "Channel", {
    enumerable: true,
    get: function() {
        return channel_1.ChannelImplementation;
    }
});
const compression_algorithms_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/compression-algorithms.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "compressionAlgorithms", {
    enumerable: true,
    get: function() {
        return compression_algorithms_1.CompressionAlgorithms;
    }
});
const connectivity_state_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/connectivity-state.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "connectivityState", {
    enumerable: true,
    get: function() {
        return connectivity_state_1.ConnectivityState;
    }
});
const channel_credentials_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channel-credentials.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "ChannelCredentials", {
    enumerable: true,
    get: function() {
        return channel_credentials_1.ChannelCredentials;
    }
});
const client_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/client.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "Client", {
    enumerable: true,
    get: function() {
        return client_1.Client;
    }
});
const constants_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/constants.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "logVerbosity", {
    enumerable: true,
    get: function() {
        return constants_1.LogVerbosity;
    }
});
Object.defineProperty(exports, "status", {
    enumerable: true,
    get: function() {
        return constants_1.Status;
    }
});
Object.defineProperty(exports, "propagate", {
    enumerable: true,
    get: function() {
        return constants_1.Propagate;
    }
});
const logging = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/logging.js [app-ssr] (ecmascript)");
const make_client_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/make-client.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "loadPackageDefinition", {
    enumerable: true,
    get: function() {
        return make_client_1.loadPackageDefinition;
    }
});
Object.defineProperty(exports, "makeClientConstructor", {
    enumerable: true,
    get: function() {
        return make_client_1.makeClientConstructor;
    }
});
Object.defineProperty(exports, "makeGenericClientConstructor", {
    enumerable: true,
    get: function() {
        return make_client_1.makeClientConstructor;
    }
});
const metadata_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/metadata.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "Metadata", {
    enumerable: true,
    get: function() {
        return metadata_1.Metadata;
    }
});
const server_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/server.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "Server", {
    enumerable: true,
    get: function() {
        return server_1.Server;
    }
});
const server_credentials_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/server-credentials.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "ServerCredentials", {
    enumerable: true,
    get: function() {
        return server_credentials_1.ServerCredentials;
    }
});
const status_builder_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/status-builder.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "StatusBuilder", {
    enumerable: true,
    get: function() {
        return status_builder_1.StatusBuilder;
    }
});
/**** Client Credentials ****/ // Using assign only copies enumerable properties, which is what we want
exports.credentials = {
    /**
     * Combine a ChannelCredentials with any number of CallCredentials into a
     * single ChannelCredentials object.
     * @param channelCredentials The ChannelCredentials object.
     * @param callCredentials Any number of CallCredentials objects.
     * @return The resulting ChannelCredentials object.
     */ combineChannelCredentials: (channelCredentials, ...callCredentials)=>{
        return callCredentials.reduce((acc, other)=>acc.compose(other), channelCredentials);
    },
    /**
     * Combine any number of CallCredentials into a single CallCredentials
     * object.
     * @param first The first CallCredentials object.
     * @param additional Any number of additional CallCredentials objects.
     * @return The resulting CallCredentials object.
     */ combineCallCredentials: (first, ...additional)=>{
        return additional.reduce((acc, other)=>acc.compose(other), first);
    },
    // from channel-credentials.ts
    createInsecure: channel_credentials_1.ChannelCredentials.createInsecure,
    createSsl: channel_credentials_1.ChannelCredentials.createSsl,
    createFromSecureContext: channel_credentials_1.ChannelCredentials.createFromSecureContext,
    // from call-credentials.ts
    createFromMetadataGenerator: call_credentials_1.CallCredentials.createFromMetadataGenerator,
    createFromGoogleCredential: call_credentials_1.CallCredentials.createFromGoogleCredential,
    createEmpty: call_credentials_1.CallCredentials.createEmpty
};
/**
 * Close a Client object.
 * @param client The client to close.
 */ exports.closeClient = (client)=>client.close();
exports.waitForClientReady = (client, deadline, callback)=>client.waitForReady(deadline, callback);
/* eslint-enable @typescript-eslint/no-explicit-any */ /**** Unimplemented function stubs ****/ /* eslint-disable @typescript-eslint/no-explicit-any */ exports.loadObject = (value, options)=>{
    throw new Error('Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead');
};
exports.load = (filename, format, options)=>{
    throw new Error('Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead');
};
exports.setLogger = (logger)=>{
    logging.setLogger(logger);
};
exports.setLogVerbosity = (verbosity)=>{
    logging.setLoggerVerbosity(verbosity);
};
exports.getClientChannel = (client)=>{
    return client_1.Client.prototype.getChannel.call(client);
};
var client_interceptors_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/client-interceptors.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "ListenerBuilder", {
    enumerable: true,
    get: function() {
        return client_interceptors_1.ListenerBuilder;
    }
});
Object.defineProperty(exports, "RequesterBuilder", {
    enumerable: true,
    get: function() {
        return client_interceptors_1.RequesterBuilder;
    }
});
Object.defineProperty(exports, "InterceptingCall", {
    enumerable: true,
    get: function() {
        return client_interceptors_1.InterceptingCall;
    }
});
Object.defineProperty(exports, "InterceptorConfigurationError", {
    enumerable: true,
    get: function() {
        return client_interceptors_1.InterceptorConfigurationError;
    }
});
var channelz_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channelz.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "getChannelzServiceDefinition", {
    enumerable: true,
    get: function() {
        return channelz_1.getChannelzServiceDefinition;
    }
});
Object.defineProperty(exports, "getChannelzHandlers", {
    enumerable: true,
    get: function() {
        return channelz_1.getChannelzHandlers;
    }
});
var admin_1 = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/admin.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "addAdminServicesToServer", {
    enumerable: true,
    get: function() {
        return admin_1.addAdminServicesToServer;
    }
});
const experimental = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/experimental.js [app-ssr] (ecmascript)");
exports.experimental = experimental;
const resolver_dns = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver-dns.js [app-ssr] (ecmascript)");
const resolver_uds = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver-uds.js [app-ssr] (ecmascript)");
const resolver_ip = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/resolver-ip.js [app-ssr] (ecmascript)");
const load_balancer_pick_first = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-pick-first.js [app-ssr] (ecmascript)");
const load_balancer_round_robin = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-round-robin.js [app-ssr] (ecmascript)");
const load_balancer_outlier_detection = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/load-balancer-outlier-detection.js [app-ssr] (ecmascript)");
const channelz = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/build/src/channelz.js [app-ssr] (ecmascript)");
const clientVersion = __turbopack_context__.r("[project]/node_modules/@firebase/firestore/node_modules/@grpc/grpc-js/package.json (json)").version;
(()=>{
    logging.trace(constants_1.LogVerbosity.DEBUG, 'index', 'Loading @grpc/grpc-js version ' + clientVersion);
    resolver_dns.setup();
    resolver_uds.setup();
    resolver_ip.setup();
    load_balancer_pick_first.setup();
    load_balancer_round_robin.setup();
    load_balancer_outlier_detection.setup();
    channelz.setup();
})(); //# sourceMappingURL=index.js.map
}}),

};

//# sourceMappingURL=a4885_%40grpc_grpc-js_d0c39687._.js.map