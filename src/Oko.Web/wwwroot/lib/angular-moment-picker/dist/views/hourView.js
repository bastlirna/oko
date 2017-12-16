"use strict";
exports.__esModule = true;
var angular = require("angular");
var moment = require("moment");
var utility_1 = require("../utility");
var HourView = /** @class */ (function () {
    function HourView($scope, $ctrl, provider) {
        this.$scope = $scope;
        this.$ctrl = $ctrl;
        this.provider = provider;
        this.perLine = 4;
        this.rows = {};
    }
    HourView.prototype.render = function () {
        var i = 0, minute = this.$scope.view.moment.clone().startOf('hour').minute(this.provider.minutesStart), minutesFormat = this.provider.minutesFormat || moment.localeData(this.$scope.locale).longDateFormat('LT').replace(/[aA]/, '').trim();
        this.rows = {};
        for (var m = 0; m <= this.provider.minutesEnd - this.provider.minutesStart; m += this.provider.minutesStep) {
            var index = Math.floor(i / this.perLine), selectable = this.$scope.limits.isSelectable(minute, 'minute');
            if (!this.rows[index])
                this.rows[index] = [];
            this.rows[index].push({
                index: minute.minute(),
                label: minute.format(minutesFormat),
                year: minute.year(),
                month: minute.month(),
                date: minute.date(),
                hour: minute.hour(),
                minute: minute.minute(),
                "class": [
                    this.$scope.keyboard && minute.isSame(this.$scope.view.moment, 'minute') ? 'highlighted' : '',
                    !selectable ? 'disabled' : utility_1.isValidMoment(this.$ctrl.$modelValue) && minute.isSame(this.$ctrl.$modelValue, 'minute') ? 'selected' : ''
                ].join(' ').trim(),
                selectable: selectable
            });
            i++;
            minute.add(this.provider.minutesStep, 'minutes');
        }
        if (this.$scope.keyboard)
            this.highlightClosest();
        // return title
        return this.$scope.view.moment.clone().startOf('hour').format('lll');
    };
    HourView.prototype.set = function (minute) {
        if (!minute.selectable)
            return;
        this.$scope.view.moment.year(minute.year).month(minute.month).date(minute.date).hour(minute.hour).minute(minute.minute);
        this.$scope.view.update();
        this.$scope.view.change('minute');
    };
    HourView.prototype.highlightClosest = function () {
        var _this = this;
        var minutes = [], minute;
        angular.forEach(this.rows, function (row) {
            angular.forEach(row, function (value) {
                if (Math.abs(value.minute - _this.$scope.view.moment.minute()) < _this.provider.minutesStep)
                    minutes.push(value);
            });
        });
        minute = minutes.sort(function (value1, value2) {
            return Math.abs(value1.minute - _this.$scope.view.moment.minute()) > Math.abs(value2.minute - _this.$scope.view.moment.minute()) ? 1 : 0;
        })[0];
        if (!minute || minute.minute - this.$scope.view.moment.minute() == 0)
            return;
        this.$scope.view.moment.year(minute.year).month(minute.month).date(minute.date).hour(minute.hour).minute(minute.minute);
        this.$scope.view.update();
        if (minute.selectable)
            minute["class"] = (minute["class"] + ' highlighted').trim();
    };
    return HourView;
}());
exports["default"] = HourView;
//# sourceMappingURL=hourView.js.map