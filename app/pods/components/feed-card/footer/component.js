import { computed, get } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'FeedCard-Footer',
  classNameBindings: ['noBorder:no-border', 'noPadding:no-padding'],

  model: null,

  contentId: null,
  cost: null,
  showCost: false,
  noBorder: false,
  noPadding: false,

  costFormatted: computed('cost', function() {
    const cost = get(this, 'cost');

    if (isBlank(cost)) {
      return 'Price: See Details';
    }

    return cost;
  })
});
