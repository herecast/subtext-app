import Component from '@ember/component';
import { set, computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',

  init() {
    this._super(...arguments);
    set(this, 'selectedIds', []);
  },

  click() {
    const input = this.$('input');
    const value = parseInt(input.val());

    if (input.is(':checked')) {
      this.get('selectedIds').pushObject(value);
    } else {
      this.get('selectedIds').removeObject(value);
    }
  },

  checked: computed('listserv', 'selectedIds.[]', function() {
    return this.get('selectedIds').indexOf(this.get('listserv.id')) > - 1;
  })
});
