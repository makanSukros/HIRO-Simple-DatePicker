/*! Fancy Floating Single Date Picker (jQuery) - By makanSukros ID
 *  Features: single date, minDate, maxDate, disabledRanges
 *  Options:
 *    - selectedDate:   Date | "YYYY-MM-DD"
 *    - minDate:        Date | "YYYY-MM-DD"
 *    - maxDate:        Date | "YYYY-MM-DD"
 *    - disabledRanges: [{start, end}] | [["YYYY-MM-DD","YYYY-MM-DD"], ...]
 *    - autoApply:      boolean (default: false)
 *    - closeOnScroll:  boolean (default: false)
 *    - onChange:       function(dateObj, formattedStr)  // formattedStr = "YYYY-MM-DD"
 *
 *  Usage:
 *    $('input').simpleDatePicker({ ... });
 */
(function ($) {
  'use strict';

  // =========================
  //  Inject CSS (sekali saja)
  // =========================
  function injectStyles() {
    if (document.getElementById('fancy-date-picker-style')) return;

    var css = ''
      + '.sdp-popup{position:absolute;z-index:9999;background:#FFFFFF;'
      + 'border-radius:8px;border:1px solid rgba(226,232,240,0.95);'
      + 'box-shadow:0 18px 40px -24px rgba(15,23,42,0.20),0 0 0 1px rgba(148,163,184,0.15);'
      + 'width:328px;display:inline-flex;flex-direction:column;align-items:flex-start;'
      + 'opacity:0;transform:translateY(-4px);pointer-events:none;'
      + 'transition:opacity 0.14s ease-out,transform 0.14s ease-out;}\n'
      + '.sdp-popup.sdp-open{opacity:1;transform:translateY(0);pointer-events:auto;}\n'
      + '.sdp-popup *{box-sizing:border-box;font-family:Mulish,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;}\n'

      // main body
      + '.sdp-main{align-self:stretch;overflow:hidden;display:flex;flex-direction:column;align-items:center;}\n'
      + '.sdp-main-inner{align-self:stretch;padding:12px;display:flex;flex-direction:column;gap:8px;}\n'
      + '.sdp-stack{align-self:stretch;display:flex;flex-direction:column;gap:8px;}\n'

      // header nav (bulan)
      + '.sdp-nav-row{width:280px;margin:0 auto;display:inline-flex;justify-content:space-between;align-items:center;}\n'
      + '.sdp-nav-btn{padding:6px;border-radius:6px;border:none;background:transparent;'
      + 'display:flex;align-items:center;justify-content:center;cursor:pointer;}\n'
      + '.sdp-nav-btn:hover{background:#EFF1F5;}\n'
      + '.sdp-month-label{text-align:center;color:#404968;font-size:16px;font-weight:600;line-height:24px;}\n'
      + '.sdp-nav-icon svg{display:block;}\n'

      // selected date box
      + '.sdp-selected-row{align-self:stretch;display:inline-flex;justify-content:flex-start;align-items:flex-start;gap:8px;}\n'
      + '.sdp-selected-box{flex:1 1 0;display:inline-flex;flex-direction:column;gap:4px;}\n'
      + '.sdp-selected-inner{align-self:stretch;padding:6px 10px;background:#FFFFFF;'
      + 'box-shadow:0 1px 2px rgba(16,24,40,0.05);border-radius:8px;outline:1px #B9C0D4 solid;outline-offset:-1px;'
      + 'display:flex;align-items:center;justify-content:center;gap:6px;}\n'
      + '.sdp-selected-text{flex:1 1 0;text-align:center;color:#30374F;font-size:16px;font-weight:400;line-height:22px;'
      + 'border:none;background:transparent;outline:none;padding:0;}\n'
      + '.sdp-selected-text.sdp-error{color:#B42318;}\n'

      // calendar area
      + '.sdp-calendar-area{align-self:stretch;display:flex;flex-direction:column;gap:2px;}\n'
      + '.sdp-weeks{display: flex;flex-direction: column;}\n'
      + '.sdp-weekdays,.sdp-week{align-self:stretch;display:inline-flex;justify-content:center;align-items:flex-start;}\n'
      + '.sdp-weekday,.sdp-day{width:40px;height:40px;position:relative;border-radius:20px;flex-shrink:0;}\n'
      + '.sdp-weekday span,.sdp-day span{position:absolute;left:8px;top:10px;width:24px;text-align:center;'
      + 'font-size:14px;line-height:20px;}\n'
      + '.sdp-weekday span{color:#404968;font-weight:600;}\n'
      + '.sdp-day span{color:#404968;font-weight:400;}\n'

      // outside month & unavailable
      + '.sdp-day--outside span{color:#7D89AF;}\n'
      + '.sdp-day--unavailable span{color:#5D6B98;}\n'

      // today
      + '.sdp-day--today{background:#EFF1F5;}\n'
      + '.sdp-day--today span{color:#404968;font-weight:600;}\n'

      // selected
      + '.sdp-day--selected{background:#404968;}\n'
      + '.sdp-day--selected span{color:#FFFFFF;font-weight:600;}\n'

      // klik behavior
      + '.sdp-day--disabled{cursor:default;}\n'
      + '.sdp-day--selectable{cursor:pointer;}\n'
      + '.sdp-day--selectable:hover:not(.sdp-day--disabled):not(.sdp-day--selected){background:#EFF1F5;}\n'

      // footer apply
      + '.sdp-footer{align-self:stretch;padding:10px;border-top:1px #EAECF0 solid;'
      + 'display:flex;flex-direction:column;gap:8px;}\n'
      + '.sdp-footer-row{align-self:stretch;display:inline-flex;justify-content:flex-start;gap:8px;}\n'
      + '.sdp-btn-apply{flex:1 1 0;padding:8px 12px;background:linear-gradient(10deg,#8E24AA 0%,#FF6E40 100%);'
      + 'box-shadow:0 1px 2px rgba(16,24,40,0.05);border-radius:6px;outline:1px #8E24AA solid;outline-offset:-1px;'
      + 'border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;}\n'
      + '.sdp-btn-apply span{color:#FFFFFF;font-size:14px;font-weight:600;line-height:20px;}\n'
      + '.sdp-btn-apply.sdp-disabled{opacity:0.5;cursor:default;}\n';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'fancy-date-picker-style';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(style);
  }

  // =========================
  //  Utils tanggal
  // =========================
  function normalizeDate(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // Parse dari tampilan/input: YYYY-MM-DD
  function parseDisplayDate(str) {
    if (!str) return null;
    var m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!m) return null;

    var y = parseInt(m[1], 10);
    var mo = parseInt(m[2], 10);
    var d = parseInt(m[3], 10);
    if (isNaN(y) || isNaN(mo) || isNaN(d)) return null;

    var dt = new Date(y, mo - 1, d);
    if (isNaN(dt.getTime())) return null;

    return normalizeDate(dt);
  }

  // Parse untuk options (bisa Date atau string)
  function parseOptionDate(value) {
    if (!value) return null;
    if (Object.prototype.toString.call(value) === '[object Date]') {
      return normalizeDate(value);
    }
    if (typeof value === 'string') {
      // coba format tampilan (YYYY-MM-DD)
      var dFromDisplay = parseDisplayDate(value);
      if (dFromDisplay) return dFromDisplay;

      // fallback ke Date.parse kalau memungkinkan
      var d = new Date(value);
      if (!isNaN(d.getTime())) {
        return normalizeDate(d);
      }
    }
    return null;
  }

  function sameDate(a, b) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function isBefore(a, b) {
    return a.getTime() < b.getTime();
  }

  function isAfter(a, b) {
    return a.getTime() > b.getTime();
  }

  function inRange(date, start, end) {
    return !isBefore(date, start) && !isAfter(date, end);
  }

  // Format ke tampilan & input: YYYY-MM-DD
  function formatDisplay(date) {
    if (!date) return '';
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;   // contoh: 2025-12-09
  }

  function normalizeRanges(ranges) {
    var out = [];
    if (!ranges) return out;
    for (var i = 0; i < ranges.length; i++) {
      var r = ranges[i];
      var start = null, end = null;
      if (Array.isArray && Array.isArray(r)) {
        start = parseOptionDate(r[0]) || parseDisplayDate(r[0]);
        end = parseOptionDate(r[1]) || parseDisplayDate(r[1]);
      } else if (r && typeof r === 'object') {
        start = parseOptionDate(r.start || r.from) || parseDisplayDate(r.start || r.from);
        end = parseOptionDate(r.end || r.to) || parseDisplayDate(r.end || r.to);
      }
      if (start && end) {
        start = normalizeDate(start);
        end = normalizeDate(end);
        if (isAfter(start, end)) {
          var tmp = start; start = end; end = tmp;
        }
        out.push({ start: start, end: end });
      }
    }
    return out;
  }

  // TODAY global (sekali saja)
  var TODAY = normalizeDate(new Date());

  var MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  var WEEKDAY_NAMES = ['Mo','Tu','We','Th','Fr','Sat','Su']; // start Monday

  var defaults = {
    selectedDate: null,     // Date atau string (YYYY-MM-DD)
    minDate: null,          // Date atau string (YYYY-MM-DD)
    maxDate: null,          // Date atau string (YYYY-MM-DD)
    disabledRanges: [],     // [{start,end}] atau [['2025-01-01','2025-01-10'], ...]
    autoApply: false,       // klik tanggal langsung commit & close
    closeOnScroll: false,   // kalau true, scroll menutup popup
    onChange: function (dateObj, formattedText) { } // dipanggil saat Apply/autoApply
  };

  // =========================
  //  Helper: throttle + rAF
  // =========================
  function throttle(fn, wait) {
    var last = 0, timer = null;
    return function () {
      var now = Date.now();
      var remaining = wait - (now - last);
      var ctx = this, args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        last = now;
        fn.apply(ctx, args);
      } else if (!timer) {
        timer = setTimeout(function () {
          last = Date.now();
          timer = null;
          fn.apply(ctx, args);
        }, remaining);
      }
    };
  }

  function rAF(fn) {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(fn);
    } else {
      setTimeout(fn, 16);
    }
  }

  // =========================
  //  Instance per input
  // =========================
  function createInstance($input, opts) {
    var options = $.extend({}, defaults, opts || {});

    var initialVal = $input.val();
    var committed = null;

    if (options.selectedDate) {
      committed = parseOptionDate(options.selectedDate) || parseDisplayDate(options.selectedDate);
    } else if (initialVal) {
      committed = parseDisplayDate(initialVal) || parseOptionDate(initialVal);
    }

    var minDate = options.minDate
      ? (parseOptionDate(options.minDate) || parseDisplayDate(options.minDate))
      : null;
    var maxDate = options.maxDate
      ? (parseOptionDate(options.maxDate) || parseDisplayDate(options.maxDate))
      : null;

    if (minDate && maxDate && isAfter(minDate, maxDate)) {
      var tmpSwap = minDate; minDate = maxDate; maxDate = tmpSwap;
    }

    if (committed && minDate && isBefore(committed, minDate)) committed = null;
    if (committed && maxDate && isAfter(committed, maxDate)) committed = null;

    var disabledRanges = normalizeRanges(options.disabledRanges || []);

    var base = committed || minDate || TODAY;

    var state = {
      pending: committed ? normalizeDate(committed) : null,     // yang lagi dipilih di calendar
      committed: committed ? normalizeDate(committed) : null,   // yang sudah di-Apply / di input
      minDate: minDate ? normalizeDate(minDate) : null,
      maxDate: maxDate ? normalizeDate(maxDate) : null,
      disabledRanges: disabledRanges,
      year: base.getFullYear(),
      month: base.getMonth()
    };

    var instanceId = 'sdp' + Math.random().toString(36).slice(2, 10);
    var popupId = 'sdp-' + instanceId;

    // Bikin popup HTML
    var popupHtml =
      '<div class="sdp-popup" role="dialog" aria-modal="true" id="' + popupId + '" ' +
      'data-sdp-id="' + instanceId + '" style="display:none;">' +
      '  <div class="sdp-main">' +
      '    <div class="sdp-main-inner">' +
      '      <div class="sdp-stack">' +
      '        <div class="sdp-nav-row">' +
      '          <button type="button" class="sdp-nav-btn sdp-prev" aria-label="Previous month">' +
      '            <span class="sdp-nav-icon">' +
      '              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
      '                <path d="M12.5 15L7.5 10L12.5 5" stroke="#5D6B98" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>' +
      '              </svg>' +
      '            </span>' +
      '          </button>' +
      '          <div class="sdp-month-label"></div>' +
      '          <button type="button" class="sdp-nav-btn sdp-next" aria-label="Next month">' +
      '            <span class="sdp-nav-icon">' +
      '              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
      '                <path d="M7.5 15L12.5 10L7.5 5" stroke="#5D6B98" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>' +
      '              </svg>' +
      '            </span>' +
      '          </button>' +
      '        </div>' +
      '        <div class="sdp-selected-row">' +
      '          <div class="sdp-selected-box">' +
      '            <div class="sdp-selected-inner">' +
      '              <input type="text" class="sdp-selected-text" placeholder="YYYY-MM-DD" />' +
      '            </div>' +
      '          </div>' +
      '        </div>' +
      '        <div class="sdp-calendar-area">' +
      '          <div class="sdp-weekdays"></div>' +
      '          <div class="sdp-weeks"></div>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="sdp-footer">' +
      '    <div class="sdp-footer-row">' +
      '      <button type="button" class="sdp-btn-apply"><span>Apply</span></button>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    var $popup = $(popupHtml);
    $('body').append($popup);

    var $monthLabel = $popup.find('.sdp-month-label');
    var $weekdaysWrap = $popup.find('.sdp-weekdays');
    var $weeksWrap = $popup.find('.sdp-weeks');
    var $selectedInput = $popup.find('.sdp-selected-text');
    var $applyBtn = $popup.find('.sdp-btn-apply');

    // input jadi readonly & punya ARIA
    $input
      .attr('readonly', 'readonly')
      .attr('aria-haspopup', 'dialog')
      .attr('aria-expanded', 'false')
      .attr('aria-controls', popupId);

    function isDateUnavailable(date) {
      if (state.minDate && isBefore(date, state.minDate)) return true;
      if (state.maxDate && isAfter(date, state.maxDate)) return true;
      for (var i = 0; i < state.disabledRanges.length; i++) {
        var r = state.disabledRanges[i];
        if (inRange(date, r.start, r.end)) return true;
      }
      return false;
    }

    function updateSelectedDisplay() {
      var baseDate = state.pending || state.committed;
      if (baseDate) {
        var txt = formatDisplay(baseDate);
        $selectedInput.val(txt);
        $selectedInput.removeClass('sdp-error');
        $applyBtn.removeClass('sdp-disabled');
      } else {
        $selectedInput.val('');
        $selectedInput.attr('placeholder', 'YYYY-MM-DD');
        $applyBtn.addClass('sdp-disabled');
      }
    }

    function updateInputFromCommitted() {
      var txt = formatDisplay(state.committed);
      $input.val(txt);
      if (typeof options.onChange === 'function') {
        options.onChange(state.committed, txt);
      }
    }

    function render() {
      $weekdaysWrap.empty();
      $weeksWrap.empty();

      // label bulan
      $monthLabel.text(MONTH_NAMES[state.month] + ' ' + state.year);

      // row nama hari
      for (var w = 0; w < WEEKDAY_NAMES.length; w++) {
        var $wd = $('<div class="sdp-weekday"><span></span></div>');
        $wd.find('span').text(WEEKDAY_NAMES[w]);
        $weekdaysWrap.append($wd);
      }

      var firstDay = new Date(state.year, state.month, 1);
      var firstWeekday = (firstDay.getDay() + 6) % 7; // 0=Mon
      var daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
      var daysInPrevMonth = new Date(state.year, state.month, 0).getDate();
      var totalCells = 42; // 6 minggu

      var selectedBase = state.pending || state.committed;

      for (var i = 0; i < totalCells; i++) {
        var $week;
        if (i % 7 === 0) {
          $week = $('<div class="sdp-week"></div>');
          $weeksWrap.append($week);
        } else {
          $week = $weeksWrap.children('.sdp-week').last();
        }

        var cellIndex = i;
        var dayNumber, cellMonth, cellYear, isCurrentMonth;

        if (cellIndex < firstWeekday) {
          dayNumber = daysInPrevMonth - firstWeekday + 1 + cellIndex;
          cellMonth = state.month - 1;
          cellYear = state.year;
          if (cellMonth < 0) { cellMonth = 11; cellYear--; }
          isCurrentMonth = false;
        } else if (cellIndex >= firstWeekday + daysInMonth) {
          dayNumber = cellIndex - (firstWeekday + daysInMonth) + 1;
          cellMonth = state.month + 1;
          cellYear = state.year;
          if (cellMonth > 11) { cellMonth = 0; cellYear++; }
          isCurrentMonth = false;
        } else {
          dayNumber = cellIndex - firstWeekday + 1;
          cellMonth = state.month;
          cellYear = state.year;
          isCurrentMonth = true;
        }

        var cellDate = normalizeDate(new Date(cellYear, cellMonth, dayNumber));
        var $day = $('<div class="sdp-day"><span></span></div>');
        $day.find('span').text(dayNumber);

        if (!isCurrentMonth) {
          $day.addClass('sdp-day--outside sdp-day--disabled');
        } else {
          if (isDateUnavailable(cellDate)) {
            $day.addClass('sdp-day--unavailable sdp-day--disabled');
          } else {
            $day.addClass('sdp-day--selectable');
          }
        }

        if (sameDate(cellDate, TODAY)) {
          $day.addClass('sdp-day--today');
        }
        if (selectedBase && sameDate(cellDate, selectedBase)) {
          $day.addClass('sdp-day--selected');
        }

        var iso =
          cellYear + '-' +
          String(cellMonth + 1).padStart(2, '0') + '-' +
          String(dayNumber).padStart(2, '0');
        $day.attr('data-date', iso);

        $week.append($day);
      }
    }

    function positionPopup() {
      var offset = $input.offset();
      if (!offset) return;
      var inputHeight = $input.outerHeight();
      var scrollTop = $(window).scrollTop();
      var viewportHeight = $(window).height();
      var popupHeight = $popup.outerHeight();
      var topBelow = offset.top + inputHeight + 4;
      var topAbove = offset.top - popupHeight - 4;
      var top = topBelow;

      if (topBelow - scrollTop + popupHeight > viewportHeight && topAbove > scrollTop) {
        top = topAbove;
      }

      var left = offset.left;
      var popupWidth = $popup.outerWidth();
      var viewportWidth = $(window).width();
      if (left + popupWidth > viewportWidth) {
        left = offset.left + $input.outerWidth() - popupWidth;
        if (left < 0) left = 0;
      }

      $popup.css({ top: top, left: left });
    }

    function openPopup() {
      if ($popup.hasClass('sdp-open')) {
        positionPopup();
        return;
      }
      updateSelectedDisplay();
      render();
      $popup.show();
      positionPopup();
      rAF(function () {
        $popup.addClass('sdp-open');
      });
      $input.attr('aria-expanded', 'true');
    }

    function closePopup() {
      if (!$popup.hasClass('sdp-open')) return;
      $popup.removeClass('sdp-open');
      $input.attr('aria-expanded', 'false');
      setTimeout(function () {
        if (!$popup.hasClass('sdp-open')) {
          $popup.hide();
        }
      }, 160);
    }

    function parseDateAttr(str) {
      var p = str.split('-');
      return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    }

    function handleDayClick(date) {
      if (isDateUnavailable(date)) return;
      state.pending = normalizeDate(date);
      state.year = state.pending.getFullYear();
      state.month = state.pending.getMonth();
      updateSelectedDisplay();
      render();

      if (options.autoApply) {
        state.committed = state.pending;
        updateInputFromCommitted();
        closePopup();
      }
    }

    // parsing & apply input manual (YYYY-MM-DD)
    function applyManualInput() {
      var str = ($selectedInput.val() || '').trim();

      // kosong -> tidak ada pending baru, balik ke committed/pending lama
      if (!str) {
        state.pending = null;
        $selectedInput.removeClass('sdp-error');
        updateSelectedDisplay();
        render();
        return;
      }

      // coba parse: prioritas YYYY-MM-DD lalu fallback format lain yang valid
      var d = parseDisplayDate(str) || parseOptionDate(str);
      if (!d) {
        // format salah
        $selectedInput.addClass('sdp-error');
        return;
      }

      d = normalizeDate(d);

      // cek min, max, disabledRanges
      if (isDateUnavailable(d)) {
        $selectedInput.addClass('sdp-error');
        return;
      }

      $selectedInput.removeClass('sdp-error');

      // update state
      state.pending = d;
      state.year = d.getFullYear();
      state.month = d.getMonth();

      updateSelectedDisplay();
      render();
    }

    // Throttled reposition for scroll/resize
    var throttledReposition = throttle(function () {
      if ($popup.hasClass('sdp-open')) {
        positionPopup();
      }
    }, 50);

    // ============ Events ============

    // buka popup saat fokus/klik input utama
    $input.on('focus.' + instanceId + ' click.' + instanceId, function () {
      openPopup();
    });

    $input.on('keydown.' + instanceId, function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        closePopup();
      }
    });

    // input manual di selected box
    $selectedInput.on('blur.' + instanceId, function () {
      applyManualInput();
    });

    $selectedInput.on('keydown.' + instanceId, function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        applyManualInput();

        // kalau autoApply dan pending valid -> commit & close
        if (options.autoApply && state.pending) {
          state.committed = normalizeDate(state.pending);
          updateInputFromCommitted();
          closePopup();
        }
      }
    });

    // klik day di kalender
    $popup.on('click.' + instanceId, '.sdp-day--selectable', function () {
      var iso = $(this).attr('data-date');
      if (!iso) return;
      var d = parseDateAttr(iso);
      handleDayClick(d);
    });

    $popup.on('click.' + instanceId, '.sdp-prev', function () {
      state.month--;
      if (state.month < 0) {
        state.month = 11;
        state.year--;
      }
      render();
    });

    $popup.on('click.' + instanceId, '.sdp-next', function () {
      state.month++;
      if (state.month > 11) {
        state.month = 0;
        state.year++;
      }
      render();
    });

    $popup.on('click.' + instanceId, '.sdp-btn-apply', function () {
      if ($applyBtn.hasClass('sdp-disabled')) return;
      if (!state.pending && !state.committed) return;
      // Commit pending ke input (kalau ada), kalau tidak ada pending pakai committed
      if (state.pending) {
        state.committed = normalizeDate(state.pending);
      }
      updateInputFromCommitted();
      closePopup();
    });

    $(window).on('resize.' + instanceId + ' scroll.' + instanceId, function (e) {
      if (options.closeOnScroll && e.type === 'scroll' && $popup.hasClass('sdp-open')) {
        closePopup();
        return;
      }
      throttledReposition();
    });

    // klik di luar -> close
    $(document).on('mousedown.' + instanceId, function (e) {
      if (!$popup.hasClass('sdp-open')) return;
      if (
        $popup.is(e.target) || $popup.has(e.target).length ||
        $input.is(e.target) || $input.has(e.target).length
      ) {
        return;
      }
      closePopup();
    });

    // API publik
    var api = {
      getDate: function () {
        return state.committed ? new Date(state.committed.getTime()) : null;
      },
      setDate: function (value) {
        var d = value ? (parseOptionDate(value) || parseDisplayDate(value)) : null;
        if (!d) return;
        d = normalizeDate(d);
        if (isDateUnavailable(d)) return;
        state.committed = d;
        state.pending = d;
        state.year = d.getFullYear();
        state.month = d.getMonth();
        updateInputFromCommitted();
        if ($popup.hasClass('sdp-open')) {
          updateSelectedDisplay();
          render();
        }
      },
      open: function () { openPopup(); },
      close: function () { closePopup(); },
      destroy: function () {
        $input.off('.' + instanceId);
        $selectedInput.off('.' + instanceId);
        $(window).off('.' + instanceId);
        $(document).off('.' + instanceId);
        $popup.remove();
        $input.removeData('simpleDatePicker');
      }
    };

    $input.data('simpleDatePicker', api);

    // init tampilan awal
    if (state.committed) {
      updateInputFromCommitted();
    }
    updateSelectedDisplay();
    render();
  }

  // =========================
  //  jQuery plugin
  // =========================
  $.fn.simpleDatePicker = function (options) {
    injectStyles();
    return this.each(function () {
      createInstance($(this), options);
    });
  };

})(jQuery);
