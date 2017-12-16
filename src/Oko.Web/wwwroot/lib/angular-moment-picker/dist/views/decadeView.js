"use strict";
exports.__esModule = true;
var utility_1 = require("../utility");
var DecadeView = /** @class */ (function () {
    function DecadeView($scope, $ctrl, provider) {
        this.$scope = $scope;
        this.$ctrl = $ctrl;
        this.provider = provider;
        this.perLine = 4;
        this.rows = {};
    }
    DecadeView.prototype.render = function () {
        var year = this.$scope.view.moment.clone(), firstYear = Math.floor(year.year() / 10) * 10 - 1;
        this.rows = {};
        year.year(firstYear);
        for (var y = 0; y < 12; y++) {
            var index = Math.floor(y / this.perLine), selectable = this.$scope.limits.isSelectable(year, 'year');
            if (!this.rows[index])
                this.rows[index] = [];
            this.rows[index].push({
                index: year.year(),
                label: year.format(this.provider.yearsFormat),
                year: year.year(),
                "class": [
                    this.$scope.keyboard && year.isSame(this.$scope.view.moment, 'year') ? 'highlighted' : '',
                    !selectable || [0, 11].indexOf(y) >= 0 ? 'disabled' : utility_1.isValidMoment(this.$ctrl.$modelValue) && year.isSame(this.$ctrl.$modelValue, 'year') ? 'selected' : ''
                ].join(' ').trim(),
                selectable: selectable
            });
            year.add(1, 'years');
        }
        // return title
        return [year.subtract(2, 'years').format('YYYY'), year.subtract(9, 'years').format('YYYY')].reverse().join(' - ');
    };
    DecadeView.prototype.set = function (year) {
        if (!year.selectable)
            return;
        this.$scope.view.moment.year(year.year);
        this.$scope.view.update();
        this.$scope.view.change('year');
    };
    return DecadeView;
}());
exports["default"] = DecadeView;
//# sourceMappingURL=decadeView.js.map