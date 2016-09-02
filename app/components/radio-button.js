import Ember from 'ember';

const { computed, get, set } = Ember;

export default Ember.Component.extend({
  tagName: 'label',
  classNameBindings: ['checked:active'],

  checked: computed('value', 'groupValue', function () {
    return get(this, 'value') === get(this, 'groupValue');
  }),

  _bindChangeEvent() {
    this.$('input').on('change', () => {
      set(this, 'groupValue', get(this, 'value'));

      if ('onChange' in this.attrs) {
        this.attrs.onChange(get(this, 'value'));
      }
    });
  },

  didInsertElement() {
    this._bindChangeEvent();
  },

  willDestroyElement() {
    this.$('input').off('change');
  }
});
