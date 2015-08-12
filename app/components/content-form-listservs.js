import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  listservs: [],

  sortOrder: ['name'],
  sortedListservs: Ember.computed.sort('listservs', 'sortOrder')
});
