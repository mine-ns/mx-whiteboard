var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// <define:import.meta.env>
var define_import_meta_env_default;
var init_define_import_meta_env = __esm({
  "<define:import.meta.env>"() {
    define_import_meta_env_default = { DEV: true };
  }
});

// ../../node_modules/es6-promise-pool/es6-promise-pool.js
var require_es6_promise_pool = __commonJS({
  "../../node_modules/es6-promise-pool/es6-promise-pool.js"(exports, module) {
    init_define_import_meta_env();
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof exports === "object") {
        module.exports = factory();
      } else {
        root.PromisePool = factory();
        root.promisePool = root.PromisePool;
      }
    })(exports, function() {
      "use strict";
      var EventTarget = function() {
        this._listeners = {};
      };
      EventTarget.prototype.addEventListener = function(type, listener) {
        this._listeners[type] = this._listeners[type] || [];
        if (this._listeners[type].indexOf(listener) < 0) {
          this._listeners[type].push(listener);
        }
      };
      EventTarget.prototype.removeEventListener = function(type, listener) {
        if (this._listeners[type]) {
          var p = this._listeners[type].indexOf(listener);
          if (p >= 0) {
            this._listeners[type].splice(p, 1);
          }
        }
      };
      EventTarget.prototype.dispatchEvent = function(evt) {
        if (this._listeners[evt.type] && this._listeners[evt.type].length) {
          var listeners = this._listeners[evt.type].slice();
          for (var i = 0, l = listeners.length; i < l; ++i) {
            listeners[i].call(this, evt);
          }
        }
      };
      var isGenerator = function(func) {
        return typeof func.constructor === "function" && func.constructor.name === "GeneratorFunction";
      };
      var functionToIterator = function(func) {
        return {
          next: function() {
            var promise = func();
            return promise ? { value: promise } : { done: true };
          }
        };
      };
      var promiseToIterator = function(promise) {
        var called = false;
        return {
          next: function() {
            if (called) {
              return { done: true };
            }
            called = true;
            return { value: promise };
          }
        };
      };
      var toIterator = function(obj, Promise2) {
        var type = typeof obj;
        if (type === "object") {
          if (typeof obj.next === "function") {
            return obj;
          }
          if (typeof obj.then === "function") {
            return promiseToIterator(obj);
          }
        }
        if (type === "function") {
          return isGenerator(obj) ? obj() : functionToIterator(obj);
        }
        return promiseToIterator(Promise2.resolve(obj));
      };
      var PromisePoolEvent = function(target, type, data) {
        this.target = target;
        this.type = type;
        this.data = data;
      };
      var PromisePool2 = function(source, concurrency, options) {
        EventTarget.call(this);
        if (typeof concurrency !== "number" || Math.floor(concurrency) !== concurrency || concurrency < 1) {
          throw new Error("Invalid concurrency");
        }
        this._concurrency = concurrency;
        this._options = options || {};
        this._options.promise = this._options.promise || Promise;
        this._iterator = toIterator(source, this._options.promise);
        this._done = false;
        this._size = 0;
        this._promise = null;
        this._callbacks = null;
      };
      PromisePool2.prototype = new EventTarget();
      PromisePool2.prototype.constructor = PromisePool2;
      PromisePool2.prototype.concurrency = function(value) {
        if (typeof value !== "undefined") {
          this._concurrency = value;
          if (this.active()) {
            this._proceed();
          }
        }
        return this._concurrency;
      };
      PromisePool2.prototype.size = function() {
        return this._size;
      };
      PromisePool2.prototype.active = function() {
        return !!this._promise;
      };
      PromisePool2.prototype.promise = function() {
        return this._promise;
      };
      PromisePool2.prototype.start = function() {
        var that = this;
        var Promise2 = this._options.promise;
        this._promise = new Promise2(function(resolve, reject) {
          that._callbacks = {
            reject,
            resolve
          };
          that._proceed();
        });
        return this._promise;
      };
      PromisePool2.prototype._fireEvent = function(type, data) {
        this.dispatchEvent(new PromisePoolEvent(this, type, data));
      };
      PromisePool2.prototype._settle = function(error) {
        if (error) {
          this._callbacks.reject(error);
        } else {
          this._callbacks.resolve();
        }
        this._promise = null;
        this._callbacks = null;
      };
      PromisePool2.prototype._onPooledPromiseFulfilled = function(promise, result) {
        this._size--;
        if (this.active()) {
          this._fireEvent("fulfilled", {
            promise,
            result
          });
          this._proceed();
        }
      };
      PromisePool2.prototype._onPooledPromiseRejected = function(promise, error) {
        this._size--;
        if (this.active()) {
          this._fireEvent("rejected", {
            promise,
            error
          });
          this._settle(error || new Error("Unknown error"));
        }
      };
      PromisePool2.prototype._trackPromise = function(promise) {
        var that = this;
        promise.then(function(result) {
          that._onPooledPromiseFulfilled(promise, result);
        }, function(error) {
          that._onPooledPromiseRejected(promise, error);
        })["catch"](function(err) {
          that._settle(new Error("Promise processing failed: " + err));
        });
      };
      PromisePool2.prototype._proceed = function() {
        if (!this._done) {
          var result = { done: false };
          while (this._size < this._concurrency && !(result = this._iterator.next()).done) {
            this._size++;
            this._trackPromise(result.value);
          }
          this._done = result === null || !!result.done;
        }
        if (this._done && this._size === 0) {
          this._settle();
        }
      };
      PromisePool2.PromisePoolEvent = PromisePoolEvent;
      PromisePool2.PromisePool = PromisePool2;
      return PromisePool2;
    });
  }
});

// ../../node_modules/@braintree/sanitize-url/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/@braintree/sanitize-url/dist/index.js"(exports) {
    "use strict";
    init_define_import_meta_env();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sanitizeUrl = void 0;
    var invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
    var htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
    var htmlCtrlEntityRegex = /&(newline|tab);/gi;
    var ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
    var urlSchemeRegex = /^.+(:|&colon;)/gim;
    var relativeFirstCharacters = [".", "/"];
    function isRelativeUrlWithoutProtocol(url) {
      return relativeFirstCharacters.indexOf(url[0]) > -1;
    }
    function decodeHtmlCharacters(str) {
      return str.replace(htmlEntitiesRegex, function(match, dec) {
        return String.fromCharCode(dec);
      });
    }
    function sanitizeUrl2(url) {
      var sanitizedUrl = decodeHtmlCharacters(url || "").replace(htmlCtrlEntityRegex, "").replace(ctrlCharactersRegex, "").trim();
      if (!sanitizedUrl) {
        return "about:blank";
      }
      if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
        return sanitizedUrl;
      }
      var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
      if (!urlSchemeParseResults) {
        return sanitizedUrl;
      }
      var urlScheme = urlSchemeParseResults[0];
      if (invalidProtocolRegex.test(urlScheme)) {
        return "about:blank";
      }
      return sanitizedUrl;
    }
    exports.sanitizeUrl = sanitizeUrl2;
  }
});

// src/index.ts
init_define_import_meta_env();

