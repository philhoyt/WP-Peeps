/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/editor":
/*!********************************!*\
  !*** external ["wp","editor"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["editor"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/plugins":
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["plugins"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/editor/index.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);









function NameFieldsPanel() {
  const [meta, setMeta] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__.useEntityProp)('postType', 'wp_peeps_people', 'meta');
  const [, setTitle] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__.useEntityProp)('postType', 'wp_peeps_people', 'title');
  const [, setSlug] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__.useEntityProp)('postType', 'wp_peeps_people', 'slug');
  const {
    lockPostSaving,
    unlockPostSaving,
    editPost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.dispatch)('core/editor');

  // Get phone format from settings
  const phoneFormat = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__.store).getEntityRecord('root', 'site')?.wp_peeps_phone_format || '(###) ###-####');
  const formatPhoneNumber = value => {
    // Strip all non-digits
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';

    // Get the format template
    let format = phoneFormat;

    // Replace each # with a digit
    let formatted = format;
    for (let i = 0; i < digits.length && i < 10; i++) {
      formatted = formatted.replace('#', digits[i]);
    }

    // Remove any remaining # placeholders
    formatted = formatted.replace(/#/g, '');
    return formatted;
  };
  const handlePhoneChange = value => {
    // Strip all non-digits and limit to 10
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setMeta({
      ...meta,
      wp_peeps_phone: digits
    });
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!meta) return;
    const firstName = meta?.wp_peeps_first_name?.trim() || '';
    const middleName = meta?.wp_peeps_middle_name?.trim() || '';
    const lastName = meta?.wp_peeps_last_name?.trim() || '';
    if (!firstName || !lastName) {
      lockPostSaving('requiredNameFields');
      return;
    }
    unlockPostSaving('requiredNameFields');

    // Create the full name with middle name if present
    const fullName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;

    // Update both title and slug
    setTitle(fullName);
    editPost({
      title: fullName
    });

    // Update slug
    const newSlug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setSlug(newSlug);
  }, [meta?.wp_peeps_first_name, meta?.wp_peeps_middle_name, meta?.wp_peeps_last_name]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_editor__WEBPACK_IMPORTED_MODULE_2__.PluginDocumentSettingPanel, {
    name: "wp-peeps-name-fields",
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Name Details', 'wp-peeps'),
    className: "wp-peeps-name-fields",
    initialOpen: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('First Name', 'wp-peeps') + ' *',
      value: meta?.wp_peeps_first_name || '',
      onChange: newValue => setMeta({
        ...meta,
        wp_peeps_first_name: newValue
      }),
      help: !meta?.wp_peeps_first_name?.trim() ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('First name is required', 'wp-peeps') : ''
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Middle Name', 'wp-peeps'),
      value: meta?.wp_peeps_middle_name || '',
      onChange: newValue => setMeta({
        ...meta,
        wp_peeps_middle_name: newValue
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Last Name', 'wp-peeps') + ' *',
      value: meta?.wp_peeps_last_name || '',
      onChange: newValue => setMeta({
        ...meta,
        wp_peeps_last_name: newValue
      }),
      help: !meta?.wp_peeps_last_name?.trim() ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Last name is required', 'wp-peeps') : ''
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Job Title', 'wp-peeps'),
      value: meta?.wp_peeps_job_title || '',
      onChange: newValue => setMeta({
        ...meta,
        wp_peeps_job_title: newValue
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Phone', 'wp-peeps'),
      value: meta?.wp_peeps_phone ? formatPhoneNumber(meta.wp_peeps_phone) : '',
      onChange: handlePhoneChange,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter 10 digit phone number', 'wp-peeps'),
      type: "tel"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      type: "email",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Email', 'wp-peeps'),
      value: meta?.wp_peeps_email || '',
      onChange: newValue => setMeta({
        ...meta,
        wp_peeps_email: newValue
      }),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter valid email address', 'wp-peeps')
    })]
  });
}
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__.registerPlugin)('wp-peeps-name-fields-panel', {
  render: NameFieldsPanel
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map