"use strict";
exports.__esModule = true;
var angular = require("angular");
var moment = require("moment");
exports.KEYS = { up: 38, down: 40, left: 37, right: 39, escape: 27, enter: 13 };
exports.isValidMoment = function (value) {
    return moment.isMoment(value) && value.isValid();
};
exports.toValue = function (date, format, locale) {
    var momentDate = date;
    if (!exports.isValidMoment(date))
        momentDate = exports.toMoment(date, format, locale);
    return exports.momentToValue(momentDate, format);
};
exports.toMoment = function (date, format, locale) {
    var momentDate = moment(date, format, locale);
    if (!exports.isValidMoment(momentDate))
        momentDate = undefined;
    return momentDate;
};
exports.momentToValue = function (momentObject, format) {
    if (!exports.isValidMoment(momentObject))
        return undefined;
    return !format ? momentObject.valueOf() : momentObject.format(format);
};
exports.valueToMoment = function (formattedValue, $scope) {
    var momentValue;
    if (!formattedValue)
        return momentValue;
    if (!$scope.format)
        momentValue = moment(formattedValue);
    else
        momentValue = moment(formattedValue, $scope.format, $scope.locale);
    if ($scope.model) {
        // set value for each view precision (from Decade View to minView)
        var views = $scope.views.all.slice(0, $scope.views.all.indexOf($scope.detectedMinView));
        angular.forEach(views, function (view) {
            var precision = $scope.views.precisions[view];
            momentValue[precision]($scope.model[precision]());
        });
    }
    return momentValue;
};
exports.setValue = function (value, $scope, $ctrl, $attrs) {
    var modelValue = exports.isValidMoment(value) ? value.clone() : exports.valueToMoment(value, $scope), viewValue = exports.momentToValue(modelValue, $scope.format);
    $scope.model = exports.updateMoment($scope.model, modelValue, $scope);
    $ctrl.$modelValue = exports.updateMoment($ctrl.$modelValue, modelValue, $scope);
    if ($attrs['ngModel'] != $attrs['momentPicker'])
        $scope.value = viewValue;
    if ($attrs['ngModel']) {
        $ctrl.$setViewValue(viewValue);
        $ctrl.$render(); // render input value
    }
};
exports.updateMoment = function (model, value, $scope) {
    if (!exports.isValidMoment(model) || !value)
        model = value;
    else {
        if (!model.isSame(value)) {
            // set value for each view precision (from Decade View to maxView)
            var views = $scope.views.all.slice(0, $scope.views.all.indexOf($scope.detectedMaxView) + 1);
            angular.forEach(views, function (view) {
                var precision = $scope.views.precisions[view];
                model[precision](value[precision]());
            });
        }
    }
    return model;
};
//# sourceMappingURL=utility.js.map