var app = angular.module("okoApp", ['angularMoment', 'moment-picker', 'angular-gestures']);

app.config(function (hammerDefaultOptsProvider) {
    hammerDefaultOptsProvider.set({
        recognizers: [
            [Hammer.Pinch, { enabled: true }],
            [Hammer.Pan, { enabled: true }],
            [Hammer.Swipe, { enabled: true }],
        ]
    });
});

app.directive('ownScrollX', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var parent = element.parent();

            scope.$watch(attrs.ownScrollX, function (value) {

                var i = (element[0].scrollWidth - parent[0].clientWidth);

                re = /^([0-9.]+)\%$/g;
                var m = re.exec(value)
                if (m) {
                    
                    value = i * (Number.parseFloat(m[1]) / 100);
                    scope[attrs.ownScrollX] = value;
                }
                
                if (value > i) {
                    value = i;
                    scope[attrs.ownScrollX] = i;
                }
                parent.scrollLeft(value);
            });
            
            element.parent().on('scroll', function (e) {
                
                var i = parent.scrollLeft() / (element[0].scrollWidth - parent[0].clientWidth)
                
                scope.$apply(function () {
                    scope[attrs.ownScrollX] = parent.scrollLeft();
                });
            });
        }
    };
});

app.controller("archive", function ($scope, $http, moment) {
    
    $scope.cameras = {};
    $scope.cursorTime = moment();
    $scope.detail = false;
    $scope.timelineSize = 100;
    $scope.timelineScroll = 0;
    
    $scope.debug = false;
    $scope.openDebugClicks = 0;

    $scope.tlPinch = {};
    $scope.tlPan = {};
    
    $scope.cameraBoxClass = '';

    $scope.detectBoxClass = function () {

        var layouts = [
            'col-md-12 col-xs-12 col-sm-12',
            'col-md-6 col-xs-12 col-sm-6',
            'col-md-4 col-xs-12 col-sm-6',
            'col-md-3 col-xs-12 col-sm-6',
            'col-md-2 col-xs-12 col-sm-6',
            'col-md-2 col-xs-12 col-sm-6'
        ]
        var count = Object.keys($scope.cameras).length;
        
        if (count == 0) {
            return layouts[0];
        }
        
        var camsOnRow = Math.ceil(Math.sqrt(count)) - 1;
        
        var i = Math.min(layouts.length - 1, camsOnRow);
        $scope.cameraBoxClass = layouts[i];        
    }

    $scope.appendDays = function (days) {
        $scope.cursorTime.add(days, 'days');
        $scope.load();
    }

    $scope.appendMinutes = function (direction) {
        $scope.navigateOverImage(direction, 'minutes')
    }

    $scope.openDebug = function () {
        $scope.openDebugClicks++;

        if ($scope.openDebugClicks > 5) {
            $scope.debug = true;
        }
    }

    $scope.navigateOverImage = function (direction, step = 'second') {

        direction = Math.max(-1, direction);
        direction = Math.min(1, direction);

        var time = moment($scope.cursorTime).add(direction, step);
        var images = [];

        angular.forEach($scope.cameras, function (camera, key) {
            var img = $scope.findImage(camera.timeline, time, direction);
            if (img != false) {
                images.push(img);
            }
        });

        if (images.length > 0) {
            images.sort(function (a, b) {
                return a.id - b.id;
            });
            
            $scope.showImage(images[(direction > 0 ? 0 : images.length - 1)].time);
        }
        
    }
    
    $scope.load = function (reloadAll = true) {
        
        angular.forEach($scope.cameras, function (camera, key) {

            if (reloadAll == true || camera.init == true) {

                camera.init = false;
                camera.image = 'no-image';
                camera.style = 'loading';
                camera.timeline = [];

                $scope.cursorTime = $scope.cursorTime.startOf('day');

                $http({
                    method: 'GET',
                    url: 'Home/Images',
                    params: {
                        day: $scope.cursorTime.format('YYYY-MM-DD'),
                        cameraName: camera.name
                    }
                }).then(function mySuccess(response) {
                    if (response.data.length > 0) {

                        var max = false;
                        var timeline = [];
                        for (i = 0; i < response.data.length; i++) {
                            var t = moment(response.data[i].time, 'YYYY-MM-DDTHH:mm:ss');

                            timeline[i] = {
                                id: t.unix(),
                                location: i,
                                fullName: response.data[i].fullName,
                                time: t,
                            };

                            if (max == false || max.id < t.unix()) {
                                max = timeline[i];
                            }
                        }

                        timeline.sort(function (a, b) {
                            return a.id - b.id;
                        });
                        
                        camera.timeline = timeline;
                        if (max != false) {
                            $scope.showImage(max.time);
                        }
                        //console.log(timeline);
                    } else {
                        camera.image = 'no-image';
                        camera.style = 'no-image';
                    }
                                        
                }, function myError(response) {
                    camera.image = 'no-image';
                    camera.style = 'no-image';                    
                });
            }
        });
    }

    $scope.initCamera = function (name) {
        
        $scope.cameras[name] = {
            name: name,
            init: true,
            style: 'loading',
            image: 'no-image',
            timeline: [],
        };
        $scope.detectBoxClass();
        $scope.load(false);

    }

    $scope.findImage = function (timeline, time, direction = -1) {
        var id = time.unix();
        
        var find = function (min, max) {
            
            var median = Math.floor((max - min) / 2) + min;
            
            if (max == min) {
                return false;
            }
            
            var ret = false;
            if (timeline[median].id < id) {
                ret = find(median + 1, max);
            } else if (timeline[median].id > id) {
                ret = find(min, median);
            } else {
                ret = timeline[median];
            }

            if (ret == false) {
                if (direction < 0) {
                    for (i = median; i >= min; i--) {
                        if (timeline[i].id < id) {
                            return timeline[i];
                        }
                    }
                } else {
                    for (i = 0; i <= median; i++) {
                        if (timeline[i].id > id) {
                            return timeline[i];
                        }
                    }
                }
            }

            return ret;

        }

        return find(0, timeline.length);        
    }

    $scope.calcAge = function (image) {

        if (!moment.isMoment(image)) {
            return 0;
        }

        return $scope.cursorTime.diff(image, 'minutes');
    }

    $scope.calcStyle = function (image) {
        var minutes = $scope.calcAge(image);

        if (minutes > 5) {
            return 'old';
        }

        return 'fresh';
    }

    $scope.isCached = function (camera, image) {
        var img = new Image();
        img.src = $scope.imagePath(camera, image);

        return img.complete;
    }

    $scope.showImage = function (time){
        $scope.cursorTime = moment(time);
        $scope.timelineScroll = $scope.calcPosition($scope.cursorTime) + '%';

        angular.forEach($scope.cameras, function (camera, key) {
            var timeline = camera.timeline;
            if (timeline.length > 0) {
                var image = $scope.findImage(timeline, time);
                
                if (image != false) {
                    
                    if (camera.image != image) {
                        camera.image = image;
                        if (!$scope.isCached(camera, image)) {
                            camera.style = 'loading';
                        }
                    }
                    camera.style = '';
                    
                } else {
                    camera.image = 'no-image';
                }
                $scope.loaded(camera);

            }
        });
    }
    
    $scope.calcPosition = function (t) {
        if (moment.isMoment(t)) {
            var sec = (t.get('hour') * 3600) + (t.get('minute') * 60) + t.get('second');
            return (sec * 100) / (3600 * 24);
        }
        return 0;
    }

    $scope.imagePath = function (camera, image = false) {
        if (camera == false || (image == false && camera.image == false)) {
            return ''
        }

        if (image == false) {
            image = camera.image;
        }
        
        
        if (image == 'no-image') {
            return 'images/no-image.png';
        } else {
            return '/Home/Image?cameraName=' + camera.name + '&day=' + image.time.format('YYYY-MM-DD') + '&imageName=' + image.fullName;
        }
    }

    $scope.closeDetail = function () {
        $scope.detail = false;
        document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=10,user-scalable=yes');
    }

    $scope.openDetil = function (camera) {
        if ($scope.calcStyle(camera.image.time) != 'old' && camera.style != 'no-image' && camera.style != 'loading') {
            $scope.detail = camera;
        }
    }

    $scope.loaded = function (camera) {
        if (camera.image != 'no-image') {
            camera.style = $scope.calcStyle(camera.image.time);
        } else {
            camera.style = 'no-image';
        }

    }

    $scope.init = function () {
        
    }

    $scope.timelineZoom = function (type) {
        var size = $scope.timelineSize;
        var step = 30;

        if (size > 500) {
            step = 100;
        }

        if (type == 'in') {
            size += step;
        } else if (type == 'out') {
            size -= step;
        } else if (type == 'restore') {
            size = 100;
        }

        size = Math.max(100, size);
        size = Math.min(3000, size);

        $scope.timelineSize = size;
    }


    $scope.timelinePinchStart = function (event) {
        
    }

    $scope.timelinePan = function (event) {
        $scope.tlPan.eventType = event.eventType;
        $scope.tlPan.deltaX = event.deltaX;

        //$scope.tlPan = event;

        if (event.eventType == 4) {
            $scope.tlPan.startPos = false;
            return;
        }

        if (!angular.isNumber($scope.tlPan.startPos)) {
            $scope.tlPan.startPos = $scope.timelineScroll;
        }

        var s = $scope.tlPan.startPos - (event.deltaX / 1);

        s = Math.max(0, s);

        $scope.timelineScroll = s;
        
    }

    $scope.timelinePinch = function (event) {

        $scope.tlPinch.scale = event.scale;
        $scope.tlPinch.eventType = event.eventType;

        if (event.eventType == 4) {
            $scope.tlPinch.startSize = false;
            return;
        }

        if (!angular.isNumber($scope.tlPinch.startSize)) {
            $scope.tlPinch.startSize = $scope.timelineSize;
        }
        
        var size = $scope.tlPinch.startSize;
        var step = (event.scale - 1) * (size / 1);
        
        size += step;

        size = Math.max(100, size);
        size = Math.min(3000, size);
    
        $scope.timelineSize = size;
        
        
    }
    
}); 