import { computed, set, get } from '@ember/object';
import { isPresent, isEmpty } from '@ember/utils';
import moment from 'moment';
import isMobile from 'npm:ismobilejs';
import $ from 'jquery';
import Component from '@ember/component';

//const pickerFormat = 'h : mm A';
const pickerFormat = 'LT';
const nativeFormat = 'HH:mm';

export default Component.extend({
  inputClass: 'form-control',

  /** format
   * The format expected in the parent context
   */
  format: null,

  _isNative: true,

  defaultMinTime: null,
  hasBeenFocused: false,

  needsDefaultTimeSet: computed('defaultMinTime', 'hasBeenFocused', function() {
    return isPresent(get(this, 'defaultMinTime')) && !get(this, 'hasBeenFocused');
  }),

  overrideNative() {
    return !isMobile.any; // Any desktop browser
  },

  didInsertElement() {
    this._super(...arguments);
    /**
     * Detect if [type=time] is supported.
     * If not, use a datepicker widget
     */

    const $inp = $(this.element).find('input');

    if(this.overrideNative()) {
      $inp.prop('type', 'text'); //for override
    }

    if($inp.prop('type') !== 'time') {
      set(this, '_isNative', false);

      let options = {
        format: pickerFormat,
        showClear: true,
        showClose: true,
        useCurrent: 'day'
      };

      $inp.datetimepicker(options);

      $inp.on('dp.change', (e) => {
        const defaultMinTime = get(this, 'defaultMinTime');
        const defaultMinMoment = moment(defaultMinTime, 'HH:mm a');

        if ( isEmpty(e.oldDate) && isPresent(defaultMinTime) ) {
          const todayAtDefaultTimePlus = defaultMinMoment.add(1, 'h');
          $inp.data("DateTimePicker").viewDate(todayAtDefaultTimePlus);
          $inp.data("DateTimePicker").date(todayAtDefaultTimePlus);

          this.doUpdate(todayAtDefaultTimePlus);

        } else if (isPresent(defaultMinTime) && e.date.isBefore(defaultMinMoment)) {
          $inp.data("DateTimePicker").viewDate(defaultMinMoment);
          $inp.data("DateTimePicker").date(defaultMinMoment);

          this.doUpdate(defaultMinMoment);
        } else {
          this.doUpdate(e.date);
        }
      });
    }
  },

  /**
   * Parse the value coming from the attributes
   */
  parseValue(value) {
    let format = get(this, 'format') || nativeFormat;

    return moment(value, format, true);
  },

  /**
   * Parse the value coming from the input
   */
  parseUpdate(value) {
    if(get(this, '_isNative')) {
      return moment(value, nativeFormat, true);
    } else {
      // already a moment object
      return value;
    }
  },

  /**")
   * Format the value the way the parent context
   * expects.
   */
  formatUpdate(mmTime) {
    let format = get(this, 'format') || nativeFormat;

    return mmTime.format(format);
  },

  /**
   * Format the value passed to the input, the way it expects.
   */
  formatValue(mmTime) {
    if(get(this, '_isNative')) {
      return mmTime.format(nativeFormat);
    } else {
      return mmTime.format(pickerFormat);
    }
  },

  formattedValue: computed('value', function() {
    const value = get(this, 'value');

    if (isPresent(value)) {
      const tm = this.parseValue(value);
      if (tm.isValid()) {
        return this.formatValue(tm);
      }
    }

    return null;
  }),

  // Would be in the actions hash, except running into issues
  // with binding of (this) from the dp.update event
  doUpdate(value) {
    if(!value || isEmpty(value)) {
      if (get(this, 'update')) {
        get(this, 'update')(null);
      }
    } else {
      const time = this.parseUpdate(value);

      if(time.isValid()) {
        if (get(this, 'update')) {
          get(this, 'update')(this.formatUpdate(time));
        }
      }
    }
  }
});
