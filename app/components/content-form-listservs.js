import { setProperties } from '@ember/object';
import { sort } from '@ember/object/computed';
import { A } from '@ember/array';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'ul',

  listservs: A(),

  init() {
    this._super(...arguments);

    setProperties(this, {
      sortOrder: ['name']
    });
  },

  sortedListservs: sort('listservs', 'sortOrder')
});
