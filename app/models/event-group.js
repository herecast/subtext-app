import Ember from 'ember';

export default Ember.Object.extend({
  groupHeadCount: 8,
  value: null,
  displayValue: null,
  items: [],
  tailHidden: true,
  hasTailItems: Ember.computed.gt('tailItems.length', 0),
  hasHiddenTailItems: Ember.computed.and('hasTailItems', 'tailHidden'),

  headItems: function() {
    return this.get('items').slice(0, this.get('groupHeadCount'));
  }.property('items.[]'),

  tailItems: function() {
    return this.get('items').slice(this.get('groupHeadCount') + 1, -1);
  }.property('items.[]')
});
