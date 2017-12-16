"use strict";
exports.__esModule = true;
var angular = require("angular");
var moment = require("moment");
var helpers_1 = require("./helpers");
var views_1 = require("./views");
var utility_1 = require("./utility");
var templateHtml = require('./template.tpl.html');
var Directive = /** @class */ (function () {
    function Directive($timeout, $sce, $log, $window, provider, $compile, $templateCache) {
        var _this = this;
        this.$timeout = $timeout;
        this.$sce = $sce;
        this.$log = $log;
        this.$window = $window;
        this.provider = provider;
        this.$compile = $compile;
        this.$templateCache = $templateCache;
        this.restrict = 'A';
        this.require = '?ngModel';
        this.transclude = true;
        this.template = templateHtml;
        this.scope = {
            value: '=?momentPicker',
            model: '=?ngModel',
            locale: '@?',
            format: '@?',
            minView: '@?',
            maxView: '@?',
            startView: '@?',
            minDate: '=?',
            maxDate: '=?',
            startDate: '=?',
            disabled: '=?disable',
            position: '@?',
            inline: '@?',
            validate: '=?',
            autoclose: '=?',
            setOnSelect: '=?',
            isOpen: '=?',
            today: '=?',
            keyboard: '=?',
            showHeader: '=?',
            additions: '=?',
            change: '&?',
            selectable: '&?'
        };
        this.link = function ($scope, $element, $attrs, $ctrl, $transclude) {
            $transclude(function ($transElement) {
                // one-way binding attributes
                angular.forEach([
                    'locale', 'format', 'minView', 'maxView', 'startView', 'position', 'inline', 'validate', 'autoclose', 'setOnSelect', 'today',
                    'keyboard', 'showHeader', 'leftArrow', 'rightArrow', 'additions'
                ], function (attr) {
                    if (!angular.isDefined($scope[attr]))
                        $scope[attr] = _this.provider[attr];
                    if (!angular.isDefined($attrs[attr]))
                        $attrs[attr] = $scope[attr];
                });
                // check if ngModel has been set
                if (!$attrs['ngModel'])
                    $ctrl = {};
                // limits
                $scope.limits = {
                    minDate: utility_1.toMoment($scope.minDate, $scope.format, $scope.locale),
                    maxDate: utility_1.toMoment($scope.maxDate, $scope.format, $scope.locale),
                    isAfterOrEqualMin: function (value, precision) {
                        return !angular.isDefined($scope.limits.minDate) || value.isAfter($scope.limits.minDate, precision) || value.isSame($scope.limits.minDate, precision);
                    },
                    isBeforeOrEqualMax: function (value, precision) {
                        return !angular.isDefined($scope.limits.maxDate) || value.isBefore($scope.limits.maxDate, precision) || value.isSame($scope.limits.maxDate, precision);
                    },
                    isSelectable: function (value, precision) {
                        var selectable = true;
                        try {
                            if (angular.isFunction($scope.selectable) && $attrs['selectable'])
                                selectable = $scope.selectable({ date: value, type: precision });
                        }
                        catch (e) {
                            _this.$log.error(e);
                        }
                        return $scope.limits.isAfterOrEqualMin(value, precision) && $scope.limits.isBeforeOrEqualMax(value, precision) && selectable;
                    },
                    checkValue: function () {
                        if (!utility_1.isValidMoment($ctrl.$modelValue) || !$scope.validate)
                            return;
                        if (!$scope.limits.isAfterOrEqualMin($ctrl.$modelValue))
                            utility_1.setValue($scope.limits.minDate, $scope, $ctrl, $attrs);
                        if (!$scope.limits.isBeforeOrEqualMax($ctrl.$modelValue))
                            utility_1.setValue($scope.limits.maxDate, $scope, $ctrl, $attrs);
                    },
                    checkView: function () {
                        if (!angular.isDefined($scope.view.moment))
                            $scope.view.moment = moment().locale($scope.locale);
                        if (!$scope.limits.isAfterOrEqualMin($scope.view.moment))
                            $scope.view.moment = $scope.limits.minDate.clone();
                        if (!$scope.limits.isBeforeOrEqualMax($scope.view.moment))
                            $scope.view.moment = $scope.limits.maxDate.clone();
                        $scope.view.update();
                        $scope.view.render();
                    }
                };
                $scope.views = {
                    all: ['decade', 'year', 'month', 'day', 'hour', 'minute'],
                    precisions: { decade: 'year', year: 'month', month: 'date', day: 'hour', hour: 'minute', minute: 'second' },
                    // for each view, `$scope.views.formats` object contains the available moment formats
                    // formats present in more views are used to perform min/max view detection (i.e. 'LTS', 'LT', ...)
                    formats: {
                        decade: 'Y{1,2}(?!Y)|YYYY|[Ll]{1,4}(?!T)',
                        /* formats: Y,YY,YYYY,L,LL,LLL,LLLL,l,ll,lll,llll */
                        year: 'M{1,4}(?![Mo])|Mo|Q',
                        /* formats: M,MM,MMM,MMM,Mo,Q */
                        month: '[Dd]{1,4}(?![Ddo])|DDDo|[Dd]o|[Ww]{1,2}(?![Wwo])|[Ww]o|[Ee]|L{1,2}(?!T)|l{1,2}',
                        /* formats: D,DD,DDD,DDDD,d,dd,ddd,dddd,DDDo,Do,do,W,WW,w,ww,Wo,wo,E,e,L,LL,l,ll */
                        day: '[Hh]{1,2}|LTS?',
                        /* formats: H,HH,h,hh,LT,LTS */
                        hour: 'm{1,2}|[Ll]{3,4}|LT(?!S)',
                        /* formats: m,mm,LLL,LLLL,lll,llll,LT */
                        minute: 's{1,2}|S{1,}|X|LTS'
                        /* formats: s,ss,S,SS,SSS..,X,LTS */
                    },
                    detectMinMax: function () {
                        $scope.detectedMinView = $scope.detectedMaxView = undefined;
                        if (!$scope.format)
                            return;
                        var minView, maxView;
                        angular.forEach($scope.views.formats, function (formats, view) {
                            var regexp = new RegExp('(' + formats + ')(?![^\[]*\])', 'g');
                            if (!$scope.format.match(regexp))
                                return;
                            if (!angular.isDefined(minView))
                                minView = view;
                            maxView = view;
                        });
                        if (!angular.isDefined(minView))
                            minView = 0;
                        else
                            minView = Math.max(0, $scope.views.all.indexOf(minView));
                        if (!angular.isDefined(maxView))
                            maxView = $scope.views.all.length - 1;
                        else
                            maxView = Math.min($scope.views.all.length - 1, $scope.views.all.indexOf(maxView));
                        if (minView > $scope.views.all.indexOf($scope.minView))
                            $scope.minView = $scope.views.all[minView];
                        if (maxView < $scope.views.all.indexOf($scope.maxView))
                            $scope.maxView = $scope.views.all[maxView];
                        // save detected min/max view to use them to update the model value properly
                        $scope.detectedMinView = $scope.views.all[minView];
                        $scope.detectedMaxView = $scope.views.all[maxView];
                    },
                    // specific views
                    decade: new views_1.DecadeView($scope, $ctrl, _this.provider),
                    year: new views_1.YearView($scope, $ctrl, _this.provider),
                    month: new views_1.MonthView($scope, $ctrl, _this.provider),
                    day: new views_1.DayView($scope, $ctrl, _this.provider),
                    hour: new views_1.HourView($scope, $ctrl, _this.provider),
                    minute: new views_1.MinuteView($scope, $ctrl, _this.provider)
                };
                $scope.view = {
                    moment: undefined,
                    value: undefined,
                    isOpen: false,
                    selected: $scope.startView,
                    update: function () { $scope.view.value = utility_1.momentToValue($scope.view.moment, $scope.format); },
                    toggle: function () { $scope.view.isOpen ? $scope.view.close() : $scope.view.open(); },
                    open: function () {
                        if ($scope.disabled || $scope.view.isOpen || $scope.inline)
                            return;
                        $scope.isOpen = true;
                        $scope.view.isOpen = true;
                        document.body.appendChild($scope.picker[0]);
                        $scope.view.position();
                    },
                    close: function () {
                        if (!$scope.view.isOpen || $scope.inline)
                            return;
                        $scope.isOpen = false;
                        $scope.view.isOpen = false;
                        $scope.view.selected = $scope.startView;
                        $scope.picker[0].parentNode.removeChild($scope.picker[0]);
                    },
                    position: function () {
                        if (!$scope.view.isOpen || $scope.position || $scope.inline)
                            return;
                        var element = $element[0], picker = $scope.picker[0], hasClassTop = $scope.picker.hasClass('top'), hasClassRight = $scope.picker.hasClass('right'), offset = helpers_1.getOffset($element[0]), top = offset.top - _this.$window.pageYOffset, left = offset.left - _this.$window.pageXOffset, winWidth = _this.$window.innerWidth, winHeight = _this.$window.innerHeight, shouldHaveClassTop = top + _this.$window.pageYOffset - picker.offsetHeight > 0 && top > winHeight / 2, shouldHaveClassRight = left + picker.offsetWidth > winWidth, pickerTop = offset.top + (shouldHaveClassTop ? 0 : element.offsetHeight) + 'px', pickerLeft = offset.left + 'px', pickerWidth = element.offsetWidth + 'px';
                        if (!hasClassTop && shouldHaveClassTop)
                            $scope.picker.addClass('top');
                        if (hasClassTop && !shouldHaveClassTop)
                            $scope.picker.removeClass('top');
                        if (!hasClassRight && shouldHaveClassRight)
                            $scope.picker.addClass('right');
                        if (hasClassRight && !shouldHaveClassRight)
                            $scope.picker.removeClass('right');
                        if ($scope.picker.css('top') !== pickerTop)
                            $scope.picker.css('top', pickerTop);
                        if ($scope.picker.css('left') !== pickerLeft)
                            $scope.picker.css('left', pickerLeft);
                        if ($scope.picker.css('width') !== pickerWidth)
                            $scope.picker.css('width', pickerWidth);
                    },
                    keydown: function (e) {
                        var view = $scope.views[$scope.view.selected], precision = $scope.views.precisions[$scope.view.selected].replace('date', 'day'), singleUnit = _this.provider[precision + 'sStep'] || 1, operation = [utility_1.KEYS.up, utility_1.KEYS.left].indexOf(e.keyCode) >= 0 ? 'subtract' : 'add', highlight = function (vertical) {
                            var unitMultiplier = vertical ? view.perLine : 1, nextDate = $scope.view.moment.clone()[operation](singleUnit * unitMultiplier, precision);
                            if ($scope.limits.isSelectable(nextDate, precision)) {
                                $scope.view.moment = nextDate;
                                $scope.view.update();
                                $scope.view.render();
                            }
                        };
                        switch (e.keyCode) {
                            case utility_1.KEYS.up:
                            case utility_1.KEYS.down:
                                e.preventDefault();
                                if (!$scope.view.isOpen)
                                    $scope.view.open();
                                else
                                    highlight(true);
                                break;
                            case utility_1.KEYS.left:
                            case utility_1.KEYS.right:
                                if (!$scope.view.isOpen)
                                    break;
                                e.preventDefault();
                                highlight();
                                break;
                            case utility_1.KEYS.enter:
                                if (!$scope.view.isOpen)
                                    break;
                                $scope.view.change(precision);
                                e.preventDefault();
                                break;
                            case utility_1.KEYS.escape:
                                $scope.view.toggle();
                                break;
                        }
                        $scope.$evalAsync();
                    },
                    // utility
                    unit: function () { return $scope.view.selected == 'decade' ? 10 : 1; },
                    precision: function () { return $scope.view.selected.replace('decade', 'year'); },
                    // header
                    title: '',
                    previous: {
                        label: _this.$sce.trustAsHtml($scope.leftArrow),
                        selectable: true,
                        set: function () {
                            if ($scope.view.previous.selectable) {
                                $scope.view.moment.subtract($scope.view.unit(), $scope.view.precision());
                                $scope.view.update();
                                $scope.view.render();
                            }
                        }
                    },
                    next: {
                        selectable: true,
                        label: _this.$sce.trustAsHtml($scope.rightArrow),
                        set: function () {
                            if ($scope.view.next.selectable) {
                                $scope.view.moment.add($scope.view.unit(), $scope.view.precision());
                                $scope.view.update();
                                $scope.view.render();
                            }
                        }
                    },
                    setParentView: function () { $scope.view.change($scope.views.all[Math.max(0, $scope.views.all.indexOf($scope.view.selected) - 1)]); },
                    // body
                    render: function () {
                        var momentPrevious = $scope.view.moment.clone().startOf($scope.view.precision()).subtract($scope.view.unit(), $scope.view.precision()), momentNext = $scope.view.moment.clone().endOf($scope.view.precision()).add($scope.view.unit(), $scope.view.precision());
                        $scope.view.previous.selectable = $scope.limits.isAfterOrEqualMin(momentPrevious, $scope.view.precision());
                        $scope.view.previous.label = _this.$sce.trustAsHtml($scope.view.previous.selectable ? $scope.leftArrow : '&nbsp;');
                        $scope.view.next.selectable = $scope.limits.isBeforeOrEqualMax(momentNext, $scope.view.precision());
                        $scope.view.next.label = _this.$sce.trustAsHtml($scope.view.next.selectable ? $scope.rightArrow : '&nbsp;');
                        $scope.view.title = $scope.views[$scope.view.selected].render();
                    },
                    change: function (view) {
                        var nextView = $scope.views.all.indexOf(view), minView = $scope.views.all.indexOf($scope.minView), maxView = $scope.views.all.indexOf($scope.maxView);
                        var update = function () {
                            utility_1.setValue($scope.view.moment, $scope, $ctrl, $attrs);
                            $scope.view.update();
                            if ($attrs['ngModel'])
                                $ctrl.$commitViewValue();
                        };
                        if ($scope.setOnSelect)
                            update();
                        if (nextView < 0 || nextView > maxView) {
                            if (!$scope.setOnSelect)
                                update();
                            if ($scope.autoclose)
                                _this.$timeout($scope.view.close);
                        }
                        else if (nextView >= minView)
                            $scope.view.selected = view;
                    }
                };
                // creation
                $element.prepend($transElement);
                $scope.picker = angular.element($element[0].querySelectorAll('.moment-picker'));
                $scope.container = angular.element($scope.picker[0].querySelectorAll('.moment-picker-container'));
                $scope.input = $element[0].tagName.toLowerCase() != 'input' && $element[0].querySelectorAll('input').length > 0
                    ? angular.element($element[0].querySelectorAll('input'))
                    : angular.element($element[0]);
                $scope.input.addClass('moment-picker-input').attr('tabindex', 0);
                ($scope.position || '').split(' ').forEach(function (className) { return $scope.picker.addClass(className); });
                if (!$scope.inline)
                    $scope.picker[0].parentNode.removeChild($scope.picker[0]);
                else {
                    $element.after($scope.picker);
                    $scope.picker.addClass('inline');
                }
                // transclude scope to template additions
                _this.$timeout(function () {
                    angular.forEach($scope.additions || {}, function (tempalteUrl, key) {
                        var placeholder = angular.element($scope.container[0].querySelector('.moment-picker-addition.' + key));
                        var template = _this.$templateCache.get(tempalteUrl);
                        var compiled = _this.$compile(template)($scope.$parent);
                        placeholder.append(compiled);
                    });
                });
                // initialization
                $scope.views.detectMinMax();
                $scope.limits.checkView();
                // model controller is initialized after linking function
                _this.$timeout(function () {
                    if ($attrs['ngModel']) {
                        if (!$ctrl.$modelValue && $scope.value)
                            $ctrl.$setViewValue($scope.value);
                        $ctrl.$commitViewValue();
                        $ctrl.$render();
                    }
                    else {
                        if ($scope.value)
                            $ctrl.$modelValue = utility_1.valueToMoment($scope.value, $scope);
                    }
                    // view initialization
                    if ($scope.startDate)
                        $scope.view.moment = utility_1.toMoment($scope.startDate, $scope.format, $scope.locale);
                    else if (utility_1.isValidMoment($ctrl.$modelValue))
                        $scope.view.moment = $ctrl.$modelValue.clone();
                    $scope.view.update();
                    $scope.view.render();
                });
                // model <-> view conversion
                if ($attrs['ngModel']) {
                    $ctrl.$parsers.push(function (viewValue) { return utility_1.updateMoment($ctrl.$modelValue, utility_1.valueToMoment(viewValue, $scope), $scope) || true; });
                    $ctrl.$formatters.push(function (modelValue) { return utility_1.momentToValue(modelValue, $scope.format) || ''; });
                    $ctrl.$viewChangeListeners.push(function () { if ($attrs['ngModel'] != $attrs['momentPicker'])
                        $scope.value = $ctrl.$viewValue; });
                    $ctrl.$validators.minDate = function (value) { return $scope.validate || !utility_1.isValidMoment(value) || $scope.limits.isAfterOrEqualMin(value); };
                    $ctrl.$validators.maxDate = function (value) { return $scope.validate || !utility_1.isValidMoment(value) || $scope.limits.isBeforeOrEqualMax(value); };
                }
                // properties listeners
                if ($attrs['ngModel'] != $attrs['momentPicker'])
                    $scope.$watch('value', function (newValue, oldValue) {
                        if (newValue !== oldValue)
                            utility_1.setValue(newValue, $scope, $ctrl, $attrs);
                    });
                $scope.$watch(function () { return utility_1.momentToValue($ctrl.$modelValue, $scope.format); }, function (newViewValue, oldViewValue) {
                    if (newViewValue == oldViewValue)
                        return;
                    var newModelValue = utility_1.valueToMoment(newViewValue, $scope);
                    utility_1.setValue(newModelValue, $scope, $ctrl, $attrs);
                    $scope.limits.checkValue();
                    $scope.view.moment = (newModelValue || moment().locale($scope.locale)).clone();
                    $scope.view.update();
                    $scope.view.render();
                    if (angular.isFunction($scope.change) && $attrs['change']) {
                        var oldModelValue_1 = utility_1.valueToMoment(oldViewValue, $scope);
                        $scope.$evalAsync(function () { return $scope.change({ newValue: newModelValue, oldValue: oldModelValue_1 }); });
                    }
                });
                $scope.$watch(function () { return $ctrl.$modelValue && $ctrl.$modelValue.valueOf(); }, function () {
                    var viewMoment = (utility_1.isValidMoment($ctrl.$modelValue) ? $ctrl.$modelValue : moment().locale($scope.locale)).clone();
                    if (!viewMoment.isSame($scope.view.moment)) {
                        $scope.view.moment = viewMoment;
                        $scope.view.update();
                        $scope.view.render();
                    }
                });
                $scope.$watch('view.selected', function () { return $scope.view.render(); });
                $scope.$watchGroup(['minView', 'maxView'], function () {
                    // auto-detect minView/maxView
                    $scope.views.detectMinMax();
                    // limit startView
                    $scope.startView = $scope.views.all[Math.max(Math.min($scope.views.all.indexOf($scope.startView), $scope.views.all.indexOf($scope.maxView)), $scope.views.all.indexOf($scope.minView))];
                    $scope.view.selected = $scope.startView;
                });
                $scope.$watchGroup([
                    function () { return utility_1.toValue($scope.minDate, $scope.format, $scope.locale); },
                    function () { return utility_1.toValue($scope.maxDate, $scope.format, $scope.locale); }
                ], function () {
                    angular.forEach(['minDate', 'maxDate'], function (field) {
                        $scope.limits[field] = utility_1.toMoment($scope[field], $scope.format, $scope.locale);
                    });
                    $scope.limits.checkValue();
                    $scope.limits.checkView();
                    $scope.view.render();
                });
                $scope.$watch(function () { return utility_1.toValue($scope.startDate, $scope.format, $scope.locale); }, function (newViewValue, oldViewValue) {
                    if (newViewValue == oldViewValue)
                        return;
                    $scope.view.moment = utility_1.valueToMoment(newViewValue, $scope);
                    $scope.view.update();
                    $scope.view.render();
                });
                $attrs.$observe('locale', function (locale) { return $scope.locale = locale; });
                $scope.$watch('locale', function (locale, previous) {
                    if (!angular.isDefined(previous) || locale == previous)
                        return;
                    if (utility_1.isValidMoment($ctrl.$modelValue))
                        utility_1.setValue($ctrl.$modelValue.locale(locale), $scope, $ctrl, $attrs);
                    if (utility_1.isValidMoment($scope.view.moment))
                        $scope.view.moment = $scope.view.moment.locale(locale);
                    if (utility_1.isValidMoment($scope.limits.minDate))
                        $scope.limits.minDate = $scope.limits.minDate.locale(locale);
                    if (utility_1.isValidMoment($scope.limits.maxDate))
                        $scope.limits.maxDate = $scope.limits.maxDate.locale(locale);
                    $scope.view.render();
                });
                $scope.$watch('validate', $scope.limits.checkValue);
                $scope.$watch('isOpen', function (isOpen) {
                    if ($scope.inline)
                        $scope.view.isOpen = true;
                    else if (angular.isDefined(isOpen) && isOpen != $scope.view.isOpen)
                        $scope.view.toggle();
                });
                // event listeners
                var focusInput = function (e) {
                    if (e)
                        e.preventDefault();
                    $scope.input[0].focus();
                };
                // use `touchstart` for iOS Safari, where click events aren't propogated under most circumstances.
                $scope.input
                    .on('focus click touchstart', function () { return $scope.$evalAsync($scope.view.open); })
                    .on('blur', function () { return $scope.$evalAsync($scope.view.close); })
                    .on('keydown', function (e) { if ($scope.keyboard)
                    $scope.view.keydown(e); });
                $element.on('click touchstart', function () { return focusInput(); });
                $scope.container.on('mousedown', function (e) { return focusInput(e); });
                angular.element(_this.$window).on('resize scroll', $scope.view.position);
                // unbind events on destroy
                $scope.$on('$destroy', function () {
                    $scope.input.off('focus click touchstart blur keydown');
                    $element.off('click touchstart');
                    $scope.container.off('mousedown');
                    $scope.picker.remove();
                    angular.element(_this.$window).off('resize scroll', $scope.view.position);
                });
            });
        };
    }
    return Directive;
}());
exports["default"] = Directive;
//# sourceMappingURL=directive.js.map