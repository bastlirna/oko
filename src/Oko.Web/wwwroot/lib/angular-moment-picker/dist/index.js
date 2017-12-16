"use strict";
exports.__esModule = true;
var angular = require("angular");
var provider_1 = require("./provider");
exports.Provider = provider_1["default"];
var directive_1 = require("./directive");
exports.Directive = directive_1["default"];
angular
    .module('moment-picker', [])
    .provider('momentPicker', [function () { return new provider_1["default"](); }])
    .directive('momentPicker', [
    '$timeout', '$sce', '$log', '$window', 'momentPicker', '$compile', '$templateCache',
    function ($timeout, $sce, $log, $window, momentPicker, $compile, $templateCache) {
        return new directive_1["default"]($timeout, $sce, $log, $window, momentPicker, $compile, $templateCache);
    }
]);
//# sourceMappingURL=index.js.map