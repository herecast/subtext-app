import { set, get, computed } from '@ember/object';
import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'label',
  classNameBindings: ['checked:active'],

  checked: computed('value', 'groupValue', function () {
    return get(this, 'value') === get(this, 'groupValue');
  }),

  _bindChangeEvent() {
    $(this.element).find('input').on('change', () => {
      set(this, 'groupValue', get(this, 'value'));

      const onChange = get(this, 'onChange');
      if (onChange) {
        onChange(get(this, 'value'));
      }
    });
  },

  didInsertElement() {
    this._bindChangeEvent();
  },

  willDestroyElement() {
    $(this.element).find('input').off('change');
  }
});
