# Fancy Floating Single Date Picker (jQuery)

A lightweight floating date picker supporting:

- Single date (not range)
- minDate / maxDate
- Disabled ranges
- Manual input inside the popup (YYYY-MM-DD)
- Auto-apply & auto-close
- Popup reposition (on scroll/resize)

Date format used: `YYYY-MM-DD`  
Example: `2025-12-09`


## Quick Demo

    <input type="text" id="my-date" placeholder="Select a date" />
    
    <script>
      $('#my-date').simpleDatePicker({
        selectedDate: '2025-12-09',
        minDate: '2025-01-01',
        maxDate: '2025-12-31',
        disabledRanges: [
          ['2025-02-10', '2025-02-20'],
          { start: '2025-05-01', end: '2025-05-05' }
        ],
        autoApply: false,
        closeOnScroll: true,
        onChange: function (dateObj, formattedStr) {
          console.log('Selected:', dateObj, formattedStr);
        }
      });
    </script>


## Installation

1. Include jQuery (1.8+ should be fine, but 3.x is recommended):

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

2. Include the plugin JS (this file):

    <script src="js/simple-date-picker.js"></script>

No separate CSS file needed — CSS is auto-injected by the plugin (`injectStyles()`).


## Usage

### Basic initialization

    <input type="text" id="my-date" />
    
    <script>
      $('#my-date').simpleDatePicker();
    </script>

### With options

    $('#my-date').simpleDatePicker({
      selectedDate: '2025-12-09',     // preselected
      minDate: '2025-01-01',          // cannot pick before this date
      maxDate: '2025-12-31',          // cannot pick after this date
      disabledRanges: [
        ['2025-03-01', '2025-03-10'], // array format [start, end]
        { start: '2025-03-15', end: '2025-03-20' } // object format
      ],
      autoApply: false,               // if true: clicking a date auto-commits & closes popup
      closeOnScroll: false,           // if true: window scroll closes the popup
      onChange: function (dateObj, formattedStr) {
        // dateObj: normalized JavaScript Date
        // formattedStr: "YYYY-MM-DD"
        console.log('Date changed to:', formattedStr);
      }
    });


## Manual Input Feature (Editable Selected Text)

At the top of the popup, there is an input:

    <input type="text" class="sdp-selected-text" placeholder="YYYY-MM-DD" />

Behavior:

- Can be typed manually (example: `2025-06-17`).
- On blur or Enter:
  - Plugin tries to parse:
    - Prioritizes `YYYY-MM-DD`
    - If fails, attempts `new Date(value)` (via `parseOptionDate`)
  - Also validated against:
    - `minDate` / `maxDate`
    - `disabledRanges`
- If invalid / out of bounds:
  - Input gets `.sdp-error` (red highlight)
  - `state.pending` not updated
- If valid:
  - `state.pending` updated
  - Calendar jumps to the selected month
  - The date is highlighted

If `autoApply: true` and Enter is pressed with a valid date:

- `state.committed` updated
- The main input (the one `.simpleDatePicker()` was called on) is updated
- Popup closes automatically


## Options

All options are optional.

### selectedDate

- Type: `Date` or `string`
- Recommended format: `YYYY-MM-DD`
- Initial committed date.

Example:

    selectedDate: new Date(2025, 11, 9)   // Dec 9, 2025 (month is 0-based)
    selectedDate: '2025-12-09'


### minDate

- Type: `Date` or `string`
- Minimum selectable date.

    minDate: '2025-01-01'


### maxDate

- Type: `Date` or `string`
- Maximum selectable date.

    maxDate: '2025-12-31'

If `minDate > maxDate`, the plugin swaps them automatically.


### disabledRanges

- Type:
  - Array of arrays: `[['YYYY-MM-DD','YYYY-MM-DD'], ...]`
  - or array of objects: `{start, end}` / `{from, to}`

Example:

    disabledRanges: [
      ['2025-02-01', '2025-02-05'],
      { start: '2025-03-10', end: '2025-03-12' },
      { from: '2025-04-01', to: '2025-04-03' }
    ]

Dates inside these ranges:

- are still displayed,
- but marked as unavailable and cannot be clicked.


### autoApply

- Type: `boolean`
- Default: `false`

If `true`:

- Clicking a date:
  - `pending` → `committed`
  - Updates main input
  - Closes popup
- Manual input + Enter (valid):
  - Same behavior: commit + close.


### closeOnScroll

- Type: `boolean`
- Default: `false`

If `true`:

- When window scrolls and popup is open:
  - Popup closes immediately.

If `false`:

- Scroll only triggers popup reposition.


### onChange(dateObj, formattedStr)

Callback when date is committed.

- `dateObj`: normalized JavaScript Date
- `formattedStr`: `"YYYY-MM-DD"`

Example:

    onChange: function (dateObj, formatted) {
      console.log('Final date:', formatted);
      console.log('JS Date:', dateObj);
    }


## Public API

Every element using `.simpleDatePicker()` stores its API here:

    var api = $('#my-date').data('simpleDatePicker');

### getDate()

Returns the committed date.

    var api = $('#my-date').data('simpleDatePicker');
    var d = api.getDate(); // Date or null


### setDate(value)

Set date programmatically.

- `value`: `Date` or `string` (YYYY-MM-DD or parseable)
- Validated against:
  - `minDate`
  - `maxDate`
  - `disabledRanges`
- If invalid, ignored.

    var api = $('#my-date').data('simpleDatePicker');
    api.setDate('2025-10-10');


### open()

Open the popup manually.

    api.open();


### close()

Close the popup manually.

    api.close();


### destroy()

Remove all events & delete popup.

    api.destroy();

Does:

- `.off()` all events on input, window, document, etc.
- Removes popup DOM
- Removes `simpleDatePicker` data from input


## Behavior & UX

- Main input becomes `readonly`:
  - Date is selected via popup / manual selected-text box
- Popup positioning:
  - Below the input if enough space
  - Above if not enough space below
- If popup extends past the right boundary:
  - Adjusted to fit within viewport
- Clicking outside input/popup:
  - Closes popup
- Esc key:
  - Closes popup


## Styling

Primary classes you may override:

- `.sdp-popup`
- `.sdp-day--today`
- `.sdp-day--selected`
- `.sdp-day--outside`
- `.sdp-day--unavailable`
- `.sdp-day--disabled`
- `.sdp-day--selectable`
- `.sdp-btn-apply`
- `.sdp-selected-text`
- `.sdp-selected-text.sdp-error` (red text for invalid manual input)

To override theme, include your own `<style>` after loading the script.


## Accessibility

- Main input includes:
  - `aria-haspopup="dialog"`
  - `aria-expanded="true|false"`
  - `aria-controls="[popup id]"`
- Popup uses:
  - `role="dialog"`
  - `aria-modal="true"`


## Notes / Limitations

- This plugin focuses on:
  - Single date only, not date range
  - Basic `YYYY-MM-DD` format
- No built-in i18n (month & weekday names are English), but:
  - You can fork and replace `MONTH_NAMES` & `WEEKDAY_NAMES`.
