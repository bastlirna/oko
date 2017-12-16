"use strict";
exports.__esModule = true;
var angular = require("angular");
var utility_1 = require("../utility");
var MinuteView = /** @class */ (function () {
    function MinuteView($scope, $ctrl, provider) {
        this.$scope = $scope;
        this.$ctrl = $ctrl;
        this.provider = provider;
        this.perLine = 6;
        this.rows = {};
    }
    MinuteView.prototype.render = function () {
        var i = 0, second = this.$scope.view.moment.clone().startOf('minute').second(this.provider.secondsStart);
        this.rows = {};
        for (var s = 0; s <= this.provider.secondsEnd - this.provider.secondsStart; s += this.provider.secondsStep) {
            var index = Math.floor(i / this.perLine), selectable = this.$scope.limits.isSelectable(second, 'second');
            if (!this.rows[index])
                this.rows[index] = [];
            this.rows[index].push({
                index: second.second(),
                label: second.format(this.provider.secondsFormat),
                year: second.year(),
                month: second.month(),
                date: second.date(),
                hour: second.hour(),
                minute: second.minute(),
                second: second.second(),
                "class": [
                    this.$scope.keyboard && second.isSame(this.$scope.view.moment, 'second') ? 'highlighted' : '',
                    !selectable ? 'disabled' : utility_1.isValidMoment(this.$ctrl.$modelValue) && second.isSame(this.$ctrl.$modelValue, 'second') ? 'selected' : ''
                ].join(' ').trim(),
                selectable: selectable
            });
            i++;
            second.add(this.provider.secondsStep, 'seconds');
        }
        if (this.$scope.keyboard)
            this.highlightClosest();
        // return title
        return this.$scope.view.moment.clone().startOf('minute').format('lll');
    };
    MinuteView.prototype.set = function (second) {
        if (!second.selectable)
            return;
        this.$scope.view.moment.year(second.year).month(second.month).date(second.date).hour(second.hour).minute(second.minute).second(second.second);
        this.$scope.view.update();
        this.$scope.view.change();
    };
    MinuteView.prototype.highlightClosest = function () {
        var _this = this;
        var seconds = [], second;
        angular.forEach(this.rows, function (row) {
            angular.forEach(row, function (value) {
                if (Math.abs(value.second - _this.$scope.view.moment.second()) < _this.provider.secondsStep)
                    seconds.push(value);
            });
        });
        second = seconds.sort(function (value1, value2) {
            return Math.abs(value1.second - _this.$scope.view.moment.second()) > Math.abs(value2.second - _this.$scope.view.moment.second()) ? 1 : 0;
        })[0];
        if (!second || second.second - this.$scope.view.moment.second() == 0)
            return;
        this.$scope.view.moment.year(second.year).month(second.month).date(second.date).hour(second.hour).minute(second.minute).second(second.second);
        this.$scope.view.update();
        if (second.selectable)
            second["class"] = (second["class"] + ' highlighted').trim();
    };
    return MinuteView;
}());
exports["default"] = MinuteView;
//# sourceMappingURL=minuteView.js.map