import Ember from 'ember';
import moment from 'moment';
import isMobile from 'npm:ismobilejs';

const {
  get,
  set,
  computed,
  isEmpty,
  isPresent,
  run
} = Ember;

const pickerFormat = 'MM/DD/YYYY';
const nativeFormat = 'YYYY-MM-DD';

export default Ember.Component.extend({
  inputClass: 'form-control',

  /** format
   * The format expected in the parent context
   */
  format: null,

  _isNative: true,

  overrideNative() {
    return !isMobile.any; // Any desktop browser
  },

  didInsertElement() {
    this._super(...arguments);

    /**
     * Detect if [type=time] is supported.
     * If not, use a datepicker widget
     */
    const $inp = this.$('input');

    if(this.overrideNative()) {
      $inp.prop('type', 'text'); //for override
    }

    if($inp.prop('type') !== 'date') {
      set(this, '_isNative', false);

      run.next(()=>{
        $inp.datetimepicker({
          format: pickerFormat,
          showClear: true
        }).on('dp.change', (e) => {
          this.doUpdate(e.date);
        });
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

  formattedValue: computed('value', '_isNative', function() {
    const value = get(this, 'value');

    if(isPresent(value)) {
      const tm = this.parseValue(value);
      if(tm.isValid()) {
        return this.formatValue(tm);
      }
    }

    return null;
  }),

  // Would be in the actions hash, except running into issues
  // with binding of (this) from the dp.update event
  doUpdate(value) {
    if(!value || isEmpty(value)) {
      this.attrs.update(null);
    } else {
      const time = this.parseUpdate(value);

      if(time.isValid()) {
        this.attrs.update(
          this.formatUpdate(time)
        );
      }
    }
  }
});
