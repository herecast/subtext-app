import Component from '@ember/component';
import { empty, equal } from '@ember/object/computed';
import { set, get, computed } from '@ember/object';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default Component.extend(TestSelector, {
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
