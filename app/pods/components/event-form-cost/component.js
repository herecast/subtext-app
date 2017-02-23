import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { computed, get, set } = Ember;
const { equal, empty } = computed;

export default Ember.Component.extend(TestSelector, {
  isFree:          equal('costType', 'free'),
  isPaid:          equal('costType', 'paid'),
  isDonation:      equal('costType', 'donation'),
  isNotApplicable: empty('costType'),

  costPlaceholder: computed('costType', function() {
    if (get(this, 'isFree')) {
      return 'Add details if you’d like';
    } else if (get(this, 'isPaid')) {
      return 'Dollar figure, ex: $10, or $10-$25';
    } else if (get(this, 'isDonation')) {
      return 'Add details if you’d like';
    } else if (get(this, 'isNotApplicable')) {
      return '';
    }
  }),

  actions: {
    setCostType(type) {
      set(this, 'event.costType', type);
    }
  }
});
