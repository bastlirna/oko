"use strict";
exports.__esModule = true;
var angular = require("angular");
var moment = require("moment");
var utility_1 = require("../utility");
var MonthView = /** @class */ (function () {
    function MonthView($scope, $ctrl, provider) {
        this.$scope = $scope;
        this.$ctrl = $ctrl;
        this.provider = provider;
        this.perLine = moment.weekdays().length;
        this.rows = [];
    }
    MonthView.prototype.render = function () {
        var _this = this;
        var month = this.$scope.view.moment.month(), day = this.$scope.view.moment.clone().startOf('month').startOf('week').hour(12), rows = {}, firstWeek = day.week(), lastWeek = firstWeek + 5;
        this.rows = [];
        for (var week = firstWeek; week <= lastWeek; week++)
            rows[week] = Array.apply(null, Array(this.perLine)).map(function () {
                var selectable = _this.$scope.limits.isSelectable(day, 'day');
                var date = {
                    index: day.date(),
                    label: day.format(_this.provider.daysFormat),
                    year: day.year(),
                    month: day.month(),
                    date: day.date(),
                    "class": [
                        _this.$scope.keyboard && day.isSame(_this.$scope.view.moment, 'day') ? 'highlighted' : '',
                        !!_this.$scope.today && day.isSame(new Date(), 'day') ? 'today' : '',
                        !selectable || day.month() != month ? 'disabled' : utility_1.isValidMoment(_this.$ctrl.$modelValue) && day.isSame(_this.$ctrl.$modelValue, 'day') ? 'selected' : ''
                    ].join(' ').trim(),
                    selectable: selectable
                };
                day.add(1, 'days');
                return date;
            });
        // object to array - see https://github.com/indrimuska/angular-moment-picker/issues/9
        angular.forEach(rows, function (row) { return _this.rows.push(row); });
        // render headers
        this.headers = moment.weekdays().map(function (d, i) { return moment().locale(_this.$scope.locale).startOf('week').add(i, 'day').format('dd'); });
        // return title
        return this.$scope.view.moment.format('MMMM YYYY');
    };
    MonthView.prototype.set = function (day) {
        if (!day.selectable)
            return;
        this.$scope.view.moment.year(day.year).month(day.month).date(day.date);
        this.$scope.view.update();
        this.$scope.view.change('day');
    };
    return MonthView;
}());
exports["default"] = MonthView;
//# sourceMappingURL=monthView.js.map