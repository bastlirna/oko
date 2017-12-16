"use strict";
exports.__esModule = true;
var angular = require("angular");
var Provider = /** @class */ (function () {
    function Provider() {
        this.settings = {
            locale: 'en',
            format: 'L LTS',
            minView: 'decade',
            maxView: 'minute',
            startView: 'year',
            inline: false,
            validate: true,
            autoclose: true,
            setOnSelect: false,
            today: false,
            keyboard: false,
            showHeader: true,
            leftArrow: '&larr;',
            rightArrow: '&rarr;',
            // Decade View
            yearsFormat: 'YYYY',
            // Year View
            monthsFormat: 'MMM',
            // Month View
            daysFormat: 'D',
            // Day View
            hoursFormat: 'HH:[00]',
            hoursStart: 0,
            hoursEnd: 23,
            // Hour View
            minutesStep: 5,
            minutesStart: 0,
            minutesEnd: 59,
            // Minute View
            secondsFormat: 'ss',
            secondsStep: 1,
            secondsStart: 0,
            secondsEnd: 59
        };
    }
    Provider.prototype.options = function (options) {
        angular.extend(this.settings, options);
        return angular.copy(this.settings);
    };
    Provider.prototype.$get = function () {
        return this.settings;
    };
    return Provider;
}());
exports["default"] = Provider;
//# sourceMappingURL=provider.js.map