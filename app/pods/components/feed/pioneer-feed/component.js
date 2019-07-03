import { get, set, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Feed-PioneerFeed'],
  'data-test-component': 'pioneer-feed',

  modals: service(),
  userLocationService: service('user-location'),
  userLocation: readOnly('userLocationService.userLocation'),

  feedItems: null,
  gridExpanded: false,

  _maxSliderItems: 4,

  yourTown: computed('userLocation.city', function() {
    let yourTown = 'Your Town';

    if (get(this, 'userLocation.city')) {
      yourTown = get(this, 'userLocation.city');
    }

    return htmlSafe(yourTown);
  }),

  feedItemsForSlider: computed('feedItems.[]', function() {
    const feedItems = get(this, 'feedItems') || [];
    const maxSliderItems = get(this, '_maxSliderItems');
    let contentItems = feedItems.filterBy('modelType', 'content');

    if (contentItems.length > maxSliderItems) {
      contentItems.slice(0, maxSliderItems);
    }

    return contentItems;
  }),

  actions: {
    expandGrid() {
      set(this, 'gridExpanded', true);
    },

    signupByEmail() {
      get(this, 'modals').showModal('modals/sign-in-register', 'register');
    }
  }
});
