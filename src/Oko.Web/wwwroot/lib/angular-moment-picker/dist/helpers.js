"use strict";
exports.__esModule = true;
/**
 * Offset getter method from jQuery: https://github.com/jquery/jquery/blob/3.1.1/src/offset.js#L78
 */
exports.getOffset = function (element) {
    if (!element)
        return;
    if (!element.getClientRects().length)
        return { top: 0, left: 0 };
    // https://github.com/jquery/jquery/blob/3.1.1/src/core.js#L220
    var isWindow = function (obj) { return obj != null && obj === obj.window; };
    var getWindow = function (elem) { return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView; }; // tslint:disable-line:no-any
    var rect = element.getBoundingClientRect();
    if (!rect.width && !rect.height)
        return rect;
    var doc = element.ownerDocument;
    var win = getWindow(doc);
    var docElem = doc.documentElement;
    return {
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft
    };
};
//# sourceMappingURL=helpers.js.map