import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isBlank } from '@ember/utils';

export default Component.extend({
  classNames: 'FeedCard-Footer',
  classNameBindings: ['noBorder:no-border', 'noPadding:no-padding'],


  locationTagName: null,

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
  }),

  hasSource: notEmpty('locationTagName')
});
