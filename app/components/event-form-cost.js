import Ember from 'ember';

export default Ember.Component.extend({
  isFree: Ember.computed.equal('costType', 'free'),
  isPaid: Ember.computed.equal('costType', 'paid'),
  isDonation: Ember.computed.equal('costType', 'donation'),
  isNotApplicable: Ember.computed.equal('costType', ''),

  costPlaceholder: function() {
    if (this.get('isFree')) {
      return 'Add details if you’d like';
    } else if (this.get('isPaid')) {
      return 'Dollar figure, ex: $10, or $10-$25';
    } else if (this.get('isDonation')) {
      return 'Add details if you’d like';
    } else if (this.get('isNotApplicable')) {
      return 'For public events where cost is not relevant';
    }
  }.property('costType'),

  actions: {
    setCostType(type) {
      this.set('costType', type);
    }
  }
});