// src/binary-heap.ts
init_define_import_meta_env();
var BinaryHeap = class {
  constructor(scoreFunction) {
    this.scoreFunction = scoreFunction;
  }
  content = [];
  sinkDown(idx) {
    const node = this.content[idx];
    const nodeScore = this.scoreFunction(node);
    while (idx > 0) {
      const parentN = (idx + 1 >> 1) - 1;
      const parent = this.content[parentN];
      if (nodeScore < this.scoreFunction(parent)) {
        this.content[idx] = parent;
        idx = parentN;
      } else {
        break;
      }
    }
    this.content[idx] = node;
  }
  bubbleUp(idx) {
    const length = this.content.length;
    const node = this.content[idx];
    const score = this.scoreFunction(node);
    while (true) {
      const child1N = (idx + 1 << 1) - 1;
      const child2N = child1N + 1;
      let smallestIdx = idx;
      let smallestScore = score;
      if (child1N < length) {
        const child1Score = this.scoreFunction(this.content[child1N]);
        if (child1Score < smallestScore) {
          smallestIdx = child1N;
          smallestScore = child1Score;
        }
      }
      if (child2N < length) {
        const child2Score = this.scoreFunction(this.content[child2N]);
        if (child2Score < smallestScore) {
          smallestIdx = child2N;
        }
      }
      if (smallestIdx === idx) {
        break;
      }
      this.content[idx] = this.content[smallestIdx];
      idx = smallestIdx;
    }
    this.content[idx] = node;
  }
  push(node) {
    this.content.push(node);
    this.sinkDown(this.content.length - 1);
  }
  pop() {
    if (this.content.length === 0) {
      return null;
    }
    const result = this.content[0];
    const end = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  }
  remove(node) {
    if (this.content.length === 0) {
      return;
    }
    const i = this.content.indexOf(node);
    const end = this.content.pop();
    if (i < this.content.length) {
      this.content[i] = end;
      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  }
  size() {
    return this.content.length;
  }
  rescoreElement(node) {
    this.sinkDown(this.content.indexOf(node));
  }
};

// src/colors.ts
init_define_import_meta_env();

// ../../node_modules/open-color/open-color.json
var open_color_default = {
  white: "#ffffff",
  black: "#000000",
  gray: [
    "#f8f9fa",
    "#f1f3f5",
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#adb5bd",
    "#868e96",
    "#495057",
    "#343a40",
    "#212529"
  ],
  red: [
    "#fff5f5",
    "#ffe3e3",
    "#ffc9c9",
    "#ffa8a8",
    "#ff8787",
    "#ff6b6b",
    "#fa5252",
    "#f03e3e",
    "#e03131",
    "#c92a2a"
  ],
  pink: [
    "#fff0f6",
    "#ffdeeb",
    "#fcc2d7",
    "#faa2c1",
    "#f783ac",
    "#f06595",
    "#e64980",
    "#d6336c",
    "#c2255c",
    "#a61e4d"
  ],
  grape: [
    "#f8f0fc",
    "#f3d9fa",
    "#eebefa",
    "#e599f7",
    "#da77f2",
    "#cc5de8",
    "#be4bdb",
    "#ae3ec9",
    "#9c36b5",
    "#862e9c"
  ],
  violet: [
    "#f3f0ff",
    "#e5dbff",
    "#d0bfff",
    "#b197fc",
    "#9775fa",
    "#845ef7",
    "#7950f2",
    "#7048e8",
    "#6741d9",
    "#5f3dc4"
  ],
  indigo: [
    "#edf2ff",
    "#dbe4ff",
    "#bac8ff",
    "#91a7ff",
    "#748ffc",
    "#5c7cfa",
    "#4c6ef5",
    "#4263eb",
    "#3b5bdb",
    "#364fc7"
  ],
  blue: [
    "#e7f5ff",
    "#d0ebff",
    "#a5d8ff",
    "#74c0fc",
    "#4dabf7",
    "#339af0",
    "#228be6",
    "#1c7ed6",
    "#1971c2",
    "#1864ab"
  ],
  cyan: [
    "#e3fafc",
    "#c5f6fa",
    "#99e9f2",
    "#66d9e8",
    "#3bc9db",
    "#22b8cf",
    "#15aabf",
    "#1098ad",
    "#0c8599",
    "#0b7285"
  ],
  teal: [
    "#e6fcf5",
    "#c3fae8",
    "#96f2d7",
    "#63e6be",
    "#38d9a9",
    "#20c997",
    "#12b886",
    "#0ca678",
    "#099268",
    "#087f5b"
  ],
  green: [
    "#ebfbee",
    "#d3f9d8",
    "#b2f2bb",
    "#8ce99a",
    "#69db7c",
    "#51cf66",
    "#40c057",
    "#37b24d",
    "#2f9e44",
    "#2b8a3e"
  ],
  lime: [
    "#f4fce3",
    "#e9fac8",
    "#d8f5a2",
    "#c0eb75",
    "#a9e34b",
    "#94d82d",
    "#82c91e",
    "#74b816",
    "#66a80f",
    "#5c940d"
  ],
  yellow: [
    "#fff9db",
    "#fff3bf",
    "#ffec99",
    "#ffe066",
    "#ffd43b",
    "#fcc419",
    "#fab005",
    "#f59f00",
    "#f08c00",
    "#e67700"
  ],
  orange: [
    "#fff4e6",
    "#ffe8cc",
    "#ffd8a8",
    "#ffc078",
    "#ffa94d",
    "#ff922b",
    "#fd7e14",
    "#f76707",
    "#e8590c",
    "#d9480f"
  ]
};

// src/colors.ts
var COLOR_OUTLINE_CONTRAST_THRESHOLD = 240;
var pick = (source, keys) => {
  return keys.reduce((acc, key) => {
    if (key in source) {
      acc[key] = source[key];
    }
    return acc;
  }, {});
};
var MAX_CUSTOM_COLORS_USED_IN_CANVAS = 5;
var COLORS_PER_ROW = 5;
var DEFAULT_CHART_COLOR_INDEX = 4;
var DEFAULT_ELEMENT_STROKE_COLOR_INDEX = 4;
var DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX = 1;
var ELEMENTS_PALETTE_SHADE_INDEXES = [0, 2, 4, 6, 8];
var CANVAS_PALETTE_SHADE_INDEXES = [0, 1, 2, 3, 4];
var getSpecificColorShades = (color, indexArr) => {
  return indexArr.map((index) => open_color_default[color][index]);
};
var COLOR_PALETTE = {
  transparent: "transparent",
  black: "#1e1e1e",
  white: "#ffffff",
  // open-colors
  gray: getSpecificColorShades("gray", ELEMENTS_PALETTE_SHADE_INDEXES),
  red: getSpecificColorShades("red", ELEMENTS_PALETTE_SHADE_INDEXES),
  pink: getSpecificColorShades("pink", ELEMENTS_PALETTE_SHADE_INDEXES),
  grape: getSpecificColorShades("grape", ELEMENTS_PALETTE_SHADE_INDEXES),
  violet: getSpecificColorShades("violet", ELEMENTS_PALETTE_SHADE_INDEXES),
  blue: getSpecificColorShades("blue", ELEMENTS_PALETTE_SHADE_INDEXES),
  cyan: getSpecificColorShades("cyan", ELEMENTS_PALETTE_SHADE_INDEXES),
  teal: getSpecificColorShades("teal", ELEMENTS_PALETTE_SHADE_INDEXES),
  green: getSpecificColorShades("green", ELEMENTS_PALETTE_SHADE_INDEXES),
  yellow: getSpecificColorShades("yellow", ELEMENTS_PALETTE_SHADE_INDEXES),
  orange: getSpecificColorShades("orange", ELEMENTS_PALETTE_SHADE_INDEXES),
  // radix bronze shades 3,5,7,9,11
  bronze: ["#f8f1ee", "#eaddd7", "#d2bab0", "#a18072", "#846358"]
};
var COMMON_ELEMENT_SHADES = pick(COLOR_PALETTE, [
  "cyan",
  "blue",
  "violet",
  "grape",
  "pink",
  "green",
  "teal",
  "yellow",
  "orange",
  "red"
]);
var DEFAULT_ELEMENT_STROKE_PICKS = [
  COLOR_PALETTE.black,
  COLOR_PALETTE.red[DEFAULT_ELEMENT_STROKE_COLOR_INDEX],
  COLOR_PALETTE.green[DEFAULT_ELEMENT_STROKE_COLOR_INDEX],
  COLOR_PALETTE.blue[DEFAULT_ELEMENT_STROKE_COLOR_INDEX],
  COLOR_PALETTE.yellow[DEFAULT_ELEMENT_STROKE_COLOR_INDEX]
];
var DEFAULT_ELEMENT_BACKGROUND_PICKS = [
  COLOR_PALETTE.transparent,
  COLOR_PALETTE.red[DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX],
  COLOR_PALETTE.green[DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX],
  COLOR_PALETTE.blue[DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX],
  COLOR_PALETTE.yellow[DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX]
];
var DEFAULT_CANVAS_BACKGROUND_PICKS = [
  COLOR_PALETTE.white,
  // radix slate2
  "#f8f9fa",
  // radix blue2
  "#f5faff",
  // radix yellow2
  "#fffce8",
  // radix bronze2
  "#fdf8f6"
];
var DEFAULT_ELEMENT_STROKE_COLOR_PALETTE = {
  // 1st row
  transparent: COLOR_PALETTE.transparent,
  white: COLOR_PALETTE.white,
  gray: COLOR_PALETTE.gray,
  black: COLOR_PALETTE.black,
  bronze: COLOR_PALETTE.bronze,
  // rest
  ...COMMON_ELEMENT_SHADES
};
var DEFAULT_ELEMENT_BACKGROUND_COLOR_PALETTE = {
  transparent: COLOR_PALETTE.transparent,
  white: COLOR_PALETTE.white,
  gray: COLOR_PALETTE.gray,
  black: COLOR_PALETTE.black,
  bronze: COLOR_PALETTE.bronze,
  ...COMMON_ELEMENT_SHADES
};
var getAllColorsSpecificShade = (index) => [
  // 2nd row
  COLOR_PALETTE.cyan[index],
  COLOR_PALETTE.blue[index],
  COLOR_PALETTE.violet[index],
  COLOR_PALETTE.grape[index],
  COLOR_PALETTE.pink[index],
  // 3rd row
  COLOR_PALETTE.green[index],
  COLOR_PALETTE.teal[index],
  COLOR_PALETTE.yellow[index],
  COLOR_PALETTE.orange[index],
  COLOR_PALETTE.red[index]
];
var rgbToHex = (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

// src/constants.ts
init_define_import_meta_env();
var supportsResizeObserver = typeof window !== "undefined" && "ResizeObserver" in window;
var APP_NAME = "Excalidraw";
var TEXT_AUTOWRAP_THRESHOLD = 36;
var DRAGGING_THRESHOLD = 10;
var MINIMUM_ARROW_SIZE = 20;
var LINE_CONFIRM_THRESHOLD = 8;
var ELEMENT_SHIFT_TRANSLATE_AMOUNT = 5;
var ELEMENT_TRANSLATE_AMOUNT = 1;
var TEXT_TO_CENTER_SNAP_THRESHOLD = 30;
var SHIFT_LOCKING_ANGLE = Math.PI / 12;
var DEFAULT_LASER_COLOR = "red";
var CURSOR_TYPE = {
  TEXT: "text",
  CROSSHAIR: "crosshair",
  GRABBING: "grabbing",
  GRAB: "grab",
  POINTER: "pointer",
  MOVE: "move",
  AUTO: ""
};
var POINTER_BUTTON = {
  MAIN: 0,
  WHEEL: 1,
  SECONDARY: 2,
  TOUCH: -1,
  ERASER: 5
};
var POINTER_EVENTS = {
  enabled: "all",
  disabled: "none",
  // asserted as any so it can be freely assigned to React Element
  // "pointerEnvets" CSS prop
  inheritFromUI: "var(--ui-pointerEvents)"
};
var EVENT = /* @__PURE__ */ ((EVENT2) => {
  EVENT2["COPY"] = "copy";
  EVENT2["PASTE"] = "paste";
  EVENT2["CUT"] = "cut";
  EVENT2["KEYDOWN"] = "keydown";
  EVENT2["KEYUP"] = "keyup";
  EVENT2["MOUSE_MOVE"] = "mousemove";
  EVENT2["RESIZE"] = "resize";
  EVENT2["UNLOAD"] = "unload";
  EVENT2["FOCUS"] = "focus";
  EVENT2["BLUR"] = "blur";
  EVENT2["DRAG_OVER"] = "dragover";
  EVENT2["DROP"] = "drop";
  EVENT2["GESTURE_END"] = "gestureend";
  EVENT2["BEFORE_UNLOAD"] = "beforeunload";
  EVENT2["GESTURE_START"] = "gesturestart";
  EVENT2["GESTURE_CHANGE"] = "gesturechange";
  EVENT2["POINTER_MOVE"] = "pointermove";
  EVENT2["POINTER_DOWN"] = "pointerdown";
  EVENT2["POINTER_UP"] = "pointerup";
  EVENT2["STATE_CHANGE"] = "statechange";
  EVENT2["WHEEL"] = "wheel";
  EVENT2["TOUCH_START"] = "touchstart";
  EVENT2["TOUCH_END"] = "touchend";
  EVENT2["HASHCHANGE"] = "hashchange";
  EVENT2["VISIBILITY_CHANGE"] = "visibilitychange";
  EVENT2["SCROLL"] = "scroll";
  EVENT2["EXCALIDRAW_LINK"] = "excalidraw-link";
  EVENT2["MENU_ITEM_SELECT"] = "menu.itemSelect";
  EVENT2["MESSAGE"] = "message";
  EVENT2["FULLSCREENCHANGE"] = "fullscreenchange";
  return EVENT2;
})(EVENT || {});
var YOUTUBE_STATES = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};
var ENV = {
  TEST: "test",
  DEVELOPMENT: "development",
  PRODUCTION: "production"
};
var CLASSES = {
  SIDEBAR: "sidebar",
  SHAPE_ACTIONS_MENU: "App-menu__left",
  ZOOM_ACTIONS: "zoom-actions",
  SEARCH_MENU_INPUT_WRAPPER: "layer-ui__search-inputWrapper",
  CONVERT_ELEMENT_TYPE_POPUP: "ConvertElementTypePopup",
  SHAPE_ACTIONS_THEME_SCOPE: "shape-actions-theme-scope",
  FRAME_NAME: "frame-name"
};
var CJK_HAND_DRAWN_FALLBACK_FONT = "Xiaolai";
var WINDOWS_EMOJI_FALLBACK_FONT = "Segoe UI Emoji";
var FONT_FAMILY = {
  Virgil: 1,
  Helvetica: 2,
  Cascadia: 3,
  // leave 4 unused as it was historically used for Assistant (which we don't use anymore) or custom font (Obsidian)
  Excalifont: 5,
  Nunito: 6,
  "Lilita One": 7,
  "Comic Shanns": 8,
  "Liberation Sans": 9,
  Assistant: 10
};
var SANS_SERIF_GENERIC_FONT = "sans-serif";
var MONOSPACE_GENERIC_FONT = "monospace";
var FONT_FAMILY_GENERIC_FALLBACKS = {
  [SANS_SERIF_GENERIC_FONT]: 998,
  [MONOSPACE_GENERIC_FONT]: 999
};
var FONT_FAMILY_FALLBACKS = {
  [CJK_HAND_DRAWN_FALLBACK_FONT]: 100,
  ...FONT_FAMILY_GENERIC_FALLBACKS,
  [WINDOWS_EMOJI_FALLBACK_FONT]: 1e3
};
function getGenericFontFamilyFallback(fontFamily) {
  switch (fontFamily) {
    case FONT_FAMILY.Cascadia:
    case FONT_FAMILY["Comic Shanns"]:
      return MONOSPACE_GENERIC_FONT;
    default:
      return SANS_SERIF_GENERIC_FONT;
  }
}
var getFontFamilyFallbacks = (fontFamily) => {
  const genericFallbackFont = getGenericFontFamilyFallback(fontFamily);
  switch (fontFamily) {
    case FONT_FAMILY.Excalifont:
      return [
        CJK_HAND_DRAWN_FALLBACK_FONT,
        genericFallbackFont,
        WINDOWS_EMOJI_FALLBACK_FONT
      ];
    default:
      return [genericFallbackFont, WINDOWS_EMOJI_FALLBACK_FONT];
  }
};
var THEME = {
  LIGHT: "light",
  DARK: "dark"
};
var FRAME_STYLE = {
  strokeColor: "#bbb",
  strokeWidth: 2,
  strokeStyle: "solid",
  fillStyle: "solid",
  roughness: 0,
  roundness: null,
  backgroundColor: "transparent",
  radius: 8,
  nameOffsetY: 3,
  nameColorLightTheme: "#999999",
  nameColorDarkTheme: "#7a7a7a",
  nameFontSize: 14,
  nameLineHeight: 1.25
};
var MIN_FONT_SIZE = 1;
var DEFAULT_FONT_SIZE = 20;
var DEFAULT_FONT_FAMILY = FONT_FAMILY.Excalifont;
var DEFAULT_TEXT_ALIGN = "left";
var DEFAULT_VERTICAL_ALIGN = "top";
var DEFAULT_VERSION = "{version}";
var DEFAULT_TRANSFORM_HANDLE_SPACING = 2;
var SIDE_RESIZING_THRESHOLD = 2 * DEFAULT_TRANSFORM_HANDLE_SPACING;
var EPSILON = 1e-5;
var DEFAULT_COLLISION_THRESHOLD = 2 * SIDE_RESIZING_THRESHOLD - EPSILON;
var COLOR_WHITE = "#ffffff";
var COLOR_CHARCOAL_BLACK = "#1e1e1e";
var COLOR_VOICE_CALL = "#a2f1a6";
var CANVAS_ONLY_ACTIONS = ["selectAll"];
var DEFAULT_GRID_SIZE = 20;
var DEFAULT_GRID_STEP = 5;
var IMAGE_MIME_TYPES = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  ico: "image/x-icon",
  avif: "image/avif",
  jfif: "image/jfif"
};
var STRING_MIME_TYPES = {
  text: "text/plain",
  html: "text/html",
  json: "application/json",
  // excalidraw data
  excalidraw: "application/vnd.excalidraw+json",
  // LEGACY: fully-qualified library JSON data
  excalidrawlib: "application/vnd.excalidrawlib+json",
  // list of excalidraw library item ids
  excalidrawlibIds: "application/vnd.excalidrawlib.ids+json"
};
var MIME_TYPES = {
  ...STRING_MIME_TYPES,
  // image-encoded excalidraw data
  "excalidraw.svg": "image/svg+xml",
  "excalidraw.png": "image/png",
  // binary
  binary: "application/octet-stream",
  // image
  ...IMAGE_MIME_TYPES
};
var ALLOWED_PASTE_MIME_TYPES = [
  MIME_TYPES.text,
  MIME_TYPES.html,
  ...Object.values(IMAGE_MIME_TYPES)
];
var EXPORT_IMAGE_TYPES = {
  png: "png",
  svg: "svg",
  clipboard: "clipboard"
};
var EXPORT_DATA_TYPES = {
  excalidraw: "excalidraw",
  excalidrawClipboard: "excalidraw/clipboard",
  excalidrawLibrary: "excalidrawlib",
  excalidrawClipboardWithAPI: "excalidraw-api/clipboard"
};
var getExportSource = () => window.EXCALIDRAW_EXPORT_SOURCE || window.location.origin;
var IMAGE_RENDER_TIMEOUT = 500;
var TAP_TWICE_TIMEOUT = 300;
var TOUCH_CTX_MENU_TIMEOUT = 500;
var TITLE_TIMEOUT = 1e4;
var VERSION_TIMEOUT = 3e4;
var SCROLL_TIMEOUT = 100;
var ZOOM_STEP = 0.1;
var MIN_ZOOM = 0.1;
var MAX_ZOOM = 30;
var HYPERLINK_TOOLTIP_DELAY = 300;
var IDLE_THRESHOLD = 6e4;
var ACTIVE_THRESHOLD = 3e3;
var THEME_FILTER = "invert(93%) hue-rotate(180deg)";
var URL_QUERY_KEYS = {
  addLibrary: "addLibrary"
};
var URL_HASH_KEYS = {
  addLibrary: "addLibrary"
};
var DEFAULT_UI_OPTIONS = {
  canvasActions: {
    changeViewBackgroundColor: true,
    clearCanvas: true,
    export: { saveFileToDisk: true },
    loadScene: true,
    saveToActiveFile: true,
    toggleTheme: null,
    saveAsImage: true
  },
  tools: {
    image: true
  }
};
var MAX_DECIMALS_FOR_SVG_EXPORT = 2;
var EXPORT_SCALES = [1, 2, 3];
var DEFAULT_EXPORT_PADDING = 10;
var DEFAULT_MAX_IMAGE_WIDTH_OR_HEIGHT = 1440;
var MAX_ALLOWED_FILE_BYTES = 4 * 1024 * 1024;
var SVG_NS = "http://www.w3.org/2000/svg";
var SVG_DOCUMENT_PREAMBLE = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
`;
var ENCRYPTION_KEY_BITS = 128;
var VERSIONS = {
  excalidraw: 2,
  excalidrawLibrary: 2
};
var BOUND_TEXT_PADDING = 5;
var ARROW_LABEL_WIDTH_FRACTION = 0.7;
var ARROW_LABEL_FONT_SIZE_TO_MIN_WIDTH_RATIO = 11;
var VERTICAL_ALIGN = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom"
};
var TEXT_ALIGN = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right"
};
var ELEMENT_READY_TO_ERASE_OPACITY = 20;
var DEFAULT_PROPORTIONAL_RADIUS = 0.25;
var DEFAULT_ADAPTIVE_RADIUS = 32;
var ROUNDNESS = {
  // Used for legacy rounding (rectangles), which currently works the same
  // as PROPORTIONAL_RADIUS, but we need to differentiate for UI purposes and
  // forwards-compat.
  LEGACY: 1,
  // Used for linear elements & diamonds
  PROPORTIONAL_RADIUS: 2,
  // Current default algorithm for rectangles, using fixed pixel radius.
  // It's working similarly to a regular border-radius, but attemps to make
  // radius visually similar across differnt element sizes, especially
  // very large and very small elements.
  //
  // NOTE right now we don't allow configuration and use a constant radius
  // (see DEFAULT_ADAPTIVE_RADIUS constant)
  ADAPTIVE_RADIUS: 3
};
var ROUGHNESS = {
  architect: 0,
  artist: 1,
  cartoonist: 2
};
var STROKE_WIDTH = {
  thin: 1,
  bold: 2,
  extraBold: 4
};
var DEFAULT_ELEMENT_PROPS = {
  strokeColor: COLOR_PALETTE.black,
  backgroundColor: COLOR_PALETTE.transparent,
  fillStyle: "solid",
  strokeWidth: 2,
  strokeStyle: "solid",
  roughness: ROUGHNESS.architect,
  opacity: 100,
  locked: false
};
var LIBRARY_SIDEBAR_TAB = "library";
var CANVAS_SEARCH_TAB = "search";
var DEFAULT_SIDEBAR = {
  name: "default",
  defaultTab: LIBRARY_SIDEBAR_TAB
};
var LIBRARY_DISABLED_TYPES = /* @__PURE__ */ new Set([
  "iframe",
  "embeddable",
  "image"
]);
var TOOL_TYPE = {
  selection: "selection",
  lasso: "lasso",
  rectangle: "rectangle",
  diamond: "diamond",
  ellipse: "ellipse",
  arrow: "arrow",
  line: "line",
  freedraw: "freedraw",
  text: "text",
  image: "image",
  eraser: "eraser",
  hand: "hand",
  frame: "frame",
  magicframe: "magicframe",
  embeddable: "embeddable",
  laser: "laser"
};
var EDITOR_LS_KEYS = {
  OAI_API_KEY: "excalidraw-oai-api-key",
  // legacy naming (non)scheme
  MERMAID_TO_EXCALIDRAW: "mermaid-to-excalidraw",
  PUBLISH_LIBRARY: "publish-library-data"
};
var DEFAULT_FILENAME = "Untitled";
var STATS_PANELS = { generalStats: 1, elementProperties: 2 };
var MIN_WIDTH_OR_HEIGHT = 1;
var ARROW_TYPE = {
  sharp: "sharp",
  round: "round",
  elbow: "elbow"
};
var DEFAULT_REDUCED_GLOBAL_ALPHA = 0.3;
var ELEMENT_LINK_KEY = "element";
var ORIG_ID = Symbol.for("__test__originalId__");
var UserIdleState = /* @__PURE__ */ ((UserIdleState2) => {
  UserIdleState2["ACTIVE"] = "active";
  UserIdleState2["AWAY"] = "away";
  UserIdleState2["IDLE"] = "idle";
  return UserIdleState2;
})(UserIdleState || {});
var LINE_POLYGON_POINT_MERGE_DISTANCE = 20;
var DOUBLE_TAP_POSITION_THRESHOLD = 35;
var BIND_MODE_TIMEOUT = 700;
var MOBILE_ACTION_BUTTON_BG = {
  background: "var(--mobile-action-button-bg)"
};

// src/font-metadata.ts
init_define_import_meta_env();
var FONT_METADATA = {
  [FONT_FAMILY.Excalifont]: {
    metrics: {
      unitsPerEm: 1e3,
      ascender: 886,
      descender: -374,
      lineHeight: 1.25
    }
  },
  [FONT_FAMILY.Nunito]: {
    metrics: {
      unitsPerEm: 1e3,
      ascender: 1011,
      descender: -353,
      lineHeight: 1.25
    }
  },
  [FONT_FAMILY["Lilita One"]]: {
    metrics: {
      unitsPerEm: 1e3,
      ascender: 923,
      descender: -220,
      lineHeight: 1.15
    }
  },
  [FONT_FAMILY["Comic Shanns"]]: {
    metrics: {
      unitsPerEm: 1e3,
      ascender: 750,
      descender: -250,
      lineHeight: 1.25
    }
  },
  [FONT_FAMILY.Virgil]: {
    metrics: {
      unitsPerEm: 1e3,
      ascender: 886,
      descender: -374,
      lineHeight: 1.25
    },
    deprecated: true
  },
  [FONT_FAMILY.Helvetica]: {
    metrics: {
      unitsPerEm: 2048,
      ascender: 1577,
      descender: -471,
      lineHeight: 1.15
    },
    deprecated: true,
    local: true
  },
  [FONT_FAMILY.Cascadia]: {
    metrics: {
      unitsPerEm: 2048,
      ascender: 1900,
      descender: -480,
      lineHeight: 1.2
    },
    deprecated: true
  },
  [FONT_FAMILY["Liberation Sans"]]: {
    metrics: {
      unitsPerEm: 2048,
      ascender: 1854,
      descender: -434,
      lineHeight: 1.15
    },
    private: true
  },
  [FONT_FAMILY.Assistant]: {
    metrics: {
      unitsPerEm: 2048,
      ascender: 1021,
      descender: -287,
      lineHeight: 1.25
    },
    private: true
  },
  [FONT_FAMILY_FALLBACKS.Xiaolai]: {
    metrics: {
      unitsPerEm: 1e3,
      ascender: 880,
      descender: -144,
      lineHeight: 1.25
    },
    fallback: true
  },
  [FONT_FAMILY_FALLBACKS["Segoe UI Emoji"]]: {
    metrics: {
      // reusing Excalifont metrics
      unitsPerEm: 1e3,
      ascender: 886,
      descender: -374,
      lineHeight: 1.25
    },
    local: true,
    fallback: true
  }
};
var GOOGLE_FONTS_RANGES = {
  LATIN: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  LATIN_EXT: "U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
  CYRILIC_EXT: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
  CYRILIC: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
  VIETNAMESE: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB"
};
var LOCAL_FONT_PROTOCOL = "local:";
var getVerticalOffset = (fontFamily, fontSize, lineHeightPx) => {
  const { unitsPerEm, ascender, descender } = FONT_METADATA[fontFamily]?.metrics || FONT_METADATA[FONT_FAMILY.Excalifont].metrics;
  const fontSizeEm = fontSize / unitsPerEm;
  const lineGap = (lineHeightPx - fontSizeEm * ascender + fontSizeEm * descender) / 2;
  const verticalOffset = fontSizeEm * ascender + lineGap;
  return verticalOffset;
};
var getLineHeight = (fontFamily) => {
  const { lineHeight } = FONT_METADATA[fontFamily]?.metrics || FONT_METADATA[FONT_FAMILY.Excalifont].metrics;
  return lineHeight;
};

// src/queue.ts
init_define_import_meta_env();
var Queue = class {
  jobs = [];
  running = false;
  tick() {
    if (this.running) {
      return;
    }
    const job = this.jobs.shift();
    if (job) {
      this.running = true;
      job.promise.resolve(
        promiseTry(job.jobFactory, ...job.args).finally(() => {
          this.running = false;
          this.tick();
        })
      );
    } else {
      this.running = false;
    }
  }
  push(jobFactory, ...args) {
    const promise = resolvablePromise();
    this.jobs.push({ jobFactory, promise, args });
    this.tick();
    return promise;
  }
};

// src/keys.ts
init_define_import_meta_env();

// src/editorInterface.ts
init_define_import_meta_env();
var DESKTOP_UI_MODE_STORAGE_KEY = "excalidraw.desktopUIMode";
var MQ_MAX_MOBILE = 599;
var MQ_MAX_WIDTH_LANDSCAPE = 1e3;
var MQ_MAX_HEIGHT_LANDSCAPE = 500;
var MQ_MIN_TABLET = MQ_MAX_MOBILE + 1;
var MQ_MAX_TABLET = 1400;
var MQ_MIN_WIDTH_DESKTOP = 1440;
var MQ_RIGHT_SIDEBAR_MIN_WIDTH = 1229;
var isDarwin = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
var isWindows = /^Win/.test(navigator.platform);
var isAndroid = /\b(android)\b/i.test(navigator.userAgent);
var isFirefox = typeof window !== "undefined" && "netscape" in window && navigator.userAgent.indexOf("rv:") > 1 && navigator.userAgent.indexOf("Gecko") > 1;
var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
var isSafari = !isChrome && navigator.userAgent.indexOf("Safari") !== -1;
var isIOS = /iPad|iPhone/i.test(navigator.platform) || // iPadOS 13+
navigator.userAgent.includes("Mac") && "ontouchend" in document;
var isBrave = () => navigator.brave?.isBrave?.name === "isBrave";
var isMobileBreakpoint = (width, height) => {
  return width <= MQ_MAX_MOBILE || height < MQ_MAX_HEIGHT_LANDSCAPE && width < MQ_MAX_WIDTH_LANDSCAPE;
};
var isTabletBreakpoint = (editorWidth, editorHeight) => {
  const minSide = Math.min(editorWidth, editorHeight);
  const maxSide = Math.max(editorWidth, editorHeight);
  return minSide >= MQ_MIN_TABLET && maxSide <= MQ_MAX_TABLET;
};
var isMobileOrTablet = () => {
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const uaData = navigator.userAgentData;
  if (uaData) {
    const plat = (uaData.platform || "").toLowerCase();
    const isDesktopOS = plat === "windows" || plat === "macos" || plat === "linux" || plat === "chrome os";
    if (uaData.mobile === true) {
      return true;
    }
    if (uaData.mobile === false && plat === "android") {
      const looksTouchTablet = matchMedia?.("(hover: none)").matches && matchMedia?.("(pointer: coarse)").matches;
      return looksTouchTablet;
    }
    if (isDesktopOS) {
      return false;
    }
  }
  if (isIOS) {
    return true;
  }
  if (isAndroid) {
    const isAndroidPhone = /Mobile/i.test(ua);
    const isAndroidTablet = !isAndroidPhone;
    if (isAndroidPhone || isAndroidTablet) {
      const looksTouchTablet = matchMedia?.("(hover: none)").matches && matchMedia?.("(pointer: coarse)").matches;
      return looksTouchTablet;
    }
  }
  const looksDesktopPlatform = /Win|Linux|CrOS|Mac/.test(platform) || /Windows NT|X11|CrOS|Macintosh/.test(ua);
  if (looksDesktopPlatform) {
    return false;
  }
  return false;
};
var getFormFactor = (editorWidth, editorHeight) => {
  if (isMobileBreakpoint(editorWidth, editorHeight)) {
    return "phone";
  }
  if (isTabletBreakpoint(editorWidth, editorHeight)) {
    return "tablet";
  }
  return "desktop";
};
var deriveStylesPanelMode = (editorInterface) => {
  if (editorInterface.formFactor === "phone") {
    return "mobile";
  }
  if (editorInterface.formFactor === "tablet") {
    return "compact";
  }
  return editorInterface.desktopUIMode;
};
var createUserAgentDescriptor = (userAgentString) => {
  const normalizedUA = userAgentString ?? "";
  let platform = "unknown";
  if (isIOS) {
    platform = "ios";
  } else if (isAndroid) {
    platform = "android";
  } else if (normalizedUA) {
    platform = "other";
  }
  return {
    isMobileDevice: isMobileOrTablet(),
    platform
  };
};
var loadDesktopUIModePreference = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(DESKTOP_UI_MODE_STORAGE_KEY);
    if (stored === "compact" || stored === "full") {
      return stored;
    }
  } catch (error) {
  }
  return null;
};
var persistDesktopUIMode = (mode) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(DESKTOP_UI_MODE_STORAGE_KEY, mode);
  } catch (error) {
  }
};
var setDesktopUIMode = (mode) => {
  if (mode !== "compact" && mode !== "full") {
    return;
  }
  persistDesktopUIMode(mode);
  return mode;
};

// src/keys.ts
var CODES = {
  EQUAL: "Equal",
  MINUS: "Minus",
  NUM_ADD: "NumpadAdd",
  NUM_SUBTRACT: "NumpadSubtract",
  NUM_ZERO: "Numpad0",
  BRACKET_RIGHT: "BracketRight",
  BRACKET_LEFT: "BracketLeft",
  ONE: "Digit1",
  TWO: "Digit2",
  THREE: "Digit3",
  NINE: "Digit9",
  QUOTE: "Quote",
  ZERO: "Digit0",
  SLASH: "Slash",
  C: "KeyC",
  D: "KeyD",
  H: "KeyH",
  V: "KeyV",
  Z: "KeyZ",
  Y: "KeyY",
  R: "KeyR",
  S: "KeyS"
};
var KEYS = {
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
  BACKSPACE: "Backspace",
  ALT: "Alt",
  CTRL_OR_CMD: isDarwin ? "metaKey" : "ctrlKey",
  DELETE: "Delete",
  ENTER: "Enter",
  ESCAPE: "Escape",
  QUESTION_MARK: "?",
  SPACE: " ",
  TAB: "Tab",
  CHEVRON_LEFT: "<",
  CHEVRON_RIGHT: ">",
  PERIOD: ".",
  COMMA: ",",
  SUBTRACT: "-",
  SLASH: "/",
  A: "a",
  C: "c",
  D: "d",
  E: "e",
  F: "f",
  G: "g",
  H: "h",
  I: "i",
  L: "l",
  O: "o",
  P: "p",
  Q: "q",
  R: "r",
  S: "s",
  T: "t",
  V: "v",
  X: "x",
  Y: "y",
  Z: "z",
  K: "k",
  W: "w",
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9"
};
var KeyCodeMap = /* @__PURE__ */ new Map([
  [KEYS.Z, CODES.Z],
  [KEYS.Y, CODES.Y]
]);
var isLatinChar = (key) => /^[a-z]$/.test(key.toLowerCase());
var matchKey = (event, key) => {
  if (key === event.key.toLowerCase()) {
    return true;
  }
  const code = KeyCodeMap.get(key);
  return Boolean(code && !isLatinChar(event.key) && event.code === code);
};
var isArrowKey = (key) => key === KEYS.ARROW_LEFT || key === KEYS.ARROW_RIGHT || key === KEYS.ARROW_DOWN || key === KEYS.ARROW_UP;
var shouldResizeFromCenter = (event) => event.altKey;
var shouldMaintainAspectRatio = (event) => event.shiftKey;
var shouldRotateWithDiscreteAngle = (event) => event.shiftKey;

// src/points.ts
init_define_import_meta_env();
import {
  pointFromPair
} from "@excalidraw/math";
var getSizeFromPoints = (points) => {
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  };
};
var rescalePoints = (dimension, newSize, points, normalize) => {
  const coordinates = points.map((point) => point[dimension]);
  const maxCoordinate = Math.max(...coordinates);
  const minCoordinate = Math.min(...coordinates);
  const size = maxCoordinate - minCoordinate;
  const scale = size === 0 ? 1 : newSize / size;
  let nextMinCoordinate = Infinity;
  const scaledPoints = points.map((point) => {
    const newCoordinate = point[dimension] * scale;
    const newPoint = [...point];
    newPoint[dimension] = newCoordinate;
    if (newCoordinate < nextMinCoordinate) {
      nextMinCoordinate = newCoordinate;
    }
    return newPoint;
  });
  if (!normalize) {
    return scaledPoints;
  }
  if (scaledPoints.length === 2) {
    return scaledPoints;
  }
  const translation = minCoordinate - nextMinCoordinate;
  const nextPoints = scaledPoints.map(
    (scaledPoint) => pointFromPair(
      scaledPoint.map((value, currentDimension) => {
        return currentDimension === dimension ? value + translation : value;
      })
    )
  );
  return nextPoints;
};
var getGridPoint = (x, y, gridSize) => {
  if (gridSize) {
    return [
      Math.round(x / gridSize) * gridSize,
      Math.round(y / gridSize) * gridSize
    ];
  }
  return [x, y];
};

// src/promise-pool.ts
init_define_import_meta_env();
var import_es6_promise_pool = __toESM(require_es6_promise_pool(), 1);
var PromisePool = class {
  pool;
  entries = {};
  constructor(source, concurrency) {
    this.pool = new import_es6_promise_pool.default(
      source,
      concurrency
    );
  }
  all() {
    const listener = (event) => {
      if (event.data.result) {
        const [index, value] = event.data.result;
        this.entries[index] = value;
      }
    };
    this.pool.addEventListener("fulfilled", listener);
    return this.pool.start().then(() => {
      setTimeout(() => {
        this.pool.removeEventListener("fulfilled", listener);
      });
      return Object.values(this.entries);
    });
  }
};

// src/random.ts
init_define_import_meta_env();

// ../../node_modules/nanoid/index.browser.js
init_define_import_meta_env();

// ../../node_modules/nanoid/url-alphabet/index.js
init_define_import_meta_env();

// ../../node_modules/nanoid/index.browser.js
var nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
  byte &= 63;
  if (byte < 36) {
    id += byte.toString(36);
  } else if (byte < 62) {
    id += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id += "-";
  } else {
    id += "_";
  }
  return id;
}, "");

// ../../node_modules/roughjs/bin/math.js
init_define_import_meta_env();
var Random = class {
  constructor(seed) {
    this.seed = seed;
  }
  next() {
    if (this.seed) {
      return (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31;
    } else {
      return Math.random();
    }
  }
};

// src/utils.ts
init_define_import_meta_env();
import { average } from "@excalidraw/math";
var mockDateTime = null;
var setDateTimeForTests = (dateTime) => {
  mockDateTime = dateTime;
};
var getDateTime = () => {
  if (mockDateTime) {
    return mockDateTime;
  }
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hr = `${date.getHours()}`.padStart(2, "0");
  const min = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}-${hr}${min}`;
};
var capitalizeString = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var isToolIcon = (target) => target instanceof HTMLElement && target.className.includes("ToolIcon");
var isInputLike = (target) => target instanceof HTMLElement && target.dataset.type === "wysiwyg" || target instanceof HTMLBRElement || // newline in wysiwyg
target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
var isInteractive = (target) => {
  return isInputLike(target) || target instanceof Element && !!target.closest("label, button");
};
var isWritableElement = (target) => target instanceof HTMLElement && target.dataset.type === "wysiwyg" || target instanceof HTMLBRElement || // newline in wysiwyg
target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement && (target.type === "text" || target.type === "number" || target.type === "password" || target.type === "search");
var getFontFamilyString = ({
  fontFamily
}) => {
  for (const [fontFamilyString, id] of Object.entries(FONT_FAMILY)) {
    if (id === fontFamily) {
      return `${fontFamilyString}${getFontFamilyFallbacks(id).map((x) => `, ${x}`).join("")}`;
    }
  }
  return WINDOWS_EMOJI_FALLBACK_FONT;
};
var getFontString = ({
  fontSize,
  fontFamily
}) => {
  return `${fontSize}px ${getFontFamilyString({ fontFamily })}`;
};
var nextAnimationFrame = async (cb) => {
  requestAnimationFrame(() => requestAnimationFrame(cb));
};
var debounce = (fn, timeout) => {
  let handle = 0;
  let lastArgs = null;
  const ret = (...args) => {
    lastArgs = args;
    clearTimeout(handle);
    handle = window.setTimeout(() => {
      lastArgs = null;
      fn(...args);
    }, timeout);
  };
  ret.flush = () => {
    clearTimeout(handle);
    if (lastArgs) {
      const _lastArgs = lastArgs;
      lastArgs = null;
      fn(..._lastArgs);
    }
  };
  ret.cancel = () => {
    lastArgs = null;
    clearTimeout(handle);
  };
  return ret;
};
var throttleRAF = (fn, opts) => {
  let timerId = null;
  let lastArgs = null;
  let lastArgsTrailing = null;
  const scheduleFunc = (args) => {
    timerId = window.requestAnimationFrame(() => {
      timerId = null;
      fn(...args);
      lastArgs = null;
      if (lastArgsTrailing) {
        lastArgs = lastArgsTrailing;
        lastArgsTrailing = null;
        scheduleFunc(lastArgs);
      }
    });
  };
  const ret = (...args) => {
    if (isTestEnv()) {
      fn(...args);
      return;
    }
    lastArgs = args;
    if (timerId === null) {
      scheduleFunc(lastArgs);
    } else if (opts?.trailing) {
      lastArgsTrailing = args;
    }
  };
  ret.flush = () => {
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }
    if (lastArgs) {
      fn(...lastArgsTrailing || lastArgs);
      lastArgs = lastArgsTrailing = null;
    }
  };
  ret.cancel = () => {
    lastArgs = lastArgsTrailing = null;
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }
  };
  return ret;
};
var easeOut = (k) => {
  return 1 - Math.pow(1 - k, 4);
};
var easeOutInterpolate = (from, to, progress) => {
  return (to - from) * easeOut(progress) + from;
};
var easeToValuesRAF = ({
  fromValues,
  toValues,
  onStep,
  duration = 250,
  interpolateValue,
  onStart,
  onEnd,
  onCancel
}) => {
  let canceled = false;
  let frameId = 0;
  let startTime;
  function step(timestamp) {
    if (canceled) {
      return;
    }
    if (startTime === void 0) {
      startTime = timestamp;
      onStart?.();
    }
    const elapsed = Math.min(timestamp - startTime, duration);
    const factor = easeOut(elapsed / duration);
    const newValues = {};
    Object.keys(fromValues).forEach((key) => {
      const _key = key;
      const result = (toValues[_key] - fromValues[_key]) * factor + fromValues[_key];
      newValues[_key] = result;
    });
    onStep(newValues);
    if (elapsed < duration) {
      const progress = elapsed / duration;
      const newValues2 = {};
      Object.keys(fromValues).forEach((key) => {
        const _key = key;
        const startValue = fromValues[_key];
        const endValue = toValues[_key];
        let result;
        result = interpolateValue ? interpolateValue(startValue, endValue, progress, _key) : easeOutInterpolate(startValue, endValue, progress);
        if (result == null) {
          result = easeOutInterpolate(startValue, endValue, progress);
        }
        newValues2[_key] = result;
      });
      onStep(newValues2);
      frameId = window.requestAnimationFrame(step);
    } else {
      onStep(toValues);
      onEnd?.();
    }
  }
  frameId = window.requestAnimationFrame(step);
  return () => {
    onCancel?.();
    canceled = true;
    window.cancelAnimationFrame(frameId);
  };
};
var chunk = (array, size) => {
  if (!array.length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = Array(Math.ceil(array.length / size));
  while (index < array.length) {
    result[resIndex++] = array.slice(index, index += size);
  }
  return result;
};
var selectNode = (node) => {
  const selection = window.getSelection();
  if (selection) {
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
var removeSelection = () => {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
};
var distance = (x, y) => Math.abs(x - y);
var isSelectionLikeTool = (type) => {
  return type === "selection" || type === "lasso";
};
var updateActiveTool = (appState, data) => {
  if (data.type === "custom") {
    return {
      ...appState.activeTool,
      type: "custom",
      customType: data.customType,
      locked: data.locked ?? appState.activeTool.locked
    };
  }
  return {
    ...appState.activeTool,
    lastActiveTool: data.lastActiveToolBeforeEraser === void 0 ? appState.activeTool.lastActiveTool : data.lastActiveToolBeforeEraser,
    type: data.type,
    customType: null,
    locked: data.locked ?? appState.activeTool.locked,
    fromSelection: data.fromSelection ?? false
  };
};
var isFullScreen = () => document.fullscreenElement?.nodeName === "HTML";
var allowFullScreen = () => document.documentElement.requestFullscreen();
var exitFullScreen = () => document.exitFullscreen();
var viewportCoordsToSceneCoords = ({ clientX, clientY }, {
  zoom,
  offsetLeft,
  offsetTop,
  scrollX,
  scrollY
}) => {
  const x = (clientX - offsetLeft) / zoom.value - scrollX;
  const y = (clientY - offsetTop) / zoom.value - scrollY;
  return { x, y };
};
var sceneCoordsToViewportCoords = ({ sceneX, sceneY }, {
  zoom,
  offsetLeft,
  offsetTop,
  scrollX,
  scrollY
}) => {
  const x = (sceneX + scrollX) * zoom.value + offsetLeft;
  const y = (sceneY + scrollY) * zoom.value + offsetTop;
  return { x, y };
};
var getGlobalCSSVariable = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
var RS_LTR_CHARS = "A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u0300-\u0590\u0800-\u1FFF\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF";
var RS_RTL_CHARS = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC";
var RE_RTL_CHECK = new RegExp(`^[^${RS_LTR_CHARS}]*[${RS_RTL_CHARS}]`);
var isRTL = (text) => RE_RTL_CHECK.test(text);
var tupleToCoors = (xyTuple) => {
  const [x, y] = xyTuple;
  return { x, y };
};
var muteFSAbortError = (error) => {
  if (error?.name === "AbortError") {
    console.warn(error);
    return;
  }
  throw error;
};
var findIndex = (array, cb, fromIndex = 0) => {
  if (fromIndex < 0) {
    fromIndex = array.length + fromIndex;
  }
  fromIndex = Math.min(array.length, Math.max(fromIndex, 0));
  let index = fromIndex - 1;
  while (++index < array.length) {
    if (cb(array[index], index, array)) {
      return index;
    }
  }
  return -1;
};
var findLastIndex = (array, cb, fromIndex = array.length - 1) => {
  if (fromIndex < 0) {
    fromIndex = array.length + fromIndex;
  }
  fromIndex = Math.min(array.length - 1, Math.max(fromIndex, 0));
  let index = fromIndex + 1;
  while (--index > -1) {
    if (cb(array[index], index, array)) {
      return index;
    }
  }
  return -1;
};
var mapFind = (collection, iteratee) => {
  for (let idx = 0; idx < collection.length; idx++) {
    const result = iteratee(collection[idx], idx);
    if (result != null) {
      return result;
    }
  }
  return void 0;
};
var isTransparent = (color) => {
  const isRGBTransparent = color.length === 5 && color.substr(4, 1) === "0";
  const isRRGGBBTransparent = color.length === 9 && color.substr(7, 2) === "00";
  return isRGBTransparent || isRRGGBBTransparent || color === COLOR_PALETTE.transparent;
};
var resolvablePromise = () => {
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
};
var nFormatter = (num, digits) => {
  const si = [
    { value: 1, symbol: "b" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (num >= si[index].value) {
      break;
    }
  }
  return (num / si[index].value).toFixed(digits).replace(rx, "$1") + si[index].symbol;
};
var getVersion = () => {
  return document.querySelector('meta[name="version"]')?.content || DEFAULT_VERSION;
};
var supportsEmoji = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return false;
  }
  const offset = 12;
  ctx.fillStyle = "#f00";
  ctx.textBaseline = "top";
  ctx.font = "32px Arial";
  ctx.fillText("\u{1F600}", 0, 0);
  return ctx.getImageData(offset, offset, 1, 1).data[0] !== 0;
};
var getNearestScrollableContainer = (element) => {
  let parent = element.parentElement;
  while (parent) {
    if (parent === document.body) {
      return document;
    }
    const { overflowY } = window.getComputedStyle(parent);
    const hasScrollableContent = parent.scrollHeight > parent.clientHeight;
    if (hasScrollableContent && (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay")) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return document;
};
var focusNearestParent = (element) => {
  let parent = element.parentElement;
  while (parent) {
    if (parent.tabIndex > -1) {
      parent.focus();
      return;
    }
    parent = parent.parentElement;
  }
};
var preventUnload = (event) => {
  event.preventDefault();
  event.returnValue = "";
};
var bytesToHexString = (bytes) => {
  return Array.from(bytes).map((byte) => `0${byte.toString(16)}`.slice(-2)).join("");
};
var getUpdatedTimestamp = () => isTestEnv() ? 1 : Date.now();
var arrayToMap = (items) => {
  if (items instanceof Map) {
    return items;
  }
  return items.reduce((acc, element) => {
    acc.set(typeof element === "string" ? element : element.id, element);
    return acc;
  }, /* @__PURE__ */ new Map());
};
var arrayToMapWithIndex = (elements) => elements.reduce((acc, element, idx) => {
  acc.set(element.id, [element, idx]);
  return acc;
}, /* @__PURE__ */ new Map());
var arrayToObject = (array, groupBy) => array.reduce((acc, value, idx) => {
  acc[groupBy ? groupBy(value) : idx] = value;
  return acc;
}, {});
var arrayToList = (array) => array.reduce((acc, curr, index) => {
  const node = { ...curr, prev: null, next: null };
  if (index !== 0) {
    const prevNode = acc[index - 1];
    node.prev = prevNode;
    prevNode.next = node;
    if (index === array.length - 1) {
      const firstNode = acc[0];
      node.next = firstNode;
      firstNode.prev = node;
    }
  }
  acc.push(node);
  return acc;
}, []);
var toIterable = (values) => {
  return Array.isArray(values) ? values : values.values();
};
var toArray = (values) => {
  return Array.isArray(values) ? values : Array.from(toIterable(values));
};
var isTestEnv = () => define_import_meta_env_default.MODE === ENV.TEST;
var isDevEnv = () => define_import_meta_env_default.MODE === ENV.DEVELOPMENT;
var isProdEnv = () => define_import_meta_env_default.MODE === ENV.PRODUCTION;
var isServerEnv = () => typeof process !== "undefined" && true;
var wrapEvent = (name, nativeEvent) => {
  return new CustomEvent(name, {
    detail: {
      nativeEvent
    },
    cancelable: true
  });
};
var updateObject = (obj, updates) => {
  let didChange = false;
  for (const key in updates) {
    const value = updates[key];
    if (typeof value !== "undefined") {
      if (obj[key] === value && // if object, always update because its attrs could have changed
      (typeof value !== "object" || value === null)) {
        continue;
      }
      didChange = true;
    }
  }
  if (!didChange) {
    return obj;
  }
  return {
    ...obj,
    ...updates
  };
};
var isPrimitive = (val) => {
  const type = typeof val;
  return val == null || type !== "object" && type !== "function";
};
var getFrame = () => {
  try {
    return window.self === window.top ? "top" : "iframe";
  } catch (error) {
    return "iframe";
  }
};
var isRunningInIframe = () => getFrame() === "iframe";
var isPromiseLike = (value) => {
  return !!value && typeof value === "object" && "then" in value && "catch" in value && "finally" in value;
};
var queryFocusableElements = (container) => {
  const focusableElements = container?.querySelectorAll(
    "button, a, input, select, textarea, div[tabindex], label[tabindex]"
  );
  return focusableElements ? Array.from(focusableElements).filter(
    (element) => element.tabIndex > -1 && !element.disabled
  ) : [];
};
var _defaultIsShallowComparatorFallback = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b) && a.length === 0 && b.length === 0) {
    return true;
  }
  return a === b;
};
var isShallowEqual = (objA, objB, comparators, debug = false) => {
  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  if (aKeys.length !== bKeys.length) {
    if (debug) {
      console.warn(
        `%cisShallowEqual: objects don't have same properties ->`,
        "color: #8B4000",
        objA,
        objB
      );
    }
    return false;
  }
  if (comparators && Array.isArray(comparators)) {
    for (const key of comparators) {
      const ret = objA[key] === objB[key] || _defaultIsShallowComparatorFallback(objA[key], objB[key]);
      if (!ret) {
        if (debug) {
          console.warn(
            `%cisShallowEqual: ${key} not equal ->`,
            "color: #8B4000",
            objA[key],
            objB[key]
          );
        }
        return false;
      }
    }
    return true;
  }
  return aKeys.every((key) => {
    const comparator = comparators?.[key];
    const ret = comparator ? comparator(objA[key], objB[key]) : objA[key] === objB[key] || _defaultIsShallowComparatorFallback(objA[key], objB[key]);
    if (!ret && debug) {
      console.warn(
        `%cisShallowEqual: ${key} not equal ->`,
        "color: #8B4000",
        objA[key],
        objB[key]
      );
    }
    return ret;
  });
};
var composeEventHandlers = (originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) => {
  return function handleEvent(event) {
    originalEventHandler?.(event);
    if (!checkForDefaultPrevented || !event?.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
};
var assertNever = (value, message, softAssert) => {
  if (!message) {
    return value;
  }
  if (softAssert) {
    console.error(message);
    return value;
  }
  throw new Error(message);
};
function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
var memoize = (func) => {
  let lastArgs;
  let lastResult;
  const ret = function(opts) {
    const currentArgs = Object.entries(opts);
    if (lastArgs) {
      let argsAreEqual = true;
      for (const [key, value] of currentArgs) {
        if (lastArgs.get(key) !== value) {
          argsAreEqual = false;
          break;
        }
      }
      if (argsAreEqual) {
        return lastResult;
      }
    }
    const result = func(opts);
    lastArgs = new Map(currentArgs);
    lastResult = result;
    return result;
  };
  ret.clear = () => {
    lastArgs = void 0;
    lastResult = void 0;
  };
  return ret;
};
var isMemberOf = (collection, value) => {
  return collection instanceof Set || collection instanceof Map ? collection.has(value) : "includes" in collection ? collection.includes(value) : collection.hasOwnProperty(value);
};
var cloneJSON = (obj) => JSON.parse(JSON.stringify(obj));
var updateStable = (prevValue, nextValue) => {
  if (isShallowEqual(prevValue, nextValue)) {
    return prevValue;
  }
  return nextValue;
};
function addEventListener(target, type, listener, options) {
  if (!target) {
    return () => {
    };
  }
  target?.addEventListener?.(type, listener, options);
  return () => {
    target?.removeEventListener?.(type, listener, options);
  };
}
function getSvgPathFromStroke(points, closed = true) {
  const len = points.length;
  if (len < 4) {
    return ``;
  }
  let a = points[0];
  let b = points[1];
  const c = points[2];
  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`;
  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `;
  }
  if (closed) {
    result += "Z";
  }
  return result;
}
var normalizeEOL = (str) => {
  return str.replace(/\r?\n|\r/g, "\n");
};
var toBrandedType = (value) => {
  return value;
};
var promiseTry = async (fn, ...args) => {
  return new Promise((resolve) => {
    resolve(fn(...args));
  });
};
var isAnyTrue = (...args) => Math.max(...args.map((arg) => arg ? 1 : 0)) > 0;
var safelyParseJSON = (json) => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};
var escapeDoubleQuotes = (str) => {
  return str.replace(/"/g, "&quot;");
};
var castArray = (value) => Array.isArray(value) ? value : [value];
var isReadonlyArray = (value) => {
  return Array.isArray(value);
};
var sizeOf = (value) => {
  return isReadonlyArray(value) ? value.length : value instanceof Map || value instanceof Set ? value.size : Object.keys(value).length;
};
var reduceToCommonValue = (collection, getValue) => {
  if (sizeOf(collection) === 0) {
    return null;
  }
  const valueExtractor = getValue || ((item) => item);
  let commonValue = null;
  for (const item of collection) {
    const value = valueExtractor(item);
    if ((commonValue === null || commonValue === value) && value != null) {
      commonValue = value;
    } else {
      return null;
    }
  }
  return commonValue;
};
var FEATURE_FLAGS_STORAGE_KEY = "excalidraw-feature-flags";
var DEFAULT_FEATURE_FLAGS = {
  COMPLEX_BINDINGS: false
};
var featureFlags = null;
var getFeatureFlag = (flag) => {
  if (!featureFlags) {
    try {
      const serializedFlags = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);
      if (serializedFlags) {
        const flags = JSON.parse(serializedFlags);
        featureFlags = flags ?? DEFAULT_FEATURE_FLAGS;
      }
    } catch {
    }
  }
  return (featureFlags || DEFAULT_FEATURE_FLAGS)[flag];
};
var setFeatureFlag = (flag, value) => {
  try {
    featureFlags = {
      ...featureFlags || DEFAULT_FEATURE_FLAGS,
      [flag]: value
    };
    localStorage.setItem(
      FEATURE_FLAGS_STORAGE_KEY,
      JSON.stringify(featureFlags)
    );
  } catch (e) {
    console.error("unable to set feature flag", e);
  }
};

// src/random.ts
var random = new Random(Date.now());
var testIdBase = 0;
var randomInteger = () => Math.floor(random.next() * 2 ** 31);
var reseed = (seed) => {
  random = new Random(seed);
  testIdBase = 0;
};
var randomId = () => isTestEnv() ? `id${testIdBase++}` : nanoid();

// src/url.ts
init_define_import_meta_env();
var import_sanitize_url = __toESM(require_dist(), 1);
var normalizeLink = (link) => {
  link = link.trim();
  if (!link) {
    return link;
  }
  return (0, import_sanitize_url.sanitizeUrl)(escapeDoubleQuotes(link));
};
var isLocalLink = (link) => {
  return !!(link?.includes(location.origin) || link?.startsWith("/"));
};
var toValidURL = (link) => {
  link = normalizeLink(link);
  if (link.startsWith("/")) {
    return `${location.origin}${link}`;
  }
  try {
    new URL(link);
  } catch {
    return "about:blank";
  }
  return link;
};

// src/emitter.ts
init_define_import_meta_env();
var Emitter = class {
  subscribers = [];
  /**
   * Attaches subscriber
   *
   * @returns unsubscribe function
   */
  on(...handlers) {
    const _handlers = handlers.flat().filter((item) => typeof item === "function");
    this.subscribers.push(..._handlers);
    return () => this.off(_handlers);
  }
  once(...handlers) {
    const _handlers = handlers.flat().filter((item) => typeof item === "function");
    _handlers.push(() => detach());
    const detach = this.on(..._handlers);
    return detach;
  }
  off(...handlers) {
    const _handlers = handlers.flat();
    this.subscribers = this.subscribers.filter(
      (handler) => !_handlers.includes(handler)
    );
  }
  trigger(...payload) {
    for (const handler of this.subscribers) {
      handler(...payload);
    }
    return this;
  }
  clear() {
    this.subscribers = [];
  }
};

// src/visualdebug.ts
init_define_import_meta_env();
import {
  isLineSegment,
  lineSegment,
  pointFrom
} from "@excalidraw/math";
import { isBounds } from "@excalidraw/element";
var debugDrawCubicBezier = (c, opts) => {
  addToCurrentFrame({
    color: opts?.color ?? "purple",
    permanent: !!opts?.permanent,
    data: c
  });
};
var debugDrawLine = (segment, opts) => {
  const segments = isLineSegment(segment) ? [segment] : segment;
  segments.forEach(
    (data) => addToCurrentFrame({
      color: opts?.color ?? "red",
      data,
      permanent: !!opts?.permanent
    })
  );
};
var debugDrawPoint = (p, opts) => {
  const xOffset = opts?.fuzzy ? Math.random() * 3 : 0;
  const yOffset = opts?.fuzzy ? Math.random() * 3 : 0;
  debugDrawLine(
    lineSegment(
      pointFrom(p[0] + xOffset - 10, p[1] + yOffset - 10),
      pointFrom(p[0] + xOffset + 10, p[1] + yOffset + 10)
    ),
    {
      color: opts?.color ?? "cyan",
      permanent: opts?.permanent
    }
  );
  debugDrawLine(
    lineSegment(
      pointFrom(p[0] + xOffset - 10, p[1] + yOffset + 10),
      pointFrom(p[0] + xOffset + 10, p[1] + yOffset - 10)
    ),
    {
      color: opts?.color ?? "cyan",
      permanent: opts?.permanent
    }
  );
};
var debugDrawBounds = (box, opts) => {
  (isBounds(box) ? [box] : box).forEach(
    (bbox) => debugDrawLine(
      [
        lineSegment(
          pointFrom(bbox[0], bbox[1]),
          pointFrom(bbox[2], bbox[1])
        ),
        lineSegment(
          pointFrom(bbox[2], bbox[1]),
          pointFrom(bbox[2], bbox[3])
        ),
        lineSegment(
          pointFrom(bbox[2], bbox[3]),
          pointFrom(bbox[0], bbox[3])
        ),
        lineSegment(
          pointFrom(bbox[0], bbox[3]),
          pointFrom(bbox[0], bbox[1])
        )
      ],
      {
        color: opts?.color ?? "green",
        permanent: !!opts?.permanent
      }
    )
  );
};
var debugDrawPoints = ({
  x,
  y,
  points
}, options) => {
  points.forEach(
    (p) => debugDrawPoint(pointFrom(x + p[0], y + p[1]), options)
  );
};
var debugCloseFrame = () => {
  window.visualDebug?.data.push([]);
};
var debugClear = () => {
  if (window.visualDebug?.data) {
    window.visualDebug.data = [];
  }
};
var addToCurrentFrame = (element) => {
  if (window.visualDebug?.data && window.visualDebug.data.length === 0) {
    window.visualDebug.data[0] = [];
  }
  window.visualDebug?.data && window.visualDebug.data[window.visualDebug.data.length - 1].push(element);
};
export {
  ACTIVE_THRESHOLD,
  ALLOWED_PASTE_MIME_TYPES,
  APP_NAME,
  ARROW_LABEL_FONT_SIZE_TO_MIN_WIDTH_RATIO,
  ARROW_LABEL_WIDTH_FRACTION,
  ARROW_TYPE,
  BIND_MODE_TIMEOUT,
  BOUND_TEXT_PADDING,
  BinaryHeap,
  CANVAS_ONLY_ACTIONS,
  CANVAS_PALETTE_SHADE_INDEXES,
  CANVAS_SEARCH_TAB,
  CJK_HAND_DRAWN_FALLBACK_FONT,
  CLASSES,
  CODES,
  COLORS_PER_ROW,
  COLOR_CHARCOAL_BLACK,
  COLOR_OUTLINE_CONTRAST_THRESHOLD,
  COLOR_PALETTE,
  COLOR_VOICE_CALL,
  COLOR_WHITE,
  CURSOR_TYPE,
  DEFAULT_ADAPTIVE_RADIUS,
  DEFAULT_CANVAS_BACKGROUND_PICKS,
  DEFAULT_CHART_COLOR_INDEX,
  DEFAULT_COLLISION_THRESHOLD,
  DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX,
  DEFAULT_ELEMENT_BACKGROUND_COLOR_PALETTE,
  DEFAULT_ELEMENT_BACKGROUND_PICKS,
  DEFAULT_ELEMENT_PROPS,
  DEFAULT_ELEMENT_STROKE_COLOR_INDEX,
  DEFAULT_ELEMENT_STROKE_COLOR_PALETTE,
  DEFAULT_ELEMENT_STROKE_PICKS,
  DEFAULT_EXPORT_PADDING,
  DEFAULT_FILENAME,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_GRID_SIZE,
  DEFAULT_GRID_STEP,
  DEFAULT_LASER_COLOR,
  DEFAULT_MAX_IMAGE_WIDTH_OR_HEIGHT,
  DEFAULT_PROPORTIONAL_RADIUS,
  DEFAULT_REDUCED_GLOBAL_ALPHA,
  DEFAULT_SIDEBAR,
  DEFAULT_TEXT_ALIGN,
  DEFAULT_TRANSFORM_HANDLE_SPACING,
  DEFAULT_UI_OPTIONS,
  DEFAULT_VERSION,
  DEFAULT_VERTICAL_ALIGN,
  DOUBLE_TAP_POSITION_THRESHOLD,
  DRAGGING_THRESHOLD,
  EDITOR_LS_KEYS,
  ELEMENTS_PALETTE_SHADE_INDEXES,
  ELEMENT_LINK_KEY,
  ELEMENT_READY_TO_ERASE_OPACITY,
  ELEMENT_SHIFT_TRANSLATE_AMOUNT,
  ELEMENT_TRANSLATE_AMOUNT,
  ENCRYPTION_KEY_BITS,
  ENV,
  EPSILON,
  EVENT,
  EXPORT_DATA_TYPES,
  EXPORT_IMAGE_TYPES,
  EXPORT_SCALES,
  Emitter,
  FONT_FAMILY,
  FONT_FAMILY_FALLBACKS,
  FONT_FAMILY_GENERIC_FALLBACKS,
  FONT_METADATA,
  FRAME_STYLE,
  GOOGLE_FONTS_RANGES,
  HYPERLINK_TOOLTIP_DELAY,
  IDLE_THRESHOLD,
  IMAGE_MIME_TYPES,
  IMAGE_RENDER_TIMEOUT,
  KEYS,
  KeyCodeMap,
  LIBRARY_DISABLED_TYPES,
  LIBRARY_SIDEBAR_TAB,
  LINE_CONFIRM_THRESHOLD,
  LINE_POLYGON_POINT_MERGE_DISTANCE,
  LOCAL_FONT_PROTOCOL,
  MAX_ALLOWED_FILE_BYTES,
  MAX_CUSTOM_COLORS_USED_IN_CANVAS,
  MAX_DECIMALS_FOR_SVG_EXPORT,
  MAX_ZOOM,
  MIME_TYPES,
  MINIMUM_ARROW_SIZE,
  MIN_FONT_SIZE,
  MIN_WIDTH_OR_HEIGHT,
  MIN_ZOOM,
  MOBILE_ACTION_BUTTON_BG,
  MONOSPACE_GENERIC_FONT,
  MQ_MAX_HEIGHT_LANDSCAPE,
  MQ_MAX_MOBILE,
  MQ_MAX_TABLET,
  MQ_MAX_WIDTH_LANDSCAPE,
  MQ_MIN_TABLET,
  MQ_MIN_WIDTH_DESKTOP,
  MQ_RIGHT_SIDEBAR_MIN_WIDTH,
  ORIG_ID,
  POINTER_BUTTON,
  POINTER_EVENTS,
  PromisePool,
  Queue,
  ROUGHNESS,
  ROUNDNESS,
  SANS_SERIF_GENERIC_FONT,
  SCROLL_TIMEOUT,
  SHIFT_LOCKING_ANGLE,
  SIDE_RESIZING_THRESHOLD,
  STATS_PANELS,
  STRING_MIME_TYPES,
  STROKE_WIDTH,
  SVG_DOCUMENT_PREAMBLE,
  SVG_NS,
  TAP_TWICE_TIMEOUT,
  TEXT_ALIGN,
  TEXT_AUTOWRAP_THRESHOLD,
  TEXT_TO_CENTER_SNAP_THRESHOLD,
  THEME,
  THEME_FILTER,
  TITLE_TIMEOUT,
  TOOL_TYPE,
  TOUCH_CTX_MENU_TIMEOUT,
  URL_HASH_KEYS,
  URL_QUERY_KEYS,
  UserIdleState,
  VERSIONS,
  VERSION_TIMEOUT,
  VERTICAL_ALIGN,
  WINDOWS_EMOJI_FALLBACK_FONT,
  YOUTUBE_STATES,
  ZOOM_STEP,
  addEventListener,
  allowFullScreen,
  arrayToList,
  arrayToMap,
  arrayToMapWithIndex,
  arrayToObject,
  assertNever,
  bytesToHexString,
  capitalizeString,
  castArray,
  chunk,
  cloneJSON,
  composeEventHandlers,
  createUserAgentDescriptor,
  debounce,
  debugClear,
  debugCloseFrame,
  debugDrawBounds,
  debugDrawCubicBezier,
  debugDrawLine,
  debugDrawPoint,
  debugDrawPoints,
  deriveStylesPanelMode,
  distance,
  easeOut,
  easeToValuesRAF,
  escapeDoubleQuotes,
  exitFullScreen,
  findIndex,
  findLastIndex,
  focusNearestParent,
  getAllColorsSpecificShade,
  getDateTime,
  getExportSource,
  getFeatureFlag,
  getFontFamilyFallbacks,
  getFontFamilyString,
  getFontString,
  getFormFactor,
  getFrame,
  getGenericFontFamilyFallback,
  getGlobalCSSVariable,
  getGridPoint,
  getLineHeight,
  getNearestScrollableContainer,
  getSizeFromPoints,
  getSpecificColorShades,
  getSvgPathFromStroke,
  getUpdatedTimestamp,
  getVersion,
  getVerticalOffset,
  invariant,
  isAndroid,
  isAnyTrue,
  isArrowKey,
  isBrave,
  isChrome,
  isDarwin,
  isDevEnv,
  isFirefox,
  isFullScreen,
  isIOS,
  isInputLike,
  isInteractive,
  isLatinChar,
  isLocalLink,
  isMemberOf,
  isMobileBreakpoint,
  isPrimitive,
  isProdEnv,
  isPromiseLike,
  isRTL,
  isReadonlyArray,
  isRunningInIframe,
  isSafari,
  isSelectionLikeTool,
  isServerEnv,
  isShallowEqual,
  isTabletBreakpoint,
  isTestEnv,
  isToolIcon,
  isTransparent,
  isWindows,
  isWritableElement,
  loadDesktopUIModePreference,
  mapFind,
  matchKey,
  memoize,
  muteFSAbortError,
  nFormatter,
  nextAnimationFrame,
  normalizeEOL,
  normalizeLink,
  preventUnload,
  promiseTry,
  queryFocusableElements,
  randomId,
  randomInteger,
  reduceToCommonValue,
  removeSelection,
  rescalePoints,
  reseed,
  resolvablePromise,
  rgbToHex,
  safelyParseJSON,
  sceneCoordsToViewportCoords,
  selectNode,
  setDateTimeForTests,
  setDesktopUIMode,
  setFeatureFlag,
  shouldMaintainAspectRatio,
  shouldResizeFromCenter,
  shouldRotateWithDiscreteAngle,
  sizeOf,
  supportsEmoji,
  supportsResizeObserver,
  throttleRAF,
  toArray,
  toBrandedType,
  toIterable,
  toValidURL,
  tupleToCoors,
  updateActiveTool,
  updateObject,
  updateStable,
  viewportCoordsToSceneCoords,
  wrapEvent
};
//# sourceMappingURL=index.js.map
