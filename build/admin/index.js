/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings */ "./src/admin/settings.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.render)(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_settings__WEBPACK_IMPORTED_MODULE_1__["default"], {}), document.getElementById('ph-peeps-settings-root'));

/***/ }),

/***/ "./src/admin/settings.js":
/*!*******************************!*\
  !*** ./src/admin/settings.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/admin/style.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function SettingsPage() {
  var _localSettings$ph_pee, _localSettings$ph_pee2, _localSettings$ph_pee3, _localSettings$ph_pee4, _ref, _localSettings$ph_pee5, _localSettings$ph_pee6, _localSettings$ph_pee7;
  const {
    saveEntityRecord
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.store);

  // Local state for tracking changes
  const [localSettings, setLocalSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)({});
  const [hasChanges, setHasChanges] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [showRewriteNotice, setShowRewriteNotice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(null);
  const [phoneFormatError, setPhoneFormatError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const {
    isPublic,
    hasArchive,
    phoneFormat,
    cptSlug,
    menuPosition,
    isSaving
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const record = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.store).getEditedEntityRecord('root', 'site', undefined);
    return {
      isPublic: record.ph_peeps_public_cpt,
      hasArchive: record.ph_peeps_has_archive,
      phoneFormat: record.ph_peeps_phone_format,
      cptSlug: record.ph_peeps_cpt_slug,
      menuPosition: record.ph_peeps_menu_position,
      isSaving: select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.store).isSavingEntityRecord('root', 'site')
    };
  });

  // Menu position options
  const menuPositions = [{
    value: '5',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Posts (5)', 'peeps-people-directory')
  }, {
    value: '10',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Media (10)', 'peeps-people-directory')
  }, {
    value: '15',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Links (15)', 'peeps-people-directory')
  }, {
    value: '20',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Pages (20)', 'peeps-people-directory')
  }, {
    value: '25',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Comments (25)', 'peeps-people-directory')
  }, {
    value: '60',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below First Separator (60)', 'peeps-people-directory')
  }, {
    value: '65',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Plugins (65)', 'peeps-people-directory')
  }, {
    value: '70',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Users (70)', 'peeps-people-directory')
  }, {
    value: '75',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Tools (75)', 'peeps-people-directory')
  }, {
    value: '80',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Settings (80)', 'peeps-people-directory')
  }, {
    value: '100',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Second Separator (100)', 'peeps-people-directory')
  }];
  const updateLocalSetting = (value, setting) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setHasChanges(true);
  };
  const saveSettings = async () => {
    // Prevent saving if there's a phone format error
    if (phoneFormatError) {
      setError(phoneFormatError);
      return;
    }

    // Only validate phone format if it's being changed
    if (localSettings.ph_peeps_phone_format !== undefined) {
      const formatPlaceholders = (localSettings.ph_peeps_phone_format.match(/#/g) || []).length;
      if (formatPlaceholders < 10 || formatPlaceholders > 15) {
        setPhoneFormatError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Format must contain between 10 and 15 # symbols.', 'peeps-people-directory'));
        setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Phone format must contain between 10 and 15 # symbols.', 'peeps-people-directory'));
        return;
      }
    }
    try {
      await saveEntityRecord('root', 'site', localSettings);
      setHasChanges(false);
      setError(null); // Clear any existing errors
      // Show notice if slug or public status was changed
      if (localSettings.ph_peeps_cpt_slug || localSettings.ph_peeps_public_cpt !== undefined || localSettings.ph_peeps_has_archive !== undefined) {
        setShowRewriteNotice(true);
      }
    } catch (err) {
      setError(err?.message || 'Failed to save settings. Please try again.');
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    children: [error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
      status: "error",
      isDismissible: true,
      onDismiss: () => setError(null),
      children: error
    }), showRewriteNotice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
      status: "warning",
      isDismissible: true,
      onDismiss: () => setShowRewriteNotice(false),
      className: "ph-peeps-notice",
      children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('You changed the directory slug or public status. Please visit the Permalinks page and click "Save Changes" to update your URLs.', 'peeps-people-directory'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
          href: "options-permalink.php",
          className: "button button-secondary",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Visit Permalinks Page', 'peeps-people-directory')
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "wrap ph-peeps-admin",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "ph-peeps-header",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('WP Peeps Settings', 'peeps-people-directory')
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Card, {
        className: "ph-peeps-card",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardHeader, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h2", {
            className: "ph-peeps-card__title",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Directory Settings', 'peeps-people-directory')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "ph-peeps-settings",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
              className: "ph-peeps-setting-row",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
                __nextHasNoMarginBottom: true,
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Make People Directory Public', 'peeps-people-directory'),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('When enabled, the people directory will be visible to the public.', 'peeps-people-directory'),
                checked: (_localSettings$ph_pee = localSettings.ph_peeps_public_cpt) !== null && _localSettings$ph_pee !== void 0 ? _localSettings$ph_pee : isPublic,
                onChange: value => updateLocalSetting(value, 'ph_peeps_public_cpt'),
                disabled: isSaving
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
              className: "ph-peeps-setting-row",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
                __nextHasNoMarginBottom: true,
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable People Archive Page', 'peeps-people-directory'),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('When enabled, a page listing all people will be available.', 'peeps-people-directory'),
                checked: ((_localSettings$ph_pee2 = localSettings.ph_peeps_public_cpt) !== null && _localSettings$ph_pee2 !== void 0 ? _localSettings$ph_pee2 : isPublic) ? (_localSettings$ph_pee3 = localSettings.ph_peeps_has_archive) !== null && _localSettings$ph_pee3 !== void 0 ? _localSettings$ph_pee3 : hasArchive : false,
                onChange: value => updateLocalSetting(value, 'ph_peeps_has_archive'),
                disabled: isSaving || !((_localSettings$ph_pee4 = localSettings.ph_peeps_public_cpt) !== null && _localSettings$ph_pee4 !== void 0 ? _localSettings$ph_pee4 : isPublic)
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
              className: "ph-peeps-setting-row",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
                __nextHasNoMarginBottom: true,
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Menu Position', 'peeps-people-directory'),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose where the People menu appears in the admin sidebar.', 'peeps-people-directory'),
                value: String((_ref = (_localSettings$ph_pee5 = localSettings.ph_peeps_menu_position) !== null && _localSettings$ph_pee5 !== void 0 ? _localSettings$ph_pee5 : menuPosition) !== null && _ref !== void 0 ? _ref : '25'),
                options: menuPositions,
                onChange: value => updateLocalSetting(parseInt(value, 10), 'ph_peeps_menu_position'),
                disabled: isSaving
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
              className: "ph-peeps-setting-row",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Directory Slug', 'peeps-people-directory'),
                help: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
                  children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The URL slug for the people directory (e.g., "staff" would make URLs like /staff/john-doe). Defaults to "', 'peeps-people-directory'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
                    type: "button",
                    className: "button-link",
                    onClick: () => updateLocalSetting('people', 'ph_peeps_cpt_slug'),
                    children: "people"
                  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('"', 'peeps-people-directory'), " ."]
                }),
                value: (_localSettings$ph_pee6 = localSettings.ph_peeps_cpt_slug) !== null && _localSettings$ph_pee6 !== void 0 ? _localSettings$ph_pee6 : cptSlug,
                onChange: value => updateLocalSetting(value, 'ph_peeps_cpt_slug'),
                disabled: isSaving
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "ph-peeps-setting-row",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Phone Number Format', 'peeps-people-directory'),
                help: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
                  children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use # for digits (10–15 digits). Example:', 'peeps-people-directory'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
                    type: "button",
                    className: "button-link",
                    onClick: () => updateLocalSetting('(###) ###-####', 'ph_peeps_phone_format'),
                    children: "(###) ###-####"
                  })]
                }),
                value: (_localSettings$ph_pee7 = localSettings.ph_peeps_phone_format) !== null && _localSettings$ph_pee7 !== void 0 ? _localSettings$ph_pee7 : phoneFormat,
                onChange: value => {
                  const placeholderCount = (value.match(/#/g) || []).length;
                  if (placeholderCount < 10 || placeholderCount > 15) {
                    setPhoneFormatError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Format must contain between 10 and 15 # symbols.', 'peeps-people-directory'));
                  } else {
                    setPhoneFormatError('');
                  }
                  updateLocalSetting(value, 'ph_peeps_phone_format');
                },
                disabled: isSaving
              }), phoneFormatError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
                status: "error",
                isDismissible: false,
                className: "ph-peeps-field-error",
                children: phoneFormatError
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "ph-peeps-settings__footer",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              variant: "primary",
              onClick: saveSettings,
              disabled: !hasChanges || isSaving,
              isBusy: isSaving,
              children: isSaving ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Saving…', 'peeps-people-directory') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Save Changes', 'peeps-people-directory')
            })
          })]
        })]
      })]
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingsPage);

/***/ }),

/***/ "./src/admin/style.scss":
/*!******************************!*\
  !*** ./src/admin/style.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"admin/index": 0,
/******/ 			"admin/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkpeeps_people_directory"] = globalThis["webpackChunkpeeps_people_directory"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["admin/style-index"], () => (__webpack_require__("./src/admin/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map