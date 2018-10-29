import { setProperties } from '@ember/object';
import { sort } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'ul',

  init() {
    this._super(...arguments);
    
    setProperties(this, {
      listservs: [],
      sortOrder: ['name']
    });
  },

  sortedListservs: sort('listservs', 'sortOrder')
});
