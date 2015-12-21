import Ember from 'ember';

const { computed, get, set } = Ember;

export default Ember.Component.extend({
  isFree: computed.equal('costType', 'free'),
  isPaid: computed.equal('costType', 'paid'),
  isDonation: computed.equal('costType', 'donation'),
  isNotApplicable: computed.equal('costType', ''),

  costPlaceholder: computed('costType', function() {
    if (get(this, 'isFree')) {
      return 'Add details if you’d like';
    } else if (get(this, 'isPaid')) {
      return 'Dollar figure, ex: $10, or $10-$25';
    } else if (get(this, 'isDonation')) {
      return 'Add details if you’d like';
    } else if (get(this, 'isNotApplicable')) {
      return 'Ex: public events where no event price should be displayed';
    }
  }),

  actions: {
    setCostType(type) {
      set(this, 'costType', type);
    }
  }
});
