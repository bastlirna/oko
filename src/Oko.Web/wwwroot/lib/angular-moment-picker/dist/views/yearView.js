"use strict";
exports.__esModule = true;
var moment = require("moment");
var utility_1 = require("../utility");
var YearView = /** @class */ (function () {
    function YearView($scope, $ctrl, provider) {
        this.$scope = $scope;
        this.$ctrl = $ctrl;
        this.provider = provider;
        this.perLine = 4;
        this.rows = {};
    }
    YearView.prototype.render = function () {
        var _this = this;
        var month = this.$scope.view.moment.clone().startOf('year'), months = moment.monthsShort();
        this.rows = {};
        months.forEach(function (label, i) {
            var index = Math.floor(i / _this.perLine), selectable = _this.$scope.limits.isSelectable(month, 'month');
            if (!_this.rows[index])
                _this.rows[index] = [];
            _this.rows[index].push({
                index: month.month(),
                label: month.format(_this.provider.monthsFormat),
                year: month.year(),
                month: month.month(),
                "class": [
                    _this.$scope.keyboard && month.isSame(_this.$scope.view.moment, 'month') ? 'highlighted' : '',
                    !selectable ? 'disabled' : utility_1.isValidMoment(_this.$ctrl.$modelValue) && month.isSame(_this.$ctrl.$modelValue, 'month') ? 'selected' : ''
                ].join(' ').trim(),
                selectable: selectable
            });
            month.add(1, 'months');
        });
        // return title
        return this.$scope.view.moment.format('YYYY');
    };
    YearView.prototype.set = function (month) {
        if (!month.selectable)
            return;
        this.$scope.view.moment.year(month.year).month(month.month);
        this.$scope.view.update();
        this.$scope.view.change('month');
    };
    return YearView;
}());
exports["default"] = YearView;
//# sourceMappingURL=yearView.js.map