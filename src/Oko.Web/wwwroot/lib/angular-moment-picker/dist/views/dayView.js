"use strict";
exports.__esModule = true;
var utility_1 = require("../utility");
var DayView = /** @class */ (function () {
    function DayView($scope, $ctrl, provider) {
        this.$scope = $scope;
        this.$ctrl = $ctrl;
        this.provider = provider;
        this.perLine = 4;
        this.rows = {};
    }
    DayView.prototype.render = function () {
        var hour = this.$scope.view.moment.clone().startOf('day').hour(this.provider.hoursStart);
        this.rows = {};
        for (var h = 0; h <= this.provider.hoursEnd - this.provider.hoursStart; h++) {
            var index = Math.floor(h / this.perLine), selectable = this.$scope.limits.isSelectable(hour, 'hour');
            if (!this.rows[index])
                this.rows[index] = [];
            this.rows[index].push({
                index: h,
                label: hour.format(this.provider.hoursFormat),
                year: hour.year(),
                month: hour.month(),
                date: hour.date(),
                hour: hour.hour(),
                "class": [
                    this.$scope.keyboard && hour.isSame(this.$scope.view.moment, 'hour') ? 'highlighted' : '',
                    !selectable ? 'disabled' : utility_1.isValidMoment(this.$ctrl.$modelValue) && hour.isSame(this.$ctrl.$modelValue, 'hour') ? 'selected' : ''
                ].join(' ').trim(),
                selectable: selectable
            });
            hour.add(1, 'hours');
        }
        // return title
        return this.$scope.view.moment.format('LL');
    };
    DayView.prototype.set = function (hour) {
        if (!hour.selectable)
            return;
        this.$scope.view.moment.year(hour.year).month(hour.month).date(hour.date).hour(hour.hour);
        this.$scope.view.update();
        this.$scope.view.change('hour');
    };
    return DayView;
}());
exports["default"] = DayView;
//# sourceMappingURL=dayView.js.map