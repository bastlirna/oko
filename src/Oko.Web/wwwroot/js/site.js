// Write your Javascript code.
/*
jQuery.fn.extend({
    aspectRatio: function (ratio) {
        return this.each(function () {
            $(this).css('height', ($(this).width() / ratio) + 'px');
        });
    }
});*/

$(function () {

    /*
    var imageBox = $('#image-box');
    var cameras = $('.timeline-cams .cam');
    var allowedBoxSizes = [
        'col-md-12 col-xs-12 col-sm-12',
        'col-md-6 col-xs-12 col-sm-6',
        'col-md-4 col-xs-12 col-sm-6',
        'col-md-3 col-xs-12 col-sm-6',
        'col-md-2 col-xs-12 col-sm-6',
        'col-md-1 col-xs-12 col-sm-6'
    ];

    var calcPosition = function (time) {
        var re = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})$/g;
        var coef = [3600, 60, 1];

        var m = re.exec(time);
        if (m) {
            var sec = 0;
            for (i = 0; i < 3; i++) {
                sec += parseInt(m[i + 4]) * coef[i];
            }

            return (sec * 100) / (3600 * 24);
        }

        return 0;
    }
    
    var updatePointer = function (time) {
        var x = $('#pointer').parent().innerWidth() * calcPosition(time) / 100;
        $('#pointer').css('left', (x - 3) + 'px');
    }

    var showImage = function (camera, image) {
        updatePointer(image.time);

        var cibox = $('.camera-' + camera);
        var day = $('#current-date').find('input').val();
        
        cibox.addClass('loading');
        cibox.find('img')
            .attr('src', '/Home/Image?cameraName=' + camera + '&day=' + day + '&imageName=' + image.fullName)
            .load(function () {
                cibox.removeClass('loading');
            }).error(function () {
                cibox.removeClass('loading');
                cibox.addClass('no-image');
            });
    }

    var imageBoxClass = function () {

        if (cameras.length == 0) {
            return allowedBoxSizes[0];
        }

        var camsOnRow = Math.ceil(Math.sqrt(cameras.length)) - 1;

        var i = Math.min(allowedBoxSizes.length - 1, camsOnRow);
        return allowedBoxSizes[i];
    }

    var drawPickers = function (cam, data) {
        var pickers = cam.find('.pickers');
        $.each(data, function (idx, item) {
            var imgPicker = new $('<i></i>');
            imgPicker.css('left', calcPosition(item.time) + '%');

            imgPicker.click(function () {
                showImage(cam.data('cam-name'), item);
            });

            pickers.append(imgPicker);
        });
    }

    cameras.each(function () {

        var day = $('#current-date').find('input').val();
        var name = $(this).data('cam-name');
        var cam = $(this);
        
        var cibox = new $('<div></div>');
        cibox.addClass(imageBoxClass());
        
        cibox.addClass('camera-image-box');
        cibox.addClass('camera-' + name);
        
        var image = new $('<img/>');
        cibox.addClass('loading');
        cibox.append(image);
        
        imageBox.append(cibox);
        cibox.aspectRatio(4 / 3);

        $.ajax('Home/Images', {
            data: {
                day: day,
                cameraName: name
            },
        }).done(function (json) {
            if (json != null && json.length > 0) {
                drawPickers(cam, json);
                showImage(name, json[0]);
            } else {
                cibox.removeClass('loading');
                cibox.addClass('no-image');
            }
        });

    });
    
    var resizeTm = false;
    $(window).resize(function () {

        if (resizeTm != false) {
            clearTimeout(resizeTm);
            resizeTm = false;
        }

        resizeTm = setTimeout(function () {
            $('.camera-image-box').aspectRatio(4 / 3);  
            resizeTm = false;
        }, 200)
        
    });
    */
    /*        
    $('#current-date').datetimepicker({
        format: 'LT'
    });
    */
});
    
