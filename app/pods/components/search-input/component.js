import $ from 'jquery';
import { run } from '@ember/runloop';
import { getWithDefault, computed, get } from '@ember/object';
import TestSelector from 'subtext-app/mixins/components/test-selector';
import Component from '@ember/component';

export default Component.extend(TestSelector, {
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
      $(e.target).blur();
    }
  },

  _updateAction(value) {
    const update = get(this, 'update');
    if (update) {
      update(value);
    }
  },

  focusIn() {
    if (get(this, 'selectAllOnFocus')) {
      $(this.element).find('input').select();
    }

    if (get(this, 'onfocus')) {
      get(this, 'onfocus')();
    }
  },

  actions: {
    update(val) {
      const clearSearchType = get(this, 'clearSearchType');
      if (val === "" && clearSearchType) {
        clearSearchType();
      } else {
        const debounceWait = get(this, 'debounceWait');
        run.debounce(this, this._updateAction, val,  debounceWait);
      }
    },

    onblur() {
      if (get(this, 'onblur')) {
        get(this, 'onblur')();
      }
    }
  }
});
