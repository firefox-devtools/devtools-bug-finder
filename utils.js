"use strict";

function createNode(options) {
  var el = document.createElement(options.tagName || "div");

  if (options.attributes) {
    for (var i in options.attributes) {
      el.setAttribute(i, options.attributes[i]);
    }
  }

  if (options.textContent) {
    el.textContent = options.textContent;
  }

  return el;
}

function debounce(func, wait) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }

    return result;
  };
}

function closest(rootEl, selector) {
  if (rootEl.closest) {
    return rootEl.closest(selector);
  }

  while (rootEl) {
    if (rootEl.matches(selector)) {
      return rootEl;
    }
    rootEl = rootEl.parentNode;
  }
  return null;
}

function leftPad(str, padStr, size) {
  str = str + "";
  if (str.length < size) {
    return (new Array(size - str.length)).join(padStr) + str;
  }
  return str;
}

function formatBugzillaDate(date) {
  return [
    date.getYear() + 1900,
    leftPad(date.getMonth() + 1, "0", 2),
    leftPad(date.getDate(), "0", 2)
  ].join("-");
}

function includes(array, value) {
  for (var i = 0; i < array.length; i ++) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
}

function timeFromModified(lastChangeTime) {
  var lastModified = new Date(lastChangeTime);
  var today = new Date();
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.ceil(
    (today.getTime() - lastModified.getTime()) / oneDay
  );
}

function isInactive(bug) {
  return bug.last_change_time && timeFromModified(bug.last_change_time) >= INACTIVE_AFTER;
}

function isGoodFirst(bug) {
  return bug.keywords && bug.keywords.indexOf(GOOD_FIRST_BUG_KEYWORD) !== -1;
}

function hasPatch(bug) {
  return bug.attachments && bug.attachments.some(function(attachment) {
    return attachment.is_patch;
  });
}

function isAssigned(bug) {
  return bug.assigned_to.name && !bug.assigned_to.name.match(/nobody/);
}
