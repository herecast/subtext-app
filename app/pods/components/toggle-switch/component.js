import Component from '@ember/component';
import { computed, set, getWithDefault, get } from '@ember/object';

export default Component.extend({
  classNames: ['ToggleSwitch'],
  classNameBindings: [
    'reverse:ToggleSwitch--reverse',
    'colorClass'
  ],

  onText: 'On',
  offText: 'Off',
  active: false,
  onChange(){},

  reverse: false, // label after switch instead of before it
  color: 'default', // primary, success, danger

  colorClass: computed('color', function() {
    const color = getWithDefault(this, 'color', 'default');
    return `ToggleSwitch--${color}`;
  }),

  actions: {
    toggle() {
      const active = !(get(this, 'active'));
      set(this, 'active', active);
      this.onChange(active);
    }
  }

});
