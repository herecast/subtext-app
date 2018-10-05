import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, run, computed, getWithDefault } = Ember;

export default Ember.Component.extend(TestSelector, {
  tagName: 'span',
  classNames: ['SearchInput'],
  classNameBindings: [
    'noBorder:SearchInput-noBorder',
    'colorClass',
    'sizeClass'
  ],
  debounceWait: 900,
  value: null,
  placeholder: 'Search ...',
  clearTooltip: 'Clear Search',
  showIcon: true,
  iconName: 'search',
  inputType: 'search',
  clearButtonText: null,
  showClearButton: true,
  selectAllOnFocus: false,

  noBorder: false,

  color: 'default', // default, black, neutral, primary, danger
  size: 'medium', // 'small', 'medium', 'large'

  colorClass: computed('color', function() {
    const color = getWithDefault(this, 'color', 'default');
    return `SearchInput--${color}`;
  }),

  sizeClass: computed('size', function() {
    const size = getWithDefault(this, 'size', 'medium');
    return `SearchInput--${size}`;
  }),

  keyUp: function(e) {
    const esc = 27;
    const enter = 13;

    if(e.which === esc) {
      this._updateAction("");
    } else if(e.which === enter) {
      // unfocus so the mobile keyboard will hide.
      Ember.$(e.target).blur();
    }
  },

  _updateAction(value) {
    const update = get(this, 'update');
    if (update) {
      update(value);
    }
  },

  actions: {
    update(val) {
      if (val === "") {
        const clearSearchType = get(this, 'clearSearchType');
        if (clearSearchType) {
          clearSearchType();
        }
      }
      const debounceWait = get(this, 'debounceWait');
      run.debounce(this, this._updateAction, val,  debounceWait);
    },

    onfocus() {
      if (get(this, 'selectAllOnFocus')) {
        this.$('input').select();
      }

      if (get(this, 'onfocus')) {
        get(this, 'onfocus')();
      }
    },

    onblur() {
      if (get(this, 'onblur')) {
        get(this, 'onblur')();
      }
    }
  }
});
